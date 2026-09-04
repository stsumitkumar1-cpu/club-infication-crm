import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';
import { type EntitlementBalance, type LedgerMovement } from './entitlement.types.js';
import { AdjustEntitlementDto, QueryLedgerDto } from './dto/index.js';
type Db = PrismaService | Prisma.TransactionClient;
export declare class EntitlementsService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private scopeFilter;
    balanceFor(db: Db, where: {
        customerId: string;
        membershipId?: string | null;
    }): Promise<EntitlementBalance>;
    record(db: Db, movement: LedgerMovement): Promise<{
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
    lockMembershipForUpdate(tx: Prisma.TransactionClient, membershipId: string): Promise<void>;
    recordAllocation(tx: Prisma.TransactionClient, params: {
        customerId: string;
        membershipId: string;
        nights: number;
        packageName: string;
        actorId: string;
    }): Promise<{
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
    reconcileAnnualEntitlement(tx: Prisma.TransactionClient, membershipId: string, actorId?: string | null): Promise<{
        yearIndex: number | null;
        allocatedNights: number;
        lapsedNights: number;
    }>;
    creditComplimentaryNights(tx: Prisma.TransactionClient, params: {
        customerId: string;
        membershipId: string;
        nights: number;
        reason: string;
        actorId?: string | null;
    }): Promise<{
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
    closeMembershipBalance(tx: Prisma.TransactionClient, params: {
        customerId: string;
        membershipId: string;
        reason: string;
        actorId: string;
    }): Promise<{
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
    } | null>;
    reopenMembershipBalance(tx: Prisma.TransactionClient, params: {
        customerId: string;
        membershipId: string;
        actorId: string;
    }): Promise<{
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
    } | null>;
    getBalance(query: {
        customerId: string;
        membershipId?: string;
    }, currentUser: AuthUser): Promise<{
        customerId: string;
        customerName: string;
        membershipId: string | null;
        remaining: EntitlementBalance;
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
    findAll(query: QueryLedgerDto, currentUser: AuthUser): Promise<{
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
    adjust(dto: AdjustEntitlementDto, currentUser: AuthUser): Promise<{
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
export {};
