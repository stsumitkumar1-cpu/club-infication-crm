import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type IncentiveRuleModel = runtime.Types.Result.DefaultSelection<Prisma.$IncentiveRulePayload>;
export type AggregateIncentiveRule = {
    _count: IncentiveRuleCountAggregateOutputType | null;
    _avg: IncentiveRuleAvgAggregateOutputType | null;
    _sum: IncentiveRuleSumAggregateOutputType | null;
    _min: IncentiveRuleMinAggregateOutputType | null;
    _max: IncentiveRuleMaxAggregateOutputType | null;
};
export type IncentiveRuleAvgAggregateOutputType = {
    minSales: number | null;
    maxSales: number | null;
    percentage: number | null;
};
export type IncentiveRuleSumAggregateOutputType = {
    minSales: number | null;
    maxSales: number | null;
    percentage: number | null;
};
export type IncentiveRuleMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    minSales: number | null;
    maxSales: number | null;
    percentage: number | null;
    effectiveFrom: Date | null;
    effectiveTo: Date | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IncentiveRuleMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    minSales: number | null;
    maxSales: number | null;
    percentage: number | null;
    effectiveFrom: Date | null;
    effectiveTo: Date | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IncentiveRuleCountAggregateOutputType = {
    id: number;
    name: number;
    minSales: number;
    maxSales: number;
    percentage: number;
    effectiveFrom: number;
    effectiveTo: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type IncentiveRuleAvgAggregateInputType = {
    minSales?: true;
    maxSales?: true;
    percentage?: true;
};
export type IncentiveRuleSumAggregateInputType = {
    minSales?: true;
    maxSales?: true;
    percentage?: true;
};
export type IncentiveRuleMinAggregateInputType = {
    id?: true;
    name?: true;
    minSales?: true;
    maxSales?: true;
    percentage?: true;
    effectiveFrom?: true;
    effectiveTo?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IncentiveRuleMaxAggregateInputType = {
    id?: true;
    name?: true;
    minSales?: true;
    maxSales?: true;
    percentage?: true;
    effectiveFrom?: true;
    effectiveTo?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IncentiveRuleCountAggregateInputType = {
    id?: true;
    name?: true;
    minSales?: true;
    maxSales?: true;
    percentage?: true;
    effectiveFrom?: true;
    effectiveTo?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type IncentiveRuleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IncentiveRuleWhereInput;
    orderBy?: Prisma.IncentiveRuleOrderByWithRelationInput | Prisma.IncentiveRuleOrderByWithRelationInput[];
    cursor?: Prisma.IncentiveRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | IncentiveRuleCountAggregateInputType;
    _avg?: IncentiveRuleAvgAggregateInputType;
    _sum?: IncentiveRuleSumAggregateInputType;
    _min?: IncentiveRuleMinAggregateInputType;
    _max?: IncentiveRuleMaxAggregateInputType;
};
export type GetIncentiveRuleAggregateType<T extends IncentiveRuleAggregateArgs> = {
    [P in keyof T & keyof AggregateIncentiveRule]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIncentiveRule[P]> : Prisma.GetScalarType<T[P], AggregateIncentiveRule[P]>;
};
export type IncentiveRuleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IncentiveRuleWhereInput;
    orderBy?: Prisma.IncentiveRuleOrderByWithAggregationInput | Prisma.IncentiveRuleOrderByWithAggregationInput[];
    by: Prisma.IncentiveRuleScalarFieldEnum[] | Prisma.IncentiveRuleScalarFieldEnum;
    having?: Prisma.IncentiveRuleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IncentiveRuleCountAggregateInputType | true;
    _avg?: IncentiveRuleAvgAggregateInputType;
    _sum?: IncentiveRuleSumAggregateInputType;
    _min?: IncentiveRuleMinAggregateInputType;
    _max?: IncentiveRuleMaxAggregateInputType;
};
export type IncentiveRuleGroupByOutputType = {
    id: string;
    name: string;
    minSales: number;
    maxSales: number | null;
    percentage: number;
    effectiveFrom: Date;
    effectiveTo: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: IncentiveRuleCountAggregateOutputType | null;
    _avg: IncentiveRuleAvgAggregateOutputType | null;
    _sum: IncentiveRuleSumAggregateOutputType | null;
    _min: IncentiveRuleMinAggregateOutputType | null;
    _max: IncentiveRuleMaxAggregateOutputType | null;
};
export type GetIncentiveRuleGroupByPayload<T extends IncentiveRuleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<IncentiveRuleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof IncentiveRuleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], IncentiveRuleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], IncentiveRuleGroupByOutputType[P]>;
}>>;
export type IncentiveRuleWhereInput = {
    AND?: Prisma.IncentiveRuleWhereInput | Prisma.IncentiveRuleWhereInput[];
    OR?: Prisma.IncentiveRuleWhereInput[];
    NOT?: Prisma.IncentiveRuleWhereInput | Prisma.IncentiveRuleWhereInput[];
    id?: Prisma.StringFilter<"IncentiveRule"> | string;
    name?: Prisma.StringFilter<"IncentiveRule"> | string;
    minSales?: Prisma.FloatFilter<"IncentiveRule"> | number;
    maxSales?: Prisma.FloatNullableFilter<"IncentiveRule"> | number | null;
    percentage?: Prisma.FloatFilter<"IncentiveRule"> | number;
    effectiveFrom?: Prisma.DateTimeFilter<"IncentiveRule"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableFilter<"IncentiveRule"> | Date | string | null;
    isActive?: Prisma.BoolFilter<"IncentiveRule"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"IncentiveRule"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"IncentiveRule"> | Date | string;
};
export type IncentiveRuleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minSales?: Prisma.SortOrder;
    maxSales?: Prisma.SortOrderInput | Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IncentiveRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.IncentiveRuleWhereInput | Prisma.IncentiveRuleWhereInput[];
    OR?: Prisma.IncentiveRuleWhereInput[];
    NOT?: Prisma.IncentiveRuleWhereInput | Prisma.IncentiveRuleWhereInput[];
    name?: Prisma.StringFilter<"IncentiveRule"> | string;
    minSales?: Prisma.FloatFilter<"IncentiveRule"> | number;
    maxSales?: Prisma.FloatNullableFilter<"IncentiveRule"> | number | null;
    percentage?: Prisma.FloatFilter<"IncentiveRule"> | number;
    effectiveFrom?: Prisma.DateTimeFilter<"IncentiveRule"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableFilter<"IncentiveRule"> | Date | string | null;
    isActive?: Prisma.BoolFilter<"IncentiveRule"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"IncentiveRule"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"IncentiveRule"> | Date | string;
}, "id">;
export type IncentiveRuleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minSales?: Prisma.SortOrder;
    maxSales?: Prisma.SortOrderInput | Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrderInput | Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.IncentiveRuleCountOrderByAggregateInput;
    _avg?: Prisma.IncentiveRuleAvgOrderByAggregateInput;
    _max?: Prisma.IncentiveRuleMaxOrderByAggregateInput;
    _min?: Prisma.IncentiveRuleMinOrderByAggregateInput;
    _sum?: Prisma.IncentiveRuleSumOrderByAggregateInput;
};
export type IncentiveRuleScalarWhereWithAggregatesInput = {
    AND?: Prisma.IncentiveRuleScalarWhereWithAggregatesInput | Prisma.IncentiveRuleScalarWhereWithAggregatesInput[];
    OR?: Prisma.IncentiveRuleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.IncentiveRuleScalarWhereWithAggregatesInput | Prisma.IncentiveRuleScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"IncentiveRule"> | string;
    name?: Prisma.StringWithAggregatesFilter<"IncentiveRule"> | string;
    minSales?: Prisma.FloatWithAggregatesFilter<"IncentiveRule"> | number;
    maxSales?: Prisma.FloatNullableWithAggregatesFilter<"IncentiveRule"> | number | null;
    percentage?: Prisma.FloatWithAggregatesFilter<"IncentiveRule"> | number;
    effectiveFrom?: Prisma.DateTimeWithAggregatesFilter<"IncentiveRule"> | Date | string;
    effectiveTo?: Prisma.DateTimeNullableWithAggregatesFilter<"IncentiveRule"> | Date | string | null;
    isActive?: Prisma.BoolWithAggregatesFilter<"IncentiveRule"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"IncentiveRule"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"IncentiveRule"> | Date | string;
};
export type IncentiveRuleCreateInput = {
    id?: string;
    name: string;
    minSales: number;
    maxSales?: number | null;
    percentage: number;
    effectiveFrom: Date | string;
    effectiveTo?: Date | string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IncentiveRuleUncheckedCreateInput = {
    id?: string;
    name: string;
    minSales: number;
    maxSales?: number | null;
    percentage: number;
    effectiveFrom: Date | string;
    effectiveTo?: Date | string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IncentiveRuleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    minSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    maxSales?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    percentage?: Prisma.FloatFieldUpdateOperationsInput | number;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRuleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    minSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    maxSales?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    percentage?: Prisma.FloatFieldUpdateOperationsInput | number;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRuleCreateManyInput = {
    id?: string;
    name: string;
    minSales: number;
    maxSales?: number | null;
    percentage: number;
    effectiveFrom: Date | string;
    effectiveTo?: Date | string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type IncentiveRuleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    minSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    maxSales?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    percentage?: Prisma.FloatFieldUpdateOperationsInput | number;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRuleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    minSales?: Prisma.FloatFieldUpdateOperationsInput | number;
    maxSales?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    percentage?: Prisma.FloatFieldUpdateOperationsInput | number;
    effectiveFrom?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    effectiveTo?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IncentiveRuleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minSales?: Prisma.SortOrder;
    maxSales?: Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IncentiveRuleAvgOrderByAggregateInput = {
    minSales?: Prisma.SortOrder;
    maxSales?: Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
};
export type IncentiveRuleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minSales?: Prisma.SortOrder;
    maxSales?: Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IncentiveRuleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    minSales?: Prisma.SortOrder;
    maxSales?: Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
    effectiveFrom?: Prisma.SortOrder;
    effectiveTo?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IncentiveRuleSumOrderByAggregateInput = {
    minSales?: Prisma.SortOrder;
    maxSales?: Prisma.SortOrder;
    percentage?: Prisma.SortOrder;
};
export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type IncentiveRuleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    minSales?: boolean;
    maxSales?: boolean;
    percentage?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["incentiveRule"]>;
export type IncentiveRuleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    minSales?: boolean;
    maxSales?: boolean;
    percentage?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["incentiveRule"]>;
export type IncentiveRuleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    minSales?: boolean;
    maxSales?: boolean;
    percentage?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["incentiveRule"]>;
export type IncentiveRuleSelectScalar = {
    id?: boolean;
    name?: boolean;
    minSales?: boolean;
    maxSales?: boolean;
    percentage?: boolean;
    effectiveFrom?: boolean;
    effectiveTo?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type IncentiveRuleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "minSales" | "maxSales" | "percentage" | "effectiveFrom" | "effectiveTo" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["incentiveRule"]>;
export type $IncentiveRulePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "IncentiveRule";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        minSales: number;
        maxSales: number | null;
        percentage: number;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["incentiveRule"]>;
    composites: {};
};
export type IncentiveRuleGetPayload<S extends boolean | null | undefined | IncentiveRuleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload, S>;
export type IncentiveRuleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<IncentiveRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: IncentiveRuleCountAggregateInputType | true;
};
export interface IncentiveRuleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['IncentiveRule'];
        meta: {
            name: 'IncentiveRule';
        };
    };
    findUnique<T extends IncentiveRuleFindUniqueArgs>(args: Prisma.SelectSubset<T, IncentiveRuleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__IncentiveRuleClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends IncentiveRuleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, IncentiveRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__IncentiveRuleClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends IncentiveRuleFindFirstArgs>(args?: Prisma.SelectSubset<T, IncentiveRuleFindFirstArgs<ExtArgs>>): Prisma.Prisma__IncentiveRuleClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends IncentiveRuleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, IncentiveRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__IncentiveRuleClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends IncentiveRuleFindManyArgs>(args?: Prisma.SelectSubset<T, IncentiveRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends IncentiveRuleCreateArgs>(args: Prisma.SelectSubset<T, IncentiveRuleCreateArgs<ExtArgs>>): Prisma.Prisma__IncentiveRuleClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends IncentiveRuleCreateManyArgs>(args?: Prisma.SelectSubset<T, IncentiveRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends IncentiveRuleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, IncentiveRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends IncentiveRuleDeleteArgs>(args: Prisma.SelectSubset<T, IncentiveRuleDeleteArgs<ExtArgs>>): Prisma.Prisma__IncentiveRuleClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends IncentiveRuleUpdateArgs>(args: Prisma.SelectSubset<T, IncentiveRuleUpdateArgs<ExtArgs>>): Prisma.Prisma__IncentiveRuleClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends IncentiveRuleDeleteManyArgs>(args?: Prisma.SelectSubset<T, IncentiveRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends IncentiveRuleUpdateManyArgs>(args: Prisma.SelectSubset<T, IncentiveRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends IncentiveRuleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, IncentiveRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends IncentiveRuleUpsertArgs>(args: Prisma.SelectSubset<T, IncentiveRuleUpsertArgs<ExtArgs>>): Prisma.Prisma__IncentiveRuleClient<runtime.Types.Result.GetResult<Prisma.$IncentiveRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends IncentiveRuleCountArgs>(args?: Prisma.Subset<T, IncentiveRuleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], IncentiveRuleCountAggregateOutputType> : number>;
    aggregate<T extends IncentiveRuleAggregateArgs>(args: Prisma.Subset<T, IncentiveRuleAggregateArgs>): Prisma.PrismaPromise<GetIncentiveRuleAggregateType<T>>;
    groupBy<T extends IncentiveRuleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: IncentiveRuleGroupByArgs['orderBy'];
    } : {
        orderBy?: IncentiveRuleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, IncentiveRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIncentiveRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: IncentiveRuleFieldRefs;
}
export interface Prisma__IncentiveRuleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface IncentiveRuleFieldRefs {
    readonly id: Prisma.FieldRef<"IncentiveRule", 'String'>;
    readonly name: Prisma.FieldRef<"IncentiveRule", 'String'>;
    readonly minSales: Prisma.FieldRef<"IncentiveRule", 'Float'>;
    readonly maxSales: Prisma.FieldRef<"IncentiveRule", 'Float'>;
    readonly percentage: Prisma.FieldRef<"IncentiveRule", 'Float'>;
    readonly effectiveFrom: Prisma.FieldRef<"IncentiveRule", 'DateTime'>;
    readonly effectiveTo: Prisma.FieldRef<"IncentiveRule", 'DateTime'>;
    readonly isActive: Prisma.FieldRef<"IncentiveRule", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"IncentiveRule", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"IncentiveRule", 'DateTime'>;
}
export type IncentiveRuleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    where: Prisma.IncentiveRuleWhereUniqueInput;
};
export type IncentiveRuleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    where: Prisma.IncentiveRuleWhereUniqueInput;
};
export type IncentiveRuleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    where?: Prisma.IncentiveRuleWhereInput;
    orderBy?: Prisma.IncentiveRuleOrderByWithRelationInput | Prisma.IncentiveRuleOrderByWithRelationInput[];
    cursor?: Prisma.IncentiveRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IncentiveRuleScalarFieldEnum | Prisma.IncentiveRuleScalarFieldEnum[];
};
export type IncentiveRuleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    where?: Prisma.IncentiveRuleWhereInput;
    orderBy?: Prisma.IncentiveRuleOrderByWithRelationInput | Prisma.IncentiveRuleOrderByWithRelationInput[];
    cursor?: Prisma.IncentiveRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IncentiveRuleScalarFieldEnum | Prisma.IncentiveRuleScalarFieldEnum[];
};
export type IncentiveRuleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    where?: Prisma.IncentiveRuleWhereInput;
    orderBy?: Prisma.IncentiveRuleOrderByWithRelationInput | Prisma.IncentiveRuleOrderByWithRelationInput[];
    cursor?: Prisma.IncentiveRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IncentiveRuleScalarFieldEnum | Prisma.IncentiveRuleScalarFieldEnum[];
};
export type IncentiveRuleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IncentiveRuleCreateInput, Prisma.IncentiveRuleUncheckedCreateInput>;
};
export type IncentiveRuleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.IncentiveRuleCreateManyInput | Prisma.IncentiveRuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IncentiveRuleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    data: Prisma.IncentiveRuleCreateManyInput | Prisma.IncentiveRuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IncentiveRuleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IncentiveRuleUpdateInput, Prisma.IncentiveRuleUncheckedUpdateInput>;
    where: Prisma.IncentiveRuleWhereUniqueInput;
};
export type IncentiveRuleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.IncentiveRuleUpdateManyMutationInput, Prisma.IncentiveRuleUncheckedUpdateManyInput>;
    where?: Prisma.IncentiveRuleWhereInput;
    limit?: number;
};
export type IncentiveRuleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IncentiveRuleUpdateManyMutationInput, Prisma.IncentiveRuleUncheckedUpdateManyInput>;
    where?: Prisma.IncentiveRuleWhereInput;
    limit?: number;
};
export type IncentiveRuleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    where: Prisma.IncentiveRuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.IncentiveRuleCreateInput, Prisma.IncentiveRuleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.IncentiveRuleUpdateInput, Prisma.IncentiveRuleUncheckedUpdateInput>;
};
export type IncentiveRuleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
    where: Prisma.IncentiveRuleWhereUniqueInput;
};
export type IncentiveRuleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IncentiveRuleWhereInput;
    limit?: number;
};
export type IncentiveRuleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IncentiveRuleSelect<ExtArgs> | null;
    omit?: Prisma.IncentiveRuleOmit<ExtArgs> | null;
};
