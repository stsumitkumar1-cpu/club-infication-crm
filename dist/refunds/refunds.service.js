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
exports.RefundsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const index_js_1 = require("../common/scope/index.js");
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
let RefundsService = class RefundsService {
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
            const existing = await this.prisma.refund.findUnique({
                where: { idempotencyKey: dto.idempotencyKey },
                include: REFUND_INCLUDE,
            });
            if (existing) {
                return existing;
            }
        }
        const customer = await this.prisma.customer.findFirst({
            where: { AND: [{ id: dto.customerId }, (0, index_js_1.customerScopeFilter)(currentUser)] },
            select: { id: true, name: true, amountPaid: true },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        if (dto.membershipId) {
            const membership = await this.prisma.membership.findFirst({
                where: { id: dto.membershipId, customerId: customer.id },
                select: { id: true },
            });
            if (!membership) {
                throw new common_1.BadRequestException('That membership does not belong to this customer');
            }
        }
        const amount = this.round(dto.amount);
        const alreadyRefunded = await this.prisma.refund.aggregate({
            where: { customerId: customer.id },
            _sum: { amount: true },
        });
        const refundable = this.round(customer.amountPaid - (alreadyRefunded._sum.amount ?? 0));
        if (amount > refundable) {
            throw new common_1.BadRequestException(`Refund of ${amount} exceeds the refundable balance of ${refundable} (paid ${customer.amountPaid}, already refunded ${this.round(alreadyRefunded._sum.amount ?? 0)}).`);
        }
        return this.prisma.$transaction(async (tx) => {
            const refund = await tx.refund.create({
                data: {
                    customerId: customer.id,
                    membershipId: dto.membershipId ?? null,
                    amount,
                    date: dto.date ?? new Date(),
                    reason: dto.reason ?? null,
                    approvedById: currentUser.sub,
                    idempotencyKey: dto.idempotencyKey ?? null,
                },
                include: REFUND_INCLUDE,
            });
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
    async findAll(query, currentUser) {
        const { customerId, membershipId, approvedById, page = 1, limit = 20, } = query;
        const filters = [this.scopeFilter(currentUser)];
        if (customerId)
            filters.push({ customerId });
        if (membershipId)
            filters.push({ membershipId });
        if (approvedById)
            filters.push({ approvedById });
        const where = { AND: filters };
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
    async findOne(id, currentUser) {
        const refund = await this.prisma.refund.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
            include: REFUND_INCLUDE,
        });
        if (!refund) {
            throw new common_1.NotFoundException('Refund not found');
        }
        return refund;
    }
    async update(id, dto, currentUser) {
        const refund = await this.prisma.refund.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
        });
        if (!refund) {
            throw new common_1.NotFoundException('Refund not found');
        }
        const data = {};
        if (dto.date !== undefined)
            data.date = dto.date;
        if (dto.reason !== undefined)
            data.reason = dto.reason;
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
    async remove(id, currentUser) {
        const refund = await this.prisma.refund.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
            include: { customer: { select: { id: true, name: true } } },
        });
        if (!refund) {
            throw new common_1.NotFoundException('Refund not found');
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
    async getStats(currentUser) {
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
};
exports.RefundsService = RefundsService;
exports.RefundsService = RefundsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService])
], RefundsService);
//# sourceMappingURL=refunds.service.js.map