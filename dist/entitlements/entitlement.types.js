"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitlementBucket = exports.LEDGER_TYPES = exports.LedgerType = void 0;
exports.membershipYearFor = membershipYearFor;
exports.membershipYearStart = membershipYearStart;
exports.daysForNights = daysForNights;
exports.LedgerType = {
    ALLOCATION: 'ALLOCATION',
    BOOKING_USAGE: 'BOOKING_USAGE',
    CANCELLATION: 'CANCELLATION',
    ADJUSTMENT: 'ADJUSTMENT',
    EXPIRY: 'EXPIRY',
};
exports.LEDGER_TYPES = Object.values(exports.LedgerType);
exports.EntitlementBucket = {
    PLAN: 'PLAN',
    COMPLIMENTARY: 'COMPLIMENTARY',
};
function membershipYearFor(startDate, totalYears, at = new Date()) {
    if (at < startDate) {
        return null;
    }
    let years = at.getFullYear() - startDate.getFullYear();
    const beforeAnniversary = at.getMonth() < startDate.getMonth() ||
        (at.getMonth() === startDate.getMonth() &&
            at.getDate() < startDate.getDate());
    if (beforeAnniversary) {
        years -= 1;
    }
    return Math.min(Math.max(years + 1, 1), Math.max(totalYears, 1));
}
function membershipYearStart(startDate, yearIndex) {
    const d = new Date(startDate);
    d.setFullYear(d.getFullYear() + (yearIndex - 1));
    return d;
}
function daysForNights(nights) {
    return nights > 0 ? nights + 1 : 0;
}
//# sourceMappingURL=entitlement.types.js.map