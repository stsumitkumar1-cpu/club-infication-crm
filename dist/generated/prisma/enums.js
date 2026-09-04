"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportRowStatus = exports.ImportStatus = exports.IncentiveStatus = exports.BookingStatus = exports.MembershipStatus = exports.CustomerStatus = exports.Role = void 0;
exports.Role = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    MANAGER: 'MANAGER',
    EXECUTIVE: 'EXECUTIVE'
};
exports.CustomerStatus = {
    ACTIVE: 'ACTIVE',
    PENDING: 'PENDING',
    CANCELLED: 'CANCELLED'
};
exports.MembershipStatus = {
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED'
};
exports.BookingStatus = {
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
};
exports.IncentiveStatus = {
    CALCULATED: 'CALCULATED',
    PAID: 'PAID',
    PENDING: 'PENDING'
};
exports.ImportStatus = {
    UPLOADED: 'UPLOADED',
    VALIDATING: 'VALIDATING',
    VALIDATED: 'VALIDATED',
    IMPORTING: 'IMPORTING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};
exports.ImportRowStatus = {
    PENDING: 'PENDING',
    VALID: 'VALID',
    INVALID: 'INVALID',
    IMPORTED: 'IMPORTED',
    SKIPPED: 'SKIPPED'
};
//# sourceMappingURL=enums.js.map