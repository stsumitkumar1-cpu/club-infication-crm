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
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
let PackagesService = class PackagesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async assertNameFree(name, exceptId) {
        const existing = await this.prisma.package.findUnique({
            where: { name },
            select: { id: true },
        });
        if (existing && existing.id !== exceptId) {
            throw new common_1.ConflictException(`A plan named "${name}" already exists`);
        }
    }
    async create(dto, currentUser) {
        await this.assertNameFree(dto.name);
        return this.prisma.$transaction(async (tx) => {
            const pkg = await tx.package.create({
                data: {
                    name: dto.name,
                    price: dto.price,
                    days: dto.days,
                    nights: dto.nights,
                    nightsPerYear: dto.nightsPerYear ?? null,
                    validityMonths: dto.validityMonths,
                    isActive: dto.isActive ?? true,
                },
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'CREATE',
                entity: 'Package',
                entityId: pkg.id,
                metadata: {
                    name: pkg.name,
                    price: pkg.price,
                    days: pkg.days,
                    nights: pkg.nights,
                    validityMonths: pkg.validityMonths,
                    isActive: pkg.isActive,
                },
            });
            return pkg;
        });
    }
    async findAll(query) {
        const { search, isActive, page = 1, limit = 50 } = query;
        const filters = [];
        if (isActive !== undefined) {
            filters.push({ isActive });
        }
        if (search) {
            filters.push({ name: { contains: search } });
        }
        const where = filters.length > 0 ? { AND: filters } : {};
        const [data, total] = await Promise.all([
            this.prisma.package.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{ isActive: 'desc' }, { price: 'asc' }],
                include: { _count: { select: { memberships: true } } },
            }),
            this.prisma.package.count({ where }),
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
    async findOne(id) {
        const pkg = await this.prisma.package.findUnique({
            where: { id },
            include: { _count: { select: { memberships: true } } },
        });
        if (!pkg) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return pkg;
    }
    async update(id, dto, currentUser) {
        const pkg = await this.prisma.package.findUnique({ where: { id } });
        if (!pkg) {
            throw new common_1.NotFoundException('Plan not found');
        }
        if (dto.name && dto.name !== pkg.name) {
            await this.assertNameFree(dto.name, id);
        }
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.price !== undefined)
            data.price = dto.price;
        if (dto.days !== undefined)
            data.days = dto.days;
        if (dto.nights !== undefined)
            data.nights = dto.nights;
        if (dto.nightsPerYear !== undefined) {
            data.nightsPerYear = dto.nightsPerYear;
        }
        if (dto.validityMonths !== undefined) {
            data.validityMonths = dto.validityMonths;
        }
        if (dto.isActive !== undefined)
            data.isActive = dto.isActive;
        const action = dto.isActive === false && pkg.isActive
            ? 'DEACTIVATE'
            : dto.isActive === true && !pkg.isActive
                ? 'ACTIVATE'
                : 'UPDATE';
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.package.update({ where: { id }, data });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action,
                entity: 'Package',
                entityId: id,
                metadata: {
                    before: {
                        name: pkg.name,
                        price: pkg.price,
                        days: pkg.days,
                        nights: pkg.nights,
                        validityMonths: pkg.validityMonths,
                        isActive: pkg.isActive,
                    },
                    after: {
                        name: updated.name,
                        price: updated.price,
                        days: updated.days,
                        nights: updated.nights,
                        validityMonths: updated.validityMonths,
                        isActive: updated.isActive,
                    },
                },
            });
            return updated;
        });
    }
    async setActive(id, isActive, currentUser) {
        return this.update(id, { isActive }, currentUser);
    }
    async remove(id, currentUser) {
        const pkg = await this.prisma.package.findUnique({
            where: { id },
            include: { _count: { select: { memberships: true } } },
        });
        if (!pkg) {
            throw new common_1.NotFoundException('Plan not found');
        }
        if (pkg._count.memberships > 0) {
            throw new common_1.ConflictException(`Cannot delete "${pkg.name}": ${pkg._count.memberships} membership(s) reference it. Deactivate it instead so it stops appearing in new sales.`);
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.package.delete({ where: { id } });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'DELETE',
                entity: 'Package',
                entityId: id,
                metadata: {
                    name: pkg.name,
                    price: pkg.price,
                    days: pkg.days,
                    nights: pkg.nights,
                    validityMonths: pkg.validityMonths,
                },
            });
        });
        return { message: 'Plan deleted successfully' };
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService])
], PackagesService);
//# sourceMappingURL=packages.service.js.map