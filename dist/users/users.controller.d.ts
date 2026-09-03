import { UsersService } from './users.service.js';
import { CreateUserDto, QueryUsersDto, SetPasswordDto, UpdateUserDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findAll(query: QueryUsersDto, currentUser: AuthUser): Promise<{
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
    getStats(currentUser: AuthUser): Promise<{
        total: number;
        superAdmins: number;
        managers: number;
        executives: number;
        active: number;
        inactive: number;
        unassignedExecutives: number;
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
    setPassword(id: string, dto: SetPasswordDto, currentUser: AuthUser): Promise<{
        message: string;
    }>;
    activate(id: string, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
    }>;
    deactivate(id: string, currentUser: AuthUser): Promise<{
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
}
