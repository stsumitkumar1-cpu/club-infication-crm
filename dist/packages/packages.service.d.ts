import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';
import { CreatePackageDto, QueryPackagesDto, UpdatePackageDto } from './dto/index.js';
export declare class PackagesService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private assertNameFree;
    create(dto: CreatePackageDto, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: number;
        nights: number;
        nightsPerYear: number | null;
        validityMonths: number;
    }>;
    findAll(query: QueryPackagesDto): Promise<{
        data: ({
            _count: {
                memberships: number;
            };
        } & {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            days: number;
            price: number;
            nights: number;
            nightsPerYear: number | null;
            validityMonths: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        _count: {
            memberships: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: number;
        nights: number;
        nightsPerYear: number | null;
        validityMonths: number;
    }>;
    update(id: string, dto: UpdatePackageDto, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: number;
        nights: number;
        nightsPerYear: number | null;
        validityMonths: number;
    }>;
    setActive(id: string, isActive: boolean, currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: number;
        nights: number;
        nightsPerYear: number | null;
        validityMonths: number;
    }>;
    remove(id: string, currentUser: AuthUser): Promise<{
        message: string;
    }>;
}
