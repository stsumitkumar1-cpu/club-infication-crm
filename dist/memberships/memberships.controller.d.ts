import { MembershipsService } from './memberships.service.js';
import { CreateMembershipDto, QueryMembershipsDto, UpdateMembershipDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class MembershipsController {
    private membershipsService;
    constructor(membershipsService: MembershipsService);
    create(dto: CreateMembershipDto, user: AuthUser): Promise<{
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
    findAll(query: QueryMembershipsDto, user: AuthUser): Promise<{
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
    getStats(user: AuthUser): Promise<{
        total: number;
        active: number;
        expired: number;
        cancelled: number;
        expiringSoon: number;
        pastEndDate: number;
    }>;
    findOne(id: string, user: AuthUser): Promise<{
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
    update(id: string, dto: UpdateMembershipDto, user: AuthUser): Promise<{
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
    cancel(id: string, user: AuthUser): Promise<{
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
    expire(id: string, user: AuthUser): Promise<{
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
    remove(id: string, user: AuthUser): Promise<{
        message: string;
    }>;
}
