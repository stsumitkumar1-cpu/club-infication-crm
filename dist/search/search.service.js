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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_js_1 = require("../database/prisma.service.js");
const index_js_1 = require("../common/scope/index.js");
const MIN_TERM_LENGTH = 2;
const DEFAULT_LIMIT = 5;
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchAll(query, currentUser) {
        const term = query.q.trim();
        const limit = query.limit ?? DEFAULT_LIMIT;
        if (term.length < MIN_TERM_LENGTH) {
            return { query: term, total: 0, groups: [] };
        }
        const [customers, users, plans] = await Promise.all([
            this.searchCustomers(term, limit, currentUser),
            this.searchUsers(term, limit, currentUser),
            this.searchPlans(term, limit),
        ]);
        const groups = [customers, users, plans].filter((g) => g.items.length > 0);
        return {
            query: term,
            total: groups.reduce((sum, g) => sum + g.total, 0),
            groups,
        };
    }
    async searchCustomers(term, limit, currentUser) {
        const contains = { contains: term };
        const where = {
            AND: [
                (0, index_js_1.customerScopeFilter)(currentUser),
                {
                    OR: [
                        { name: contains },
                        { phone: contains },
                        { email: contains },
                        { membershipId: contains },
                        { plan: contains },
                    ],
                },
            ],
        };
        const [rows, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    plan: true,
                    status: true,
                    membershipId: true,
                },
            }),
            this.prisma.customer.count({ where }),
        ]);
        return {
            type: 'customer',
            label: 'Customers',
            total,
            items: rows.map((c) => ({
                id: c.id,
                title: c.name,
                subtitle: [c.phone, c.plan, c.membershipId].filter(Boolean).join(' · '),
                badge: c.status,
            })),
        };
    }
    async searchUsers(term, limit, currentUser) {
        const contains = { contains: term };
        const where = {
            AND: [
                (0, index_js_1.assignableUserFilter)(currentUser),
                { OR: [{ name: contains }, { email: contains }] },
            ],
        };
        const [rows, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                take: limit,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            type: 'user',
            label: currentUser.role === client_1.Role.EXECUTIVE ? 'You' : 'People',
            total,
            items: rows.map((u) => ({
                id: u.id,
                title: u.name,
                subtitle: u.email,
                badge: u.isActive ? u.role : `${u.role} · inactive`,
            })),
        };
    }
    async searchPlans(term, limit) {
        const where = {
            name: { contains: term },
        };
        const [rows, total] = await Promise.all([
            this.prisma.package.findMany({
                where,
                take: limit,
                orderBy: { price: 'asc' },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    nights: true,
                    isActive: true,
                },
            }),
            this.prisma.package.count({ where }),
        ]);
        return {
            type: 'plan',
            label: 'Plans',
            total,
            items: rows.map((p) => ({
                id: p.id,
                title: p.name,
                subtitle: `₹${p.price.toLocaleString('en-IN')} · ${p.nights} nights`,
                badge: p.isActive ? null : 'inactive',
            })),
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map