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
var CustomersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const notifications_service_js_1 = require("../notifications/notifications.service.js");
const memberships_service_js_1 = require("../memberships/memberships.service.js");
const index_js_1 = require("../common/scope/index.js");
const DELETE_BLOCKERS = {
    payments: true,
    refunds: true,
    bookings: true,
    entitlementLog: true,
    memberships: true,
};
const BLOCKER_LABELS = {
    payments: ['payment', 'payments'],
    refunds: ['refund', 'refunds'],
    bookings: ['booking', 'bookings'],
    entitlementLog: ['entitlement ledger entry', 'entitlement ledger entries'],
    memberships: ['membership', 'memberships'],
};
const OPENING_PAYMENT_NOTE = 'Recorded when the customer was added';
const PLAN_REF = { select: { id: true, name: true } };
const EXEC_SUMMARY = {
    select: { id: true, name: true, email: true },
};
let CustomersService = CustomersService_1 = class CustomersService {
    prisma;
    audit;
    notifications;
    memberships;
    logger = new common_1.Logger(CustomersService_1.name);
    constructor(prisma, audit, notifications, memberships) {
        this.prisma = prisma;
        this.audit = audit;
        this.notifications = notifications;
        this.memberships = memberships;
    }
    pending(amount, amountPaid) {
        return Math.max(amount - amountPaid, 0);
    }
    async resolveAssignee(requested, currentUser) {
        if (currentUser.role === client_1.Role.EXECUTIVE) {
            return currentUser.sub;
        }
        if (!requested) {
            return null;
        }
        const assignee = await this.prisma.user.findFirst({
            where: { AND: [{ id: requested }, (0, index_js_1.assignableUserFilter)(currentUser)] },
            select: { id: true, isActive: true },
        });
        if (!assignee) {
            throw new common_1.BadRequestException('Assigned user not found or not in your team');
        }
        if (!assignee.isActive) {
            throw new common_1.BadRequestException('Cannot assign a customer to a deactivated user');
        }
        return assignee.id;
    }
    async findScopedOrFail(id, currentUser) {
        const customer = await this.prisma.customer.findFirst({
            where: { AND: [{ id }, (0, index_js_1.customerScopeFilter)(currentUser)] },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return customer;
    }
    async create(dto, currentUser) {
        const existing = await this.prisma.customer.findUnique({
            where: { phone: dto.phone },
            select: { id: true },
        });
        if (existing) {
            throw new common_1.ConflictException('A customer with this phone number already exists');
        }
        if (dto.membershipId) {
            const membershipTaken = await this.prisma.customer.findUnique({
                where: { membershipId: dto.membershipId },
                select: { id: true },
            });
            if (membershipTaken) {
                throw new common_1.ConflictException('A customer with this membership ID already exists');
            }
        }
        const assignedExecId = await this.resolveAssignee(dto.assignedExecId, currentUser);
        let plan = null;
        if (dto.packageId) {
            const pkg = await this.prisma.package.findUnique({
                where: { id: dto.packageId },
                select: { id: true, name: true, isActive: true },
            });
            if (!pkg) {
                throw new common_1.BadRequestException('Plan not found');
            }
            if (!pkg.isActive) {
                throw new common_1.BadRequestException(`"${pkg.name}" is inactive and cannot be sold. Activate it under Plans first.`);
            }
            plan = pkg;
        }
        const amount = dto.amount ?? 0;
        const amountPaid = dto.amountPaid ?? 0;
        const customer = await this.prisma.$transaction(async (tx) => {
            const customer = await tx.customer.create({
                data: {
                    name: dto.name,
                    phone: dto.phone,
                    email: dto.email,
                    plan: dto.plan,
                    amount,
                    amountPaid,
                    pendingAmount: this.pending(amount, amountPaid),
                    validity: dto.validity,
                    totalDays: dto.totalDays || 0,
                    totalNights: dto.totalNights || 0,
                    assignedExecId,
                    membershipId: dto.membershipId || null,
                },
                include: { assignedExec: EXEC_SUMMARY },
            });
            if (amountPaid > 0) {
                const openingPayment = await tx.payment.create({
                    data: {
                        customerId: customer.id,
                        amount: amountPaid,
                        method: dto.paymentMethod || null,
                        notes: OPENING_PAYMENT_NOTE,
                    },
                });
                await this.audit.withinTransaction(tx, {
                    actorId: currentUser.sub,
                    action: 'CREATE',
                    entity: 'Payment',
                    entityId: openingPayment.id,
                    metadata: {
                        customerId: customer.id,
                        amount: amountPaid,
                        method: openingPayment.method,
                        source: 'customer-create',
                    },
                });
            }
            if (plan) {
                await this.memberships.recordSaleWithinTransaction(tx, {
                    customerId: customer.id,
                    packageId: plan.id,
                    actorId: currentUser.sub,
                });
            }
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'CREATE',
                entity: 'Customer',
                entityId: customer.id,
                metadata: {
                    name: customer.name,
                    phone: customer.phone,
                    plan: customer.plan,
                    amount: customer.amount,
                    amountPaid: customer.amountPaid,
                    assignedExecId: customer.assignedExecId,
                    membershipId: customer.membershipId,
                    packageId: plan?.id ?? null,
                },
            });
            return customer;
        });
        if (customer.email) {
            this.notifications
                .notifyNewCustomer({
                customerName: customer.name,
                customerEmail: customer.email,
                plan: customer.plan,
                amount: customer.amount,
                amountPaid: customer.amountPaid,
                pendingAmount: customer.pendingAmount,
                validity: customer.validity,
                totalDays: customer.totalDays,
                totalNights: customer.totalNights,
                membershipId: customer.membershipId,
            })
                .catch((error) => {
                this.logger.error(`Customer ${customer.id} was created but the welcome email failed`, error instanceof Error ? error.stack : String(error));
            });
        }
        return customer;
    }
    async findAll(query, currentUser) {
        const { search, status, plan, assignedExecId, assignedManagerId, page = 1, limit = 20, } = query;
        const filters = [
            (0, index_js_1.customerScopeFilter)(currentUser),
        ];
        if (status) {
            filters.push({ status: status });
        }
        if (plan) {
            filters.push({ plan });
        }
        if (assignedExecId) {
            filters.push({ assignedExecId });
        }
        if (assignedManagerId) {
            filters.push({ assignedExec: { managerId: assignedManagerId } });
        }
        if (search) {
            filters.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { membershipId: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        const where = { AND: filters };
        const [data, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    assignedExec: {
                        select: {
                            id: true,
                            name: true,
                            manager: { select: { id: true, name: true } },
                        },
                    },
                    _count: { select: DELETE_BLOCKERS },
                    payments: {
                        select: { id: true, method: true },
                        orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
                        take: 1,
                    },
                },
            }),
            this.prisma.customer.count({ where }),
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
    async findOne(id, currentUser) {
        const customer = await this.prisma.customer.findFirst({
            where: { AND: [{ id }, (0, index_js_1.customerScopeFilter)(currentUser)] },
            include: {
                assignedExec: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        manager: { select: { id: true, name: true, email: true } },
                    },
                },
                payments: {
                    orderBy: { date: 'desc' },
                    take: 10,
                    include: { membership: { select: { package: PLAN_REF } } },
                },
                bookings: { orderBy: { createdAt: 'desc' }, take: 10 },
                refunds: {
                    orderBy: { date: 'desc' },
                    take: 10,
                    include: {
                        membership: { select: { package: PLAN_REF } },
                        approvedBy: { select: { id: true, name: true } },
                    },
                },
                memberships: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        package: {
                            select: {
                                id: true,
                                name: true,
                                days: true,
                                nights: true,
                                price: true,
                                validityMonths: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        payments: true,
                        bookings: true,
                        refunds: true,
                        memberships: true,
                    },
                },
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return customer;
    }
    async update(id, dto, currentUser) {
        const customer = await this.findScopedOrFail(id, currentUser);
        if (dto.phone && dto.phone !== customer.phone) {
            const phoneTaken = await this.prisma.customer.findUnique({
                where: { phone: dto.phone },
                select: { id: true },
            });
            if (phoneTaken) {
                throw new common_1.ConflictException('A customer with this phone number already exists');
            }
        }
        if (dto.membershipId && dto.membershipId !== customer.membershipId) {
            const membershipTaken = await this.prisma.customer.findUnique({
                where: { membershipId: dto.membershipId },
                select: { id: true },
            });
            if (membershipTaken) {
                throw new common_1.ConflictException('A customer with this membership ID already exists');
            }
        }
        const paidChanges = dto.amountPaid !== undefined && dto.amountPaid !== customer.amountPaid;
        const recordedPayments = paidChanges
            ? await this.prisma.payment.count({ where: { customerId: id } })
            : 0;
        if (paidChanges && recordedPayments > 0) {
            throw new common_1.ConflictException('Amount paid is the total of the payment records on this customer, so it cannot be typed over. Add or remove a payment in the payment history instead.');
        }
        if (dto.status !== undefined && dto.status !== customer.status) {
            const membershipCount = await this.prisma.membership.count({
                where: { customerId: id },
            });
            if (membershipCount > 0) {
                throw new common_1.ConflictException('Status follows the memberships on this customer and cannot be set directly. Cancel, expire or reactivate the membership instead.');
            }
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.phone !== undefined)
            data.phone = dto.phone;
        if (dto.email !== undefined)
            data.email = dto.email;
        if (dto.plan !== undefined)
            data.plan = dto.plan;
        if (dto.amount !== undefined)
            data.amount = dto.amount;
        if (dto.amountPaid !== undefined)
            data.amountPaid = dto.amountPaid;
        if (dto.validity !== undefined)
            data.validity = dto.validity;
        if (dto.totalDays !== undefined)
            data.totalDays = dto.totalDays;
        if (dto.totalNights !== undefined)
            data.totalNights = dto.totalNights;
        if (dto.membershipId !== undefined) {
            data.membershipId = dto.membershipId || null;
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        if (dto.amount !== undefined || dto.amountPaid !== undefined) {
            data.pendingAmount = this.pending(dto.amount ?? customer.amount, dto.amountPaid ?? customer.amountPaid);
        }
        if (dto.assignedExecId !== undefined) {
            if (currentUser.role === client_1.Role.EXECUTIVE) {
                if (dto.assignedExecId && dto.assignedExecId !== currentUser.sub) {
                    throw new common_1.BadRequestException('You cannot reassign a customer to another user');
                }
            }
            else {
                const assignee = await this.resolveAssignee(dto.assignedExecId, currentUser);
                data.assignedExec = assignee
                    ? { connect: { id: assignee } }
                    : { disconnect: true };
            }
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.customer.update({
                where: { id },
                data,
                include: { assignedExec: EXEC_SUMMARY },
            });
            if (paidChanges && dto.amountPaid && dto.amountPaid > 0) {
                const active = await tx.membership.findMany({
                    where: { customerId: id, status: 'ACTIVE' },
                    select: { id: true },
                    take: 2,
                });
                const membershipId = active.length === 1 ? active[0].id : null;
                const openingPayment = await tx.payment.create({
                    data: {
                        customerId: id,
                        membershipId,
                        amount: dto.amountPaid,
                        method: dto.paymentMethod || null,
                        notes: OPENING_PAYMENT_NOTE,
                    },
                });
                await this.audit.withinTransaction(tx, {
                    actorId: currentUser.sub,
                    action: 'CREATE',
                    entity: 'Payment',
                    entityId: openingPayment.id,
                    metadata: {
                        customerId: id,
                        amount: dto.amountPaid,
                        membershipId,
                        source: 'customer-update',
                    },
                });
            }
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'UPDATE',
                entity: 'Customer',
                entityId: id,
                metadata: {
                    before: {
                        name: customer.name,
                        phone: customer.phone,
                        email: customer.email,
                        plan: customer.plan,
                        amount: customer.amount,
                        amountPaid: customer.amountPaid,
                        pendingAmount: customer.pendingAmount,
                        status: customer.status,
                        assignedExecId: customer.assignedExecId,
                        membershipId: customer.membershipId,
                    },
                    after: {
                        name: updated.name,
                        phone: updated.phone,
                        email: updated.email,
                        plan: updated.plan,
                        amount: updated.amount,
                        amountPaid: updated.amountPaid,
                        pendingAmount: updated.pendingAmount,
                        status: updated.status,
                        assignedExecId: updated.assignedExecId,
                        membershipId: updated.membershipId,
                    },
                },
            });
            return updated;
        });
    }
    async remove(id, currentUser) {
        const customer = await this.prisma.customer.findFirst({
            where: { AND: [{ id }, (0, index_js_1.customerScopeFilter)(currentUser)] },
            include: { _count: { select: DELETE_BLOCKERS } },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const blockers = customer._count;
        const total = Object.values(blockers).reduce((a, b) => a + b, 0);
        if (total > 0) {
            const detail = Object.entries(blockers)
                .filter(([, count]) => count > 0)
                .map(([kind, count]) => {
                const [one, many] = BLOCKER_LABELS[kind] ?? [kind, kind];
                return `${count} ${count === 1 ? one : many}`;
            })
                .join(', ');
            const advice = customer.status === client_1.CustomerStatus.CANCELLED
                ? 'This customer is already cancelled. They stay on record so the history above remains auditable.'
                : 'Cancel or expire their membership instead — that marks the customer CANCELLED while keeping the history.';
            throw new common_1.ConflictException(`${customer.name} cannot be deleted: ${detail} on record. ${advice}`);
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.customer.delete({ where: { id } });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'DELETE',
                entity: 'Customer',
                entityId: id,
                metadata: {
                    name: customer.name,
                    phone: customer.phone,
                    plan: customer.plan,
                    amount: customer.amount,
                    assignedExecId: customer.assignedExecId,
                },
            });
        });
        return { message: 'Customer deleted successfully' };
    }
    async getStats(currentUser) {
        const scope = (0, index_js_1.customerScopeFilter)(currentUser);
        const countBy = (extra) => this.prisma.customer.count({
            where: { AND: extra ? [scope, extra] : [scope] },
        });
        const [total, active, pending, cancelled, expired, aggregates] = await Promise.all([
            countBy(),
            countBy({ status: 'ACTIVE' }),
            countBy({ status: 'PENDING' }),
            countBy({ status: 'CANCELLED' }),
            countBy({ status: 'EXPIRED' }),
            this.prisma.customer.aggregate({
                where: { AND: [scope] },
                _sum: { amount: true, amountPaid: true, pendingAmount: true },
            }),
        ]);
        return {
            total,
            active,
            pending,
            cancelled,
            expired,
            totalSales: aggregates._sum.amount ?? 0,
            totalPaid: aggregates._sum.amountPaid ?? 0,
            totalPending: aggregates._sum.pendingAmount ?? 0,
        };
    }
    async findAssignableUsers(currentUser) {
        return this.prisma.user.findMany({
            where: {
                AND: [
                    { isActive: true },
                    (0, index_js_1.assignableUserFilter)(currentUser),
                    currentUser.role === client_1.Role.SUPER_ADMIN
                        ? { role: { in: [client_1.Role.EXECUTIVE, client_1.Role.MANAGER] } }
                        : {},
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                manager: { select: { id: true, name: true } },
            },
            orderBy: [{ role: 'asc' }, { name: 'asc' }],
        });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = CustomersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService,
        notifications_service_js_1.NotificationsService,
        memberships_service_js_1.MembershipsService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map