export declare const Role: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly MANAGER: "MANAGER";
    readonly EXECUTIVE: "EXECUTIVE";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const CustomerStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly PENDING: "PENDING";
    readonly CANCELLED: "CANCELLED";
};
export type CustomerStatus = (typeof CustomerStatus)[keyof typeof CustomerStatus];
export declare const MembershipStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly EXPIRED: "EXPIRED";
    readonly CANCELLED: "CANCELLED";
};
export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus];
export declare const BookingStatus: {
    readonly CONFIRMED: "CONFIRMED";
    readonly CANCELLED: "CANCELLED";
    readonly COMPLETED: "COMPLETED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const IncentiveStatus: {
    readonly CALCULATED: "CALCULATED";
    readonly PAID: "PAID";
    readonly PENDING: "PENDING";
};
export type IncentiveStatus = (typeof IncentiveStatus)[keyof typeof IncentiveStatus];
export declare const ImportStatus: {
    readonly UPLOADED: "UPLOADED";
    readonly VALIDATING: "VALIDATING";
    readonly VALIDATED: "VALIDATED";
    readonly IMPORTING: "IMPORTING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
};
export type ImportStatus = (typeof ImportStatus)[keyof typeof ImportStatus];
export declare const ImportRowStatus: {
    readonly PENDING: "PENDING";
    readonly VALID: "VALID";
    readonly INVALID: "INVALID";
    readonly IMPORTED: "IMPORTED";
    readonly SKIPPED: "SKIPPED";
};
export type ImportRowStatus = (typeof ImportRowStatus)[keyof typeof ImportRowStatus];
