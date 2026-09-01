// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RefundsService } from './refunds.service.js';
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

describe('RefundsService', () => {
  let service: RefundsService;
  let prisma: {
    refund: {
      findMany: AnyMock;
      findFirst: AnyMock;
      findUnique: AnyMock;
      count: AnyMock;
      aggregate: AnyMock;
      create: AnyMock;
      update: AnyMock;
      delete: AnyMock;
    };
    customer: { findFirst: AnyMock; update: AnyMock };
    membership: { findFirst: AnyMock };
    $transaction: AnyMock;
  };

  const CUSTOMER = { id: 'cust-1', name: 'Asha Rao', amountPaid: 30000 };

  beforeEach(async () => {
    prisma = {
      refund: {
        findMany: mockFn().mockResolvedValue([]),
        findFirst: mockFn().mockResolvedValue(null),
        findUnique: mockFn().mockResolvedValue(null),
        count: mockFn().mockResolvedValue(0),
        aggregate: mockFn().mockResolvedValue({
          _sum: { amount: 0 },
          _count: 0,
        }),
        create: mockFn().mockResolvedValue({ id: 'ref-new', reason: 'Change' }),
        update: mockFn().mockResolvedValue({
          id: 'ref-1',
          date: new Date('2026-02-01T00:00:00.000Z'),
          reason: 'updated',
        }),
        delete: mockFn().mockResolvedValue({ id: 'ref-1' }),
      },
      customer: {
        findFirst: mockFn().mockResolvedValue(CUSTOMER),
        // Present so the test can prove it is never called.
        update: mockFn(),
      },
      membership: { findFirst: mockFn().mockResolvedValue({ id: 'ms-1' }) },
      $transaction: mockFn().mockImplementation((cb: any) => cb(prisma)),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RefundsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { withinTransaction: mockFn() } },
      ],
    }).compile();

    service = moduleRef.get(RefundsService);
  });

  const dto = { customerId: 'cust-1', amount: 10000, reason: 'Plan change' };

  describe('scope', () => {
    it('applies no restriction for a Super Admin', async () => {
      await service.findAll({}, SUPER_ADMIN);
      expect(prisma.refund.findMany.mock.calls[0][0].where.AND[0]).toEqual({});
    });

    it('scopes a Manager through the owning customer', async () => {
      await service.findAll({}, MANAGER_1);
      expect(prisma.refund.findMany.mock.calls[0][0].where.AND[0]).toEqual({
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
      expect(prisma.refund.findMany.mock.calls[0][0].where.AND[0]).toEqual({
        customer: { assignedExecId: EXECUTIVE_A.sub },
      });
    });

    it('refuses to refund an unreachable customer', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);
      await expect(service.create(dto, MANAGER_1)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.refund.create).not.toHaveBeenCalled();
    });
  });

  describe('create — cannot refund more than was received', () => {
    it('allows a refund within the paid amount', async () => {
      await service.create(dto, SUPER_ADMIN);
      expect(prisma.refund.create).toHaveBeenCalled();
      const { data } = prisma.refund.create.mock.calls[0][0];
      expect(data.amount).toBe(10000);
      // Whoever records it is the approver of record (Spec 22 #3 unconfirmed).
      expect(data.approvedById).toBe(SUPER_ADMIN.sub);
    });

    it('rejects a refund above the amount paid', async () => {
      await expect(
        service.create({ ...dto, amount: 40000 }, SUPER_ADMIN),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.refund.create).not.toHaveBeenCalled();
    });

    it('accounts for refunds already issued', async () => {
      // 30,000 paid, 25,000 already refunded -> only 5,000 refundable.
      prisma.refund.aggregate.mockResolvedValue({ _sum: { amount: 25000 } });

      await expect(
        service.create({ ...dto, amount: 6000 }, SUPER_ADMIN),
      ).rejects.toThrow(BadRequestException);

      await service.create({ ...dto, amount: 5000 }, SUPER_ADMIN);
      expect(prisma.refund.create).toHaveBeenCalled();
    });

    it('rejects a membership belonging to another customer', async () => {
      prisma.membership.findFirst.mockResolvedValue(null);
      await expect(
        service.create({ ...dto, membershipId: 'ms-other' }, SUPER_ADMIN),
      ).rejects.toThrow(BadRequestException);
    });

    it('does not silently alter the customer payment totals (Spec 22 #3)', async () => {
      await service.create(dto, SUPER_ADMIN);

      // Whether a refund should reduce amountPaid is unconfirmed, so the
      // customer record must be left exactly as it was.
      expect(prisma.refund.create).toHaveBeenCalled();
      expect(prisma.customer.update).not.toHaveBeenCalled();
    });
  });

  describe('idempotency', () => {
    it('returns the original refund rather than duplicating it', async () => {
      const original = { id: 'ref-original', amount: 10000 };
      prisma.refund.findUnique.mockResolvedValue(original);

      const result = await service.create(
        { ...dto, idempotencyKey: 'rf-7' },
        SUPER_ADMIN,
      );

      expect(result).toEqual(original);
      expect(prisma.refund.create).not.toHaveBeenCalled();
    });
  });

  describe('update — amount is immutable', () => {
    it('changes only date and reason', async () => {
      prisma.refund.findFirst.mockResolvedValue({
        id: 'ref-1',
        amount: 10000,
        date: new Date('2026-01-01T00:00:00.000Z'),
        reason: 'old',
      });

      await service.update('ref-1', { reason: 'updated' }, SUPER_ADMIN);

      const { data } = prisma.refund.update.mock.calls[0][0];
      expect(data).toEqual({ reason: 'updated' });
      expect(data).not.toHaveProperty('amount');
    });
  });

  describe('remove', () => {
    it('deletes and reports', async () => {
      prisma.refund.findFirst.mockResolvedValue({
        id: 'ref-1',
        amount: 10000,
        reason: 'Plan change',
        date: new Date('2026-01-01T00:00:00.000Z'),
        customer: { id: 'cust-1', name: 'Asha Rao' },
      });

      await expect(service.remove('ref-1', SUPER_ADMIN)).resolves.toEqual({
        message: 'Refund deleted successfully',
      });
      expect(prisma.refund.delete).toHaveBeenCalled();
    });

    it('DENIES deleting an out-of-scope refund as 404', async () => {
      prisma.refund.findFirst.mockResolvedValue(null);
      await expect(service.remove('ref-x', SUPER_ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
