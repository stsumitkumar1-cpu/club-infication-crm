import { TeamsService } from './teams.service.js';
import { AssignExecutiveDto, UnassignExecutiveDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
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
    findUnassigned(): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        _count: {
            customers: number;
        };
    }[]>;
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
    assign(dto: AssignExecutiveDto, currentUser: AuthUser): Promise<{
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
    unassign(dto: UnassignExecutiveDto, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        managerId: string | null;
    }>;
}
