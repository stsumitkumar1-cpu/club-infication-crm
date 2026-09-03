import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';
import { CreateUserDto, QueryUsersDto, SetPasswordDto, UpdateUserDto } from './dto/index.js';
export declare class UsersService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private scopeFilter;
    private assertValidManagerId;
    private assertNotLastActiveSuperAdmin;
    create(dto: CreateUserDto, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
    }>;
    findAll(currentUser: AuthUser, query?: QueryUsersDto): Promise<{
        data: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            managerId: string | null;
            manager: {
                id: string;
                name: string;
                email: string;
            } | null;
            _count: {
                executives: number;
                customers: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
        manager: {
            id: string;
            name: string;
            email: string;
        } | null;
        executives: {
            id: string;
            name: string;
            email: string;
            isActive: boolean;
        }[];
    }>;
    setPassword(id: string, dto: SetPasswordDto, currentUser: AuthUser): Promise<{
        message: string;
    }>;
    update(id: string, dto: UpdateUserDto, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
    }>;
    setActive(id: string, isActive: boolean, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
    }>;
    remove(id: string, currentUser: AuthUser): Promise<{
        message: string;
    }>;
    getStats(currentUser: AuthUser): Promise<{
        total: number;
        superAdmins: number;
        managers: number;
        executives: number;
        active: number;
        inactive: number;
        unassignedExecutives: number;
    }>;
}
