import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EntitlementLedgerModel = runtime.Types.Result.DefaultSelection<Prisma.$EntitlementLedgerPayload>;
export type AggregateEntitlementLedger = {
    _count: EntitlementLedgerCountAggregateOutputType | null;
    _avg: EntitlementLedgerAvgAggregateOutputType | null;
    _sum: EntitlementLedgerSumAggregateOutputType | null;
    _min: EntitlementLedgerMinAggregateOutputType | null;
    _max: EntitlementLedgerMaxAggregateOutputType | null;
};
export type EntitlementLedgerAvgAggregateOutputType = {
    days: number | null;
    nights: number | null;
};
export type EntitlementLedgerSumAggregateOutputType = {
    days: number | null;
    nights: number | null;
};
export type EntitlementLedgerMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    membershipId: string | null;
    type: string | null;
    days: number | null;
    nights: number | null;
    description: string | null;
    date: Date | null;
};
export type EntitlementLedgerMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    membershipId: string | null;
    type: string | null;
    days: number | null;
    nights: number | null;
    description: string | null;
    date: Date | null;
};
export type EntitlementLedgerCountAggregateOutputType = {
    id: number;
    customerId: number;
    membershipId: number;
    type: number;
    days: number;
    nights: number;
    description: number;
    date: number;
    _all: number;
};
export type EntitlementLedgerAvgAggregateInputType = {
    days?: true;
    nights?: true;
};
export type EntitlementLedgerSumAggregateInputType = {
    days?: true;
    nights?: true;
};
export type EntitlementLedgerMinAggregateInputType = {
    id?: true;
    customerId?: true;
    membershipId?: true;
    type?: true;
    days?: true;
    nights?: true;
    description?: true;
    date?: true;
};
export type EntitlementLedgerMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    membershipId?: true;
    type?: true;
    days?: true;
    nights?: true;
    description?: true;
    date?: true;
};
export type EntitlementLedgerCountAggregateInputType = {
    id?: true;
    customerId?: true;
    membershipId?: true;
    type?: true;
    days?: true;
    nights?: true;
    description?: true;
    date?: true;
    _all?: true;
};
export type EntitlementLedgerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntitlementLedgerWhereInput;
    orderBy?: Prisma.EntitlementLedgerOrderByWithRelationInput | Prisma.EntitlementLedgerOrderByWithRelationInput[];
    cursor?: Prisma.EntitlementLedgerWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EntitlementLedgerCountAggregateInputType;
    _avg?: EntitlementLedgerAvgAggregateInputType;
    _sum?: EntitlementLedgerSumAggregateInputType;
    _min?: EntitlementLedgerMinAggregateInputType;
    _max?: EntitlementLedgerMaxAggregateInputType;
};
export type GetEntitlementLedgerAggregateType<T extends EntitlementLedgerAggregateArgs> = {
    [P in keyof T & keyof AggregateEntitlementLedger]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEntitlementLedger[P]> : Prisma.GetScalarType<T[P], AggregateEntitlementLedger[P]>;
};
export type EntitlementLedgerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntitlementLedgerWhereInput;
    orderBy?: Prisma.EntitlementLedgerOrderByWithAggregationInput | Prisma.EntitlementLedgerOrderByWithAggregationInput[];
    by: Prisma.EntitlementLedgerScalarFieldEnum[] | Prisma.EntitlementLedgerScalarFieldEnum;
    having?: Prisma.EntitlementLedgerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EntitlementLedgerCountAggregateInputType | true;
    _avg?: EntitlementLedgerAvgAggregateInputType;
    _sum?: EntitlementLedgerSumAggregateInputType;
    _min?: EntitlementLedgerMinAggregateInputType;
    _max?: EntitlementLedgerMaxAggregateInputType;
};
export type EntitlementLedgerGroupByOutputType = {
    id: string;
    customerId: string;
    membershipId: string | null;
    type: string;
    days: number;
    nights: number;
    description: string | null;
    date: Date;
    _count: EntitlementLedgerCountAggregateOutputType | null;
    _avg: EntitlementLedgerAvgAggregateOutputType | null;
    _sum: EntitlementLedgerSumAggregateOutputType | null;
    _min: EntitlementLedgerMinAggregateOutputType | null;
    _max: EntitlementLedgerMaxAggregateOutputType | null;
};
export type GetEntitlementLedgerGroupByPayload<T extends EntitlementLedgerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EntitlementLedgerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EntitlementLedgerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EntitlementLedgerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EntitlementLedgerGroupByOutputType[P]>;
}>>;
export type EntitlementLedgerWhereInput = {
    AND?: Prisma.EntitlementLedgerWhereInput | Prisma.EntitlementLedgerWhereInput[];
    OR?: Prisma.EntitlementLedgerWhereInput[];
    NOT?: Prisma.EntitlementLedgerWhereInput | Prisma.EntitlementLedgerWhereInput[];
    id?: Prisma.StringFilter<"EntitlementLedger"> | string;
    customerId?: Prisma.StringFilter<"EntitlementLedger"> | string;
    membershipId?: Prisma.StringNullableFilter<"EntitlementLedger"> | string | null;
    type?: Prisma.StringFilter<"EntitlementLedger"> | string;
    days?: Prisma.IntFilter<"EntitlementLedger"> | number;
    nights?: Prisma.IntFilter<"EntitlementLedger"> | number;
    description?: Prisma.StringNullableFilter<"EntitlementLedger"> | string | null;
    date?: Prisma.DateTimeFilter<"EntitlementLedger"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    membership?: Prisma.XOR<Prisma.MembershipNullableScalarRelationFilter, Prisma.MembershipWhereInput> | null;
};
export type EntitlementLedgerOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    date?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    membership?: Prisma.MembershipOrderByWithRelationInput;
};
export type EntitlementLedgerWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EntitlementLedgerWhereInput | Prisma.EntitlementLedgerWhereInput[];
    OR?: Prisma.EntitlementLedgerWhereInput[];
    NOT?: Prisma.EntitlementLedgerWhereInput | Prisma.EntitlementLedgerWhereInput[];
    customerId?: Prisma.StringFilter<"EntitlementLedger"> | string;
    membershipId?: Prisma.StringNullableFilter<"EntitlementLedger"> | string | null;
    type?: Prisma.StringFilter<"EntitlementLedger"> | string;
    days?: Prisma.IntFilter<"EntitlementLedger"> | number;
    nights?: Prisma.IntFilter<"EntitlementLedger"> | number;
    description?: Prisma.StringNullableFilter<"EntitlementLedger"> | string | null;
    date?: Prisma.DateTimeFilter<"EntitlementLedger"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    membership?: Prisma.XOR<Prisma.MembershipNullableScalarRelationFilter, Prisma.MembershipWhereInput> | null;
}, "id">;
export type EntitlementLedgerOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrderInput | Prisma.SortOrder;
    type?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    date?: Prisma.SortOrder;
    _count?: Prisma.EntitlementLedgerCountOrderByAggregateInput;
    _avg?: Prisma.EntitlementLedgerAvgOrderByAggregateInput;
    _max?: Prisma.EntitlementLedgerMaxOrderByAggregateInput;
    _min?: Prisma.EntitlementLedgerMinOrderByAggregateInput;
    _sum?: Prisma.EntitlementLedgerSumOrderByAggregateInput;
};
export type EntitlementLedgerScalarWhereWithAggregatesInput = {
    AND?: Prisma.EntitlementLedgerScalarWhereWithAggregatesInput | Prisma.EntitlementLedgerScalarWhereWithAggregatesInput[];
    OR?: Prisma.EntitlementLedgerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EntitlementLedgerScalarWhereWithAggregatesInput | Prisma.EntitlementLedgerScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"EntitlementLedger"> | string;
    customerId?: Prisma.StringWithAggregatesFilter<"EntitlementLedger"> | string;
    membershipId?: Prisma.StringNullableWithAggregatesFilter<"EntitlementLedger"> | string | null;
    type?: Prisma.StringWithAggregatesFilter<"EntitlementLedger"> | string;
    days?: Prisma.IntWithAggregatesFilter<"EntitlementLedger"> | number;
    nights?: Prisma.IntWithAggregatesFilter<"EntitlementLedger"> | number;
    description?: Prisma.StringNullableWithAggregatesFilter<"EntitlementLedger"> | string | null;
    date?: Prisma.DateTimeWithAggregatesFilter<"EntitlementLedger"> | Date | string;
};
export type EntitlementLedgerCreateInput = {
    id?: string;
    type: string;
    days?: number;
    nights?: number;
    description?: string | null;
    date?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutEntitlementLogInput;
    membership?: Prisma.MembershipCreateNestedOneWithoutEntitlementLogInput;
};
export type EntitlementLedgerUncheckedCreateInput = {
    id?: string;
    customerId: string;
    membershipId?: string | null;
    type: string;
    days?: number;
    nights?: number;
    description?: string | null;
    date?: Date | string;
};
export type EntitlementLedgerUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutEntitlementLogNestedInput;
    membership?: Prisma.MembershipUpdateOneWithoutEntitlementLogNestedInput;
};
export type EntitlementLedgerUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    membershipId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntitlementLedgerCreateManyInput = {
    id?: string;
    customerId: string;
    membershipId?: string | null;
    type: string;
    days?: number;
    nights?: number;
    description?: string | null;
    date?: Date | string;
};
export type EntitlementLedgerUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntitlementLedgerUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    membershipId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntitlementLedgerListRelationFilter = {
    every?: Prisma.EntitlementLedgerWhereInput;
    some?: Prisma.EntitlementLedgerWhereInput;
    none?: Prisma.EntitlementLedgerWhereInput;
};
export type EntitlementLedgerOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EntitlementLedgerCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
};
export type EntitlementLedgerAvgOrderByAggregateInput = {
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
};
export type EntitlementLedgerMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
};
export type EntitlementLedgerMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
};
export type EntitlementLedgerSumOrderByAggregateInput = {
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
};
export type EntitlementLedgerCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutCustomerInput, Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput> | Prisma.EntitlementLedgerCreateWithoutCustomerInput[] | Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.EntitlementLedgerCreateOrConnectWithoutCustomerInput | Prisma.EntitlementLedgerCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.EntitlementLedgerCreateManyCustomerInputEnvelope;
    connect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
};
export type EntitlementLedgerUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutCustomerInput, Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput> | Prisma.EntitlementLedgerCreateWithoutCustomerInput[] | Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.EntitlementLedgerCreateOrConnectWithoutCustomerInput | Prisma.EntitlementLedgerCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.EntitlementLedgerCreateManyCustomerInputEnvelope;
    connect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
};
export type EntitlementLedgerUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutCustomerInput, Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput> | Prisma.EntitlementLedgerCreateWithoutCustomerInput[] | Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.EntitlementLedgerCreateOrConnectWithoutCustomerInput | Prisma.EntitlementLedgerCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.EntitlementLedgerUpsertWithWhereUniqueWithoutCustomerInput | Prisma.EntitlementLedgerUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.EntitlementLedgerCreateManyCustomerInputEnvelope;
    set?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    disconnect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    delete?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    connect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    update?: Prisma.EntitlementLedgerUpdateWithWhereUniqueWithoutCustomerInput | Prisma.EntitlementLedgerUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.EntitlementLedgerUpdateManyWithWhereWithoutCustomerInput | Prisma.EntitlementLedgerUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.EntitlementLedgerScalarWhereInput | Prisma.EntitlementLedgerScalarWhereInput[];
};
export type EntitlementLedgerUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutCustomerInput, Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput> | Prisma.EntitlementLedgerCreateWithoutCustomerInput[] | Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.EntitlementLedgerCreateOrConnectWithoutCustomerInput | Prisma.EntitlementLedgerCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.EntitlementLedgerUpsertWithWhereUniqueWithoutCustomerInput | Prisma.EntitlementLedgerUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.EntitlementLedgerCreateManyCustomerInputEnvelope;
    set?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    disconnect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    delete?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    connect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    update?: Prisma.EntitlementLedgerUpdateWithWhereUniqueWithoutCustomerInput | Prisma.EntitlementLedgerUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.EntitlementLedgerUpdateManyWithWhereWithoutCustomerInput | Prisma.EntitlementLedgerUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.EntitlementLedgerScalarWhereInput | Prisma.EntitlementLedgerScalarWhereInput[];
};
export type EntitlementLedgerCreateNestedManyWithoutMembershipInput = {
    create?: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutMembershipInput, Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput> | Prisma.EntitlementLedgerCreateWithoutMembershipInput[] | Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput[];
    connectOrCreate?: Prisma.EntitlementLedgerCreateOrConnectWithoutMembershipInput | Prisma.EntitlementLedgerCreateOrConnectWithoutMembershipInput[];
    createMany?: Prisma.EntitlementLedgerCreateManyMembershipInputEnvelope;
    connect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
};
export type EntitlementLedgerUncheckedCreateNestedManyWithoutMembershipInput = {
    create?: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutMembershipInput, Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput> | Prisma.EntitlementLedgerCreateWithoutMembershipInput[] | Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput[];
    connectOrCreate?: Prisma.EntitlementLedgerCreateOrConnectWithoutMembershipInput | Prisma.EntitlementLedgerCreateOrConnectWithoutMembershipInput[];
    createMany?: Prisma.EntitlementLedgerCreateManyMembershipInputEnvelope;
    connect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
};
export type EntitlementLedgerUpdateManyWithoutMembershipNestedInput = {
    create?: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutMembershipInput, Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput> | Prisma.EntitlementLedgerCreateWithoutMembershipInput[] | Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput[];
    connectOrCreate?: Prisma.EntitlementLedgerCreateOrConnectWithoutMembershipInput | Prisma.EntitlementLedgerCreateOrConnectWithoutMembershipInput[];
    upsert?: Prisma.EntitlementLedgerUpsertWithWhereUniqueWithoutMembershipInput | Prisma.EntitlementLedgerUpsertWithWhereUniqueWithoutMembershipInput[];
    createMany?: Prisma.EntitlementLedgerCreateManyMembershipInputEnvelope;
    set?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    disconnect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    delete?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    connect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    update?: Prisma.EntitlementLedgerUpdateWithWhereUniqueWithoutMembershipInput | Prisma.EntitlementLedgerUpdateWithWhereUniqueWithoutMembershipInput[];
    updateMany?: Prisma.EntitlementLedgerUpdateManyWithWhereWithoutMembershipInput | Prisma.EntitlementLedgerUpdateManyWithWhereWithoutMembershipInput[];
    deleteMany?: Prisma.EntitlementLedgerScalarWhereInput | Prisma.EntitlementLedgerScalarWhereInput[];
};
export type EntitlementLedgerUncheckedUpdateManyWithoutMembershipNestedInput = {
    create?: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutMembershipInput, Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput> | Prisma.EntitlementLedgerCreateWithoutMembershipInput[] | Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput[];
    connectOrCreate?: Prisma.EntitlementLedgerCreateOrConnectWithoutMembershipInput | Prisma.EntitlementLedgerCreateOrConnectWithoutMembershipInput[];
    upsert?: Prisma.EntitlementLedgerUpsertWithWhereUniqueWithoutMembershipInput | Prisma.EntitlementLedgerUpsertWithWhereUniqueWithoutMembershipInput[];
    createMany?: Prisma.EntitlementLedgerCreateManyMembershipInputEnvelope;
    set?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    disconnect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    delete?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    connect?: Prisma.EntitlementLedgerWhereUniqueInput | Prisma.EntitlementLedgerWhereUniqueInput[];
    update?: Prisma.EntitlementLedgerUpdateWithWhereUniqueWithoutMembershipInput | Prisma.EntitlementLedgerUpdateWithWhereUniqueWithoutMembershipInput[];
    updateMany?: Prisma.EntitlementLedgerUpdateManyWithWhereWithoutMembershipInput | Prisma.EntitlementLedgerUpdateManyWithWhereWithoutMembershipInput[];
    deleteMany?: Prisma.EntitlementLedgerScalarWhereInput | Prisma.EntitlementLedgerScalarWhereInput[];
};
export type EntitlementLedgerCreateWithoutCustomerInput = {
    id?: string;
    type: string;
    days?: number;
    nights?: number;
    description?: string | null;
    date?: Date | string;
    membership?: Prisma.MembershipCreateNestedOneWithoutEntitlementLogInput;
};
export type EntitlementLedgerUncheckedCreateWithoutCustomerInput = {
    id?: string;
    membershipId?: string | null;
    type: string;
    days?: number;
    nights?: number;
    description?: string | null;
    date?: Date | string;
};
export type EntitlementLedgerCreateOrConnectWithoutCustomerInput = {
    where: Prisma.EntitlementLedgerWhereUniqueInput;
    create: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutCustomerInput, Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput>;
};
export type EntitlementLedgerCreateManyCustomerInputEnvelope = {
    data: Prisma.EntitlementLedgerCreateManyCustomerInput | Prisma.EntitlementLedgerCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type EntitlementLedgerUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.EntitlementLedgerWhereUniqueInput;
    update: Prisma.XOR<Prisma.EntitlementLedgerUpdateWithoutCustomerInput, Prisma.EntitlementLedgerUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutCustomerInput, Prisma.EntitlementLedgerUncheckedCreateWithoutCustomerInput>;
};
export type EntitlementLedgerUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.EntitlementLedgerWhereUniqueInput;
    data: Prisma.XOR<Prisma.EntitlementLedgerUpdateWithoutCustomerInput, Prisma.EntitlementLedgerUncheckedUpdateWithoutCustomerInput>;
};
export type EntitlementLedgerUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.EntitlementLedgerScalarWhereInput;
    data: Prisma.XOR<Prisma.EntitlementLedgerUpdateManyMutationInput, Prisma.EntitlementLedgerUncheckedUpdateManyWithoutCustomerInput>;
};
export type EntitlementLedgerScalarWhereInput = {
    AND?: Prisma.EntitlementLedgerScalarWhereInput | Prisma.EntitlementLedgerScalarWhereInput[];
    OR?: Prisma.EntitlementLedgerScalarWhereInput[];
    NOT?: Prisma.EntitlementLedgerScalarWhereInput | Prisma.EntitlementLedgerScalarWhereInput[];
    id?: Prisma.StringFilter<"EntitlementLedger"> | string;
    customerId?: Prisma.StringFilter<"EntitlementLedger"> | string;
    membershipId?: Prisma.StringNullableFilter<"EntitlementLedger"> | string | null;
    type?: Prisma.StringFilter<"EntitlementLedger"> | string;
    days?: Prisma.IntFilter<"EntitlementLedger"> | number;
    nights?: Prisma.IntFilter<"EntitlementLedger"> | number;
    description?: Prisma.StringNullableFilter<"EntitlementLedger"> | string | null;
    date?: Prisma.DateTimeFilter<"EntitlementLedger"> | Date | string;
};
export type EntitlementLedgerCreateWithoutMembershipInput = {
    id?: string;
    type: string;
    days?: number;
    nights?: number;
    description?: string | null;
    date?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutEntitlementLogInput;
};
export type EntitlementLedgerUncheckedCreateWithoutMembershipInput = {
    id?: string;
    customerId: string;
    type: string;
    days?: number;
    nights?: number;
    description?: string | null;
    date?: Date | string;
};
export type EntitlementLedgerCreateOrConnectWithoutMembershipInput = {
    where: Prisma.EntitlementLedgerWhereUniqueInput;
    create: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutMembershipInput, Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput>;
};
export type EntitlementLedgerCreateManyMembershipInputEnvelope = {
    data: Prisma.EntitlementLedgerCreateManyMembershipInput | Prisma.EntitlementLedgerCreateManyMembershipInput[];
    skipDuplicates?: boolean;
};
export type EntitlementLedgerUpsertWithWhereUniqueWithoutMembershipInput = {
    where: Prisma.EntitlementLedgerWhereUniqueInput;
    update: Prisma.XOR<Prisma.EntitlementLedgerUpdateWithoutMembershipInput, Prisma.EntitlementLedgerUncheckedUpdateWithoutMembershipInput>;
    create: Prisma.XOR<Prisma.EntitlementLedgerCreateWithoutMembershipInput, Prisma.EntitlementLedgerUncheckedCreateWithoutMembershipInput>;
};
export type EntitlementLedgerUpdateWithWhereUniqueWithoutMembershipInput = {
    where: Prisma.EntitlementLedgerWhereUniqueInput;
    data: Prisma.XOR<Prisma.EntitlementLedgerUpdateWithoutMembershipInput, Prisma.EntitlementLedgerUncheckedUpdateWithoutMembershipInput>;
};
export type EntitlementLedgerUpdateManyWithWhereWithoutMembershipInput = {
    where: Prisma.EntitlementLedgerScalarWhereInput;
    data: Prisma.XOR<Prisma.EntitlementLedgerUpdateManyMutationInput, Prisma.EntitlementLedgerUncheckedUpdateManyWithoutMembershipInput>;
};
export type EntitlementLedgerCreateManyCustomerInput = {
    id?: string;
    membershipId?: string | null;
    type: string;
    days?: number;
    nights?: number;
    description?: string | null;
    date?: Date | string;
};
export type EntitlementLedgerUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    membership?: Prisma.MembershipUpdateOneWithoutEntitlementLogNestedInput;
};
export type EntitlementLedgerUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    membershipId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntitlementLedgerUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    membershipId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntitlementLedgerCreateManyMembershipInput = {
    id?: string;
    customerId: string;
    type: string;
    days?: number;
    nights?: number;
    description?: string | null;
    date?: Date | string;
};
export type EntitlementLedgerUpdateWithoutMembershipInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutEntitlementLogNestedInput;
};
export type EntitlementLedgerUncheckedUpdateWithoutMembershipInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntitlementLedgerUncheckedUpdateManyWithoutMembershipInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntitlementLedgerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    membershipId?: boolean;
    type?: boolean;
    days?: boolean;
    nights?: boolean;
    description?: boolean;
    date?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.EntitlementLedger$membershipArgs<ExtArgs>;
}, ExtArgs["result"]["entitlementLedger"]>;
export type EntitlementLedgerSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    membershipId?: boolean;
    type?: boolean;
    days?: boolean;
    nights?: boolean;
    description?: boolean;
    date?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.EntitlementLedger$membershipArgs<ExtArgs>;
}, ExtArgs["result"]["entitlementLedger"]>;
export type EntitlementLedgerSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    membershipId?: boolean;
    type?: boolean;
    days?: boolean;
    nights?: boolean;
    description?: boolean;
    date?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.EntitlementLedger$membershipArgs<ExtArgs>;
}, ExtArgs["result"]["entitlementLedger"]>;
export type EntitlementLedgerSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    membershipId?: boolean;
    type?: boolean;
    days?: boolean;
    nights?: boolean;
    description?: boolean;
    date?: boolean;
};
export type EntitlementLedgerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerId" | "membershipId" | "type" | "days" | "nights" | "description" | "date", ExtArgs["result"]["entitlementLedger"]>;
export type EntitlementLedgerInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.EntitlementLedger$membershipArgs<ExtArgs>;
};
export type EntitlementLedgerIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.EntitlementLedger$membershipArgs<ExtArgs>;
};
export type EntitlementLedgerIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.EntitlementLedger$membershipArgs<ExtArgs>;
};
export type $EntitlementLedgerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EntitlementLedger";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs>;
        membership: Prisma.$MembershipPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerId: string;
        membershipId: string | null;
        type: string;
        days: number;
        nights: number;
        description: string | null;
        date: Date;
    }, ExtArgs["result"]["entitlementLedger"]>;
    composites: {};
};
export type EntitlementLedgerGetPayload<S extends boolean | null | undefined | EntitlementLedgerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload, S>;
export type EntitlementLedgerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EntitlementLedgerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EntitlementLedgerCountAggregateInputType | true;
};
export interface EntitlementLedgerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EntitlementLedger'];
        meta: {
            name: 'EntitlementLedger';
        };
    };
    findUnique<T extends EntitlementLedgerFindUniqueArgs>(args: Prisma.SelectSubset<T, EntitlementLedgerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EntitlementLedgerClient<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EntitlementLedgerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EntitlementLedgerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EntitlementLedgerClient<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EntitlementLedgerFindFirstArgs>(args?: Prisma.SelectSubset<T, EntitlementLedgerFindFirstArgs<ExtArgs>>): Prisma.Prisma__EntitlementLedgerClient<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EntitlementLedgerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EntitlementLedgerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EntitlementLedgerClient<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EntitlementLedgerFindManyArgs>(args?: Prisma.SelectSubset<T, EntitlementLedgerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EntitlementLedgerCreateArgs>(args: Prisma.SelectSubset<T, EntitlementLedgerCreateArgs<ExtArgs>>): Prisma.Prisma__EntitlementLedgerClient<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EntitlementLedgerCreateManyArgs>(args?: Prisma.SelectSubset<T, EntitlementLedgerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EntitlementLedgerCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EntitlementLedgerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EntitlementLedgerDeleteArgs>(args: Prisma.SelectSubset<T, EntitlementLedgerDeleteArgs<ExtArgs>>): Prisma.Prisma__EntitlementLedgerClient<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EntitlementLedgerUpdateArgs>(args: Prisma.SelectSubset<T, EntitlementLedgerUpdateArgs<ExtArgs>>): Prisma.Prisma__EntitlementLedgerClient<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EntitlementLedgerDeleteManyArgs>(args?: Prisma.SelectSubset<T, EntitlementLedgerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EntitlementLedgerUpdateManyArgs>(args: Prisma.SelectSubset<T, EntitlementLedgerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EntitlementLedgerUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EntitlementLedgerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EntitlementLedgerUpsertArgs>(args: Prisma.SelectSubset<T, EntitlementLedgerUpsertArgs<ExtArgs>>): Prisma.Prisma__EntitlementLedgerClient<runtime.Types.Result.GetResult<Prisma.$EntitlementLedgerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EntitlementLedgerCountArgs>(args?: Prisma.Subset<T, EntitlementLedgerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EntitlementLedgerCountAggregateOutputType> : number>;
    aggregate<T extends EntitlementLedgerAggregateArgs>(args: Prisma.Subset<T, EntitlementLedgerAggregateArgs>): Prisma.PrismaPromise<GetEntitlementLedgerAggregateType<T>>;
    groupBy<T extends EntitlementLedgerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EntitlementLedgerGroupByArgs['orderBy'];
    } : {
        orderBy?: EntitlementLedgerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EntitlementLedgerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntitlementLedgerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EntitlementLedgerFieldRefs;
}
export interface Prisma__EntitlementLedgerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.CustomerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    membership<T extends Prisma.EntitlementLedger$membershipArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EntitlementLedger$membershipArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EntitlementLedgerFieldRefs {
    readonly id: Prisma.FieldRef<"EntitlementLedger", 'String'>;
    readonly customerId: Prisma.FieldRef<"EntitlementLedger", 'String'>;
    readonly membershipId: Prisma.FieldRef<"EntitlementLedger", 'String'>;
    readonly type: Prisma.FieldRef<"EntitlementLedger", 'String'>;
    readonly days: Prisma.FieldRef<"EntitlementLedger", 'Int'>;
    readonly nights: Prisma.FieldRef<"EntitlementLedger", 'Int'>;
    readonly description: Prisma.FieldRef<"EntitlementLedger", 'String'>;
    readonly date: Prisma.FieldRef<"EntitlementLedger", 'DateTime'>;
}
export type EntitlementLedgerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelect<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    include?: Prisma.EntitlementLedgerInclude<ExtArgs> | null;
    where: Prisma.EntitlementLedgerWhereUniqueInput;
};
export type EntitlementLedgerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelect<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    include?: Prisma.EntitlementLedgerInclude<ExtArgs> | null;
    where: Prisma.EntitlementLedgerWhereUniqueInput;
};
export type EntitlementLedgerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EntitlementLedgerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EntitlementLedgerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EntitlementLedgerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelect<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    include?: Prisma.EntitlementLedgerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EntitlementLedgerCreateInput, Prisma.EntitlementLedgerUncheckedCreateInput>;
};
export type EntitlementLedgerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EntitlementLedgerCreateManyInput | Prisma.EntitlementLedgerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EntitlementLedgerCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    data: Prisma.EntitlementLedgerCreateManyInput | Prisma.EntitlementLedgerCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EntitlementLedgerIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EntitlementLedgerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelect<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    include?: Prisma.EntitlementLedgerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EntitlementLedgerUpdateInput, Prisma.EntitlementLedgerUncheckedUpdateInput>;
    where: Prisma.EntitlementLedgerWhereUniqueInput;
};
export type EntitlementLedgerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EntitlementLedgerUpdateManyMutationInput, Prisma.EntitlementLedgerUncheckedUpdateManyInput>;
    where?: Prisma.EntitlementLedgerWhereInput;
    limit?: number;
};
export type EntitlementLedgerUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EntitlementLedgerUpdateManyMutationInput, Prisma.EntitlementLedgerUncheckedUpdateManyInput>;
    where?: Prisma.EntitlementLedgerWhereInput;
    limit?: number;
    include?: Prisma.EntitlementLedgerIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EntitlementLedgerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelect<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    include?: Prisma.EntitlementLedgerInclude<ExtArgs> | null;
    where: Prisma.EntitlementLedgerWhereUniqueInput;
    create: Prisma.XOR<Prisma.EntitlementLedgerCreateInput, Prisma.EntitlementLedgerUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EntitlementLedgerUpdateInput, Prisma.EntitlementLedgerUncheckedUpdateInput>;
};
export type EntitlementLedgerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelect<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    include?: Prisma.EntitlementLedgerInclude<ExtArgs> | null;
    where: Prisma.EntitlementLedgerWhereUniqueInput;
};
export type EntitlementLedgerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntitlementLedgerWhereInput;
    limit?: number;
};
export type EntitlementLedger$membershipArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    where?: Prisma.MembershipWhereInput;
};
export type EntitlementLedgerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntitlementLedgerSelect<ExtArgs> | null;
    omit?: Prisma.EntitlementLedgerOmit<ExtArgs> | null;
    include?: Prisma.EntitlementLedgerInclude<ExtArgs> | null;
};
