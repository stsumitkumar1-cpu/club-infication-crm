import { EntitlementsService } from './entitlements.service.js';
import { AdjustEntitlementDto, BalanceQueryDto, QueryLedgerDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class EntitlementsController {
    private entitlementsService;
    constructor(entitlementsService: EntitlementsService);
    getBalance(query: BalanceQueryDto, user: AuthUser): Promise<{
        customerId: string;
        customerName: string;
        membershipId: string | null;
        remaining: import("./entitlement.types.js").EntitlementBalance;
        credited: {
            nights: number;
        };
        debited: {
            nights: number;
        };
        breakdown: {
            type: string;
            entries: number;
            nights: number;
        }[];
    }>;
    findAll(query: QueryLedgerDto, user: AuthUser): Promise<{
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
            } | null;
            booking: {
                status: import(".prisma/client").$Enums.BookingStatus;
                id: string;
                checkIn: Date;
                checkOut: Date;
            } | null;
        } & {
            actorId: string | null;
            id: string;
            createdAt: Date;
            days: number;
            nights: number;
            customerId: string;
            membershipId: string | null;
            bookingId: string | null;
            type: string;
            bucket: import(".prisma/client").$Enums.EntitlementBucket;
            description: string | null;
            yearIndex: number | null;
            date: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            netNights: number;
        };
    }>;
    adjust(dto: AdjustEntitlementDto, user: AuthUser): Promise<{
        balance: {
            nights: number;
            days: number;
        };
        actorId: string | null;
        id: string;
        createdAt: Date;
        days: number;
        nights: number;
        customerId: string;
        membershipId: string | null;
        bookingId: string | null;
        type: string;
        bucket: import(".prisma/client").$Enums.EntitlementBucket;
        description: string | null;
        yearIndex: number | null;
        date: Date;
    }>;
}
