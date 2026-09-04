"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const USER_SELECT = {
    id: true,
    email: true,
    name: true,
    role: true,
    isActive: true,
    managerId: true,
    createdAt: true,
    updatedAt: true,
};
const BCRYPT_ROUNDS = 10;
let UsersService = class UsersService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    scopeFilter(currentUser) {
        switch (currentUser.role) {
            case client_1.Role.SUPER_ADMIN:
                return {};
            case client_1.Role.MANAGER:
                return {
                    OR: [{ id: currentUser.sub }, { managerId: currentUser.sub }],
                };
            default:
                return { id: currentUser.sub };
        }
    }
    async assertValidManagerId(managerId, subjectId) {
        if (subjectId && managerId === subjectId) {
            throw new common_1.BadRequestException('A user cannot be their own manager');
        }
        const manager = await this.prisma.user.findUnique({
            where: { id: managerId },
            select: { id: true, role: true, isActive: true },
        });
        if (!manager) {
            throw new common_1.NotFoundException(`Manager with ID ${managerId} not found`);
        }
        if (manager.role !== client_1.Role.MANAGER) {
            throw new common_1.BadRequestException('Assigned manager must have the MANAGER role');
        }
        if (!manager.isActive) {
            throw new common_1.BadRequestException('Cannot assign to a deactivated manager');
        }
    }
    async assertNotLastActiveSuperAdmin(target) {
        if (target.role !== client_1.Role.SUPER_ADMIN || !target.isActive) {
            return;
        }
        const activeSuperAdmins = await this.prisma.user.count({
            where: { role: client_1.Role.SUPER_ADMIN, isActive: true },
        });
        if (activeSuperAdmins <= 1) {
            throw new common_1.ForbiddenException('Cannot deactivate or demote the last active Super Admin');
        }
    }
    async create(dto, currentUser) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
        }
        const isManagerCreating = currentUser.role === client_1.Role.MANAGER;
        if (isManagerCreating && dto.role !== client_1.Role.EXECUTIVE) {
            throw new common_1.ForbiddenException('A Manager can only create users with the EXECUTIVE role');
        }
        const managerId = isManagerCreating ? currentUser.sub : dto.managerId;
        if (managerId) {
            if (dto.role !== client_1.Role.EXECUTIVE) {
                throw new common_1.BadRequestException('Only an EXECUTIVE can be assigned to a manager');
            }
            if (!isManagerCreating) {
                await this.assertValidManagerId(managerId);
            }
        }
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    role: dto.role,
                    managerId: dto.role === client_1.Role.EXECUTIVE ? (managerId ?? null) : null,
                    passwordHash,
                },
                select: USER_SELECT,
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'CREATE',
                entity: 'User',
                entityId: user.id,
                metadata: {
                    email: user.email,
                    role: user.role,
                    managerId: user.managerId,
                },
            });
            return user;
        });
    }
    async findAll(currentUser, query = {}) {
        const { search, role, isActive, page = 1, limit = 20 } = query;
        const filters = [this.scopeFilter(currentUser)];
        if (role) {
            filters.push({ role });
        }
        if (isActive !== undefined) {
            filters.push({ isActive });
        }
        if (search) {
            filters.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        const where = { AND: filters };
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: {
                    ...USER_SELECT,
                    manager: { select: { id: true, name: true, email: true } },
                    _count: { select: { executives: true, customers: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
            }),
            this.prisma.user.count({ where }),
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
        const user = await this.prisma.user.findFirst({
            where: { AND: [{ id }, this.scopeFilter(currentUser)] },
            select: {
                ...USER_SELECT,
                manager: { select: { id: true, name: true, email: true } },
                executives: {
                    select: { id: true, name: true, email: true, isActive: true },
                    orderBy: { name: 'asc' },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async setPassword(id, dto, currentUser) {
        const target = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, role: true, managerId: true },
        });
        if (!target) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (currentUser.role === client_1.Role.MANAGER) {
            const ownExecutive = target.role === client_1.Role.EXECUTIVE && target.managerId === currentUser.sub;
            if (!ownExecutive) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
        }
        else if (target.id === currentUser.sub) {
            throw new common_1.BadRequestException('Use the Profile page to change your own password — it asks for your current one.');
        }
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id },
                data: {
                    passwordHash,
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'PASSWORD_SET',
                entity: 'User',
                entityId: id,
                metadata: {
                    email: target.email,
                    targetRole: target.role,
                    byRole: currentUser.role,
                },
            });
        });
        return { message: `Password updated for ${target.name}` };
    }
    async update(id, dto, currentUser) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const isSelf = id === currentUser.sub;
        const nextRole = dto.role ?? user.role;
        const roleIsChanging = dto.role !== undefined && dto.role !== user.role;
        const isBeingDeactivated = dto.isActive === false && user.isActive;
        if (isSelf && roleIsChanging) {
            throw new common_1.ForbiddenException('You cannot change your own role');
        }
        if (isSelf && isBeingDeactivated) {
            throw new common_1.ForbiddenException('You cannot deactivate your own account');
        }
        if (isBeingDeactivated ||
            (roleIsChanging && user.role === client_1.Role.SUPER_ADMIN)) {
            await this.assertNotLastActiveSuperAdmin(user);
        }
        if (roleIsChanging && user.role === client_1.Role.MANAGER) {
            const executiveCount = await this.prisma.user.count({
                where: { managerId: id },
            });
            if (executiveCount > 0) {
                throw new common_1.ConflictException(`Cannot change role: ${executiveCount} executive(s) still assigned to this manager. Reassign them first.`);
            }
        }
        if (dto.email && dto.email !== user.email) {
            const emailTaken = await this.prisma.user.findUnique({
                where: { email: dto.email },
                select: { id: true },
            });
            if (emailTaken) {
                throw new common_1.ConflictException('Email already in use by another user');
            }
        }
        const data = {};
        if (dto.email !== undefined)
            data.email = dto.email;
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.role !== undefined)
            data.role = dto.role;
        if (dto.isActive !== undefined)
            data.isActive = dto.isActive;
        if (dto.password) {
            data.passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        }
        if (nextRole !== client_1.Role.EXECUTIVE) {
            if (dto.managerId) {
                throw new common_1.BadRequestException('Only an EXECUTIVE can be assigned to a manager');
            }
            if (user.managerId) {
                data.manager = { disconnect: true };
            }
        }
        else if (dto.managerId !== undefined) {
            if (dto.managerId) {
                await this.assertValidManagerId(dto.managerId, id);
                data.manager = { connect: { id: dto.managerId } };
            }
            else {
                data.manager = { disconnect: true };
            }
        }
        const action = isBeingDeactivated
            ? 'DEACTIVATE'
            : dto.isActive === true && !user.isActive
                ? 'ACTIVATE'
                : 'UPDATE';
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.user.update({
                where: { id },
                data,
                select: USER_SELECT,
            });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action,
                entity: 'User',
                entityId: id,
                metadata: {
                    before: {
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        isActive: user.isActive,
                        managerId: user.managerId,
                    },
                    after: {
                        email: updated.email,
                        name: updated.name,
                        role: updated.role,
                        isActive: updated.isActive,
                        managerId: updated.managerId,
                    },
                    passwordChanged: Boolean(dto.password),
                },
            });
            return updated;
        });
    }
    async setActive(id, isActive, currentUser) {
        return this.update(id, { isActive }, currentUser);
    }
    async remove(id, currentUser) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, role: true, isActive: true },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (id === currentUser.sub) {
            throw new common_1.ForbiddenException('You cannot delete your own account');
        }
        if (user.role === client_1.Role.SUPER_ADMIN) {
            const superAdmins = await this.prisma.user.count({
                where: { role: client_1.Role.SUPER_ADMIN },
            });
            if (superAdmins <= 1) {
                throw new common_1.ForbiddenException('Cannot delete the last Super Admin');
            }
        }
        const [customers, executives, incentives, refunds, imports, auditActions] = await Promise.all([
            this.prisma.customer.count({ where: { assignedExecId: id } }),
            this.prisma.user.count({ where: { managerId: id } }),
            this.prisma.incentiveRecord.count({ where: { executiveId: id } }),
            this.prisma.refund.count({ where: { approvedById: id } }),
            this.prisma.importBatch.count({ where: { uploadedById: id } }),
            this.prisma.auditLog.count({ where: { actorId: id } }),
        ]);
        const blockers = {
            'assigned customers': customers,
            'executives reporting to them': executives,
            'incentive records': incentives,
            'approved refunds': refunds,
            'import batches': imports,
            'audit history entries': auditActions,
        };
        const detail = Object.entries(blockers)
            .filter(([, count]) => count > 0)
            .map(([label, count]) => `${count} ${label}`)
            .join(', ');
        if (detail) {
            throw new common_1.ConflictException(`Cannot delete ${user.name}: ${detail} on record. Deactivate the account instead — that blocks login while keeping their history intact.`);
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.user.delete({ where: { id } });
            await this.audit.withinTransaction(tx, {
                actorId: currentUser.sub,
                action: 'DELETE',
                entity: 'User',
                entityId: id,
                metadata: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    wasActive: user.isActive,
                },
            });
        });
        return { message: `${user.name} deleted successfully` };
    }
    async getStats(currentUser) {
        const scope = this.scopeFilter(currentUser);
        const countBy = (extra) => this.prisma.user.count({
            where: { AND: extra ? [scope, extra] : [scope] },
        });
        const [total, superAdmins, managers, executives, active, unassignedExecs] = await Promise.all([
            countBy(),
            countBy({ role: client_1.Role.SUPER_ADMIN }),
            countBy({ role: client_1.Role.MANAGER }),
            countBy({ role: client_1.Role.EXECUTIVE }),
            countBy({ isActive: true }),
            countBy({ role: client_1.Role.EXECUTIVE, managerId: null }),
        ]);
        return {
            total,
            superAdmins,
            managers,
            executives,
            active,
            inactive: total - active,
            unassignedExecutives: unassignedExecs,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService])
], UsersService);
//# sourceMappingURL=users.service.js.map