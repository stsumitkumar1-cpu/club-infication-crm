import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { AuthUser } from '../common/types/index.js';
import { CreatePaymentDto, QueryPaymentsDto, UpdatePaymentDto } from './dto/index.js';
export declare class PaymentsService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private scopeFilter;
    private round;
    create(dto: CreatePaymentDto, currentUser: AuthUser): Promise<{
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
        notes: string | null;
        idempotencyKey: string | null;
        date: Date;
        method: string | null;
    }>;
    findAll(query: QueryPaymentsDto, currentUser: AuthUser): Promise<{
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
            notes: string | null;
            idempotencyKey: string | null;
            date: Date;
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
    findOne(id: string, currentUser: AuthUser): Promise<{
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
        notes: string | null;
        idempotencyKey: string | null;
        date: Date;
        method: string | null;
    }>;
    update(id: string, dto: UpdatePaymentDto, currentUser: AuthUser): Promise<{
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
        notes: string | null;
        idempotencyKey: string | null;
        date: Date;
        method: string | null;
    }>;
    remove(id: string, currentUser: AuthUser): Promise<{
        message: string;
    }>;
    getStats(currentUser: AuthUser): Promise<{
        paymentCount: number;
        collectedTotal: number;
        collectedThisMonth: number;
        paymentsThisMonth: number;
        planValueTotal: number;
        recordedPaidTotal: number;
        pendingTotal: number;
        customersWithPending: number;
    }>;
}
