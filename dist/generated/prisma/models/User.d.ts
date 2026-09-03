import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    passwordHash: string | null;
    name: string | null;
    role: $Enums.Role | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    managerId: string | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    passwordHash: string | null;
    name: string | null;
    role: $Enums.Role | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    managerId: string | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    passwordHash: number;
    name: number;
    role: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    managerId: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    name?: true;
    role?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    managerId?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    name?: true;
    role?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    managerId?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    name?: true;
    role?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    managerId?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    managerId: string | null;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    name?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    managerId?: Prisma.StringNullableFilter<"User"> | string | null;
    manager?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    executives?: Prisma.UserListRelationFilter;
    customers?: Prisma.CustomerListRelationFilter;
    incentiveRecords?: Prisma.IncentiveRecordListRelationFilter;
    approvedRefunds?: Prisma.RefundListRelationFilter;
    auditLogs?: Prisma.AuditLogListRelationFilter;
    importBatches?: Prisma.ImportBatchListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    managerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    manager?: Prisma.UserOrderByWithRelationInput;
    executives?: Prisma.UserOrderByRelationAggregateInput;
    customers?: Prisma.CustomerOrderByRelationAggregateInput;
    incentiveRecords?: Prisma.IncentiveRecordOrderByRelationAggregateInput;
    approvedRefunds?: Prisma.RefundOrderByRelationAggregateInput;
    auditLogs?: Prisma.AuditLogOrderByRelationAggregateInput;
    importBatches?: Prisma.ImportBatchOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    passwordHash?: Prisma.StringFilter<"User"> | string;
    name?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    managerId?: Prisma.StringNullableFilter<"User"> | string | null;
    manager?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    executives?: Prisma.UserListRelationFilter;
    customers?: Prisma.CustomerListRelationFilter;
    incentiveRecords?: Prisma.IncentiveRecordListRelationFilter;
    approvedRefunds?: Prisma.RefundListRelationFilter;
    auditLogs?: Prisma.AuditLogListRelationFilter;
    importBatches?: Prisma.ImportBatchListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    managerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    name?: Prisma.StringWithAggregatesFilter<"User"> | string;
    role?: Prisma.EnumRoleWithAggregatesFilter<"User"> | $Enums.Role;
    isActive?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    managerId?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
};
export type UserCreateInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutExecutivesInput;
    executives?: Prisma.UserCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchCreateNestedManyWithoutUploadedByInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    managerId?: string | null;
    executives?: Prisma.UserUncheckedCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundUncheckedCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchUncheckedCreateNestedManyWithoutUploadedByInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutExecutivesNestedInput;
    executives?: Prisma.UserUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUpdateManyWithoutUploadedByNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    executives?: Prisma.UserUncheckedUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUncheckedUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUncheckedUpdateManyWithoutUploadedByNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    managerId?: string | null;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type UserListRelationFilter = {
    every?: Prisma.UserWhereInput;
    some?: Prisma.UserWhereInput;
    none?: Prisma.UserWhereInput;
};
export type UserOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    managerId?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    managerId?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    managerId?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserCreateNestedOneWithoutExecutivesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutExecutivesInput, Prisma.UserUncheckedCreateWithoutExecutivesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutExecutivesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserCreateNestedManyWithoutManagerInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutManagerInput, Prisma.UserUncheckedCreateWithoutManagerInput> | Prisma.UserCreateWithoutManagerInput[] | Prisma.UserUncheckedCreateWithoutManagerInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutManagerInput | Prisma.UserCreateOrConnectWithoutManagerInput[];
    createMany?: Prisma.UserCreateManyManagerInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type UserUncheckedCreateNestedManyWithoutManagerInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutManagerInput, Prisma.UserUncheckedCreateWithoutManagerInput> | Prisma.UserCreateWithoutManagerInput[] | Prisma.UserUncheckedCreateWithoutManagerInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutManagerInput | Prisma.UserCreateOrConnectWithoutManagerInput[];
    createMany?: Prisma.UserCreateManyManagerInputEnvelope;
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserUpdateOneWithoutExecutivesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutExecutivesInput, Prisma.UserUncheckedCreateWithoutExecutivesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutExecutivesInput;
    upsert?: Prisma.UserUpsertWithoutExecutivesInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutExecutivesInput, Prisma.UserUpdateWithoutExecutivesInput>, Prisma.UserUncheckedUpdateWithoutExecutivesInput>;
};
export type UserUpdateManyWithoutManagerNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutManagerInput, Prisma.UserUncheckedCreateWithoutManagerInput> | Prisma.UserCreateWithoutManagerInput[] | Prisma.UserUncheckedCreateWithoutManagerInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutManagerInput | Prisma.UserCreateOrConnectWithoutManagerInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutManagerInput | Prisma.UserUpsertWithWhereUniqueWithoutManagerInput[];
    createMany?: Prisma.UserCreateManyManagerInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutManagerInput | Prisma.UserUpdateWithWhereUniqueWithoutManagerInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutManagerInput | Prisma.UserUpdateManyWithWhereWithoutManagerInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type UserUncheckedUpdateManyWithoutManagerNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutManagerInput, Prisma.UserUncheckedCreateWithoutManagerInput> | Prisma.UserCreateWithoutManagerInput[] | Prisma.UserUncheckedCreateWithoutManagerInput[];
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutManagerInput | Prisma.UserCreateOrConnectWithoutManagerInput[];
    upsert?: Prisma.UserUpsertWithWhereUniqueWithoutManagerInput | Prisma.UserUpsertWithWhereUniqueWithoutManagerInput[];
    createMany?: Prisma.UserCreateManyManagerInputEnvelope;
    set?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    disconnect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    delete?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    connect?: Prisma.UserWhereUniqueInput | Prisma.UserWhereUniqueInput[];
    update?: Prisma.UserUpdateWithWhereUniqueWithoutManagerInput | Prisma.UserUpdateWithWhereUniqueWithoutManagerInput[];
    updateMany?: Prisma.UserUpdateManyWithWhereWithoutManagerInput | Prisma.UserUpdateManyWithWhereWithoutManagerInput[];
    deleteMany?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
};
export type UserCreateNestedOneWithoutCustomersInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCustomersInput, Prisma.UserUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCustomersInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutCustomersNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCustomersInput, Prisma.UserUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCustomersInput;
    upsert?: Prisma.UserUpsertWithoutCustomersInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCustomersInput, Prisma.UserUpdateWithoutCustomersInput>, Prisma.UserUncheckedUpdateWithoutCustomersInput>;
};
export type UserCreateNestedOneWithoutApprovedRefundsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutApprovedRefundsInput, Prisma.UserUncheckedCreateWithoutApprovedRefundsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutApprovedRefundsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutApprovedRefundsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutApprovedRefundsInput, Prisma.UserUncheckedCreateWithoutApprovedRefundsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutApprovedRefundsInput;
    upsert?: Prisma.UserUpsertWithoutApprovedRefundsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutApprovedRefundsInput, Prisma.UserUpdateWithoutApprovedRefundsInput>, Prisma.UserUncheckedUpdateWithoutApprovedRefundsInput>;
};
export type UserCreateNestedOneWithoutIncentiveRecordsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutIncentiveRecordsInput, Prisma.UserUncheckedCreateWithoutIncentiveRecordsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutIncentiveRecordsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutIncentiveRecordsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutIncentiveRecordsInput, Prisma.UserUncheckedCreateWithoutIncentiveRecordsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutIncentiveRecordsInput;
    upsert?: Prisma.UserUpsertWithoutIncentiveRecordsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutIncentiveRecordsInput, Prisma.UserUpdateWithoutIncentiveRecordsInput>, Prisma.UserUncheckedUpdateWithoutIncentiveRecordsInput>;
};
export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuditLogsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuditLogsInput;
    upsert?: Prisma.UserUpsertWithoutAuditLogsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAuditLogsInput, Prisma.UserUpdateWithoutAuditLogsInput>, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
};
export type UserCreateNestedOneWithoutImportBatchesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutImportBatchesInput, Prisma.UserUncheckedCreateWithoutImportBatchesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutImportBatchesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutImportBatchesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutImportBatchesInput, Prisma.UserUncheckedCreateWithoutImportBatchesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutImportBatchesInput;
    upsert?: Prisma.UserUpsertWithoutImportBatchesInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutImportBatchesInput, Prisma.UserUpdateWithoutImportBatchesInput>, Prisma.UserUncheckedUpdateWithoutImportBatchesInput>;
};
export type UserCreateWithoutExecutivesInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutExecutivesInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchCreateNestedManyWithoutUploadedByInput;
};
export type UserUncheckedCreateWithoutExecutivesInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    managerId?: string | null;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundUncheckedCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchUncheckedCreateNestedManyWithoutUploadedByInput;
};
export type UserCreateOrConnectWithoutExecutivesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutExecutivesInput, Prisma.UserUncheckedCreateWithoutExecutivesInput>;
};
export type UserCreateWithoutManagerInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    executives?: Prisma.UserCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchCreateNestedManyWithoutUploadedByInput;
};
export type UserUncheckedCreateWithoutManagerInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    executives?: Prisma.UserUncheckedCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundUncheckedCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchUncheckedCreateNestedManyWithoutUploadedByInput;
};
export type UserCreateOrConnectWithoutManagerInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutManagerInput, Prisma.UserUncheckedCreateWithoutManagerInput>;
};
export type UserCreateManyManagerInputEnvelope = {
    data: Prisma.UserCreateManyManagerInput | Prisma.UserCreateManyManagerInput[];
    skipDuplicates?: boolean;
};
export type UserUpsertWithoutExecutivesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutExecutivesInput, Prisma.UserUncheckedUpdateWithoutExecutivesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutExecutivesInput, Prisma.UserUncheckedCreateWithoutExecutivesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutExecutivesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutExecutivesInput, Prisma.UserUncheckedUpdateWithoutExecutivesInput>;
};
export type UserUpdateWithoutExecutivesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutExecutivesNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUpdateManyWithoutUploadedByNestedInput;
};
export type UserUncheckedUpdateWithoutExecutivesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUncheckedUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUncheckedUpdateManyWithoutUploadedByNestedInput;
};
export type UserUpsertWithWhereUniqueWithoutManagerInput = {
    where: Prisma.UserWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserUpdateWithoutManagerInput, Prisma.UserUncheckedUpdateWithoutManagerInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutManagerInput, Prisma.UserUncheckedCreateWithoutManagerInput>;
};
export type UserUpdateWithWhereUniqueWithoutManagerInput = {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutManagerInput, Prisma.UserUncheckedUpdateWithoutManagerInput>;
};
export type UserUpdateManyWithWhereWithoutManagerInput = {
    where: Prisma.UserScalarWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyWithoutManagerInput>;
};
export type UserScalarWhereInput = {
    AND?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    OR?: Prisma.UserScalarWhereInput[];
    NOT?: Prisma.UserScalarWhereInput | Prisma.UserScalarWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    name?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumRoleFilter<"User"> | $Enums.Role;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    managerId?: Prisma.StringNullableFilter<"User"> | string | null;
};
export type UserCreateWithoutCustomersInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutExecutivesInput;
    executives?: Prisma.UserCreateNestedManyWithoutManagerInput;
    incentiveRecords?: Prisma.IncentiveRecordCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchCreateNestedManyWithoutUploadedByInput;
};
export type UserUncheckedCreateWithoutCustomersInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    managerId?: string | null;
    executives?: Prisma.UserUncheckedCreateNestedManyWithoutManagerInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundUncheckedCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchUncheckedCreateNestedManyWithoutUploadedByInput;
};
export type UserCreateOrConnectWithoutCustomersInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCustomersInput, Prisma.UserUncheckedCreateWithoutCustomersInput>;
};
export type UserUpsertWithoutCustomersInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCustomersInput, Prisma.UserUncheckedUpdateWithoutCustomersInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCustomersInput, Prisma.UserUncheckedCreateWithoutCustomersInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCustomersInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCustomersInput, Prisma.UserUncheckedUpdateWithoutCustomersInput>;
};
export type UserUpdateWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutExecutivesNestedInput;
    executives?: Prisma.UserUpdateManyWithoutManagerNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUpdateManyWithoutUploadedByNestedInput;
};
export type UserUncheckedUpdateWithoutCustomersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    executives?: Prisma.UserUncheckedUpdateManyWithoutManagerNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUncheckedUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUncheckedUpdateManyWithoutUploadedByNestedInput;
};
export type UserCreateWithoutApprovedRefundsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutExecutivesInput;
    executives?: Prisma.UserCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordCreateNestedManyWithoutExecutiveInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchCreateNestedManyWithoutUploadedByInput;
};
export type UserUncheckedCreateWithoutApprovedRefundsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    managerId?: string | null;
    executives?: Prisma.UserUncheckedCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedCreateNestedManyWithoutExecutiveInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchUncheckedCreateNestedManyWithoutUploadedByInput;
};
export type UserCreateOrConnectWithoutApprovedRefundsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutApprovedRefundsInput, Prisma.UserUncheckedCreateWithoutApprovedRefundsInput>;
};
export type UserUpsertWithoutApprovedRefundsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutApprovedRefundsInput, Prisma.UserUncheckedUpdateWithoutApprovedRefundsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutApprovedRefundsInput, Prisma.UserUncheckedCreateWithoutApprovedRefundsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutApprovedRefundsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutApprovedRefundsInput, Prisma.UserUncheckedUpdateWithoutApprovedRefundsInput>;
};
export type UserUpdateWithoutApprovedRefundsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutExecutivesNestedInput;
    executives?: Prisma.UserUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUpdateManyWithoutExecutiveNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUpdateManyWithoutUploadedByNestedInput;
};
export type UserUncheckedUpdateWithoutApprovedRefundsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    executives?: Prisma.UserUncheckedUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedUpdateManyWithoutExecutiveNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUncheckedUpdateManyWithoutUploadedByNestedInput;
};
export type UserCreateWithoutIncentiveRecordsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutExecutivesInput;
    executives?: Prisma.UserCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutAssignedExecInput;
    approvedRefunds?: Prisma.RefundCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchCreateNestedManyWithoutUploadedByInput;
};
export type UserUncheckedCreateWithoutIncentiveRecordsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    managerId?: string | null;
    executives?: Prisma.UserUncheckedCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutAssignedExecInput;
    approvedRefunds?: Prisma.RefundUncheckedCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
    importBatches?: Prisma.ImportBatchUncheckedCreateNestedManyWithoutUploadedByInput;
};
export type UserCreateOrConnectWithoutIncentiveRecordsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutIncentiveRecordsInput, Prisma.UserUncheckedCreateWithoutIncentiveRecordsInput>;
};
export type UserUpsertWithoutIncentiveRecordsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutIncentiveRecordsInput, Prisma.UserUncheckedUpdateWithoutIncentiveRecordsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutIncentiveRecordsInput, Prisma.UserUncheckedCreateWithoutIncentiveRecordsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutIncentiveRecordsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutIncentiveRecordsInput, Prisma.UserUncheckedUpdateWithoutIncentiveRecordsInput>;
};
export type UserUpdateWithoutIncentiveRecordsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutExecutivesNestedInput;
    executives?: Prisma.UserUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutAssignedExecNestedInput;
    approvedRefunds?: Prisma.RefundUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUpdateManyWithoutUploadedByNestedInput;
};
export type UserUncheckedUpdateWithoutIncentiveRecordsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    executives?: Prisma.UserUncheckedUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutAssignedExecNestedInput;
    approvedRefunds?: Prisma.RefundUncheckedUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUncheckedUpdateManyWithoutUploadedByNestedInput;
};
export type UserCreateWithoutAuditLogsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutExecutivesInput;
    executives?: Prisma.UserCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundCreateNestedManyWithoutApprovedByInput;
    importBatches?: Prisma.ImportBatchCreateNestedManyWithoutUploadedByInput;
};
export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    managerId?: string | null;
    executives?: Prisma.UserUncheckedCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundUncheckedCreateNestedManyWithoutApprovedByInput;
    importBatches?: Prisma.ImportBatchUncheckedCreateNestedManyWithoutUploadedByInput;
};
export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
};
export type UserUpsertWithoutAuditLogsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAuditLogsInput, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuditLogsInput, Prisma.UserUncheckedCreateWithoutAuditLogsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAuditLogsInput, Prisma.UserUncheckedUpdateWithoutAuditLogsInput>;
};
export type UserUpdateWithoutAuditLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutExecutivesNestedInput;
    executives?: Prisma.UserUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUpdateManyWithoutApprovedByNestedInput;
    importBatches?: Prisma.ImportBatchUpdateManyWithoutUploadedByNestedInput;
};
export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    executives?: Prisma.UserUncheckedUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUncheckedUpdateManyWithoutApprovedByNestedInput;
    importBatches?: Prisma.ImportBatchUncheckedUpdateManyWithoutUploadedByNestedInput;
};
export type UserCreateWithoutImportBatchesInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    manager?: Prisma.UserCreateNestedOneWithoutExecutivesInput;
    executives?: Prisma.UserCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogCreateNestedManyWithoutActorInput;
};
export type UserUncheckedCreateWithoutImportBatchesInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    managerId?: string | null;
    executives?: Prisma.UserUncheckedCreateNestedManyWithoutManagerInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutAssignedExecInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedCreateNestedManyWithoutExecutiveInput;
    approvedRefunds?: Prisma.RefundUncheckedCreateNestedManyWithoutApprovedByInput;
    auditLogs?: Prisma.AuditLogUncheckedCreateNestedManyWithoutActorInput;
};
export type UserCreateOrConnectWithoutImportBatchesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutImportBatchesInput, Prisma.UserUncheckedCreateWithoutImportBatchesInput>;
};
export type UserUpsertWithoutImportBatchesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutImportBatchesInput, Prisma.UserUncheckedUpdateWithoutImportBatchesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutImportBatchesInput, Prisma.UserUncheckedCreateWithoutImportBatchesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutImportBatchesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutImportBatchesInput, Prisma.UserUncheckedUpdateWithoutImportBatchesInput>;
};
export type UserUpdateWithoutImportBatchesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    manager?: Prisma.UserUpdateOneWithoutExecutivesNestedInput;
    executives?: Prisma.UserUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
};
export type UserUncheckedUpdateWithoutImportBatchesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    managerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    executives?: Prisma.UserUncheckedUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUncheckedUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
};
export type UserCreateManyManagerInput = {
    id?: string;
    email: string;
    passwordHash: string;
    name: string;
    role: $Enums.Role;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateWithoutManagerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    executives?: Prisma.UserUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUpdateManyWithoutUploadedByNestedInput;
};
export type UserUncheckedUpdateWithoutManagerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    executives?: Prisma.UserUncheckedUpdateManyWithoutManagerNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutAssignedExecNestedInput;
    incentiveRecords?: Prisma.IncentiveRecordUncheckedUpdateManyWithoutExecutiveNestedInput;
    approvedRefunds?: Prisma.RefundUncheckedUpdateManyWithoutApprovedByNestedInput;
    auditLogs?: Prisma.AuditLogUncheckedUpdateManyWithoutActorNestedInput;
    importBatches?: Prisma.ImportBatchUncheckedUpdateManyWithoutUploadedByNestedInput;
};
export type UserUncheckedUpdateManyWithoutManagerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOutputType = {
    executives: number;
    customers: number;
    incentiveRecords: number;
    approvedRefunds: number;
    auditLogs: number;
    importBatches: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    executives?: boolean | UserCountOutputTypeCountExecutivesArgs;
    customers?: boolean | UserCountOutputTypeCountCustomersArgs;
    incentiveRecords?: boolean | UserCountOutputTypeCountIncentiveRecordsArgs;
    approvedRefunds?: boolean | UserCountOutputTypeCountApprovedRefundsArgs;
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs;
    importBatches?: boolean | UserCountOutputTypeCountImportBatchesArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountExecutivesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type UserCountOutputTypeCountCustomersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerWhereInput;
};
export type UserCountOutputTypeCountIncentiveRecordsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IncentiveRecordWhereInput;
};
export type UserCountOutputTypeCountApprovedRefundsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefundWhereInput;
};
export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuditLogWhereInput;
};
export type UserCountOutputTypeCountImportBatchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportBatchWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    name?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    managerId?: boolean;
    manager?: boolean | Prisma.User$managerArgs<ExtArgs>;
    executives?: boolean | Prisma.User$executivesArgs<ExtArgs>;
    customers?: boolean | Prisma.User$customersArgs<ExtArgs>;
    incentiveRecords?: boolean | Prisma.User$incentiveRecordsArgs<ExtArgs>;
    approvedRefunds?: boolean | Prisma.User$approvedRefundsArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.User$auditLogsArgs<ExtArgs>;
    importBatches?: boolean | Prisma.User$importBatchesArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    name?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    managerId?: boolean;
    manager?: boolean | Prisma.User$managerArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    name?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    managerId?: boolean;
    manager?: boolean | Prisma.User$managerArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    name?: boolean;
    role?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    managerId?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "passwordHash" | "name" | "role" | "isActive" | "createdAt" | "updatedAt" | "managerId", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    manager?: boolean | Prisma.User$managerArgs<ExtArgs>;
    executives?: boolean | Prisma.User$executivesArgs<ExtArgs>;
    customers?: boolean | Prisma.User$customersArgs<ExtArgs>;
    incentiveRecords?: boolean | Prisma.User$incentiveRecordsArgs<ExtArgs>;
    approvedRefunds?: boolean | Prisma.User$approvedRefundsArgs<ExtArgs>;
    auditLogs?: boolean | Prisma.User$auditLogsArgs<ExtArgs>;
    importBatches?: boolean | Prisma.User$importBatchesArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    manager?: boolean | Prisma.User$managerArgs<ExtArgs>;
};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    manager?: boolean | Prisma.User$managerArgs<ExtArgs>;
};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        manager: Prisma.$UserPayload<ExtArgs> | null;
        executives: Prisma.$UserPayload<ExtArgs>[];
        customers: Prisma.$CustomerPayload<ExtArgs>[];
        incentiveRecords: Prisma.$IncentiveRecordPayload<ExtArgs>[];
        approvedRefunds: Prisma.$RefundPayload<ExtArgs>[];
        auditLogs: Prisma.$AuditLogPayload<ExtArgs>[];
        importBatches: Prisma.$ImportBatchPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        role: $Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        managerId: string | null;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    manager<T extends Prisma.User$managerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$managerArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    executives<T extends Prisma.User$executivesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$executivesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    customers<T extends Prisma.User$customersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$customersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    incentiveRecords<T extends Prisma.User$incentiveRecordsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$incentiveRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    approvedRefunds<T extends Prisma.User$approvedRefundsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$approvedRefundsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    auditLogs<T extends Prisma.User$auditLogsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    importBatches<T extends Prisma.User$importBatchesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$importBatchesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'Role'>;
    readonly isActive: Prisma.FieldRef<"User", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly managerId: Prisma.FieldRef<"User", 'String'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
    include?: Prisma.UserIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$managerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type User$executivesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type User$customersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithRelationInput | Prisma.CustomerOrderByWithRelationInput[];
    cursor?: Prisma.CustomerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerScalarFieldEnum | Prisma.CustomerScalarFieldEnum[];
};
export type User$incentiveRecordsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    include?: Prisma.IncentiveRecordInclude<ExtArgs> | null;
    where?: Prisma.IncentiveRecordWhereInput;
    orderBy?: Prisma.IncentiveRecordOrderByWithRelationInput | Prisma.IncentiveRecordOrderByWithRelationInput[];
    cursor?: Prisma.IncentiveRecordWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IncentiveRecordScalarFieldEnum | Prisma.IncentiveRecordScalarFieldEnum[];
};
export type User$approvedRefundsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelect<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    include?: Prisma.RefundInclude<ExtArgs> | null;
    where?: Prisma.RefundWhereInput;
    orderBy?: Prisma.RefundOrderByWithRelationInput | Prisma.RefundOrderByWithRelationInput[];
    cursor?: Prisma.RefundWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RefundScalarFieldEnum | Prisma.RefundScalarFieldEnum[];
};
export type User$auditLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuditLogSelect<ExtArgs> | null;
    omit?: Prisma.AuditLogOmit<ExtArgs> | null;
    include?: Prisma.AuditLogInclude<ExtArgs> | null;
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput | Prisma.AuditLogOrderByWithRelationInput[];
    cursor?: Prisma.AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuditLogScalarFieldEnum | Prisma.AuditLogScalarFieldEnum[];
};
export type User$importBatchesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where?: Prisma.ImportBatchWhereInput;
    orderBy?: Prisma.ImportBatchOrderByWithRelationInput | Prisma.ImportBatchOrderByWithRelationInput[];
    cursor?: Prisma.ImportBatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ImportBatchScalarFieldEnum | Prisma.ImportBatchScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
