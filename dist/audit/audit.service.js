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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../database/prisma.service.js");
let AuditService = AuditService_1 = class AuditService {
    prisma;
    logger = new common_1.Logger(AuditService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    toData(entry) {
        return {
            actorId: entry.actorId ?? null,
            action: entry.action,
            entity: entry.entity,
            entityId: entry.entityId ?? null,
            metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        };
    }
    async withinTransaction(tx, entry) {
        await tx.auditLog.create({ data: this.toData(entry) });
    }
    async log(entry) {
        try {
            await this.prisma.auditLog.create({ data: this.toData(entry) });
        }
        catch (error) {
            this.logger.error(`Audit write failed: ${entry.action} on ${entry.entity} ${entry.entityId ?? ''}`, error instanceof Error ? error.stack : undefined);
        }
    }
    async findAll(query) {
        const { actorId, entity, entityId, action, from, to, page = 1, limit = 50, } = query;
        const filters = [];
        if (actorId)
            filters.push({ actorId });
        if (entity)
            filters.push({ entity });
        if (entityId)
            filters.push({ entityId });
        if (action)
            filters.push({ action });
        if (from)
            filters.push({ timestamp: { gte: from } });
        if (to)
            filters.push({ timestamp: { lte: to } });
        const where = filters.length > 0 ? { AND: filters } : {};
        const [data, total, byAction] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { timestamp: 'desc' },
                include: {
                    actor: { select: { id: true, name: true, email: true, role: true } },
                },
            }),
            this.prisma.auditLog.count({ where }),
            this.prisma.auditLog.groupBy({
                by: ['action'],
                where,
                _count: true,
            }),
        ]);
        return {
            data: data.map((row) => ({
                ...row,
                metadata: row.metadata ? this.safeParse(row.metadata) : null,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.max(Math.ceil(total / limit), 1),
                actionCounts: byAction
                    .map((a) => ({ action: a.action, count: a._count }))
                    .sort((a, b) => b.count - a.count),
            },
        };
    }
    safeParse(value) {
        try {
            return JSON.parse(value);
        }
        catch {
            return { unparsed: value };
        }
    }
    async getFilterOptions() {
        const [entities, actions] = await Promise.all([
            this.prisma.auditLog.findMany({
                distinct: ['entity'],
                select: { entity: true },
                orderBy: { entity: 'asc' },
            }),
            this.prisma.auditLog.findMany({
                distinct: ['action'],
                select: { action: true },
                orderBy: { action: 'asc' },
            }),
        ]);
        return {
            entities: entities.map((e) => e.entity),
            actions: actions.map((a) => a.action),
        };
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map