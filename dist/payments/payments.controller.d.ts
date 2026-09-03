import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto, QueryPaymentsDto, UpdatePaymentDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    create(dto: CreatePaymentDto, user: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            phone: string;
            amount: number;
            amountPaid: number;
            pendingAmount: number;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        membershipId: string | null;
        amount: number;
        date: Date;
        notes: string | null;
        idempotencyKey: string | null;
        method: string | null;
    }>;
    findAll(query: QueryPaymentsDto, user: AuthUser): Promise<{
        data: ({
            customer: {
                id: string;
                name: string;
                assignedExecId: string | null;
                phone: string;
                amount: number;
                amountPaid: number;
                pendingAmount: number;
            };
            membership: {
                package: {
                    id: string;
                    name: string;
                } | null;
                status: import(".prisma/client").$Enums.MembershipStatus;
                id: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            membershipId: string | null;
            amount: number;
            date: Date;
            notes: string | null;
            idempotencyKey: string | null;
            method: string | null;
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
        paymentCount: number;
        collectedTotal: number;
        collectedThisMonth: number;
        paymentsThisMonth: number;
        planValueTotal: number;
        recordedPaidTotal: number;
        pendingTotal: number;
        customersWithPending: number;
    }>;
    findOne(id: string, user: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            phone: string;
            amount: number;
            amountPaid: number;
            pendingAmount: number;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        membershipId: string | null;
        amount: number;
        date: Date;
        notes: string | null;
        idempotencyKey: string | null;
        method: string | null;
    }>;
    update(id: string, dto: UpdatePaymentDto, user: AuthUser): Promise<{
        customer: {
            id: string;
            name: string;
            assignedExecId: string | null;
            phone: string;
            amount: number;
            amountPaid: number;
            pendingAmount: number;
        };
        membership: {
            package: {
                id: string;
                name: string;
            } | null;
            status: import(".prisma/client").$Enums.MembershipStatus;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        membershipId: string | null;
        amount: number;
        date: Date;
        notes: string | null;
        idempotencyKey: string | null;
        method: string | null;
    }>;
    remove(id: string, user: AuthUser): Promise<{
        message: string;
    }>;
}
