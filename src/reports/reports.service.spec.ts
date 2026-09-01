// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { ReportsService } from './reports.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { LedgerType } from '../entitlements/entitlement.types.js';
import type { AuthUser } from '../common/types/index.js';

/** Bare `Mock` defaults to an unknown signature, which rejects mock payloads. */
type AnyMock = Mock<(...args: any[]) => any>;
const mockFn = (): AnyMock => jest.fn<(...args: any[]) => any>();

const SUPER_ADMIN: AuthUser = {
  sub: 'admin-1',
  email: 'admin@clubinfication.com',
  name: 'Super Admin',
  role: Role.SUPER_ADMIN,
};
const MANAGER_1: AuthUser = {
  sub: 'manager-1',
  email: 'm1@clubinfication.com',
  name: 'Manager One',
  role: Role.MANAGER,
};
const EXECUTIVE_A: AuthUser = {
  sub: 'exec-a',
  email: 'a@clubinfication.com',
  name: 'Exec A',
  role: Role.EXECUTIVE,
};

const MANAGER_SCOPE = {
  OR: [
    { assignedExec: { managerId: MANAGER_1.sub } },
    { assignedExecId: MANAGER_1.sub },
  ],
};

describe('ReportsService (Spec 12)', () => {
  let service: ReportsService;
  let prisma: {
    customer: {
      count: AnyMock;
      aggregate: AnyMock;
      groupBy: AnyMock;
      findMany: AnyMock;
    };
    membership: { count: AnyMock };
    booking: { count: AnyMock; groupBy: AnyMock };
    payment: { aggregate: AnyMock };
    refund: { aggregate: AnyMock };
    entitlementLedger: { groupBy: AnyMock };
    user: { count: AnyMock; findMany: AnyMock };
  };

  beforeEach(async () => {
    prisma = {
      customer: {
        count: mockFn().mockResolvedValue(0),
        aggregate: mockFn().mockResolvedValue({ _sum: {} }),
        groupBy: mockFn().mockResolvedValue([]),
        findMany: mockFn().mockResolvedValue([]),
      },
      membership: { count: mockFn().mockResolvedValue(0) },
      booking: {
        count: mockFn().mockResolvedValue(0),
        groupBy: mockFn().mockResolvedValue([]),
      },
      payment: {
        aggregate: mockFn().mockResolvedValue({ _sum: {}, _count: 0 }),
      },
      refund: {
        aggregate: mockFn().mockResolvedValue({ _sum: {}, _count: 0 }),
      },
      entitlementLedger: { groupBy: mockFn().mockResolvedValue([]) },
      user: {
        count: mockFn().mockResolvedValue(0),
        findMany: mockFn().mockResolvedValue([]),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = moduleRef.get(ReportsService);
  });

  describe('dashboard scope (Spec 12: same scope as operational endpoints)', () => {
    it('reports global scope for a Super Admin, with no customer filter', async () => {
      const result = await service.getDashboard(SUPER_ADMIN);

      expect(result.scope).toBe('global');
      for (const call of prisma.customer.count.mock.calls) {
        expect(call[0].where.AND[0]).toEqual({});
      }
    });

    it("filters every customer figure to a Manager's team", async () => {
      const result = await service.getDashboard(MANAGER_1);

      expect(result.scope).toBe('team');
      expect(prisma.customer.count.mock.calls.length).toBeGreaterThan(0);
      for (const call of prisma.customer.count.mock.calls) {
        expect(call[0].where.AND[0]).toEqual(MANAGER_SCOPE);
      }
    });

    it("filters every customer figure to an Executive's own records", async () => {
      const result = await service.getDashboard(EXECUTIVE_A);

      expect(result.scope).toBe('own');
      for (const call of prisma.customer.count.mock.calls) {
        expect(call[0].where.AND[0]).toEqual({
          assignedExecId: EXECUTIVE_A.sub,
        });
      }
    });

    it('scopes payments, refunds, bookings and the ledger too', async () => {
      await service.getDashboard(EXECUTIVE_A);
      const expected = { customer: { assignedExecId: EXECUTIVE_A.sub } };

      expect(prisma.payment.aggregate.mock.calls[0][0].where.AND[0]).toEqual(
        expected,
      );
      expect(prisma.refund.aggregate.mock.calls[0][0].where.AND[0]).toEqual(
        expected,
      );
      expect(prisma.booking.count.mock.calls[0][0].where.AND[0]).toEqual(
        expected,
      );
      expect(
        prisma.entitlementLedger.groupBy.mock.calls[0][0].where.AND[0],
      ).toEqual(expected);
    });

    it('gives an Executive no team block', async () => {
      const result = await service.getDashboard(EXECUTIVE_A);
      expect(result.team).toBeNull();
    });

    it('gives a Manager a team block scoped to their own executives', async () => {
      const result = await service.getDashboard(MANAGER_1);
      expect(result.team).not.toBeNull();

      const execCounts = prisma.user.count.mock.calls.filter(
        (c: any) => c[0]?.where?.AND,
      );
      expect(execCounts.length).toBeGreaterThan(0);
      for (const call of execCounts) {
        expect(call[0].where.AND[0]).toEqual({ managerId: MANAGER_1.sub });
      }
    });
  });

  describe('usage reconciles against the ledger', () => {
    it('derives every usage figure from the grouped ledger', async () => {
      prisma.entitlementLedger.groupBy.mockResolvedValue([
        // Non-zero days in the mock are deliberate: rows written before days
        // stopped being a quantity still carry them, and the report must not
        // let a stale column reach any figure it publishes.
        { type: LedgerType.ALLOCATION, _sum: { days: 10, nights: 8 } },
        { type: LedgerType.BOOKING_USAGE, _sum: { days: -6, nights: -4 } },
        { type: LedgerType.CANCELLATION, _sum: { days: 2, nights: 1 } },
        { type: LedgerType.ADJUSTMENT, _sum: { days: 1, nights: 1 } },
        { type: LedgerType.EXPIRY, _sum: { days: -3, nights: -2 } },
      ]);

      const { usage } = await service.getDashboard(SUPER_ADMIN);

      expect(usage.nightsAllocated).toBe(8);
      // Debits are reported as positive quantities.
      expect(usage.nightsUsed).toBe(4);
      expect(usage.nightsReturned).toBe(1);
      expect(usage.nightsAdjusted).toBe(1);
      expect(usage.nightsExpired).toBe(2);
      // 8 - 4 + 1 + 1 - 2 = 4
      expect(usage.nightsRemaining).toBe(4);
      // Derived from the nights (4 + 1), NOT the stale days column, which
      // would have summed to 10 - 6 + 2 + 1 - 3 = 4 and looked plausible.
      expect(usage.daysRemaining).toBe(5);
    });

    it('treats an empty ledger as zeroes, not nulls', async () => {
      const { usage } = await service.getDashboard(SUPER_ADMIN);
      expect(usage.nightsRemaining).toBe(0);
      expect(usage.nightsAllocated).toBe(0);
      // Zero nights is zero days, not one.
      expect(usage.daysRemaining).toBe(0);
    });
  });

  describe('incentives are reported as unavailable, not as zero', () => {
    it('says so explicitly (Spec 22 #1)', async () => {
      const { incentives } = await service.getDashboard(SUPER_ADMIN);
      expect(incentives.available).toBe(false);
      expect(incentives.reason).toMatch(/Phase 7/);
    });
  });

  describe('executive performance', () => {
    it('limits a Manager to their own team plus themselves', async () => {
      await service.getExecutivePerformance(MANAGER_1);

      const { where } = prisma.user.findMany.mock.calls[0][0];
      expect(where.AND[0]).toEqual({
        OR: [{ managerId: MANAGER_1.sub }, { id: MANAGER_1.sub }],
      });
    });

    it('limits an Executive to themselves', async () => {
      await service.getExecutivePerformance(EXECUTIVE_A);

      const { where } = prisma.user.findMany.mock.calls[0][0];
      expect(where.AND[0]).toEqual({ id: EXECUTIVE_A.sub });
    });

    it('returns early without extra queries when nobody is in scope', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      const result = await service.getExecutivePerformance(EXECUTIVE_A);

      expect(result.data).toEqual([]);
      expect(prisma.customer.groupBy).not.toHaveBeenCalled();
    });

    it('aggregates without a query per executive (no N+1)', async () => {
      prisma.user.findMany.mockResolvedValue([
        { id: 'e1', name: 'Exec One', email: 'e1@x.com', isActive: true, manager: null },
        { id: 'e2', name: 'Exec Two', email: 'e2@x.com', isActive: true, manager: null },
        { id: 'e3', name: 'Exec Three', email: 'e3@x.com', isActive: true, manager: null },
      ]);
      prisma.customer.groupBy.mockResolvedValue([
        { assignedExecId: 'e1', _count: 4, _sum: { amount: 400000, amountPaid: 300000, pendingAmount: 100000 } },
        { assignedExecId: 'e2', _count: 2, _sum: { amount: 100000, amountPaid: 100000, pendingAmount: 0 } },
      ]);
      prisma.booking.groupBy.mockResolvedValue([
        { customerId: 'c1', _sum: { daysUsed: 4, nightsUsed: 3 } },
      ]);
      prisma.customer.findMany.mockResolvedValue([
        { id: 'c1', assignedExecId: 'e1' },
      ]);

      const result = await service.getExecutivePerformance(SUPER_ADMIN);

      // Three executives, but only one grouped call each.
      expect(prisma.customer.groupBy).toHaveBeenCalledTimes(1);
      expect(prisma.booking.groupBy).toHaveBeenCalledTimes(1);

      expect(result.data).toHaveLength(3);
      // Sorted by sales, highest first.
      expect(result.data[0].executive.id).toBe('e1');
      expect(result.data[0].totalSales).toBe(400000);
      expect(result.data[0].daysUsed).toBe(4);
      // An executive with no customers still appears, at zero.
      expect(result.data[2].customers).toBe(0);
      expect(result.data[2].totalSales).toBe(0);
    });

    it('never invents an incentive figure', async () => {
      prisma.user.findMany.mockResolvedValue([
        { id: 'e1', name: 'Exec One', email: 'e1@x.com', isActive: true, manager: null },
      ]);
      const result = await service.getExecutivePerformance(SUPER_ADMIN);
      expect(result.data[0].incentive).toBeNull();
    });
  });

  describe('pending payments', () => {
    it('only lists customers who owe something, within scope', async () => {
      await service.getPendingPayments({}, MANAGER_1);

      const { where } = prisma.customer.findMany.mock.calls[0][0];
      expect(where.AND[0]).toEqual(MANAGER_SCOPE);
      expect(where.AND[1]).toEqual({ pendingAmount: { gt: 0 } });
    });

    it('totals the whole filtered set, not just the page', async () => {
      prisma.customer.count.mockResolvedValue(40);
      prisma.customer.aggregate.mockResolvedValue({
        _sum: { pendingAmount: 900000, amount: 2000000, amountPaid: 1100000 },
      });

      const res = await service.getPendingPayments({ limit: 10 }, SUPER_ADMIN);
      expect(res.meta.pendingTotal).toBe(900000);
      expect(res.meta.totalPages).toBe(4);
    });

    it('a filter cannot widen the caller scope', async () => {
      await service.getPendingPayments({ assignedExecId: 'exec-b' }, EXECUTIVE_A);

      const { where } = prisma.customer.findMany.mock.calls[0][0];
      expect(where.AND[0]).toEqual({ assignedExecId: EXECUTIVE_A.sub });
      expect(where.AND).toContainEqual({ assignedExecId: 'exec-b' });
    });
  });

  describe('customer usage', () => {
    it('reads balances from the ledger in one grouped query', async () => {
      prisma.customer.findMany.mockResolvedValue([
        { id: 'c1', name: 'A', phone: '1', plan: 'Gold', totalDays: 4, totalNights: 3, assignedExec: null },
        { id: 'c2', name: 'B', phone: '2', plan: 'Gold', totalDays: 4, totalNights: 3, assignedExec: null },
      ]);
      prisma.entitlementLedger.groupBy
        .mockResolvedValueOnce([
          { customerId: 'c1', _sum: { days: 1, nights: 1 } },
        ])
        .mockResolvedValueOnce([
          { customerId: 'c1', _sum: { days: -3, nights: -2 } },
        ]);

      const res = await service.getCustomerUsage({}, SUPER_ADMIN);

      expect(prisma.entitlementLedger.groupBy).toHaveBeenCalledTimes(2);
      expect(res.data[0].daysRemaining).toBe(1);
      expect(res.data[0].daysUsed).toBe(3);
      // A customer with no ledger rows reads as zero, not undefined.
      expect(res.data[1].daysRemaining).toBe(0);
      expect(res.data[1].daysUsed).toBe(0);
    });

    it('skips the ledger queries entirely on an empty page', async () => {
      prisma.customer.findMany.mockResolvedValue([]);
      const res = await service.getCustomerUsage({}, EXECUTIVE_A);

      expect(res.data).toEqual([]);
      expect(prisma.entitlementLedger.groupBy).not.toHaveBeenCalled();
    });
  });
});
