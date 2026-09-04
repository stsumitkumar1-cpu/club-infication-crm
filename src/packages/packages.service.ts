import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';
import {
  CreatePackageDto,
  QueryPackagesDto,
  UpdatePackageDto,
} from './dto/index.js';

/**
 * Plan catalog — Master Spec 6.2. This is global configuration rather than
 * per-team data, so there is no record scope: every role reads the same
 * catalog (an Executive needs it to pick a plan) and only a Super Admin
 * writes to it. The role gate lives on the controller.
 */
@Injectable()
export class PackagesService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private async assertNameFree(name: string, exceptId?: string) {
    const existing = await this.prisma.package.findUnique({
      where: { name },
      select: { id: true },
    });
    if (existing && existing.id !== exceptId) {
      throw new ConflictException(`A plan named "${name}" already exists`);
    }
  }

  async create(dto: CreatePackageDto, currentUser: AuthUser) {
    await this.assertNameFree(dto.name);

    return this.prisma.$transaction(async (tx) => {
      const pkg = await tx.package.create({
        data: {
          name: dto.name,
          price: dto.price,
          days: dto.days,
          nights: dto.nights,
          // Null keeps the older behaviour: `nights` is one pool for the whole
          // term rather than an annual allowance that lapses.
          nightsPerYear: dto.nightsPerYear ?? null,
          validityMonths: dto.validityMonths,
          isActive: dto.isActive ?? true,
        },
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'CREATE',
        entity: 'Package',
        entityId: pkg.id,
        metadata: {
          name: pkg.name,
          price: pkg.price,
          days: pkg.days,
          nights: pkg.nights,
          validityMonths: pkg.validityMonths,
          isActive: pkg.isActive,
        },
      });

      return pkg;
    });
  }

  async findAll(query: QueryPackagesDto) {
    const { search, isActive, page = 1, limit = 50 } = query;

    const filters: Prisma.PackageWhereInput[] = [];
    if (isActive !== undefined) {
      filters.push({ isActive });
    }
    if (search) {
      filters.push({ name: { contains: search } });
    }

    const where: Prisma.PackageWhereInput =
      filters.length > 0 ? { AND: filters } : {};

    const [data, total] = await Promise.all([
      this.prisma.package.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isActive: 'desc' }, { price: 'asc' }],
        include: { _count: { select: { memberships: true } } },
      }),
      this.prisma.package.count({ where }),
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

  async findOne(id: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
      include: { _count: { select: { memberships: true } } },
    });
    if (!pkg) {
      throw new NotFoundException('Plan not found');
    }
    return pkg;
  }

  async update(id: string, dto: UpdatePackageDto, currentUser: AuthUser) {
    const pkg = await this.prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException('Plan not found');
    }

    if (dto.name && dto.name !== pkg.name) {
      await this.assertNameFree(dto.name, id);
    }

    const data: Prisma.PackageUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.days !== undefined) data.days = dto.days;
    if (dto.nights !== undefined) data.nights = dto.nights;
    if (dto.nightsPerYear !== undefined) {
      data.nightsPerYear = dto.nightsPerYear;
    }
    if (dto.validityMonths !== undefined) {
      data.validityMonths = dto.validityMonths;
    }
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    const action =
      dto.isActive === false && pkg.isActive
        ? 'DEACTIVATE'
        : dto.isActive === true && !pkg.isActive
          ? 'ACTIVATE'
          : 'UPDATE';

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.package.update({ where: { id }, data });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action,
        entity: 'Package',
        entityId: id,
        metadata: {
          before: {
            name: pkg.name,
            price: pkg.price,
            days: pkg.days,
            nights: pkg.nights,
            validityMonths: pkg.validityMonths,
            isActive: pkg.isActive,
          },
          after: {
            name: updated.name,
            price: updated.price,
            days: updated.days,
            nights: updated.nights,
            validityMonths: updated.validityMonths,
            isActive: updated.isActive,
          },
        },
      });

      return updated;
    });
  }

  async setActive(id: string, isActive: boolean, currentUser: AuthUser) {
    return this.update(id, { isActive }, currentUser);
  }

  async remove(id: string, currentUser: AuthUser) {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
      include: { _count: { select: { memberships: true } } },
    });
    if (!pkg) {
      throw new NotFoundException('Plan not found');
    }

    // A plan that customers have already bought is part of their history.
    if (pkg._count.memberships > 0) {
      throw new ConflictException(
        `Cannot delete "${pkg.name}": ${pkg._count.memberships} membership(s) reference it. Deactivate it instead so it stops appearing in new sales.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.package.delete({ where: { id } });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'DELETE',
        entity: 'Package',
        entityId: id,
        metadata: {
          name: pkg.name,
          price: pkg.price,
          days: pkg.days,
          nights: pkg.nights,
          validityMonths: pkg.validityMonths,
        },
      });
    });

    return { message: 'Plan deleted successfully' };
  }
}
