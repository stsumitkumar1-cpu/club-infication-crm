import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { customerScopeFilter } from '../common/scope/index.js';
import type { AuthUser } from '../common/types/index.js';
import {
  daysForNights,
  LedgerType,
  type EntitlementBalance,
  type LedgerMovement,
} from './entitlement.types.js';
import { AdjustEntitlementDto, QueryLedgerDto } from './dto/index.js';

/** Anything that can run a query — the client, or a transaction client. */
type Db = PrismaService | Prisma.TransactionClient;

const LEDGER_INCLUDE = {
  customer: { select: { id: true, name: true, phone: true } },
  membership: {
    select: {
      id: true,
      status: true,
      package: { select: { id: true, name: true } },
    },
  },
  booking: {
    select: { id: true, checkIn: true, checkOut: true, status: true },
  },
};

@Injectable()
export class EntitlementsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private scopeFilter(user: AuthUser): Prisma.EntitlementLedgerWhereInput {
    const customerScope = customerScopeFilter(user);
    return Object.keys(customerScope).length === 0
      ? {}
      : { customer: customerScope };
  }

  /**
   * Balance is the SUM of every movement — Master Spec 7. There is no
   * remaining_days column, deliberately: the ledger is the only truth, so a
   * balance can always be reconstructed and explained.
   */
  async balanceFor(
    db: Db,
    where: { customerId: string; membershipId?: string | null },
  ): Promise<EntitlementBalance> {
    const filter: Prisma.EntitlementLedgerWhereInput = {
      customerId: where.customerId,
    };
    if (where.membershipId !== undefined) {
      filter.membershipId = where.membershipId;
    }

    const sum = await db.entitlementLedger.aggregate({
      where: filter,
      _sum: { nights: true },
    });

    const nights = sum._sum.nights ?? 0;
    return { nights, days: daysForNights(nights) };
  }

  /**
   * Appends one movement. Takes a Db so callers can pass their transaction —
   * a ledger entry must commit atomically with whatever caused it.
   */
  async record(db: Db, movement: LedgerMovement) {
    return db.entitlementLedger.create({
      data: {
        customerId: movement.customerId,
        membershipId: movement.membershipId ?? null,
        bookingId: movement.bookingId ?? null,
        type: movement.type,
        // The column stays for schema compatibility (Spec 6) but is no longer a
        // quantity: days are derived from nights on read, so a separately
        // stored figure could only ever contradict the balance.
        days: 0,
        nights: movement.nights,
        description: movement.description ?? null,
        actorId: movement.actorId ?? null,
        date: movement.date ?? new Date(),
      },
    });
  }

  /**
   * Locks the membership row for the rest of the transaction so two concurrent
   * bookings cannot both read the same balance and both succeed — Spec 8.2
   * step 3. Postgres releases it on commit or rollback.
   *
   * The membership is the entitlement container, so locking it serialises
   * bookings for that one customer while leaving other customers unaffected.
   */
  async lockMembershipForUpdate(
    tx: Prisma.TransactionClient,
    membershipId: string,
  ): Promise<void> {
    await tx.$queryRaw`SELECT id FROM "Membership" WHERE id = ${membershipId} FOR UPDATE`;
  }

  /** Allocation written when a membership is created (Spec 7, 8.1 step 4). */
  async recordAllocation(
    tx: Prisma.TransactionClient,
    params: {
      customerId: string;
      membershipId: string;
      nights: number;
      packageName: string;
      actorId: string;
    },
  ) {
    return this.record(tx, {
      customerId: params.customerId,
      membershipId: params.membershipId,
      type: LedgerType.ALLOCATION,
      nights: params.nights,
      description: `Allocated by ${params.packageName} membership`,
      actorId: params.actorId,
    });
  }

  /**
   * Closes whatever remains on a membership that has ended (Spec 7 EXPIRY).
   * Writes the negative of the current balance so it lands on zero, and
   * nothing at all when there is nothing left to close.
   */
  async closeMembershipBalance(
    tx: Prisma.TransactionClient,
    params: {
      customerId: string;
      membershipId: string;
      reason: string;
      actorId: string;
    },
  ) {
    const balance = await this.balanceFor(tx, {
      customerId: params.customerId,
      membershipId: params.membershipId,
    });

    if (balance.nights === 0) {
      return null;
    }

    return this.record(tx, {
      customerId: params.customerId,
      membershipId: params.membershipId,
      type: LedgerType.EXPIRY,
      nights: -balance.nights,
      description: `${params.reason} — closed ${balance.nights} night(s)`,
      actorId: params.actorId,
    });
  }

  /**
   * Restores a balance closed by EXPIRY, used when a membership is reactivated.
   * Recorded as an ADJUSTMENT rather than by deleting the EXPIRY row, because
   * ledger history is append-only.
   */
  async reopenMembershipBalance(
    tx: Prisma.TransactionClient,
    params: { customerId: string; membershipId: string; actorId: string },
  ) {
    const closures = await tx.entitlementLedger.aggregate({
      where: {
        customerId: params.customerId,
        membershipId: params.membershipId,
        type: LedgerType.EXPIRY,
      },
      _sum: { nights: true },
    });

    const nights = -(closures._sum.nights ?? 0);
    if (nights === 0) {
      return null;
    }

    return this.record(tx, {
      customerId: params.customerId,
      membershipId: params.membershipId,
      type: LedgerType.ADJUSTMENT,
      nights,
      description:
        'Membership reactivated — restoring the balance closed on expiry',
      actorId: params.actorId,
    });
  }

  // ---------------------------------------------------------------- read API

  /** Balance plus the allocation/usage breakdown behind it. */
  async getBalance(
    query: { customerId: string; membershipId?: string },
    currentUser: AuthUser,
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { AND: [{ id: query.customerId }, customerScopeFilter(currentUser)] },
      select: { id: true, name: true },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (query.membershipId) {
      const membership = await this.prisma.membership.findFirst({
        where: { id: query.membershipId, customerId: customer.id },
        select: { id: true },
      });
      if (!membership) {
        throw new BadRequestException(
          'That membership does not belong to this customer',
        );
      }
    }

    const filter: Prisma.EntitlementLedgerWhereInput = {
      customerId: customer.id,
      ...(query.membershipId ? { membershipId: query.membershipId } : {}),
    };

    const [balance, byType] = await Promise.all([
      this.balanceFor(this.prisma, {
        customerId: customer.id,
        ...(query.membershipId ? { membershipId: query.membershipId } : {}),
      }),
      this.prisma.entitlementLedger.groupBy({
        by: ['type'],
        where: filter,
        _sum: { nights: true },
        _count: true,
      }),
    ]);

    const breakdown = byType.map((row) => ({
      type: row.type,
      entries: row._count,
      nights: row._sum.nights ?? 0,
    }));

    const allocated = breakdown
      .filter((b) => b.nights > 0)
      .reduce((acc, b) => acc + b.nights, 0);
    const consumed = breakdown
      .filter((b) => b.nights < 0)
      .reduce((acc, b) => acc + b.nights, 0);

    return {
      customerId: customer.id,
      customerName: customer.name,
      membershipId: query.membershipId ?? null,
      // Nights are the authoritative figure (SUM over the ledger); the day
      // count beside them is derived from it.
      remaining: balance,
      credited: { nights: allocated },
      debited: { nights: -consumed },
      breakdown,
    };
  }

  /** The ledger itself — the auditable history Spec 7 requires. */
  async findAll(query: QueryLedgerDto, currentUser: AuthUser) {
    const { customerId, membershipId, bookingId, type, page = 1, limit = 50 } =
      query;

    const filters: Prisma.EntitlementLedgerWhereInput[] = [
      this.scopeFilter(currentUser),
    ];
    if (customerId) filters.push({ customerId });
    if (membershipId) filters.push({ membershipId });
    if (bookingId) filters.push({ bookingId });
    if (type) filters.push({ type });

    const where: Prisma.EntitlementLedgerWhereInput = { AND: filters };

    const [data, total, sum] = await Promise.all([
      this.prisma.entitlementLedger.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        include: LEDGER_INCLUDE,
      }),
      this.prisma.entitlementLedger.count({ where }),
      this.prisma.entitlementLedger.aggregate({
        where,
        _sum: { nights: true },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        netNights: sum._sum.nights ?? 0,
      },
    };
  }

  /**
   * Manual correction (Spec 7 ADJUSTMENT). Cannot push a balance negative —
   * the CRM must never show a customer owing nights they never had.
   */
  async adjust(dto: AdjustEntitlementDto, currentUser: AuthUser) {
    if (dto.nights === 0) {
      throw new BadRequestException(
        'An adjustment must change the night balance by a non-zero amount',
      );
    }

    const customer = await this.prisma.customer.findFirst({
      where: { AND: [{ id: dto.customerId }, customerScopeFilter(currentUser)] },
      select: { id: true, name: true },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (dto.membershipId) {
      const membership = await this.prisma.membership.findFirst({
        where: { id: dto.membershipId, customerId: customer.id },
        select: { id: true },
      });
      if (!membership) {
        throw new BadRequestException(
          'That membership does not belong to this customer',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.membershipId) {
        await this.lockMembershipForUpdate(tx, dto.membershipId);
      }

      const before = await this.balanceFor(tx, {
        customerId: customer.id,
        ...(dto.membershipId ? { membershipId: dto.membershipId } : {}),
      });

      const nights = before.nights + dto.nights;
      const after = { nights, days: daysForNights(nights) };
      if (after.nights < 0) {
        throw new BadRequestException(
          `Adjustment would leave a negative balance (${after.nights} nights). The current balance is ${before.nights} night(s).`,
        );
      }

      const entry = await this.record(tx, {
        customerId: customer.id,
        membershipId: dto.membershipId ?? null,
        type: LedgerType.ADJUSTMENT,
        nights: dto.nights,
        description: dto.reason,
        actorId: currentUser.sub,
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'ADJUSTMENT',
        entity: 'EntitlementLedger',
        entityId: entry.id,
        metadata: {
          customerId: customer.id,
          customerName: customer.name,
          membershipId: dto.membershipId ?? null,
          nights: dto.nights,
          reason: dto.reason,
          balance: { before, after },
        },
      });

      return { ...entry, balance: after };
    });
  }
}
