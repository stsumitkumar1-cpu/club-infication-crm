// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { MembershipStatus, Role } from '@prisma/client';
import { MembershipsService } from './memberships.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { EntitlementsService } from '../entitlements/entitlements.service.js';
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

describe('MembershipsService', () => {
  let service: MembershipsService;
  let prisma: {
    membership: {
      findMany: AnyMock;
      findFirst: AnyMock;
      count: AnyMock;
      create: AnyMock;
      update: AnyMock;
      delete: AnyMock;
    };
    customer: {
      findFirst: AnyMock;
      findUniqueOrThrow: AnyMock;
      update: AnyMock;
    };
    package: { findUnique: AnyMock; findUniqueOrThrow: AnyMock };
    payment: { updateMany: AnyMock };
    booking: { count: AnyMock };
    entitlementLedger: { count: AnyMock };
    $transaction: AnyMock;
  };
  let entitlements: {
    recordAllocation: AnyMock;
    closeMembershipBalance: AnyMock;
    reopenMembershipBalance: AnyMock;
    lockMembershipForUpdate: AnyMock;
    reconcileAnnualEntitlement: AnyMock;
  };

  const GOLD = {
    id: 'pkg-gold',
    name: 'Gold',
    price: 90000,
    days: 4,
    nights: 3,
    validityMonths: 60,
    isActive: true,
  };

  const CUSTOMER = {
    id: 'cust-1',
    name: 'Asha Rao',
    plan: 'Silver',
    validity: '3 Years',
    totalDays: 3,
    totalNights: 2,
  };

  beforeEach(async () => {
    prisma = {
      membership: {
        findMany: mockFn().mockResolvedValue([]),
        findFirst: mockFn().mockResolvedValue(null),
        count: mockFn().mockResolvedValue(0),
        create: mockFn().mockResolvedValue({ id: 'ms-new' }),
        // Prisma returns the whole row from an update, and the audit metadata
        // reads its dates — so the mock has to be a realistic record.
        update: mockFn().mockResolvedValue({
          id: 'ms-1',
          customerId: 'cust-1',
          packageId: 'pkg-gold',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2031-01-01T00:00:00.000Z'),
          status: MembershipStatus.ACTIVE,
        }),
        delete: mockFn().mockResolvedValue({ id: 'ms-1' }),
      },
      customer: {
        findFirst: mockFn().mockResolvedValue(CUSTOMER),
        findUniqueOrThrow: mockFn().mockResolvedValue(CUSTOMER),
        update: mockFn().mockResolvedValue({
          plan: 'Gold',
          validity: '5 Years',
          totalDays: 4,
          totalNights: 3,
        }),
      },
      // recordSaleWithinTransaction re-reads both through the transaction
      // client, so the *OrThrow variants have to answer too.
      package: {
        findUnique: mockFn().mockResolvedValue(GOLD),
        findUniqueOrThrow: mockFn().mockResolvedValue(GOLD),
      },
      payment: { updateMany: mockFn().mockResolvedValue({ count: 0 }) },
      booking: { count: mockFn().mockResolvedValue(0) },
      entitlementLedger: { count: mockFn().mockResolvedValue(0) },
      $transaction: mockFn().mockImplementation((cb: any) => cb(prisma)),
    };

    entitlements = {
      recordAllocation: mockFn().mockResolvedValue({
        id: 'led-alloc',
        days: 4,
        nights: 3,
      }),
      closeMembershipBalance: mockFn().mockResolvedValue({
        id: 'led-expiry',
        days: -4,
        nights: -3,
      }),
      reopenMembershipBalance: mockFn().mockResolvedValue({
        id: 'led-reopen',
        days: 4,
        nights: 3,
      }),
      lockMembershipForUpdate: mockFn().mockResolvedValue(undefined),
      // Idle by default: these fixtures use plans with no annual cap, so
      // reconciling grants and lapses nothing.
      reconcileAnnualEntitlement: mockFn().mockResolvedValue({
        yearIndex: null,
        allocatedNights: 0,
        lapsedNights: 0,
      }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        MembershipsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { withinTransaction: mockFn() } },
        { provide: EntitlementsService, useValue: entitlements },
      ],
    }).compile();

    service = moduleRef.get(MembershipsService);
  });

  const dto = { customerId: 'cust-1', packageId: 'pkg-gold' };

  describe('scope (Spec 2.3 / 18)', () => {
    it('applies no restriction for a Super Admin', async () => {
      await service.findAll({}, SUPER_ADMIN);
      expect(prisma.membership.findMany.mock.calls[0][0].where.AND[0]).toEqual(
        {},
      );
    });

    it('scopes a Manager through the owning customer', async () => {
      await service.findAll({}, MANAGER_1);
      expect(prisma.membership.findMany.mock.calls[0][0].where.AND[0]).toEqual({
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
      expect(prisma.membership.findMany.mock.calls[0][0].where.AND[0]).toEqual({
        customer: { assignedExecId: EXECUTIVE_A.sub },
      });
    });

    it('DENIES reading an out-of-scope membership as 404', async () => {
      prisma.membership.findFirst.mockResolvedValue(null);
      await expect(service.findOne('ms-x', EXECUTIVE_A)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('refuses to attach a membership to an unreachable customer', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);
      await expect(service.create(dto, EXECUTIVE_A)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.membership.create).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('derives the end date from the package validity', async () => {
      const start = new Date('2026-01-15T00:00:00.000Z');
      await service.create({ ...dto, startDate: start }, SUPER_ADMIN);

      const { data } = prisma.membership.create.mock.calls[0][0];
      // 60 months on from January 2026 is January 2031.
      expect(data.endDate.getFullYear()).toBe(2031);
      expect(data.endDate.getMonth()).toBe(0);
      expect(data.status).toBe(MembershipStatus.ACTIVE);
    });

    it('clamps a month-end start date instead of overflowing', async () => {
      // 31 Jan + 1 month must not become 2/3 March.
      prisma.package.findUnique.mockResolvedValue({
        ...GOLD,
        validityMonths: 1,
      });
      await service.create(
        { ...dto, startDate: new Date('2026-01-31T00:00:00.000Z') },
        SUPER_ADMIN,
      );

      const { data } = prisma.membership.create.mock.calls[0][0];
      expect(data.endDate.getMonth()).toBe(1); // February
    });

    it('honours an explicit end date', async () => {
      const start = new Date('2026-01-01T00:00:00.000Z');
      const end = new Date('2026-06-01T00:00:00.000Z');
      await service.create(
        { ...dto, startDate: start, endDate: end },
        SUPER_ADMIN,
      );
      expect(prisma.membership.create.mock.calls[0][0].data.endDate).toEqual(
        end,
      );
    });

    it('rejects an end date at or before the start', async () => {
      await expect(
        service.create(
          {
            ...dto,
            startDate: new Date('2026-06-01'),
            endDate: new Date('2026-01-01'),
          },
          SUPER_ADMIN,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('refuses to sell an inactive plan', async () => {
      prisma.package.findUnique.mockResolvedValue({ ...GOLD, isActive: false });
      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects an unknown plan', async () => {
      prisma.package.findUnique.mockResolvedValue(null);
      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('allows only one active membership per customer (Spec 22 #11)', async () => {
      prisma.membership.findFirst.mockResolvedValue({
        id: 'ms-existing',
        package: { name: 'Silver' },
      });
      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.membership.create).not.toHaveBeenCalled();
    });

    it('allocates the plan nights into the ledger (Spec 7 / 8.1)', async () => {
      await service.create(dto, SUPER_ADMIN);

      const [, params] = entitlements.recordAllocation.mock.calls[0];
      expect(params).toMatchObject({
        customerId: 'cust-1',
        nights: 3,
        packageName: 'Gold',
        actorId: SUPER_ADMIN.sub,
      });
      // A 4-day / 3-night plan allocates 3 nights and no day budget.
      expect(params.days).toBeUndefined();
    });

    it("syncs the customer's plan columns but not their money", async () => {
      await service.create(dto, SUPER_ADMIN);

      const { data } = prisma.customer.update.mock.calls[0][0];
      expect(data).toEqual({
        plan: 'Gold',
        validity: '5 Years',
        totalDays: 4,
        totalNights: 3,
      });
      expect(data).not.toHaveProperty('amount');
      expect(data).not.toHaveProperty('amountPaid');
      expect(data).not.toHaveProperty('pendingAmount');
    });
  });

  describe('update', () => {
    const existing = {
      id: 'ms-1',
      customerId: 'cust-1',
      packageId: 'pkg-gold',
      startDate: new Date('2026-01-01T00:00:00.000Z'),
      endDate: new Date('2031-01-01T00:00:00.000Z'),
      status: MembershipStatus.CANCELLED,
    };

    it('blocks reactivating into a second active membership', async () => {
      prisma.membership.findFirst
        .mockResolvedValueOnce(existing) // scope lookup
        .mockResolvedValueOnce({ id: 'ms-other' }); // another ACTIVE one

      await expect(
        service.update('ms-1', { status: MembershipStatus.ACTIVE }, SUPER_ADMIN),
      ).rejects.toThrow(ConflictException);
    });

    it('allows reactivating when nothing else is active', async () => {
      prisma.membership.findFirst
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(null);

      await service.update(
        'ms-1',
        { status: MembershipStatus.ACTIVE },
        SUPER_ADMIN,
      );
      expect(prisma.membership.update).toHaveBeenCalled();
    });

    it('cancelling keeps the record and only moves the status', async () => {
      prisma.membership.findFirst.mockResolvedValue({
        ...existing,
        status: MembershipStatus.ACTIVE,
      });
      await service.setStatus('ms-1', MembershipStatus.CANCELLED, SUPER_ADMIN);

      const { data } = prisma.membership.update.mock.calls[0][0];
      expect(data.status).toBe(MembershipStatus.CANCELLED);
      expect(prisma.membership.delete).not.toHaveBeenCalled();
    });

    it('closes the remaining balance when a membership ends (Spec 7 EXPIRY)', async () => {
      prisma.membership.findFirst.mockResolvedValue({
        ...existing,
        status: MembershipStatus.ACTIVE,
      });
      await service.setStatus('ms-1', MembershipStatus.EXPIRED, SUPER_ADMIN);

      expect(entitlements.lockMembershipForUpdate).toHaveBeenCalled();
      expect(entitlements.closeMembershipBalance).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ customerId: 'cust-1', membershipId: 'ms-1' }),
      );
    });

    it('restores the balance when a membership is reactivated', async () => {
      prisma.membership.findFirst
        .mockResolvedValueOnce({ ...existing, status: MembershipStatus.EXPIRED })
        .mockResolvedValueOnce(null); // nothing else active

      await service.setStatus('ms-1', MembershipStatus.ACTIVE, SUPER_ADMIN);

      expect(entitlements.reopenMembershipBalance).toHaveBeenCalled();
      expect(entitlements.closeMembershipBalance).not.toHaveBeenCalled();
    });

    it('a plain field edit moves no entitlement', async () => {
      prisma.membership.findFirst.mockResolvedValue({
        ...existing,
        status: MembershipStatus.ACTIVE,
      });
      await service.update('ms-1', { endDate: new Date('2032-01-01') }, SUPER_ADMIN);

      expect(entitlements.closeMembershipBalance).not.toHaveBeenCalled();
      expect(entitlements.reopenMembershipBalance).not.toHaveBeenCalled();
    });
  });

  describe('remove (Spec 6.3)', () => {
    beforeEach(() => {
      prisma.membership.findFirst.mockResolvedValue({
        id: 'ms-1',
        customerId: 'cust-1',
        packageId: 'pkg-gold',
        startDate: new Date('2026-01-01'),
        status: MembershipStatus.ACTIVE,
      });
    });

    it('refuses to delete a membership with bookings', async () => {
      prisma.booking.count.mockResolvedValue(2);
      await expect(service.remove('ms-1', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.membership.delete).not.toHaveBeenCalled();
    });

    it('refuses to delete a membership with ledger entries', async () => {
      prisma.entitlementLedger.count.mockResolvedValue(1);
      await expect(service.remove('ms-1', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deletes an unused membership', async () => {
      await expect(service.remove('ms-1', SUPER_ADMIN)).resolves.toEqual({
        message: 'Membership deleted successfully',
      });
      expect(prisma.membership.delete).toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('scopes every counter to the caller', async () => {
      await service.getStats(EXECUTIVE_A);
      for (const call of prisma.membership.count.mock.calls) {
        expect(call[0].where.AND[0]).toEqual({
          customer: { assignedExecId: EXECUTIVE_A.sub },
        });
      }
    });
  });

  /*
   * The bug: cancelling a plan updated the membership row and nothing else, so
   * the customer list kept reading ACTIVE while the customer's own page showed
   * CANCELLED. Customer.status is a mirror of the memberships behind it (Spec 11
   * names the filter "Membership status"), and these pin that it stays one.
   */
  describe('Customer.status mirrors the memberships', () => {
    /** The customer.update call that carried a status, if any. */
    const statusWrite = () =>
      prisma.customer.update.mock.calls
        .map((call: any) => call[0])
        .find((arg: any) => arg?.data?.status !== undefined);

    const activeMembership = {
      id: 'ms-1',
      customerId: 'cust-1',
      status: 'ACTIVE',
      packageId: 'pkg-1',
      startDate: new Date('2026-01-01T00:00:00.000Z'),
      endDate: new Date('2026-12-31T00:00:00.000Z'),
      customer: { id: 'cust-1', name: 'Asha' },
    };

    beforeEach(() => {
      prisma.membership.findFirst.mockResolvedValue(activeMembership);
    });

    it('marks the customer CANCELLED when their only plan is cancelled', async () => {
      prisma.membership.findMany.mockResolvedValue([{ status: 'CANCELLED' }]);

      await service.setStatus('ms-1', 'CANCELLED' as any, SUPER_ADMIN);

      expect(statusWrite()).toMatchObject({
        where: { id: 'cust-1' },
        data: { status: 'CANCELLED' },
      });
    });

    it('marks the customer EXPIRED when their only plan expires', async () => {
      prisma.membership.findMany.mockResolvedValue([{ status: 'EXPIRED' }]);

      await service.setStatus('ms-1', 'EXPIRED' as any, SUPER_ADMIN);

      // Not CANCELLED: the customer never cancelled, their term ran out.
      expect(statusWrite()?.data.status).toBe('EXPIRED');
    });

    it('keeps the customer ACTIVE while any plan is still live', async () => {
      // One cancelled, one still running — the live one wins.
      prisma.membership.findMany.mockResolvedValue([
        { status: 'CANCELLED' },
        { status: 'ACTIVE' },
      ]);

      await service.setStatus('ms-1', 'CANCELLED' as any, SUPER_ADMIN);

      expect(statusWrite()?.data.status).toBe('ACTIVE');
    });

    it('restores ACTIVE when a plan is reactivated', async () => {
      // update() calls findFirst twice: once to load this membership, then
      // again to check no OTHER active one exists. The second must be null or
      // reactivation is refused as a duplicate.
      prisma.membership.findFirst
        .mockResolvedValueOnce({ ...activeMembership, status: 'CANCELLED' })
        .mockResolvedValueOnce(null);
      prisma.membership.findMany.mockResolvedValue([{ status: 'ACTIVE' }]);

      await service.setStatus('ms-1', 'ACTIVE' as any, SUPER_ADMIN);

      expect(statusWrite()?.data.status).toBe('ACTIVE');
    });

    it('leaves a customer with no memberships alone', async () => {
      prisma.membership.findMany.mockResolvedValue([]);

      await service.setStatus('ms-1', 'CANCELLED' as any, SUPER_ADMIN);

      // Nothing to derive from, so a deliberate PENDING is not overwritten.
      expect(statusWrite()).toBeUndefined();
    });

    it('activates the customer when a plan is first recorded', async () => {
      // create() refuses a second live plan, so this customer must have none.
      prisma.membership.findFirst.mockResolvedValue(null);
      prisma.membership.findMany.mockResolvedValue([{ status: 'ACTIVE' }]);

      await service.create(dto, SUPER_ADMIN);

      expect(statusWrite()?.data.status).toBe('ACTIVE');
    });

    it('writes the status in the same transaction as the membership', async () => {
      prisma.membership.findMany.mockResolvedValue([{ status: 'CANCELLED' }]);
      const order: string[] = [];
      prisma.membership.update.mockImplementation(async () => {
        order.push('membership');
        return { ...activeMembership, status: 'CANCELLED' };
      });
      prisma.customer.update.mockImplementation(async (arg: any) => {
        if (arg?.data?.status !== undefined) order.push('customer-status');
        return {};
      });

      await service.setStatus('ms-1', 'CANCELLED' as any, SUPER_ADMIN);

      // Both inside the one $transaction the mock runs inline, so the list can
      // never be observed disagreeing with the membership.
      expect(order).toEqual(['membership', 'customer-status']);
    });
  });

});
