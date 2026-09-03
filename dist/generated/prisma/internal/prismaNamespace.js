"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.ImportStagingScalarFieldEnum = exports.ImportBatchScalarFieldEnum = exports.AuditLogScalarFieldEnum = exports.IncentiveRecordScalarFieldEnum = exports.IncentiveRuleScalarFieldEnum = exports.RefundScalarFieldEnum = exports.PaymentScalarFieldEnum = exports.BookingScalarFieldEnum = exports.EntitlementLedgerScalarFieldEnum = exports.MembershipScalarFieldEnum = exports.PackageScalarFieldEnum = exports.CustomerScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.10.0",
    engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    Customer: 'Customer',
    Package: 'Package',
    Membership: 'Membership',
    EntitlementLedger: 'EntitlementLedger',
    Booking: 'Booking',
    Payment: 'Payment',
    Refund: 'Refund',
    IncentiveRule: 'IncentiveRule',
    IncentiveRecord: 'IncentiveRecord',
    AuditLog: 'AuditLog',
    ImportBatch: 'ImportBatch',
    ImportStaging: 'ImportStaging'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    role: 'role',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    managerId: 'managerId'
};
exports.CustomerScalarFieldEnum = {
    id: 'id',
    membershipId: 'membershipId',
    name: 'name',
    phone: 'phone',
    email: 'email',
    plan: 'plan',
    amount: 'amount',
    amountPaid: 'amountPaid',
    pendingAmount: 'pendingAmount',
    validity: 'validity',
    totalDays: 'totalDays',
    totalNights: 'totalNights',
    status: 'status',
    assignedExecId: 'assignedExecId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PackageScalarFieldEnum = {
    id: 'id',
    name: 'name',
    price: 'price',
    days: 'days',
    nights: 'nights',
    validityMonths: 'validityMonths',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.MembershipScalarFieldEnum = {
    id: 'id',
    customerId: 'customerId',
    packageId: 'packageId',
    startDate: 'startDate',
    endDate: 'endDate',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.EntitlementLedgerScalarFieldEnum = {
    id: 'id',
    customerId: 'customerId',
    membershipId: 'membershipId',
    type: 'type',
    days: 'days',
    nights: 'nights',
    description: 'description',
    date: 'date'
};
exports.BookingScalarFieldEnum = {
    id: 'id',
    customerId: 'customerId',
    membershipId: 'membershipId',
    checkIn: 'checkIn',
    checkOut: 'checkOut',
    daysUsed: 'daysUsed',
    nightsUsed: 'nightsUsed',
    status: 'status',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PaymentScalarFieldEnum = {
    id: 'id',
    customerId: 'customerId',
    amount: 'amount',
    method: 'method',
    date: 'date',
    notes: 'notes',
    createdAt: 'createdAt'
};
exports.RefundScalarFieldEnum = {
    id: 'id',
    customerId: 'customerId',
    amount: 'amount',
    date: 'date',
    reason: 'reason',
    approvedById: 'approvedById',
    createdAt: 'createdAt'
};
exports.IncentiveRuleScalarFieldEnum = {
    id: 'id',
    name: 'name',
    minSales: 'minSales',
    maxSales: 'maxSales',
    percentage: 'percentage',
    effectiveFrom: 'effectiveFrom',
    effectiveTo: 'effectiveTo',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.IncentiveRecordScalarFieldEnum = {
    id: 'id',
    executiveId: 'executiveId',
    period: 'period',
    totalSales: 'totalSales',
    eligibleSales: 'eligibleSales',
    incentiveEarned: 'incentiveEarned',
    incentivePaid: 'incentivePaid',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.AuditLogScalarFieldEnum = {
    id: 'id',
    actorId: 'actorId',
    action: 'action',
    entity: 'entity',
    entityId: 'entityId',
    metadata: 'metadata',
    timestamp: 'timestamp'
};
exports.ImportBatchScalarFieldEnum = {
    id: 'id',
    fileName: 'fileName',
    status: 'status',
    totalRows: 'totalRows',
    validRows: 'validRows',
    importedRows: 'importedRows',
    uploadedById: 'uploadedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ImportStagingScalarFieldEnum = {
    id: 'id',
    batchId: 'batchId',
    rowNumber: 'rowNumber',
    rawData: 'rawData',
    validationErrors: 'validationErrors',
    mappedData: 'mappedData',
    importStatus: 'importStatus',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map