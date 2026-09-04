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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_js_1 = require("../database/prisma.service.js");
const index_js_1 = require("../common/scope/index.js");
const entitlement_types_js_1 = require("../entitlements/entitlement.types.js");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    round(value) {
        return Math.round(value * 100) / 100;
    }
    asPositive(value) {
        const n = value ?? 0;
        return n === 0 ? 0 : -n;
    }
    startOfMonth() {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    ledgerScope(user) {
        const scope = (0, index_js_1.customerScopeFilter)(user);
        return Object.keys(scope).length === 0 ? {} : { customer: scope };
    }
    bookingScope(user) {
        const scope = (0, index_js_1.customerScopeFilter)(user);
        return Object.keys(scope).length === 0 ? {} : { customer: scope };
    }
    paymentScope(user) {
        const scope = (0, index_js_1.customerScopeFilter)(user);
        return Object.keys(scope).length === 0 ? {} : { customer: scope };
    }
    refundScope(user) {
        const scope = (0, index_js_1.customerScopeFilter)(user);
        return Object.keys(scope).length === 0 ? {} : { customer: scope };
    }
    performanceScope(user) {
        switch (user.role) {
            case client_1.Role.SUPER_ADMIN:
                return {};
            case client_1.Role.MANAGER:
                return { OR: [{ managerId: user.sub }, { id: user.sub }] };
            default:
                return { id: user.sub };
        }
    }
    async getDashboard(currentUser) {
        const customerScope = (0, index_js_1.customerScopeFilter)(currentUser);
        const monthStart = this.startOfMonth();
        const now = new Date();
        const in30Days = new Date(now);
        in30Days.setDate(in30Days.getDate() + 30);
        const countCustomers = (extra) => this.prisma.customer.count({
            where: { AND: extra ? [customerScope, extra] : [customerScope] },
        });
        const countMemberships = (extra) => this.prisma.membership.count({
            where: {
                AND: extra
                    ? [(0, index_js_1.membershipScopeFilter)(currentUser), extra]
                    : [(0, index_js_1.membershipScopeFilter)(currentUser)],
            },
        });
        const countBookings = (extra) => this.prisma.booking.count({
            where: {
                AND: extra
                    ? [this.bookingScope(currentUser), extra]
                    : [this.bookingScope(currentUser)],
            },
        });
        const [customersTotal, customersNew, customersActive, customersPending, customersCancelled, customerMoney, customersWithPending, collectedAll, collectedMonth, refundTotals, membershipsTotal, membershipsActive, membershipsExpiring, membershipsPastEnd, bookingsTotal, bookingsUpcoming, bookingsCompleted, bookingsCancelled, ledgerByType, team,] = await Promise.all([
            countCustomers(),
            countCustomers({ createdAt: { gte: monthStart } }),
            countCustomers({ status: 'ACTIVE' }),
            countCustomers({ status: 'PENDING' }),
            countCustomers({ status: 'CANCELLED' }),
            this.prisma.customer.aggregate({
                where: { AND: [customerScope] },
                _sum: { amount: true, amountPaid: true, pendingAmount: true },
            }),
            countCustomers({ pendingAmount: { gt: 0 } }),
            this.prisma.payment.aggregate({
                where: { AND: [this.paymentScope(currentUser)] },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.payment.aggregate({
                where: {
                    AND: [this.paymentScope(currentUser), { date: { gte: monthStart } }],
                },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.refund.aggregate({
                where: { AND: [this.refundScope(currentUser)] },
                _sum: { amount: true },
                _count: true,
            }),
            countMemberships(),
            countMemberships({ status: client_1.MembershipStatus.ACTIVE }),
            countMemberships({
                status: client_1.MembershipStatus.ACTIVE,
                endDate: { gte: now, lte: in30Days },
            }),
            countMemberships({
                status: client_1.MembershipStatus.ACTIVE,
                endDate: { lt: now },
            }),
            countBookings(),
            countBookings({
                status: client_1.BookingStatus.CONFIRMED,
                checkIn: { gte: now },
            }),
            countBookings({ status: client_1.BookingStatus.COMPLETED }),
            countBookings({ status: client_1.BookingStatus.CANCELLED }),
            this.prisma.entitlementLedger.groupBy({
                by: ['type'],
                where: { AND: [this.ledgerScope(currentUser)] },
                _sum: { nights: true },
            }),
            this.getTeamSummary(currentUser),
        ]);
        const byType = (type) => ledgerByType.find((r) => r.type === type)?._sum ?? { nights: 0 };
        const allocated = byType(entitlement_types_js_1.LedgerType.ALLOCATION);
        const usage = byType(entitlement_types_js_1.LedgerType.BOOKING_USAGE);
        const returned = byType(entitlement_types_js_1.LedgerType.CANCELLATION);
        const adjusted = byType(entitlement_types_js_1.LedgerType.ADJUSTMENT);
        const expired = byType(entitlement_types_js_1.LedgerType.EXPIRY);
        const nightsRemaining = ledgerByType.reduce((acc, row) => acc + (row._sum.nights ?? 0), 0);
        return {
            scope: currentUser.role === client_1.Role.SUPER_ADMIN
                ? 'global'
                : currentUser.role === client_1.Role.MANAGER
                    ? 'team'
                    : 'own',
            role: currentUser.role,
            generatedAt: new Date().toISOString(),
            customers: {
                total: customersTotal,
                newThisMonth: customersNew,
                active: customersActive,
                pending: customersPending,
                cancelled: customersCancelled,
            },
            sales: {
                planValue: this.round(customerMoney._sum.amount ?? 0),
                recordedPaid: this.round(customerMoney._sum.amountPaid ?? 0),
                pending: this.round(customerMoney._sum.pendingAmount ?? 0),
                customersWithPending,
                collectedFromPayments: this.round(collectedAll._sum.amount ?? 0),
                paymentCount: collectedAll._count,
                collectedThisMonth: this.round(collectedMonth._sum.amount ?? 0),
                paymentsThisMonth: collectedMonth._count,
            },
            refunds: {
                total: this.round(refundTotals._sum.amount ?? 0),
                count: refundTotals._count,
            },
            memberships: {
                total: membershipsTotal,
                active: membershipsActive,
                expiringIn30Days: membershipsExpiring,
                pastEndDate: membershipsPastEnd,
            },
            bookings: {
                total: bookingsTotal,
                upcoming: bookingsUpcoming,
                completed: bookingsCompleted,
                cancelled: bookingsCancelled,
            },
            usage: {
                nightsAllocated: allocated.nights ?? 0,
                nightsUsed: this.asPositive(usage.nights),
                nightsReturned: returned.nights ?? 0,
                nightsAdjusted: adjusted.nights ?? 0,
                nightsExpired: this.asPositive(expired.nights),
                nightsRemaining,
                daysRemaining: (0, entitlement_types_js_1.daysForNights)(nightsRemaining),
            },
            team,
            incentives: {
                available: false,
                reason: 'Incentive calculation arrives with Phase 7; the slabs are pending client confirmation.',
            },
        };
    }
    async getTeamSummary(currentUser) {
        if (currentUser.role === client_1.Role.EXECUTIVE) {
            return null;
        }
        const scope = currentUser.role === client_1.Role.SUPER_ADMIN
            ? {}
            : { managerId: currentUser.sub };
        const [executives, activeExecutives, managers, unassigned] = await Promise.all([
            this.prisma.user.count({
                where: { AND: [scope, { role: client_1.Role.EXECUTIVE }] },
            }),
            this.prisma.user.count({
                where: { AND: [scope, { role: client_1.Role.EXECUTIVE, isActive: true }] },
            }),
            currentUser.role === client_1.Role.SUPER_ADMIN
                ? this.prisma.user.count({ where: { role: client_1.Role.MANAGER } })
                : Promise.resolve(1),
            this.prisma.user.count({
                where: {
                    AND: [scope, { role: client_1.Role.EXECUTIVE, managerId: null }],
                },
            }),
        ]);
        return { executives, activeExecutives, managers, unassignedExecutives: unassigned };
    }
    async getExecutivePerformance(currentUser, query = {}) {
        const { search, sortBy = 'totalSales', sortDir = 'desc', page = 1, limit = 20, } = query;
        const filters = [
            this.performanceScope(currentUser),
            { role: client_1.Role.EXECUTIVE },
        ];
        if (search) {
            filters.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        const people = await this.prisma.user.findMany({
            where: { AND: filters },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                manager: { select: { id: true, name: true } },
            },
            orderBy: { name: 'asc' },
        });
        if (people.length === 0) {
            return {
                data: [],
                meta: {
                    executives: 0,
                    total: 0,
                    page,
                    limit,
                    totalPages: 1,
                    sortBy,
                    sortDir,
                    totals: {
                        customers: 0,
                        totalSales: 0,
                        collected: 0,
                        pending: 0,
                        daysUsed: 0,
                        nightsUsed: 0,
                    },
                },
            };
        }
        const ids = people.map((p) => p.id);
        const [customerRollup, bookingRollup] = await Promise.all([
            this.prisma.customer.groupBy({
                by: ['assignedExecId'],
                where: { assignedExecId: { in: ids } },
                _count: true,
                _sum: { amount: true, amountPaid: true, pendingAmount: true },
            }),
            this.prisma.booking.groupBy({
                by: ['customerId'],
                where: {
                    customer: { assignedExecId: { in: ids } },
                    status: { not: client_1.BookingStatus.CANCELLED },
                },
                _sum: { daysUsed: true, nightsUsed: true },
            }),
        ]);
        const customerOwners = await this.prisma.customer.findMany({
            where: { assignedExecId: { in: ids } },
            select: { id: true, assignedExecId: true },
        });
        const ownerOf = new Map(customerOwners.map((c) => [c.id, c.assignedExecId]));
        const usageByExec = new Map();
        for (const row of bookingRollup) {
            const execId = ownerOf.get(row.customerId);
            if (!execId)
                continue;
            const current = usageByExec.get(execId) ?? { days: 0, nights: 0 };
            usageByExec.set(execId, {
                days: current.days + (row._sum.daysUsed ?? 0),
                nights: current.nights + (row._sum.nightsUsed ?? 0),
            });
        }
        const data = people.map((person) => {
            const money = customerRollup.find((r) => r.assignedExecId === person.id);
            const usage = usageByExec.get(person.id) ?? { days: 0, nights: 0 };
            return {
                executive: {
                    id: person.id,
                    name: person.name,
                    email: person.email,
                    isActive: person.isActive,
                    manager: person.manager,
                },
                customers: money?._count ?? 0,
                totalSales: this.round(money?._sum.amount ?? 0),
                collected: this.round(money?._sum.amountPaid ?? 0),
                pending: this.round(money?._sum.pendingAmount ?? 0),
                daysUsed: usage.days,
                nightsUsed: usage.nights,
                incentive: null,
            };
        });
        const direction = sortDir === 'asc' ? 1 : -1;
        const sorted = [...data].sort((a, b) => {
            if (sortBy === 'name') {
                return a.executive.name.localeCompare(b.executive.name) * direction;
            }
            return (a[sortBy] - b[sortBy]) * direction;
        });
        const totals = data.reduce((acc, row) => ({
            customers: acc.customers + row.customers,
            totalSales: this.round(acc.totalSales + row.totalSales),
            collected: this.round(acc.collected + row.collected),
            pending: this.round(acc.pending + row.pending),
            daysUsed: acc.daysUsed + row.daysUsed,
            nightsUsed: acc.nightsUsed + row.nightsUsed,
        }), {
            customers: 0,
            totalSales: 0,
            collected: 0,
            pending: 0,
            daysUsed: 0,
            nightsUsed: 0,
        });
        const start = (page - 1) * limit;
        return {
            data: sorted.slice(start, start + limit),
            meta: {
                executives: data.length,
                total: data.length,
                page,
                limit,
                totalPages: Math.max(Math.ceil(data.length / limit), 1),
                sortBy,
                sortDir,
                totals,
            },
        };
    }
    async getPendingPayments(query, currentUser) {
        const { assignedExecId, page = 1, limit = 50 } = query;
        const filters = [
            (0, index_js_1.customerScopeFilter)(currentUser),
            { pendingAmount: { gt: 0 } },
        ];
        if (assignedExecId)
            filters.push({ assignedExecId });
        const where = { AND: filters };
        const [data, total, totals] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { pendingAmount: 'desc' },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    plan: true,
                    amount: true,
                    amountPaid: true,
                    pendingAmount: true,
                    status: true,
                    assignedExec: {
                        select: { id: true, name: true, manager: { select: { name: true } } },
                    },
                },
            }),
            this.prisma.customer.count({ where }),
            this.prisma.customer.aggregate({
                where,
                _sum: { pendingAmount: true, amount: true, amountPaid: true },
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(Math.ceil(total / limit), 1),
                pendingTotal: this.round(totals._sum.pendingAmount ?? 0),
                planValueTotal: this.round(totals._sum.amount ?? 0),
                collectedTotal: this.round(totals._sum.amountPaid ?? 0),
            },
        };
    }
    async getCustomerUsage(query, currentUser) {
        const { assignedExecId, page = 1, limit = 50 } = query;
        const filters = [
            (0, index_js_1.customerScopeFilter)(currentUser),
        ];
        if (assignedExecId)
            filters.push({ assignedExecId });
        const where = { AND: filters };
        const [customers, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    plan: true,
                    totalDays: true,
                    totalNights: true,
                    assignedExec: { select: { id: true, name: true } },
                },
            }),
            this.prisma.customer.count({ where }),
        ]);
        if (customers.length === 0) {
            return {
                data: [],
                meta: { total, page, limit, totalPages: 1 },
            };
        }
        const ids = customers.map((c) => c.id);
        const [balances, used] = await Promise.all([
            this.prisma.entitlementLedger.groupBy({
                by: ['customerId'],
                where: { customerId: { in: ids } },
                _sum: { days: true, nights: true },
            }),
            this.prisma.entitlementLedger.groupBy({
                by: ['customerId'],
                where: { customerId: { in: ids }, type: entitlement_types_js_1.LedgerType.BOOKING_USAGE },
                _sum: { days: true, nights: true },
            }),
        ]);
        const balanceOf = new Map(balances.map((b) => [b.customerId, b._sum]));
        const usedOf = new Map(used.map((b) => [b.customerId, b._sum]));
        return {
            data: customers.map((c) => {
                const bal = balanceOf.get(c.id);
                const use = usedOf.get(c.id);
                return {
                    customer: {
                        id: c.id,
                        name: c.name,
                        phone: c.phone,
                        plan: c.plan,
                        assignedExec: c.assignedExec,
                    },
                    daysRemaining: bal?.days ?? 0,
                    nightsRemaining: bal?.nights ?? 0,
                    daysUsed: this.asPositive(use?.days),
                    nightsUsed: this.asPositive(use?.nights),
                };
            }),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(Math.ceil(total / limit), 1),
            },
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map