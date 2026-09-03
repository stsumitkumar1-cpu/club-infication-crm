import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: any;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: any;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: any;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: any;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: any;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: any;
export declare const empty: any;
export declare const join: any;
export declare const raw: any;
export declare const Sql: any;
export type Sql = runtime.Sql;
export declare const Decimal: any;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: any;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: any;
export declare const JsonNull: any;
export declare const AnyNull: any;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions
] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? ((Without<T, U> & U) | (Without<U, T> & T)) & object : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly Customer: "Customer";
    readonly Package: "Package";
    readonly Membership: "Membership";
    readonly EntitlementLedger: "EntitlementLedger";
    readonly Booking: "Booking";
    readonly Payment: "Payment";
    readonly Refund: "Refund";
    readonly IncentiveRule: "IncentiveRule";
    readonly IncentiveRecord: "IncentiveRecord";
    readonly AuditLog: "AuditLog";
    readonly ImportBatch: "ImportBatch";
    readonly ImportStaging: "ImportStaging";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "customer" | "package" | "membership" | "entitlementLedger" | "booking" | "payment" | "refund" | "incentiveRule" | "incentiveRecord" | "auditLog" | "importBatch" | "importStaging";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Customer: {
            payload: Prisma.$CustomerPayload<ExtArgs>;
            fields: Prisma.CustomerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findMany: {
                    args: Prisma.CustomerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                create: {
                    args: Prisma.CustomerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                createMany: {
                    args: Prisma.CustomerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                delete: {
                    args: Prisma.CustomerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                update: {
                    args: Prisma.CustomerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                upsert: {
                    args: Prisma.CustomerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomer>;
                };
                groupBy: {
                    args: Prisma.CustomerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerCountAggregateOutputType> | number;
                };
            };
        };
        Package: {
            payload: Prisma.$PackagePayload<ExtArgs>;
            fields: Prisma.PackageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PackageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PackageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload>;
                };
                findFirst: {
                    args: Prisma.PackageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PackageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload>;
                };
                findMany: {
                    args: Prisma.PackageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload>[];
                };
                create: {
                    args: Prisma.PackageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload>;
                };
                createMany: {
                    args: Prisma.PackageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PackageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload>[];
                };
                delete: {
                    args: Prisma.PackageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload>;
                };
                update: {
                    args: Prisma.PackageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload>;
                };
                deleteMany: {
                    args: Prisma.PackageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PackageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PackageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload>[];
                };
                upsert: {
                    args: Prisma.PackageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PackagePayload>;
                };
                aggregate: {
                    args: Prisma.PackageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePackage>;
                };
                groupBy: {
                    args: Prisma.PackageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PackageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PackageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PackageCountAggregateOutputType> | number;
                };
            };
        };
        Membership: {
            payload: Prisma.$MembershipPayload<ExtArgs>;
            fields: Prisma.MembershipFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MembershipFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MembershipFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload>;
                };
                findFirst: {
                    args: Prisma.MembershipFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MembershipFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload>;
                };
                findMany: {
                    args: Prisma.MembershipFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload>[];
                };
                create: {
                    args: Prisma.MembershipCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload>;
                };
                createMany: {
                    args: Prisma.MembershipCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MembershipCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload>[];
                };
                delete: {
                    args: Prisma.MembershipDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload>;
                };
                update: {
                    args: Prisma.MembershipUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload>;
                };
                deleteMany: {
                    args: Prisma.MembershipDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MembershipUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MembershipUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload>[];
                };
                upsert: {
                    args: Prisma.MembershipUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MembershipPayload>;
                };
                aggregate: {
                    args: Prisma.MembershipAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMembership>;
                };
                groupBy: {
                    args: Prisma.MembershipGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MembershipGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MembershipCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MembershipCountAggregateOutputType> | number;
                };
            };
        };
        EntitlementLedger: {
            payload: Prisma.$EntitlementLedgerPayload<ExtArgs>;
            fields: Prisma.EntitlementLedgerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EntitlementLedgerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EntitlementLedgerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload>;
                };
                findFirst: {
                    args: Prisma.EntitlementLedgerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EntitlementLedgerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload>;
                };
                findMany: {
                    args: Prisma.EntitlementLedgerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload>[];
                };
                create: {
                    args: Prisma.EntitlementLedgerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload>;
                };
                createMany: {
                    args: Prisma.EntitlementLedgerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EntitlementLedgerCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload>[];
                };
                delete: {
                    args: Prisma.EntitlementLedgerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload>;
                };
                update: {
                    args: Prisma.EntitlementLedgerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload>;
                };
                deleteMany: {
                    args: Prisma.EntitlementLedgerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EntitlementLedgerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EntitlementLedgerUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload>[];
                };
                upsert: {
                    args: Prisma.EntitlementLedgerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EntitlementLedgerPayload>;
                };
                aggregate: {
                    args: Prisma.EntitlementLedgerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEntitlementLedger>;
                };
                groupBy: {
                    args: Prisma.EntitlementLedgerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EntitlementLedgerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EntitlementLedgerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EntitlementLedgerCountAggregateOutputType> | number;
                };
            };
        };
        Booking: {
            payload: Prisma.$BookingPayload<ExtArgs>;
            fields: Prisma.BookingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BookingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                findFirst: {
                    args: Prisma.BookingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                findMany: {
                    args: Prisma.BookingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>[];
                };
                create: {
                    args: Prisma.BookingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                createMany: {
                    args: Prisma.BookingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>[];
                };
                delete: {
                    args: Prisma.BookingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                update: {
                    args: Prisma.BookingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                deleteMany: {
                    args: Prisma.BookingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BookingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>[];
                };
                upsert: {
                    args: Prisma.BookingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BookingPayload>;
                };
                aggregate: {
                    args: Prisma.BookingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBooking>;
                };
                groupBy: {
                    args: Prisma.BookingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BookingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BookingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BookingCountAggregateOutputType> | number;
                };
            };
        };
        Payment: {
            payload: Prisma.$PaymentPayload<ExtArgs>;
            fields: Prisma.PaymentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PaymentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findFirst: {
                    args: Prisma.PaymentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findMany: {
                    args: Prisma.PaymentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                create: {
                    args: Prisma.PaymentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                createMany: {
                    args: Prisma.PaymentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                delete: {
                    args: Prisma.PaymentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                update: {
                    args: Prisma.PaymentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                deleteMany: {
                    args: Prisma.PaymentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PaymentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                upsert: {
                    args: Prisma.PaymentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                aggregate: {
                    args: Prisma.PaymentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePayment>;
                };
                groupBy: {
                    args: Prisma.PaymentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PaymentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentCountAggregateOutputType> | number;
                };
            };
        };
        Refund: {
            payload: Prisma.$RefundPayload<ExtArgs>;
            fields: Prisma.RefundFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RefundFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RefundFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload>;
                };
                findFirst: {
                    args: Prisma.RefundFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RefundFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload>;
                };
                findMany: {
                    args: Prisma.RefundFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload>[];
                };
                create: {
                    args: Prisma.RefundCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload>;
                };
                createMany: {
                    args: Prisma.RefundCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RefundCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload>[];
                };
                delete: {
                    args: Prisma.RefundDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload>;
                };
                update: {
                    args: Prisma.RefundUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload>;
                };
                deleteMany: {
                    args: Prisma.RefundDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RefundUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RefundUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload>[];
                };
                upsert: {
                    args: Prisma.RefundUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefundPayload>;
                };
                aggregate: {
                    args: Prisma.RefundAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRefund>;
                };
                groupBy: {
                    args: Prisma.RefundGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefundGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RefundCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefundCountAggregateOutputType> | number;
                };
            };
        };
        IncentiveRule: {
            payload: Prisma.$IncentiveRulePayload<ExtArgs>;
            fields: Prisma.IncentiveRuleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.IncentiveRuleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.IncentiveRuleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload>;
                };
                findFirst: {
                    args: Prisma.IncentiveRuleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.IncentiveRuleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload>;
                };
                findMany: {
                    args: Prisma.IncentiveRuleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload>[];
                };
                create: {
                    args: Prisma.IncentiveRuleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload>;
                };
                createMany: {
                    args: Prisma.IncentiveRuleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.IncentiveRuleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload>[];
                };
                delete: {
                    args: Prisma.IncentiveRuleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload>;
                };
                update: {
                    args: Prisma.IncentiveRuleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload>;
                };
                deleteMany: {
                    args: Prisma.IncentiveRuleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.IncentiveRuleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.IncentiveRuleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload>[];
                };
                upsert: {
                    args: Prisma.IncentiveRuleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRulePayload>;
                };
                aggregate: {
                    args: Prisma.IncentiveRuleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateIncentiveRule>;
                };
                groupBy: {
                    args: Prisma.IncentiveRuleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IncentiveRuleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.IncentiveRuleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IncentiveRuleCountAggregateOutputType> | number;
                };
            };
        };
        IncentiveRecord: {
            payload: Prisma.$IncentiveRecordPayload<ExtArgs>;
            fields: Prisma.IncentiveRecordFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.IncentiveRecordFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.IncentiveRecordFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload>;
                };
                findFirst: {
                    args: Prisma.IncentiveRecordFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.IncentiveRecordFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload>;
                };
                findMany: {
                    args: Prisma.IncentiveRecordFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload>[];
                };
                create: {
                    args: Prisma.IncentiveRecordCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload>;
                };
                createMany: {
                    args: Prisma.IncentiveRecordCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.IncentiveRecordCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload>[];
                };
                delete: {
                    args: Prisma.IncentiveRecordDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload>;
                };
                update: {
                    args: Prisma.IncentiveRecordUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload>;
                };
                deleteMany: {
                    args: Prisma.IncentiveRecordDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.IncentiveRecordUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.IncentiveRecordUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload>[];
                };
                upsert: {
                    args: Prisma.IncentiveRecordUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IncentiveRecordPayload>;
                };
                aggregate: {
                    args: Prisma.IncentiveRecordAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateIncentiveRecord>;
                };
                groupBy: {
                    args: Prisma.IncentiveRecordGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IncentiveRecordGroupByOutputType>[];
                };
                count: {
                    args: Prisma.IncentiveRecordCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IncentiveRecordCountAggregateOutputType> | number;
                };
            };
        };
        AuditLog: {
            payload: Prisma.$AuditLogPayload<ExtArgs>;
            fields: Prisma.AuditLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AuditLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findFirst: {
                    args: Prisma.AuditLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findMany: {
                    args: Prisma.AuditLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                create: {
                    args: Prisma.AuditLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                createMany: {
                    args: Prisma.AuditLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                delete: {
                    args: Prisma.AuditLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                update: {
                    args: Prisma.AuditLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                deleteMany: {
                    args: Prisma.AuditLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AuditLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                upsert: {
                    args: Prisma.AuditLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                aggregate: {
                    args: Prisma.AuditLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAuditLog>;
                };
                groupBy: {
                    args: Prisma.AuditLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AuditLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogCountAggregateOutputType> | number;
                };
            };
        };
        ImportBatch: {
            payload: Prisma.$ImportBatchPayload<ExtArgs>;
            fields: Prisma.ImportBatchFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ImportBatchFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ImportBatchFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                findFirst: {
                    args: Prisma.ImportBatchFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ImportBatchFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                findMany: {
                    args: Prisma.ImportBatchFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>[];
                };
                create: {
                    args: Prisma.ImportBatchCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                createMany: {
                    args: Prisma.ImportBatchCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ImportBatchCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>[];
                };
                delete: {
                    args: Prisma.ImportBatchDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                update: {
                    args: Prisma.ImportBatchUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                deleteMany: {
                    args: Prisma.ImportBatchDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ImportBatchUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ImportBatchUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>[];
                };
                upsert: {
                    args: Prisma.ImportBatchUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportBatchPayload>;
                };
                aggregate: {
                    args: Prisma.ImportBatchAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateImportBatch>;
                };
                groupBy: {
                    args: Prisma.ImportBatchGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ImportBatchGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ImportBatchCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ImportBatchCountAggregateOutputType> | number;
                };
            };
        };
        ImportStaging: {
            payload: Prisma.$ImportStagingPayload<ExtArgs>;
            fields: Prisma.ImportStagingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ImportStagingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ImportStagingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload>;
                };
                findFirst: {
                    args: Prisma.ImportStagingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ImportStagingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload>;
                };
                findMany: {
                    args: Prisma.ImportStagingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload>[];
                };
                create: {
                    args: Prisma.ImportStagingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload>;
                };
                createMany: {
                    args: Prisma.ImportStagingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ImportStagingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload>[];
                };
                delete: {
                    args: Prisma.ImportStagingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload>;
                };
                update: {
                    args: Prisma.ImportStagingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload>;
                };
                deleteMany: {
                    args: Prisma.ImportStagingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ImportStagingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ImportStagingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload>[];
                };
                upsert: {
                    args: Prisma.ImportStagingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ImportStagingPayload>;
                };
                aggregate: {
                    args: Prisma.ImportStagingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateImportStaging>;
                };
                groupBy: {
                    args: Prisma.ImportStagingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ImportStagingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ImportStagingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ImportStagingCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: any;
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly name: "name";
    readonly role: "role";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly managerId: "managerId";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly membershipId: "membershipId";
    readonly name: "name";
    readonly phone: "phone";
    readonly email: "email";
    readonly plan: "plan";
    readonly amount: "amount";
    readonly amountPaid: "amountPaid";
    readonly pendingAmount: "pendingAmount";
    readonly validity: "validity";
    readonly totalDays: "totalDays";
    readonly totalNights: "totalNights";
    readonly status: "status";
    readonly assignedExecId: "assignedExecId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const PackageScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly price: "price";
    readonly days: "days";
    readonly nights: "nights";
    readonly validityMonths: "validityMonths";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PackageScalarFieldEnum = (typeof PackageScalarFieldEnum)[keyof typeof PackageScalarFieldEnum];
export declare const MembershipScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly packageId: "packageId";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MembershipScalarFieldEnum = (typeof MembershipScalarFieldEnum)[keyof typeof MembershipScalarFieldEnum];
export declare const EntitlementLedgerScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly membershipId: "membershipId";
    readonly type: "type";
    readonly days: "days";
    readonly nights: "nights";
    readonly description: "description";
    readonly date: "date";
};
export type EntitlementLedgerScalarFieldEnum = (typeof EntitlementLedgerScalarFieldEnum)[keyof typeof EntitlementLedgerScalarFieldEnum];
export declare const BookingScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly membershipId: "membershipId";
    readonly checkIn: "checkIn";
    readonly checkOut: "checkOut";
    readonly daysUsed: "daysUsed";
    readonly nightsUsed: "nightsUsed";
    readonly status: "status";
    readonly notes: "notes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly amount: "amount";
    readonly method: "method";
    readonly date: "date";
    readonly notes: "notes";
    readonly createdAt: "createdAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const RefundScalarFieldEnum: {
    readonly id: "id";
    readonly customerId: "customerId";
    readonly amount: "amount";
    readonly date: "date";
    readonly reason: "reason";
    readonly approvedById: "approvedById";
    readonly createdAt: "createdAt";
};
export type RefundScalarFieldEnum = (typeof RefundScalarFieldEnum)[keyof typeof RefundScalarFieldEnum];
export declare const IncentiveRuleScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly minSales: "minSales";
    readonly maxSales: "maxSales";
    readonly percentage: "percentage";
    readonly effectiveFrom: "effectiveFrom";
    readonly effectiveTo: "effectiveTo";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type IncentiveRuleScalarFieldEnum = (typeof IncentiveRuleScalarFieldEnum)[keyof typeof IncentiveRuleScalarFieldEnum];
export declare const IncentiveRecordScalarFieldEnum: {
    readonly id: "id";
    readonly executiveId: "executiveId";
    readonly period: "period";
    readonly totalSales: "totalSales";
    readonly eligibleSales: "eligibleSales";
    readonly incentiveEarned: "incentiveEarned";
    readonly incentivePaid: "incentivePaid";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type IncentiveRecordScalarFieldEnum = (typeof IncentiveRecordScalarFieldEnum)[keyof typeof IncentiveRecordScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly actorId: "actorId";
    readonly action: "action";
    readonly entity: "entity";
    readonly entityId: "entityId";
    readonly metadata: "metadata";
    readonly timestamp: "timestamp";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const ImportBatchScalarFieldEnum: {
    readonly id: "id";
    readonly fileName: "fileName";
    readonly status: "status";
    readonly totalRows: "totalRows";
    readonly validRows: "validRows";
    readonly importedRows: "importedRows";
    readonly uploadedById: "uploadedById";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ImportBatchScalarFieldEnum = (typeof ImportBatchScalarFieldEnum)[keyof typeof ImportBatchScalarFieldEnum];
export declare const ImportStagingScalarFieldEnum: {
    readonly id: "id";
    readonly batchId: "batchId";
    readonly rowNumber: "rowNumber";
    readonly rawData: "rawData";
    readonly validationErrors: "validationErrors";
    readonly mappedData: "mappedData";
    readonly importStatus: "importStatus";
    readonly createdAt: "createdAt";
};
export type ImportStagingScalarFieldEnum = (typeof ImportStagingScalarFieldEnum)[keyof typeof ImportStagingScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>;
export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type EnumCustomerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CustomerStatus'>;
export type ListEnumCustomerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CustomerStatus[]'>;
export type EnumMembershipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MembershipStatus'>;
export type ListEnumMembershipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MembershipStatus[]'>;
export type EnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus'>;
export type ListEnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus[]'>;
export type EnumIncentiveStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IncentiveStatus'>;
export type ListEnumIncentiveStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IncentiveStatus[]'>;
export type EnumImportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImportStatus'>;
export type ListEnumImportStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImportStatus[]'>;
export type EnumImportRowStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImportRowStatus'>;
export type ListEnumImportRowStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImportRowStatus[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientBaseOptions {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
}
export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
    accelerateUrl: string;
    adapter?: never;
}
export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
}
export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter;
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    customer?: Prisma.CustomerOmit;
    package?: Prisma.PackageOmit;
    membership?: Prisma.MembershipOmit;
    entitlementLedger?: Prisma.EntitlementLedgerOmit;
    booking?: Prisma.BookingOmit;
    payment?: Prisma.PaymentOmit;
    refund?: Prisma.RefundOmit;
    incentiveRule?: Prisma.IncentiveRuleOmit;
    incentiveRecord?: Prisma.IncentiveRecordOmit;
    auditLog?: Prisma.AuditLogOmit;
    importBatch?: Prisma.ImportBatchOmit;
    importStaging?: Prisma.ImportStagingOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
