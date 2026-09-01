import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';
import { AssignExecutiveDto } from './dto/index.js';

const EXECUTIVE_SELECT = {
  id: true,
  name: true,
  email: true,
  isActive: true,
  createdAt: true,
  _count: { select: { customers: true } },
} satisfies Prisma.UserSelect;

const MANAGER_SELECT = {
  id: true,
  name: true,
  email: true,
  isActive: true,
  executives: {
    select: EXECUTIVE_SELECT,
    orderBy: { name: 'asc' },
  },
  _count: { select: { executives: true } },
} satisfies Prisma.UserSelect;

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  /**
   * Master Spec 2.2 — a Manager sees only their own team. Passing another
   * manager's id must fail for a MANAGER caller even though the id is valid.
   */
  private assertCanActOnTeam(managerId: string, currentUser: AuthUser): void {
    if (currentUser.role === Role.SUPER_ADMIN) {
      return;
    }
    if (currentUser.role === Role.MANAGER && managerId === currentUser.sub) {
      return;
    }
    throw new ForbiddenException('You can only access your own team');
  }

  /** SUPER_ADMIN sees every team; MANAGER sees exactly one — their own. */
  async findAll(currentUser: AuthUser) {
    const where: Prisma.UserWhereInput =
      currentUser.role === Role.SUPER_ADMIN
        ? { role: Role.MANAGER }
        : { role: Role.MANAGER, id: currentUser.sub };

    const managers = await this.prisma.user.findMany({
      where,
      select: MANAGER_SELECT,
      orderBy: { name: 'asc' },
    });

    return {
      data: managers,
      meta: { totalTeams: managers.length },
    };
  }

  async findOne(managerId: string, currentUser: AuthUser) {
    this.assertCanActOnTeam(managerId, currentUser);

    const manager = await this.prisma.user.findFirst({
      where: { id: managerId, role: Role.MANAGER },
      select: MANAGER_SELECT,
    });

    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found`);
    }
    return manager;
  }

  /**
   * Executives with no manager. Both SUPER_ADMIN and MANAGER need this list:
   * a Manager may claim an unassigned Executive for their own team (Spec 2.2).
   */
  async findUnassignedExecutives() {
    return this.prisma.user.findMany({
      where: { role: Role.EXECUTIVE, managerId: null },
      select: EXECUTIVE_SELECT,
      orderBy: { name: 'asc' },
    });
  }

  async assignExecutive(dto: AssignExecutiveDto, currentUser: AuthUser) {
    const targetManagerId = this.resolveTargetManager(dto, currentUser);
    this.assertCanActOnTeam(targetManagerId, currentUser);

    const [manager, executive] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: targetManagerId },
        select: { id: true, name: true, role: true, isActive: true },
      }),
      this.prisma.user.findUnique({
        where: { id: dto.executiveId },
        select: {
          id: true,
          name: true,
          role: true,
          isActive: true,
          managerId: true,
        },
      }),
    ]);

    if (!manager || manager.role !== Role.MANAGER) {
      throw new NotFoundException(
        `Manager with ID ${targetManagerId} not found`,
      );
    }
    if (!manager.isActive) {
      throw new BadRequestException('Cannot assign to a deactivated manager');
    }
    if (!executive) {
      throw new NotFoundException(
        `Executive with ID ${dto.executiveId} not found`,
      );
    }
    if (executive.role !== Role.EXECUTIVE) {
      throw new BadRequestException(
        'Only a user with the EXECUTIVE role can be assigned to a team',
      );
    }
    if (executive.managerId === targetManagerId) {
      throw new BadRequestException(
        'This executive is already assigned to that manager',
      );
    }

    // A Manager may claim an unassigned Executive but must never be able to
    // take one from another Manager's team. Reassignment is Super Admin only.
    if (
      currentUser.role === Role.MANAGER &&
      executive.managerId !== null &&
      executive.managerId !== currentUser.sub
    ) {
      throw new ForbiddenException(
        'This executive belongs to another manager. Only a Super Admin can reassign them.',
      );
    }

    const previousManagerId = executive.managerId;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: executive.id },
        data: { manager: { connect: { id: targetManagerId } } },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          managerId: true,
          manager: { select: { id: true, name: true, email: true } },
        },
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: previousManagerId ? 'TEAM_REASSIGN' : 'TEAM_ASSIGN',
        entity: 'User',
        entityId: executive.id,
        metadata: {
          executiveName: executive.name,
          previousManagerId,
          newManagerId: targetManagerId,
        },
      });

      return updated;
    });
  }

  async unassignExecutive(executiveId: string, currentUser: AuthUser) {
    const executive = await this.prisma.user.findUnique({
      where: { id: executiveId },
      select: { id: true, name: true, role: true, managerId: true },
    });

    if (!executive) {
      throw new NotFoundException(`Executive with ID ${executiveId} not found`);
    }
    if (executive.role !== Role.EXECUTIVE) {
      throw new BadRequestException('Only an EXECUTIVE can be unassigned');
    }
    if (!executive.managerId) {
      throw new BadRequestException(
        'This executive is not assigned to any manager',
      );
    }

    // A Manager can only release someone from their own team.
    this.assertCanActOnTeam(executive.managerId, currentUser);

    const previousManagerId = executive.managerId;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: executiveId },
        data: { manager: { disconnect: true } },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          managerId: true,
        },
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'TEAM_UNASSIGN',
        entity: 'User',
        entityId: executiveId,
        metadata: {
          executiveName: executive.name,
          previousManagerId,
        },
      });

      return updated;
    });
  }

  private resolveTargetManager(
    dto: AssignExecutiveDto,
    currentUser: AuthUser,
  ): string {
    if (currentUser.role === Role.SUPER_ADMIN) {
      if (!dto.managerId) {
        throw new BadRequestException(
          'managerId is required when assigning as a Super Admin',
        );
      }
      return dto.managerId;
    }

    if (dto.managerId && dto.managerId !== currentUser.sub) {
      throw new ForbiddenException(
        'You can only assign executives to your own team',
      );
    }
    return currentUser.sub;
  }
}
