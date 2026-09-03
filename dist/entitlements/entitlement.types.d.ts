export declare const LedgerType: {
    readonly ALLOCATION: "ALLOCATION";
    readonly BOOKING_USAGE: "BOOKING_USAGE";
    readonly CANCELLATION: "CANCELLATION";
    readonly ADJUSTMENT: "ADJUSTMENT";
    readonly EXPIRY: "EXPIRY";
};
export type LedgerTypeValue = (typeof LedgerType)[keyof typeof LedgerType];
export declare const LEDGER_TYPES: ("ALLOCATION" | "BOOKING_USAGE" | "CANCELLATION" | "ADJUSTMENT" | "EXPIRY")[];
export declare function daysForNights(nights: number): number;
export interface EntitlementBalance {
    nights: number;
    days: number;
}
export interface LedgerMovement {
    customerId: string;
    membershipId?: string | null;
    bookingId?: string | null;
    type: LedgerTypeValue;
    nights: number;
    description?: string | null;
    actorId?: string | null;
    date?: Date;
}
