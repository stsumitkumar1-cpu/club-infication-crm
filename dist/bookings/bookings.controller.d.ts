import { BookingsService } from './bookings.service.js';
import { CreateBookingDto, QueryBookingsDto, UpdateBookingDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto, user: AuthUser): Promise<({
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
    findAll(query: QueryBookingsDto, user: AuthUser): Promise<{
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
    getStats(user: AuthUser): Promise<{
        total: number;
        confirmed: number;
        completed: number;
        cancelled: number;
        upcoming: number;
        daysUsed: number;
        nightsUsed: number;
    }>;
    findOne(id: string, user: AuthUser): Promise<{
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
    update(id: string, dto: UpdateBookingDto, user: AuthUser): Promise<{
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
    cancel(id: string, user: AuthUser): Promise<{
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
    complete(id: string, user: AuthUser): Promise<{
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
}
