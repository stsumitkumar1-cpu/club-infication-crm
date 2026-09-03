import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ImportBatchModel = runtime.Types.Result.DefaultSelection<Prisma.$ImportBatchPayload>;
export type AggregateImportBatch = {
    _count: ImportBatchCountAggregateOutputType | null;
    _avg: ImportBatchAvgAggregateOutputType | null;
    _sum: ImportBatchSumAggregateOutputType | null;
    _min: ImportBatchMinAggregateOutputType | null;
    _max: ImportBatchMaxAggregateOutputType | null;
};
export type ImportBatchAvgAggregateOutputType = {
    totalRows: number | null;
    validRows: number | null;
    importedRows: number | null;
};
export type ImportBatchSumAggregateOutputType = {
    totalRows: number | null;
    validRows: number | null;
    importedRows: number | null;
};
export type ImportBatchMinAggregateOutputType = {
    id: string | null;
    fileName: string | null;
    status: $Enums.ImportStatus | null;
    totalRows: number | null;
    validRows: number | null;
    importedRows: number | null;
    uploadedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ImportBatchMaxAggregateOutputType = {
    id: string | null;
    fileName: string | null;
    status: $Enums.ImportStatus | null;
    totalRows: number | null;
    validRows: number | null;
    importedRows: number | null;
    uploadedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ImportBatchCountAggregateOutputType = {
    id: number;
    fileName: number;
    status: number;
    totalRows: number;
    validRows: number;
    importedRows: number;
    uploadedById: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ImportBatchAvgAggregateInputType = {
    totalRows?: true;
    validRows?: true;
    importedRows?: true;
};
export type ImportBatchSumAggregateInputType = {
    totalRows?: true;
    validRows?: true;
    importedRows?: true;
};
export type ImportBatchMinAggregateInputType = {
    id?: true;
    fileName?: true;
    status?: true;
    totalRows?: true;
    validRows?: true;
    importedRows?: true;
    uploadedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ImportBatchMaxAggregateInputType = {
    id?: true;
    fileName?: true;
    status?: true;
    totalRows?: true;
    validRows?: true;
    importedRows?: true;
    uploadedById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ImportBatchCountAggregateInputType = {
    id?: true;
    fileName?: true;
    status?: true;
    totalRows?: true;
    validRows?: true;
    importedRows?: true;
    uploadedById?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ImportBatchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportBatchWhereInput;
    orderBy?: Prisma.ImportBatchOrderByWithRelationInput | Prisma.ImportBatchOrderByWithRelationInput[];
    cursor?: Prisma.ImportBatchWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ImportBatchCountAggregateInputType;
    _avg?: ImportBatchAvgAggregateInputType;
    _sum?: ImportBatchSumAggregateInputType;
    _min?: ImportBatchMinAggregateInputType;
    _max?: ImportBatchMaxAggregateInputType;
};
export type GetImportBatchAggregateType<T extends ImportBatchAggregateArgs> = {
    [P in keyof T & keyof AggregateImportBatch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateImportBatch[P]> : Prisma.GetScalarType<T[P], AggregateImportBatch[P]>;
};
export type ImportBatchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportBatchWhereInput;
    orderBy?: Prisma.ImportBatchOrderByWithAggregationInput | Prisma.ImportBatchOrderByWithAggregationInput[];
    by: Prisma.ImportBatchScalarFieldEnum[] | Prisma.ImportBatchScalarFieldEnum;
    having?: Prisma.ImportBatchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ImportBatchCountAggregateInputType | true;
    _avg?: ImportBatchAvgAggregateInputType;
    _sum?: ImportBatchSumAggregateInputType;
    _min?: ImportBatchMinAggregateInputType;
    _max?: ImportBatchMaxAggregateInputType;
};
export type ImportBatchGroupByOutputType = {
    id: string;
    fileName: string;
    status: $Enums.ImportStatus;
    totalRows: number;
    validRows: number;
    importedRows: number;
    uploadedById: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: ImportBatchCountAggregateOutputType | null;
    _avg: ImportBatchAvgAggregateOutputType | null;
    _sum: ImportBatchSumAggregateOutputType | null;
    _min: ImportBatchMinAggregateOutputType | null;
    _max: ImportBatchMaxAggregateOutputType | null;
};
export type GetImportBatchGroupByPayload<T extends ImportBatchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ImportBatchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ImportBatchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ImportBatchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ImportBatchGroupByOutputType[P]>;
}>>;
export type ImportBatchWhereInput = {
    AND?: Prisma.ImportBatchWhereInput | Prisma.ImportBatchWhereInput[];
    OR?: Prisma.ImportBatchWhereInput[];
    NOT?: Prisma.ImportBatchWhereInput | Prisma.ImportBatchWhereInput[];
    id?: Prisma.StringFilter<"ImportBatch"> | string;
    fileName?: Prisma.StringFilter<"ImportBatch"> | string;
    status?: Prisma.EnumImportStatusFilter<"ImportBatch"> | $Enums.ImportStatus;
    totalRows?: Prisma.IntFilter<"ImportBatch"> | number;
    validRows?: Prisma.IntFilter<"ImportBatch"> | number;
    importedRows?: Prisma.IntFilter<"ImportBatch"> | number;
    uploadedById?: Prisma.StringNullableFilter<"ImportBatch"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ImportBatch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ImportBatch"> | Date | string;
    uploadedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    stagingRows?: Prisma.ImportStagingListRelationFilter;
};
export type ImportBatchOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    totalRows?: Prisma.SortOrder;
    validRows?: Prisma.SortOrder;
    importedRows?: Prisma.SortOrder;
    uploadedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    uploadedBy?: Prisma.UserOrderByWithRelationInput;
    stagingRows?: Prisma.ImportStagingOrderByRelationAggregateInput;
};
export type ImportBatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ImportBatchWhereInput | Prisma.ImportBatchWhereInput[];
    OR?: Prisma.ImportBatchWhereInput[];
    NOT?: Prisma.ImportBatchWhereInput | Prisma.ImportBatchWhereInput[];
    fileName?: Prisma.StringFilter<"ImportBatch"> | string;
    status?: Prisma.EnumImportStatusFilter<"ImportBatch"> | $Enums.ImportStatus;
    totalRows?: Prisma.IntFilter<"ImportBatch"> | number;
    validRows?: Prisma.IntFilter<"ImportBatch"> | number;
    importedRows?: Prisma.IntFilter<"ImportBatch"> | number;
    uploadedById?: Prisma.StringNullableFilter<"ImportBatch"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ImportBatch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ImportBatch"> | Date | string;
    uploadedBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    stagingRows?: Prisma.ImportStagingListRelationFilter;
}, "id">;
export type ImportBatchOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    totalRows?: Prisma.SortOrder;
    validRows?: Prisma.SortOrder;
    importedRows?: Prisma.SortOrder;
    uploadedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ImportBatchCountOrderByAggregateInput;
    _avg?: Prisma.ImportBatchAvgOrderByAggregateInput;
    _max?: Prisma.ImportBatchMaxOrderByAggregateInput;
    _min?: Prisma.ImportBatchMinOrderByAggregateInput;
    _sum?: Prisma.ImportBatchSumOrderByAggregateInput;
};
export type ImportBatchScalarWhereWithAggregatesInput = {
    AND?: Prisma.ImportBatchScalarWhereWithAggregatesInput | Prisma.ImportBatchScalarWhereWithAggregatesInput[];
    OR?: Prisma.ImportBatchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ImportBatchScalarWhereWithAggregatesInput | Prisma.ImportBatchScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"ImportBatch"> | string;
    fileName?: Prisma.StringWithAggregatesFilter<"ImportBatch"> | string;
    status?: Prisma.EnumImportStatusWithAggregatesFilter<"ImportBatch"> | $Enums.ImportStatus;
    totalRows?: Prisma.IntWithAggregatesFilter<"ImportBatch"> | number;
    validRows?: Prisma.IntWithAggregatesFilter<"ImportBatch"> | number;
    importedRows?: Prisma.IntWithAggregatesFilter<"ImportBatch"> | number;
    uploadedById?: Prisma.StringNullableWithAggregatesFilter<"ImportBatch"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ImportBatch"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ImportBatch"> | Date | string;
};
export type ImportBatchCreateInput = {
    id?: string;
    fileName: string;
    status?: $Enums.ImportStatus;
    totalRows?: number;
    validRows?: number;
    importedRows?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    uploadedBy?: Prisma.UserCreateNestedOneWithoutImportBatchesInput;
    stagingRows?: Prisma.ImportStagingCreateNestedManyWithoutBatchInput;
};
export type ImportBatchUncheckedCreateInput = {
    id?: string;
    fileName: string;
    status?: $Enums.ImportStatus;
    totalRows?: number;
    validRows?: number;
    importedRows?: number;
    uploadedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stagingRows?: Prisma.ImportStagingUncheckedCreateNestedManyWithoutBatchInput;
};
export type ImportBatchUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumImportStatusFieldUpdateOperationsInput | $Enums.ImportStatus;
    totalRows?: Prisma.IntFieldUpdateOperationsInput | number;
    validRows?: Prisma.IntFieldUpdateOperationsInput | number;
    importedRows?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    uploadedBy?: Prisma.UserUpdateOneWithoutImportBatchesNestedInput;
    stagingRows?: Prisma.ImportStagingUpdateManyWithoutBatchNestedInput;
};
export type ImportBatchUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumImportStatusFieldUpdateOperationsInput | $Enums.ImportStatus;
    totalRows?: Prisma.IntFieldUpdateOperationsInput | number;
    validRows?: Prisma.IntFieldUpdateOperationsInput | number;
    importedRows?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stagingRows?: Prisma.ImportStagingUncheckedUpdateManyWithoutBatchNestedInput;
};
export type ImportBatchCreateManyInput = {
    id?: string;
    fileName: string;
    status?: $Enums.ImportStatus;
    totalRows?: number;
    validRows?: number;
    importedRows?: number;
    uploadedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ImportBatchUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumImportStatusFieldUpdateOperationsInput | $Enums.ImportStatus;
    totalRows?: Prisma.IntFieldUpdateOperationsInput | number;
    validRows?: Prisma.IntFieldUpdateOperationsInput | number;
    importedRows?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportBatchUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumImportStatusFieldUpdateOperationsInput | $Enums.ImportStatus;
    totalRows?: Prisma.IntFieldUpdateOperationsInput | number;
    validRows?: Prisma.IntFieldUpdateOperationsInput | number;
    importedRows?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportBatchListRelationFilter = {
    every?: Prisma.ImportBatchWhereInput;
    some?: Prisma.ImportBatchWhereInput;
    none?: Prisma.ImportBatchWhereInput;
};
export type ImportBatchOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ImportBatchCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    totalRows?: Prisma.SortOrder;
    validRows?: Prisma.SortOrder;
    importedRows?: Prisma.SortOrder;
    uploadedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ImportBatchAvgOrderByAggregateInput = {
    totalRows?: Prisma.SortOrder;
    validRows?: Prisma.SortOrder;
    importedRows?: Prisma.SortOrder;
};
export type ImportBatchMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    totalRows?: Prisma.SortOrder;
    validRows?: Prisma.SortOrder;
    importedRows?: Prisma.SortOrder;
    uploadedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ImportBatchMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    totalRows?: Prisma.SortOrder;
    validRows?: Prisma.SortOrder;
    importedRows?: Prisma.SortOrder;
    uploadedById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ImportBatchSumOrderByAggregateInput = {
    totalRows?: Prisma.SortOrder;
    validRows?: Prisma.SortOrder;
    importedRows?: Prisma.SortOrder;
};
export type ImportBatchScalarRelationFilter = {
    is?: Prisma.ImportBatchWhereInput;
    isNot?: Prisma.ImportBatchWhereInput;
};
export type ImportBatchCreateNestedManyWithoutUploadedByInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutUploadedByInput, Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput> | Prisma.ImportBatchCreateWithoutUploadedByInput[] | Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput[];
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutUploadedByInput | Prisma.ImportBatchCreateOrConnectWithoutUploadedByInput[];
    createMany?: Prisma.ImportBatchCreateManyUploadedByInputEnvelope;
    connect?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
};
export type ImportBatchUncheckedCreateNestedManyWithoutUploadedByInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutUploadedByInput, Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput> | Prisma.ImportBatchCreateWithoutUploadedByInput[] | Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput[];
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutUploadedByInput | Prisma.ImportBatchCreateOrConnectWithoutUploadedByInput[];
    createMany?: Prisma.ImportBatchCreateManyUploadedByInputEnvelope;
    connect?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
};
export type ImportBatchUpdateManyWithoutUploadedByNestedInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutUploadedByInput, Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput> | Prisma.ImportBatchCreateWithoutUploadedByInput[] | Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput[];
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutUploadedByInput | Prisma.ImportBatchCreateOrConnectWithoutUploadedByInput[];
    upsert?: Prisma.ImportBatchUpsertWithWhereUniqueWithoutUploadedByInput | Prisma.ImportBatchUpsertWithWhereUniqueWithoutUploadedByInput[];
    createMany?: Prisma.ImportBatchCreateManyUploadedByInputEnvelope;
    set?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
    disconnect?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
    delete?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
    connect?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
    update?: Prisma.ImportBatchUpdateWithWhereUniqueWithoutUploadedByInput | Prisma.ImportBatchUpdateWithWhereUniqueWithoutUploadedByInput[];
    updateMany?: Prisma.ImportBatchUpdateManyWithWhereWithoutUploadedByInput | Prisma.ImportBatchUpdateManyWithWhereWithoutUploadedByInput[];
    deleteMany?: Prisma.ImportBatchScalarWhereInput | Prisma.ImportBatchScalarWhereInput[];
};
export type ImportBatchUncheckedUpdateManyWithoutUploadedByNestedInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutUploadedByInput, Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput> | Prisma.ImportBatchCreateWithoutUploadedByInput[] | Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput[];
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutUploadedByInput | Prisma.ImportBatchCreateOrConnectWithoutUploadedByInput[];
    upsert?: Prisma.ImportBatchUpsertWithWhereUniqueWithoutUploadedByInput | Prisma.ImportBatchUpsertWithWhereUniqueWithoutUploadedByInput[];
    createMany?: Prisma.ImportBatchCreateManyUploadedByInputEnvelope;
    set?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
    disconnect?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
    delete?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
    connect?: Prisma.ImportBatchWhereUniqueInput | Prisma.ImportBatchWhereUniqueInput[];
    update?: Prisma.ImportBatchUpdateWithWhereUniqueWithoutUploadedByInput | Prisma.ImportBatchUpdateWithWhereUniqueWithoutUploadedByInput[];
    updateMany?: Prisma.ImportBatchUpdateManyWithWhereWithoutUploadedByInput | Prisma.ImportBatchUpdateManyWithWhereWithoutUploadedByInput[];
    deleteMany?: Prisma.ImportBatchScalarWhereInput | Prisma.ImportBatchScalarWhereInput[];
};
export type EnumImportStatusFieldUpdateOperationsInput = {
    set?: $Enums.ImportStatus;
};
export type ImportBatchCreateNestedOneWithoutStagingRowsInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutStagingRowsInput, Prisma.ImportBatchUncheckedCreateWithoutStagingRowsInput>;
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutStagingRowsInput;
    connect?: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchUpdateOneRequiredWithoutStagingRowsNestedInput = {
    create?: Prisma.XOR<Prisma.ImportBatchCreateWithoutStagingRowsInput, Prisma.ImportBatchUncheckedCreateWithoutStagingRowsInput>;
    connectOrCreate?: Prisma.ImportBatchCreateOrConnectWithoutStagingRowsInput;
    upsert?: Prisma.ImportBatchUpsertWithoutStagingRowsInput;
    connect?: Prisma.ImportBatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ImportBatchUpdateToOneWithWhereWithoutStagingRowsInput, Prisma.ImportBatchUpdateWithoutStagingRowsInput>, Prisma.ImportBatchUncheckedUpdateWithoutStagingRowsInput>;
};
export type ImportBatchCreateWithoutUploadedByInput = {
    id?: string;
    fileName: string;
    status?: $Enums.ImportStatus;
    totalRows?: number;
    validRows?: number;
    importedRows?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stagingRows?: Prisma.ImportStagingCreateNestedManyWithoutBatchInput;
};
export type ImportBatchUncheckedCreateWithoutUploadedByInput = {
    id?: string;
    fileName: string;
    status?: $Enums.ImportStatus;
    totalRows?: number;
    validRows?: number;
    importedRows?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stagingRows?: Prisma.ImportStagingUncheckedCreateNestedManyWithoutBatchInput;
};
export type ImportBatchCreateOrConnectWithoutUploadedByInput = {
    where: Prisma.ImportBatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.ImportBatchCreateWithoutUploadedByInput, Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput>;
};
export type ImportBatchCreateManyUploadedByInputEnvelope = {
    data: Prisma.ImportBatchCreateManyUploadedByInput | Prisma.ImportBatchCreateManyUploadedByInput[];
    skipDuplicates?: boolean;
};
export type ImportBatchUpsertWithWhereUniqueWithoutUploadedByInput = {
    where: Prisma.ImportBatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.ImportBatchUpdateWithoutUploadedByInput, Prisma.ImportBatchUncheckedUpdateWithoutUploadedByInput>;
    create: Prisma.XOR<Prisma.ImportBatchCreateWithoutUploadedByInput, Prisma.ImportBatchUncheckedCreateWithoutUploadedByInput>;
};
export type ImportBatchUpdateWithWhereUniqueWithoutUploadedByInput = {
    where: Prisma.ImportBatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.ImportBatchUpdateWithoutUploadedByInput, Prisma.ImportBatchUncheckedUpdateWithoutUploadedByInput>;
};
export type ImportBatchUpdateManyWithWhereWithoutUploadedByInput = {
    where: Prisma.ImportBatchScalarWhereInput;
    data: Prisma.XOR<Prisma.ImportBatchUpdateManyMutationInput, Prisma.ImportBatchUncheckedUpdateManyWithoutUploadedByInput>;
};
export type ImportBatchScalarWhereInput = {
    AND?: Prisma.ImportBatchScalarWhereInput | Prisma.ImportBatchScalarWhereInput[];
    OR?: Prisma.ImportBatchScalarWhereInput[];
    NOT?: Prisma.ImportBatchScalarWhereInput | Prisma.ImportBatchScalarWhereInput[];
    id?: Prisma.StringFilter<"ImportBatch"> | string;
    fileName?: Prisma.StringFilter<"ImportBatch"> | string;
    status?: Prisma.EnumImportStatusFilter<"ImportBatch"> | $Enums.ImportStatus;
    totalRows?: Prisma.IntFilter<"ImportBatch"> | number;
    validRows?: Prisma.IntFilter<"ImportBatch"> | number;
    importedRows?: Prisma.IntFilter<"ImportBatch"> | number;
    uploadedById?: Prisma.StringNullableFilter<"ImportBatch"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"ImportBatch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ImportBatch"> | Date | string;
};
export type ImportBatchCreateWithoutStagingRowsInput = {
    id?: string;
    fileName: string;
    status?: $Enums.ImportStatus;
    totalRows?: number;
    validRows?: number;
    importedRows?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    uploadedBy?: Prisma.UserCreateNestedOneWithoutImportBatchesInput;
};
export type ImportBatchUncheckedCreateWithoutStagingRowsInput = {
    id?: string;
    fileName: string;
    status?: $Enums.ImportStatus;
    totalRows?: number;
    validRows?: number;
    importedRows?: number;
    uploadedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ImportBatchCreateOrConnectWithoutStagingRowsInput = {
    where: Prisma.ImportBatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.ImportBatchCreateWithoutStagingRowsInput, Prisma.ImportBatchUncheckedCreateWithoutStagingRowsInput>;
};
export type ImportBatchUpsertWithoutStagingRowsInput = {
    update: Prisma.XOR<Prisma.ImportBatchUpdateWithoutStagingRowsInput, Prisma.ImportBatchUncheckedUpdateWithoutStagingRowsInput>;
    create: Prisma.XOR<Prisma.ImportBatchCreateWithoutStagingRowsInput, Prisma.ImportBatchUncheckedCreateWithoutStagingRowsInput>;
    where?: Prisma.ImportBatchWhereInput;
};
export type ImportBatchUpdateToOneWithWhereWithoutStagingRowsInput = {
    where?: Prisma.ImportBatchWhereInput;
    data: Prisma.XOR<Prisma.ImportBatchUpdateWithoutStagingRowsInput, Prisma.ImportBatchUncheckedUpdateWithoutStagingRowsInput>;
};
export type ImportBatchUpdateWithoutStagingRowsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumImportStatusFieldUpdateOperationsInput | $Enums.ImportStatus;
    totalRows?: Prisma.IntFieldUpdateOperationsInput | number;
    validRows?: Prisma.IntFieldUpdateOperationsInput | number;
    importedRows?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    uploadedBy?: Prisma.UserUpdateOneWithoutImportBatchesNestedInput;
};
export type ImportBatchUncheckedUpdateWithoutStagingRowsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumImportStatusFieldUpdateOperationsInput | $Enums.ImportStatus;
    totalRows?: Prisma.IntFieldUpdateOperationsInput | number;
    validRows?: Prisma.IntFieldUpdateOperationsInput | number;
    importedRows?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportBatchCreateManyUploadedByInput = {
    id?: string;
    fileName: string;
    status?: $Enums.ImportStatus;
    totalRows?: number;
    validRows?: number;
    importedRows?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ImportBatchUpdateWithoutUploadedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumImportStatusFieldUpdateOperationsInput | $Enums.ImportStatus;
    totalRows?: Prisma.IntFieldUpdateOperationsInput | number;
    validRows?: Prisma.IntFieldUpdateOperationsInput | number;
    importedRows?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stagingRows?: Prisma.ImportStagingUpdateManyWithoutBatchNestedInput;
};
export type ImportBatchUncheckedUpdateWithoutUploadedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumImportStatusFieldUpdateOperationsInput | $Enums.ImportStatus;
    totalRows?: Prisma.IntFieldUpdateOperationsInput | number;
    validRows?: Prisma.IntFieldUpdateOperationsInput | number;
    importedRows?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stagingRows?: Prisma.ImportStagingUncheckedUpdateManyWithoutBatchNestedInput;
};
export type ImportBatchUncheckedUpdateManyWithoutUploadedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumImportStatusFieldUpdateOperationsInput | $Enums.ImportStatus;
    totalRows?: Prisma.IntFieldUpdateOperationsInput | number;
    validRows?: Prisma.IntFieldUpdateOperationsInput | number;
    importedRows?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ImportBatchCountOutputType = {
    stagingRows: number;
};
export type ImportBatchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stagingRows?: boolean | ImportBatchCountOutputTypeCountStagingRowsArgs;
};
export type ImportBatchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchCountOutputTypeSelect<ExtArgs> | null;
};
export type ImportBatchCountOutputTypeCountStagingRowsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportStagingWhereInput;
};
export type ImportBatchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fileName?: boolean;
    status?: boolean;
    totalRows?: boolean;
    validRows?: boolean;
    importedRows?: boolean;
    uploadedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    uploadedBy?: boolean | Prisma.ImportBatch$uploadedByArgs<ExtArgs>;
    stagingRows?: boolean | Prisma.ImportBatch$stagingRowsArgs<ExtArgs>;
    _count?: boolean | Prisma.ImportBatchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["importBatch"]>;
export type ImportBatchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fileName?: boolean;
    status?: boolean;
    totalRows?: boolean;
    validRows?: boolean;
    importedRows?: boolean;
    uploadedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    uploadedBy?: boolean | Prisma.ImportBatch$uploadedByArgs<ExtArgs>;
}, ExtArgs["result"]["importBatch"]>;
export type ImportBatchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    fileName?: boolean;
    status?: boolean;
    totalRows?: boolean;
    validRows?: boolean;
    importedRows?: boolean;
    uploadedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    uploadedBy?: boolean | Prisma.ImportBatch$uploadedByArgs<ExtArgs>;
}, ExtArgs["result"]["importBatch"]>;
export type ImportBatchSelectScalar = {
    id?: boolean;
    fileName?: boolean;
    status?: boolean;
    totalRows?: boolean;
    validRows?: boolean;
    importedRows?: boolean;
    uploadedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ImportBatchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "fileName" | "status" | "totalRows" | "validRows" | "importedRows" | "uploadedById" | "createdAt" | "updatedAt", ExtArgs["result"]["importBatch"]>;
export type ImportBatchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    uploadedBy?: boolean | Prisma.ImportBatch$uploadedByArgs<ExtArgs>;
    stagingRows?: boolean | Prisma.ImportBatch$stagingRowsArgs<ExtArgs>;
    _count?: boolean | Prisma.ImportBatchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ImportBatchIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    uploadedBy?: boolean | Prisma.ImportBatch$uploadedByArgs<ExtArgs>;
};
export type ImportBatchIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    uploadedBy?: boolean | Prisma.ImportBatch$uploadedByArgs<ExtArgs>;
};
export type $ImportBatchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ImportBatch";
    objects: {
        uploadedBy: Prisma.$UserPayload<ExtArgs> | null;
        stagingRows: Prisma.$ImportStagingPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        fileName: string;
        status: $Enums.ImportStatus;
        totalRows: number;
        validRows: number;
        importedRows: number;
        uploadedById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["importBatch"]>;
    composites: {};
};
export type ImportBatchGetPayload<S extends boolean | null | undefined | ImportBatchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload, S>;
export type ImportBatchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ImportBatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ImportBatchCountAggregateInputType | true;
};
export interface ImportBatchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ImportBatch'];
        meta: {
            name: 'ImportBatch';
        };
    };
    findUnique<T extends ImportBatchFindUniqueArgs>(args: Prisma.SelectSubset<T, ImportBatchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ImportBatchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ImportBatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ImportBatchFindFirstArgs>(args?: Prisma.SelectSubset<T, ImportBatchFindFirstArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ImportBatchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ImportBatchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ImportBatchFindManyArgs>(args?: Prisma.SelectSubset<T, ImportBatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ImportBatchCreateArgs>(args: Prisma.SelectSubset<T, ImportBatchCreateArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ImportBatchCreateManyArgs>(args?: Prisma.SelectSubset<T, ImportBatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ImportBatchCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ImportBatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ImportBatchDeleteArgs>(args: Prisma.SelectSubset<T, ImportBatchDeleteArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ImportBatchUpdateArgs>(args: Prisma.SelectSubset<T, ImportBatchUpdateArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ImportBatchDeleteManyArgs>(args?: Prisma.SelectSubset<T, ImportBatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ImportBatchUpdateManyArgs>(args: Prisma.SelectSubset<T, ImportBatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ImportBatchUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ImportBatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ImportBatchUpsertArgs>(args: Prisma.SelectSubset<T, ImportBatchUpsertArgs<ExtArgs>>): Prisma.Prisma__ImportBatchClient<runtime.Types.Result.GetResult<Prisma.$ImportBatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ImportBatchCountArgs>(args?: Prisma.Subset<T, ImportBatchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ImportBatchCountAggregateOutputType> : number>;
    aggregate<T extends ImportBatchAggregateArgs>(args: Prisma.Subset<T, ImportBatchAggregateArgs>): Prisma.PrismaPromise<GetImportBatchAggregateType<T>>;
    groupBy<T extends ImportBatchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ImportBatchGroupByArgs['orderBy'];
    } : {
        orderBy?: ImportBatchGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ImportBatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportBatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ImportBatchFieldRefs;
}
export interface Prisma__ImportBatchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    uploadedBy<T extends Prisma.ImportBatch$uploadedByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ImportBatch$uploadedByArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    stagingRows<T extends Prisma.ImportBatch$stagingRowsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ImportBatch$stagingRowsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ImportStagingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ImportBatchFieldRefs {
    readonly id: Prisma.FieldRef<"ImportBatch", 'String'>;
    readonly fileName: Prisma.FieldRef<"ImportBatch", 'String'>;
    readonly status: Prisma.FieldRef<"ImportBatch", 'ImportStatus'>;
    readonly totalRows: Prisma.FieldRef<"ImportBatch", 'Int'>;
    readonly validRows: Prisma.FieldRef<"ImportBatch", 'Int'>;
    readonly importedRows: Prisma.FieldRef<"ImportBatch", 'Int'>;
    readonly uploadedById: Prisma.FieldRef<"ImportBatch", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ImportBatch", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ImportBatch", 'DateTime'>;
}
export type ImportBatchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ImportBatchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ImportBatchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ImportBatchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ImportBatchCreateInput, Prisma.ImportBatchUncheckedCreateInput>;
};
export type ImportBatchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ImportBatchCreateManyInput | Prisma.ImportBatchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ImportBatchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    data: Prisma.ImportBatchCreateManyInput | Prisma.ImportBatchCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ImportBatchIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ImportBatchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ImportBatchUpdateInput, Prisma.ImportBatchUncheckedUpdateInput>;
    where: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ImportBatchUpdateManyMutationInput, Prisma.ImportBatchUncheckedUpdateManyInput>;
    where?: Prisma.ImportBatchWhereInput;
    limit?: number;
};
export type ImportBatchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ImportBatchUpdateManyMutationInput, Prisma.ImportBatchUncheckedUpdateManyInput>;
    where?: Prisma.ImportBatchWhereInput;
    limit?: number;
    include?: Prisma.ImportBatchIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ImportBatchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where: Prisma.ImportBatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.ImportBatchCreateInput, Prisma.ImportBatchUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ImportBatchUpdateInput, Prisma.ImportBatchUncheckedUpdateInput>;
};
export type ImportBatchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
    where: Prisma.ImportBatchWhereUniqueInput;
};
export type ImportBatchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ImportBatchWhereInput;
    limit?: number;
};
export type ImportBatch$uploadedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type ImportBatch$stagingRowsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ImportBatchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ImportBatchSelect<ExtArgs> | null;
    omit?: Prisma.ImportBatchOmit<ExtArgs> | null;
    include?: Prisma.ImportBatchInclude<ExtArgs> | null;
};
