import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';
import { CreateRefundDto, QueryRefundsDto, UpdateRefundDto } from './dto/index.js';
export declare class RefundsService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private scopeFilter;
    private round;
    create(dto: CreateRefundDto, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            phone: string;
            amount: number;
            amountPaid: number;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
        } | null;
        approvedBy: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
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
    }>;
    findAll(query: QueryRefundsDto, currentUser: AuthUser): Promise<{
        data: ({
            customer: {
                id: string;
                name: string;
                assignedExecId: string | null;
                phone: string;
                amount: number;
                amountPaid: number;
            };
            membership: {
                package: {
                    id: string;
                    name: string;
                } | null;
                status: import(".prisma/client").$Enums.MembershipStatus;
                id: string;
            } | null;
            approvedBy: {
                id: string;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            totalAmount: number;
        };
    }>;
    findOne(id: string, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            phone: string;
            amount: number;
            amountPaid: number;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
        } | null;
        approvedBy: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
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
    }>;
    update(id: string, dto: UpdateRefundDto, currentUser: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            phone: string;
            amount: number;
            amountPaid: number;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
        } | null;
        approvedBy: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
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
    }>;
    remove(id: string, currentUser: AuthUser): Promise<{
        message: string;
    }>;
    getStats(currentUser: AuthUser): Promise<{
        refundCount: number;
        refundedTotal: number;
        refundedThisMonth: number;
        refundsThisMonth: number;
        customersRefunded: number;
    }>;
}
