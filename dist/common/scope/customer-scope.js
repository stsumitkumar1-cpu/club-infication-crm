"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerScopeFilter = customerScopeFilter;
exports.membershipScopeFilter = membershipScopeFilter;
exports.assignableUserFilter = assignableUserFilter;
const client_1 = require("@prisma/client");
function customerScopeFilter(user) {
    switch (user.role) {
        case client_1.Role.SUPER_ADMIN:
            return {};
        case client_1.Role.MANAGER:
            return {
                OR: [
                    { assignedExec: { managerId: user.sub } },
                    { assignedExecId: user.sub },
                ],
            };
        default:
            return { assignedExecId: user.sub };
    }
}
function membershipScopeFilter(user) {
    if (user.role === client_1.Role.SUPER_ADMIN) {
        return {};
    }
    return { customer: customerScopeFilter(user) };
}
function assignableUserFilter(user) {
    switch (user.role) {
        case client_1.Role.SUPER_ADMIN:
            return {};
        case client_1.Role.MANAGER:
            return { OR: [{ managerId: user.sub }, { id: user.sub }] };
        default:
            return { id: user.sub };
    }
}
//# sourceMappingURL=customer-scope.js.map