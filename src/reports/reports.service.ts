import { Injectable } from '@nestjs/common';
import { BookingStatus, MembershipStatus, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import {
  customerScopeFilter,
  membershipScopeFilter,
} from '../common/scope/index.js';
import {
  daysForNights,
  LedgerType,
} from '../entitlements/entitlement.types.js';
import type { AuthUser } from '../common/types/index.js';
import { QueryPerformanceDto, QueryReportDto } from './dto/index.js';

/**
 * Role-scoped dashboards and reports — Master Spec 12 and 17 `/reports`.
 *
 * Every figure here reuses the same scope filters as the operational
 * endpoints, so a dashboard can never reveal a total that includes records the
 * caller is not allowed to open (Spec 12: "All dashboard data must respect the
 * same RBAC scope as operational endpoints").
 *
 * Aggregation is done in the database with groupBy/aggregate rather than by
 * loading rows and summing in JS — Spec 6.3 forbids N+1 patterns.
 */
@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Debits are stored negative and reported as positive quantities. Plain
   * negation turns 0 into -0, which is a distinct value in JavaScript
   * (`Object.is(-0, 0)` is false) and reads oddly in a report.
   */
  private asPositive(value: number | null | undefined): number {
    const n = value ?? 0;
    return n === 0 ? 0 : -n;
  }

  private startOfMonth(): Date {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /** Ledger rows for customers this caller can see. */
  private ledgerScope(user: AuthUser): Prisma.EntitlementLedgerWhereInput {
    const scope = customerScopeFilter(user);
    return Object.keys(scope).length === 0 ? {} : { customer: scope };
  }

  private bookingScope(user: AuthUser): Prisma.BookingWhereInput {
    const scope = customerScopeFilter(user);
    return Object.keys(scope).length === 0 ? {} : { customer: scope };
  }

  private paymentScope(user: AuthUser): Prisma.PaymentWhereInput {
    const scope = customerScopeFilter(user);
    return Object.keys(scope).length === 0 ? {} : { customer: scope };
  }

  private refundScope(user: AuthUser): Prisma.RefundWhereInput {
    const scope = customerScopeFilter(user);
    return Object.keys(scope).length === 0 ? {} : { customer: scope };
  }

  /**
   * Which users this caller may see performance for:
   * SUPER_ADMIN → everyone, MANAGER → own team + self, EXECUTIVE → self.
   */
  private performanceScope(user: AuthUser): Prisma.UserWhereInput {
    switch (user.role) {
      case Role.SUPER_ADMIN:
        return {};
      case Role.MANAGER:
        return { OR: [{ managerId: user.sub }, { id: user.sub }] };
      default:
        return { id: user.sub };
    }
  }

  /**
   * One call for the whole dashboard. Returns the same shape for every role;
   * the numbers differ because the scope differs, and `team` is null for an
   * Executive who has no team to report on.
   */
  async getDashboard(currentUser: AuthUser) {
    const customerScope = customerScopeFilter(currentUser);
    const monthStart = this.startOfMonth();
    const now = new Date();
    const in30Days = new Date(now);
    in30Days.setDate(in30Days.getDate() + 30);

    const countCustomers = (extra?: Prisma.CustomerWhereInput) =>
      this.prisma.customer.count({
        where: { AND: extra ? [customerScope, extra] : [customerScope] },
      });

    const countMemberships = (extra?: Prisma.MembershipWhereInput) =>
      this.prisma.membership.count({
        where: {
          AND: extra
            ? [membershipScopeFilter(currentUser), extra]
            : [membershipScopeFilter(currentUser)],
        },
      });

    const countBookings = (extra?: Prisma.BookingWhereInput) =>
      this.prisma.booking.count({
        where: {
          AND: extra
            ? [this.bookingScope(currentUser), extra]
            : [this.bookingScope(currentUser)],
        },
      });

    const [
      customersTotal,
      customersNew,
      customersActive,
      customersPending,
      customersCancelled,
      customerMoney,
      customersWithPending,
      collectedAll,
      collectedMonth,
      refundTotals,
      membershipsTotal,
      membershipsActive,
      membershipsExpiring,
      membershipsPastEnd,
      bookingsTotal,
      bookingsUpcoming,
      bookingsCompleted,
      bookingsCancelled,
      ledgerByType,
      team,
    ] = await Promise.all([
      countCustomers(),
      countCustomers({ createdAt: { gte: monthStart } }),
      countCustomers({ status: 'ACTIVE' }),
      countCustomers({ status: 'PENDING' }),
      countCustomers({ status: 'CANCELLED' }),
      this.prisma.customer.aggregate({
        where: { AND: [customerScope] },
        _sum: { amount: true, amountPaid: true, pendingAmount: true },
      }),
      countCustomers({ pendingAmount: { gt: 0 } }),
      this.prisma.payment.aggregate({
        where: { AND: [this.paymentScope(currentUser)] },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: {
          AND: [this.paymentScope(currentUser), { date: { gte: monthStart } }],
        },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.refund.aggregate({
        where: { AND: [this.refundScope(currentUser)] },
        _sum: { amount: true },
        _count: true,
      }),
      countMemberships(),
      countMemberships({ status: MembershipStatus.ACTIVE }),
      countMemberships({
        status: MembershipStatus.ACTIVE,
        endDate: { gte: now, lte: in30Days },
      }),
      countMemberships({
        status: MembershipStatus.ACTIVE,
        endDate: { lt: now },
      }),
      countBookings(),
      countBookings({
        status: BookingStatus.CONFIRMED,
        checkIn: { gte: now },
      }),
      countBookings({ status: BookingStatus.COMPLETED }),
      countBookings({ status: BookingStatus.CANCELLED }),
      // One grouped query rather than five counts.
      this.prisma.entitlementLedger.groupBy({
        by: ['type'],
        where: { AND: [this.ledgerScope(currentUser)] },
        _sum: { nights: true },
      }),
      this.getTeamSummary(currentUser),
    ]);

    const byType = (type: string) =>
      ledgerByType.find((r) => r.type === type)?._sum ?? { nights: 0 };

    const allocated = byType(LedgerType.ALLOCATION);
    const usage = byType(LedgerType.BOOKING_USAGE);
    const returned = byType(LedgerType.CANCELLATION);
    const adjusted = byType(LedgerType.ADJUSTMENT);
    const expired = byType(LedgerType.EXPIRY);

    const nightsRemaining = ledgerByType.reduce(
      (acc, row) => acc + (row._sum.nights ?? 0),
      0,
    );

    return {
      scope:
        currentUser.role === Role.SUPER_ADMIN
          ? 'global'
          : currentUser.role === Role.MANAGER
            ? 'team'
            : 'own',
      role: currentUser.role,
      generatedAt: new Date().toISOString(),

      customers: {
        total: customersTotal,
        newThisMonth: customersNew,
        active: customersActive,
        pending: customersPending,
        cancelled: customersCancelled,
      },

      sales: {
        // Plan value on the customer records — the headline "total sales".
        planValue: this.round(customerMoney._sum.amount ?? 0),
        recordedPaid: this.round(customerMoney._sum.amountPaid ?? 0),
        pending: this.round(customerMoney._sum.pendingAmount ?? 0),
        customersWithPending,
        // From individual payment rows, which may be fewer than recordedPaid
        // where an opening balance was imported without rows.
        collectedFromPayments: this.round(collectedAll._sum.amount ?? 0),
        paymentCount: collectedAll._count,
        collectedThisMonth: this.round(collectedMonth._sum.amount ?? 0),
        paymentsThisMonth: collectedMonth._count,
      },

      refunds: {
        total: this.round(refundTotals._sum.amount ?? 0),
        count: refundTotals._count,
      },

      memberships: {
        total: membershipsTotal,
        active: membershipsActive,
        expiringIn30Days: membershipsExpiring,
        pastEndDate: membershipsPastEnd,
      },

      bookings: {
        total: bookingsTotal,
        upcoming: bookingsUpcoming,
        completed: bookingsCompleted,
        cancelled: bookingsCancelled,
      },

      /**
       * Nights only, and every figure reconciles:
       * allocated + returned + adjusted - used - expired = remaining.
       *
       * daysRemaining is derived from the nights, not summed alongside them —
       * see daysForNights for why a day budget cannot be made to reconcile.
       */
      usage: {
        nightsAllocated: allocated.nights ?? 0,
        nightsUsed: this.asPositive(usage.nights),
        nightsReturned: returned.nights ?? 0,
        nightsAdjusted: adjusted.nights ?? 0,
        nightsExpired: this.asPositive(expired.nights),
        nightsRemaining,
        daysRemaining: daysForNights(nightsRemaining),
      },

      team,

      /**
       * Spec 12 lists incentives on all three dashboards, but the calculation
       * engine is Phase 7 and the slabs are unconfirmed (Spec 22 #1/#2).
       * Reporting a zero would read as "no incentive earned", which is a
       * different claim from "not yet implemented".
       */
      incentives: {
        available: false,
        reason:
          'Incentive calculation arrives with Phase 7; the slabs are pending client confirmation.',
      },
    };
  }

  /** Team composition, or null for an Executive who manages nobody. */
  private async getTeamSummary(currentUser: AuthUser) {
    if (currentUser.role === Role.EXECUTIVE) {
      return null;
    }

    const scope: Prisma.UserWhereInput =
      currentUser.role === Role.SUPER_ADMIN
        ? {}
        : { managerId: currentUser.sub };

    const [executives, activeExecutives, managers, unassigned] =
      await Promise.all([
        this.prisma.user.count({
          where: { AND: [scope, { role: Role.EXECUTIVE }] },
        }),
        this.prisma.user.count({
          where: { AND: [scope, { role: Role.EXECUTIVE, isActive: true }] },
        }),
        currentUser.role === Role.SUPER_ADMIN
          ? this.prisma.user.count({ where: { role: Role.MANAGER } })
          : Promise.resolve(1),
        this.prisma.user.count({
          where: {
            AND: [scope, { role: Role.EXECUTIVE, managerId: null }],
          },
        }),
      ]);

    return { executives, activeExecutives, managers, unassignedExecutives: unassigned };
  }

  /**
   * Per-executive rollup — Spec 12 "Executive performance".
   *
   * Two grouped queries plus one name lookup, rather than a query per
   * executive.
   */
  async getExecutivePerformance(
    currentUser: AuthUser,
    query: QueryPerformanceDto = {},
  ) {
    const {
      search,
      sortBy = 'totalSales',
      sortDir = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const filters: Prisma.UserWhereInput[] = [
      this.performanceScope(currentUser),
      { role: Role.EXECUTIVE },
    ];
    if (search) {
      filters.push({
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      });
    }

    /*
     * Every in-scope executive is loaded, not just the requested page.
     *
     * Sorting by a *computed* column (sales, collected, days used) cannot be
     * done in the database without raw SQL, so the aggregate has to cover the
     * whole set before it can be ordered and sliced. The cost is fixed — three
     * grouped queries regardless of headcount — and a CRM has tens of
     * executives, not millions. If that ever changes, this becomes a
     * materialised view (Spec 14 allows exactly that when performance requires).
     */
    const people = await this.prisma.user.findMany({
      where: { AND: filters },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        manager: { select: { id: true, name: true } },
      },
      orderBy: { name: 'asc' },
    });

    if (people.length === 0) {
      return {
        data: [],
        meta: {
          executives: 0,
          total: 0,
          page,
          limit,
          totalPages: 1,
          sortBy,
          sortDir,
          totals: {
            customers: 0,
            totalSales: 0,
            collected: 0,
            pending: 0,
            daysUsed: 0,
            nightsUsed: 0,
          },
        },
      };
    }

    const ids = people.map((p) => p.id);

    const [customerRollup, bookingRollup] = await Promise.all([
      this.prisma.customer.groupBy({
        by: ['assignedExecId'],
        where: { assignedExecId: { in: ids } },
        _count: true,
        _sum: { amount: true, amountPaid: true, pendingAmount: true },
      }),
      this.prisma.booking.groupBy({
        by: ['customerId'],
        where: {
          customer: { assignedExecId: { in: ids } },
          status: { not: BookingStatus.CANCELLED },
        },
        _sum: { daysUsed: true, nightsUsed: true },
      }),
    ]);

    // Map bookings back to executives via their customers.
    const customerOwners = await this.prisma.customer.findMany({
      where: { assignedExecId: { in: ids } },
      select: { id: true, assignedExecId: true },
    });
    const ownerOf = new Map(
      customerOwners.map((c) => [c.id, c.assignedExecId]),
    );

    const usageByExec = new Map<string, { days: number; nights: number }>();
    for (const row of bookingRollup) {
      const execId = ownerOf.get(row.customerId);
      if (!execId) continue;
      const current = usageByExec.get(execId) ?? { days: 0, nights: 0 };
      usageByExec.set(execId, {
        days: current.days + (row._sum.daysUsed ?? 0),
        nights: current.nights + (row._sum.nightsUsed ?? 0),
      });
    }

    const data = people.map((person) => {
      const money = customerRollup.find((r) => r.assignedExecId === person.id);
      const usage = usageByExec.get(person.id) ?? { days: 0, nights: 0 };

      return {
        executive: {
          id: person.id,
          name: person.name,
          email: person.email,
          isActive: person.isActive,
          manager: person.manager,
        },
        customers: money?._count ?? 0,
        totalSales: this.round(money?._sum.amount ?? 0),
        collected: this.round(money?._sum.amountPaid ?? 0),
        pending: this.round(money?._sum.pendingAmount ?? 0),
        daysUsed: usage.days,
        nightsUsed: usage.nights,
        // Spec 22 #1: the slabs are unconfirmed, so no figure is invented.
        incentive: null,
      };
    });

    const direction = sortDir === 'asc' ? 1 : -1;
    const sorted = [...data].sort((a, b) => {
      if (sortBy === 'name') {
        return a.executive.name.localeCompare(b.executive.name) * direction;
      }
      return ((a[sortBy] as number) - (b[sortBy] as number)) * direction;
    });

    // Team-wide totals across every in-scope executive, not just this page.
    const totals = data.reduce(
      (acc, row) => ({
        customers: acc.customers + row.customers,
        totalSales: this.round(acc.totalSales + row.totalSales),
        collected: this.round(acc.collected + row.collected),
        pending: this.round(acc.pending + row.pending),
        daysUsed: acc.daysUsed + row.daysUsed,
        nightsUsed: acc.nightsUsed + row.nightsUsed,
      }),
      {
        customers: 0,
        totalSales: 0,
        collected: 0,
        pending: 0,
        daysUsed: 0,
        nightsUsed: 0,
      },
    );

    const start = (page - 1) * limit;

    return {
      data: sorted.slice(start, start + limit),
      meta: {
        // Kept for compatibility with the previous shape.
        executives: data.length,
        total: data.length,
        page,
        limit,
        totalPages: Math.max(Math.ceil(data.length / limit), 1),
        sortBy,
        sortDir,
        totals,
      },
    };
  }

  /** Customers still owing money — Spec 12 "Pending payments". */
  async getPendingPayments(query: QueryReportDto, currentUser: AuthUser) {
    const { assignedExecId, page = 1, limit = 50 } = query;

    const filters: Prisma.CustomerWhereInput[] = [
      customerScopeFilter(currentUser),
      { pendingAmount: { gt: 0 } },
    ];
    if (assignedExecId) filters.push({ assignedExecId });

    const where: Prisma.CustomerWhereInput = { AND: filters };

    const [data, total, totals] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { pendingAmount: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          plan: true,
          amount: true,
          amountPaid: true,
          pendingAmount: true,
          status: true,
          assignedExec: {
            select: { id: true, name: true, manager: { select: { name: true } } },
          },
        },
      }),
      this.prisma.customer.count({ where }),
      this.prisma.customer.aggregate({
        where,
        _sum: { pendingAmount: true, amount: true, amountPaid: true },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        pendingTotal: this.round(totals._sum.pendingAmount ?? 0),
        planValueTotal: this.round(totals._sum.amount ?? 0),
        collectedTotal: this.round(totals._sum.amountPaid ?? 0),
      },
    };
  }

  /**
   * Days/nights position per customer — Spec 12 "Customer usage".
   * Balances come from the ledger, so adjustments and expiries are included.
   */
  async getCustomerUsage(query: QueryReportDto, currentUser: AuthUser) {
    const { assignedExecId, page = 1, limit = 50 } = query;

    const filters: Prisma.CustomerWhereInput[] = [
      customerScopeFilter(currentUser),
    ];
    if (assignedExecId) filters.push({ assignedExecId });
    const where: Prisma.CustomerWhereInput = { AND: filters };

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          plan: true,
          totalDays: true,
          totalNights: true,
          assignedExec: { select: { id: true, name: true } },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    if (customers.length === 0) {
      return {
        data: [],
        meta: { total, page, limit, totalPages: 1 },
      };
    }

    const ids = customers.map((c) => c.id);

    // Two grouped queries for the whole page, not one per customer.
    const [balances, used] = await Promise.all([
      this.prisma.entitlementLedger.groupBy({
        by: ['customerId'],
        where: { customerId: { in: ids } },
        _sum: { days: true, nights: true },
      }),
      this.prisma.entitlementLedger.groupBy({
        by: ['customerId'],
        where: { customerId: { in: ids }, type: LedgerType.BOOKING_USAGE },
        _sum: { days: true, nights: true },
      }),
    ]);

    const balanceOf = new Map(balances.map((b) => [b.customerId, b._sum]));
    const usedOf = new Map(used.map((b) => [b.customerId, b._sum]));

    return {
      data: customers.map((c) => {
        const bal = balanceOf.get(c.id);
        const use = usedOf.get(c.id);
        return {
          customer: {
            id: c.id,
            name: c.name,
            phone: c.phone,
            plan: c.plan,
            assignedExec: c.assignedExec,
          },
          daysRemaining: bal?.days ?? 0,
          nightsRemaining: bal?.nights ?? 0,
          daysUsed: this.asPositive(use?.days),
          nightsUsed: this.asPositive(use?.nights),
        };
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }
}
