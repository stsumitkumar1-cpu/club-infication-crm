import { MembershipStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { EntitlementsService } from '../entitlements/entitlements.service.js';
import type { AuthUser } from '../common/types/index.js';
import { CreateMembershipDto, QueryMembershipsDto, UpdateMembershipDto } from './dto/index.js';
export declare class MembershipsService {
    private prisma;
    private audit;
    private entitlements;
    constructor(prisma: PrismaService, audit: AuditService, entitlements: EntitlementsService);
    private addMonths;
    private findScopedOrFail;
    create(dto: CreateMembershipDto, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            assignedExec: {
                id: string;
                name: string;
            } | null;
            phone: string;
        };
        package: {
            id: string;
            name: string;
            days: number;
            price: number;
            nights: number;
            validityMonths: number;
        } | null;
        _count: {
            entitlementLog: number;
            bookings: number;
        };
    } & {
        status: import(".prisma/client").$Enums.MembershipStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        packageId: string | null;
    }>;
    recordSaleWithinTransaction(tx: Prisma.TransactionClient, params: {
        customerId: string;
        packageId: string;
        startDate?: Date;
        endDate?: Date;
        actorId: string;
    }): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            assignedExec: {
                id: string;
                name: string;
            } | null;
            phone: string;
        };
        package: {
            id: string;
            name: string;
            days: number;
            price: number;
            nights: number;
            validityMonths: number;
        } | null;
        _count: {
            entitlementLog: number;
            bookings: number;
        };
    } & {
        status: import(".prisma/client").$Enums.MembershipStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        packageId: string | null;
    }>;
    findAll(query: QueryMembershipsDto, currentUser: AuthUser): Promise<{
        data: ({
            customer: {
                id: string;
                name: string;
                assignedExecId: string | null;
                assignedExec: {
                    id: string;
                    name: string;
                } | null;
                phone: string;
            };
            package: {
                id: string;
                name: string;
                days: number;
                price: number;
                nights: number;
                validityMonths: number;
            } | null;
            _count: {
                entitlementLog: number;
                bookings: number;
            };
        } & {
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date | null;
            customerId: string;
            packageId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            assignedExec: {
                id: string;
                name: string;
            } | null;
            phone: string;
        };
        package: {
            id: string;
            name: string;
            days: number;
            price: number;
            nights: number;
            validityMonths: number;
        } | null;
        _count: {
            entitlementLog: number;
            bookings: number;
        };
    } & {
        status: import(".prisma/client").$Enums.MembershipStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        packageId: string | null;
    }>;
    update(id: string, dto: UpdateMembershipDto, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            assignedExec: {
                id: string;
                name: string;
            } | null;
            phone: string;
        };
        package: {
            id: string;
            name: string;
            days: number;
            price: number;
            nights: number;
            validityMonths: number;
        } | null;
        _count: {
            entitlementLog: number;
            bookings: number;
        };
    } & {
        status: import(".prisma/client").$Enums.MembershipStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        packageId: string | null;
    }>;
    private syncCustomerStatus;
    setStatus(id: string, status: MembershipStatus, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            assignedExec: {
                id: string;
                name: string;
            } | null;
            phone: string;
        };
        package: {
            id: string;
            name: string;
            days: number;
            price: number;
            nights: number;
            validityMonths: number;
        } | null;
        _count: {
            entitlementLog: number;
            bookings: number;
        };
    } & {
        status: import(".prisma/client").$Enums.MembershipStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        packageId: string | null;
    }>;
    remove(id: string, currentUser: AuthUser): Promise<{
        message: string;
    }>;
    getStats(currentUser: AuthUser): Promise<{
        total: number;
        active: number;
        expired: number;
        cancelled: number;
        expiringSoon: number;
        pastEndDate: number;
    }>;
}
