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
    membership: { findFirst: AnyMock };
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
      membership: { findFirst: mockFn().mockResolvedValue({ id: 'ms-1' }) },
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

      expect(balance).toEqual({ nights: 5, days: 6 });
      expect(prisma.entitlementLedger.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { customerId: 'cust-1', membershipId: 'ms-1' },
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
      ).resolves.toEqual({ days: 0, nights: 0 });
    });

    it('covers every membership when none is named', async () => {
      await service.balanceFor(prisma as any, { customerId: 'cust-1' });
      const { where } = prisma.entitlementLedger.aggregate.mock.calls[0][0];
      expect(where).toEqual({ customerId: 'cust-1' });
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

      expect(balance).toEqual({ nights: 6, days: 7 });
    });

    it('reports zero days when no nights are left, not one', async () => {
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 0 },
      });

      const balance = await service.balanceFor(prisma as any, {
        customerId: 'cust-1',
      });

      expect(balance).toEqual({ nights: 0, days: 0 });
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

      expect(result.remaining).toEqual({ nights: 5, days: 6 });
      expect(result.credited).toEqual({ nights: 8 });
      expect(result.debited).toEqual({ nights: 3 });
      expect(result.breakdown).toHaveLength(2);
    });
  });
});
