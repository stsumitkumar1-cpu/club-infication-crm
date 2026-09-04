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
exports.EntitlementsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const index_js_1 = require("../common/scope/index.js");
const entitlement_types_js_1 = require("./entitlement.types.js");
const LEDGER_INCLUDE = {
    customer: { select: { id: true, name: true, phone: true } },
    membership: {
        select: {
            id: true,
            status: true,
            package: { select: { id: true, name: true } },
        },
    },
    booking: {
        select: { id: true, checkIn: true, checkOut: true, status: true },
    },
};
let EntitlementsService = class EntitlementsService {
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
    async balanceFor(db, where) {
        const filter = {
            customerId: where.customerId,
        };
        if (where.membershipId !== undefined) {
            filter.membershipId = where.membershipId;
        }
        const [plan, complimentary] = await Promise.all([
            db.entitlementLedger.aggregate({
                where: { ...filter, bucket: entitlement_types_js_1.EntitlementBucket.PLAN },
                _sum: { nights: true },
            }),
            db.entitlementLedger.aggregate({
                where: { ...filter, bucket: entitlement_types_js_1.EntitlementBucket.COMPLIMENTARY },
                _sum: { nights: true },
            }),
        ]);
        const nights = plan._sum.nights ?? 0;
        return {
            nights,
            days: (0, entitlement_types_js_1.daysForNights)(nights),
            complimentaryNights: complimentary._sum.nights ?? 0,
        };
    }
    async record(db, movement) {
        return db.entitlementLedger.create({
            data: {
                customerId: movement.customerId,
                membershipId: movement.membershipId ?? null,
                bookingId: movement.bookingId ?? null,
                type: movement.type,
                bucket: movement.bucket ?? entitlement_types_js_1.EntitlementBucket.PLAN,
                yearIndex: movement.yearIndex ?? null,
                days: 0,
                nights: movement.nights,
                description: movement.description ?? null,
                actorId: movement.actorId ?? null,
                date: movement.date ?? new Date(),
            },
        });
    }
    async lockMembershipForUpdate(tx, membershipId) {
        await tx.$queryRaw `SELECT id FROM "Membership" WHERE id = ${membershipId} FOR UPDATE`;
    }
    async recordAllocation(tx, params) {
        return this.record(tx, {
            customerId: params.customerId,
            membershipId: params.membershipId,
            type: entitlement_types_js_1.LedgerType.ALLOCATION,
            nights: params.nights,
            description: `Allocated by ${params.packageName} membership`,
            actorId: params.actorId,
        });
    }
    async reconcileAnnualEntitlement(tx, membershipId, actorId) {
        const idle = { yearIndex: null, allocatedNights: 0, lapsedNights: 0 };
        const membership = await tx.membership.findUnique({
            where: { id: membershipId },
            select: {
                id: true,
                customerId: true,
                startDate: true,
                status: true,
                package: {
                    select: { name: true, nightsPerYear: true, validityMonths: true },
                },
            },
        });
        const pkg = membership?.package ?? null;
        const nightsPerYear = pkg?.nightsPerYear ?? null;
        if (!membership || !pkg || !nightsPerYear) {
            return idle;
        }
        if (membership.status !== 'ACTIVE') {
            return idle;
        }
        const totalYears = Math.max(Math.ceil(pkg.validityMonths / 12), 1);
        const currentYear = (0, entitlement_types_js_1.membershipYearFor)(membership.startDate, totalYears, new Date());
        if (!currentYear) {
            return idle;
        }
        const already = await tx.entitlementLedger.findMany({
            where: {
                membershipId,
                bucket: entitlement_types_js_1.EntitlementBucket.PLAN,
                type: entitlement_types_js_1.LedgerType.ALLOCATION,
                yearIndex: { not: null },
            },
            select: { yearIndex: true },
        });
        const allocatedYears = new Set(already.map((r) => r.yearIndex));
        let allocatedNights = 0;
        for (let year = 1; year <= currentYear; year += 1) {
            if (allocatedYears.has(year))
                continue;
            await this.record(tx, {
                customerId: membership.customerId,
                membershipId,
                type: entitlement_types_js_1.LedgerType.ALLOCATION,
                bucket: entitlement_types_js_1.EntitlementBucket.PLAN,
                yearIndex: year,
                nights: nightsPerYear,
                description: 'Year ' + year + ' of ' + totalYears + ' — ' + nightsPerYear +
                    ' night(s) allocated',
                actorId: actorId ?? null,
                date: (0, entitlement_types_js_1.membershipYearStart)(membership.startDate, year),
            });
            allocatedNights += nightsPerYear;
        }
        let lapsedNights = 0;
        for (let year = 1; year < currentYear; year += 1) {
            const closed = await tx.entitlementLedger.count({
                where: {
                    membershipId,
                    bucket: entitlement_types_js_1.EntitlementBucket.PLAN,
                    type: entitlement_types_js_1.LedgerType.EXPIRY,
                    yearIndex: year,
                },
            });
            if (closed > 0)
                continue;
            const sum = await tx.entitlementLedger.aggregate({
                where: {
                    membershipId,
                    bucket: entitlement_types_js_1.EntitlementBucket.PLAN,
                    yearIndex: year,
                },
                _sum: { nights: true },
            });
            const left = sum._sum.nights ?? 0;
            if (left <= 0)
                continue;
            await this.record(tx, {
                customerId: membership.customerId,
                membershipId,
                type: entitlement_types_js_1.LedgerType.EXPIRY,
                bucket: entitlement_types_js_1.EntitlementBucket.PLAN,
                yearIndex: year,
                nights: -left,
                description: 'Year ' + year + ' ended — ' + left + ' unused night(s) lapsed',
                actorId: actorId ?? null,
                date: (0, entitlement_types_js_1.membershipYearStart)(membership.startDate, year + 1),
            });
            lapsedNights += left;
        }
        return { yearIndex: currentYear, allocatedNights, lapsedNights };
    }
    async creditComplimentaryNights(tx, params) {
        if (params.nights <= 0) {
            throw new common_1.BadRequestException('Complimentary nights must be a positive number');
        }
        return this.record(tx, {
            customerId: params.customerId,
            membershipId: params.membershipId,
            type: entitlement_types_js_1.LedgerType.ALLOCATION,
            bucket: entitlement_types_js_1.EntitlementBucket.COMPLIMENTARY,
            nights: params.nights,
            description: params.reason,
            actorId: params.actorId ?? null,
        });
    }
    async closeMembershipBalance(tx, params) {
        const balance = await this.balanceFor(tx, {
            customerId: params.customerId,
            membershipId: params.membershipId,
        });
        if (balance.nights === 0) {
            return null;
        }
        return this.record(tx, {
            customerId: params.customerId,
            membershipId: params.membershipId,
            type: entitlement_types_js_1.LedgerType.EXPIRY,
            nights: -balance.nights,
            description: `${params.reason} — closed ${balance.nights} night(s)`,
            actorId: params.actorId,
        });
    }
    async reopenMembershipBalance(tx, params) {
        const closures = await tx.entitlementLedger.aggregate({
            where: {
                customerId: params.customerId,
                membershipId: params.membershipId,
                type: entitlement_types_js_1.LedgerType.EXPIRY,
            },
            _sum: { nights: true },
        });
        const nights = -(closures._sum.nights ?? 0);
        if (nights === 0) {
            return null;
        }
        return this.record(tx, {
            customerId: params.customerId,
            membershipId: params.membershipId,
            type: entitlement_types_js_1.LedgerType.ADJUSTMENT,
            nights,
            description: 'Membership reactivated — restoring the balance closed on expiry',
            actorId: params.actorId,
        });
    }
    async getBalance(query, currentUser) {
        const customer = await this.prisma.customer.findFirst({
            where: { AND: [{ id: query.customerId }, (0, index_js_1.customerScopeFilter)(currentUser)] },
            select: { id: true, name: true },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        if (query.membershipId) {
            const membership = await this.prisma.membership.findFirst({
                where: { id: query.membershipId, customerId: customer.id },
                select: { id: true },
            });
            if (!membership) {
                throw new common_1.BadRequestException('That membership does not belong to this customer');
            }
        }
        const filter = {
            customerId: customer.id,
            ...(query.membershipId ? { membershipId: query.membershipId } : {}),
        };
        if (query.membershipId) {
            await this.prisma.$transaction((tx) => this.reconcileAnnualEntitlement(tx, query.membershipId, currentUser.sub));
        }
        else {
            const active = await this.prisma.membership.findMany({
                where: { customerId: customer.id, status: client_1.MembershipStatus.ACTIVE },
                select: { id: true },
            });
            for (const m of active) {
                await this.prisma.$transaction((tx) => this.reconcileAnnualEntitlement(tx, m.id, currentUser.sub));
            }
        }
        const [balance, byType] = await Promise.all([
            this.balanceFor(this.prisma, {
                customerId: customer.id,
                ...(query.membershipId ? { membershipId: query.membershipId } : {}),
            }),
            this.prisma.entitlementLedger.groupBy({
                by: ['type'],
                where: filter,
                _sum: { nights: true },
                _count: true,
            }),
        ]);
        const breakdown = byType.map((row) => ({
            type: row.type,
            entries: row._count,
            nights: row._sum.nights ?? 0,
        }));
        const allocated = breakdown
            .filter((b) => b.nights > 0)
            .reduce((acc, b) => acc + b.nights, 0);
        const consumed = breakdown
            .filter((b) => b.nights < 0)
            .reduce((acc, b) => acc + b.nights, 0);
        return {
            customerId: customer.id,
            customerName: customer.name,
            membershipId: query.membershipId ?? null,
            remaining: balance,
            credited: { nights: allocated },
            debited: { nights: -consumed },
            breakdown,
        };
    }
    async findAll(query, currentUser) {
        const { customerId, membershipId, bookingId, type, page = 1, limit = 50 } = query;
        const filters = [
            this.scopeFilter(currentUser),
        ];
        if (customerId)
            filters.push({ customerId });
        if (membershipId)
            filters.push({ membershipId });
        if (bookingId)
            filters.push({ bookingId });
        if (type)
            filters.push({ type });
        const where = { AND: filters };
        const [data, total, sum] = await Promise.all([
            this.prisma.entitlementLedger.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
                include: LEDGER_INCLUDE,
            }),
            this.prisma.entitlementLedger.count({ where }),
            this.prisma.entitlementLedger.aggregate({
                where,
                _sum: { nights: true },
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(Math.ceil(total / limit), 1),
                netNights: sum._sum.nights ?? 0,
            },
        };
    }
    async adjust(dto, currentUser) {
        if (dto.nights === 0) {
            throw new common_1.BadRequestException('An adjustment must change the night balance by a non-zero amount');
        }
        const customer = await this.prisma.customer.findFirst({
            where: { AND: [{ id: dto.customerId }, (0, index_js_1.customerScopeFilter)(currentUser)] },
            select: { id: true, name: true },
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
        return this.prisma.$transaction(async (tx) => {
            if (dto.membershipId) {
                await this.lockMembershipForUpdate(tx, dto.membershipId);
            }
            const before = await this.balanceFor(tx, {
                customerId: customer.id,
                ...(dto.membershipId ? { membershipId: dto.membershipId } : {}),
            });
            const nights = before.nights + dto.nights;
            const after = { nights, days: (0, entitlement_types_js_1.daysForNights)(nights) };
            if (after.nights < 0) {
                throw new common_1.BadRequestException(`Adjustment would leave a negative balance (${after.nights} nights). The current balance is ${before.nights} night(s).`);
            }
            const entry = await this.record(tx, {
                customerId: customer.id,
                membershipId: dto.membershipId ?? null,
                type: entitlement_types_js_1.LedgerType.ADJUSTMENT,
                nights: dto.nights,
                description: dto.reason,
                actorId: currentUser.sub,
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'ADJUSTMENT',
                entity: 'EntitlementLedger',
                entityId: entry.id,
                metadata: {
                    customerId: customer.id,
                    customerName: customer.name,
                    membershipId: dto.membershipId ?? null,
                    nights: dto.nights,
                    reason: dto.reason,
                    balance: { before, after },
                },
            });
            return { ...entry, balance: after };
        });
    }
};
exports.EntitlementsService = EntitlementsService;
exports.EntitlementsService = EntitlementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService])
], EntitlementsService);
//# sourceMappingURL=entitlements.service.js.map