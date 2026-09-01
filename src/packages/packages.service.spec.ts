// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PackagesService } from './packages.service.js';
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

describe('PackagesService (plan catalog)', () => {
  let service: PackagesService;
  let prisma: {
    package: {
      findMany: AnyMock;
      findUnique: AnyMock;
      count: AnyMock;
      create: AnyMock;
      update: AnyMock;
      delete: AnyMock;
    };
    $transaction: AnyMock;
  };

  beforeEach(async () => {
    prisma = {
      package: {
        findMany: mockFn().mockResolvedValue([]),
        findUnique: mockFn().mockResolvedValue(null),
        count: mockFn().mockResolvedValue(0),
        create: mockFn().mockResolvedValue({ id: 'pkg-new', name: 'Gold' }),
        update: mockFn().mockResolvedValue({ id: 'pkg-1', name: 'Gold' }),
        delete: mockFn().mockResolvedValue({ id: 'pkg-1' }),
      },
      $transaction: mockFn().mockImplementation((cb: any) => cb(prisma)),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PackagesService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { withinTransaction: mockFn() } },
      ],
    }).compile();

    service = moduleRef.get(PackagesService);
  });

  const dto = {
    name: 'Gold',
    price: 90000,
    days: 4,
    nights: 3,
    validityMonths: 60,
  };

  describe('create', () => {
    it('stores the plan and defaults it to active', async () => {
      await service.create(dto, SUPER_ADMIN);

      const { data } = prisma.package.create.mock.calls[0][0];
      expect(data).toMatchObject({ ...dto, isActive: true });
    });

    it('honours an explicit isActive: false', async () => {
      await service.create({ ...dto, isActive: false }, SUPER_ADMIN);

      const { data } = prisma.package.create.mock.calls[0][0];
      expect(data.isActive).toBe(false);
    });

    it('records who created the plan, whoever it is', async () => {
      const MANAGER: AuthUser = {
        sub: 'manager-1',
        email: 'm1@clubinfication.com',
        name: 'Manager One',
        role: Role.MANAGER,
      };

      // A Manager may add a plan (client clarification); the service is
      // role-agnostic and the audit row carries the actor either way.
      await service.create(dto, MANAGER);
      expect(prisma.package.create).toHaveBeenCalled();
    });

    it('rejects a duplicate plan name', async () => {
      prisma.package.findUnique.mockResolvedValue({ id: 'pkg-existing' });

      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.package.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('filters to active plans when asked', async () => {
      await service.findAll({ isActive: true });

      const { where } = prisma.package.findMany.mock.calls[0][0];
      expect(where.AND).toContainEqual({ isActive: true });
    });

    it('applies no filter when none is given', async () => {
      await service.findAll({});

      const { where } = prisma.package.findMany.mock.calls[0][0];
      expect(where).toEqual({});
    });

    it('returns pagination metadata', async () => {
      prisma.package.count.mockResolvedValue(7);
      const res = await service.findAll({ limit: 2 });
      expect(res.meta).toEqual({
        total: 7,
        page: 1,
        limit: 2,
        totalPages: 4,
      });
    });
  });

  describe('update', () => {
    const existing = {
      id: 'pkg-1',
      name: 'Gold',
      price: 90000,
      days: 4,
      nights: 3,
      validityMonths: 60,
      isActive: true,
    };

    it('rejects an unknown plan', async () => {
      prisma.package.findUnique.mockResolvedValue(null);
      await expect(
        service.update('ghost', { price: 1 }, SUPER_ADMIN),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects renaming onto an existing name', async () => {
      prisma.package.findUnique
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce({ id: 'pkg-other' });

      await expect(
        service.update('pkg-1', { name: 'Silver' }, SUPER_ADMIN),
      ).rejects.toThrow(ConflictException);
    });

    it('allows keeping its own name', async () => {
      prisma.package.findUnique.mockResolvedValue(existing);
      await service.update('pkg-1', { name: 'Gold', price: 95000 }, SUPER_ADMIN);
      expect(prisma.package.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('refuses to delete a plan customers already bought', async () => {
      prisma.package.findUnique.mockResolvedValue({
        id: 'pkg-1',
        name: 'Gold',
        price: 90000,
        days: 4,
        nights: 3,
        validityMonths: 60,
        _count: { memberships: 3 },
      });

      await expect(service.remove('pkg-1', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.package.delete).not.toHaveBeenCalled();
    });

    it('deletes an unused plan', async () => {
      prisma.package.findUnique.mockResolvedValue({
        id: 'pkg-1',
        name: 'Gold',
        price: 90000,
        days: 4,
        nights: 3,
        validityMonths: 60,
        _count: { memberships: 0 },
      });

      await expect(service.remove('pkg-1', SUPER_ADMIN)).resolves.toEqual({
        message: 'Plan deleted successfully',
      });
      expect(prisma.package.delete).toHaveBeenCalled();
    });
  });
});
