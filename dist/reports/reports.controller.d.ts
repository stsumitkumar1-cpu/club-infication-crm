import { ReportsService } from './reports.service.js';
import { QueryPerformanceDto, QueryReportDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(user: AuthUser): Promise<{
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
    getExecutivePerformance(query: QueryPerformanceDto, user: AuthUser): Promise<{
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
    getPendingPayments(query: QueryReportDto, user: AuthUser): Promise<{
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
    getCustomerUsage(query: QueryReportDto, user: AuthUser): Promise<{
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
