// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, MembershipStatus, Role } from '@prisma/client';
import { BookingsService } from './bookings.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { EntitlementsService } from '../entitlements/entitlements.service.js';
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

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: {
    booking: {
      findMany: AnyMock;
      findFirst: AnyMock;
      findUnique: AnyMock;
      count: AnyMock;
      aggregate: AnyMock;
      create: AnyMock;
      update: AnyMock;
    };
    customer: { findFirst: AnyMock };
    membership: { findFirst: AnyMock };
    entitlementLedger: { aggregate: AnyMock };
    $transaction: AnyMock;
  };
  let entitlements: {
    lockMembershipForUpdate: AnyMock;
    reconcileAnnualEntitlement: AnyMock;
    balanceFor: AnyMock;
    record: AnyMock;
  };

  const MEMBERSHIP = {
    id: 'ms-1',
    customerId: 'cust-1',
    status: MembershipStatus.ACTIVE,
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: new Date('2031-01-01T00:00:00.000Z'),
    package: { name: 'Gold' },
  };

  beforeEach(async () => {
    prisma = {
      booking: {
        findMany: mockFn().mockResolvedValue([]),
        findFirst: mockFn().mockResolvedValue(null),
        findUnique: mockFn().mockResolvedValue({ id: 'bk-new' }),
        count: mockFn().mockResolvedValue(0),
        aggregate: mockFn().mockResolvedValue({
          _count: 0,
          _sum: { daysUsed: 0, nightsUsed: 0 },
        }),
        create: mockFn().mockResolvedValue({ id: 'bk-new' }),
        update: mockFn().mockResolvedValue({
          id: 'bk-1',
          status: BookingStatus.CANCELLED,
        }),
      },
      customer: {
        findFirst: mockFn().mockResolvedValue({ id: 'cust-1', name: 'Asha' }),
      },
      membership: { findFirst: mockFn().mockResolvedValue(MEMBERSHIP) },
      entitlementLedger: {
        aggregate: mockFn().mockResolvedValue({ _sum: { nights: -3 } }),
      },
      $transaction: mockFn().mockImplementation((cb: any) => cb(prisma)),
    };

    entitlements = {
      lockMembershipForUpdate: mockFn().mockResolvedValue(undefined),
      // Idle by default: these fixtures use plans with no annual cap, so
      // reconciling grants and lapses nothing.
      reconcileAnnualEntitlement: mockFn().mockResolvedValue({
        yearIndex: null,
        allocatedNights: 0,
        lapsedNights: 0,
      }),
      // Plenty of entitlement by default: 10 days / 8 nights.
      balanceFor: mockFn().mockResolvedValue({ days: 10, nights: 8 }),
      record: mockFn().mockResolvedValue({ id: 'led-1' }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { withinTransaction: mockFn() } },
        { provide: EntitlementsService, useValue: entitlements },
      ],
    }).compile();

    service = moduleRef.get(BookingsService);
  });

  // 15th to 18th = 3 nights, 4 days.
  const dto = {
    customerId: 'cust-1',
    membershipId: 'ms-1',
    checkIn: new Date('2026-06-15T00:00:00.000Z'),
    checkOut: new Date('2026-06-18T00:00:00.000Z'),
  };

  describe('usage derived from the dates', () => {
    it('counts 3 nights and 4 days for a 15th-to-18th stay', async () => {
      await service.create(dto, EXECUTIVE_A);

      const { data } = prisma.booking.create.mock.calls[0][0];
      expect(data.nightsUsed).toBe(3);
      expect(data.daysUsed).toBe(4);
    });

    it('accepts a nights override and keeps the day span in step with it', async () => {
      await service.create({ ...dto, nightsUsed: 1 }, SUPER_ADMIN);

      const { data } = prisma.booking.create.mock.calls[0][0];
      expect(data.nightsUsed).toBe(1);
      // Derived, not taken from the caller — so the stored span can never
      // contradict the nights actually charged.
      expect(data.daysUsed).toBe(2);
    });

    it('rejects check-out on or before check-in', async () => {
      await expect(
        service.create(
          { ...dto, checkOut: new Date('2026-06-15T00:00:00.000Z') },
          SUPER_ADMIN,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('the booking transaction (Spec 8.2)', () => {
    it('locks the membership BEFORE reading the balance', async () => {
      const order: string[] = [];
      entitlements.lockMembershipForUpdate.mockImplementation(async () => {
        order.push('lock');
      });
      entitlements.balanceFor.mockImplementation(async () => {
        order.push('read-balance');
        return { days: 10, nights: 8 };
      });
      prisma.booking.create.mockImplementation(async () => {
        order.push('create');
        return { id: 'bk-new' };
      });

      await service.create(dto, SUPER_ADMIN);

      expect(order).toEqual(['lock', 'read-balance', 'create']);
    });

    it('deducts via a ledger movement, never a counter', async () => {
      await service.create(dto, EXECUTIVE_A);

      expect(entitlements.record).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          type: LedgerType.BOOKING_USAGE,
          nights: -3,
          bookingId: 'bk-new',
          actorId: EXECUTIVE_A.sub,
        }),
      );
    });

    /*
     * The inverse of what this test used to assert, and the reason the rule
     * changed. Charging the day-span as well as the nights made a plan refuse
     * its own last booking: 9 nights split into three 3-night stays costs 9
     * nights but spans 12 days, so a "10 days / 9 nights" plan ran out of days
     * with 3 nights still unused. Days must not be able to refuse anything.
     */
    it('allows a stay the day figure would once have refused', async () => {
      entitlements.balanceFor.mockResolvedValue({ nights: 3, days: 2 });

      await service.create(dto, SUPER_ADMIN);

      expect(prisma.booking.create).toHaveBeenCalled();
      expect(entitlements.record).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ nights: -3 }),
      );
    });

    it('rejects a stay that exceeds the remaining nights', async () => {
      entitlements.balanceFor.mockResolvedValue({ nights: 1, days: 2 });

      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
    });

    it('allows a stay that exactly empties the balance', async () => {
      entitlements.balanceFor.mockResolvedValue({ nights: 3, days: 4 });
      await service.create(dto, SUPER_ADMIN);
      expect(prisma.booking.create).toHaveBeenCalled();
    });

    it('a zero balance blocks any booking', async () => {
      entitlements.balanceFor.mockResolvedValue({ nights: 0, days: 0 });
      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('idempotency (mandatory test in Spec 18)', () => {
    it('returns the original booking without consuming again', async () => {
      const original = { id: 'bk-original', daysUsed: 4 };
      prisma.booking.findUnique.mockResolvedValue(original);

      const result = await service.create(
        { ...dto, idempotencyKey: 'trip-9' },
        SUPER_ADMIN,
      );

      expect(result).toEqual(original);
      expect(prisma.booking.create).not.toHaveBeenCalled();
      expect(entitlements.record).not.toHaveBeenCalled();
      expect(entitlements.lockMembershipForUpdate).not.toHaveBeenCalled();
    });
  });

  describe('membership validity', () => {
    it('refuses to book against a cancelled membership', async () => {
      prisma.membership.findFirst.mockResolvedValue({
        ...MEMBERSHIP,
        status: MembershipStatus.CANCELLED,
      });
      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('refuses a stay ending after the membership expires', async () => {
      prisma.membership.findFirst.mockResolvedValue({
        ...MEMBERSHIP,
        endDate: new Date('2026-06-16T00:00:00.000Z'),
      });
      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('refuses a stay starting before the membership begins', async () => {
      prisma.membership.findFirst.mockResolvedValue({
        ...MEMBERSHIP,
        startDate: new Date('2027-01-01T00:00:00.000Z'),
      });
      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("refuses a membership belonging to another customer", async () => {
      prisma.membership.findFirst.mockResolvedValue(null);
      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('refuses an unreachable customer (scope)', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);
      await expect(service.create(dto, EXECUTIVE_A)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('scope', () => {
    it('applies no restriction for a Super Admin', async () => {
      await service.findAll({}, SUPER_ADMIN);
      expect(prisma.booking.findMany.mock.calls[0][0].where.AND[0]).toEqual({});
    });

    it('scopes a Manager through the owning customer', async () => {
      await service.findAll({}, MANAGER_1);
      expect(prisma.booking.findMany.mock.calls[0][0].where.AND[0]).toEqual({
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
      expect(prisma.booking.findMany.mock.calls[0][0].where.AND[0]).toEqual({
        customer: { assignedExecId: EXECUTIVE_A.sub },
      });
    });

    it('DENIES an out-of-scope booking as 404', async () => {
      prisma.booking.findFirst.mockResolvedValue(null);
      await expect(service.findOne('bk-x', EXECUTIVE_A)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancel — restores what was actually taken', () => {
    const confirmed = {
      id: 'bk-1',
      customerId: 'cust-1',
      membershipId: 'ms-1',
      status: BookingStatus.CONFIRMED,
      daysUsed: 4,
      nightsUsed: 3,
      customer: { id: 'cust-1', name: 'Asha' },
    };

    it('reads the restoration from the ledger, not the booking columns', async () => {
      prisma.booking.findFirst.mockResolvedValue(confirmed);
      // The ledger says 3 nights were taken.
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: -3 },
      });

      await service.cancel('bk-1', EXECUTIVE_A);

      expect(entitlements.record).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          type: LedgerType.CANCELLATION,
          nights: 3,
          bookingId: 'bk-1',
        }),
      );
    });

    it('locks the membership before restoring', async () => {
      prisma.booking.findFirst.mockResolvedValue(confirmed);
      await service.cancel('bk-1', SUPER_ADMIN);
      expect(entitlements.lockMembershipForUpdate).toHaveBeenCalledWith(
        expect.anything(),
        'ms-1',
      );
    });

    it('writes no movement when the ledger nets to zero', async () => {
      prisma.booking.findFirst.mockResolvedValue(confirmed);
      // Already restored by an earlier correction.
      prisma.entitlementLedger.aggregate.mockResolvedValue({
        _sum: { nights: 0 },
      });

      await service.cancel('bk-1', SUPER_ADMIN);
      expect(entitlements.record).not.toHaveBeenCalled();
    });

    it('refuses to cancel twice', async () => {
      prisma.booking.findFirst.mockResolvedValue({
        ...confirmed,
        status: BookingStatus.CANCELLED,
      });
      await expect(service.cancel('bk-1', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
      expect(entitlements.record).not.toHaveBeenCalled();
    });

    it('refuses to cancel a completed stay', async () => {
      prisma.booking.findFirst.mockResolvedValue({
        ...confirmed,
        status: BookingStatus.COMPLETED,
      });
      await expect(service.cancel('bk-1', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('complete', () => {
    it('moves no entitlement — it was deducted at booking time', async () => {
      prisma.booking.findFirst.mockResolvedValue({
        id: 'bk-1',
        status: BookingStatus.CONFIRMED,
      });
      await service.complete('bk-1', SUPER_ADMIN);

      expect(prisma.booking.update).toHaveBeenCalled();
      expect(entitlements.record).not.toHaveBeenCalled();
    });

    it('refuses to complete a cancelled booking', async () => {
      prisma.booking.findFirst.mockResolvedValue({
        id: 'bk-1',
        status: BookingStatus.CANCELLED,
      });
      await expect(service.complete('bk-1', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  /*
   * The bug: submitting the same booking twice was accepted twice. The customer
   * ended up with two identical CONFIRMED stays for 31 Aug to 2 Sept and four
   * nights spent on a two-night holiday. A customer cannot be in two places on
   * the same night, so overlapping stays are refused.
   */
  describe('one stay at a time', () => {
    /** 15th to 18th, matching `dto` above. */
    const day = (n: number) =>
      new Date(`2026-06-${String(n).padStart(2, '0')}T00:00:00.000Z`);

    /*
     * The service normalises every stay date to LOCAL midnight before storing or
     * comparing it, so the guard's where clause carries normalised values rather
     * than the raw ones from the DTO. The test has to normalise the same way, or
     * it only passes in UTC.
     */
    const midnight = (value: Date) => {
      const d = new Date(value);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    /** The where clause the guard built, from the create call. */
    const clashWhere = () => {
      const call = prisma.booking.findFirst.mock.calls.find(
        (c) => c[0]?.where?.checkIn?.lt !== undefined,
      );
      return call?.[0]?.where;
    };

    const existing = (from: number, to: number, status = 'CONFIRMED') => ({
      id: 'bk-existing',
      checkIn: day(from),
      checkOut: day(to),
      status,
    });

    it('refuses an exact duplicate', async () => {
      prisma.booking.findFirst.mockResolvedValue(existing(15, 18));

      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.booking.create).not.toHaveBeenCalled();
      expect(entitlements.record).not.toHaveBeenCalled();
    });

    it('names the clashing dates so the user can act on it', async () => {
      prisma.booking.findFirst.mockResolvedValue(existing(15, 18));

      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        /2026-06-15 to 2026-06-18/,
      );
    });

    it('queries for any stay straddling the requested dates', async () => {
      await service.create(dto, SUPER_ADMIN);

      const where = clashWhere();
      // Half-open: checkIn < newCheckOut AND checkOut > newCheckIn. This is what
      // makes a back-to-back stay legal and an overlapping one not.
      expect(where.checkIn.lt).toEqual(midnight(dto.checkOut));
      expect(where.checkOut.gt).toEqual(midnight(dto.checkIn));
    });

    it('ignores cancelled stays, which returned their nights', async () => {
      await service.create(dto, SUPER_ADMIN);

      expect(clashWhere().status).toEqual({ not: 'CANCELLED' });
    });

    it('looks across the whole customer, not just this membership', async () => {
      await service.create(dto, SUPER_ADMIN);

      expect(clashWhere().customerId).toBe('cust-1');
      expect(clashWhere().membershipId).toBeUndefined();
    });

    it('checks for a clash only AFTER the membership is locked', async () => {
      const order: string[] = [];
      entitlements.lockMembershipForUpdate.mockImplementation(async () => {
        order.push('lock');
      });
      prisma.booking.findFirst.mockImplementation(async (arg: any) => {
        if (arg?.where?.checkIn?.lt !== undefined) order.push('clash-check');
        return null;
      });

      await service.create(dto, SUPER_ADMIN);

      /*
       * Order is the whole guard. Checking before the lock would let two
       * concurrent identical requests both read "no clash" and both insert —
       * exactly the duplicate this test exists to prevent.
       */
      expect(order).toEqual(['lock', 'clash-check']);
    });

    it('allows a stay that begins the day the last one ended', async () => {
      // No clash row: the half-open query would not have matched one.
      prisma.booking.findFirst.mockResolvedValue(null);

      await service.create(
        {
          ...dto,
          checkIn: new Date('2026-06-18T00:00:00.000Z'),
          checkOut: new Date('2026-06-20T00:00:00.000Z'),
        },
        SUPER_ADMIN,
      );

      expect(prisma.booking.create).toHaveBeenCalled();
    });
  });

});
