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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const entitlements_service_js_1 = require("../entitlements/entitlements.service.js");
const entitlement_types_js_1 = require("../entitlements/entitlement.types.js");
const index_js_1 = require("../common/scope/index.js");
const BOOKING_INCLUDE = {
    customer: { select: { id: true, name: true, phone: true } },
    membership: {
        select: {
            id: true,
            status: true,
            startDate: true,
            endDate: true,
            package: { select: { id: true, name: true } },
        },
    },
    entitlementLog: {
        select: { id: true, type: true, days: true, nights: true, date: true },
        orderBy: { createdAt: 'asc' },
    },
};
const MS_PER_DAY = 24 * 60 * 60 * 1000;
let BookingsService = class BookingsService {
    prisma;
    audit;
    entitlements;
    constructor(prisma, audit, entitlements) {
        this.prisma = prisma;
        this.audit = audit;
        this.entitlements = entitlements;
    }
    scopeFilter(user) {
        const customerScope = (0, index_js_1.customerScopeFilter)(user);
        return Object.keys(customerScope).length === 0
            ? {}
            : { customer: customerScope };
    }
    dateText(value) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    startOfDay(value) {
        const d = new Date(value);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    derivedUsage(checkIn, checkOut) {
        const nights = Math.round((this.startOfDay(checkOut).getTime() - this.startOfDay(checkIn).getTime()) /
            MS_PER_DAY);
        return { nights, days: (0, entitlement_types_js_1.daysForNights)(nights) };
    }
    async create(dto, currentUser) {
        if (dto.idempotencyKey) {
            const existing = await this.prisma.booking.findUnique({
                where: { idempotencyKey: dto.idempotencyKey },
                include: BOOKING_INCLUDE,
            });
            if (existing) {
                return existing;
            }
        }
        const checkIn = this.startOfDay(dto.checkIn);
        const checkOut = this.startOfDay(dto.checkOut);
        if (checkOut <= checkIn) {
            throw new common_1.BadRequestException('Check-out must be after check-in');
        }
        const derived = this.derivedUsage(checkIn, checkOut);
        const nightsUsed = dto.nightsUsed ?? derived.nights;
        const daysUsed = (0, entitlement_types_js_1.daysForNights)(nightsUsed);
        if (nightsUsed === 0) {
            throw new common_1.BadRequestException('A booking must consume at least one night');
        }
        const customer = await this.prisma.customer.findFirst({
            where: { AND: [{ id: dto.customerId }, (0, index_js_1.customerScopeFilter)(currentUser)] },
            select: { id: true, name: true },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const membership = await this.prisma.membership.findFirst({
            where: { id: dto.membershipId, customerId: customer.id },
            include: { package: { select: { name: true } } },
        });
        if (!membership) {
            throw new common_1.BadRequestException('That membership does not belong to this customer');
        }
        if (membership.status !== client_1.MembershipStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Cannot book against a ${membership.status.toLowerCase()} membership`);
        }
        if (membership.endDate && checkOut > membership.endDate) {
            throw new common_1.BadRequestException(`The stay ends after the membership expires on ${this.dateText(membership.endDate)}`);
        }
        if (checkIn < this.startOfDay(membership.startDate)) {
            throw new common_1.BadRequestException('The stay starts before the membership begins');
        }
        return this.prisma.$transaction(async (tx) => {
            await this.entitlements.lockMembershipForUpdate(tx, membership.id);
            await this.entitlements.reconcileAnnualEntitlement(tx, membership.id, currentUser.sub);
            const balance = await this.entitlements.balanceFor(tx, {
                customerId: customer.id,
                membershipId: membership.id,
            });
            const clash = await tx.booking.findFirst({
                where: {
                    customerId: customer.id,
                    status: { not: client_1.BookingStatus.CANCELLED },
                    checkIn: { lt: checkOut },
                    checkOut: { gt: checkIn },
                },
                orderBy: { checkIn: 'asc' },
                select: { id: true, checkIn: true, checkOut: true, status: true },
            });
            if (clash) {
                throw new common_1.ConflictException(`${customer.name} already has a ${clash.status.toLowerCase()} stay from ` +
                    `${this.dateText(clash.checkIn)} to ${this.dateText(clash.checkOut)}, ` +
                    `which overlaps these dates. Cancel it first, or pick dates outside it.`);
            }
            if (nightsUsed > balance.nights) {
                throw new common_1.ConflictException(`Not enough entitlement left: this stay needs ${nightsUsed} night(s), but only ${balance.nights} night(s) remain.`);
            }
            const booking = await tx.booking.create({
                data: {
                    customerId: customer.id,
                    membershipId: membership.id,
                    checkIn,
                    checkOut,
                    daysUsed,
                    nightsUsed,
                    status: client_1.BookingStatus.CONFIRMED,
                    notes: dto.notes ?? null,
                    idempotencyKey: dto.idempotencyKey ?? null,
                },
            });
            await this.entitlements.record(tx, {
                customerId: customer.id,
                membershipId: membership.id,
                bookingId: booking.id,
                type: entitlement_types_js_1.LedgerType.BOOKING_USAGE,
                nights: -nightsUsed,
                description: `Booking ${this.dateText(checkIn)} to ${this.dateText(checkOut)}`,
                actorId: currentUser.sub,
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'CREATE',
                entity: 'Booking',
                entityId: booking.id,
                metadata: {
                    customerId: customer.id,
                    customerName: customer.name,
                    membershipId: membership.id,
                    packageName: membership.package?.name ?? null,
                    checkIn: checkIn.toISOString(),
                    checkOut: checkOut.toISOString(),
                    daysUsed,
                    nightsUsed,
                    balance: {
                        before: balance,
                        after: {
                            nights: balance.nights - nightsUsed,
                            days: (0, entitlement_types_js_1.daysForNights)(balance.nights - nightsUsed),
                        },
                    },
                },
            });
            return tx.booking.findUnique({
                where: { id: booking.id },
                include: BOOKING_INCLUDE,
            });
        });
    }
    async findAll(query, currentUser) {
        const { customerId, membershipId, status, from, to, page = 1, limit = 20, } = query;
        const filters = [this.scopeFilter(currentUser)];
        if (customerId)
            filters.push({ customerId });
        if (membershipId)
            filters.push({ membershipId });
        if (status)
            filters.push({ status: status });
        if (from)
            filters.push({ checkIn: { gte: this.startOfDay(from) } });
        if (to)
            filters.push({ checkIn: { lte: this.startOfDay(to) } });
        const where = { AND: filters };
        const [data, total, used] = await Promise.all([
            this.prisma.booking.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { checkIn: 'desc' },
                include: BOOKING_INCLUDE,
            }),
            this.prisma.booking.count({ where }),
            this.prisma.booking.aggregate({
                where: { AND: [...filters, { status: client_1.BookingStatus.CANCELLED }] },
                _count: true,
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(Math.ceil(total / limit), 1),
                cancelledCount: used._count,
            },
        };
    }
    async findOne(id, currentUser) {
        const booking = await this.prisma.booking.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
            include: BOOKING_INCLUDE,
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async update(id, dto, currentUser) {
        const booking = await this.prisma.booking.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.booking.update({
                where: { id },
                data: { notes: dto.notes ?? null },
                include: BOOKING_INCLUDE,
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'UPDATE',
                entity: 'Booking',
                entityId: id,
                metadata: {
                    before: { notes: booking.notes },
                    after: { notes: updated.notes },
                },
            });
            return updated;
        });
    }
    async cancel(id, currentUser) {
        const booking = await this.prisma.booking.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
            include: { customer: { select: { id: true, name: true } } },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status === client_1.BookingStatus.CANCELLED) {
            throw new common_1.ConflictException('This booking is already cancelled');
        }
        if (booking.status === client_1.BookingStatus.COMPLETED) {
            throw new common_1.ConflictException('A completed stay cannot be cancelled — the days were used. A Super Admin can post an adjustment if a correction is needed.');
        }
        return this.prisma.$transaction(async (tx) => {
            if (booking.membershipId) {
                await this.entitlements.lockMembershipForUpdate(tx, booking.membershipId);
            }
            const moved = await tx.entitlementLedger.aggregate({
                where: { bookingId: id },
                _sum: { nights: true },
            });
            const restoreNights = -(moved._sum.nights ?? 0);
            const updated = await tx.booking.update({
                where: { id },
                data: { status: client_1.BookingStatus.CANCELLED },
                include: BOOKING_INCLUDE,
            });
            if (restoreNights !== 0) {
                await this.entitlements.record(tx, {
                    customerId: booking.customerId,
                    membershipId: booking.membershipId,
                    bookingId: id,
                    type: entitlement_types_js_1.LedgerType.CANCELLATION,
                    nights: restoreNights,
                    description: `Booking cancelled — restored ${restoreNights} night(s)`,
                    actorId: currentUser.sub,
                });
            }
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'CANCEL',
                entity: 'Booking',
                entityId: id,
                metadata: {
                    customerId: booking.customerId,
                    customerName: booking.customer.name,
                    membershipId: booking.membershipId,
                    restored: { nights: restoreNights },
                    previousStatus: booking.status,
                },
            });
            return updated;
        });
    }
    async complete(id, currentUser) {
        const booking = await this.prisma.booking.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status === client_1.BookingStatus.CANCELLED) {
            throw new common_1.ConflictException('A cancelled booking cannot be completed — its entitlement was returned');
        }
        if (booking.status === client_1.BookingStatus.COMPLETED) {
            throw new common_1.ConflictException('This booking is already completed');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.booking.update({
                where: { id },
                data: { status: client_1.BookingStatus.COMPLETED },
                include: BOOKING_INCLUDE,
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'COMPLETE',
                entity: 'Booking',
                entityId: id,
                metadata: { previousStatus: booking.status, ledgerUnchanged: true },
            });
            return updated;
        });
    }
    async getStats(currentUser) {
        const scope = this.scopeFilter(currentUser);
        const now = this.startOfDay(new Date());
        const countBy = (extra) => this.prisma.booking.count({
            where: { AND: extra ? [scope, extra] : [scope] },
        });
        const [total, confirmed, completed, cancelled, upcoming, consumed] = await Promise.all([
            countBy(),
            countBy({ status: client_1.BookingStatus.CONFIRMED }),
            countBy({ status: client_1.BookingStatus.COMPLETED }),
            countBy({ status: client_1.BookingStatus.CANCELLED }),
            countBy({
                status: client_1.BookingStatus.CONFIRMED,
                checkIn: { gte: now },
            }),
            this.prisma.booking.aggregate({
                where: {
                    AND: [scope, { status: { not: client_1.BookingStatus.CANCELLED } }],
                },
                _sum: { daysUsed: true, nightsUsed: true },
            }),
        ]);
        return {
            total,
            confirmed,
            completed,
            cancelled,
            upcoming,
            daysUsed: consumed._sum.daysUsed ?? 0,
            nightsUsed: consumed._sum.nightsUsed ?? 0,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService,
        entitlements_service_js_1.EntitlementsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map