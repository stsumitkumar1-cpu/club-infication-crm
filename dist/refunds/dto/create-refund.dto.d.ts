export declare class CreateRefundDto {
    customerId: string;
    membershipId?: string;
    amount: number;
    date?: Date;
    reason?: string;
    idempotencyKey?: string;
}
