import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MembershipModel = runtime.Types.Result.DefaultSelection<Prisma.$MembershipPayload>;
export type AggregateMembership = {
    _count: MembershipCountAggregateOutputType | null;
    _min: MembershipMinAggregateOutputType | null;
    _max: MembershipMaxAggregateOutputType | null;
};
export type MembershipMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    packageId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    status: $Enums.MembershipStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MembershipMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    packageId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    status: $Enums.MembershipStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MembershipCountAggregateOutputType = {
    id: number;
    customerId: number;
    packageId: number;
    startDate: number;
    endDate: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type MembershipMinAggregateInputType = {
    id?: true;
    customerId?: true;
    packageId?: true;
    startDate?: true;
    endDate?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MembershipMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    packageId?: true;
    startDate?: true;
    endDate?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MembershipCountAggregateInputType = {
    id?: true;
    customerId?: true;
    packageId?: true;
    startDate?: true;
    endDate?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type MembershipAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MembershipWhereInput;
    orderBy?: Prisma.MembershipOrderByWithRelationInput | Prisma.MembershipOrderByWithRelationInput[];
    cursor?: Prisma.MembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MembershipCountAggregateInputType;
    _min?: MembershipMinAggregateInputType;
    _max?: MembershipMaxAggregateInputType;
};
export type GetMembershipAggregateType<T extends MembershipAggregateArgs> = {
    [P in keyof T & keyof AggregateMembership]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMembership[P]> : Prisma.GetScalarType<T[P], AggregateMembership[P]>;
};
export type MembershipGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MembershipWhereInput;
    orderBy?: Prisma.MembershipOrderByWithAggregationInput | Prisma.MembershipOrderByWithAggregationInput[];
    by: Prisma.MembershipScalarFieldEnum[] | Prisma.MembershipScalarFieldEnum;
    having?: Prisma.MembershipScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MembershipCountAggregateInputType | true;
    _min?: MembershipMinAggregateInputType;
    _max?: MembershipMaxAggregateInputType;
};
export type MembershipGroupByOutputType = {
    id: string;
    customerId: string;
    packageId: string | null;
    startDate: Date;
    endDate: Date | null;
    status: $Enums.MembershipStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: MembershipCountAggregateOutputType | null;
    _min: MembershipMinAggregateOutputType | null;
    _max: MembershipMaxAggregateOutputType | null;
};
export type GetMembershipGroupByPayload<T extends MembershipGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MembershipGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MembershipGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MembershipGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MembershipGroupByOutputType[P]>;
}>>;
export type MembershipWhereInput = {
    AND?: Prisma.MembershipWhereInput | Prisma.MembershipWhereInput[];
    OR?: Prisma.MembershipWhereInput[];
    NOT?: Prisma.MembershipWhereInput | Prisma.MembershipWhereInput[];
    id?: Prisma.StringFilter<"Membership"> | string;
    customerId?: Prisma.StringFilter<"Membership"> | string;
    packageId?: Prisma.StringNullableFilter<"Membership"> | string | null;
    startDate?: Prisma.DateTimeFilter<"Membership"> | Date | string;
    endDate?: Prisma.DateTimeNullableFilter<"Membership"> | Date | string | null;
    status?: Prisma.EnumMembershipStatusFilter<"Membership"> | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFilter<"Membership"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Membership"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    package?: Prisma.XOR<Prisma.PackageNullableScalarRelationFilter, Prisma.PackageWhereInput> | null;
    entitlementLog?: Prisma.EntitlementLedgerListRelationFilter;
    bookings?: Prisma.BookingListRelationFilter;
};
export type MembershipOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    packageId?: Prisma.SortOrderInput | Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    package?: Prisma.PackageOrderByWithRelationInput;
    entitlementLog?: Prisma.EntitlementLedgerOrderByRelationAggregateInput;
    bookings?: Prisma.BookingOrderByRelationAggregateInput;
};
export type MembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MembershipWhereInput | Prisma.MembershipWhereInput[];
    OR?: Prisma.MembershipWhereInput[];
    NOT?: Prisma.MembershipWhereInput | Prisma.MembershipWhereInput[];
    customerId?: Prisma.StringFilter<"Membership"> | string;
    packageId?: Prisma.StringNullableFilter<"Membership"> | string | null;
    startDate?: Prisma.DateTimeFilter<"Membership"> | Date | string;
    endDate?: Prisma.DateTimeNullableFilter<"Membership"> | Date | string | null;
    status?: Prisma.EnumMembershipStatusFilter<"Membership"> | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFilter<"Membership"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Membership"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    package?: Prisma.XOR<Prisma.PackageNullableScalarRelationFilter, Prisma.PackageWhereInput> | null;
    entitlementLog?: Prisma.EntitlementLedgerListRelationFilter;
    bookings?: Prisma.BookingListRelationFilter;
}, "id">;
export type MembershipOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    packageId?: Prisma.SortOrderInput | Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MembershipCountOrderByAggregateInput;
    _max?: Prisma.MembershipMaxOrderByAggregateInput;
    _min?: Prisma.MembershipMinOrderByAggregateInput;
};
export type MembershipScalarWhereWithAggregatesInput = {
    AND?: Prisma.MembershipScalarWhereWithAggregatesInput | Prisma.MembershipScalarWhereWithAggregatesInput[];
    OR?: Prisma.MembershipScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MembershipScalarWhereWithAggregatesInput | Prisma.MembershipScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Membership"> | string;
    customerId?: Prisma.StringWithAggregatesFilter<"Membership"> | string;
    packageId?: Prisma.StringNullableWithAggregatesFilter<"Membership"> | string | null;
    startDate?: Prisma.DateTimeWithAggregatesFilter<"Membership"> | Date | string;
    endDate?: Prisma.DateTimeNullableWithAggregatesFilter<"Membership"> | Date | string | null;
    status?: Prisma.EnumMembershipStatusWithAggregatesFilter<"Membership"> | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Membership"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Membership"> | Date | string;
};
export type MembershipCreateInput = {
    id?: string;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutMembershipsInput;
    package?: Prisma.PackageCreateNestedOneWithoutMembershipsInput;
    entitlementLog?: Prisma.EntitlementLedgerCreateNestedManyWithoutMembershipInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutMembershipInput;
};
export type MembershipUncheckedCreateInput = {
    id?: string;
    customerId: string;
    packageId?: string | null;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    entitlementLog?: Prisma.EntitlementLedgerUncheckedCreateNestedManyWithoutMembershipInput;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutMembershipInput;
};
export type MembershipUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutMembershipsNestedInput;
    package?: Prisma.PackageUpdateOneWithoutMembershipsNestedInput;
    entitlementLog?: Prisma.EntitlementLedgerUpdateManyWithoutMembershipNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutMembershipNestedInput;
};
export type MembershipUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    packageId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entitlementLog?: Prisma.EntitlementLedgerUncheckedUpdateManyWithoutMembershipNestedInput;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutMembershipNestedInput;
};
export type MembershipCreateManyInput = {
    id?: string;
    customerId: string;
    packageId?: string | null;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MembershipUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MembershipUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    packageId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MembershipListRelationFilter = {
    every?: Prisma.MembershipWhereInput;
    some?: Prisma.MembershipWhereInput;
    none?: Prisma.MembershipWhereInput;
};
export type MembershipOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MembershipCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    packageId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MembershipMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    packageId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MembershipMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    packageId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MembershipNullableScalarRelationFilter = {
    is?: Prisma.MembershipWhereInput | null;
    isNot?: Prisma.MembershipWhereInput | null;
};
export type MembershipCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutCustomerInput, Prisma.MembershipUncheckedCreateWithoutCustomerInput> | Prisma.MembershipCreateWithoutCustomerInput[] | Prisma.MembershipUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutCustomerInput | Prisma.MembershipCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.MembershipCreateManyCustomerInputEnvelope;
    connect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
};
export type MembershipUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutCustomerInput, Prisma.MembershipUncheckedCreateWithoutCustomerInput> | Prisma.MembershipCreateWithoutCustomerInput[] | Prisma.MembershipUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutCustomerInput | Prisma.MembershipCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.MembershipCreateManyCustomerInputEnvelope;
    connect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
};
export type MembershipUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutCustomerInput, Prisma.MembershipUncheckedCreateWithoutCustomerInput> | Prisma.MembershipCreateWithoutCustomerInput[] | Prisma.MembershipUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutCustomerInput | Prisma.MembershipCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.MembershipUpsertWithWhereUniqueWithoutCustomerInput | Prisma.MembershipUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.MembershipCreateManyCustomerInputEnvelope;
    set?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    disconnect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    delete?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    connect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    update?: Prisma.MembershipUpdateWithWhereUniqueWithoutCustomerInput | Prisma.MembershipUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.MembershipUpdateManyWithWhereWithoutCustomerInput | Prisma.MembershipUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.MembershipScalarWhereInput | Prisma.MembershipScalarWhereInput[];
};
export type MembershipUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutCustomerInput, Prisma.MembershipUncheckedCreateWithoutCustomerInput> | Prisma.MembershipCreateWithoutCustomerInput[] | Prisma.MembershipUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutCustomerInput | Prisma.MembershipCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.MembershipUpsertWithWhereUniqueWithoutCustomerInput | Prisma.MembershipUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.MembershipCreateManyCustomerInputEnvelope;
    set?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    disconnect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    delete?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    connect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    update?: Prisma.MembershipUpdateWithWhereUniqueWithoutCustomerInput | Prisma.MembershipUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.MembershipUpdateManyWithWhereWithoutCustomerInput | Prisma.MembershipUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.MembershipScalarWhereInput | Prisma.MembershipScalarWhereInput[];
};
export type MembershipCreateNestedManyWithoutPackageInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutPackageInput, Prisma.MembershipUncheckedCreateWithoutPackageInput> | Prisma.MembershipCreateWithoutPackageInput[] | Prisma.MembershipUncheckedCreateWithoutPackageInput[];
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutPackageInput | Prisma.MembershipCreateOrConnectWithoutPackageInput[];
    createMany?: Prisma.MembershipCreateManyPackageInputEnvelope;
    connect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
};
export type MembershipUncheckedCreateNestedManyWithoutPackageInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutPackageInput, Prisma.MembershipUncheckedCreateWithoutPackageInput> | Prisma.MembershipCreateWithoutPackageInput[] | Prisma.MembershipUncheckedCreateWithoutPackageInput[];
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutPackageInput | Prisma.MembershipCreateOrConnectWithoutPackageInput[];
    createMany?: Prisma.MembershipCreateManyPackageInputEnvelope;
    connect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
};
export type MembershipUpdateManyWithoutPackageNestedInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutPackageInput, Prisma.MembershipUncheckedCreateWithoutPackageInput> | Prisma.MembershipCreateWithoutPackageInput[] | Prisma.MembershipUncheckedCreateWithoutPackageInput[];
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutPackageInput | Prisma.MembershipCreateOrConnectWithoutPackageInput[];
    upsert?: Prisma.MembershipUpsertWithWhereUniqueWithoutPackageInput | Prisma.MembershipUpsertWithWhereUniqueWithoutPackageInput[];
    createMany?: Prisma.MembershipCreateManyPackageInputEnvelope;
    set?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    disconnect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    delete?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    connect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    update?: Prisma.MembershipUpdateWithWhereUniqueWithoutPackageInput | Prisma.MembershipUpdateWithWhereUniqueWithoutPackageInput[];
    updateMany?: Prisma.MembershipUpdateManyWithWhereWithoutPackageInput | Prisma.MembershipUpdateManyWithWhereWithoutPackageInput[];
    deleteMany?: Prisma.MembershipScalarWhereInput | Prisma.MembershipScalarWhereInput[];
};
export type MembershipUncheckedUpdateManyWithoutPackageNestedInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutPackageInput, Prisma.MembershipUncheckedCreateWithoutPackageInput> | Prisma.MembershipCreateWithoutPackageInput[] | Prisma.MembershipUncheckedCreateWithoutPackageInput[];
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutPackageInput | Prisma.MembershipCreateOrConnectWithoutPackageInput[];
    upsert?: Prisma.MembershipUpsertWithWhereUniqueWithoutPackageInput | Prisma.MembershipUpsertWithWhereUniqueWithoutPackageInput[];
    createMany?: Prisma.MembershipCreateManyPackageInputEnvelope;
    set?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    disconnect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    delete?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    connect?: Prisma.MembershipWhereUniqueInput | Prisma.MembershipWhereUniqueInput[];
    update?: Prisma.MembershipUpdateWithWhereUniqueWithoutPackageInput | Prisma.MembershipUpdateWithWhereUniqueWithoutPackageInput[];
    updateMany?: Prisma.MembershipUpdateManyWithWhereWithoutPackageInput | Prisma.MembershipUpdateManyWithWhereWithoutPackageInput[];
    deleteMany?: Prisma.MembershipScalarWhereInput | Prisma.MembershipScalarWhereInput[];
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type EnumMembershipStatusFieldUpdateOperationsInput = {
    set?: $Enums.MembershipStatus;
};
export type MembershipCreateNestedOneWithoutEntitlementLogInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutEntitlementLogInput, Prisma.MembershipUncheckedCreateWithoutEntitlementLogInput>;
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutEntitlementLogInput;
    connect?: Prisma.MembershipWhereUniqueInput;
};
export type MembershipUpdateOneWithoutEntitlementLogNestedInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutEntitlementLogInput, Prisma.MembershipUncheckedCreateWithoutEntitlementLogInput>;
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutEntitlementLogInput;
    upsert?: Prisma.MembershipUpsertWithoutEntitlementLogInput;
    disconnect?: Prisma.MembershipWhereInput | boolean;
    delete?: Prisma.MembershipWhereInput | boolean;
    connect?: Prisma.MembershipWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MembershipUpdateToOneWithWhereWithoutEntitlementLogInput, Prisma.MembershipUpdateWithoutEntitlementLogInput>, Prisma.MembershipUncheckedUpdateWithoutEntitlementLogInput>;
};
export type MembershipCreateNestedOneWithoutBookingsInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutBookingsInput, Prisma.MembershipUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutBookingsInput;
    connect?: Prisma.MembershipWhereUniqueInput;
};
export type MembershipUpdateOneWithoutBookingsNestedInput = {
    create?: Prisma.XOR<Prisma.MembershipCreateWithoutBookingsInput, Prisma.MembershipUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.MembershipCreateOrConnectWithoutBookingsInput;
    upsert?: Prisma.MembershipUpsertWithoutBookingsInput;
    disconnect?: Prisma.MembershipWhereInput | boolean;
    delete?: Prisma.MembershipWhereInput | boolean;
    connect?: Prisma.MembershipWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MembershipUpdateToOneWithWhereWithoutBookingsInput, Prisma.MembershipUpdateWithoutBookingsInput>, Prisma.MembershipUncheckedUpdateWithoutBookingsInput>;
};
export type MembershipCreateWithoutCustomerInput = {
    id?: string;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    package?: Prisma.PackageCreateNestedOneWithoutMembershipsInput;
    entitlementLog?: Prisma.EntitlementLedgerCreateNestedManyWithoutMembershipInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutMembershipInput;
};
export type MembershipUncheckedCreateWithoutCustomerInput = {
    id?: string;
    packageId?: string | null;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    entitlementLog?: Prisma.EntitlementLedgerUncheckedCreateNestedManyWithoutMembershipInput;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutMembershipInput;
};
export type MembershipCreateOrConnectWithoutCustomerInput = {
    where: Prisma.MembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.MembershipCreateWithoutCustomerInput, Prisma.MembershipUncheckedCreateWithoutCustomerInput>;
};
export type MembershipCreateManyCustomerInputEnvelope = {
    data: Prisma.MembershipCreateManyCustomerInput | Prisma.MembershipCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type MembershipUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.MembershipWhereUniqueInput;
    update: Prisma.XOR<Prisma.MembershipUpdateWithoutCustomerInput, Prisma.MembershipUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.MembershipCreateWithoutCustomerInput, Prisma.MembershipUncheckedCreateWithoutCustomerInput>;
};
export type MembershipUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.MembershipWhereUniqueInput;
    data: Prisma.XOR<Prisma.MembershipUpdateWithoutCustomerInput, Prisma.MembershipUncheckedUpdateWithoutCustomerInput>;
};
export type MembershipUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.MembershipScalarWhereInput;
    data: Prisma.XOR<Prisma.MembershipUpdateManyMutationInput, Prisma.MembershipUncheckedUpdateManyWithoutCustomerInput>;
};
export type MembershipScalarWhereInput = {
    AND?: Prisma.MembershipScalarWhereInput | Prisma.MembershipScalarWhereInput[];
    OR?: Prisma.MembershipScalarWhereInput[];
    NOT?: Prisma.MembershipScalarWhereInput | Prisma.MembershipScalarWhereInput[];
    id?: Prisma.StringFilter<"Membership"> | string;
    customerId?: Prisma.StringFilter<"Membership"> | string;
    packageId?: Prisma.StringNullableFilter<"Membership"> | string | null;
    startDate?: Prisma.DateTimeFilter<"Membership"> | Date | string;
    endDate?: Prisma.DateTimeNullableFilter<"Membership"> | Date | string | null;
    status?: Prisma.EnumMembershipStatusFilter<"Membership"> | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFilter<"Membership"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Membership"> | Date | string;
};
export type MembershipCreateWithoutPackageInput = {
    id?: string;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutMembershipsInput;
    entitlementLog?: Prisma.EntitlementLedgerCreateNestedManyWithoutMembershipInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutMembershipInput;
};
export type MembershipUncheckedCreateWithoutPackageInput = {
    id?: string;
    customerId: string;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    entitlementLog?: Prisma.EntitlementLedgerUncheckedCreateNestedManyWithoutMembershipInput;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutMembershipInput;
};
export type MembershipCreateOrConnectWithoutPackageInput = {
    where: Prisma.MembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.MembershipCreateWithoutPackageInput, Prisma.MembershipUncheckedCreateWithoutPackageInput>;
};
export type MembershipCreateManyPackageInputEnvelope = {
    data: Prisma.MembershipCreateManyPackageInput | Prisma.MembershipCreateManyPackageInput[];
    skipDuplicates?: boolean;
};
export type MembershipUpsertWithWhereUniqueWithoutPackageInput = {
    where: Prisma.MembershipWhereUniqueInput;
    update: Prisma.XOR<Prisma.MembershipUpdateWithoutPackageInput, Prisma.MembershipUncheckedUpdateWithoutPackageInput>;
    create: Prisma.XOR<Prisma.MembershipCreateWithoutPackageInput, Prisma.MembershipUncheckedCreateWithoutPackageInput>;
};
export type MembershipUpdateWithWhereUniqueWithoutPackageInput = {
    where: Prisma.MembershipWhereUniqueInput;
    data: Prisma.XOR<Prisma.MembershipUpdateWithoutPackageInput, Prisma.MembershipUncheckedUpdateWithoutPackageInput>;
};
export type MembershipUpdateManyWithWhereWithoutPackageInput = {
    where: Prisma.MembershipScalarWhereInput;
    data: Prisma.XOR<Prisma.MembershipUpdateManyMutationInput, Prisma.MembershipUncheckedUpdateManyWithoutPackageInput>;
};
export type MembershipCreateWithoutEntitlementLogInput = {
    id?: string;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutMembershipsInput;
    package?: Prisma.PackageCreateNestedOneWithoutMembershipsInput;
    bookings?: Prisma.BookingCreateNestedManyWithoutMembershipInput;
};
export type MembershipUncheckedCreateWithoutEntitlementLogInput = {
    id?: string;
    customerId: string;
    packageId?: string | null;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bookings?: Prisma.BookingUncheckedCreateNestedManyWithoutMembershipInput;
};
export type MembershipCreateOrConnectWithoutEntitlementLogInput = {
    where: Prisma.MembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.MembershipCreateWithoutEntitlementLogInput, Prisma.MembershipUncheckedCreateWithoutEntitlementLogInput>;
};
export type MembershipUpsertWithoutEntitlementLogInput = {
    update: Prisma.XOR<Prisma.MembershipUpdateWithoutEntitlementLogInput, Prisma.MembershipUncheckedUpdateWithoutEntitlementLogInput>;
    create: Prisma.XOR<Prisma.MembershipCreateWithoutEntitlementLogInput, Prisma.MembershipUncheckedCreateWithoutEntitlementLogInput>;
    where?: Prisma.MembershipWhereInput;
};
export type MembershipUpdateToOneWithWhereWithoutEntitlementLogInput = {
    where?: Prisma.MembershipWhereInput;
    data: Prisma.XOR<Prisma.MembershipUpdateWithoutEntitlementLogInput, Prisma.MembershipUncheckedUpdateWithoutEntitlementLogInput>;
};
export type MembershipUpdateWithoutEntitlementLogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutMembershipsNestedInput;
    package?: Prisma.PackageUpdateOneWithoutMembershipsNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutMembershipNestedInput;
};
export type MembershipUncheckedUpdateWithoutEntitlementLogInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    packageId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutMembershipNestedInput;
};
export type MembershipCreateWithoutBookingsInput = {
    id?: string;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutMembershipsInput;
    package?: Prisma.PackageCreateNestedOneWithoutMembershipsInput;
    entitlementLog?: Prisma.EntitlementLedgerCreateNestedManyWithoutMembershipInput;
};
export type MembershipUncheckedCreateWithoutBookingsInput = {
    id?: string;
    customerId: string;
    packageId?: string | null;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    entitlementLog?: Prisma.EntitlementLedgerUncheckedCreateNestedManyWithoutMembershipInput;
};
export type MembershipCreateOrConnectWithoutBookingsInput = {
    where: Prisma.MembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.MembershipCreateWithoutBookingsInput, Prisma.MembershipUncheckedCreateWithoutBookingsInput>;
};
export type MembershipUpsertWithoutBookingsInput = {
    update: Prisma.XOR<Prisma.MembershipUpdateWithoutBookingsInput, Prisma.MembershipUncheckedUpdateWithoutBookingsInput>;
    create: Prisma.XOR<Prisma.MembershipCreateWithoutBookingsInput, Prisma.MembershipUncheckedCreateWithoutBookingsInput>;
    where?: Prisma.MembershipWhereInput;
};
export type MembershipUpdateToOneWithWhereWithoutBookingsInput = {
    where?: Prisma.MembershipWhereInput;
    data: Prisma.XOR<Prisma.MembershipUpdateWithoutBookingsInput, Prisma.MembershipUncheckedUpdateWithoutBookingsInput>;
};
export type MembershipUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutMembershipsNestedInput;
    package?: Prisma.PackageUpdateOneWithoutMembershipsNestedInput;
    entitlementLog?: Prisma.EntitlementLedgerUpdateManyWithoutMembershipNestedInput;
};
export type MembershipUncheckedUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    packageId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entitlementLog?: Prisma.EntitlementLedgerUncheckedUpdateManyWithoutMembershipNestedInput;
};
export type MembershipCreateManyCustomerInput = {
    id?: string;
    packageId?: string | null;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MembershipUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    package?: Prisma.PackageUpdateOneWithoutMembershipsNestedInput;
    entitlementLog?: Prisma.EntitlementLedgerUpdateManyWithoutMembershipNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutMembershipNestedInput;
};
export type MembershipUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    packageId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entitlementLog?: Prisma.EntitlementLedgerUncheckedUpdateManyWithoutMembershipNestedInput;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutMembershipNestedInput;
};
export type MembershipUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    packageId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MembershipCreateManyPackageInput = {
    id?: string;
    customerId: string;
    startDate?: Date | string;
    endDate?: Date | string | null;
    status?: $Enums.MembershipStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MembershipUpdateWithoutPackageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutMembershipsNestedInput;
    entitlementLog?: Prisma.EntitlementLedgerUpdateManyWithoutMembershipNestedInput;
    bookings?: Prisma.BookingUpdateManyWithoutMembershipNestedInput;
};
export type MembershipUncheckedUpdateWithoutPackageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entitlementLog?: Prisma.EntitlementLedgerUncheckedUpdateManyWithoutMembershipNestedInput;
    bookings?: Prisma.BookingUncheckedUpdateManyWithoutMembershipNestedInput;
};
export type MembershipUncheckedUpdateManyWithoutPackageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumMembershipStatusFieldUpdateOperationsInput | $Enums.MembershipStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MembershipCountOutputType = {
    entitlementLog: number;
    bookings: number;
};
export type MembershipCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    entitlementLog?: boolean | MembershipCountOutputTypeCountEntitlementLogArgs;
    bookings?: boolean | MembershipCountOutputTypeCountBookingsArgs;
};
export type MembershipCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipCountOutputTypeSelect<ExtArgs> | null;
};
export type MembershipCountOutputTypeCountEntitlementLogArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntitlementLedgerWhereInput;
};
export type MembershipCountOutputTypeCountBookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingWhereInput;
};
export type MembershipSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    packageId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    package?: boolean | Prisma.Membership$packageArgs<ExtArgs>;
    entitlementLog?: boolean | Prisma.Membership$entitlementLogArgs<ExtArgs>;
    bookings?: boolean | Prisma.Membership$bookingsArgs<ExtArgs>;
    _count?: boolean | Prisma.MembershipCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["membership"]>;
export type MembershipSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    packageId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    package?: boolean | Prisma.Membership$packageArgs<ExtArgs>;
}, ExtArgs["result"]["membership"]>;
export type MembershipSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    packageId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    package?: boolean | Prisma.Membership$packageArgs<ExtArgs>;
}, ExtArgs["result"]["membership"]>;
export type MembershipSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    packageId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type MembershipOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerId" | "packageId" | "startDate" | "endDate" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["membership"]>;
export type MembershipInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    package?: boolean | Prisma.Membership$packageArgs<ExtArgs>;
    entitlementLog?: boolean | Prisma.Membership$entitlementLogArgs<ExtArgs>;
    bookings?: boolean | Prisma.Membership$bookingsArgs<ExtArgs>;
    _count?: boolean | Prisma.MembershipCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MembershipIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    package?: boolean | Prisma.Membership$packageArgs<ExtArgs>;
};
export type MembershipIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    package?: boolean | Prisma.Membership$packageArgs<ExtArgs>;
};
export type $MembershipPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Membership";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs>;
        package: Prisma.$PackagePayload<ExtArgs> | null;
        entitlementLog: Prisma.$EntitlementLedgerPayload<ExtArgs>[];
        bookings: Prisma.$BookingPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerId: string;
        packageId: string | null;
        startDate: Date;
        endDate: Date | null;
        status: $Enums.MembershipStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["membership"]>;
    composites: {};
};
export type MembershipGetPayload<S extends boolean | null | undefined | MembershipDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MembershipPayload, S>;
export type MembershipCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MembershipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MembershipCountAggregateInputType | true;
};
export interface MembershipDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Membership'];
        meta: {
            name: 'Membership';
        };
    };
    findUnique<T extends MembershipFindUniqueArgs>(args: Prisma.SelectSubset<T, MembershipFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MembershipFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MembershipFindFirstArgs>(args?: Prisma.SelectSubset<T, MembershipFindFirstArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MembershipFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MembershipFindManyArgs>(args?: Prisma.SelectSubset<T, MembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MembershipCreateArgs>(args: Prisma.SelectSubset<T, MembershipCreateArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MembershipCreateManyArgs>(args?: Prisma.SelectSubset<T, MembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MembershipCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MembershipDeleteArgs>(args: Prisma.SelectSubset<T, MembershipDeleteArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MembershipUpdateArgs>(args: Prisma.SelectSubset<T, MembershipUpdateArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MembershipDeleteManyArgs>(args?: Prisma.SelectSubset<T, MembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MembershipUpdateManyArgs>(args: Prisma.SelectSubset<T, MembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MembershipUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MembershipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MembershipUpsertArgs>(args: Prisma.SelectSubset<T, MembershipUpsertArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MembershipCountArgs>(args?: Prisma.Subset<T, MembershipCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MembershipCountAggregateOutputType> : number>;
    aggregate<T extends MembershipAggregateArgs>(args: Prisma.Subset<T, MembershipAggregateArgs>): Prisma.PrismaPromise<GetMembershipAggregateType<T>>;
    groupBy<T extends MembershipGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MembershipGroupByArgs['orderBy'];
    } : {
        orderBy?: MembershipGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MembershipFieldRefs;
}
export interface Prisma__MembershipClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.CustomerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    package<T extends Prisma.Membership$packageArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Membership$packageArgs<ExtArgs>>): Prisma.Prisma__PackageClient<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    entitlementLog<T extends Prisma.Membership$entitlementLogArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Membership$entitlementLogArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    bookings<T extends Prisma.Membership$bookingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Membership$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MembershipFieldRefs {
    readonly id: Prisma.FieldRef<"Membership", 'String'>;
    readonly customerId: Prisma.FieldRef<"Membership", 'String'>;
    readonly packageId: Prisma.FieldRef<"Membership", 'String'>;
    readonly startDate: Prisma.FieldRef<"Membership", 'DateTime'>;
    readonly endDate: Prisma.FieldRef<"Membership", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Membership", 'MembershipStatus'>;
    readonly createdAt: Prisma.FieldRef<"Membership", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Membership", 'DateTime'>;
}
export type MembershipFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    where: Prisma.MembershipWhereUniqueInput;
};
export type MembershipFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    where: Prisma.MembershipWhereUniqueInput;
};
export type MembershipFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    where?: Prisma.MembershipWhereInput;
    orderBy?: Prisma.MembershipOrderByWithRelationInput | Prisma.MembershipOrderByWithRelationInput[];
    cursor?: Prisma.MembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MembershipScalarFieldEnum | Prisma.MembershipScalarFieldEnum[];
};
export type MembershipFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    where?: Prisma.MembershipWhereInput;
    orderBy?: Prisma.MembershipOrderByWithRelationInput | Prisma.MembershipOrderByWithRelationInput[];
    cursor?: Prisma.MembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MembershipScalarFieldEnum | Prisma.MembershipScalarFieldEnum[];
};
export type MembershipFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    where?: Prisma.MembershipWhereInput;
    orderBy?: Prisma.MembershipOrderByWithRelationInput | Prisma.MembershipOrderByWithRelationInput[];
    cursor?: Prisma.MembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MembershipScalarFieldEnum | Prisma.MembershipScalarFieldEnum[];
};
export type MembershipCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MembershipCreateInput, Prisma.MembershipUncheckedCreateInput>;
};
export type MembershipCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MembershipCreateManyInput | Prisma.MembershipCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MembershipCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    data: Prisma.MembershipCreateManyInput | Prisma.MembershipCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MembershipIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MembershipUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MembershipUpdateInput, Prisma.MembershipUncheckedUpdateInput>;
    where: Prisma.MembershipWhereUniqueInput;
};
export type MembershipUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MembershipUpdateManyMutationInput, Prisma.MembershipUncheckedUpdateManyInput>;
    where?: Prisma.MembershipWhereInput;
    limit?: number;
};
export type MembershipUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MembershipUpdateManyMutationInput, Prisma.MembershipUncheckedUpdateManyInput>;
    where?: Prisma.MembershipWhereInput;
    limit?: number;
    include?: Prisma.MembershipIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MembershipUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    where: Prisma.MembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.MembershipCreateInput, Prisma.MembershipUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MembershipUpdateInput, Prisma.MembershipUncheckedUpdateInput>;
};
export type MembershipDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    where: Prisma.MembershipWhereUniqueInput;
};
export type MembershipDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MembershipWhereInput;
    limit?: number;
};
export type Membership$packageArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    where?: Prisma.PackageWhereInput;
};
export type Membership$entitlementLogArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelect<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    include?: Prisma.EntitlementLedgerInclude<ExtArgs> | null;
    where?: Prisma.EntitlementLedgerWhereInput;
    orderBy?: Prisma.EntitlementLedgerOrderByWithRelationInput | Prisma.EntitlementLedgerOrderByWithRelationInput[];
    cursor?: Prisma.EntitlementLedgerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EntitlementLedgerScalarFieldEnum | Prisma.EntitlementLedgerScalarFieldEnum[];
};
export type Membership$bookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithRelationInput | Prisma.BookingOrderByWithRelationInput[];
    cursor?: Prisma.BookingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BookingScalarFieldEnum | Prisma.BookingScalarFieldEnum[];
};
export type MembershipDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
};
