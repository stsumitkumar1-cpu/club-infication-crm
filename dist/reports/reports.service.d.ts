import { PrismaService } from '../database/prisma.service.js';
import type { AuthUser } from '../common/types/index.js';
import { QueryPerformanceDto, QueryReportDto } from './dto/index.js';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    private round;
    private asPositive;
    private startOfMonth;
    private ledgerScope;
    private bookingScope;
    private paymentScope;
    private refundScope;
    private performanceScope;
    getDashboard(currentUser: AuthUser): Promise<{
        scope: string;
        role: import(".prisma/client").$Enums.Role;
        generatedAt: string;
        customers: {
            total: number;
            newThisMonth: number;
            active: number;
            pending: number;
            cancelled: number;
        };
        sales: {
            planValue: number;
            recordedPaid: number;
            pending: number;
            customersWithPending: number;
            collectedFromPayments: number;
            paymentCount: number;
            collectedThisMonth: number;
            paymentsThisMonth: number;
        };
        refunds: {
            total: number;
            count: number;
        };
        memberships: {
            total: number;
            active: number;
            expiringIn30Days: number;
            pastEndDate: number;
        };
        bookings: {
            total: number;
            upcoming: number;
            completed: number;
            cancelled: number;
        };
        usage: {
            nightsAllocated: number;
            nightsUsed: number;
            nightsReturned: number;
            nightsAdjusted: number;
            nightsExpired: number;
            nightsRemaining: number;
            daysRemaining: number;
        };
        team: {
            executives: number;
            activeExecutives: number;
            managers: number;
            unassignedExecutives: number;
        } | null;
        incentives: {
            available: boolean;
            reason: string;
        };
    }>;
    private getTeamSummary;
    getExecutivePerformance(currentUser: AuthUser, query?: QueryPerformanceDto): Promise<{
        data: {
            executive: {
                id: string;
                name: string;
                email: string;
                isActive: boolean;
                manager: {
                    id: string;
                    name: string;
                } | null;
            };
            customers: number;
            totalSales: number;
            collected: number;
            pending: number;
            daysUsed: number;
            nightsUsed: number;
            incentive: null;
        }[];
        meta: {
            executives: number;
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            sortBy: "name" | "customers" | "daysUsed" | "totalSales" | "collected" | "pending";
            sortDir: "asc" | "desc";
            totals: {
                customers: number;
                totalSales: number;
                collected: number;
                pending: number;
                daysUsed: number;
                nightsUsed: number;
            };
        };
    }>;
    getPendingPayments(query: QueryReportDto, currentUser: AuthUser): Promise<{
        data: {
            status: import(".prisma/client").$Enums.CustomerStatus;
            id: string;
            name: string;
            assignedExec: {
                id: string;
                name: string;
                manager: {
                    name: string;
                } | null;
            } | null;
            phone: string;
            plan: string;
            amount: number;
            amountPaid: number;
            pendingAmount: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            pendingTotal: number;
            planValueTotal: number;
            collectedTotal: number;
        };
    }>;
    getCustomerUsage(query: QueryReportDto, currentUser: AuthUser): Promise<{
        data: {
            customer: {
                id: string;
                name: string;
                phone: string;
                plan: string;
                assignedExec: {
                    id: string;
                    name: string;
                } | null;
            };
            daysRemaining: number;
            nightsRemaining: number;
            daysUsed: number;
            nightsUsed: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
