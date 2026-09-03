import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type IncentiveRecordModel = runtime.Types.Result.DefaultSelection<Prisma.$IncentiveRecordPayload>;
export type AggregateIncentiveRecord = {
    _count: IncentiveRecordCountAggregateOutputType | null;
    _avg: IncentiveRecordAvgAggregateOutputType | null;
    _sum: IncentiveRecordSumAggregateOutputType | null;
    _min: IncentiveRecordMinAggregateOutputType | null;
    _max: IncentiveRecordMaxAggregateOutputType | null;
};
export type IncentiveRecordAvgAggregateOutputType = {
    totalSales: number | null;
    eligibleSales: number | null;
    incentiveEarned: number | null;
    incentivePaid: number | null;
};
export type IncentiveRecordSumAggregateOutputType = {
    totalSales: number | null;
    eligibleSales: number | null;
    incentiveEarned: number | null;
    incentivePaid: number | null;
};
export type IncentiveRecordMinAggregateOutputType = {
    id: string | null;
    executiveId: string | null;
    period: string | null;
    totalSales: number | null;
    eligibleSales: number | null;
    incentiveEarned: number | null;
    incentivePaid: number | null;
    status: $Enums.IncentiveStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IncentiveRecordMaxAggregateOutputType = {
    id: string | null;
    executiveId: string | null;
    period: string | null;
    totalSales: number | null;
    eligibleSales: number | null;
    incentiveEarned: number | null;
    incentivePaid: number | null;
    status: $Enums.IncentiveStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IncentiveRecordCountAggregateOutputType = {
    id: number;
    executiveId: number;
    period: number;
    totalSales: number;
    eligibleSales: number;
    incentiveEarned: number;
    incentivePaid: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type IncentiveRecordAvgAggregateInputType = {
    totalSales?: true;
    eligibleSales?: true;
    incentiveEarned?: true;
    incentivePaid?: true;
};
export type IncentiveRecordSumAggregateInputType = {
    totalSales?: true;
    eligibleSales?: true;
    incentiveEarned?: true;
    incentivePaid?: true;
};
export type IncentiveRecordMinAggregateInputType = {
    id?: true;
    executiveId?: true;
    period?: true;
    totalSales?: true;
    eligibleSales?: true;
    incentiveEarned?: true;
    incentivePaid?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IncentiveRecordMaxAggregateInputType = {
    id?: true;
    executiveId?: true;
    period?: true;
    totalSales?: true;
    eligibleSales?: true;
    incentiveEarned?: true;
    incentivePaid?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IncentiveRecordCountAggregateInputType = {
    id?: true;
    executiveId?: true;
    period?: true;
    totalSales?: true;
    eligibleSales?: true;
    incentiveEarned?: true;
    incentivePaid?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type IncentiveRecordAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IncentiveRecordWhereInput;
    orderBy?: Prisma.IncentiveRecordOrderByWithRelationInput | Prisma.IncentiveRecordOrderByWithRelationInput[];
    cursor?: Prisma.IncentiveRecordWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | IncentiveRecordCountAggregateInputType;
    _avg?: IncentiveRecordAvgAggregateInputType;
    _sum?: IncentiveRecordSumAggregateInputType;
    _min?: IncentiveRecordMinAggregateInputType;
    _max?: IncentiveRecordMaxAggregateInputType;
};
export type GetIncentiveRecordAggregateType<T extends IncentiveRecordAggregateArgs> = {
    [P in keyof T & keyof AggregateIncentiveRecord]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIncentiveRecord[P]> : Prisma.GetScalarType<T[P], AggregateIncentiveRecord[P]>;
};
export type IncentiveRecordGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IncentiveRecordWhereInput;
    orderBy?: Prisma.IncentiveRecordOrderByWithAggregationInput | Prisma.IncentiveRecordOrderByWithAggregationInput[];
    by: Prisma.IncentiveRecordScalarFieldEnum[] | Prisma.IncentiveRecordScalarFieldEnum;
    having?: Prisma.IncentiveRecordScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IncentiveRecordCountAggregateInputType | true;
    _avg?: IncentiveRecordAvgAggregateInputType;
    _sum?: IncentiveRecordSumAggregateInputType;
    _min?: IncentiveRecordMinAggregateInputType;
    _max?: IncentiveRecordMaxAggregateInputType;
};
export type IncentiveRecordGroupByOutputType = {
    id: string;
    executiveId: string;
    period: string;
    totalSales: number;
    eligibleSales: number;
    incentiveEarned: number;
    incentivePaid: number;
    status: $Enums.IncentiveStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: IncentiveRecordCountAggregateOutputType | null;
    _avg: IncentiveRecordAvgAggregateOutputType | null;
    _sum: IncentiveRecordSumAggregateOutputType | null;
    _min: IncentiveRecordMinAggregateOutputType | null;
    _max: IncentiveRecordMaxAggregateOutputType | null;
};
export type GetIncentiveRecordGroupByPayload<T extends IncentiveRecordGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<IncentiveRecordGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof IncentiveRecordGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], IncentiveRecordGroupByOutputType[P]> : Prisma.GetScalarType<T[P], IncentiveRecordGroupByOutputType[P]>;
}>>;
export type IncentiveRecordWhereInput = {
    AND?: Prisma.IncentiveRecordWhereInput | Prisma.IncentiveRecordWhereInput[];
    OR?: Prisma.IncentiveRecordWhereInput[];
    NOT?: Prisma.IncentiveRecordWhereInput | Prisma.IncentiveRecordWhereInput[];
    id?: Prisma.StringFilter<"IncentiveRecord"> | string;
    executiveId?: Prisma.StringFilter<"IncentiveRecord"> | string;
    period?: Prisma.StringFilter<"IncentiveRecord"> | string;
    totalSales?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    eligibleSales?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    incentiveEarned?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    incentivePaid?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    status?: Prisma.EnumIncentiveStatusFilter<"IncentiveRecord"> | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFilter<"IncentiveRecord"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"IncentiveRecord"> | Date | string;
    executive?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type IncentiveRecordOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    executiveId?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    totalSales?: Prisma.SortOrder;
    eligibleSales?: Prisma.SortOrder;
    incentiveEarned?: Prisma.SortOrder;
    incentivePaid?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    executive?: Prisma.UserOrderByWithRelationInput;
};
export type IncentiveRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    executiveId_period?: Prisma.IncentiveRecordExecutiveIdPeriodCompoundUniqueInput;
    AND?: Prisma.IncentiveRecordWhereInput | Prisma.IncentiveRecordWhereInput[];
    OR?: Prisma.IncentiveRecordWhereInput[];
    NOT?: Prisma.IncentiveRecordWhereInput | Prisma.IncentiveRecordWhereInput[];
    executiveId?: Prisma.StringFilter<"IncentiveRecord"> | string;
    period?: Prisma.StringFilter<"IncentiveRecord"> | string;
    totalSales?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    eligibleSales?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    incentiveEarned?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    incentivePaid?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    status?: Prisma.EnumIncentiveStatusFilter<"IncentiveRecord"> | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFilter<"IncentiveRecord"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"IncentiveRecord"> | Date | string;
    executive?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "executiveId_period">;
export type IncentiveRecordOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    executiveId?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    totalSales?: Prisma.SortOrder;
    eligibleSales?: Prisma.SortOrder;
    incentiveEarned?: Prisma.SortOrder;
    incentivePaid?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.IncentiveRecordCountOrderByAggregateInput;
    _avg?: Prisma.IncentiveRecordAvgOrderByAggregateInput;
    _max?: Prisma.IncentiveRecordMaxOrderByAggregateInput;
    _min?: Prisma.IncentiveRecordMinOrderByAggregateInput;
    _sum?: Prisma.IncentiveRecordSumOrderByAggregateInput;
};
export type IncentiveRecordScalarWhereWithAggregatesInput = {
    AND?: Prisma.IncentiveRecordScalarWhereWithAggregatesInput | Prisma.IncentiveRecordScalarWhereWithAggregatesInput[];
    OR?: Prisma.IncentiveRecordScalarWhereWithAggregatesInput[];
    NOT?: Prisma.IncentiveRecordScalarWhereWithAggregatesInput | Prisma.IncentiveRecordScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"IncentiveRecord"> | string;
    executiveId?: Prisma.StringWithAggregatesFilter<"IncentiveRecord"> | string;
    period?: Prisma.StringWithAggregatesFilter<"IncentiveRecord"> | string;
    totalSales?: Prisma.FloatWithAggregatesFilter<"IncentiveRecord"> | number;
    eligibleSales?: Prisma.FloatWithAggregatesFilter<"IncentiveRecord"> | number;
    incentiveEarned?: Prisma.FloatWithAggregatesFilter<"IncentiveRecord"> | number;
    incentivePaid?: Prisma.FloatWithAggregatesFilter<"IncentiveRecord"> | number;
    status?: Prisma.EnumIncentiveStatusWithAggregatesFilter<"IncentiveRecord"> | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"IncentiveRecord"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"IncentiveRecord"> | Date | string;
};
export type IncentiveRecordCreateInput = {
    id?: string;
    period: string;
    totalSales?: number;
    eligibleSales?: number;
    incentiveEarned?: number;
    incentivePaid?: number;
    status?: $Enums.IncentiveStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    executive: Prisma.UserCreateNestedOneWithoutIncentiveRecordsInput;
};
export type IncentiveRecordUncheckedCreateInput = {
    id?: string;
    executiveId: string;
    period: string;
    totalSales?: number;
    eligibleSales?: number;
    incentiveEarned?: number;
    incentivePaid?: number;
    status?: $Enums.IncentiveStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IncentiveRecordUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    totalSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    eligibleSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentiveEarned?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentivePaid?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.EnumIncentiveStatusFieldUpdateOperationsInput | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    executive?: Prisma.UserUpdateOneRequiredWithoutIncentiveRecordsNestedInput;
};
export type IncentiveRecordUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    executiveId?: Prisma.StringFieldUpdateOperationsInput | string;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    totalSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    eligibleSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentiveEarned?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentivePaid?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.EnumIncentiveStatusFieldUpdateOperationsInput | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRecordCreateManyInput = {
    id?: string;
    executiveId: string;
    period: string;
    totalSales?: number;
    eligibleSales?: number;
    incentiveEarned?: number;
    incentivePaid?: number;
    status?: $Enums.IncentiveStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IncentiveRecordUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    totalSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    eligibleSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentiveEarned?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentivePaid?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.EnumIncentiveStatusFieldUpdateOperationsInput | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRecordUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    executiveId?: Prisma.StringFieldUpdateOperationsInput | string;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    totalSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    eligibleSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentiveEarned?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentivePaid?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.EnumIncentiveStatusFieldUpdateOperationsInput | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRecordListRelationFilter = {
    every?: Prisma.IncentiveRecordWhereInput;
    some?: Prisma.IncentiveRecordWhereInput;
    none?: Prisma.IncentiveRecordWhereInput;
};
export type IncentiveRecordOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type IncentiveRecordExecutiveIdPeriodCompoundUniqueInput = {
    executiveId: string;
    period: string;
};
export type IncentiveRecordCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    executiveId?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    totalSales?: Prisma.SortOrder;
    eligibleSales?: Prisma.SortOrder;
    incentiveEarned?: Prisma.SortOrder;
    incentivePaid?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IncentiveRecordAvgOrderByAggregateInput = {
    totalSales?: Prisma.SortOrder;
    eligibleSales?: Prisma.SortOrder;
    incentiveEarned?: Prisma.SortOrder;
    incentivePaid?: Prisma.SortOrder;
};
export type IncentiveRecordMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    executiveId?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    totalSales?: Prisma.SortOrder;
    eligibleSales?: Prisma.SortOrder;
    incentiveEarned?: Prisma.SortOrder;
    incentivePaid?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IncentiveRecordMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    executiveId?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    totalSales?: Prisma.SortOrder;
    eligibleSales?: Prisma.SortOrder;
    incentiveEarned?: Prisma.SortOrder;
    incentivePaid?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IncentiveRecordSumOrderByAggregateInput = {
    totalSales?: Prisma.SortOrder;
    eligibleSales?: Prisma.SortOrder;
    incentiveEarned?: Prisma.SortOrder;
    incentivePaid?: Prisma.SortOrder;
};
export type IncentiveRecordCreateNestedManyWithoutExecutiveInput = {
    create?: Prisma.XOR<Prisma.IncentiveRecordCreateWithoutExecutiveInput, Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput> | Prisma.IncentiveRecordCreateWithoutExecutiveInput[] | Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput[];
    connectOrCreate?: Prisma.IncentiveRecordCreateOrConnectWithoutExecutiveInput | Prisma.IncentiveRecordCreateOrConnectWithoutExecutiveInput[];
    createMany?: Prisma.IncentiveRecordCreateManyExecutiveInputEnvelope;
    connect?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
};
export type IncentiveRecordUncheckedCreateNestedManyWithoutExecutiveInput = {
    create?: Prisma.XOR<Prisma.IncentiveRecordCreateWithoutExecutiveInput, Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput> | Prisma.IncentiveRecordCreateWithoutExecutiveInput[] | Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput[];
    connectOrCreate?: Prisma.IncentiveRecordCreateOrConnectWithoutExecutiveInput | Prisma.IncentiveRecordCreateOrConnectWithoutExecutiveInput[];
    createMany?: Prisma.IncentiveRecordCreateManyExecutiveInputEnvelope;
    connect?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
};
export type IncentiveRecordUpdateManyWithoutExecutiveNestedInput = {
    create?: Prisma.XOR<Prisma.IncentiveRecordCreateWithoutExecutiveInput, Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput> | Prisma.IncentiveRecordCreateWithoutExecutiveInput[] | Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput[];
    connectOrCreate?: Prisma.IncentiveRecordCreateOrConnectWithoutExecutiveInput | Prisma.IncentiveRecordCreateOrConnectWithoutExecutiveInput[];
    upsert?: Prisma.IncentiveRecordUpsertWithWhereUniqueWithoutExecutiveInput | Prisma.IncentiveRecordUpsertWithWhereUniqueWithoutExecutiveInput[];
    createMany?: Prisma.IncentiveRecordCreateManyExecutiveInputEnvelope;
    set?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
    disconnect?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
    delete?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
    connect?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
    update?: Prisma.IncentiveRecordUpdateWithWhereUniqueWithoutExecutiveInput | Prisma.IncentiveRecordUpdateWithWhereUniqueWithoutExecutiveInput[];
    updateMany?: Prisma.IncentiveRecordUpdateManyWithWhereWithoutExecutiveInput | Prisma.IncentiveRecordUpdateManyWithWhereWithoutExecutiveInput[];
    deleteMany?: Prisma.IncentiveRecordScalarWhereInput | Prisma.IncentiveRecordScalarWhereInput[];
};
export type IncentiveRecordUncheckedUpdateManyWithoutExecutiveNestedInput = {
    create?: Prisma.XOR<Prisma.IncentiveRecordCreateWithoutExecutiveInput, Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput> | Prisma.IncentiveRecordCreateWithoutExecutiveInput[] | Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput[];
    connectOrCreate?: Prisma.IncentiveRecordCreateOrConnectWithoutExecutiveInput | Prisma.IncentiveRecordCreateOrConnectWithoutExecutiveInput[];
    upsert?: Prisma.IncentiveRecordUpsertWithWhereUniqueWithoutExecutiveInput | Prisma.IncentiveRecordUpsertWithWhereUniqueWithoutExecutiveInput[];
    createMany?: Prisma.IncentiveRecordCreateManyExecutiveInputEnvelope;
    set?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
    disconnect?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
    delete?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
    connect?: Prisma.IncentiveRecordWhereUniqueInput | Prisma.IncentiveRecordWhereUniqueInput[];
    update?: Prisma.IncentiveRecordUpdateWithWhereUniqueWithoutExecutiveInput | Prisma.IncentiveRecordUpdateWithWhereUniqueWithoutExecutiveInput[];
    updateMany?: Prisma.IncentiveRecordUpdateManyWithWhereWithoutExecutiveInput | Prisma.IncentiveRecordUpdateManyWithWhereWithoutExecutiveInput[];
    deleteMany?: Prisma.IncentiveRecordScalarWhereInput | Prisma.IncentiveRecordScalarWhereInput[];
};
export type EnumIncentiveStatusFieldUpdateOperationsInput = {
    set?: $Enums.IncentiveStatus;
};
export type IncentiveRecordCreateWithoutExecutiveInput = {
    id?: string;
    period: string;
    totalSales?: number;
    eligibleSales?: number;
    incentiveEarned?: number;
    incentivePaid?: number;
    status?: $Enums.IncentiveStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IncentiveRecordUncheckedCreateWithoutExecutiveInput = {
    id?: string;
    period: string;
    totalSales?: number;
    eligibleSales?: number;
    incentiveEarned?: number;
    incentivePaid?: number;
    status?: $Enums.IncentiveStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IncentiveRecordCreateOrConnectWithoutExecutiveInput = {
    where: Prisma.IncentiveRecordWhereUniqueInput;
    create: Prisma.XOR<Prisma.IncentiveRecordCreateWithoutExecutiveInput, Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput>;
};
export type IncentiveRecordCreateManyExecutiveInputEnvelope = {
    data: Prisma.IncentiveRecordCreateManyExecutiveInput | Prisma.IncentiveRecordCreateManyExecutiveInput[];
    skipDuplicates?: boolean;
};
export type IncentiveRecordUpsertWithWhereUniqueWithoutExecutiveInput = {
    where: Prisma.IncentiveRecordWhereUniqueInput;
    update: Prisma.XOR<Prisma.IncentiveRecordUpdateWithoutExecutiveInput, Prisma.IncentiveRecordUncheckedUpdateWithoutExecutiveInput>;
    create: Prisma.XOR<Prisma.IncentiveRecordCreateWithoutExecutiveInput, Prisma.IncentiveRecordUncheckedCreateWithoutExecutiveInput>;
};
export type IncentiveRecordUpdateWithWhereUniqueWithoutExecutiveInput = {
    where: Prisma.IncentiveRecordWhereUniqueInput;
    data: Prisma.XOR<Prisma.IncentiveRecordUpdateWithoutExecutiveInput, Prisma.IncentiveRecordUncheckedUpdateWithoutExecutiveInput>;
};
export type IncentiveRecordUpdateManyWithWhereWithoutExecutiveInput = {
    where: Prisma.IncentiveRecordScalarWhereInput;
    data: Prisma.XOR<Prisma.IncentiveRecordUpdateManyMutationInput, Prisma.IncentiveRecordUncheckedUpdateManyWithoutExecutiveInput>;
};
export type IncentiveRecordScalarWhereInput = {
    AND?: Prisma.IncentiveRecordScalarWhereInput | Prisma.IncentiveRecordScalarWhereInput[];
    OR?: Prisma.IncentiveRecordScalarWhereInput[];
    NOT?: Prisma.IncentiveRecordScalarWhereInput | Prisma.IncentiveRecordScalarWhereInput[];
    id?: Prisma.StringFilter<"IncentiveRecord"> | string;
    executiveId?: Prisma.StringFilter<"IncentiveRecord"> | string;
    period?: Prisma.StringFilter<"IncentiveRecord"> | string;
    totalSales?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    eligibleSales?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    incentiveEarned?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    incentivePaid?: Prisma.FloatFilter<"IncentiveRecord"> | number;
    status?: Prisma.EnumIncentiveStatusFilter<"IncentiveRecord"> | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFilter<"IncentiveRecord"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"IncentiveRecord"> | Date | string;
};
export type IncentiveRecordCreateManyExecutiveInput = {
    id?: string;
    period: string;
    totalSales?: number;
    eligibleSales?: number;
    incentiveEarned?: number;
    incentivePaid?: number;
    status?: $Enums.IncentiveStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IncentiveRecordUpdateWithoutExecutiveInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    totalSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    eligibleSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentiveEarned?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentivePaid?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.EnumIncentiveStatusFieldUpdateOperationsInput | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRecordUncheckedUpdateWithoutExecutiveInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    totalSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    eligibleSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentiveEarned?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentivePaid?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.EnumIncentiveStatusFieldUpdateOperationsInput | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRecordUncheckedUpdateManyWithoutExecutiveInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    totalSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    eligibleSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentiveEarned?: Prisma.FloatFieldUpdateOperationsInput | number;
    incentivePaid?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.EnumIncentiveStatusFieldUpdateOperationsInput | $Enums.IncentiveStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRecordSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    executiveId?: boolean;
    period?: boolean;
    totalSales?: boolean;
    eligibleSales?: boolean;
    incentiveEarned?: boolean;
    incentivePaid?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    executive?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["incentiveRecord"]>;
export type IncentiveRecordSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    executiveId?: boolean;
    period?: boolean;
    totalSales?: boolean;
    eligibleSales?: boolean;
    incentiveEarned?: boolean;
    incentivePaid?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    executive?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["incentiveRecord"]>;
export type IncentiveRecordSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    executiveId?: boolean;
    period?: boolean;
    totalSales?: boolean;
    eligibleSales?: boolean;
    incentiveEarned?: boolean;
    incentivePaid?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    executive?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["incentiveRecord"]>;
export type IncentiveRecordSelectScalar = {
    id?: boolean;
    executiveId?: boolean;
    period?: boolean;
    totalSales?: boolean;
    eligibleSales?: boolean;
    incentiveEarned?: boolean;
    incentivePaid?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type IncentiveRecordOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "executiveId" | "period" | "totalSales" | "eligibleSales" | "incentiveEarned" | "incentivePaid" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["incentiveRecord"]>;
export type IncentiveRecordInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    executive?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type IncentiveRecordIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    executive?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type IncentiveRecordIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    executive?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $IncentiveRecordPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "IncentiveRecord";
    objects: {
        executive: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        executiveId: string;
        period: string;
        totalSales: number;
        eligibleSales: number;
        incentiveEarned: number;
        incentivePaid: number;
        status: $Enums.IncentiveStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["incentiveRecord"]>;
    composites: {};
};
export type IncentiveRecordGetPayload<S extends boolean | null | undefined | IncentiveRecordDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload, S>;
export type IncentiveRecordCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<IncentiveRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: IncentiveRecordCountAggregateInputType | true;
};
export interface IncentiveRecordDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['IncentiveRecord'];
        meta: {
            name: 'IncentiveRecord';
        };
    };
    findUnique<T extends IncentiveRecordFindUniqueArgs>(args: Prisma.SelectSubset<T, IncentiveRecordFindUniqueArgs<ExtArgs>>): Prisma.Prisma__IncentiveRecordClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends IncentiveRecordFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, IncentiveRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__IncentiveRecordClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends IncentiveRecordFindFirstArgs>(args?: Prisma.SelectSubset<T, IncentiveRecordFindFirstArgs<ExtArgs>>): Prisma.Prisma__IncentiveRecordClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends IncentiveRecordFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, IncentiveRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__IncentiveRecordClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends IncentiveRecordFindManyArgs>(args?: Prisma.SelectSubset<T, IncentiveRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends IncentiveRecordCreateArgs>(args: Prisma.SelectSubset<T, IncentiveRecordCreateArgs<ExtArgs>>): Prisma.Prisma__IncentiveRecordClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends IncentiveRecordCreateManyArgs>(args?: Prisma.SelectSubset<T, IncentiveRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends IncentiveRecordCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, IncentiveRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends IncentiveRecordDeleteArgs>(args: Prisma.SelectSubset<T, IncentiveRecordDeleteArgs<ExtArgs>>): Prisma.Prisma__IncentiveRecordClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends IncentiveRecordUpdateArgs>(args: Prisma.SelectSubset<T, IncentiveRecordUpdateArgs<ExtArgs>>): Prisma.Prisma__IncentiveRecordClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends IncentiveRecordDeleteManyArgs>(args?: Prisma.SelectSubset<T, IncentiveRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends IncentiveRecordUpdateManyArgs>(args: Prisma.SelectSubset<T, IncentiveRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends IncentiveRecordUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, IncentiveRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends IncentiveRecordUpsertArgs>(args: Prisma.SelectSubset<T, IncentiveRecordUpsertArgs<ExtArgs>>): Prisma.Prisma__IncentiveRecordClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends IncentiveRecordCountArgs>(args?: Prisma.Subset<T, IncentiveRecordCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], IncentiveRecordCountAggregateOutputType> : number>;
    aggregate<T extends IncentiveRecordAggregateArgs>(args: Prisma.Subset<T, IncentiveRecordAggregateArgs>): Prisma.PrismaPromise<GetIncentiveRecordAggregateType<T>>;
    groupBy<T extends IncentiveRecordGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: IncentiveRecordGroupByArgs['orderBy'];
    } : {
        orderBy?: IncentiveRecordGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, IncentiveRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIncentiveRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: IncentiveRecordFieldRefs;
}
export interface Prisma__IncentiveRecordClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    executive<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface IncentiveRecordFieldRefs {
    readonly id: Prisma.FieldRef<"IncentiveRecord", 'String'>;
    readonly executiveId: Prisma.FieldRef<"IncentiveRecord", 'String'>;
    readonly period: Prisma.FieldRef<"IncentiveRecord", 'String'>;
    readonly totalSales: Prisma.FieldRef<"IncentiveRecord", 'Float'>;
    readonly eligibleSales: Prisma.FieldRef<"IncentiveRecord", 'Float'>;
    readonly incentiveEarned: Prisma.FieldRef<"IncentiveRecord", 'Float'>;
    readonly incentivePaid: Prisma.FieldRef<"IncentiveRecord", 'Float'>;
    readonly status: Prisma.FieldRef<"IncentiveRecord", 'IncentiveStatus'>;
    readonly createdAt: Prisma.FieldRef<"IncentiveRecord", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"IncentiveRecord", 'DateTime'>;
}
export type IncentiveRecordFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    include?: Prisma.IncentiveRecordInclude<ExtArgs> | null;
    where: Prisma.IncentiveRecordWhereUniqueInput;
};
export type IncentiveRecordFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    include?: Prisma.IncentiveRecordInclude<ExtArgs> | null;
    where: Prisma.IncentiveRecordWhereUniqueInput;
};
export type IncentiveRecordFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type IncentiveRecordFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type IncentiveRecordFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type IncentiveRecordCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    include?: Prisma.IncentiveRecordInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IncentiveRecordCreateInput, Prisma.IncentiveRecordUncheckedCreateInput>;
};
export type IncentiveRecordCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.IncentiveRecordCreateManyInput | Prisma.IncentiveRecordCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IncentiveRecordCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    data: Prisma.IncentiveRecordCreateManyInput | Prisma.IncentiveRecordCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.IncentiveRecordIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type IncentiveRecordUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    include?: Prisma.IncentiveRecordInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IncentiveRecordUpdateInput, Prisma.IncentiveRecordUncheckedUpdateInput>;
    where: Prisma.IncentiveRecordWhereUniqueInput;
};
export type IncentiveRecordUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.IncentiveRecordUpdateManyMutationInput, Prisma.IncentiveRecordUncheckedUpdateManyInput>;
    where?: Prisma.IncentiveRecordWhereInput;
    limit?: number;
};
export type IncentiveRecordUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IncentiveRecordUpdateManyMutationInput, Prisma.IncentiveRecordUncheckedUpdateManyInput>;
    where?: Prisma.IncentiveRecordWhereInput;
    limit?: number;
    include?: Prisma.IncentiveRecordIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type IncentiveRecordUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    include?: Prisma.IncentiveRecordInclude<ExtArgs> | null;
    where: Prisma.IncentiveRecordWhereUniqueInput;
    create: Prisma.XOR<Prisma.IncentiveRecordCreateInput, Prisma.IncentiveRecordUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.IncentiveRecordUpdateInput, Prisma.IncentiveRecordUncheckedUpdateInput>;
};
export type IncentiveRecordDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    include?: Prisma.IncentiveRecordInclude<ExtArgs> | null;
    where: Prisma.IncentiveRecordWhereUniqueInput;
};
export type IncentiveRecordDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IncentiveRecordWhereInput;
    limit?: number;
};
export type IncentiveRecordDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRecordSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRecordOmit<ExtArgs> | null;
    include?: Prisma.IncentiveRecordInclude<ExtArgs> | null;
};
