// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaymentsService } from './payments.service.js';
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

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: {
    payment: {
      findMany: AnyMock;
      findFirst: AnyMock;
      findUnique: AnyMock;
      count: AnyMock;
      aggregate: AnyMock;
      create: AnyMock;
      update: AnyMock;
      delete: AnyMock;
    };
    customer: { findFirst: AnyMock; update: AnyMock; aggregate: AnyMock; count: AnyMock };
    membership: { findFirst: AnyMock; findMany: AnyMock };
    $transaction: AnyMock;
  };

  // 90,000 plan with 30,000 already paid.
  const CUSTOMER = {
    id: 'cust-1',
    name: 'Asha Rao',
    amount: 90000,
    amountPaid: 30000,
    pendingAmount: 60000,
  };

  beforeEach(async () => {
    prisma = {
      payment: {
        findMany: mockFn().mockResolvedValue([]),
        findFirst: mockFn().mockResolvedValue(null),
        findUnique: mockFn().mockResolvedValue(null),
        count: mockFn().mockResolvedValue(0),
        aggregate: mockFn().mockResolvedValue({ _sum: { amount: 0 }, _count: 0 }),
        create: mockFn().mockResolvedValue({ id: 'pay-new', method: 'UPI' }),
        update: mockFn().mockResolvedValue({
          id: 'pay-1',
          method: 'Cash',
          date: new Date('2026-02-01T00:00:00.000Z'),
          notes: 'corrected',
        }),
        delete: mockFn().mockResolvedValue({ id: 'pay-1' }),
      },
      customer: {
        findFirst: mockFn().mockResolvedValue(CUSTOMER),
        update: mockFn().mockResolvedValue(CUSTOMER),
        aggregate: mockFn().mockResolvedValue({ _sum: {} }),
        count: mockFn().mockResolvedValue(0),
      },
      membership: {
        findFirst: mockFn().mockResolvedValue({ id: 'ms-1' }),
        // Default: no active membership, so a payment that names none stays
        // unattributed. Tests that care set this explicitly.
        findMany: mockFn().mockResolvedValue([]),
      },
      $transaction: mockFn().mockImplementation((cb: any) => cb(prisma)),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { withinTransaction: mockFn() } },
      ],
    }).compile();

    service = moduleRef.get(PaymentsService);
  });

  const dto = { customerId: 'cust-1', amount: 20000, method: 'UPI' };

  describe('scope (Spec 2.3 / 18)', () => {
    it('applies no restriction for a Super Admin', async () => {
      await service.findAll({}, SUPER_ADMIN);
      expect(prisma.payment.findMany.mock.calls[0][0].where.AND[0]).toEqual({});
    });

    it('scopes a Manager through the owning customer', async () => {
      await service.findAll({}, MANAGER_1);
      expect(prisma.payment.findMany.mock.calls[0][0].where.AND[0]).toEqual({
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
      expect(prisma.payment.findMany.mock.calls[0][0].where.AND[0]).toEqual({
        customer: { assignedExecId: EXECUTIVE_A.sub },
      });
    });

    it('refuses to record against an unreachable customer', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);
      await expect(service.create(dto, EXECUTIVE_A)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.payment.create).not.toHaveBeenCalled();
    });

    it('DENIES reading an out-of-scope payment as 404', async () => {
      prisma.payment.findFirst.mockResolvedValue(null);
      await expect(service.findOne('pay-x', EXECUTIVE_A)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create — running totals (Spec 9.1)', () => {
    it('advances amountPaid and lowers pendingAmount', async () => {
      await service.create(dto, EXECUTIVE_A);

      const { data } = prisma.customer.update.mock.calls[0][0];
      expect(data).toEqual({ amountPaid: 50000, pendingAmount: 40000 });
    });

    it('never drives pending below zero on an overpayment', async () => {
      await service.create({ ...dto, amount: 100000 }, SUPER_ADMIN);

      const { data } = prisma.customer.update.mock.calls[0][0];
      expect(data.amountPaid).toBe(130000);
      expect(data.pendingAmount).toBe(0);
    });

    it('rounds to paise so float error cannot accumulate', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        ...CUSTOMER,
        amountPaid: 0.1,
        amount: 1,
      });
      await service.create({ ...dto, amount: 0.2 }, SUPER_ADMIN);

      const { data } = prisma.customer.update.mock.calls[0][0];
      // 0.1 + 0.2 would otherwise be 0.30000000000000004
      expect(data.amountPaid).toBe(0.3);
    });

    it('rejects a membership belonging to another customer', async () => {
      prisma.membership.findFirst.mockResolvedValue(null);
      await expect(
        service.create({ ...dto, membershipId: 'ms-other' }, SUPER_ADMIN),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.payment.create).not.toHaveBeenCalled();
    });
  });

  describe('idempotency (Spec 8, mandatory test in Spec 18)', () => {
    it('returns the original payment instead of creating a duplicate', async () => {
      const original = { id: 'pay-original', amount: 20000 };
      prisma.payment.findUnique.mockResolvedValue(original);

      const result = await service.create(
        { ...dto, idempotencyKey: 'receipt-42' },
        SUPER_ADMIN,
      );

      expect(result).toEqual(original);
      expect(prisma.payment.create).not.toHaveBeenCalled();
      // Crucially the totals must not move a second time.
      expect(prisma.customer.update).not.toHaveBeenCalled();
    });

    it('records normally when the key is unseen', async () => {
      prisma.payment.findUnique.mockResolvedValue(null);
      await service.create({ ...dto, idempotencyKey: 'receipt-43' }, SUPER_ADMIN);
      expect(prisma.payment.create).toHaveBeenCalled();
    });
  });

  describe('update — amount is immutable', () => {
    it('changes only method, date and notes', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'pay-1',
        amount: 20000,
        method: 'UPI',
        date: new Date('2026-01-01T00:00:00.000Z'),
        notes: null,
      });

      await service.update(
        'pay-1',
        { method: 'Cash', notes: 'corrected' },
        SUPER_ADMIN,
      );

      const { data } = prisma.payment.update.mock.calls[0][0];
      expect(data).toEqual({ method: 'Cash', notes: 'corrected' });
      expect(data).not.toHaveProperty('amount');
      // Totals are untouched because the amount cannot change.
      expect(prisma.customer.update).not.toHaveBeenCalled();
    });
  });

  describe('remove — reverses the totals', () => {
    it('subtracts the payment from amountPaid and restores pending', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'pay-1',
        amount: 20000,
        method: 'UPI',
        date: new Date('2026-01-01T00:00:00.000Z'),
        customer: CUSTOMER,
      });

      await expect(service.remove('pay-1', SUPER_ADMIN)).resolves.toEqual({
        message: 'Payment deleted successfully',
      });

      const { data } = prisma.customer.update.mock.calls[0][0];
      expect(data).toEqual({ amountPaid: 10000, pendingAmount: 80000 });
    });

    it('never drives amountPaid below zero', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 'pay-1',
        amount: 999999,
        method: null,
        date: new Date(),
        customer: CUSTOMER,
      });

      await service.remove('pay-1', SUPER_ADMIN);
      expect(prisma.customer.update.mock.calls[0][0].data.amountPaid).toBe(0);
    });
  });

  describe('findAll', () => {
    it('totals the whole filtered set, not just the page', async () => {
      prisma.payment.count.mockResolvedValue(30);
      prisma.payment.aggregate.mockResolvedValue({ _sum: { amount: 450000 } });

      const res = await service.findAll({ limit: 10 }, SUPER_ADMIN);
      expect(res.meta.totalAmount).toBe(450000);
      expect(res.meta.totalPages).toBe(3);
    });
  });
});
