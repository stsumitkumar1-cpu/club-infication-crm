import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, MembershipStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { EntitlementsService } from '../entitlements/entitlements.service.js';
import {
  daysForNights,
  LedgerType,
} from '../entitlements/entitlement.types.js';
import { customerScopeFilter } from '../common/scope/index.js';
import type { AuthUser } from '../common/types/index.js';
import {
  CreateBookingDto,
  QueryBookingsDto,
  UpdateBookingDto,
} from './dto/index.js';

const BOOKING_INCLUDE = {
  customer: { select: { id: true, name: true, phone: true } },
  membership: {
    select: {
      id: true,
      status: true,
      startDate: true,
      endDate: true,
      package: { select: { id: true, name: true } },
    },
  },
  entitlementLog: {
    select: { id: true, type: true, days: true, nights: true, date: true },
    orderBy: { createdAt: 'asc' as const },
  },
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private entitlements: EntitlementsService,
  ) {}

  private scopeFilter(user: AuthUser): Prisma.BookingWhereInput {
    const customerScope = customerScopeFilter(user);
    return Object.keys(customerScope).length === 0
      ? {}
      : { customer: customerScope };
  }

  /**
   * Formats a stay date the way it was stored.
   *
   * `startOfDay` normalises to LOCAL midnight, so toISOString() on the result
   * reports the previous day for any timezone behind UTC — which is why a stay
   * shown as "31 Aug → 02 Sept" in the table was described as
   * "2026-08-30 to 2026-09-01" in the ledger beside it. Reading the local parts
   * back keeps every rendering of a stay agreeing with every other.
   */
  private dateText(value: Date): string {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /** Midnight-normalised so a stay is counted in whole nights. */
  private startOfDay(value: Date): Date {
    const d = new Date(value);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Nights are the gap between the dates. The day figure beside them is the
   * calendar span of the stay (nights + 1), which is how the client quotes
   * plans ("3 Nights / 4 Days") — but only nights are charged to the balance.
   * See daysForNights for why days cannot be a budget.
   *
   * CLIENT_CLARIFICATION_REQUIRED (Spec 22 #4): min/max stay, advance notice,
   * blackout dates and the cancellation window are unconfirmed, so none are
   * enforced here beyond the arithmetic.
   */
  private derivedUsage(checkIn: Date, checkOut: Date) {
    const nights = Math.round(
      (this.startOfDay(checkOut).getTime() - this.startOfDay(checkIn).getTime()) /
        MS_PER_DAY,
    );
    return { nights, days: daysForNights(nights) };
  }

  async create(dto: CreateBookingDto, currentUser: AuthUser) {
    // Idempotency first: a retry must never consume entitlement twice.
    if (dto.idempotencyKey) {
      const existing = await this.prisma.booking.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
        include: BOOKING_INCLUDE,
      });
      if (existing) {
        return existing;
      }
    }

    const checkIn = this.startOfDay(dto.checkIn);
    const checkOut = this.startOfDay(dto.checkOut);
    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    const derived = this.derivedUsage(checkIn, checkOut);
    const nightsUsed = dto.nightsUsed ?? derived.nights;
    // Stored for display only, and always kept in step with the nights it is
    // derived from — never accepted from the caller, which is how the stored
    // span used to be able to contradict the dates.
    const daysUsed = daysForNights(nightsUsed);
    if (nightsUsed === 0) {
      throw new BadRequestException('A booking must consume at least one night');
    }

    // Scope is resolved through the customer (Spec 2.3).
    const customer = await this.prisma.customer.findFirst({
      where: { AND: [{ id: dto.customerId }, customerScopeFilter(currentUser)] },
      select: { id: true, name: true },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const membership = await this.prisma.membership.findFirst({
      where: { id: dto.membershipId, customerId: customer.id },
      include: { package: { select: { name: true } } },
    });
    if (!membership) {
      throw new BadRequestException(
        'That membership does not belong to this customer',
      );
    }
    if (membership.status !== MembershipStatus.ACTIVE) {
      throw new BadRequestException(
        `Cannot book against a ${membership.status.toLowerCase()} membership`,
      );
    }
    if (membership.endDate && checkOut > membership.endDate) {
      throw new BadRequestException(
        `The stay ends after the membership expires on ${this.dateText(membership.endDate)}`,
      );
    }
    if (checkIn < this.startOfDay(membership.startDate)) {
      throw new BadRequestException(
        'The stay starts before the membership begins',
      );
    }

    /*
     * Spec 8.2 — the booking transaction.
     *
     * The membership row is locked FOR UPDATE before the balance is read, so
     * two concurrent requests cannot both see the same remaining days and both
     * succeed. The second waits, then re-reads the balance the first left
     * behind and is rejected if it no longer fits.
     */
    return this.prisma.$transaction(async (tx) => {
      await this.entitlements.lockMembershipForUpdate(tx, membership.id);

      const balance = await this.entitlements.balanceFor(tx, {
        customerId: customer.id,
        membershipId: membership.id,
      });

      /*
       * One stay at a time: a customer cannot be in two places on the same
       * night. Without this, submitting the same booking twice was accepted
       * twice and spent the nights twice — two identical CONFIRMED stays for
       * 31 Aug to 2 Sept, and four nights gone from a two-night holiday.
       *
       * Half-open intervals, so back-to-back stays are fine: a stay that ends
       * on the 2nd does not clash with one that begins on the 2nd, which is the
       * same convention every hotel uses for a checkout day.
       *
       * Inside the transaction and after the FOR UPDATE lock on purpose. The
       * lock serialises every booking for this membership, so two concurrent
       * identical requests cannot both read "no clash" and both insert; a check
       * before the transaction would be a race, not a guard.
       */
      const clash = await tx.booking.findFirst({
        where: {
          customerId: customer.id,
          status: { not: BookingStatus.CANCELLED },
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn },
        },
        orderBy: { checkIn: 'asc' },
        select: { id: true, checkIn: true, checkOut: true, status: true },
      });
      if (clash) {
        throw new ConflictException(
          `${customer.name} already has a ${clash.status.toLowerCase()} stay from ` +
            `${this.dateText(clash.checkIn)} to ${this.dateText(clash.checkOut)}, ` +
            `which overlaps these dates. Cancel it first, or pick dates outside it.`,
        );
      }

      // Nights only. Charging the day-span as well would make a plan refuse
      // its own last booking as soon as the customer split their holiday.
      if (nightsUsed > balance.nights) {
        throw new ConflictException(
          `Not enough entitlement left: this stay needs ${nightsUsed} night(s), but only ${balance.nights} night(s) remain.`,
        );
      }

      const booking = await tx.booking.create({
        data: {
          customerId: customer.id,
          membershipId: membership.id,
          checkIn,
          checkOut,
          daysUsed,
          nightsUsed,
          status: BookingStatus.CONFIRMED,
          notes: dto.notes ?? null,
          idempotencyKey: dto.idempotencyKey ?? null,
        },
      });

      // The deduction is a ledger movement, never a decremented column.
      await this.entitlements.record(tx, {
        customerId: customer.id,
        membershipId: membership.id,
        bookingId: booking.id,
        type: LedgerType.BOOKING_USAGE,
        nights: -nightsUsed,
        description: `Booking ${this.dateText(checkIn)} to ${this.dateText(checkOut)}`,
        actorId: currentUser.sub,
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'CREATE',
        entity: 'Booking',
        entityId: booking.id,
        metadata: {
          customerId: customer.id,
          customerName: customer.name,
          membershipId: membership.id,
          packageName: membership.package?.name ?? null,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          daysUsed,
          nightsUsed,
          balance: {
            before: balance,
            after: {
              nights: balance.nights - nightsUsed,
              days: daysForNights(balance.nights - nightsUsed),
            },
          },
        },
      });

      return tx.booking.findUnique({
        where: { id: booking.id },
        include: BOOKING_INCLUDE,
      });
    });
  }

  async findAll(query: QueryBookingsDto, currentUser: AuthUser) {
    const {
      customerId,
      membershipId,
      status,
      from,
      to,
      page = 1,
      limit = 20,
    } = query;

    const filters: Prisma.BookingWhereInput[] = [this.scopeFilter(currentUser)];
    if (customerId) filters.push({ customerId });
    if (membershipId) filters.push({ membershipId });
    if (status) filters.push({ status: status as BookingStatus });
    if (from) filters.push({ checkIn: { gte: this.startOfDay(from) } });
    if (to) filters.push({ checkIn: { lte: this.startOfDay(to) } });

    const where: Prisma.BookingWhereInput = { AND: filters };

    const [data, total, used] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { checkIn: 'desc' },
        include: BOOKING_INCLUDE,
      }),
      this.prisma.booking.count({ where }),
      this.prisma.booking.aggregate({
        where: { AND: [...filters, { status: BookingStatus.CANCELLED }] },
        _count: true,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        cancelledCount: used._count,
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const booking = await this.prisma.booking.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
      include: BOOKING_INCLUDE,
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  /** Notes only — see UpdateBookingDto for why the dates are immutable. */
  async update(id: string, dto: UpdateBookingDto, currentUser: AuthUser) {
    const booking = await this.prisma.booking.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { notes: dto.notes ?? null },
        include: BOOKING_INCLUDE,
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'UPDATE',
        entity: 'Booking',
        entityId: id,
        metadata: {
          before: { notes: booking.notes },
          after: { notes: updated.notes },
        },
      });

      return updated;
    });
  }

  /**
   * Cancels a booking and returns exactly what it consumed, read back from the
   * ledger rather than from the booking's own columns — so the restoration can
   * never disagree with what was actually taken (Spec 7 CANCELLATION).
   */
  async cancel(id: string, currentUser: AuthUser) {
    const booking = await this.prisma.booking.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
      include: { customer: { select: { id: true, name: true } } },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new ConflictException('This booking is already cancelled');
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new ConflictException(
        'A completed stay cannot be cancelled — the days were used. A Super Admin can post an adjustment if a correction is needed.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      if (booking.membershipId) {
        await this.entitlements.lockMembershipForUpdate(
          tx,
          booking.membershipId,
        );
      }

      // What this booking actually moved, net of any earlier restoration.
      const moved = await tx.entitlementLedger.aggregate({
        where: { bookingId: id },
        _sum: { nights: true },
      });
      const restoreNights = -(moved._sum.nights ?? 0);

      const updated = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.CANCELLED },
        include: BOOKING_INCLUDE,
      });

      if (restoreNights !== 0) {
        await this.entitlements.record(tx, {
          customerId: booking.customerId,
          membershipId: booking.membershipId,
          bookingId: id,
          type: LedgerType.CANCELLATION,
          nights: restoreNights,
          description: `Booking cancelled — restored ${restoreNights} night(s)`,
          actorId: currentUser.sub,
        });
      }

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'CANCEL',
        entity: 'Booking',
        entityId: id,
        metadata: {
          customerId: booking.customerId,
          customerName: booking.customer.name,
          membershipId: booking.membershipId,
          restored: { nights: restoreNights },
          previousStatus: booking.status,
        },
      });

      return updated;
    });
  }

  /** Marks a stay as taken. Entitlement was already consumed at booking time. */
  async complete(id: string, currentUser: AuthUser) {
    const booking = await this.prisma.booking.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new ConflictException(
        'A cancelled booking cannot be completed — its entitlement was returned',
      );
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new ConflictException('This booking is already completed');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.COMPLETED },
        include: BOOKING_INCLUDE,
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'COMPLETE',
        entity: 'Booking',
        entityId: id,
        // No ledger movement: the nights were deducted when the booking was made.
        metadata: { previousStatus: booking.status, ledgerUnchanged: true },
      });

      return updated;
    });
  }

  /** Usage figures for the caller's scope (Spec 12: customer usage). */
  async getStats(currentUser: AuthUser) {
    const scope = this.scopeFilter(currentUser);
    const now = this.startOfDay(new Date());

    const countBy = (extra?: Prisma.BookingWhereInput) =>
      this.prisma.booking.count({
        where: { AND: extra ? [scope, extra] : [scope] },
      });

    const [total, confirmed, completed, cancelled, upcoming, consumed] =
      await Promise.all([
        countBy(),
        countBy({ status: BookingStatus.CONFIRMED }),
        countBy({ status: BookingStatus.COMPLETED }),
        countBy({ status: BookingStatus.CANCELLED }),
        countBy({
          status: BookingStatus.CONFIRMED,
          checkIn: { gte: now },
        }),
        this.prisma.booking.aggregate({
          where: {
            AND: [scope, { status: { not: BookingStatus.CANCELLED } }],
          },
          _sum: { daysUsed: true, nightsUsed: true },
        }),
      ]);

    return {
      total,
      confirmed,
      completed,
      cancelled,
      upcoming,
      daysUsed: consumed._sum.daysUsed ?? 0,
      nightsUsed: consumed._sum.nightsUsed ?? 0,
    };
  }
}
