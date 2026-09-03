"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEDGER_TYPES = exports.LedgerType = void 0;
exports.daysForNights = daysForNights;
exports.LedgerType = {
    ALLOCATION: 'ALLOCATION',
    BOOKING_USAGE: 'BOOKING_USAGE',
    CANCELLATION: 'CANCELLATION',
    ADJUSTMENT: 'ADJUSTMENT',
    EXPIRY: 'EXPIRY',
};
exports.LEDGER_TYPES = Object.values(exports.LedgerType);
function daysForNights(nights) {
    return nights > 0 ? nights + 1 : 0;
}
//# sourceMappingURL=entitlement.types.js.map