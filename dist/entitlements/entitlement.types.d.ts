export declare const LedgerType: {
    readonly ALLOCATION: "ALLOCATION";
    readonly BOOKING_USAGE: "BOOKING_USAGE";
    readonly CANCELLATION: "CANCELLATION";
    readonly ADJUSTMENT: "ADJUSTMENT";
    readonly EXPIRY: "EXPIRY";
};
export type LedgerTypeValue = (typeof LedgerType)[keyof typeof LedgerType];
export declare const LEDGER_TYPES: ("ALLOCATION" | "BOOKING_USAGE" | "CANCELLATION" | "ADJUSTMENT" | "EXPIRY")[];
export declare const EntitlementBucket: {
    readonly PLAN: "PLAN";
    readonly COMPLIMENTARY: "COMPLIMENTARY";
};
export type EntitlementBucketValue = (typeof EntitlementBucket)[keyof typeof EntitlementBucket];
export declare function membershipYearFor(startDate: Date, totalYears: number, at?: Date): number | null;
export declare function membershipYearStart(startDate: Date, yearIndex: number): Date;
export declare function daysForNights(nights: number): number;
export interface EntitlementBalance {
    nights: number;
    days: number;
    complimentaryNights: number;
    yearIndex?: number | null;
}
export interface LedgerMovement {
    customerId: string;
    membershipId?: string | null;
    bookingId?: string | null;
    type: LedgerTypeValue;
    bucket?: EntitlementBucketValue;
    yearIndex?: number | null;
    nights: number;
    description?: string | null;
    actorId?: string | null;
    date?: Date;
}
