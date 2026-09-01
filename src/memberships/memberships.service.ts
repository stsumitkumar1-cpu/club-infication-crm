import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerStatus, MembershipStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { EntitlementsService } from '../entitlements/entitlements.service.js';
import {
  customerScopeFilter,
  membershipScopeFilter,
} from '../common/scope/index.js';
import type { AuthUser } from '../common/types/index.js';
import {
  CreateMembershipDto,
  QueryMembershipsDto,
  UpdateMembershipDto,
} from './dto/index.js';

const MEMBERSHIP_INCLUDE = {
  package: {
    select: {
      id: true,
      name: true,
      price: true,
      days: true,
      nights: true,
      validityMonths: true,
    },
  },
  customer: {
    select: {
      id: true,
      name: true,
      phone: true,
      assignedExecId: true,
      assignedExec: { select: { id: true, name: true } },
    },
  },
  _count: { select: { bookings: true, entitlementLog: true } },
};

@Injectable()
export class MembershipsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private entitlements: EntitlementsService,
  ) {}

  /** Adds whole months without rolling a short month into the next one. */
  private addMonths(from: Date, months: number): Date {
    const end = new Date(from);
    const targetMonth = end.getMonth() + months;
    end.setMonth(targetMonth);
    // e.g. 31 Jan + 1 month would land on 2/3 March; clamp back to month end.
    if (end.getMonth() !== ((targetMonth % 12) + 12) % 12) {
      end.setDate(0);
    }
    return end;
  }

  /** Loads a membership already narrowed to the caller's scope, or throws 404. */
  private async findScopedOrFail(id: string, currentUser: AuthUser) {
    const membership = await this.prisma.membership.findFirst({
      where: { AND: [{ id }, membershipScopeFilter(currentUser)] },
    });
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    return membership;
  }

  async create(dto: CreateMembershipDto, currentUser: AuthUser) {
    // The customer must be reachable by this caller — that check is what stops
    // a membership being attached to another team's customer.
    const customer = await this.prisma.customer.findFirst({
      where: { AND: [{ id: dto.customerId }, customerScopeFilter(currentUser)] },
      select: {
        id: true,
        name: true,
        plan: true,
        validity: true,
        totalDays: true,
        totalNights: true,
      },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const pkg = await this.prisma.package.findUnique({
      where: { id: dto.packageId },
    });
    if (!pkg) {
      throw new NotFoundException('Plan not found');
    }
    if (!pkg.isActive) {
      throw new BadRequestException(
        `"${pkg.name}" is inactive and cannot be sold. Activate it under Plans first.`,
      );
    }

    /*
     * One active membership at a time.
     *
     * CLIENT_CLARIFICATION_REQUIRED (Spec 22 #11): whether a customer may hold
     * several concurrent memberships is unconfirmed. Rejecting is the
     * conservative reading — it neither invents an upgrade rule nor silently
     * mutates the existing membership. Cancel or expire the current one first.
     */
    const active = await this.prisma.membership.findFirst({
      where: { customerId: customer.id, status: MembershipStatus.ACTIVE },
      include: { package: { select: { name: true } } },
    });
    if (active) {
      throw new ConflictException(
        `${customer.name} already has an active membership${
          active.package ? ` (${active.package.name})` : ''
        }. Cancel or expire it before adding a new one.`,
      );
    }

    const startDate = dto.startDate ?? new Date();
    const endDate =
      dto.endDate ?? this.addMonths(startDate, pkg.validityMonths);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after the start date');
    }

    return this.prisma.$transaction((tx) =>
      this.recordSaleWithinTransaction(tx, {
        customerId: customer.id,
        packageId: pkg.id,
        startDate,
        endDate,
        actorId: currentUser.sub,
      }),
    );
  }

  /**
   * The writes behind recording a plan purchase, minus the transaction.
   *
   * Split out so customer intake can create a customer and their first
   * membership atomically. Before this existed the intake form set the
   * customer's plan columns from the catalogue but recorded no membership, so a
   * customer could read "Plan: Bronze, ₹50,000, 6 Months" while the system held
   * zero plan purchases, zero nights, and a payment attributed to no plan.
   * Spec 8.1 always described one transaction; this is the missing half of it.
   *
   * Callers own the validation their context needs — this method assumes the
   * package is sellable and the customer is in scope.
   */
  async recordSaleWithinTransaction(
    tx: Prisma.TransactionClient,
    params: {
      customerId: string;
      packageId: string;
      /** Defaults to now. */
      startDate?: Date;
      /** Defaults to startDate + the plan's validity, month-end clamped. */
      endDate?: Date;
      actorId: string;
    },
  ) {
    const pkg = await tx.package.findUniqueOrThrow({
      where: { id: params.packageId },
    });
    const customer = await tx.customer.findUniqueOrThrow({
      where: { id: params.customerId },
      select: {
        id: true,
        name: true,
        plan: true,
        validity: true,
        totalDays: true,
        totalNights: true,
      },
    });

    /*
     * Dates are derived here rather than by the caller, so addMonths' month-end
     * clamp applies everywhere. A naive setMonth(+6) on 31 August lands on
     * 31 February, which JavaScript rolls forward into March — a plan sold on
     * the last day of a month would quietly run a few days long.
     */
    const { actorId } = params;
    const startDate = params.startDate ?? new Date();
    const endDate =
      params.endDate ?? this.addMonths(startDate, pkg.validityMonths);
    const validityText =
      pkg.validityMonths % 12 === 0
        ? `${pkg.validityMonths / 12} ${pkg.validityMonths === 12 ? 'Year' : 'Years'}`
        : `${pkg.validityMonths} Months`;

    {
      const membership = await tx.membership.create({
        data: {
          customerId: customer.id,
          packageId: pkg.id,
          startDate,
          endDate,
          status: MembershipStatus.ACTIVE,
        },
        include: MEMBERSHIP_INCLUDE,
      });

      /*
       * Keep the customer's plan-describing columns in step with the plan they
       * actually hold, so "current active plan" stays visible on the customer
       * record (client PDF 5). Money columns are deliberately untouched: the
       * sale price is a commercial decision, not the package list price.
       */
      const customerUpdate = await tx.customer.update({
        where: { id: customer.id },
        data: {
          plan: pkg.name,
          validity: validityText,
          totalDays: pkg.days,
          totalNights: pkg.nights,
        },
        select: { plan: true, validity: true, totalDays: true, totalNights: true },
      });

      // A newly recorded plan is ACTIVE, so the customer is too.
      const customerStatus = await this.syncCustomerStatus(tx, customer.id);

      /*
       * Spec 8.1 step 4 / Spec 7 ALLOCATION: the plan's nights enter the ledger
       * here. This is what makes the balance a SUM of movements rather than a
       * counter, and it commits with the membership itself.
       *
       * The plan's day count is not allocated: it is the span of those nights
       * taken in one stay, not a second budget (see daysForNights).
       */
      const allocation = await this.entitlements.recordAllocation(tx, {
        customerId: customer.id,
        membershipId: membership.id,
        nights: pkg.nights,
        packageName: pkg.name,
        actorId,
      });

      /*
       * Money taken before the plan was recorded belongs to it. Attributing it
       * here is what stops the "for plan" column reading "—" on the opening
       * payment of a customer whose plan is right there on the same page.
       */
      const attached = await tx.payment.updateMany({
        where: { customerId: customer.id, membershipId: null },
        data: { membershipId: membership.id },
      });

      await this.audit.withinTransaction(tx, {
        actorId,
        action: 'CREATE',
        entity: 'Membership',
        entityId: membership.id,
        metadata: {
          customerId: customer.id,
          customerName: customer.name,
          packageId: pkg.id,
          packageName: pkg.name,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          customerFieldsSynced: {
            before: {
              plan: customer.plan,
              validity: customer.validity,
              totalDays: customer.totalDays,
              totalNights: customer.totalNights,
            },
            after: customerUpdate,
          },
          entitlementAllocated: {
            ledgerId: allocation.id,
            nights: pkg.nights,
          },
          paymentsAttributed: attached.count,
          customerStatus,
        },
      });

      return membership;
    }
  }

  async findAll(query: QueryMembershipsDto, currentUser: AuthUser) {
    const { customerId, packageId, status, page = 1, limit = 20 } = query;

    const filters: Prisma.MembershipWhereInput[] = [
      membershipScopeFilter(currentUser),
    ];
    if (customerId) filters.push({ customerId });
    if (packageId) filters.push({ packageId });
    if (status) {
      filters.push({ status: status as MembershipStatus });
    }

    const where: Prisma.MembershipWhereInput = { AND: filters };

    const [data, total] = await Promise.all([
      this.prisma.membership.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ status: 'asc' }, { startDate: 'desc' }],
        include: MEMBERSHIP_INCLUDE,
      }),
      this.prisma.membership.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const membership = await this.prisma.membership.findFirst({
      where: { AND: [{ id }, membershipScopeFilter(currentUser)] },
      include: MEMBERSHIP_INCLUDE,
    });
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    return membership;
  }

  async update(id: string, dto: UpdateMembershipDto, currentUser: AuthUser) {
    const membership = await this.findScopedOrFail(id, currentUser);

    const data: Prisma.MembershipUpdateInput = {};

    if (dto.packageId && dto.packageId !== membership.packageId) {
      const pkg = await this.prisma.package.findUnique({
        where: { id: dto.packageId },
        select: { id: true, isActive: true, name: true },
      });
      if (!pkg) {
        throw new NotFoundException('Plan not found');
      }
      if (!pkg.isActive) {
        throw new BadRequestException(`"${pkg.name}" is inactive`);
      }
      data.package = { connect: { id: pkg.id } };
    }

    if (dto.startDate !== undefined) data.startDate = dto.startDate;
    if (dto.endDate !== undefined) data.endDate = dto.endDate;

    const nextStart = dto.startDate ?? membership.startDate;
    const nextEnd = dto.endDate ?? membership.endDate;
    if (nextEnd && nextEnd <= nextStart) {
      throw new BadRequestException('End date must be after the start date');
    }

    // Reactivating must not create a second active membership.
    if (
      dto.status === MembershipStatus.ACTIVE &&
      membership.status !== MembershipStatus.ACTIVE
    ) {
      const other = await this.prisma.membership.findFirst({
        where: {
          customerId: membership.customerId,
          status: MembershipStatus.ACTIVE,
          id: { not: id },
        },
        select: { id: true },
      });
      if (other) {
        throw new ConflictException(
          'This customer already has another active membership',
        );
      }
    }

    if (dto.status !== undefined) {
      data.status = dto.status as MembershipStatus;
    }

    const isEnding =
      dto.status !== undefined &&
      dto.status !== membership.status &&
      dto.status !== MembershipStatus.ACTIVE;
    const isReopening =
      dto.status === MembershipStatus.ACTIVE &&
      membership.status !== MembershipStatus.ACTIVE;

    return this.prisma.$transaction(async (tx) => {
      // Ending or reopening moves the balance, so serialise against bookings.
      if (isEnding || isReopening) {
        await this.entitlements.lockMembershipForUpdate(tx, id);
      }

      const updated = await tx.membership.update({
        where: { id },
        data,
        include: MEMBERSHIP_INCLUDE,
      });

      /*
       * Spec 7 EXPIRY closes whatever remains when a membership ends, so a
       * cancelled or expired plan cannot leave usable days behind.
       *
       * CLIENT_CLARIFICATION_REQUIRED: the spec names expiry explicitly;
       * applying the same closure on cancellation is an assumption. Reopening
       * restores it as an ADJUSTMENT rather than deleting the EXPIRY row,
       * because the ledger is append-only.
       */
      let ledgerMovement: { id: string; nights: number } | null = null;
      if (isEnding) {
        const closure = await this.entitlements.closeMembershipBalance(tx, {
          customerId: membership.customerId,
          membershipId: id,
          reason: `Membership ${String(dto.status).toLowerCase()}`,
          actorId: currentUser.sub,
        });
        if (closure) {
          ledgerMovement = { id: closure.id, nights: closure.nights };
        }
      } else if (isReopening) {
        const reopen = await this.entitlements.reopenMembershipBalance(tx, {
          customerId: membership.customerId,
          membershipId: id,
          actorId: currentUser.sub,
        });
        if (reopen) {
          ledgerMovement = { id: reopen.id, nights: reopen.nights };
        }
      }

      // Cancelling, expiring or reopening a plan changes what the customer
      // record should say about itself. Same transaction, so the two can never
      // be seen disagreeing.
      const customerStatus = await this.syncCustomerStatus(
        tx,
        membership.customerId,
      );

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action:
          dto.status && dto.status !== membership.status
            ? `STATUS_${dto.status}`
            : 'UPDATE',
        entity: 'Membership',
        entityId: id,
        metadata: {
          before: {
            packageId: membership.packageId,
            startDate: membership.startDate.toISOString(),
            endDate: membership.endDate?.toISOString() ?? null,
            status: membership.status,
          },
          after: {
            packageId: updated.packageId,
            startDate: updated.startDate.toISOString(),
            endDate: updated.endDate?.toISOString() ?? null,
            status: updated.status,
          },
          entitlementMovement: ledgerMovement,
          customerStatus,
        },
      });

      return updated;
    });
  }

  /**
   * Brings Customer.status back in step with the memberships behind it.
   *
   * Spec 11 names the customer search filter "Membership status", so the column
   * is a mirror rather than an independent fact — but nothing was keeping it in
   * step, which is how a customer could read ACTIVE in the list while their only
   * plan showed CANCELLED on their own page.
   *
   * Derived, in this order:
   *   - any ACTIVE membership  -> ACTIVE   (a live plan wins, whatever else exists)
   *   - otherwise the newest one's own status, mapped across
   *   - no memberships at all  -> left alone
   *
   * That last case matters: a customer is created before any plan is recorded
   * and sits at whatever the staff set (typically PENDING). Deriving a status
   * from an empty list would overwrite a deliberate value with a guess.
   */
  private async syncCustomerStatus(
    tx: Prisma.TransactionClient,
    customerId: string,
  ): Promise<CustomerStatus | null> {
    const memberships = await tx.membership.findMany({
      where: { customerId },
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
      select: { status: true },
    });

    if (memberships.length === 0) {
      return null;
    }

    const next = memberships.some(
      (m) => m.status === MembershipStatus.ACTIVE,
    )
      ? CustomerStatus.ACTIVE
      : memberships[0].status === MembershipStatus.CANCELLED
        ? CustomerStatus.CANCELLED
        : CustomerStatus.EXPIRED;

    await tx.customer.update({
      where: { id: customerId },
      data: { status: next },
    });

    return next;
  }

  async setStatus(id: string, status: MembershipStatus, currentUser: AuthUser) {
    return this.update(id, { status }, currentUser);
  }

  async remove(id: string, currentUser: AuthUser) {
    const membership = await this.findScopedOrFail(id, currentUser);

    // Bookings and ledger rows are usage history — Spec 6.3 forbids destroying
    // them, so a membership that has been used can only be cancelled.
    const [bookings, ledger] = await Promise.all([
      this.prisma.booking.count({ where: { membershipId: id } }),
      this.prisma.entitlementLedger.count({ where: { membershipId: id } }),
    ]);

    if (bookings > 0 || ledger > 0) {
      const parts = [
        bookings > 0 ? `${bookings} booking(s)` : null,
        ledger > 0 ? `${ledger} ledger entr${ledger === 1 ? 'y' : 'ies'}` : null,
      ].filter(Boolean);
      throw new ConflictException(
        `Cannot delete this membership: ${parts.join(' and ')} recorded against it. Cancel it instead.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.membership.delete({ where: { id } });

      // Only reachable for an unused membership, but if others remain the
      // customer's status should reflect what is left rather than what was.
      await this.syncCustomerStatus(tx, membership.customerId);

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'DELETE',
        entity: 'Membership',
        entityId: id,
        metadata: {
          customerId: membership.customerId,
          packageId: membership.packageId,
          startDate: membership.startDate.toISOString(),
          status: membership.status,
        },
      });
    });

    return { message: 'Membership deleted successfully' };
  }

  /** Counters for the membership views, scoped like every other read. */
  async getStats(currentUser: AuthUser) {
    const scope = membershipScopeFilter(currentUser);
    const countBy = (extra?: Prisma.MembershipWhereInput) =>
      this.prisma.membership.count({
        where: { AND: extra ? [scope, extra] : [scope] },
      });

    const now = new Date();
    const in30Days = new Date(now);
    in30Days.setDate(in30Days.getDate() + 30);

    const [total, active, expired, cancelled, expiringSoon, overdue] =
      await Promise.all([
        countBy(),
        countBy({ status: MembershipStatus.ACTIVE }),
        countBy({ status: MembershipStatus.EXPIRED }),
        countBy({ status: MembershipStatus.CANCELLED }),
        countBy({
          status: MembershipStatus.ACTIVE,
          endDate: { gte: now, lte: in30Days },
        }),
        // Still flagged ACTIVE although the end date has passed.
        countBy({ status: MembershipStatus.ACTIVE, endDate: { lt: now } }),
      ]);

    return {
      total,
      active,
      expired,
      cancelled,
      expiringSoon,
      pastEndDate: overdue,
    };
  }
}
