// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { EntitlementsService } from './entitlements.service.js';
import { LedgerType } from './entitlement.types.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
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

describe('EntitlementsService (ledger — Spec 7)', () => {
  let service: EntitlementsService;
  let prisma: {
    entitlementLedger: {
      findMany: AnyMock;
      count: AnyMock;
      aggregate: AnyMock;
      groupBy: AnyMock;
      create: AnyMock;
    };
    customer: { findFirst: AnyMock };
    membership: { findFirst: AnyMock; findMany: AnyMock; findUnique: AnyMock };
    $queryRaw: AnyMock;
    $transaction: AnyMock;
  };

  beforeEach(async () => {
    prisma = {
      entitlementLedger: {
        findMany: mockFn().mockResolvedValue([]),
        count: mockFn().mockResolvedValue(0),
        aggregate: mockFn().mockResolvedValue({
          _sum: { days: 0, nights: 0 },
        }),
        groupBy: mockFn().mockResolvedValue([]),
        create: mockFn().mockImplementation(async ({ data }: any) => ({
          id: 'led-new',
          ...data,
        })),
      },
      customer: {
        findFirst: mockFn().mockResolvedValue({ id: 'cust-1', name: 'Asha' }),
      },
      membership: {
        findFirst: mockFn().mockResolvedValue({ id: 'ms-1' }),
        // getBalance reconciles the annual years before reading, which
        // needs the active memberships and each one's plan.
        findMany: mockFn().mockResolvedValue([]),
        findUnique: mockFn().mockResolvedValue(null),
      },
      $queryRaw: mockFn().mockResolvedValue([{ id: 'ms-1' }]),
      $transaction: mockFn().mockImplementation((cb: any) => cb(prisma)),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        EntitlementsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { withinTransaction: mockFn() } },
      ],
    }).compile();

    service = moduleRef.get(EntitlementsService);
  });

  describe('balanceFor — balance is a SUM, not a stored counter', () => {
    it('sums the nights across the ledger', async () => {
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 5 },
      });

      const balance = await service.balanceFor(prisma as any, {
        customerId: 'cust-1',
        membershipId: 'ms-1',
      });

      expect(balance).toEqual({ nights: 5, days: 6, complimentaryNights: 5 });
      expect(prisma.entitlementLedger.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            customerId: 'cust-1',
            membershipId: 'ms-1',
            // Plan and complimentary are summed separately.
            bucket: 'PLAN',
          },
          // The days column is not even fetched: it is not a quantity.
          _sum: { nights: true },
        }),
      );
    });

    it('treats an empty ledger as a zero balance, not null', async () => {
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { days: null, nights: null },
      });

      await expect(
        service.balanceFor(prisma as any, { customerId: 'cust-1' }),
      ).resolves.toEqual({ days: 0, nights: 0, complimentaryNights: 0 });
    });

    it('covers every membership when none is named', async () => {
      await service.balanceFor(prisma as any, { customerId: 'cust-1' });
      const { where } = prisma.entitlementLedger.aggregate.mock.calls[0][0];
      // No membershipId narrowing; the bucket is always named because plan and
      // complimentary nights are summed apart.
      expect(where).toEqual({ customerId: 'cust-1', bucket: 'PLAN' });
    });

    it('sums the complimentary bucket separately from the plan', async () => {
      prisma.entitlementLedger.aggregate
        .mockResolvedValueOnce({ _sum: { nights: 4 } })   // PLAN
        .mockResolvedValueOnce({ _sum: { nights: 2 } });  // COMPLIMENTARY

      const balance = await service.balanceFor(prisma as any, {
        customerId: 'cust-1',
      });

      /*
       * Not 6. Complimentary nights are a gift on top of the plan, so adding
       * them in would overstate what the plan is worth — the client asked for
       * them counted apart.
       */
      expect(balance.nights).toBe(4);
      expect(balance.complimentaryNights).toBe(2);

      const buckets = prisma.entitlementLedger.aggregate.mock.calls.map(
        (c: any) => c[0].where.bucket,
      );
      expect(buckets).toEqual(['PLAN', 'COMPLIMENTARY']);
    });
  });

  describe('lockMembershipForUpdate (Spec 8.2 step 3)', () => {
    it('issues a SELECT ... FOR UPDATE on the membership row', async () => {
      await service.lockMembershipForUpdate(prisma as any, 'ms-1');

      expect(prisma.$queryRaw).toHaveBeenCalled();
      const sql = prisma.$queryRaw.mock.calls[0][0];
      const text = Array.isArray(sql?.strings)
        ? sql.strings.join('?')
        : String(sql);
      expect(text).toMatch(/FOR UPDATE/i);
      expect(text).toMatch(/"Membership"/);
    });
  });

  describe('recordAllocation', () => {
    it('credits the plan nights, and never a day budget', async () => {
      await service.recordAllocation(prisma as any, {
        customerId: 'cust-1',
        membershipId: 'ms-1',
        nights: 3,
        packageName: 'Gold',
        actorId: SUPER_ADMIN.sub,
      });

      const { data } = prisma.entitlementLedger.create.mock.calls[0][0];
      expect(data).toMatchObject({
        type: LedgerType.ALLOCATION,
        nights: 3,
        actorId: SUPER_ADMIN.sub,
      });
      // A "4 days / 3 nights" plan allocates 3 nights and nothing else: the
      // day figure is the span of those nights, not a second budget.
      expect(data.days).toBe(0);
    });
  });

  describe('balanceFor', () => {
    it('derives the day figure from the nights, never from the column', async () => {
      // The stored days column carries a stale non-zero value from before days
      // stopped being a quantity. It must not reach the balance.
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { days: 999, nights: 6 },
      });

      const balance = await service.balanceFor(prisma as any, {
        customerId: 'cust-1',
      });

      expect(balance).toEqual({ nights: 6, days: 7, complimentaryNights: 6 });
    });

    it('reports zero days when no nights are left, not one', async () => {
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 0 },
      });

      const balance = await service.balanceFor(prisma as any, {
        customerId: 'cust-1',
      });

      expect(balance).toEqual({ nights: 0, days: 0, complimentaryNights: 0 });
    });
  });

  describe('closeMembershipBalance (EXPIRY)', () => {
    it('posts the negative of whatever remains', async () => {
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 1 },
      });

      await service.closeMembershipBalance(prisma as any, {
        customerId: 'cust-1',
        membershipId: 'ms-1',
        reason: 'Membership expired',
        actorId: SUPER_ADMIN.sub,
      });

      const { data } = prisma.entitlementLedger.create.mock.calls[0][0];
      expect(data).toMatchObject({
        type: LedgerType.EXPIRY,
        nights: -1,
      });
    });

    it('writes nothing when the balance is already zero', async () => {
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 0 },
      });

      const result = await service.closeMembershipBalance(prisma as any, {
        customerId: 'cust-1',
        membershipId: 'ms-1',
        reason: 'Membership expired',
        actorId: SUPER_ADMIN.sub,
      });

      expect(result).toBeNull();
      expect(prisma.entitlementLedger.create).not.toHaveBeenCalled();
    });
  });

  describe('reopenMembershipBalance', () => {
    it('reverses the closure as an ADJUSTMENT, not by deleting history', async () => {
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: -1 },
      });

      await service.reopenMembershipBalance(prisma as any, {
        customerId: 'cust-1',
        membershipId: 'ms-1',
        actorId: SUPER_ADMIN.sub,
      });

      const { data } = prisma.entitlementLedger.create.mock.calls[0][0];
      expect(data).toMatchObject({
        type: LedgerType.ADJUSTMENT,
        nights: 1,
      });
    });
  });

  describe('adjust', () => {
    const dto = {
      customerId: 'cust-1',
      membershipId: 'ms-1',
      nights: 1,
      reason: 'Goodwill after a resort closure',
    };

    it('locks the membership before reading the balance', async () => {
      await service.adjust(dto, SUPER_ADMIN);
      expect(prisma.$queryRaw).toHaveBeenCalled();
    });

    it('appends an ADJUSTMENT movement', async () => {
      await service.adjust(dto, SUPER_ADMIN);

      const { data } = prisma.entitlementLedger.create.mock.calls[0][0];
      expect(data).toMatchObject({
        type: LedgerType.ADJUSTMENT,
        nights: 1,
        description: dto.reason,
        actorId: SUPER_ADMIN.sub,
      });
    });

    it('refuses to drive the balance negative', async () => {
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 1 },
      });

      await expect(
        service.adjust({ ...dto, nights: -5 }, SUPER_ADMIN),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.entitlementLedger.create).not.toHaveBeenCalled();
    });

    it('rejects a no-op adjustment', async () => {
      await expect(
        service.adjust({ ...dto, nights: 0 }, SUPER_ADMIN),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects an unreachable customer', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);
      await expect(service.adjust(dto, SUPER_ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("rejects a membership belonging to another customer", async () => {
      prisma.membership.findFirst.mockResolvedValue(null);
      await expect(service.adjust(dto, SUPER_ADMIN)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('scope', () => {
    it('applies no restriction for a Super Admin', async () => {
      await service.findAll({}, SUPER_ADMIN);
      expect(
        prisma.entitlementLedger.findMany.mock.calls[0][0].where.AND[0],
      ).toEqual({});
    });

    it('scopes a Manager through the owning customer', async () => {
      await service.findAll({}, MANAGER_1);
      expect(
        prisma.entitlementLedger.findMany.mock.calls[0][0].where.AND[0],
      ).toEqual({
        customer: {
          OR: [
            { assignedExec: { managerId: MANAGER_1.sub } },
            { assignedExecId: MANAGER_1.sub },
          ],
        },
      });
    });

    it('scopes an Executive to their own customers', async () => {
      await service.findAll({}, EXECUTIVE_A);
      expect(
        prisma.entitlementLedger.findMany.mock.calls[0][0].where.AND[0],
      ).toEqual({ customer: { assignedExecId: EXECUTIVE_A.sub } });
    });

    it('DENIES a balance read for an out-of-scope customer', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);
      await expect(
        service.getBalance({ customerId: 'cust-x' }, EXECUTIVE_A),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getBalance breakdown', () => {
    it('separates credits from debits, in nights', async () => {
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 5 },
      });
      prisma.entitlementLedger.groupBy.mockResolvedValue([
        { type: LedgerType.ALLOCATION, _sum: { nights: 8 }, _count: 1 },
        { type: LedgerType.BOOKING_USAGE, _sum: { nights: -3 }, _count: 1 },
      ]);

      const result = await service.getBalance(
        { customerId: 'cust-1' },
        SUPER_ADMIN,
      );

      expect(result.remaining).toEqual({
        nights: 5,
        days: 6,
        complimentaryNights: 5,
      });
      expect(result.credited).toEqual({ nights: 8 });
      expect(result.debited).toEqual({ nights: 3 });
      expect(result.breakdown).toHaveLength(2);
    });
  });
  /*
   * The client's rule: a plan grants N nights each membership year and unused
   * nights LAPSE at the end of that year. Granting the whole term up front
   * would let a member take five years of nights in month one, which is exactly
   * what lapsing exists to prevent.
   *
   * Both halves are written as real ledger rows, and that is what keeps
   * balanceFor a plain SUM: each past year's allocation and its expiry cancel
   * out, so the sum is the current year's remainder and nothing else.
   */
  describe('reconcileAnnualEntitlement (annual grant and lapse)', () => {
    const START = new Date('2024-08-31T00:00:00.000Z');

    /** A 5-year plan granting 6 nights a year. */
    const annualMembership = (overrides: Record<string, unknown> = {}) => ({
      id: 'ms-1',
      customerId: 'cust-1',
      startDate: START,
      status: 'ACTIVE',
      package: { name: 'Silver', nightsPerYear: 6, validityMonths: 60 },
      ...overrides,
    });

    /** Every ALLOCATION written, as {year, nights}. */
    const allocations = () =>
      prisma.entitlementLedger.create.mock.calls
        .map((c: any) => c[0].data)
        .filter((d: any) => d.type === LedgerType.ALLOCATION)
        .map((d: any) => ({ year: d.yearIndex, nights: d.nights }));

    /** Every EXPIRY written, as {year, nights}. */
    const expiries = () =>
      prisma.entitlementLedger.create.mock.calls
        .map((c: any) => c[0].data)
        .filter((d: any) => d.type === LedgerType.EXPIRY)
        .map((d: any) => ({ year: d.yearIndex, nights: d.nights }));

    beforeEach(() => {
      prisma.membership.findUnique.mockResolvedValue(annualMembership());
      // No allocation rows yet, and nothing left in any past year unless a test
      // says otherwise.
      prisma.entitlementLedger.findMany.mockResolvedValue([]);
      prisma.entitlementLedger.count.mockResolvedValue(0);
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 0 },
      });
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const at = (iso: string) => jest.setSystemTime(new Date(iso));

    it('grants only year 1 in the first year, not the whole term', async () => {
      at('2024-09-15T00:00:00.000Z');

      const res = await service.reconcileAnnualEntitlement(
        prisma as any,
        'ms-1',
        'admin-1',
      );

      expect(allocations()).toEqual([{ year: 1, nights: 6 }]);
      // Emphatically not 30 — that is the whole point of the rule.
      expect(res.allocatedNights).toBe(6);
      expect(expiries()).toEqual([]);
    });

    it('grants the years that have begun and lapses the ones that ended', async () => {
      // Two anniversaries have passed, so the member is in year 3.
      at('2026-09-15T00:00:00.000Z');
      // Years 1 and 2 each still hold their full 6 nights, unused.
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 6 },
      });

      const res = await service.reconcileAnnualEntitlement(
        prisma as any,
        'ms-1',
        'admin-1',
      );

      expect(allocations()).toEqual([
        { year: 1, nights: 6 },
        { year: 2, nights: 6 },
        { year: 3, nights: 6 },
      ]);
      // Years 1 and 2 lapse; year 3 is current and untouched.
      expect(expiries()).toEqual([
        { year: 1, nights: -6 },
        { year: 2, nights: -6 },
      ]);
      expect(res.yearIndex).toBe(3);
      expect(res.lapsedNights).toBe(12);
    });

    it('lapses only what was actually left in a past year', async () => {
      at('2025-09-15T00:00:00.000Z'); // year 2
      // Year 1 had 6, the member used 4, so 2 lapse.
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 2 },
      });

      const res = await service.reconcileAnnualEntitlement(
        prisma as any,
        'ms-1',
        'admin-1',
      );

      expect(expiries()).toEqual([{ year: 1, nights: -2 }]);
      expect(res.lapsedNights).toBe(2);
    });

    it('writes no expiry for a past year the member emptied', async () => {
      at('2025-09-15T00:00:00.000Z');
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 0 },
      });

      await service.reconcileAnnualEntitlement(prisma as any, 'ms-1');

      expect(expiries()).toEqual([]);
    });

    /*
     * Called on every balance read and every booking, so running twice must not
     * grant twice. This is the property that makes lazy reconciliation safe.
     */
    it('is idempotent — a year already granted is not granted again', async () => {
      at('2026-09-15T00:00:00.000Z');
      prisma.entitlementLedger.findMany.mockResolvedValue([
        { yearIndex: 1 },
        { yearIndex: 2 },
        { yearIndex: 3 },
      ]);

      const res = await service.reconcileAnnualEntitlement(
        prisma as any,
        'ms-1',
      );

      expect(allocations()).toEqual([]);
      expect(res.allocatedNights).toBe(0);
    });

    it('does not close a year that already has an expiry', async () => {
      at('2025-09-15T00:00:00.000Z');
      prisma.entitlementLedger.findMany.mockResolvedValue([{ yearIndex: 1 }]);
      prisma.entitlementLedger.count.mockResolvedValue(1);
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 6 },
      });

      await service.reconcileAnnualEntitlement(prisma as any, 'ms-1');

      expect(expiries()).toEqual([]);
    });

    it('dates each row to the year it concerns, not to today', async () => {
      at('2026-09-15T00:00:00.000Z');
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 6 },
      });

      await service.reconcileAnnualEntitlement(prisma as any, 'ms-1');

      const rows = prisma.entitlementLedger.create.mock.calls.map(
        (c: any) => c[0].data,
      );
      const y2 = rows.find(
        (d: any) => d.type === LedgerType.ALLOCATION && d.yearIndex === 2,
      );
      // Year 2 began on the first anniversary. A backfilled year dated today
      // would read as though it had just been granted.
      expect(y2.date.getFullYear()).toBe(2025);
    });

    it('never runs past the term — a 5-year plan stops at year 5', async () => {
      // Well past the end of the term.
      at('2035-01-01T00:00:00.000Z');
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 0 },
      });

      const res = await service.reconcileAnnualEntitlement(
        prisma as any,
        'ms-1',
      );

      expect(res.yearIndex).toBe(5);
      expect(allocations().map((a: any) => a.year)).toEqual([1, 2, 3, 4, 5]);
    });

    it('does nothing for a plan with no annual cap', async () => {
      at('2026-09-15T00:00:00.000Z');
      prisma.membership.findUnique.mockResolvedValue(
        annualMembership({
          package: { name: 'Legacy', nightsPerYear: null, validityMonths: 60 },
        }),
      );

      const res = await service.reconcileAnnualEntitlement(
        prisma as any,
        'ms-1',
      );

      // The older behaviour: one lifetime pool, allocated at purchase.
      expect(res).toEqual({
        yearIndex: null,
        allocatedNights: 0,
        lapsedNights: 0,
      });
      expect(prisma.entitlementLedger.create).not.toHaveBeenCalled();
    });

    /*
     * A cancelled membership has already had its whole balance closed. Topping
     * it up with next year's nights would quietly bring it back to life.
     */
    it('does nothing for a membership that is not ACTIVE', async () => {
      at('2026-09-15T00:00:00.000Z');
      prisma.membership.findUnique.mockResolvedValue(
        annualMembership({ status: 'CANCELLED' }),
      );

      const res = await service.reconcileAnnualEntitlement(
        prisma as any,
        'ms-1',
      );

      expect(res.allocatedNights).toBe(0);
      expect(prisma.entitlementLedger.create).not.toHaveBeenCalled();
    });

    it('grants nothing before the term starts', async () => {
      at('2024-01-01T00:00:00.000Z'); // months before START

      const res = await service.reconcileAnnualEntitlement(
        prisma as any,
        'ms-1',
      );

      expect(res.yearIndex).toBeNull();
      expect(prisma.entitlementLedger.create).not.toHaveBeenCalled();
    });

    it('every row it writes lands in the PLAN bucket', async () => {
      at('2026-09-15T00:00:00.000Z');
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 6 },
      });

      await service.reconcileAnnualEntitlement(prisma as any, 'ms-1');

      const buckets = prisma.entitlementLedger.create.mock.calls.map(
        (c: any) => c[0].data.bucket,
      );
      expect(new Set(buckets)).toEqual(new Set(['PLAN']));
    });
  });

  describe('creditComplimentaryNights', () => {
    it('credits the COMPLIMENTARY bucket, not the plan', async () => {
      await service.creditComplimentaryNights(prisma as any, {
        customerId: 'cust-1',
        membershipId: 'ms-1',
        nights: 2,
        reason: '02N/03D Complimentary',
      });

      const { data } = prisma.entitlementLedger.create.mock.calls[0][0];
      expect(data).toMatchObject({
        type: LedgerType.ALLOCATION,
        bucket: 'COMPLIMENTARY',
        nights: 2,
        description: '02N/03D Complimentary',
      });
    });

    /*
     * A gift is not part of the annual allowance, so the annual lapse must not
     * reach it — which is what leaving yearIndex null achieves.
     */
    it('is not year-scoped, so the annual lapse leaves it alone', async () => {
      await service.creditComplimentaryNights(prisma as any, {
        customerId: 'cust-1',
        membershipId: 'ms-1',
        nights: 2,
        reason: 'Diwali offer',
      });

      const { data } = prisma.entitlementLedger.create.mock.calls[0][0];
      expect(data.yearIndex).toBeNull();
    });

    it('refuses a non-positive gift', async () => {
      await expect(
        service.creditComplimentaryNights(prisma as any, {
          customerId: 'cust-1',
          membershipId: 'ms-1',
          nights: 0,
          reason: 'nothing',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });


});
