import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { MembershipsService } from '../memberships/memberships.service.js';
import type { AuthUser } from '../common/types/index.js';
import { CreateCustomerDto, QueryCustomersDto, UpdateCustomerDto } from './dto/index.js';
export declare class CustomersService {
    private prisma;
    private audit;
    private notifications;
    private memberships;
    private readonly logger;
    constructor(prisma: PrismaService, audit: AuditService, notifications: NotificationsService, memberships: MembershipsService);
    private pending;
    private resolveAssignee;
    private findScopedOrFail;
    create(dto: CreateCustomerDto, currentUser: AuthUser, options?: {
        legacyImport?: boolean;
    }): Promise<{
        assignedExec: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        assignedExecId: string | null;
        membershipId: string | null;
        phone: string;
        altPhone: string | null;
        coApplicant: string | null;
        location: string | null;
        plan: string;
        amount: number;
        amountPaid: number;
        pendingAmount: number;
        validity: string | null;
        totalDays: number;
        totalNights: number;
        registrationDate: Date | null;
    }>;
    private buildFilters;
    findAll(query: QueryCustomersDto, currentUser: AuthUser): Promise<{
        data: ({
            _count: {
                refunds: number;
                memberships: number;
                entitlementLog: number;
                bookings: number;
                payments: number;
            };
            payments: {
                id: string;
                method: string | null;
            }[];
            assignedExec: {
                id: string;
                name: string;
                manager: {
                    id: string;
                    name: string;
                } | null;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.CustomerStatus;
            id: string;
            name: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            assignedExecId: string | null;
            membershipId: string | null;
            phone: string;
            altPhone: string | null;
            coApplicant: string | null;
            location: string | null;
            plan: string;
            amount: number;
            amountPaid: number;
            pendingAmount: number;
            validity: string | null;
            totalDays: number;
            totalNights: number;
            registrationDate: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, currentUser: AuthUser): Promise<{
        _count: {
            refunds: number;
            memberships: number;
            bookings: number;
            payments: number;
        };
        refunds: ({
            membership: {
                package: {
                    id: string;
                    name: string;
                } | null;
            } | null;
            approvedBy: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            approvedById: string | null;
            customerId: string;
            membershipId: string | null;
            amount: number;
            reason: string | null;
            idempotencyKey: string | null;
            date: Date;
        })[];
        memberships: ({
            package: {
                id: string;
                name: string;
                days: number;
                price: number;
                nights: number;
                validityMonths: number;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date | null;
            salePrice: number | null;
            offersText: string | null;
            remarksText: string | null;
            usageNotes: string | null;
            customerId: string;
            packageId: string | null;
        })[];
        bookings: {
            status: import(".prisma/client").$Enums.BookingStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            membershipId: string | null;
            checkIn: Date;
            checkOut: Date;
            daysUsed: number;
            nightsUsed: number;
            notes: string | null;
            idempotencyKey: string | null;
        }[];
        payments: ({
            membership: {
                package: {
                    id: string;
                    name: string;
                } | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            membershipId: string | null;
            amount: number;
            notes: string | null;
            idempotencyKey: string | null;
            date: Date;
            method: string | null;
        })[];
        assignedExec: {
            id: string;
            name: string;
            email: string;
            manager: {
                id: string;
                name: string;
                email: string;
            } | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        assignedExecId: string | null;
        membershipId: string | null;
        phone: string;
        altPhone: string | null;
        coApplicant: string | null;
        location: string | null;
        plan: string;
        amount: number;
        amountPaid: number;
        pendingAmount: number;
        validity: string | null;
        totalDays: number;
        totalNights: number;
        registrationDate: Date | null;
    }>;
    update(id: string, dto: UpdateCustomerDto, currentUser: AuthUser): Promise<{
        assignedExec: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        name: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        assignedExecId: string | null;
        membershipId: string | null;
        phone: string;
        altPhone: string | null;
        coApplicant: string | null;
        location: string | null;
        plan: string;
        amount: number;
        amountPaid: number;
        pendingAmount: number;
        validity: string | null;
        totalDays: number;
        totalNights: number;
        registrationDate: Date | null;
    }>;
    remove(id: string, currentUser: AuthUser): Promise<{
        message: string;
    }>;
    getStats(query: QueryCustomersDto, currentUser: AuthUser): Promise<{
        total: number;
        active: number;
        pending: number;
        cancelled: number;
        expired: number;
        totalSales: number;
        totalPaid: number;
        totalPending: number;
        scopedBy: {
            status: string | null;
            plan: string | null;
            assignedExecId: string | null;
            assignedManagerId: string | null;
            search: string | null;
        };
    }>;
    findAssignableUsers(currentUser: AuthUser): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        manager: {
            id: string;
            name: string;
        } | null;
    }[]>;
}
