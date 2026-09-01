import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { customerScopeFilter } from '../common/scope/index.js';
import type { AuthUser } from '../common/types/index.js';
import {
  CreateRefundDto,
  QueryRefundsDto,
  UpdateRefundDto,
} from './dto/index.js';

const REFUND_INCLUDE = {
  customer: {
    select: {
      id: true,
      name: true,
      phone: true,
      amount: true,
      amountPaid: true,
      assignedExecId: true,
    },
  },
  membership: {
    select: {
      id: true,
      status: true,
      package: { select: { id: true, name: true } },
    },
  },
  approvedBy: { select: { id: true, name: true, email: true, role: true } },
};

@Injectable()
export class RefundsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  /** Refunds hang off a customer, so the customer's scope is the refund's. */
  private scopeFilter(user: AuthUser): Prisma.RefundWhereInput {
    const customerScope = customerScopeFilter(user);
    return Object.keys(customerScope).length === 0
      ? {}
      : { customer: customerScope };
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  async create(dto: CreateRefundDto, currentUser: AuthUser) {
    if (dto.idempotencyKey) {
      const existing = await this.prisma.refund.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
        include: REFUND_INCLUDE,
      });
      if (existing) {
        return existing;
      }
    }

    const customer = await this.prisma.customer.findFirst({
      where: { AND: [{ id: dto.customerId }, customerScopeFilter(currentUser)] },
      select: { id: true, name: true, amountPaid: true },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (dto.membershipId) {
      const membership = await this.prisma.membership.findFirst({
        where: { id: dto.membershipId, customerId: customer.id },
        select: { id: true },
      });
      if (!membership) {
        throw new BadRequestException(
          'That membership does not belong to this customer',
        );
      }
    }

    const amount = this.round(dto.amount);

    // A refund cannot exceed what the customer has actually paid, minus what
    // has already been refunded — otherwise the CRM would show money returned
    // that was never received.
    const alreadyRefunded = await this.prisma.refund.aggregate({
      where: { customerId: customer.id },
      _sum: { amount: true },
    });
    const refundable = this.round(
      customer.amountPaid - (alreadyRefunded._sum.amount ?? 0),
    );
    if (amount > refundable) {
      throw new BadRequestException(
        `Refund of ${amount} exceeds the refundable balance of ${refundable} (paid ${customer.amountPaid}, already refunded ${this.round(alreadyRefunded._sum.amount ?? 0)}).`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const refund = await tx.refund.create({
        data: {
          customerId: customer.id,
          membershipId: dto.membershipId ?? null,
          amount,
          date: dto.date ?? new Date(),
          reason: dto.reason ?? null,
          // Whoever records the refund is the approver of record until the
          // client confirms a separate approval workflow (Spec 22 #3).
          approvedById: currentUser.sub,
          idempotencyKey: dto.idempotencyKey ?? null,
        },
        include: REFUND_INCLUDE,
      });

      /*
       * CLIENT_CLARIFICATION_REQUIRED (Spec 22 #3, and #2 for incentives):
       * whether a refund should reduce the customer's `amountPaid` — and so
       * raise their pending amount — or be reported alongside it is not
       * confirmed. Nothing is mutated here: refunds are tracked and totalled
       * separately, which keeps payment history truthful either way.
       */

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'CREATE',
        entity: 'Refund',
        entityId: refund.id,
        metadata: {
          customerId: customer.id,
          customerName: customer.name,
          membershipId: dto.membershipId ?? null,
          amount,
          reason: refund.reason,
          approvedById: currentUser.sub,
          refundableBalanceBefore: refundable,
        },
      });

      return refund;
    });
  }

  async findAll(query: QueryRefundsDto, currentUser: AuthUser) {
    const {
      customerId,
      membershipId,
      approvedById,
      page = 1,
      limit = 20,
    } = query;

    const filters: Prisma.RefundWhereInput[] = [this.scopeFilter(currentUser)];
    if (customerId) filters.push({ customerId });
    if (membershipId) filters.push({ membershipId });
    if (approvedById) filters.push({ approvedById });

    const where: Prisma.RefundWhereInput = { AND: filters };

    const [data, total, sum] = await Promise.all([
      this.prisma.refund.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
        include: REFUND_INCLUDE,
      }),
      this.prisma.refund.count({ where }),
      this.prisma.refund.aggregate({ where, _sum: { amount: true } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        totalAmount: this.round(sum._sum.amount ?? 0),
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const refund = await this.prisma.refund.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
      include: REFUND_INCLUDE,
    });
    if (!refund) {
      throw new NotFoundException('Refund not found');
    }
    return refund;
  }

  /** Reason and date only; the amount is immutable. */
  async update(id: string, dto: UpdateRefundDto, currentUser: AuthUser) {
    const refund = await this.prisma.refund.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
    });
    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    const data: Prisma.RefundUpdateInput = {};
    if (dto.date !== undefined) data.date = dto.date;
    if (dto.reason !== undefined) data.reason = dto.reason;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.refund.update({
        where: { id },
        data,
        include: REFUND_INCLUDE,
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'UPDATE',
        entity: 'Refund',
        entityId: id,
        metadata: {
          amountUnchanged: refund.amount,
          before: {
            date: refund.date.toISOString(),
            reason: refund.reason,
          },
          after: {
            date: updated.date.toISOString(),
            reason: updated.reason,
          },
        },
      });

      return updated;
    });
  }

  async remove(id: string, currentUser: AuthUser) {
    const refund = await this.prisma.refund.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
      include: { customer: { select: { id: true, name: true } } },
    });
    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.refund.delete({ where: { id } });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'DELETE',
        entity: 'Refund',
        entityId: id,
        metadata: {
          customerId: refund.customer.id,
          customerName: refund.customer.name,
          amount: refund.amount,
          reason: refund.reason,
          date: refund.date.toISOString(),
        },
      });
    });

    return { message: 'Refund deleted successfully' };
  }

  /** Refund figures for the caller's scope (Spec 12 lists refunds separately). */
  async getStats(currentUser: AuthUser) {
    const scope = this.scopeFilter(currentUser);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [all, thisMonth, affected] = await Promise.all([
      this.prisma.refund.aggregate({
        where: { AND: [scope] },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.refund.aggregate({
        where: { AND: [scope, { date: { gte: startOfMonth } }] },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.refund.findMany({
        where: { AND: [scope] },
        distinct: ['customerId'],
        select: { customerId: true },
      }),
    ]);

    return {
      refundCount: all._count,
      refundedTotal: this.round(all._sum.amount ?? 0),
      refundedThisMonth: this.round(thisMonth._sum.amount ?? 0),
      refundsThisMonth: thisMonth._count,
      customersRefunded: affected.length,
    };
  }
}
