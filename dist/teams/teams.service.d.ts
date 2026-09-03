import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';
import { AssignExecutiveDto } from './dto/index.js';
export declare class TeamsService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private assertCanActOnTeam;
    findAll(currentUser: AuthUser): Promise<{
        data: {
            id: string;
            name: string;
            email: string;
            isActive: boolean;
            executives: {
                id: string;
                name: string;
                email: string;
                isActive: boolean;
                createdAt: Date;
                _count: {
                    customers: number;
                };
            }[];
            _count: {
                executives: number;
            };
        }[];
        meta: {
            totalTeams: number;
        };
    }>;
    findOne(managerId: string, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        executives: {
            id: string;
            name: string;
            email: string;
            isActive: boolean;
            createdAt: Date;
            _count: {
                customers: number;
            };
        }[];
        _count: {
            executives: number;
        };
    }>;
    findUnassignedExecutives(): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        _count: {
            customers: number;
        };
    }[]>;
    assignExecutive(dto: AssignExecutiveDto, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        managerId: string | null;
        manager: {
            id: string;
            name: string;
            email: string;
        } | null;
    }>;
    unassignExecutive(executiveId: string, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        managerId: string | null;
    }>;
    private resolveTargetManager;
}
