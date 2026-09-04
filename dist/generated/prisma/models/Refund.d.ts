import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RefundModel = runtime.Types.Result.DefaultSelection<Prisma.$RefundPayload>;
export type AggregateRefund = {
    _count: RefundCountAggregateOutputType | null;
    _avg: RefundAvgAggregateOutputType | null;
    _sum: RefundSumAggregateOutputType | null;
    _min: RefundMinAggregateOutputType | null;
    _max: RefundMaxAggregateOutputType | null;
};
export type RefundAvgAggregateOutputType = {
    amount: number | null;
};
export type RefundSumAggregateOutputType = {
    amount: number | null;
};
export type RefundMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    amount: number | null;
    date: Date | null;
    reason: string | null;
    approvedById: string | null;
    createdAt: Date | null;
};
export type RefundMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    amount: number | null;
    date: Date | null;
    reason: string | null;
    approvedById: string | null;
    createdAt: Date | null;
};
export type RefundCountAggregateOutputType = {
    id: number;
    customerId: number;
    amount: number;
    date: number;
    reason: number;
    approvedById: number;
    createdAt: number;
    _all: number;
};
export type RefundAvgAggregateInputType = {
    amount?: true;
};
export type RefundSumAggregateInputType = {
    amount?: true;
};
export type RefundMinAggregateInputType = {
    id?: true;
    customerId?: true;
    amount?: true;
    date?: true;
    reason?: true;
    approvedById?: true;
    createdAt?: true;
};
export type RefundMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    amount?: true;
    date?: true;
    reason?: true;
    approvedById?: true;
    createdAt?: true;
};
export type RefundCountAggregateInputType = {
    id?: true;
    customerId?: true;
    amount?: true;
    date?: true;
    reason?: true;
    approvedById?: true;
    createdAt?: true;
    _all?: true;
};
export type RefundAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefundWhereInput;
    orderBy?: Prisma.RefundOrderByWithRelationInput | Prisma.RefundOrderByWithRelationInput[];
    cursor?: Prisma.RefundWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RefundCountAggregateInputType;
    _avg?: RefundAvgAggregateInputType;
    _sum?: RefundSumAggregateInputType;
    _min?: RefundMinAggregateInputType;
    _max?: RefundMaxAggregateInputType;
};
export type GetRefundAggregateType<T extends RefundAggregateArgs> = {
    [P in keyof T & keyof AggregateRefund]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRefund[P]> : Prisma.GetScalarType<T[P], AggregateRefund[P]>;
};
export type RefundGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefundWhereInput;
    orderBy?: Prisma.RefundOrderByWithAggregationInput | Prisma.RefundOrderByWithAggregationInput[];
    by: Prisma.RefundScalarFieldEnum[] | Prisma.RefundScalarFieldEnum;
    having?: Prisma.RefundScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RefundCountAggregateInputType | true;
    _avg?: RefundAvgAggregateInputType;
    _sum?: RefundSumAggregateInputType;
    _min?: RefundMinAggregateInputType;
    _max?: RefundMaxAggregateInputType;
};
export type RefundGroupByOutputType = {
    id: string;
    customerId: string;
    amount: number;
    date: Date;
    reason: string | null;
    approvedById: string | null;
    createdAt: Date;
    _count: RefundCountAggregateOutputType | null;
    _avg: RefundAvgAggregateOutputType | null;
    _sum: RefundSumAggregateOutputType | null;
    _min: RefundMinAggregateOutputType | null;
    _max: RefundMaxAggregateOutputType | null;
};
export type GetRefundGroupByPayload<T extends RefundGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RefundGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RefundGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RefundGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RefundGroupByOutputType[P]>;
}>>;
export type RefundWhereInput = {
    AND?: Prisma.RefundWhereInput | Prisma.RefundWhereInput[];
    OR?: Prisma.RefundWhereInput[];
    NOT?: Prisma.RefundWhereInput | Prisma.RefundWhereInput[];
    id?: Prisma.StringFilter<"Refund"> | string;
    customerId?: Prisma.StringFilter<"Refund"> | string;
    amount?: Prisma.FloatFilter<"Refund"> | number;
    date?: Prisma.DateTimeFilter<"Refund"> | Date | string;
    reason?: Prisma.StringNullableFilter<"Refund"> | string | null;
    approvedById?: Prisma.StringNullableFilter<"Refund"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Refund"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    approvedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type RefundOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    approvedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    approvedBy?: Prisma.UserOrderByWithRelationInput;
};
export type RefundWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RefundWhereInput | Prisma.RefundWhereInput[];
    OR?: Prisma.RefundWhereInput[];
    NOT?: Prisma.RefundWhereInput | Prisma.RefundWhereInput[];
    customerId?: Prisma.StringFilter<"Refund"> | string;
    amount?: Prisma.FloatFilter<"Refund"> | number;
    date?: Prisma.DateTimeFilter<"Refund"> | Date | string;
    reason?: Prisma.StringNullableFilter<"Refund"> | string | null;
    approvedById?: Prisma.StringNullableFilter<"Refund"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Refund"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    approvedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type RefundOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    approvedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RefundCountOrderByAggregateInput;
    _avg?: Prisma.RefundAvgOrderByAggregateInput;
    _max?: Prisma.RefundMaxOrderByAggregateInput;
    _min?: Prisma.RefundMinOrderByAggregateInput;
    _sum?: Prisma.RefundSumOrderByAggregateInput;
};
export type RefundScalarWhereWithAggregatesInput = {
    AND?: Prisma.RefundScalarWhereWithAggregatesInput | Prisma.RefundScalarWhereWithAggregatesInput[];
    OR?: Prisma.RefundScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RefundScalarWhereWithAggregatesInput | Prisma.RefundScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Refund"> | string;
    customerId?: Prisma.StringWithAggregatesFilter<"Refund"> | string;
    amount?: Prisma.FloatWithAggregatesFilter<"Refund"> | number;
    date?: Prisma.DateTimeWithAggregatesFilter<"Refund"> | Date | string;
    reason?: Prisma.StringNullableWithAggregatesFilter<"Refund"> | string | null;
    approvedById?: Prisma.StringNullableWithAggregatesFilter<"Refund"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Refund"> | Date | string;
};
export type RefundCreateInput = {
    id?: string;
    amount: number;
    date?: Date | string;
    reason?: string | null;
    createdAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutRefundsInput;
    approvedBy?: Prisma.UserCreateNestedOneWithoutApprovedRefundsInput;
};
export type RefundUncheckedCreateInput = {
    id?: string;
    customerId: string;
    amount: number;
    date?: Date | string;
    reason?: string | null;
    approvedById?: string | null;
    createdAt?: Date | string;
};
export type RefundUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutRefundsNestedInput;
    approvedBy?: Prisma.UserUpdateOneWithoutApprovedRefundsNestedInput;
};
export type RefundUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    approvedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefundCreateManyInput = {
    id?: string;
    customerId: string;
    amount: number;
    date?: Date | string;
    reason?: string | null;
    approvedById?: string | null;
    createdAt?: Date | string;
};
export type RefundUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefundUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    approvedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefundListRelationFilter = {
    every?: Prisma.RefundWhereInput;
    some?: Prisma.RefundWhereInput;
    none?: Prisma.RefundWhereInput;
};
export type RefundOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RefundCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RefundAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type RefundMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RefundMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RefundSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type RefundCreateNestedManyWithoutApprovedByInput = {
    create?: Prisma.XOR<Prisma.RefundCreateWithoutApprovedByInput, Prisma.RefundUncheckedCreateWithoutApprovedByInput> | Prisma.RefundCreateWithoutApprovedByInput[] | Prisma.RefundUncheckedCreateWithoutApprovedByInput[];
    connectOrCreate?: Prisma.RefundCreateOrConnectWithoutApprovedByInput | Prisma.RefundCreateOrConnectWithoutApprovedByInput[];
    createMany?: Prisma.RefundCreateManyApprovedByInputEnvelope;
    connect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
};
export type RefundUncheckedCreateNestedManyWithoutApprovedByInput = {
    create?: Prisma.XOR<Prisma.RefundCreateWithoutApprovedByInput, Prisma.RefundUncheckedCreateWithoutApprovedByInput> | Prisma.RefundCreateWithoutApprovedByInput[] | Prisma.RefundUncheckedCreateWithoutApprovedByInput[];
    connectOrCreate?: Prisma.RefundCreateOrConnectWithoutApprovedByInput | Prisma.RefundCreateOrConnectWithoutApprovedByInput[];
    createMany?: Prisma.RefundCreateManyApprovedByInputEnvelope;
    connect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
};
export type RefundUpdateManyWithoutApprovedByNestedInput = {
    create?: Prisma.XOR<Prisma.RefundCreateWithoutApprovedByInput, Prisma.RefundUncheckedCreateWithoutApprovedByInput> | Prisma.RefundCreateWithoutApprovedByInput[] | Prisma.RefundUncheckedCreateWithoutApprovedByInput[];
    connectOrCreate?: Prisma.RefundCreateOrConnectWithoutApprovedByInput | Prisma.RefundCreateOrConnectWithoutApprovedByInput[];
    upsert?: Prisma.RefundUpsertWithWhereUniqueWithoutApprovedByInput | Prisma.RefundUpsertWithWhereUniqueWithoutApprovedByInput[];
    createMany?: Prisma.RefundCreateManyApprovedByInputEnvelope;
    set?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    disconnect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    delete?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    connect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    update?: Prisma.RefundUpdateWithWhereUniqueWithoutApprovedByInput | Prisma.RefundUpdateWithWhereUniqueWithoutApprovedByInput[];
    updateMany?: Prisma.RefundUpdateManyWithWhereWithoutApprovedByInput | Prisma.RefundUpdateManyWithWhereWithoutApprovedByInput[];
    deleteMany?: Prisma.RefundScalarWhereInput | Prisma.RefundScalarWhereInput[];
};
export type RefundUncheckedUpdateManyWithoutApprovedByNestedInput = {
    create?: Prisma.XOR<Prisma.RefundCreateWithoutApprovedByInput, Prisma.RefundUncheckedCreateWithoutApprovedByInput> | Prisma.RefundCreateWithoutApprovedByInput[] | Prisma.RefundUncheckedCreateWithoutApprovedByInput[];
    connectOrCreate?: Prisma.RefundCreateOrConnectWithoutApprovedByInput | Prisma.RefundCreateOrConnectWithoutApprovedByInput[];
    upsert?: Prisma.RefundUpsertWithWhereUniqueWithoutApprovedByInput | Prisma.RefundUpsertWithWhereUniqueWithoutApprovedByInput[];
    createMany?: Prisma.RefundCreateManyApprovedByInputEnvelope;
    set?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    disconnect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    delete?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    connect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    update?: Prisma.RefundUpdateWithWhereUniqueWithoutApprovedByInput | Prisma.RefundUpdateWithWhereUniqueWithoutApprovedByInput[];
    updateMany?: Prisma.RefundUpdateManyWithWhereWithoutApprovedByInput | Prisma.RefundUpdateManyWithWhereWithoutApprovedByInput[];
    deleteMany?: Prisma.RefundScalarWhereInput | Prisma.RefundScalarWhereInput[];
};
export type RefundCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.RefundCreateWithoutCustomerInput, Prisma.RefundUncheckedCreateWithoutCustomerInput> | Prisma.RefundCreateWithoutCustomerInput[] | Prisma.RefundUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.RefundCreateOrConnectWithoutCustomerInput | Prisma.RefundCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.RefundCreateManyCustomerInputEnvelope;
    connect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
};
export type RefundUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.RefundCreateWithoutCustomerInput, Prisma.RefundUncheckedCreateWithoutCustomerInput> | Prisma.RefundCreateWithoutCustomerInput[] | Prisma.RefundUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.RefundCreateOrConnectWithoutCustomerInput | Prisma.RefundCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.RefundCreateManyCustomerInputEnvelope;
    connect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
};
export type RefundUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.RefundCreateWithoutCustomerInput, Prisma.RefundUncheckedCreateWithoutCustomerInput> | Prisma.RefundCreateWithoutCustomerInput[] | Prisma.RefundUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.RefundCreateOrConnectWithoutCustomerInput | Prisma.RefundCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.RefundUpsertWithWhereUniqueWithoutCustomerInput | Prisma.RefundUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.RefundCreateManyCustomerInputEnvelope;
    set?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    disconnect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    delete?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    connect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    update?: Prisma.RefundUpdateWithWhereUniqueWithoutCustomerInput | Prisma.RefundUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.RefundUpdateManyWithWhereWithoutCustomerInput | Prisma.RefundUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.RefundScalarWhereInput | Prisma.RefundScalarWhereInput[];
};
export type RefundUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.RefundCreateWithoutCustomerInput, Prisma.RefundUncheckedCreateWithoutCustomerInput> | Prisma.RefundCreateWithoutCustomerInput[] | Prisma.RefundUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.RefundCreateOrConnectWithoutCustomerInput | Prisma.RefundCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.RefundUpsertWithWhereUniqueWithoutCustomerInput | Prisma.RefundUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.RefundCreateManyCustomerInputEnvelope;
    set?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    disconnect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    delete?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    connect?: Prisma.RefundWhereUniqueInput | Prisma.RefundWhereUniqueInput[];
    update?: Prisma.RefundUpdateWithWhereUniqueWithoutCustomerInput | Prisma.RefundUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.RefundUpdateManyWithWhereWithoutCustomerInput | Prisma.RefundUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.RefundScalarWhereInput | Prisma.RefundScalarWhereInput[];
};
export type RefundCreateWithoutApprovedByInput = {
    id?: string;
    amount: number;
    date?: Date | string;
    reason?: string | null;
    createdAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutRefundsInput;
};
export type RefundUncheckedCreateWithoutApprovedByInput = {
    id?: string;
    customerId: string;
    amount: number;
    date?: Date | string;
    reason?: string | null;
    createdAt?: Date | string;
};
export type RefundCreateOrConnectWithoutApprovedByInput = {
    where: Prisma.RefundWhereUniqueInput;
    create: Prisma.XOR<Prisma.RefundCreateWithoutApprovedByInput, Prisma.RefundUncheckedCreateWithoutApprovedByInput>;
};
export type RefundCreateManyApprovedByInputEnvelope = {
    data: Prisma.RefundCreateManyApprovedByInput | Prisma.RefundCreateManyApprovedByInput[];
    skipDuplicates?: boolean;
};
export type RefundUpsertWithWhereUniqueWithoutApprovedByInput = {
    where: Prisma.RefundWhereUniqueInput;
    update: Prisma.XOR<Prisma.RefundUpdateWithoutApprovedByInput, Prisma.RefundUncheckedUpdateWithoutApprovedByInput>;
    create: Prisma.XOR<Prisma.RefundCreateWithoutApprovedByInput, Prisma.RefundUncheckedCreateWithoutApprovedByInput>;
};
export type RefundUpdateWithWhereUniqueWithoutApprovedByInput = {
    where: Prisma.RefundWhereUniqueInput;
    data: Prisma.XOR<Prisma.RefundUpdateWithoutApprovedByInput, Prisma.RefundUncheckedUpdateWithoutApprovedByInput>;
};
export type RefundUpdateManyWithWhereWithoutApprovedByInput = {
    where: Prisma.RefundScalarWhereInput;
    data: Prisma.XOR<Prisma.RefundUpdateManyMutationInput, Prisma.RefundUncheckedUpdateManyWithoutApprovedByInput>;
};
export type RefundScalarWhereInput = {
    AND?: Prisma.RefundScalarWhereInput | Prisma.RefundScalarWhereInput[];
    OR?: Prisma.RefundScalarWhereInput[];
    NOT?: Prisma.RefundScalarWhereInput | Prisma.RefundScalarWhereInput[];
    id?: Prisma.StringFilter<"Refund"> | string;
    customerId?: Prisma.StringFilter<"Refund"> | string;
    amount?: Prisma.FloatFilter<"Refund"> | number;
    date?: Prisma.DateTimeFilter<"Refund"> | Date | string;
    reason?: Prisma.StringNullableFilter<"Refund"> | string | null;
    approvedById?: Prisma.StringNullableFilter<"Refund"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Refund"> | Date | string;
};
export type RefundCreateWithoutCustomerInput = {
    id?: string;
    amount: number;
    date?: Date | string;
    reason?: string | null;
    createdAt?: Date | string;
    approvedBy?: Prisma.UserCreateNestedOneWithoutApprovedRefundsInput;
};
export type RefundUncheckedCreateWithoutCustomerInput = {
    id?: string;
    amount: number;
    date?: Date | string;
    reason?: string | null;
    approvedById?: string | null;
    createdAt?: Date | string;
};
export type RefundCreateOrConnectWithoutCustomerInput = {
    where: Prisma.RefundWhereUniqueInput;
    create: Prisma.XOR<Prisma.RefundCreateWithoutCustomerInput, Prisma.RefundUncheckedCreateWithoutCustomerInput>;
};
export type RefundCreateManyCustomerInputEnvelope = {
    data: Prisma.RefundCreateManyCustomerInput | Prisma.RefundCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type RefundUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.RefundWhereUniqueInput;
    update: Prisma.XOR<Prisma.RefundUpdateWithoutCustomerInput, Prisma.RefundUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.RefundCreateWithoutCustomerInput, Prisma.RefundUncheckedCreateWithoutCustomerInput>;
};
export type RefundUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.RefundWhereUniqueInput;
    data: Prisma.XOR<Prisma.RefundUpdateWithoutCustomerInput, Prisma.RefundUncheckedUpdateWithoutCustomerInput>;
};
export type RefundUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.RefundScalarWhereInput;
    data: Prisma.XOR<Prisma.RefundUpdateManyMutationInput, Prisma.RefundUncheckedUpdateManyWithoutCustomerInput>;
};
export type RefundCreateManyApprovedByInput = {
    id?: string;
    customerId: string;
    amount: number;
    date?: Date | string;
    reason?: string | null;
    createdAt?: Date | string;
};
export type RefundUpdateWithoutApprovedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutRefundsNestedInput;
};
export type RefundUncheckedUpdateWithoutApprovedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefundUncheckedUpdateManyWithoutApprovedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefundCreateManyCustomerInput = {
    id?: string;
    amount: number;
    date?: Date | string;
    reason?: string | null;
    approvedById?: string | null;
    createdAt?: Date | string;
};
export type RefundUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    approvedBy?: Prisma.UserUpdateOneWithoutApprovedRefundsNestedInput;
};
export type RefundUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    approvedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefundUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    approvedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RefundSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    amount?: boolean;
    date?: boolean;
    reason?: boolean;
    approvedById?: boolean;
    createdAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    approvedBy?: boolean | Prisma.Refund$approvedByArgs<ExtArgs>;
}, ExtArgs["result"]["refund"]>;
export type RefundSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    amount?: boolean;
    date?: boolean;
    reason?: boolean;
    approvedById?: boolean;
    createdAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    approvedBy?: boolean | Prisma.Refund$approvedByArgs<ExtArgs>;
}, ExtArgs["result"]["refund"]>;
export type RefundSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    amount?: boolean;
    date?: boolean;
    reason?: boolean;
    approvedById?: boolean;
    createdAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    approvedBy?: boolean | Prisma.Refund$approvedByArgs<ExtArgs>;
}, ExtArgs["result"]["refund"]>;
export type RefundSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    amount?: boolean;
    date?: boolean;
    reason?: boolean;
    approvedById?: boolean;
    createdAt?: boolean;
};
export type RefundOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerId" | "amount" | "date" | "reason" | "approvedById" | "createdAt", ExtArgs["result"]["refund"]>;
export type RefundInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    approvedBy?: boolean | Prisma.Refund$approvedByArgs<ExtArgs>;
};
export type RefundIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    approvedBy?: boolean | Prisma.Refund$approvedByArgs<ExtArgs>;
};
export type RefundIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    approvedBy?: boolean | Prisma.Refund$approvedByArgs<ExtArgs>;
};
export type $RefundPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Refund";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs>;
        approvedBy: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerId: string;
        amount: number;
        date: Date;
        reason: string | null;
        approvedById: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["refund"]>;
    composites: {};
};
export type RefundGetPayload<S extends boolean | null | undefined | RefundDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RefundPayload, S>;
export type RefundCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RefundFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RefundCountAggregateInputType | true;
};
export interface RefundDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Refund'];
        meta: {
            name: 'Refund';
        };
    };
    findUnique<T extends RefundFindUniqueArgs>(args: Prisma.SelectSubset<T, RefundFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RefundClient<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RefundFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RefundFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RefundClient<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RefundFindFirstArgs>(args?: Prisma.SelectSubset<T, RefundFindFirstArgs<ExtArgs>>): Prisma.Prisma__RefundClient<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RefundFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RefundFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RefundClient<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RefundFindManyArgs>(args?: Prisma.SelectSubset<T, RefundFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RefundCreateArgs>(args: Prisma.SelectSubset<T, RefundCreateArgs<ExtArgs>>): Prisma.Prisma__RefundClient<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RefundCreateManyArgs>(args?: Prisma.SelectSubset<T, RefundCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RefundCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RefundCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RefundDeleteArgs>(args: Prisma.SelectSubset<T, RefundDeleteArgs<ExtArgs>>): Prisma.Prisma__RefundClient<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RefundUpdateArgs>(args: Prisma.SelectSubset<T, RefundUpdateArgs<ExtArgs>>): Prisma.Prisma__RefundClient<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RefundDeleteManyArgs>(args?: Prisma.SelectSubset<T, RefundDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RefundUpdateManyArgs>(args: Prisma.SelectSubset<T, RefundUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RefundUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RefundUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RefundUpsertArgs>(args: Prisma.SelectSubset<T, RefundUpsertArgs<ExtArgs>>): Prisma.Prisma__RefundClient<runtime.Types.Result.GetResult<Prisma.$RefundPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RefundCountArgs>(args?: Prisma.Subset<T, RefundCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RefundCountAggregateOutputType> : number>;
    aggregate<T extends RefundAggregateArgs>(args: Prisma.Subset<T, RefundAggregateArgs>): Prisma.PrismaPromise<GetRefundAggregateType<T>>;
    groupBy<T extends RefundGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RefundGroupByArgs['orderBy'];
    } : {
        orderBy?: RefundGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RefundGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefundGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RefundFieldRefs;
}
export interface Prisma__RefundClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.CustomerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    approvedBy<T extends Prisma.Refund$approvedByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Refund$approvedByArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RefundFieldRefs {
    readonly id: Prisma.FieldRef<"Refund", 'String'>;
    readonly customerId: Prisma.FieldRef<"Refund", 'String'>;
    readonly amount: Prisma.FieldRef<"Refund", 'Float'>;
    readonly date: Prisma.FieldRef<"Refund", 'DateTime'>;
    readonly reason: Prisma.FieldRef<"Refund", 'String'>;
    readonly approvedById: Prisma.FieldRef<"Refund", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Refund", 'DateTime'>;
}
export type RefundFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelect<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    include?: Prisma.RefundInclude<ExtArgs> | null;
    where: Prisma.RefundWhereUniqueInput;
};
export type RefundFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelect<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    include?: Prisma.RefundInclude<ExtArgs> | null;
    where: Prisma.RefundWhereUniqueInput;
};
export type RefundFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RefundFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RefundFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RefundCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelect<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    include?: Prisma.RefundInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RefundCreateInput, Prisma.RefundUncheckedCreateInput>;
};
export type RefundCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RefundCreateManyInput | Prisma.RefundCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RefundCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    data: Prisma.RefundCreateManyInput | Prisma.RefundCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RefundIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RefundUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelect<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    include?: Prisma.RefundInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RefundUpdateInput, Prisma.RefundUncheckedUpdateInput>;
    where: Prisma.RefundWhereUniqueInput;
};
export type RefundUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RefundUpdateManyMutationInput, Prisma.RefundUncheckedUpdateManyInput>;
    where?: Prisma.RefundWhereInput;
    limit?: number;
};
export type RefundUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RefundUpdateManyMutationInput, Prisma.RefundUncheckedUpdateManyInput>;
    where?: Prisma.RefundWhereInput;
    limit?: number;
    include?: Prisma.RefundIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RefundUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelect<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    include?: Prisma.RefundInclude<ExtArgs> | null;
    where: Prisma.RefundWhereUniqueInput;
    create: Prisma.XOR<Prisma.RefundCreateInput, Prisma.RefundUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RefundUpdateInput, Prisma.RefundUncheckedUpdateInput>;
};
export type RefundDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelect<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    include?: Prisma.RefundInclude<ExtArgs> | null;
    where: Prisma.RefundWhereUniqueInput;
};
export type RefundDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefundWhereInput;
    limit?: number;
};
export type Refund$approvedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type RefundDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RefundSelect<ExtArgs> | null;
    omit?: Prisma.RefundOmit<ExtArgs> | null;
    include?: Prisma.RefundInclude<ExtArgs> | null;
};
