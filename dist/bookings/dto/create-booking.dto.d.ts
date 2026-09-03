export declare class CreateBookingDto {
    customerId: string;
    membershipId: string;
    checkIn: Date;
    checkOut: Date;
    nightsUsed?: number;
    notes?: string;
    idempotencyKey?: string;
}
