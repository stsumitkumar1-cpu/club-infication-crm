// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service.js';
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

describe('UsersService (scope + hierarchy rules)', () => {
  let service: UsersService;
  let audit: { withinTransaction: AnyMock };
  let prisma: {
    user: {
      findMany: AnyMock;
      findFirst: AnyMock;
      findUnique: AnyMock;
      count: AnyMock;
      create: AnyMock;
      update: AnyMock;
      delete: AnyMock;
    };
    customer: { count: AnyMock };
    incentiveRecord: { count: AnyMock };
    refund: { count: AnyMock };
    importBatch: { count: AnyMock };
    auditLog: { count: AnyMock };
    $transaction: AnyMock;
  };

  beforeEach(async () => {
    audit = { withinTransaction: mockFn() };

    prisma = {
      user: {
        findMany: mockFn().mockResolvedValue([]),
        findFirst: mockFn(),
        findUnique: mockFn(),
        count: mockFn().mockResolvedValue(0),
        create: mockFn().mockResolvedValue({ id: 'new-user' }),
        update: mockFn().mockResolvedValue({ id: 'target' }),
        delete: mockFn().mockResolvedValue({ id: 'target' }),
      },
      // Relations checked before a user may be deleted; default to "no trace".
      customer: { count: mockFn().mockResolvedValue(0) },
      incentiveRecord: { count: mockFn().mockResolvedValue(0) },
      refund: { count: mockFn().mockResolvedValue(0) },
      importBatch: { count: mockFn().mockResolvedValue(0) },
      auditLog: { count: mockFn().mockResolvedValue(0) },
      $transaction: mockFn().mockImplementation((cb: any) => cb(prisma)),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: audit },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  describe('findAll scope', () => {
    it('applies no scope filter for a Super Admin', async () => {
      await service.findAll(SUPER_ADMIN);

      const { where } = prisma.user.findMany.mock.calls[0][0];
      expect(where.AND[0]).toEqual({});
    });

    it('limits a Manager to self + own executives', async () => {
      await service.findAll(MANAGER_1);

      const { where } = prisma.user.findMany.mock.calls[0][0];
      expect(where.AND[0]).toEqual({
        OR: [{ id: MANAGER_1.sub }, { managerId: MANAGER_1.sub }],
      });
    });

    it('limits an Executive to their own row', async () => {
      await service.findAll(EXECUTIVE_A);

      const { where } = prisma.user.findMany.mock.calls[0][0];
      expect(where.AND[0]).toEqual({ id: EXECUTIVE_A.sub });
    });
  });

  describe('findOne (IDOR)', () => {
    it('folds scope into the query rather than checking after the fetch', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'exec-b' });
      await service.findOne('exec-b', EXECUTIVE_A);

      const { where } = prisma.user.findFirst.mock.calls[0][0];
      expect(where.AND).toEqual([{ id: 'exec-b' }, { id: EXECUTIVE_A.sub }]);
    });

    it("DENIES Executive A reading Executive B by id (as 404, not 403)", async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.findOne('exec-b', EXECUTIVE_A)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('rejects a managerId on a non-EXECUTIVE user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create(
          {
            email: 'm2@clubinfication.com',
            password: 'secret123',
            name: 'Manager Two',
            role: Role.MANAGER,
            managerId: 'manager-1',
          },
          SUPER_ADMIN,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects a managerId pointing at a non-MANAGER', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(null) // email is free
        .mockResolvedValueOnce({
          id: 'exec-x',
          role: Role.EXECUTIVE,
          isActive: true,
        });

      await expect(
        service.create(
          {
            email: 'e2@clubinfication.com',
            password: 'secret123',
            name: 'Exec Two',
            role: Role.EXECUTIVE,
            managerId: 'exec-x',
          },
          SUPER_ADMIN,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('ALLOWS a Manager to create an Executive in their own team', async () => {
      prisma.user.findUnique.mockResolvedValue(null); // email free

      await service.create(
        {
          email: 'e3@clubinfication.com',
          password: 'secret123',
          name: 'Exec Three',
          role: Role.EXECUTIVE,
        },
        MANAGER_1,
      );

      const { data } = prisma.user.create.mock.calls[0][0];
      expect(data.managerId).toBe(MANAGER_1.sub);
    });

    it("forces a Manager's new Executive into their own team", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await service.create(
        {
          email: 'e4@clubinfication.com',
          password: 'secret123',
          name: 'Exec Four',
          role: Role.EXECUTIVE,
          managerId: 'manager-2', // attempt to plant into another team
        },
        MANAGER_1,
      );

      const { data } = prisma.user.create.mock.calls[0][0];
      expect(data.managerId).toBe(MANAGER_1.sub);
    });

    it('DENIES a Manager creating another MANAGER', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create(
          {
            email: 'm9@clubinfication.com',
            password: 'secret123',
            name: 'Manager Nine',
            role: Role.MANAGER,
          },
          MANAGER_1,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('DENIES a Manager creating a SUPER_ADMIN', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create(
          {
            email: 'a9@clubinfication.com',
            password: 'secret123',
            name: 'Admin Nine',
            role: Role.SUPER_ADMIN,
          },
          MANAGER_1,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('rejects a duplicate email', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create(
          {
            email: 'admin@clubinfication.com',
            password: 'secret123',
            name: 'Clone',
            role: Role.EXECUTIVE,
          },
          SUPER_ADMIN,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    const unusedExec = {
      id: 'exec-unused',
      name: 'Unused Exec',
      email: 'unused@clubinfication.com',
      role: Role.EXECUTIVE,
      isActive: true,
    };

    it('deletes an account that has left no trace', async () => {
      prisma.user.findUnique.mockResolvedValue(unusedExec);
      // customers, executives, incentives, refunds, imports, auditActions
      prisma.customer = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.incentiveRecord = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.refund = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.importBatch = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.auditLog = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.user.count.mockResolvedValue(0);
      prisma.user.delete = mockFn().mockResolvedValue(unusedExec);

      await expect(service.remove('exec-unused', SUPER_ADMIN)).resolves.toEqual(
        { message: 'Unused Exec deleted successfully' },
      );
      expect(prisma.user.delete).toHaveBeenCalled();
    });

    it('refuses to delete a user holding customers', async () => {
      prisma.user.findUnique.mockResolvedValue(unusedExec);
      prisma.customer = { count: mockFn().mockResolvedValue(4) } as any;
      prisma.incentiveRecord = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.refund = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.importBatch = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.auditLog = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.user.count.mockResolvedValue(0);
      prisma.user.delete = mockFn();

      await expect(service.remove('exec-unused', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('refuses to delete a user with audit history', async () => {
      prisma.user.findUnique.mockResolvedValue(unusedExec);
      prisma.customer = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.incentiveRecord = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.refund = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.importBatch = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.auditLog = { count: mockFn().mockResolvedValue(7) } as any;
      prisma.user.count.mockResolvedValue(0);
      prisma.user.delete = mockFn();

      await expect(service.remove('exec-unused', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
    });

    it('refuses to delete a manager who still has executives', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...unusedExec,
        role: Role.MANAGER,
      });
      prisma.customer = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.incentiveRecord = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.refund = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.importBatch = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.auditLog = { count: mockFn().mockResolvedValue(0) } as any;
      prisma.user.count.mockResolvedValue(2); // executives reporting to them
      prisma.user.delete = mockFn();

      await expect(service.remove('exec-unused', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
    });

    it('blocks deleting your own account', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...unusedExec,
        id: SUPER_ADMIN.sub,
      });
      await expect(
        service.remove(SUPER_ADMIN.sub, SUPER_ADMIN),
      ).rejects.toThrow(ForbiddenException);
    });

    it('blocks deleting the last Super Admin', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'admin-2',
        name: 'Admin Two',
        email: 'a2@clubinfication.com',
        role: Role.SUPER_ADMIN,
        isActive: true,
      });
      prisma.user.count.mockResolvedValue(1);

      await expect(service.remove('admin-2', SUPER_ADMIN)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('rejects an unknown id', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.remove('ghost', SUPER_ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStats', () => {
    it('scopes every counter to the caller', async () => {
      await service.getStats(MANAGER_1);

      const scopes = prisma.user.count.mock.calls.map(
        (call: any) => call[0].where.AND[0],
      );
      expect(scopes.length).toBeGreaterThan(0);
      for (const scope of scopes) {
        expect(scope).toEqual({
          OR: [{ id: MANAGER_1.sub }, { managerId: MANAGER_1.sub }],
        });
      }
    });

    it('derives inactive from total minus active', async () => {
      // total, superAdmins, managers, executives, active, unassignedExecs
      prisma.user.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(6)
        .mockResolvedValueOnce(8)
        .mockResolvedValueOnce(2);

      const stats = await service.getStats(SUPER_ADMIN);

      expect(stats).toEqual({
        total: 10,
        superAdmins: 1,
        managers: 3,
        executives: 6,
        active: 8,
        inactive: 2,
        unassignedExecutives: 2,
      });
    });
  });

  describe('update guards', () => {
    it('blocks self-deactivation', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: SUPER_ADMIN.sub,
        role: Role.SUPER_ADMIN,
        isActive: true,
        managerId: null,
        email: SUPER_ADMIN.email,
        name: SUPER_ADMIN.name,
      });

      await expect(
        service.update(SUPER_ADMIN.sub, { isActive: false }, SUPER_ADMIN),
      ).rejects.toThrow(ForbiddenException);
    });

    it('blocks changing your own role', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: MANAGER_1.sub,
        role: Role.MANAGER,
        isActive: true,
        managerId: null,
        email: MANAGER_1.email,
        name: MANAGER_1.name,
      });

      await expect(
        service.update(MANAGER_1.sub, { role: Role.SUPER_ADMIN }, MANAGER_1),
      ).rejects.toThrow(ForbiddenException);
    });

    it('blocks deactivating the last active Super Admin', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'admin-2',
        role: Role.SUPER_ADMIN,
        isActive: true,
        managerId: null,
        email: 'admin2@clubinfication.com',
        name: 'Admin Two',
      });
      prisma.user.count.mockResolvedValue(1);

      await expect(
        service.update('admin-2', { isActive: false }, SUPER_ADMIN),
      ).rejects.toThrow(ForbiddenException);
    });

    it('blocks demoting a Manager who still has executives', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'manager-2',
        role: Role.MANAGER,
        isActive: true,
        managerId: null,
        email: 'm2@clubinfication.com',
        name: 'Manager Two',
      });
      prisma.user.count.mockResolvedValue(3);

      await expect(
        service.update('manager-2', { role: Role.EXECUTIVE }, SUPER_ADMIN),
      ).rejects.toThrow(ConflictException);
    });

    it('detaches the manager when an Executive is promoted', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'exec-b',
        role: Role.EXECUTIVE,
        isActive: true,
        managerId: 'manager-1',
        email: 'b@clubinfication.com',
        name: 'Exec B',
      });

      await service.update('exec-b', { role: Role.MANAGER }, SUPER_ADMIN);

      const { data } = prisma.user.update.mock.calls[0][0];
      expect(data.manager).toEqual({ disconnect: true });
      expect(data.role).toBe(Role.MANAGER);
    });

    it('rejects an unknown user id', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.update('ghost', { name: 'X' }, SUPER_ADMIN),
      ).rejects.toThrow(NotFoundException);
    });
  });

  /*
   * Neither a Manager nor an Executive may change their own password, so this is
   * the only route by which either gets set. Who may do it to whom:
   *   - SUPER_ADMIN → any Manager or Executive.
   *   - MANAGER     → an Executive in their own team.
   */
  describe('setPassword', () => {
    const EXEC = {
      id: 'exec-a',
      name: 'Executive A',
      email: 'execa@clubinfication.com',
      role: 'EXECUTIVE',
      managerId: MANAGER_1.sub,
    };
    const MANAGER = {
      id: 'manager-2',
      name: 'Manager Two',
      email: 'm2@clubinfication.com',
      role: 'MANAGER',
      managerId: null,
    };

    const dto = { password: 'FreshPass1' };

    it("lets a Super Admin set an Executive's password", async () => {
      prisma.user.findUnique.mockResolvedValue(EXEC);

      await expect(
        service.setPassword('exec-a', dto, SUPER_ADMIN),
      ).resolves.toEqual({ message: 'Password updated for Executive A' });

      const { data } = prisma.user.update.mock.calls[0][0];
      expect(data.passwordHash).not.toBe(dto.password);
      await expect(
        bcrypt.compare(dto.password, data.passwordHash),
      ).resolves.toBe(true);
    });

    it("lets a Super Admin set a Manager's password too", async () => {
      prisma.user.findUnique.mockResolvedValue(MANAGER);

      await expect(
        service.setPassword('manager-2', dto, SUPER_ADMIN),
      ).resolves.toEqual({ message: 'Password updated for Manager Two' });
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('lets a Manager set their own executive', async () => {
      prisma.user.findUnique.mockResolvedValue(EXEC);

      await expect(
        service.setPassword('exec-a', dto, MANAGER_1),
      ).resolves.toEqual({ message: 'Password updated for Executive A' });
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it("refuses a Manager another team's executive", async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...EXEC,
        managerId: 'someone-else',
      });

      await expect(
        service.setPassword('exec-a', dto, MANAGER_1),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('refuses a Manager another Manager', async () => {
      prisma.user.findUnique.mockResolvedValue(MANAGER);

      await expect(
        service.setPassword('manager-2', dto, MANAGER_1),
      ).rejects.toThrow(NotFoundException);
    });

    it('refuses a Manager a Super Admin', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'admin-1',
        name: 'Super Admin',
        email: 'admin@clubinfication.com',
        role: 'SUPER_ADMIN',
        managerId: null,
      });

      await expect(
        service.setPassword('admin-1', dto, MANAGER_1),
      ).rejects.toThrow(NotFoundException);
    });

    /*
     * A Manager's own record is not an Executive in their team, so the team rule
     * excludes self with no special case — and it must: they cannot change their
     * own password anywhere, and this route is not a way around that.
     */
    it('refuses a Manager targeting themselves', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: MANAGER_1.sub,
        name: 'Manager One',
        email: 'm1@clubinfication.com',
        role: 'MANAGER',
        managerId: null,
      });

      await expect(
        service.setPassword(MANAGER_1.sub, dto, MANAGER_1),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('voids any outstanding reset link', async () => {
      prisma.user.findUnique.mockResolvedValue(EXEC);

      await service.setPassword('exec-a', dto, SUPER_ADMIN);

      const { data } = prisma.user.update.mock.calls[0][0];
      expect(data.resetToken).toBeNull();
      expect(data.resetTokenExpiry).toBeNull();
    });

    /*
     * A Super Admin's own change belongs on the Profile page, which proves
     * ownership with the current password. Allowing it here would make that
     * proof optional for the one account that most needs it.
     */
    it('refuses a Super Admin resetting their own password here', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: SUPER_ADMIN.sub,
        name: 'Super Admin',
        email: 'admin@clubinfication.com',
        role: 'SUPER_ADMIN',
      });

      await expect(
        service.setPassword(SUPER_ADMIN.sub, dto, SUPER_ADMIN),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('points them at the Profile page instead', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: SUPER_ADMIN.sub,
        name: 'Super Admin',
        email: 'admin@clubinfication.com',
        role: 'SUPER_ADMIN',
      });

      await expect(
        service.setPassword(SUPER_ADMIN.sub, dto, SUPER_ADMIN),
      ).rejects.toThrow(/Profile page/);
    });

    it('404s an unknown id', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.setPassword('ghost', dto, SUPER_ADMIN),
      ).rejects.toThrow(NotFoundException);
    });

    it('audits the change without recording the password', async () => {
      prisma.user.findUnique.mockResolvedValue(EXEC);

      await service.setPassword('exec-a', dto, SUPER_ADMIN);

      const [, entry] = audit.withinTransaction.mock.calls[0];
      expect(entry).toMatchObject({
        actorId: SUPER_ADMIN.sub,
        action: 'PASSWORD_SET',
        entity: 'User',
        entityId: 'exec-a',
      });
      expect(JSON.stringify(entry)).not.toContain(dto.password);
    });
  });

});
