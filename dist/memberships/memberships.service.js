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
exports.MembershipsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const entitlements_service_js_1 = require("../entitlements/entitlements.service.js");
const index_js_1 = require("../common/scope/index.js");
const MEMBERSHIP_INCLUDE = {
    package: {
        select: {
            id: true,
            name: true,
            price: true,
            days: true,
            nights: true,
            validityMonths: true,
        },
    },
    customer: {
        select: {
            id: true,
            name: true,
            phone: true,
            assignedExecId: true,
            assignedExec: { select: { id: true, name: true } },
        },
    },
    _count: { select: { bookings: true, entitlementLog: true } },
};
let MembershipsService = class MembershipsService {
    prisma;
    audit;
    entitlements;
    constructor(prisma, audit, entitlements) {
        this.prisma = prisma;
        this.audit = audit;
        this.entitlements = entitlements;
    }
    addMonths(from, months) {
        const end = new Date(from);
        const targetMonth = end.getMonth() + months;
        end.setMonth(targetMonth);
        if (end.getMonth() !== ((targetMonth % 12) + 12) % 12) {
            end.setDate(0);
        }
        return end;
    }
    async findScopedOrFail(id, currentUser) {
        const membership = await this.prisma.membership.findFirst({
            where: { AND: [{ id }, (0, index_js_1.membershipScopeFilter)(currentUser)] },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        return membership;
    }
    async create(dto, currentUser) {
        const customer = await this.prisma.customer.findFirst({
            where: { AND: [{ id: dto.customerId }, (0, index_js_1.customerScopeFilter)(currentUser)] },
            select: {
                id: true,
                name: true,
                plan: true,
                validity: true,
                totalDays: true,
                totalNights: true,
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const pkg = await this.prisma.package.findUnique({
            where: { id: dto.packageId },
        });
        if (!pkg) {
            throw new common_1.NotFoundException('Plan not found');
        }
        if (!pkg.isActive) {
            throw new common_1.BadRequestException(`"${pkg.name}" is inactive and cannot be sold. Activate it under Plans first.`);
        }
        const active = await this.prisma.membership.findFirst({
            where: { customerId: customer.id, status: client_1.MembershipStatus.ACTIVE },
            include: { package: { select: { name: true } } },
        });
        if (active) {
            throw new common_1.ConflictException(`${customer.name} already has an active membership${active.package ? ` (${active.package.name})` : ''}. Cancel or expire it before adding a new one.`);
        }
        const startDate = dto.startDate ?? new Date();
        const endDate = dto.endDate ?? this.addMonths(startDate, pkg.validityMonths);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('End date must be after the start date');
        }
        return this.prisma.$transaction((tx) => this.recordSaleWithinTransaction(tx, {
            customerId: customer.id,
            packageId: pkg.id,
            startDate,
            endDate,
            actorId: currentUser.sub,
        }));
    }
    async recordSaleWithinTransaction(tx, params) {
        const pkg = await tx.package.findUniqueOrThrow({
            where: { id: params.packageId },
        });
        const customer = await tx.customer.findUniqueOrThrow({
            where: { id: params.customerId },
            select: {
                id: true,
                name: true,
                plan: true,
                validity: true,
                totalDays: true,
                totalNights: true,
            },
        });
        const { actorId } = params;
        const startDate = params.startDate ?? new Date();
        const endDate = params.endDate ?? this.addMonths(startDate, pkg.validityMonths);
        const validityText = pkg.validityMonths % 12 === 0
            ? `${pkg.validityMonths / 12} ${pkg.validityMonths === 12 ? 'Year' : 'Years'}`
            : `${pkg.validityMonths} Months`;
        {
            const membership = await tx.membership.create({
                data: {
                    customerId: customer.id,
                    packageId: pkg.id,
                    startDate,
                    endDate,
                    status: client_1.MembershipStatus.ACTIVE,
                },
                include: MEMBERSHIP_INCLUDE,
            });
            const customerUpdate = await tx.customer.update({
                where: { id: customer.id },
                data: {
                    plan: pkg.name,
                    validity: validityText,
                    totalDays: pkg.days,
                    totalNights: pkg.nights,
                },
                select: { plan: true, validity: true, totalDays: true, totalNights: true },
            });
            const customerStatus = await this.syncCustomerStatus(tx, customer.id);
            const allocation = await this.entitlements.recordAllocation(tx, {
                customerId: customer.id,
                membershipId: membership.id,
                nights: pkg.nights,
                packageName: pkg.name,
                actorId,
            });
            const attached = await tx.payment.updateMany({
                where: { customerId: customer.id, membershipId: null },
                data: { membershipId: membership.id },
            });
            await this.audit.withinTransaction(tx, {
                actorId,
                action: 'CREATE',
                entity: 'Membership',
                entityId: membership.id,
                metadata: {
                    customerId: customer.id,
                    customerName: customer.name,
                    packageId: pkg.id,
                    packageName: pkg.name,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    customerFieldsSynced: {
                        before: {
                            plan: customer.plan,
                            validity: customer.validity,
                            totalDays: customer.totalDays,
                            totalNights: customer.totalNights,
                        },
                        after: customerUpdate,
                    },
                    entitlementAllocated: {
                        ledgerId: allocation.id,
                        nights: pkg.nights,
                    },
                    paymentsAttributed: attached.count,
                    customerStatus,
                },
            });
            return membership;
        }
    }
    async findAll(query, currentUser) {
        const { customerId, packageId, status, page = 1, limit = 20 } = query;
        const filters = [
            (0, index_js_1.membershipScopeFilter)(currentUser),
        ];
        if (customerId)
            filters.push({ customerId });
        if (packageId)
            filters.push({ packageId });
        if (status) {
            filters.push({ status: status });
        }
        const where = { AND: filters };
        const [data, total] = await Promise.all([
            this.prisma.membership.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{ status: 'asc' }, { startDate: 'desc' }],
                include: MEMBERSHIP_INCLUDE,
            }),
            this.prisma.membership.count({ where }),
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
        const membership = await this.prisma.membership.findFirst({
            where: { AND: [{ id }, (0, index_js_1.membershipScopeFilter)(currentUser)] },
            include: MEMBERSHIP_INCLUDE,
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        return membership;
    }
    async update(id, dto, currentUser) {
        const membership = await this.findScopedOrFail(id, currentUser);
        const data = {};
        if (dto.packageId && dto.packageId !== membership.packageId) {
            const pkg = await this.prisma.package.findUnique({
                where: { id: dto.packageId },
                select: { id: true, isActive: true, name: true },
            });
            if (!pkg) {
                throw new common_1.NotFoundException('Plan not found');
            }
            if (!pkg.isActive) {
                throw new common_1.BadRequestException(`"${pkg.name}" is inactive`);
            }
            data.package = { connect: { id: pkg.id } };
        }
        if (dto.startDate !== undefined)
            data.startDate = dto.startDate;
        if (dto.endDate !== undefined)
            data.endDate = dto.endDate;
        const nextStart = dto.startDate ?? membership.startDate;
        const nextEnd = dto.endDate ?? membership.endDate;
        if (nextEnd && nextEnd <= nextStart) {
            throw new common_1.BadRequestException('End date must be after the start date');
        }
        if (dto.status === client_1.MembershipStatus.ACTIVE &&
            membership.status !== client_1.MembershipStatus.ACTIVE) {
            const other = await this.prisma.membership.findFirst({
                where: {
                    customerId: membership.customerId,
                    status: client_1.MembershipStatus.ACTIVE,
                    id: { not: id },
                },
                select: { id: true },
            });
            if (other) {
                throw new common_1.ConflictException('This customer already has another active membership');
            }
        }
        if (dto.status !== undefined) {
            data.status = dto.status;
        }
        const isEnding = dto.status !== undefined &&
            dto.status !== membership.status &&
            dto.status !== client_1.MembershipStatus.ACTIVE;
        const isReopening = dto.status === client_1.MembershipStatus.ACTIVE &&
            membership.status !== client_1.MembershipStatus.ACTIVE;
        return this.prisma.$transaction(async (tx) => {
            if (isEnding || isReopening) {
                await this.entitlements.lockMembershipForUpdate(tx, id);
            }
            const updated = await tx.membership.update({
                where: { id },
                data,
                include: MEMBERSHIP_INCLUDE,
            });
            let ledgerMovement = null;
            if (isEnding) {
                const closure = await this.entitlements.closeMembershipBalance(tx, {
                    customerId: membership.customerId,
                    membershipId: id,
                    reason: `Membership ${String(dto.status).toLowerCase()}`,
                    actorId: currentUser.sub,
                });
                if (closure) {
                    ledgerMovement = { id: closure.id, nights: closure.nights };
                }
            }
            else if (isReopening) {
                const reopen = await this.entitlements.reopenMembershipBalance(tx, {
                    customerId: membership.customerId,
                    membershipId: id,
                    actorId: currentUser.sub,
                });
                if (reopen) {
                    ledgerMovement = { id: reopen.id, nights: reopen.nights };
                }
            }
            const customerStatus = await this.syncCustomerStatus(tx, membership.customerId);
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: dto.status && dto.status !== membership.status
                    ? `STATUS_${dto.status}`
                    : 'UPDATE',
                entity: 'Membership',
                entityId: id,
                metadata: {
                    before: {
                        packageId: membership.packageId,
                        startDate: membership.startDate.toISOString(),
                        endDate: membership.endDate?.toISOString() ?? null,
                        status: membership.status,
                    },
                    after: {
                        packageId: updated.packageId,
                        startDate: updated.startDate.toISOString(),
                        endDate: updated.endDate?.toISOString() ?? null,
                        status: updated.status,
                    },
                    entitlementMovement: ledgerMovement,
                    customerStatus,
                },
            });
            return updated;
        });
    }
    async syncCustomerStatus(tx, customerId) {
        const memberships = await tx.membership.findMany({
            where: { customerId },
            orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
            select: { status: true },
        });
        if (memberships.length === 0) {
            return null;
        }
        const next = memberships.some((m) => m.status === client_1.MembershipStatus.ACTIVE)
            ? client_1.CustomerStatus.ACTIVE
            : memberships[0].status === client_1.MembershipStatus.CANCELLED
                ? client_1.CustomerStatus.CANCELLED
                : client_1.CustomerStatus.EXPIRED;
        await tx.customer.update({
            where: { id: customerId },
            data: { status: next },
        });
        return next;
    }
    async setStatus(id, status, currentUser) {
        return this.update(id, { status }, currentUser);
    }
    async remove(id, currentUser) {
        const membership = await this.findScopedOrFail(id, currentUser);
        const [bookings, ledger] = await Promise.all([
            this.prisma.booking.count({ where: { membershipId: id } }),
            this.prisma.entitlementLedger.count({ where: { membershipId: id } }),
        ]);
        if (bookings > 0 || ledger > 0) {
            const parts = [
                bookings > 0 ? `${bookings} booking(s)` : null,
                ledger > 0 ? `${ledger} ledger entr${ledger === 1 ? 'y' : 'ies'}` : null,
            ].filter(Boolean);
            throw new common_1.ConflictException(`Cannot delete this membership: ${parts.join(' and ')} recorded against it. Cancel it instead.`);
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.membership.delete({ where: { id } });
            await this.syncCustomerStatus(tx, membership.customerId);
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'DELETE',
                entity: 'Membership',
                entityId: id,
                metadata: {
                    customerId: membership.customerId,
                    packageId: membership.packageId,
                    startDate: membership.startDate.toISOString(),
                    status: membership.status,
                },
            });
        });
        return { message: 'Membership deleted successfully' };
    }
    async getStats(currentUser) {
        const scope = (0, index_js_1.membershipScopeFilter)(currentUser);
        const countBy = (extra) => this.prisma.membership.count({
            where: { AND: extra ? [scope, extra] : [scope] },
        });
        const now = new Date();
        const in30Days = new Date(now);
        in30Days.setDate(in30Days.getDate() + 30);
        const [total, active, expired, cancelled, expiringSoon, overdue] = await Promise.all([
            countBy(),
            countBy({ status: client_1.MembershipStatus.ACTIVE }),
            countBy({ status: client_1.MembershipStatus.EXPIRED }),
            countBy({ status: client_1.MembershipStatus.CANCELLED }),
            countBy({
                status: client_1.MembershipStatus.ACTIVE,
                endDate: { gte: now, lte: in30Days },
            }),
            countBy({ status: client_1.MembershipStatus.ACTIVE, endDate: { lt: now } }),
        ]);
        return {
            total,
            active,
            expired,
            cancelled,
            expiringSoon,
            pastEndDate: overdue,
        };
    }
};
exports.MembershipsService = MembershipsService;
exports.MembershipsService = MembershipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService,
        entitlements_service_js_1.EntitlementsService])
], MembershipsService);
//# sourceMappingURL=memberships.service.js.map