import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ImportStagingModel = runtime.Types.Result.DefaultSelection<Prisma.$ImportStagingPayload>;
export type AggregateImportStaging = {
    _count: ImportStagingCountAggregateOutputType | null;
    _avg: ImportStagingAvgAggregateOutputType | null;
    _sum: ImportStagingSumAggregateOutputType | null;
    _min: ImportStagingMinAggregateOutputType | null;
    _max: ImportStagingMaxAggregateOutputType | null;
};
export type ImportStagingAvgAggregateOutputType = {
    rowNumber: number | null;
};
export type ImportStagingSumAggregateOutputType = {
    rowNumber: number | null;
};
export type ImportStagingMinAggregateOutputType = {
    id: string | null;
    batchId: string | null;
    rowNumber: number | null;
    rawData: string | null;
    validationErrors: string | null;
    mappedData: string | null;
    importStatus: $Enums.ImportRowStatus | null;
    createdAt: Date | null;
};
export type ImportStagingMaxAggregateOutputType = {
    id: string | null;
    batchId: string | null;
    rowNumber: number | null;
    rawData: string | null;
    validationErrors: string | null;
    mappedData: string | null;
    importStatus: $Enums.ImportRowStatus | null;
    createdAt: Date | null;
};
export type ImportStagingCountAggregateOutputType = {
    id: number;
    batchId: number;
    rowNumber: number;
    rawData: number;
    validationErrors: number;
    mappedData: number;
    importStatus: number;
    createdAt: number;
    _all: number;
};
export type ImportStagingAvgAggregateInputType = {
    rowNumber?: true;
};
export type ImportStagingSumAggregateInputType = {
    rowNumber?: true;
};
export type ImportStagingMinAggregateInputType = {
    id?: true;
    batchId?: true;
    rowNumber?: true;
    rawData?: true;
    validationErrors?: true;
    mappedData?: true;
    importStatus?: true;
    createdAt?: true;
};
export type ImportStagingMaxAggregateInputType = {
    id?: true;
    batchId?: true;
    rowNumber?: true;
    rawData?: true;
    validationErrors?: true;
    mappedData?: true;
    importStatus?: true;
    createdAt?: true;
};
export type ImportStagingCountAggregateInputType = {
    id?: true;
    batchId?: true;
    rowNumber?: true;
    rawData?: true;
    validationErrors?: true;
    mappedData?: true;
    importStatus?: true;
    createdAt?: true;
    _all?: true;
};
export type ImportStagingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportStagingWhereInput;
    orderBy?: Prisma.ImportStagingOrderByWithRelationInput | Prisma.ImportStagingOrderByWithRelationInput[];
    cursor?: Prisma.ImportStagingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ImportStagingCountAggregateInputType;
    _avg?: ImportStagingAvgAggregateInputType;
    _sum?: ImportStagingSumAggregateInputType;
    _min?: ImportStagingMinAggregateInputType;
    _max?: ImportStagingMaxAggregateInputType;
};
export type GetImportStagingAggregateType<T extends ImportStagingAggregateArgs> = {
    [P in keyof T & keyof AggregateImportStaging]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateImportStaging[P]> : Prisma.GetScalarType<T[P], AggregateImportStaging[P]>;
};
export type ImportStagingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportStagingWhereInput;
    orderBy?: Prisma.ImportStagingOrderByWithAggregationInput | Prisma.ImportStagingOrderByWithAggregationInput[];
    by: Prisma.ImportStagingScalarFieldEnum[] | Prisma.ImportStagingScalarFieldEnum;
    having?: Prisma.ImportStagingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ImportStagingCountAggregateInputType | true;
    _avg?: ImportStagingAvgAggregateInputType;
    _sum?: ImportStagingSumAggregateInputType;
    _min?: ImportStagingMinAggregateInputType;
    _max?: ImportStagingMaxAggregateInputType;
};
export type ImportStagingGroupByOutputType = {
    id: string;
    batchId: string;
    rowNumber: number;
    rawData: string;
    validationErrors: string | null;
    mappedData: string | null;
    importStatus: $Enums.ImportRowStatus;
    createdAt: Date;
    _count: ImportStagingCountAggregateOutputType | null;
    _avg: ImportStagingAvgAggregateOutputType | null;
    _sum: ImportStagingSumAggregateOutputType | null;
    _min: ImportStagingMinAggregateOutputType | null;
    _max: ImportStagingMaxAggregateOutputType | null;
};
export type GetImportStagingGroupByPayload<T extends ImportStagingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ImportStagingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ImportStagingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ImportStagingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ImportStagingGroupByOutputType[P]>;
}>>;
export type ImportStagingWhereInput = {
    AND?: Prisma.ImportStagingWhereInput | Prisma.ImportStagingWhereInput[];
    OR?: Prisma.ImportStagingWhereInput[];
    NOT?: Prisma.ImportStagingWhereInput | Prisma.ImportStagingWhereInput[];
    id?: Prisma.StringFilter<"ImportStaging"> | string;
    batchId?: Prisma.StringFilter<"ImportStaging"> | string;
    rowNumber?: Prisma.IntFilter<"ImportStaging"> | number;
    rawData?: Prisma.StringFilter<"ImportStaging"> | string;
    validationErrors?: Prisma.StringNullableFilter<"ImportStaging"> | string | null;
    mappedData?: Prisma.StringNullableFilter<"ImportStaging"> | string | null;
    importStatus?: Prisma.EnumImportRowStatusFilter<"ImportStaging"> | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFilter<"ImportStaging"> | Date | string;
    batch?: Prisma.XOR<Prisma.ImportBatchScalarRelationFilter, Prisma.ImportBatchWhereInput>;
};
export type ImportStagingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    batchId?: Prisma.SortOrder;
    rowNumber?: Prisma.SortOrder;
    rawData?: Prisma.SortOrder;
    validationErrors?: Prisma.SortOrderInput | Prisma.SortOrder;
    mappedData?: Prisma.SortOrderInput | Prisma.SortOrder;
    importStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    batch?: Prisma.ImportBatchOrderByWithRelationInput;
};
export type ImportStagingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ImportStagingWhereInput | Prisma.ImportStagingWhereInput[];
    OR?: Prisma.ImportStagingWhereInput[];
    NOT?: Prisma.ImportStagingWhereInput | Prisma.ImportStagingWhereInput[];
    batchId?: Prisma.StringFilter<"ImportStaging"> | string;
    rowNumber?: Prisma.IntFilter<"ImportStaging"> | number;
    rawData?: Prisma.StringFilter<"ImportStaging"> | string;
    validationErrors?: Prisma.StringNullableFilter<"ImportStaging"> | string | null;
    mappedData?: Prisma.StringNullableFilter<"ImportStaging"> | string | null;
    importStatus?: Prisma.EnumImportRowStatusFilter<"ImportStaging"> | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFilter<"ImportStaging"> | Date | string;
    batch?: Prisma.XOR<Prisma.ImportBatchScalarRelationFilter, Prisma.ImportBatchWhereInput>;
}, "id">;
export type ImportStagingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    batchId?: Prisma.SortOrder;
    rowNumber?: Prisma.SortOrder;
    rawData?: Prisma.SortOrder;
    validationErrors?: Prisma.SortOrderInput | Prisma.SortOrder;
    mappedData?: Prisma.SortOrderInput | Prisma.SortOrder;
    importStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ImportStagingCountOrderByAggregateInput;
    _avg?: Prisma.ImportStagingAvgOrderByAggregateInput;
    _max?: Prisma.ImportStagingMaxOrderByAggregateInput;
    _min?: Prisma.ImportStagingMinOrderByAggregateInput;
    _sum?: Prisma.ImportStagingSumOrderByAggregateInput;
};
export type ImportStagingScalarWhereWithAggregatesInput = {
    AND?: Prisma.ImportStagingScalarWhereWithAggregatesInput | Prisma.ImportStagingScalarWhereWithAggregatesInput[];
    OR?: Prisma.ImportStagingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ImportStagingScalarWhereWithAggregatesInput | Prisma.ImportStagingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ImportStaging"> | string;
    batchId?: Prisma.StringWithAggregatesFilter<"ImportStaging"> | string;
    rowNumber?: Prisma.IntWithAggregatesFilter<"ImportStaging"> | number;
    rawData?: Prisma.StringWithAggregatesFilter<"ImportStaging"> | string;
    validationErrors?: Prisma.StringNullableWithAggregatesFilter<"ImportStaging"> | string | null;
    mappedData?: Prisma.StringNullableWithAggregatesFilter<"ImportStaging"> | string | null;
    importStatus?: Prisma.EnumImportRowStatusWithAggregatesFilter<"ImportStaging"> | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ImportStaging"> | Date | string;
};
export type ImportStagingCreateInput = {
    id?: string;
    rowNumber: number;
    rawData: string;
    validationErrors?: string | null;
    mappedData?: string | null;
    importStatus?: $Enums.ImportRowStatus;
    createdAt?: Date | string;
    batch: Prisma.ImportBatchCreateNestedOneWithoutStagingRowsInput;
};
export type ImportStagingUncheckedCreateInput = {
    id?: string;
    batchId: string;
    rowNumber: number;
    rawData: string;
    validationErrors?: string | null;
    mappedData?: string | null;
    importStatus?: $Enums.ImportRowStatus;
    createdAt?: Date | string;
};
export type ImportStagingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rowNumber?: Prisma.IntFieldUpdateOperationsInput | number;
    rawData?: Prisma.StringFieldUpdateOperationsInput | string;
    validationErrors?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mappedData?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    importStatus?: Prisma.EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    batch?: Prisma.ImportBatchUpdateOneRequiredWithoutStagingRowsNestedInput;
};
export type ImportStagingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    batchId?: Prisma.StringFieldUpdateOperationsInput | string;
    rowNumber?: Prisma.IntFieldUpdateOperationsInput | number;
    rawData?: Prisma.StringFieldUpdateOperationsInput | string;
    validationErrors?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mappedData?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    importStatus?: Prisma.EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportStagingCreateManyInput = {
    id?: string;
    batchId: string;
    rowNumber: number;
    rawData: string;
    validationErrors?: string | null;
    mappedData?: string | null;
    importStatus?: $Enums.ImportRowStatus;
    createdAt?: Date | string;
};
export type ImportStagingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rowNumber?: Prisma.IntFieldUpdateOperationsInput | number;
    rawData?: Prisma.StringFieldUpdateOperationsInput | string;
    validationErrors?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mappedData?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    importStatus?: Prisma.EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportStagingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    batchId?: Prisma.StringFieldUpdateOperationsInput | string;
    rowNumber?: Prisma.IntFieldUpdateOperationsInput | number;
    rawData?: Prisma.StringFieldUpdateOperationsInput | string;
    validationErrors?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mappedData?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    importStatus?: Prisma.EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportStagingListRelationFilter = {
    every?: Prisma.ImportStagingWhereInput;
    some?: Prisma.ImportStagingWhereInput;
    none?: Prisma.ImportStagingWhereInput;
};
export type ImportStagingOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ImportStagingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    batchId?: Prisma.SortOrder;
    rowNumber?: Prisma.SortOrder;
    rawData?: Prisma.SortOrder;
    validationErrors?: Prisma.SortOrder;
    mappedData?: Prisma.SortOrder;
    importStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ImportStagingAvgOrderByAggregateInput = {
    rowNumber?: Prisma.SortOrder;
};
export type ImportStagingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    batchId?: Prisma.SortOrder;
    rowNumber?: Prisma.SortOrder;
    rawData?: Prisma.SortOrder;
    validationErrors?: Prisma.SortOrder;
    mappedData?: Prisma.SortOrder;
    importStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ImportStagingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    batchId?: Prisma.SortOrder;
    rowNumber?: Prisma.SortOrder;
    rawData?: Prisma.SortOrder;
    validationErrors?: Prisma.SortOrder;
    mappedData?: Prisma.SortOrder;
    importStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ImportStagingSumOrderByAggregateInput = {
    rowNumber?: Prisma.SortOrder;
};
export type ImportStagingCreateNestedManyWithoutBatchInput = {
    create?: Prisma.XOR<Prisma.ImportStagingCreateWithoutBatchInput, Prisma.ImportStagingUncheckedCreateWithoutBatchInput> | Prisma.ImportStagingCreateWithoutBatchInput[] | Prisma.ImportStagingUncheckedCreateWithoutBatchInput[];
    connectOrCreate?: Prisma.ImportStagingCreateOrConnectWithoutBatchInput | Prisma.ImportStagingCreateOrConnectWithoutBatchInput[];
    createMany?: Prisma.ImportStagingCreateManyBatchInputEnvelope;
    connect?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
};
export type ImportStagingUncheckedCreateNestedManyWithoutBatchInput = {
    create?: Prisma.XOR<Prisma.ImportStagingCreateWithoutBatchInput, Prisma.ImportStagingUncheckedCreateWithoutBatchInput> | Prisma.ImportStagingCreateWithoutBatchInput[] | Prisma.ImportStagingUncheckedCreateWithoutBatchInput[];
    connectOrCreate?: Prisma.ImportStagingCreateOrConnectWithoutBatchInput | Prisma.ImportStagingCreateOrConnectWithoutBatchInput[];
    createMany?: Prisma.ImportStagingCreateManyBatchInputEnvelope;
    connect?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
};
export type ImportStagingUpdateManyWithoutBatchNestedInput = {
    create?: Prisma.XOR<Prisma.ImportStagingCreateWithoutBatchInput, Prisma.ImportStagingUncheckedCreateWithoutBatchInput> | Prisma.ImportStagingCreateWithoutBatchInput[] | Prisma.ImportStagingUncheckedCreateWithoutBatchInput[];
    connectOrCreate?: Prisma.ImportStagingCreateOrConnectWithoutBatchInput | Prisma.ImportStagingCreateOrConnectWithoutBatchInput[];
    upsert?: Prisma.ImportStagingUpsertWithWhereUniqueWithoutBatchInput | Prisma.ImportStagingUpsertWithWhereUniqueWithoutBatchInput[];
    createMany?: Prisma.ImportStagingCreateManyBatchInputEnvelope;
    set?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
    disconnect?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
    delete?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
    connect?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
    update?: Prisma.ImportStagingUpdateWithWhereUniqueWithoutBatchInput | Prisma.ImportStagingUpdateWithWhereUniqueWithoutBatchInput[];
    updateMany?: Prisma.ImportStagingUpdateManyWithWhereWithoutBatchInput | Prisma.ImportStagingUpdateManyWithWhereWithoutBatchInput[];
    deleteMany?: Prisma.ImportStagingScalarWhereInput | Prisma.ImportStagingScalarWhereInput[];
};
export type ImportStagingUncheckedUpdateManyWithoutBatchNestedInput = {
    create?: Prisma.XOR<Prisma.ImportStagingCreateWithoutBatchInput, Prisma.ImportStagingUncheckedCreateWithoutBatchInput> | Prisma.ImportStagingCreateWithoutBatchInput[] | Prisma.ImportStagingUncheckedCreateWithoutBatchInput[];
    connectOrCreate?: Prisma.ImportStagingCreateOrConnectWithoutBatchInput | Prisma.ImportStagingCreateOrConnectWithoutBatchInput[];
    upsert?: Prisma.ImportStagingUpsertWithWhereUniqueWithoutBatchInput | Prisma.ImportStagingUpsertWithWhereUniqueWithoutBatchInput[];
    createMany?: Prisma.ImportStagingCreateManyBatchInputEnvelope;
    set?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
    disconnect?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
    delete?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
    connect?: Prisma.ImportStagingWhereUniqueInput | Prisma.ImportStagingWhereUniqueInput[];
    update?: Prisma.ImportStagingUpdateWithWhereUniqueWithoutBatchInput | Prisma.ImportStagingUpdateWithWhereUniqueWithoutBatchInput[];
    updateMany?: Prisma.ImportStagingUpdateManyWithWhereWithoutBatchInput | Prisma.ImportStagingUpdateManyWithWhereWithoutBatchInput[];
    deleteMany?: Prisma.ImportStagingScalarWhereInput | Prisma.ImportStagingScalarWhereInput[];
};
export type EnumImportRowStatusFieldUpdateOperationsInput = {
    set?: $Enums.ImportRowStatus;
};
export type ImportStagingCreateWithoutBatchInput = {
    id?: string;
    rowNumber: number;
    rawData: string;
    validationErrors?: string | null;
    mappedData?: string | null;
    importStatus?: $Enums.ImportRowStatus;
    createdAt?: Date | string;
};
export type ImportStagingUncheckedCreateWithoutBatchInput = {
    id?: string;
    rowNumber: number;
    rawData: string;
    validationErrors?: string | null;
    mappedData?: string | null;
    importStatus?: $Enums.ImportRowStatus;
    createdAt?: Date | string;
};
export type ImportStagingCreateOrConnectWithoutBatchInput = {
    where: Prisma.ImportStagingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ImportStagingCreateWithoutBatchInput, Prisma.ImportStagingUncheckedCreateWithoutBatchInput>;
};
export type ImportStagingCreateManyBatchInputEnvelope = {
    data: Prisma.ImportStagingCreateManyBatchInput | Prisma.ImportStagingCreateManyBatchInput[];
    skipDuplicates?: boolean;
};
export type ImportStagingUpsertWithWhereUniqueWithoutBatchInput = {
    where: Prisma.ImportStagingWhereUniqueInput;
    update: Prisma.XOR<Prisma.ImportStagingUpdateWithoutBatchInput, Prisma.ImportStagingUncheckedUpdateWithoutBatchInput>;
    create: Prisma.XOR<Prisma.ImportStagingCreateWithoutBatchInput, Prisma.ImportStagingUncheckedCreateWithoutBatchInput>;
};
export type ImportStagingUpdateWithWhereUniqueWithoutBatchInput = {
    where: Prisma.ImportStagingWhereUniqueInput;
    data: Prisma.XOR<Prisma.ImportStagingUpdateWithoutBatchInput, Prisma.ImportStagingUncheckedUpdateWithoutBatchInput>;
};
export type ImportStagingUpdateManyWithWhereWithoutBatchInput = {
    where: Prisma.ImportStagingScalarWhereInput;
    data: Prisma.XOR<Prisma.ImportStagingUpdateManyMutationInput, Prisma.ImportStagingUncheckedUpdateManyWithoutBatchInput>;
};
export type ImportStagingScalarWhereInput = {
    AND?: Prisma.ImportStagingScalarWhereInput | Prisma.ImportStagingScalarWhereInput[];
    OR?: Prisma.ImportStagingScalarWhereInput[];
    NOT?: Prisma.ImportStagingScalarWhereInput | Prisma.ImportStagingScalarWhereInput[];
    id?: Prisma.StringFilter<"ImportStaging"> | string;
    batchId?: Prisma.StringFilter<"ImportStaging"> | string;
    rowNumber?: Prisma.IntFilter<"ImportStaging"> | number;
    rawData?: Prisma.StringFilter<"ImportStaging"> | string;
    validationErrors?: Prisma.StringNullableFilter<"ImportStaging"> | string | null;
    mappedData?: Prisma.StringNullableFilter<"ImportStaging"> | string | null;
    importStatus?: Prisma.EnumImportRowStatusFilter<"ImportStaging"> | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFilter<"ImportStaging"> | Date | string;
};
export type ImportStagingCreateManyBatchInput = {
    id?: string;
    rowNumber: number;
    rawData: string;
    validationErrors?: string | null;
    mappedData?: string | null;
    importStatus?: $Enums.ImportRowStatus;
    createdAt?: Date | string;
};
export type ImportStagingUpdateWithoutBatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rowNumber?: Prisma.IntFieldUpdateOperationsInput | number;
    rawData?: Prisma.StringFieldUpdateOperationsInput | string;
    validationErrors?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mappedData?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    importStatus?: Prisma.EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportStagingUncheckedUpdateWithoutBatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rowNumber?: Prisma.IntFieldUpdateOperationsInput | number;
    rawData?: Prisma.StringFieldUpdateOperationsInput | string;
    validationErrors?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mappedData?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    importStatus?: Prisma.EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportStagingUncheckedUpdateManyWithoutBatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rowNumber?: Prisma.IntFieldUpdateOperationsInput | number;
    rawData?: Prisma.StringFieldUpdateOperationsInput | string;
    validationErrors?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mappedData?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    importStatus?: Prisma.EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportStagingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    batchId?: boolean;
    rowNumber?: boolean;
    rawData?: boolean;
    validationErrors?: boolean;
    mappedData?: boolean;
    importStatus?: boolean;
    createdAt?: boolean;
    batch?: boolean | Prisma.ImportBatchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["importStaging"]>;
export type ImportStagingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    batchId?: boolean;
    rowNumber?: boolean;
    rawData?: boolean;
    validationErrors?: boolean;
    mappedData?: boolean;
    importStatus?: boolean;
    createdAt?: boolean;
    batch?: boolean | Prisma.ImportBatchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["importStaging"]>;
export type ImportStagingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    batchId?: boolean;
    rowNumber?: boolean;
    rawData?: boolean;
    validationErrors?: boolean;
    mappedData?: boolean;
    importStatus?: boolean;
    createdAt?: boolean;
    batch?: boolean | Prisma.ImportBatchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["importStaging"]>;
export type ImportStagingSelectScalar = {
    id?: boolean;
    batchId?: boolean;
    rowNumber?: boolean;
    rawData?: boolean;
    validationErrors?: boolean;
    mappedData?: boolean;
    importStatus?: boolean;
    createdAt?: boolean;
};
export type ImportStagingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "batchId" | "rowNumber" | "rawData" | "validationErrors" | "mappedData" | "importStatus" | "createdAt", ExtArgs["result"]["importStaging"]>;
export type ImportStagingInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    batch?: boolean | Prisma.ImportBatchDefaultArgs<ExtArgs>;
};
export type ImportStagingIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    batch?: boolean | Prisma.ImportBatchDefaultArgs<ExtArgs>;
};
export type ImportStagingIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    batch?: boolean | Prisma.ImportBatchDefaultArgs<ExtArgs>;
};
export type $ImportStagingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ImportStaging";
    objects: {
        batch: Prisma.$ImportBatchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        batchId: string;
        rowNumber: number;
        rawData: string;
        validationErrors: string | null;
        mappedData: string | null;
        importStatus: $Enums.ImportRowStatus;
        createdAt: Date;
    }, ExtArgs["result"]["importStaging"]>;
    composites: {};
};
export type ImportStagingGetPayload<S extends boolean | null | undefined | ImportStagingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload, S>;
export type ImportStagingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ImportStagingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ImportStagingCountAggregateInputType | true;
};
export interface ImportStagingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ImportStaging'];
        meta: {
            name: 'ImportStaging';
        };
    };
    findUnique<T extends ImportStagingFindUniqueArgs>(args: Prisma.SelectSubset<T, ImportStagingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ImportStagingClient<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ImportStagingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ImportStagingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ImportStagingClient<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ImportStagingFindFirstArgs>(args?: Prisma.SelectSubset<T, ImportStagingFindFirstArgs<ExtArgs>>): Prisma.Prisma__ImportStagingClient<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ImportStagingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ImportStagingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ImportStagingClient<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ImportStagingFindManyArgs>(args?: Prisma.SelectSubset<T, ImportStagingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ImportStagingCreateArgs>(args: Prisma.SelectSubset<T, ImportStagingCreateArgs<ExtArgs>>): Prisma.Prisma__ImportStagingClient<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ImportStagingCreateManyArgs>(args?: Prisma.SelectSubset<T, ImportStagingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ImportStagingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ImportStagingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ImportStagingDeleteArgs>(args: Prisma.SelectSubset<T, ImportStagingDeleteArgs<ExtArgs>>): Prisma.Prisma__ImportStagingClient<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ImportStagingUpdateArgs>(args: Prisma.SelectSubset<T, ImportStagingUpdateArgs<ExtArgs>>): Prisma.Prisma__ImportStagingClient<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ImportStagingDeleteManyArgs>(args?: Prisma.SelectSubset<T, ImportStagingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ImportStagingUpdateManyArgs>(args: Prisma.SelectSubset<T, ImportStagingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ImportStagingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ImportStagingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ImportStagingUpsertArgs>(args: Prisma.SelectSubset<T, ImportStagingUpsertArgs<ExtArgs>>): Prisma.Prisma__ImportStagingClient<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ImportStagingCountArgs>(args?: Prisma.Subset<T, ImportStagingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ImportStagingCountAggregateOutputType> : number>;
    aggregate<T extends ImportStagingAggregateArgs>(args: Prisma.Subset<T, ImportStagingAggregateArgs>): Prisma.PrismaPromise<GetImportStagingAggregateType<T>>;
    groupBy<T extends ImportStagingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ImportStagingGroupByArgs['orderBy'];
    } : {
        orderBy?: ImportStagingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ImportStagingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportStagingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ImportStagingFieldRefs;
}
export interface Prisma__ImportStagingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    batch<T extends Prisma.ImportBatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ImportBatchDefaultArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ImportStagingFieldRefs {
    readonly id: Prisma.FieldRef<"ImportStaging", 'String'>;
    readonly batchId: Prisma.FieldRef<"ImportStaging", 'String'>;
    readonly rowNumber: Prisma.FieldRef<"ImportStaging", 'Int'>;
    readonly rawData: Prisma.FieldRef<"ImportStaging", 'String'>;
    readonly validationErrors: Prisma.FieldRef<"ImportStaging", 'String'>;
    readonly mappedData: Prisma.FieldRef<"ImportStaging", 'String'>;
    readonly importStatus: Prisma.FieldRef<"ImportStaging", 'ImportRowStatus'>;
    readonly createdAt: Prisma.FieldRef<"ImportStaging", 'DateTime'>;
}
export type ImportStagingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
    where: Prisma.ImportStagingWhereUniqueInput;
};
export type ImportStagingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
    where: Prisma.ImportStagingWhereUniqueInput;
};
export type ImportStagingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
    where?: Prisma.ImportStagingWhereInput;
    orderBy?: Prisma.ImportStagingOrderByWithRelationInput | Prisma.ImportStagingOrderByWithRelationInput[];
    cursor?: Prisma.ImportStagingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ImportStagingScalarFieldEnum | Prisma.ImportStagingScalarFieldEnum[];
};
export type ImportStagingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
    where?: Prisma.ImportStagingWhereInput;
    orderBy?: Prisma.ImportStagingOrderByWithRelationInput | Prisma.ImportStagingOrderByWithRelationInput[];
    cursor?: Prisma.ImportStagingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ImportStagingScalarFieldEnum | Prisma.ImportStagingScalarFieldEnum[];
};
export type ImportStagingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
    where?: Prisma.ImportStagingWhereInput;
    orderBy?: Prisma.ImportStagingOrderByWithRelationInput | Prisma.ImportStagingOrderByWithRelationInput[];
    cursor?: Prisma.ImportStagingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ImportStagingScalarFieldEnum | Prisma.ImportStagingScalarFieldEnum[];
};
export type ImportStagingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ImportStagingCreateInput, Prisma.ImportStagingUncheckedCreateInput>;
};
export type ImportStagingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ImportStagingCreateManyInput | Prisma.ImportStagingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ImportStagingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    data: Prisma.ImportStagingCreateManyInput | Prisma.ImportStagingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ImportStagingIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ImportStagingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ImportStagingUpdateInput, Prisma.ImportStagingUncheckedUpdateInput>;
    where: Prisma.ImportStagingWhereUniqueInput;
};
export type ImportStagingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ImportStagingUpdateManyMutationInput, Prisma.ImportStagingUncheckedUpdateManyInput>;
    where?: Prisma.ImportStagingWhereInput;
    limit?: number;
};
export type ImportStagingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ImportStagingUpdateManyMutationInput, Prisma.ImportStagingUncheckedUpdateManyInput>;
    where?: Prisma.ImportStagingWhereInput;
    limit?: number;
    include?: Prisma.ImportStagingIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ImportStagingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
    where: Prisma.ImportStagingWhereUniqueInput;
    create: Prisma.XOR<Prisma.ImportStagingCreateInput, Prisma.ImportStagingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ImportStagingUpdateInput, Prisma.ImportStagingUncheckedUpdateInput>;
};
export type ImportStagingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
    where: Prisma.ImportStagingWhereUniqueInput;
};
export type ImportStagingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportStagingWhereInput;
    limit?: number;
};
export type ImportStagingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportStagingSelect<ExtArgs> | null;
    omit?: Prisma.ImportStagingOmit<ExtArgs> | null;
    include?: Prisma.ImportStagingInclude<ExtArgs> | null;
};
