import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PackageModel = runtime.Types.Result.DefaultSelection<Prisma.$PackagePayload>;
export type AggregatePackage = {
    _count: PackageCountAggregateOutputType | null;
    _avg: PackageAvgAggregateOutputType | null;
    _sum: PackageSumAggregateOutputType | null;
    _min: PackageMinAggregateOutputType | null;
    _max: PackageMaxAggregateOutputType | null;
};
export type PackageAvgAggregateOutputType = {
    price: number | null;
    days: number | null;
    nights: number | null;
    validityMonths: number | null;
};
export type PackageSumAggregateOutputType = {
    price: number | null;
    days: number | null;
    nights: number | null;
    validityMonths: number | null;
};
export type PackageMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    price: number | null;
    days: number | null;
    nights: number | null;
    validityMonths: number | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PackageMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    price: number | null;
    days: number | null;
    nights: number | null;
    validityMonths: number | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PackageCountAggregateOutputType = {
    id: number;
    name: number;
    price: number;
    days: number;
    nights: number;
    validityMonths: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PackageAvgAggregateInputType = {
    price?: true;
    days?: true;
    nights?: true;
    validityMonths?: true;
};
export type PackageSumAggregateInputType = {
    price?: true;
    days?: true;
    nights?: true;
    validityMonths?: true;
};
export type PackageMinAggregateInputType = {
    id?: true;
    name?: true;
    price?: true;
    days?: true;
    nights?: true;
    validityMonths?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PackageMaxAggregateInputType = {
    id?: true;
    name?: true;
    price?: true;
    days?: true;
    nights?: true;
    validityMonths?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PackageCountAggregateInputType = {
    id?: true;
    name?: true;
    price?: true;
    days?: true;
    nights?: true;
    validityMonths?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PackageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PackageWhereInput;
    orderBy?: Prisma.PackageOrderByWithRelationInput | Prisma.PackageOrderByWithRelationInput[];
    cursor?: Prisma.PackageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PackageCountAggregateInputType;
    _avg?: PackageAvgAggregateInputType;
    _sum?: PackageSumAggregateInputType;
    _min?: PackageMinAggregateInputType;
    _max?: PackageMaxAggregateInputType;
};
export type GetPackageAggregateType<T extends PackageAggregateArgs> = {
    [P in keyof T & keyof AggregatePackage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePackage[P]> : Prisma.GetScalarType<T[P], AggregatePackage[P]>;
};
export type PackageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PackageWhereInput;
    orderBy?: Prisma.PackageOrderByWithAggregationInput | Prisma.PackageOrderByWithAggregationInput[];
    by: Prisma.PackageScalarFieldEnum[] | Prisma.PackageScalarFieldEnum;
    having?: Prisma.PackageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PackageCountAggregateInputType | true;
    _avg?: PackageAvgAggregateInputType;
    _sum?: PackageSumAggregateInputType;
    _min?: PackageMinAggregateInputType;
    _max?: PackageMaxAggregateInputType;
};
export type PackageGroupByOutputType = {
    id: string;
    name: string;
    price: number;
    days: number;
    nights: number;
    validityMonths: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: PackageCountAggregateOutputType | null;
    _avg: PackageAvgAggregateOutputType | null;
    _sum: PackageSumAggregateOutputType | null;
    _min: PackageMinAggregateOutputType | null;
    _max: PackageMaxAggregateOutputType | null;
};
export type GetPackageGroupByPayload<T extends PackageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PackageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PackageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PackageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PackageGroupByOutputType[P]>;
}>>;
export type PackageWhereInput = {
    AND?: Prisma.PackageWhereInput | Prisma.PackageWhereInput[];
    OR?: Prisma.PackageWhereInput[];
    NOT?: Prisma.PackageWhereInput | Prisma.PackageWhereInput[];
    id?: Prisma.StringFilter<"Package"> | string;
    name?: Prisma.StringFilter<"Package"> | string;
    price?: Prisma.FloatFilter<"Package"> | number;
    days?: Prisma.IntFilter<"Package"> | number;
    nights?: Prisma.IntFilter<"Package"> | number;
    validityMonths?: Prisma.IntFilter<"Package"> | number;
    isActive?: Prisma.BoolFilter<"Package"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Package"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Package"> | Date | string;
    memberships?: Prisma.MembershipListRelationFilter;
};
export type PackageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    validityMonths?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    memberships?: Prisma.MembershipOrderByRelationAggregateInput;
};
export type PackageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    name?: string;
    AND?: Prisma.PackageWhereInput | Prisma.PackageWhereInput[];
    OR?: Prisma.PackageWhereInput[];
    NOT?: Prisma.PackageWhereInput | Prisma.PackageWhereInput[];
    price?: Prisma.FloatFilter<"Package"> | number;
    days?: Prisma.IntFilter<"Package"> | number;
    nights?: Prisma.IntFilter<"Package"> | number;
    validityMonths?: Prisma.IntFilter<"Package"> | number;
    isActive?: Prisma.BoolFilter<"Package"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Package"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Package"> | Date | string;
    memberships?: Prisma.MembershipListRelationFilter;
}, "id" | "name">;
export type PackageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    validityMonths?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PackageCountOrderByAggregateInput;
    _avg?: Prisma.PackageAvgOrderByAggregateInput;
    _max?: Prisma.PackageMaxOrderByAggregateInput;
    _min?: Prisma.PackageMinOrderByAggregateInput;
    _sum?: Prisma.PackageSumOrderByAggregateInput;
};
export type PackageScalarWhereWithAggregatesInput = {
    AND?: Prisma.PackageScalarWhereWithAggregatesInput | Prisma.PackageScalarWhereWithAggregatesInput[];
    OR?: Prisma.PackageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PackageScalarWhereWithAggregatesInput | Prisma.PackageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Package"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Package"> | string;
    price?: Prisma.FloatWithAggregatesFilter<"Package"> | number;
    days?: Prisma.IntWithAggregatesFilter<"Package"> | number;
    nights?: Prisma.IntWithAggregatesFilter<"Package"> | number;
    validityMonths?: Prisma.IntWithAggregatesFilter<"Package"> | number;
    isActive?: Prisma.BoolWithAggregatesFilter<"Package"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Package"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Package"> | Date | string;
};
export type PackageCreateInput = {
    id?: string;
    name: string;
    price: number;
    days: number;
    nights: number;
    validityMonths: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    memberships?: Prisma.MembershipCreateNestedManyWithoutPackageInput;
};
export type PackageUncheckedCreateInput = {
    id?: string;
    name: string;
    price: number;
    days: number;
    nights: number;
    validityMonths: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    memberships?: Prisma.MembershipUncheckedCreateNestedManyWithoutPackageInput;
};
export type PackageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    validityMonths?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    memberships?: Prisma.MembershipUpdateManyWithoutPackageNestedInput;
};
export type PackageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    validityMonths?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    memberships?: Prisma.MembershipUncheckedUpdateManyWithoutPackageNestedInput;
};
export type PackageCreateManyInput = {
    id?: string;
    name: string;
    price: number;
    days: number;
    nights: number;
    validityMonths: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PackageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    validityMonths?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PackageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    validityMonths?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PackageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    validityMonths?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PackageAvgOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    validityMonths?: Prisma.SortOrder;
};
export type PackageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    validityMonths?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PackageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    validityMonths?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PackageSumOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    days?: Prisma.SortOrder;
    nights?: Prisma.SortOrder;
    validityMonths?: Prisma.SortOrder;
};
export type PackageNullableScalarRelationFilter = {
    is?: Prisma.PackageWhereInput | null;
    isNot?: Prisma.PackageWhereInput | null;
};
export type PackageCreateNestedOneWithoutMembershipsInput = {
    create?: Prisma.XOR<Prisma.PackageCreateWithoutMembershipsInput, Prisma.PackageUncheckedCreateWithoutMembershipsInput>;
    connectOrCreate?: Prisma.PackageCreateOrConnectWithoutMembershipsInput;
    connect?: Prisma.PackageWhereUniqueInput;
};
export type PackageUpdateOneWithoutMembershipsNestedInput = {
    create?: Prisma.XOR<Prisma.PackageCreateWithoutMembershipsInput, Prisma.PackageUncheckedCreateWithoutMembershipsInput>;
    connectOrCreate?: Prisma.PackageCreateOrConnectWithoutMembershipsInput;
    upsert?: Prisma.PackageUpsertWithoutMembershipsInput;
    disconnect?: Prisma.PackageWhereInput | boolean;
    delete?: Prisma.PackageWhereInput | boolean;
    connect?: Prisma.PackageWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PackageUpdateToOneWithWhereWithoutMembershipsInput, Prisma.PackageUpdateWithoutMembershipsInput>, Prisma.PackageUncheckedUpdateWithoutMembershipsInput>;
};
export type PackageCreateWithoutMembershipsInput = {
    id?: string;
    name: string;
    price: number;
    days: number;
    nights: number;
    validityMonths: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PackageUncheckedCreateWithoutMembershipsInput = {
    id?: string;
    name: string;
    price: number;
    days: number;
    nights: number;
    validityMonths: number;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PackageCreateOrConnectWithoutMembershipsInput = {
    where: Prisma.PackageWhereUniqueInput;
    create: Prisma.XOR<Prisma.PackageCreateWithoutMembershipsInput, Prisma.PackageUncheckedCreateWithoutMembershipsInput>;
};
export type PackageUpsertWithoutMembershipsInput = {
    update: Prisma.XOR<Prisma.PackageUpdateWithoutMembershipsInput, Prisma.PackageUncheckedUpdateWithoutMembershipsInput>;
    create: Prisma.XOR<Prisma.PackageCreateWithoutMembershipsInput, Prisma.PackageUncheckedCreateWithoutMembershipsInput>;
    where?: Prisma.PackageWhereInput;
};
export type PackageUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: Prisma.PackageWhereInput;
    data: Prisma.XOR<Prisma.PackageUpdateWithoutMembershipsInput, Prisma.PackageUncheckedUpdateWithoutMembershipsInput>;
};
export type PackageUpdateWithoutMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    validityMonths?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PackageUncheckedUpdateWithoutMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    days?: Prisma.IntFieldUpdateOperationsInput | number;
    nights?: Prisma.IntFieldUpdateOperationsInput | number;
    validityMonths?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PackageCountOutputType = {
    memberships: number;
};
export type PackageCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    memberships?: boolean | PackageCountOutputTypeCountMembershipsArgs;
};
export type PackageCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageCountOutputTypeSelect<ExtArgs> | null;
};
export type PackageCountOutputTypeCountMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MembershipWhereInput;
};
export type PackageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    price?: boolean;
    days?: boolean;
    nights?: boolean;
    validityMonths?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    memberships?: boolean | Prisma.Package$membershipsArgs<ExtArgs>;
    _count?: boolean | Prisma.PackageCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["package"]>;
export type PackageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    price?: boolean;
    days?: boolean;
    nights?: boolean;
    validityMonths?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["package"]>;
export type PackageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    price?: boolean;
    days?: boolean;
    nights?: boolean;
    validityMonths?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["package"]>;
export type PackageSelectScalar = {
    id?: boolean;
    name?: boolean;
    price?: boolean;
    days?: boolean;
    nights?: boolean;
    validityMonths?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PackageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "price" | "days" | "nights" | "validityMonths" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["package"]>;
export type PackageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    memberships?: boolean | Prisma.Package$membershipsArgs<ExtArgs>;
    _count?: boolean | Prisma.PackageCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PackageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type PackageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $PackagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Package";
    objects: {
        memberships: Prisma.$MembershipPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        price: number;
        days: number;
        nights: number;
        validityMonths: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["package"]>;
    composites: {};
};
export type PackageGetPayload<S extends boolean | null | undefined | PackageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PackagePayload, S>;
export type PackageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PackageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PackageCountAggregateInputType | true;
};
export interface PackageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Package'];
        meta: {
            name: 'Package';
        };
    };
    findUnique<T extends PackageFindUniqueArgs>(args: Prisma.SelectSubset<T, PackageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PackageClient<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PackageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PackageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PackageClient<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PackageFindFirstArgs>(args?: Prisma.SelectSubset<T, PackageFindFirstArgs<ExtArgs>>): Prisma.Prisma__PackageClient<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PackageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PackageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PackageClient<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PackageFindManyArgs>(args?: Prisma.SelectSubset<T, PackageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PackageCreateArgs>(args: Prisma.SelectSubset<T, PackageCreateArgs<ExtArgs>>): Prisma.Prisma__PackageClient<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PackageCreateManyArgs>(args?: Prisma.SelectSubset<T, PackageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PackageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PackageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PackageDeleteArgs>(args: Prisma.SelectSubset<T, PackageDeleteArgs<ExtArgs>>): Prisma.Prisma__PackageClient<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PackageUpdateArgs>(args: Prisma.SelectSubset<T, PackageUpdateArgs<ExtArgs>>): Prisma.Prisma__PackageClient<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PackageDeleteManyArgs>(args?: Prisma.SelectSubset<T, PackageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PackageUpdateManyArgs>(args: Prisma.SelectSubset<T, PackageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PackageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PackageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PackageUpsertArgs>(args: Prisma.SelectSubset<T, PackageUpsertArgs<ExtArgs>>): Prisma.Prisma__PackageClient<runtime.Types.Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PackageCountArgs>(args?: Prisma.Subset<T, PackageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PackageCountAggregateOutputType> : number>;
    aggregate<T extends PackageAggregateArgs>(args: Prisma.Subset<T, PackageAggregateArgs>): Prisma.PrismaPromise<GetPackageAggregateType<T>>;
    groupBy<T extends PackageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PackageGroupByArgs['orderBy'];
    } : {
        orderBy?: PackageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PackageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPackageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PackageFieldRefs;
}
export interface Prisma__PackageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    memberships<T extends Prisma.Package$membershipsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Package$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PackageFieldRefs {
    readonly id: Prisma.FieldRef<"Package", 'String'>;
    readonly name: Prisma.FieldRef<"Package", 'String'>;
    readonly price: Prisma.FieldRef<"Package", 'Float'>;
    readonly days: Prisma.FieldRef<"Package", 'Int'>;
    readonly nights: Prisma.FieldRef<"Package", 'Int'>;
    readonly validityMonths: Prisma.FieldRef<"Package", 'Int'>;
    readonly isActive: Prisma.FieldRef<"Package", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Package", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Package", 'DateTime'>;
}
export type PackageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    where: Prisma.PackageWhereUniqueInput;
};
export type PackageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    where: Prisma.PackageWhereUniqueInput;
};
export type PackageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    where?: Prisma.PackageWhereInput;
    orderBy?: Prisma.PackageOrderByWithRelationInput | Prisma.PackageOrderByWithRelationInput[];
    cursor?: Prisma.PackageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PackageScalarFieldEnum | Prisma.PackageScalarFieldEnum[];
};
export type PackageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    where?: Prisma.PackageWhereInput;
    orderBy?: Prisma.PackageOrderByWithRelationInput | Prisma.PackageOrderByWithRelationInput[];
    cursor?: Prisma.PackageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PackageScalarFieldEnum | Prisma.PackageScalarFieldEnum[];
};
export type PackageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    where?: Prisma.PackageWhereInput;
    orderBy?: Prisma.PackageOrderByWithRelationInput | Prisma.PackageOrderByWithRelationInput[];
    cursor?: Prisma.PackageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PackageScalarFieldEnum | Prisma.PackageScalarFieldEnum[];
};
export type PackageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PackageCreateInput, Prisma.PackageUncheckedCreateInput>;
};
export type PackageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PackageCreateManyInput | Prisma.PackageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PackageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    data: Prisma.PackageCreateManyInput | Prisma.PackageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PackageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PackageUpdateInput, Prisma.PackageUncheckedUpdateInput>;
    where: Prisma.PackageWhereUniqueInput;
};
export type PackageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PackageUpdateManyMutationInput, Prisma.PackageUncheckedUpdateManyInput>;
    where?: Prisma.PackageWhereInput;
    limit?: number;
};
export type PackageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PackageUpdateManyMutationInput, Prisma.PackageUncheckedUpdateManyInput>;
    where?: Prisma.PackageWhereInput;
    limit?: number;
};
export type PackageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    where: Prisma.PackageWhereUniqueInput;
    create: Prisma.XOR<Prisma.PackageCreateInput, Prisma.PackageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PackageUpdateInput, Prisma.PackageUncheckedUpdateInput>;
};
export type PackageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
    where: Prisma.PackageWhereUniqueInput;
};
export type PackageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PackageWhereInput;
    limit?: number;
};
export type Package$membershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PackageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PackageSelect<ExtArgs> | null;
    omit?: Prisma.PackageOmit<ExtArgs> | null;
    include?: Prisma.PackageInclude<ExtArgs> | null;
};
