// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { TeamsService } from './teams.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';

/** Bare `Mock` defaults to an unknown signature, which rejects mock payloads. */
type AnyMock = Mock<(...args: any[]) => any>;

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

describe('TeamsService (RBAC + hierarchy)', () => {
  let service: TeamsService;
  let prisma: {
    user: {
      findMany: AnyMock;
      findFirst: AnyMock;
      findUnique: AnyMock;
      update: AnyMock;
    };
    $transaction: AnyMock;
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      // Run the callback against the same mock so audit writes are exercised.
      $transaction: jest.fn((cb: (tx: unknown) => unknown) => cb(prisma)),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { withinTransaction: jest.fn() } },
      ],
    }).compile();

    service = moduleRef.get(TeamsService);
    prisma.user.update.mockResolvedValue({ id: 'exec-1' });
  });

  describe('findAll', () => {
    it('returns every team for a Super Admin', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      await service.findAll(SUPER_ADMIN);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { role: Role.MANAGER } }),
      );
    });

    it('narrows the query to the caller for a Manager', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      await service.findAll(MANAGER_1);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: Role.MANAGER, id: MANAGER_1.sub },
        }),
      );
    });
  });

  describe('findOne', () => {
    it("DENIES a Manager reading another Manager's team", async () => {
      await expect(service.findOne('manager-2', MANAGER_1)).rejects.toThrow(
        ForbiddenException,
      );
      expect(prisma.user.findFirst).not.toHaveBeenCalled();
    });

    it('ALLOWS a Manager reading their own team', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: MANAGER_1.sub });
      await expect(
        service.findOne(MANAGER_1.sub, MANAGER_1),
      ).resolves.toEqual({ id: MANAGER_1.sub });
    });

    it('ALLOWS a Super Admin reading any team', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'manager-2' });
      await expect(
        service.findOne('manager-2', SUPER_ADMIN),
      ).resolves.toEqual({ id: 'manager-2' });
    });
  });

  describe('assignExecutive', () => {
    const activeManager = {
      id: MANAGER_1.sub,
      name: 'Manager One',
      role: Role.MANAGER,
      isActive: true,
    };

    it('ALLOWS a Manager to claim an unassigned Executive', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(activeManager)
        .mockResolvedValueOnce({
          id: 'exec-1',
          name: 'Exec One',
          role: Role.EXECUTIVE,
          isActive: true,
          managerId: null,
        });

      await service.assignExecutive({ executiveId: 'exec-1' }, MANAGER_1);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'exec-1' },
          data: { manager: { connect: { id: MANAGER_1.sub } } },
        }),
      );
    });

    it("DENIES a Manager poaching another Manager's Executive", async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(activeManager)
        .mockResolvedValueOnce({
          id: 'exec-9',
          name: 'Exec Nine',
          role: Role.EXECUTIVE,
          isActive: true,
          managerId: 'manager-2',
        });

      await expect(
        service.assignExecutive({ executiveId: 'exec-9' }, MANAGER_1),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('DENIES a Manager assigning into another team via managerId', async () => {
      await expect(
        service.assignExecutive(
          { executiveId: 'exec-1', managerId: 'manager-2' },
          MANAGER_1,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('requires an explicit managerId from a Super Admin', async () => {
      await expect(
        service.assignExecutive({ executiveId: 'exec-1' }, SUPER_ADMIN),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects assigning a user who is not an EXECUTIVE', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(activeManager)
        .mockResolvedValueOnce({
          id: 'manager-3',
          name: 'Manager Three',
          role: Role.MANAGER,
          isActive: true,
          managerId: null,
        });

      await expect(
        service.assignExecutive({ executiveId: 'manager-3' }, MANAGER_1),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects an unknown executive id', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(activeManager)
        .mockResolvedValueOnce(null);

      await expect(
        service.assignExecutive({ executiveId: 'nope' }, MANAGER_1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('unassignExecutive', () => {
    it("DENIES a Manager releasing another Manager's Executive", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'exec-9',
        name: 'Exec Nine',
        role: Role.EXECUTIVE,
        managerId: 'manager-2',
      });

      await expect(
        service.unassignExecutive('exec-9', MANAGER_1),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('ALLOWS a Manager releasing their own Executive', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'exec-1',
        name: 'Exec One',
        role: Role.EXECUTIVE,
        managerId: MANAGER_1.sub,
      });

      await service.unassignExecutive('exec-1', MANAGER_1);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { manager: { disconnect: true } },
        }),
      );
    });

    it('rejects an executive who has no manager', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'exec-1',
        name: 'Exec One',
        role: Role.EXECUTIVE,
        managerId: null,
      });

      await expect(
        service.unassignExecutive('exec-1', SUPER_ADMIN),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
