export interface EmailMessage {
    to: string;
    subject: string;
    body: string;
}
export interface NewCustomerContext {
    customerName: string;
    customerEmail: string;
    plan: string;
    amount: number;
    amountPaid: number;
    pendingAmount: number;
    validity?: string | null;
    totalDays?: number;
    totalNights?: number;
    membershipId?: string | null;
}
export declare class NotificationsService {
    private readonly logger;
    private get enabled();
    private money;
    buildNewCustomerEmail(ctx: NewCustomerContext): EmailMessage;
    send(message: EmailMessage): Promise<{
        sent: boolean;
        reason?: string;
    }>;
    notifyNewCustomer(ctx: NewCustomerContext): Promise<{
        sent: boolean;
        reason?: string;
    }>;
    getStatus(): {
        enabled: boolean;
        transportConfigured: boolean;
        environment: string;
        note: string;
        pendingClarification: string;
    };
}
