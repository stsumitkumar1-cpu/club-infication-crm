export declare class CreatePaymentDto {
    customerId: string;
    membershipId?: string;
    amount: number;
    method?: string;
    date?: Date;
    notes?: string;
    idempotencyKey?: string;
}
