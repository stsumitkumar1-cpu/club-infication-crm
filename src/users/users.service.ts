import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';
import {
  CreateUserDto,
  QueryUsersDto,
  SetPasswordDto,
  UpdateUserDto,
} from './dto/index.js';

/** Never expose passwordHash or reset-token fields through any endpoint. */
const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  managerId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  /**
   * Master Spec 2.3 — scope is derived from the caller, never from the request.
   * SUPER_ADMIN -> global, MANAGER -> self + own executives, EXECUTIVE -> self.
   */
  private scopeFilter(currentUser: AuthUser): Prisma.UserWhereInput {
    switch (currentUser.role) {
      case Role.SUPER_ADMIN:
        return {};
      case Role.MANAGER:
        return {
          OR: [{ id: currentUser.sub }, { managerId: currentUser.sub }],
        };
      default:
        return { id: currentUser.sub };
    }
  }

  /**
   * A managerId is only meaningful for an EXECUTIVE, and it must point at an
   * active MANAGER. This keeps the hierarchy exactly two levels deep.
   */
  private async assertValidManagerId(
    managerId: string,
    subjectId?: string,
  ): Promise<void> {
    if (subjectId && managerId === subjectId) {
      throw new BadRequestException('A user cannot be their own manager');
    }

    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
      select: { id: true, role: true, isActive: true },
    });

    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found`);
    }
    if (manager.role !== Role.MANAGER) {
      throw new BadRequestException(
        'Assigned manager must have the MANAGER role',
      );
    }
    if (!manager.isActive) {
      throw new BadRequestException('Cannot assign to a deactivated manager');
    }
  }

  /** The system must never be left without a way in. */
  private async assertNotLastActiveSuperAdmin(target: User): Promise<void> {
    if (target.role !== Role.SUPER_ADMIN || !target.isActive) {
      return;
    }
    const activeSuperAdmins = await this.prisma.user.count({
      where: { role: Role.SUPER_ADMIN, isActive: true },
    });
    if (activeSuperAdmins <= 1) {
      throw new ForbiddenException(
        'Cannot deactivate or demote the last active Super Admin',
      );
    }
  }

  async create(dto: CreateUserDto, currentUser: AuthUser) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // A MANAGER may onboard Executives, but only into their own team and only
    // at the EXECUTIVE level — they can never mint a peer or an admin.
    const isManagerCreating = currentUser.role === Role.MANAGER;
    if (isManagerCreating && dto.role !== Role.EXECUTIVE) {
      throw new ForbiddenException(
        'A Manager can only create users with the EXECUTIVE role',
      );
    }

    const managerId = isManagerCreating ? currentUser.sub : dto.managerId;

    if (managerId) {
      if (dto.role !== Role.EXECUTIVE) {
        throw new BadRequestException(
          'Only an EXECUTIVE can be assigned to a manager',
        );
      }
      // A Manager assigning to themselves needs no ownership check, but the
      // target must still be a valid active MANAGER when an admin picks one.
      if (!isManagerCreating) {
        await this.assertValidManagerId(managerId);
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          role: dto.role,
          managerId: dto.role === Role.EXECUTIVE ? (managerId ?? null) : null,
          passwordHash,
        },
        select: USER_SELECT,
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        metadata: {
          email: user.email,
          role: user.role,
          managerId: user.managerId,
        },
      });

      return user;
    });
  }

  async findAll(currentUser: AuthUser, query: QueryUsersDto = {}) {
    const { search, role, isActive, page = 1, limit = 20 } = query;

    const filters: Prisma.UserWhereInput[] = [this.scopeFilter(currentUser)];

    if (role) {
      filters.push({ role });
    }
    if (isActive !== undefined) {
      filters.push({ isActive });
    }
    if (search) {
      filters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const where: Prisma.UserWhereInput = { AND: filters };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          ...USER_SELECT,
          manager: { select: { id: true, name: true, email: true } },
          _count: { select: { executives: true, customers: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  /**
   * Scope is applied in the query itself, not checked after the fetch — an
   * out-of-scope id must be indistinguishable from a missing one (IDOR, 2.3).
   */
  async findOne(id: string, currentUser: AuthUser) {
    const user = await this.prisma.user.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
      select: {
        ...USER_SELECT,
        manager: { select: { id: true, name: true, email: true } },
        executives: {
          select: { id: true, name: true, email: true, isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Sets another user's password (client rule):
   *   - SUPER_ADMIN → any Manager or Executive.
   *   - MANAGER     → an Executive in their own team, and nobody else.
   *
   * This is the only route by which a Manager's or an Executive's password can
   * be set at all, because neither of them may change their own — see
   * AuthService.changePassword.
   *
   * Kept separate from PATCH /users/:id, which also carries role, email,
   * managerId and isActive: routing a reset through that one would hand a
   * Manager role changes and deactivation along with it, and would let a slip
   * of the request body change far more than intended even for a Super Admin.
   */
  async setPassword(
    id: string,
    dto: SetPasswordDto,
    currentUser: AuthUser,
  ): Promise<{ message: string }> {
    const target = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, managerId: true },
    });
    if (!target) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (currentUser.role === Role.MANAGER) {
      const ownExecutive =
        target.role === Role.EXECUTIVE && target.managerId === currentUser.sub;
      if (!ownExecutive) {
        /*
         * Not found rather than forbidden, deliberately: a Manager probing ids
         * must not be able to tell "exists but not yours" from "does not exist"
         * (Spec 18, the same rule the customer scope follows).
         *
         * This also covers a Manager targeting themselves — their own record is
         * not an Executive in their team — which is what it should do: nobody
         * resets their own password here.
         */
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } else if (target.id === currentUser.sub) {
      /*
       * A Super Admin's own change belongs on the Profile page, which proves
       * ownership with the current password. Allowing it here would make that
       * proof optional for the one account that most needs it.
       */
      throw new BadRequestException(
        'Use the Profile page to change your own password — it asks for your current one.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          passwordHash,
          // Any outstanding reset link is void once a password is set by hand.
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'PASSWORD_SET',
        entity: 'User',
        entityId: id,
        // Never the password: an audit row is readable by design.
        metadata: {
          email: target.email,
          targetRole: target.role,
          byRole: currentUser.role,
        },
      });
    });

    return { message: `Password updated for ${target.name}` };
  }

  async update(id: string, dto: UpdateUserDto, currentUser: AuthUser) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isSelf = id === currentUser.sub;
    const nextRole = dto.role ?? user.role;
    const roleIsChanging = dto.role !== undefined && dto.role !== user.role;
    const isBeingDeactivated = dto.isActive === false && user.isActive;

    if (isSelf && roleIsChanging) {
      throw new ForbiddenException('You cannot change your own role');
    }
    if (isSelf && isBeingDeactivated) {
      throw new ForbiddenException('You cannot deactivate your own account');
    }
    if (
      isBeingDeactivated ||
      (roleIsChanging && user.role === Role.SUPER_ADMIN)
    ) {
      await this.assertNotLastActiveSuperAdmin(user);
    }

    // Demoting a manager would orphan their executives — force an explicit
    // reassignment first rather than silently detaching a whole team.
    if (roleIsChanging && user.role === Role.MANAGER) {
      const executiveCount = await this.prisma.user.count({
        where: { managerId: id },
      });
      if (executiveCount > 0) {
        throw new ConflictException(
          `Cannot change role: ${executiveCount} executive(s) still assigned to this manager. Reassign them first.`,
        );
      }
    }

    if (dto.email && dto.email !== user.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });
      if (emailTaken) {
        throw new ConflictException('Email already in use by another user');
      }
    }

    const data: Prisma.UserUpdateInput = {};
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    }

    if (nextRole !== Role.EXECUTIVE) {
      // Only executives sit under a manager.
      if (dto.managerId) {
        throw new BadRequestException(
          'Only an EXECUTIVE can be assigned to a manager',
        );
      }
      if (user.managerId) {
        data.manager = { disconnect: true };
      }
    } else if (dto.managerId !== undefined) {
      if (dto.managerId) {
        await this.assertValidManagerId(dto.managerId, id);
        data.manager = { connect: { id: dto.managerId } };
      } else {
        data.manager = { disconnect: true };
      }
    }

    const action = isBeingDeactivated
      ? 'DEACTIVATE'
      : dto.isActive === true && !user.isActive
        ? 'ACTIVATE'
        : 'UPDATE';

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data,
        select: USER_SELECT,
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action,
        entity: 'User',
        entityId: id,
        metadata: {
          before: {
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            managerId: user.managerId,
          },
          after: {
            email: updated.email,
            name: updated.name,
            role: updated.role,
            isActive: updated.isActive,
            managerId: updated.managerId,
          },
          passwordChanged: Boolean(dto.password),
        },
      });

      return updated;
    });
  }

  async setActive(id: string, isActive: boolean, currentUser: AuthUser) {
    return this.update(id, { isActive }, currentUser);
  }

  /**
   * Permanently removes a user.
   *
   * Deactivation remains the normal path: an employee who has done anything in
   * the CRM owns customers, audit history or incentive records, and deleting
   * them would either orphan or erase that (Spec 6.3, 15). So deletion is only
   * allowed for an account that has left no trace — a mistyped or unused login.
   */
  async remove(id: string, currentUser: AuthUser) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (id === currentUser.sub) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    if (user.role === Role.SUPER_ADMIN) {
      const superAdmins = await this.prisma.user.count({
        where: { role: Role.SUPER_ADMIN },
      });
      if (superAdmins <= 1) {
        throw new ForbiddenException('Cannot delete the last Super Admin');
      }
    }

    const [customers, executives, incentives, refunds, imports, auditActions] =
      await Promise.all([
        this.prisma.customer.count({ where: { assignedExecId: id } }),
        this.prisma.user.count({ where: { managerId: id } }),
        this.prisma.incentiveRecord.count({ where: { executiveId: id } }),
        this.prisma.refund.count({ where: { approvedById: id } }),
        this.prisma.importBatch.count({ where: { uploadedById: id } }),
        // Audit rows point at the actor by foreign key, so a user who has acted
        // cannot be removed without breaking the trail.
        this.prisma.auditLog.count({ where: { actorId: id } }),
      ]);

    const blockers: Record<string, number> = {
      'assigned customers': customers,
      'executives reporting to them': executives,
      'incentive records': incentives,
      'approved refunds': refunds,
      'import batches': imports,
      'audit history entries': auditActions,
    };
    const detail = Object.entries(blockers)
      .filter(([, count]) => count > 0)
      .map(([label, count]) => `${count} ${label}`)
      .join(', ');

    if (detail) {
      throw new ConflictException(
        `Cannot delete ${user.name}: ${detail} on record. Deactivate the account instead — that blocks login while keeping their history intact.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.delete({ where: { id } });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'DELETE',
        entity: 'User',
        entityId: id,
        metadata: {
          email: user.email,
          name: user.name,
          role: user.role,
          wasActive: user.isActive,
        },
      });
    });

    return { message: `${user.name} deleted successfully` };
  }

  /**
   * Headline counters for the user-management screen, scoped exactly like the
   * list endpoint so a Manager only ever counts their own team (Spec 12).
   */
  async getStats(currentUser: AuthUser) {
    const scope = this.scopeFilter(currentUser);

    const countBy = (extra?: Prisma.UserWhereInput) =>
      this.prisma.user.count({
        where: { AND: extra ? [scope, extra] : [scope] },
      });

    const [total, superAdmins, managers, executives, active, unassignedExecs] =
      await Promise.all([
        countBy(),
        countBy({ role: Role.SUPER_ADMIN }),
        countBy({ role: Role.MANAGER }),
        countBy({ role: Role.EXECUTIVE }),
        countBy({ isActive: true }),
        countBy({ role: Role.EXECUTIVE, managerId: null }),
      ]);

    return {
      total,
      superAdmins,
      managers,
      executives,
      active,
      inactive: total - active,
      // Surfaced because an Executive with no Manager is invisible to every
      // Manager, which is easy to miss when creating users.
      unassignedExecutives: unassignedExecs,
    };
  }
}
