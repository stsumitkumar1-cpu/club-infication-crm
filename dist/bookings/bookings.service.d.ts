import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { EntitlementsService } from '../entitlements/entitlements.service.js';
import type { AuthUser } from '../common/types/index.js';
import { CreateBookingDto, QueryBookingsDto, UpdateBookingDto } from './dto/index.js';
export declare class BookingsService {
    private prisma;
    private audit;
    private entitlements;
    constructor(prisma: PrismaService, audit: AuditService, entitlements: EntitlementsService);
    private scopeFilter;
    private dateText;
    private startOfDay;
    private derivedUsage;
    create(dto: CreateBookingDto, currentUser: AuthUser): Promise<({
        customer: {
            id: string;
            name: string;
            phone: string;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
            startDate: Date;
            endDate: Date | null;
        } | null;
        entitlementLog: {
            id: string;
            days: number;
            nights: number;
            type: string;
            date: Date;
        }[];
    } & {
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
    }) | null>;
    findAll(query: QueryBookingsDto, currentUser: AuthUser): Promise<{
        data: ({
            customer: {
                id: string;
                name: string;
                phone: string;
            };
            membership: {
                package: {
                    id: string;
                    name: string;
                } | null;
                status: import(".prisma/client").$Enums.MembershipStatus;
                id: string;
                startDate: Date;
                endDate: Date | null;
            } | null;
            entitlementLog: {
                id: string;
                days: number;
                nights: number;
                type: string;
                date: Date;
            }[];
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            cancelledCount: number;
        };
    }>;
    findOne(id: string, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            phone: string;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
            startDate: Date;
            endDate: Date | null;
        } | null;
        entitlementLog: {
            id: string;
            days: number;
            nights: number;
            type: string;
            date: Date;
        }[];
    } & {
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
    }>;
    update(id: string, dto: UpdateBookingDto, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            phone: string;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
            startDate: Date;
            endDate: Date | null;
        } | null;
        entitlementLog: {
            id: string;
            days: number;
            nights: number;
            type: string;
            date: Date;
        }[];
    } & {
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
    }>;
    cancel(id: string, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            phone: string;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
            startDate: Date;
            endDate: Date | null;
        } | null;
        entitlementLog: {
            id: string;
            days: number;
            nights: number;
            type: string;
            date: Date;
        }[];
    } & {
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
    }>;
    complete(id: string, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            phone: string;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
            startDate: Date;
            endDate: Date | null;
        } | null;
        entitlementLog: {
            id: string;
            days: number;
            nights: number;
            type: string;
            date: Date;
        }[];
    } & {
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
    }>;
    getStats(currentUser: AuthUser): Promise<{
        total: number;
        confirmed: number;
        completed: number;
        cancelled: number;
        upcoming: number;
        daysUsed: number;
        nightsUsed: number;
    }>;
}
