"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const index_js_1 = require("../common/scope/index.js");
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
let PaymentsService = class PaymentsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    scopeFilter(user) {
        const customerScope = (0, index_js_1.customerScopeFilter)(user);
        return Object.keys(customerScope).length === 0
            ? {}
            : { customer: customerScope };
    }
    round(value) {
        return Math.round(value * 100) / 100;
    }
    async create(dto, currentUser) {
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
            where: { AND: [{ id: dto.customerId }, (0, index_js_1.customerScopeFilter)(currentUser)] },
            select: {
                id: true,
                name: true,
                amount: true,
                amountPaid: true,
                pendingAmount: true,
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        let membershipId = dto.membershipId ?? null;
        if (membershipId) {
            const membership = await this.prisma.membership.findFirst({
                where: { id: membershipId, customerId: customer.id },
                select: { id: true },
            });
            if (!membership) {
                throw new common_1.BadRequestException('That membership does not belong to this customer');
            }
        }
        else {
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
    async findAll(query, currentUser) {
        const { customerId, membershipId, method, page = 1, limit = 20 } = query;
        const filters = [this.scopeFilter(currentUser)];
        if (customerId)
            filters.push({ customerId });
        if (membershipId)
            filters.push({ membershipId });
        if (method)
            filters.push({ method });
        const where = { AND: filters };
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
                totalAmount: this.round(sum._sum.amount ?? 0),
            },
        };
    }
    async findOne(id, currentUser) {
        const payment = await this.prisma.payment.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
            include: PAYMENT_INCLUDE,
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async update(id, dto, currentUser) {
        const payment = await this.prisma.payment.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const data = {};
        if (dto.method !== undefined)
            data.method = dto.method;
        if (dto.date !== undefined)
            data.date = dto.date;
        if (dto.notes !== undefined)
            data.notes = dto.notes;
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
    async remove(id, currentUser) {
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
            throw new common_1.NotFoundException('Payment not found');
        }
        const nextPaid = this.round(Math.max(payment.customer.amountPaid - payment.amount, 0));
        const nextPending = this.round(Math.max(payment.customer.amount - nextPaid, 0));
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
    async getStats(currentUser) {
        const scope = this.scopeFilter(currentUser);
        const customerScope = (0, index_js_1.customerScopeFilter)(currentUser);
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
            planValueTotal: this.round(customerTotals._sum.amount ?? 0),
            recordedPaidTotal: this.round(customerTotals._sum.amountPaid ?? 0),
            pendingTotal: this.round(customerTotals._sum.pendingAmount ?? 0),
            customersWithPending: withPending,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map