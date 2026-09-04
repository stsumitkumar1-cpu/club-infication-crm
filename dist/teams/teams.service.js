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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const EXECUTIVE_SELECT = {
    id: true,
    name: true,
    email: true,
    isActive: true,
    createdAt: true,
    _count: { select: { customers: true } },
};
const MANAGER_SELECT = {
    id: true,
    name: true,
    email: true,
    isActive: true,
    executives: {
        select: EXECUTIVE_SELECT,
        orderBy: { name: 'asc' },
    },
    _count: { select: { executives: true } },
};
let TeamsService = class TeamsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    assertCanActOnTeam(managerId, currentUser) {
        if (currentUser.role === client_1.Role.SUPER_ADMIN) {
            return;
        }
        if (currentUser.role === client_1.Role.MANAGER && managerId === currentUser.sub) {
            return;
        }
        throw new common_1.ForbiddenException('You can only access your own team');
    }
    async findAll(currentUser) {
        const where = currentUser.role === client_1.Role.SUPER_ADMIN
            ? { role: client_1.Role.MANAGER }
            : { role: client_1.Role.MANAGER, id: currentUser.sub };
        const managers = await this.prisma.user.findMany({
            where,
            select: MANAGER_SELECT,
            orderBy: { name: 'asc' },
        });
        return {
            data: managers,
            meta: { totalTeams: managers.length },
        };
    }
    async findOne(managerId, currentUser) {
        this.assertCanActOnTeam(managerId, currentUser);
        const manager = await this.prisma.user.findFirst({
            where: { id: managerId, role: client_1.Role.MANAGER },
            select: MANAGER_SELECT,
        });
        if (!manager) {
            throw new common_1.NotFoundException(`Manager with ID ${managerId} not found`);
        }
        return manager;
    }
    async findUnassignedExecutives() {
        return this.prisma.user.findMany({
            where: { role: client_1.Role.EXECUTIVE, managerId: null },
            select: EXECUTIVE_SELECT,
            orderBy: { name: 'asc' },
        });
    }
    async assignExecutive(dto, currentUser) {
        const targetManagerId = this.resolveTargetManager(dto, currentUser);
        this.assertCanActOnTeam(targetManagerId, currentUser);
        const [manager, executive] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: targetManagerId },
                select: { id: true, name: true, role: true, isActive: true },
            }),
            this.prisma.user.findUnique({
                where: { id: dto.executiveId },
                select: {
                    id: true,
                    name: true,
                    role: true,
                    isActive: true,
                    managerId: true,
                },
            }),
        ]);
        if (!manager || manager.role !== client_1.Role.MANAGER) {
            throw new common_1.NotFoundException(`Manager with ID ${targetManagerId} not found`);
        }
        if (!manager.isActive) {
            throw new common_1.BadRequestException('Cannot assign to a deactivated manager');
        }
        if (!executive) {
            throw new common_1.NotFoundException(`Executive with ID ${dto.executiveId} not found`);
        }
        if (executive.role !== client_1.Role.EXECUTIVE) {
            throw new common_1.BadRequestException('Only a user with the EXECUTIVE role can be assigned to a team');
        }
        if (executive.managerId === targetManagerId) {
            throw new common_1.BadRequestException('This executive is already assigned to that manager');
        }
        if (currentUser.role === client_1.Role.MANAGER &&
            executive.managerId !== null &&
            executive.managerId !== currentUser.sub) {
            throw new common_1.ForbiddenException('This executive belongs to another manager. Only a Super Admin can reassign them.');
        }
        const previousManagerId = executive.managerId;
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.user.update({
                where: { id: executive.id },
                data: { manager: { connect: { id: targetManagerId } } },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    managerId: true,
                    manager: { select: { id: true, name: true, email: true } },
                },
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: previousManagerId ? 'TEAM_REASSIGN' : 'TEAM_ASSIGN',
                entity: 'User',
                entityId: executive.id,
                metadata: {
                    executiveName: executive.name,
                    previousManagerId,
                    newManagerId: targetManagerId,
                },
            });
            return updated;
        });
    }
    async unassignExecutive(executiveId, currentUser) {
        const executive = await this.prisma.user.findUnique({
            where: { id: executiveId },
            select: { id: true, name: true, role: true, managerId: true },
        });
        if (!executive) {
            throw new common_1.NotFoundException(`Executive with ID ${executiveId} not found`);
        }
        if (executive.role !== client_1.Role.EXECUTIVE) {
            throw new common_1.BadRequestException('Only an EXECUTIVE can be unassigned');
        }
        if (!executive.managerId) {
            throw new common_1.BadRequestException('This executive is not assigned to any manager');
        }
        this.assertCanActOnTeam(executive.managerId, currentUser);
        const previousManagerId = executive.managerId;
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.user.update({
                where: { id: executiveId },
                data: { manager: { disconnect: true } },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    managerId: true,
                },
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'TEAM_UNASSIGN',
                entity: 'User',
                entityId: executiveId,
                metadata: {
                    executiveName: executive.name,
                    previousManagerId,
                },
            });
            return updated;
        });
    }
    resolveTargetManager(dto, currentUser) {
        if (currentUser.role === client_1.Role.SUPER_ADMIN) {
            if (!dto.managerId) {
                throw new common_1.BadRequestException('managerId is required when assigning as a Super Admin');
            }
            return dto.managerId;
        }
        if (dto.managerId && dto.managerId !== currentUser.sub) {
            throw new common_1.ForbiddenException('You can only assign executives to your own team');
        }
        return currentUser.sub;
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map