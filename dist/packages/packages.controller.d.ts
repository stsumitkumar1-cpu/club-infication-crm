import { PackagesService } from './packages.service.js';
import { CreatePackageDto, QueryPackagesDto, UpdatePackageDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class PackagesController {
    private packagesService;
    constructor(packagesService: PackagesService);
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
    create(dto: CreatePackageDto, user: AuthUser): Promise<{
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
    update(id: string, dto: UpdatePackageDto, user: AuthUser): Promise<{
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
    activate(id: string, user: AuthUser): Promise<{
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
    deactivate(id: string, user: AuthUser): Promise<{
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
    remove(id: string, user: AuthUser): Promise<{
        message: string;
    }>;
}
