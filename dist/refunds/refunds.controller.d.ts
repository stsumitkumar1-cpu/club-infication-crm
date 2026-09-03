import { RefundsService } from './refunds.service.js';
import { CreateRefundDto, QueryRefundsDto, UpdateRefundDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class RefundsController {
    private refundsService;
    constructor(refundsService: RefundsService);
    create(dto: CreateRefundDto, user: AuthUser): Promise<{
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
        date: Date;
        idempotencyKey: string | null;
    }>;
    findAll(query: QueryRefundsDto, user: AuthUser): Promise<{
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
            date: Date;
            idempotencyKey: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            totalAmount: number;
        };
    }>;
    getStats(user: AuthUser): Promise<{
        refundCount: number;
        refundedTotal: number;
        refundedThisMonth: number;
        refundsThisMonth: number;
        customersRefunded: number;
    }>;
    findOne(id: string, user: AuthUser): Promise<{
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
        date: Date;
        idempotencyKey: string | null;
    }>;
    update(id: string, dto: UpdateRefundDto, user: AuthUser): Promise<{
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
        date: Date;
        idempotencyKey: string | null;
    }>;
    remove(id: string, user: AuthUser): Promise<{
        message: string;
    }>;
}
