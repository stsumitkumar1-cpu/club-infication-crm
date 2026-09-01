// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';

type AnyMock = Mock<(...args: any[]) => any>;
const mockFn = (): AnyMock => jest.fn<(...args: any[]) => any>();

const CURRENT = 'CurrentPass1';
const NEXT = 'BrandNewPass9';

describe('AuthService.changePassword (self-service)', () => {
  let service: AuthService;
  let prisma: {
    user: { findUnique: AnyMock; update: AnyMock };
    $transaction: AnyMock;
  };
  let audit: { withinTransaction: AnyMock };
  let currentHash: string;

  beforeAll(async () => {
    // Hashed once: bcrypt is deliberately slow, and every test reuses this.
    currentHash = await bcrypt.hash(CURRENT, 10);
  });

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: mockFn().mockResolvedValue({
          id: 'user-1',
          email: 'exec1@clubinfication.com',
          // Super Admin: the only role allowed to change its own password.
          role: 'SUPER_ADMIN',
          passwordHash: currentHash,
          isActive: true,
        }),
        update: mockFn().mockResolvedValue({ id: 'user-1' }),
      },
      $transaction: mockFn().mockImplementation((cb: any) => cb(prisma)),
    };
    audit = { withinTransaction: mockFn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: audit },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  const dto = { currentPassword: CURRENT, newPassword: NEXT };

  describe('proving ownership', () => {
    /*
     * The whole point of asking for the current password. A valid access token
     * outlives the tab it was issued in, so without this an unattended session
     * would be enough to lock the real owner out of their own account.
     */
    it('refuses a wrong current password and writes nothing', async () => {
      await expect(
        service.changePassword('user-1', {
          ...dto,
          currentPassword: 'NotMyPass1',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(audit.withinTransaction).not.toHaveBeenCalled();
    });

    it('refuses a deactivated account', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'exec1@clubinfication.com',
        role: 'SUPER_ADMIN',
        passwordHash: currentHash,
        isActive: false,
      });

      await expect(service.changePassword('user-1', dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('refuses a token naming a user who no longer exists', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.changePassword('ghost', dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('reads the account named by the token, not by the request body', async () => {
      await service.changePassword('user-1', dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'user-1' } }),
      );
    });
  });

  describe('the change itself', () => {
    it('stores a bcrypt hash of the new password, never the password', async () => {
      await service.changePassword('user-1', dto);

      const { data } = prisma.user.update.mock.calls[0][0];
      expect(data.passwordHash).not.toBe(NEXT);
      await expect(bcrypt.compare(NEXT, data.passwordHash)).resolves.toBe(true);
      // And the old one no longer opens the account.
      await expect(bcrypt.compare(CURRENT, data.passwordHash)).resolves.toBe(
        false,
      );
    });

    /*
     * An emailed reset link issued before this change must not be able to undo
     * it — otherwise a leaked link stays live after the owner has reacted to it.
     */
    it('voids any outstanding reset link', async () => {
      await service.changePassword('user-1', dto);

      const { data } = prisma.user.update.mock.calls[0][0];
      expect(data.resetToken).toBeNull();
      expect(data.resetTokenExpiry).toBeNull();
    });

    it('refuses a no-op rather than reporting a rotation that did not happen', async () => {
      await expect(
        service.changePassword('user-1', {
          currentPassword: CURRENT,
          newPassword: CURRENT,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('returns a plain confirmation', async () => {
      await expect(service.changePassword('user-1', dto)).resolves.toEqual({
        message: 'Password changed successfully',
      });
    });
  });

  describe('the audit trail', () => {
    it('records the change against the user themselves', async () => {
      await service.changePassword('user-1', dto);

      const [, entry] = audit.withinTransaction.mock.calls[0];
      expect(entry).toMatchObject({
        actorId: 'user-1',
        action: 'PASSWORD_CHANGE',
        entity: 'User',
        entityId: 'user-1',
      });
    });

    it('puts no password anywhere in the metadata', async () => {
      await service.changePassword('user-1', dto);

      const [, entry] = audit.withinTransaction.mock.calls[0];
      const serialised = JSON.stringify(entry);
      // An audit row is readable by design, so it is the last place a
      // credential should be able to reach.
      expect(serialised).not.toContain(CURRENT);
      expect(serialised).not.toContain(NEXT);
    });

    it('audits inside the same transaction as the update', async () => {
      const order: string[] = [];
      prisma.user.update.mockImplementation(async () => {
        order.push('update');
        return { id: 'user-1' };
      });
      audit.withinTransaction.mockImplementation(() => {
        order.push('audit');
      });

      await service.changePassword('user-1', dto);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(order).toEqual(['update', 'audit']);
    });
  });

  /*
   * Client rule: only a Super Admin manages credentials. A Manager's and an
   * Executive's password is set for them, never by themselves.
   *
   * Enforced here rather than only by hiding the form — this endpoint is
   * reachable with a valid token and curl, so the check has to live where the
   * write happens.
   */
  describe('only a Super Admin changes their own password', () => {
    const asRole = (role: string, id: string) => {
      prisma.user.findUnique.mockResolvedValue({
        id,
        email: `${id}@clubinfication.com`,
        role,
        passwordHash: currentHash,
        isActive: true,
      });
    };

    it('refuses an Executive even with the correct current password', async () => {
      asRole('EXECUTIVE', 'exec-1');

      await expect(service.changePassword('exec-1', dto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(audit.withinTransaction).not.toHaveBeenCalled();
    });

    it('refuses a Manager even with the correct current password', async () => {
      asRole('MANAGER', 'mgr-1');

      await expect(service.changePassword('mgr-1', dto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('points both of them at a Super Admin', async () => {
      asRole('MANAGER', 'mgr-1');

      await expect(service.changePassword('mgr-1', dto)).rejects.toThrow(
        /Ask a Super Admin/,
      );
    });

    it('allows a Super Admin', async () => {
      asRole('SUPER_ADMIN', 'admin-1');

      await expect(service.changePassword('admin-1', dto)).resolves.toEqual({
        message: 'Password changed successfully',
      });
    });
  });

});
