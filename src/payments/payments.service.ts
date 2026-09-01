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
  CreatePaymentDto,
  QueryPaymentsDto,
  UpdatePaymentDto,
} from './dto/index.js';

const PAYMENT_INCLUDE = {
  customer: {
    select: {
      id: true,
      name: true,
      phone: true,
      amount: true,
      amountPaid: true,
      pendingAmount: true,
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
};

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  /** Payments hang off a customer, so the customer's scope is the payment's. */
  private scopeFilter(user: AuthUser): Prisma.PaymentWhereInput {
    const customerScope = customerScopeFilter(user);
    return Object.keys(customerScope).length === 0
      ? {}
      : { customer: customerScope };
  }

  private round(value: number): number {
    // Money is stored as Float in the schema; round to paise to stop binary
    // representation error accumulating across many payments.
    return Math.round(value * 100) / 100;
  }

  async create(dto: CreatePaymentDto, currentUser: AuthUser) {
    // Idempotency first: a retried request must not create a second row.
    if (dto.idempotencyKey) {
      const existing = await this.prisma.payment.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
        include: PAYMENT_INCLUDE,
      });
      if (existing) {
        return existing;
      }
    }

    const customer = await this.prisma.customer.findFirst({
      where: { AND: [{ id: dto.customerId }, customerScopeFilter(currentUser)] },
      select: {
        id: true,
        name: true,
        amount: true,
        amountPaid: true,
        pendingAmount: true,
      },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    let membershipId = dto.membershipId ?? null;

    if (membershipId) {
      const membership = await this.prisma.membership.findFirst({
        where: { id: membershipId, customerId: customer.id },
        select: { id: true },
      });
      if (!membership) {
        throw new BadRequestException(
          'That membership does not belong to this customer',
        );
      }
    } else {
      /*
       * Attribute the money to the plan it is obviously for. A customer holds
       * at most one ACTIVE membership (§7), so when exactly one exists the
       * attribution is unambiguous and leaving the column blank only loses
       * information. Zero or several active rows: stay null rather than guess.
       */
      const active = await this.prisma.membership.findMany({
        where: { customerId: customer.id, status: 'ACTIVE' },
        select: { id: true },
        take: 2,
      });
      if (active.length === 1) {
        membershipId = active[0].id;
      }
    }

    const amount = this.round(dto.amount);
    const nextPaid = this.round(customer.amountPaid + amount);
    const nextPending = this.round(Math.max(customer.amount - nextPaid, 0));

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          customerId: customer.id,
          membershipId,
          amount,
          method: dto.method ?? null,
          date: dto.date ?? new Date(),
          notes: dto.notes ?? null,
          idempotencyKey: dto.idempotencyKey ?? null,
        },
        include: PAYMENT_INCLUDE,
      });

      /*
       * Spec 9.1: amount paid is the sum of payment records and pending is
       * total minus paid. The running totals on the customer are advanced here
       * rather than recomputed from scratch, so values carried in from Excel
       * (Phase 9) without individual rows are preserved rather than wiped.
       */
      await tx.customer.update({
        where: { id: customer.id },
        data: { amountPaid: nextPaid, pendingAmount: nextPending },
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'CREATE',
        entity: 'Payment',
        entityId: payment.id,
        metadata: {
          customerId: customer.id,
          customerName: customer.name,
          membershipId,
          amount,
          method: payment.method,
          customerTotals: {
            before: {
              amountPaid: customer.amountPaid,
              pendingAmount: customer.pendingAmount,
            },
            after: { amountPaid: nextPaid, pendingAmount: nextPending },
          },
        },
      });

      return payment;
    });
  }

  async findAll(query: QueryPaymentsDto, currentUser: AuthUser) {
    const { customerId, membershipId, method, page = 1, limit = 20 } = query;

    const filters: Prisma.PaymentWhereInput[] = [this.scopeFilter(currentUser)];
    if (customerId) filters.push({ customerId });
    if (membershipId) filters.push({ membershipId });
    if (method) filters.push({ method });

    const where: Prisma.PaymentWhereInput = { AND: filters };

    const [data, total, sum] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
        include: PAYMENT_INCLUDE,
      }),
      this.prisma.payment.count({ where }),
      this.prisma.payment.aggregate({ where, _sum: { amount: true } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        // Sum across the whole filtered set, not just this page.
        totalAmount: this.round(sum._sum.amount ?? 0),
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const payment = await this.prisma.payment.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
      include: PAYMENT_INCLUDE,
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  /**
   * Corrects the descriptive fields only. The amount is immutable (Spec 9.1 —
   * never overwrite a payment value); an incorrect amount must be deleted and
   * re-recorded so the history shows what happened.
   */
  async update(id: string, dto: UpdatePaymentDto, currentUser: AuthUser) {
    const payment = await this.prisma.payment.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const data: Prisma.PaymentUpdateInput = {};
    if (dto.method !== undefined) data.method = dto.method;
    if (dto.date !== undefined) data.date = dto.date;
    if (dto.notes !== undefined) data.notes = dto.notes;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id },
        data,
        include: PAYMENT_INCLUDE,
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'UPDATE',
        entity: 'Payment',
        entityId: id,
        metadata: {
          amountUnchanged: payment.amount,
          before: {
            method: payment.method,
            date: payment.date.toISOString(),
            notes: payment.notes,
          },
          after: {
            method: updated.method,
            date: updated.date.toISOString(),
            notes: updated.notes,
          },
        },
      });

      return updated;
    });
  }

  /** Deleting reverses the customer's running totals in the same transaction. */
  async remove(id: string, currentUser: AuthUser) {
    const payment = await this.prisma.payment.findFirst({
      where: { AND: [{ id }, this.scopeFilter(currentUser)] },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            amount: true,
            amountPaid: true,
            pendingAmount: true,
          },
        },
      },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const nextPaid = this.round(
      Math.max(payment.customer.amountPaid - payment.amount, 0),
    );
    const nextPending = this.round(
      Math.max(payment.customer.amount - nextPaid, 0),
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.delete({ where: { id } });

      await tx.customer.update({
        where: { id: payment.customer.id },
        data: { amountPaid: nextPaid, pendingAmount: nextPending },
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'DELETE',
        entity: 'Payment',
        entityId: id,
        metadata: {
          customerId: payment.customer.id,
          amount: payment.amount,
          method: payment.method,
          date: payment.date.toISOString(),
          customerTotals: {
            before: {
              amountPaid: payment.customer.amountPaid,
              pendingAmount: payment.customer.pendingAmount,
            },
            after: { amountPaid: nextPaid, pendingAmount: nextPending },
          },
        },
      });
    });

    return { message: 'Payment deleted successfully' };
  }

  /** Collection figures for the caller's scope (Spec 12). */
  async getStats(currentUser: AuthUser) {
    const scope = this.scopeFilter(currentUser);
    const customerScope = customerScopeFilter(currentUser);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [all, thisMonth, customerTotals, withPending] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { AND: [scope] },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: { AND: [scope, { date: { gte: startOfMonth } }] },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.customer.aggregate({
        where: { AND: [customerScope] },
        _sum: { amount: true, amountPaid: true, pendingAmount: true },
      }),
      this.prisma.customer.count({
        where: { AND: [customerScope, { pendingAmount: { gt: 0 } }] },
      }),
    ]);

    return {
      paymentCount: all._count,
      collectedTotal: this.round(all._sum.amount ?? 0),
      collectedThisMonth: this.round(thisMonth._sum.amount ?? 0),
      paymentsThisMonth: thisMonth._count,
      // From the customer records — includes values imported without rows.
      planValueTotal: this.round(customerTotals._sum.amount ?? 0),
      recordedPaidTotal: this.round(customerTotals._sum.amountPaid ?? 0),
      pendingTotal: this.round(customerTotals._sum.pendingAmount ?? 0),
      customersWithPending: withPending,
    };
  }
}
