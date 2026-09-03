import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BookingModel = runtime.Types.Result.DefaultSelection<Prisma.$BookingPayload>;
export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null;
    _avg: BookingAvgAggregateOutputType | null;
    _sum: BookingSumAggregateOutputType | null;
    _min: BookingMinAggregateOutputType | null;
    _max: BookingMaxAggregateOutputType | null;
};
export type BookingAvgAggregateOutputType = {
    daysUsed: number | null;
    nightsUsed: number | null;
};
export type BookingSumAggregateOutputType = {
    daysUsed: number | null;
    nightsUsed: number | null;
};
export type BookingMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    membershipId: string | null;
    checkIn: Date | null;
    checkOut: Date | null;
    daysUsed: number | null;
    nightsUsed: number | null;
    status: $Enums.BookingStatus | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BookingMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    membershipId: string | null;
    checkIn: Date | null;
    checkOut: Date | null;
    daysUsed: number | null;
    nightsUsed: number | null;
    status: $Enums.BookingStatus | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BookingCountAggregateOutputType = {
    id: number;
    customerId: number;
    membershipId: number;
    checkIn: number;
    checkOut: number;
    daysUsed: number;
    nightsUsed: number;
    status: number;
    notes: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BookingAvgAggregateInputType = {
    daysUsed?: true;
    nightsUsed?: true;
};
export type BookingSumAggregateInputType = {
    daysUsed?: true;
    nightsUsed?: true;
};
export type BookingMinAggregateInputType = {
    id?: true;
    customerId?: true;
    membershipId?: true;
    checkIn?: true;
    checkOut?: true;
    daysUsed?: true;
    nightsUsed?: true;
    status?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BookingMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    membershipId?: true;
    checkIn?: true;
    checkOut?: true;
    daysUsed?: true;
    nightsUsed?: true;
    status?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BookingCountAggregateInputType = {
    id?: true;
    customerId?: true;
    membershipId?: true;
    checkIn?: true;
    checkOut?: true;
    daysUsed?: true;
    nightsUsed?: true;
    status?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BookingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithRelationInput | Prisma.BookingOrderByWithRelationInput[];
    cursor?: Prisma.BookingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BookingCountAggregateInputType;
    _avg?: BookingAvgAggregateInputType;
    _sum?: BookingSumAggregateInputType;
    _min?: BookingMinAggregateInputType;
    _max?: BookingMaxAggregateInputType;
};
export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
    [P in keyof T & keyof AggregateBooking]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBooking[P]> : Prisma.GetScalarType<T[P], AggregateBooking[P]>;
};
export type BookingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithAggregationInput | Prisma.BookingOrderByWithAggregationInput[];
    by: Prisma.BookingScalarFieldEnum[] | Prisma.BookingScalarFieldEnum;
    having?: Prisma.BookingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BookingCountAggregateInputType | true;
    _avg?: BookingAvgAggregateInputType;
    _sum?: BookingSumAggregateInputType;
    _min?: BookingMinAggregateInputType;
    _max?: BookingMaxAggregateInputType;
};
export type BookingGroupByOutputType = {
    id: string;
    customerId: string;
    membershipId: string | null;
    checkIn: Date;
    checkOut: Date;
    daysUsed: number;
    nightsUsed: number;
    status: $Enums.BookingStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: BookingCountAggregateOutputType | null;
    _avg: BookingAvgAggregateOutputType | null;
    _sum: BookingSumAggregateOutputType | null;
    _min: BookingMinAggregateOutputType | null;
    _max: BookingMaxAggregateOutputType | null;
};
export type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BookingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BookingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BookingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BookingGroupByOutputType[P]>;
}>>;
export type BookingWhereInput = {
    AND?: Prisma.BookingWhereInput | Prisma.BookingWhereInput[];
    OR?: Prisma.BookingWhereInput[];
    NOT?: Prisma.BookingWhereInput | Prisma.BookingWhereInput[];
    id?: Prisma.StringFilter<"Booking"> | string;
    customerId?: Prisma.StringFilter<"Booking"> | string;
    membershipId?: Prisma.StringNullableFilter<"Booking"> | string | null;
    checkIn?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    checkOut?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    daysUsed?: Prisma.IntFilter<"Booking"> | number;
    nightsUsed?: Prisma.IntFilter<"Booking"> | number;
    status?: Prisma.EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus;
    notes?: Prisma.StringNullableFilter<"Booking"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    membership?: Prisma.XOR<Prisma.MembershipNullableScalarRelationFilter, Prisma.MembershipWhereInput> | null;
};
export type BookingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrderInput | Prisma.SortOrder;
    checkIn?: Prisma.SortOrder;
    checkOut?: Prisma.SortOrder;
    daysUsed?: Prisma.SortOrder;
    nightsUsed?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    membership?: Prisma.MembershipOrderByWithRelationInput;
};
export type BookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.BookingWhereInput | Prisma.BookingWhereInput[];
    OR?: Prisma.BookingWhereInput[];
    NOT?: Prisma.BookingWhereInput | Prisma.BookingWhereInput[];
    customerId?: Prisma.StringFilter<"Booking"> | string;
    membershipId?: Prisma.StringNullableFilter<"Booking"> | string | null;
    checkIn?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    checkOut?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    daysUsed?: Prisma.IntFilter<"Booking"> | number;
    nightsUsed?: Prisma.IntFilter<"Booking"> | number;
    status?: Prisma.EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus;
    notes?: Prisma.StringNullableFilter<"Booking"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    customer?: Prisma.XOR<Prisma.CustomerScalarRelationFilter, Prisma.CustomerWhereInput>;
    membership?: Prisma.XOR<Prisma.MembershipNullableScalarRelationFilter, Prisma.MembershipWhereInput> | null;
}, "id">;
export type BookingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrderInput | Prisma.SortOrder;
    checkIn?: Prisma.SortOrder;
    checkOut?: Prisma.SortOrder;
    daysUsed?: Prisma.SortOrder;
    nightsUsed?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BookingCountOrderByAggregateInput;
    _avg?: Prisma.BookingAvgOrderByAggregateInput;
    _max?: Prisma.BookingMaxOrderByAggregateInput;
    _min?: Prisma.BookingMinOrderByAggregateInput;
    _sum?: Prisma.BookingSumOrderByAggregateInput;
};
export type BookingScalarWhereWithAggregatesInput = {
    AND?: Prisma.BookingScalarWhereWithAggregatesInput | Prisma.BookingScalarWhereWithAggregatesInput[];
    OR?: Prisma.BookingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BookingScalarWhereWithAggregatesInput | Prisma.BookingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Booking"> | string;
    customerId?: Prisma.StringWithAggregatesFilter<"Booking"> | string;
    membershipId?: Prisma.StringNullableWithAggregatesFilter<"Booking"> | string | null;
    checkIn?: Prisma.DateTimeWithAggregatesFilter<"Booking"> | Date | string;
    checkOut?: Prisma.DateTimeWithAggregatesFilter<"Booking"> | Date | string;
    daysUsed?: Prisma.IntWithAggregatesFilter<"Booking"> | number;
    nightsUsed?: Prisma.IntWithAggregatesFilter<"Booking"> | number;
    status?: Prisma.EnumBookingStatusWithAggregatesFilter<"Booking"> | $Enums.BookingStatus;
    notes?: Prisma.StringNullableWithAggregatesFilter<"Booking"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Booking"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Booking"> | Date | string;
};
export type BookingCreateInput = {
    id?: string;
    checkIn: Date | string;
    checkOut: Date | string;
    daysUsed?: number;
    nightsUsed?: number;
    status?: $Enums.BookingStatus;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutBookingsInput;
    membership?: Prisma.MembershipCreateNestedOneWithoutBookingsInput;
};
export type BookingUncheckedCreateInput = {
    id?: string;
    customerId: string;
    membershipId?: string | null;
    checkIn: Date | string;
    checkOut: Date | string;
    daysUsed?: number;
    nightsUsed?: number;
    status?: $Enums.BookingStatus;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BookingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutBookingsNestedInput;
    membership?: Prisma.MembershipUpdateOneWithoutBookingsNestedInput;
};
export type BookingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    membershipId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingCreateManyInput = {
    id?: string;
    customerId: string;
    membershipId?: string | null;
    checkIn: Date | string;
    checkOut: Date | string;
    daysUsed?: number;
    nightsUsed?: number;
    status?: $Enums.BookingStatus;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BookingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    membershipId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingListRelationFilter = {
    every?: Prisma.BookingWhereInput;
    some?: Prisma.BookingWhereInput;
    none?: Prisma.BookingWhereInput;
};
export type BookingOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BookingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrder;
    checkIn?: Prisma.SortOrder;
    checkOut?: Prisma.SortOrder;
    daysUsed?: Prisma.SortOrder;
    nightsUsed?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BookingAvgOrderByAggregateInput = {
    daysUsed?: Prisma.SortOrder;
    nightsUsed?: Prisma.SortOrder;
};
export type BookingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrder;
    checkIn?: Prisma.SortOrder;
    checkOut?: Prisma.SortOrder;
    daysUsed?: Prisma.SortOrder;
    nightsUsed?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BookingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    membershipId?: Prisma.SortOrder;
    checkIn?: Prisma.SortOrder;
    checkOut?: Prisma.SortOrder;
    daysUsed?: Prisma.SortOrder;
    nightsUsed?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BookingSumOrderByAggregateInput = {
    daysUsed?: Prisma.SortOrder;
    nightsUsed?: Prisma.SortOrder;
};
export type BookingCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.BookingCreateWithoutCustomerInput, Prisma.BookingUncheckedCreateWithoutCustomerInput> | Prisma.BookingCreateWithoutCustomerInput[] | Prisma.BookingUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.BookingCreateOrConnectWithoutCustomerInput | Prisma.BookingCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.BookingCreateManyCustomerInputEnvelope;
    connect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
};
export type BookingUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.BookingCreateWithoutCustomerInput, Prisma.BookingUncheckedCreateWithoutCustomerInput> | Prisma.BookingCreateWithoutCustomerInput[] | Prisma.BookingUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.BookingCreateOrConnectWithoutCustomerInput | Prisma.BookingCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.BookingCreateManyCustomerInputEnvelope;
    connect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
};
export type BookingUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.BookingCreateWithoutCustomerInput, Prisma.BookingUncheckedCreateWithoutCustomerInput> | Prisma.BookingCreateWithoutCustomerInput[] | Prisma.BookingUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.BookingCreateOrConnectWithoutCustomerInput | Prisma.BookingCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.BookingUpsertWithWhereUniqueWithoutCustomerInput | Prisma.BookingUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.BookingCreateManyCustomerInputEnvelope;
    set?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    disconnect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    delete?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    connect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    update?: Prisma.BookingUpdateWithWhereUniqueWithoutCustomerInput | Prisma.BookingUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.BookingUpdateManyWithWhereWithoutCustomerInput | Prisma.BookingUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.BookingScalarWhereInput | Prisma.BookingScalarWhereInput[];
};
export type BookingUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.BookingCreateWithoutCustomerInput, Prisma.BookingUncheckedCreateWithoutCustomerInput> | Prisma.BookingCreateWithoutCustomerInput[] | Prisma.BookingUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.BookingCreateOrConnectWithoutCustomerInput | Prisma.BookingCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.BookingUpsertWithWhereUniqueWithoutCustomerInput | Prisma.BookingUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.BookingCreateManyCustomerInputEnvelope;
    set?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    disconnect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    delete?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    connect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    update?: Prisma.BookingUpdateWithWhereUniqueWithoutCustomerInput | Prisma.BookingUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.BookingUpdateManyWithWhereWithoutCustomerInput | Prisma.BookingUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.BookingScalarWhereInput | Prisma.BookingScalarWhereInput[];
};
export type BookingCreateNestedManyWithoutMembershipInput = {
    create?: Prisma.XOR<Prisma.BookingCreateWithoutMembershipInput, Prisma.BookingUncheckedCreateWithoutMembershipInput> | Prisma.BookingCreateWithoutMembershipInput[] | Prisma.BookingUncheckedCreateWithoutMembershipInput[];
    connectOrCreate?: Prisma.BookingCreateOrConnectWithoutMembershipInput | Prisma.BookingCreateOrConnectWithoutMembershipInput[];
    createMany?: Prisma.BookingCreateManyMembershipInputEnvelope;
    connect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
};
export type BookingUncheckedCreateNestedManyWithoutMembershipInput = {
    create?: Prisma.XOR<Prisma.BookingCreateWithoutMembershipInput, Prisma.BookingUncheckedCreateWithoutMembershipInput> | Prisma.BookingCreateWithoutMembershipInput[] | Prisma.BookingUncheckedCreateWithoutMembershipInput[];
    connectOrCreate?: Prisma.BookingCreateOrConnectWithoutMembershipInput | Prisma.BookingCreateOrConnectWithoutMembershipInput[];
    createMany?: Prisma.BookingCreateManyMembershipInputEnvelope;
    connect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
};
export type BookingUpdateManyWithoutMembershipNestedInput = {
    create?: Prisma.XOR<Prisma.BookingCreateWithoutMembershipInput, Prisma.BookingUncheckedCreateWithoutMembershipInput> | Prisma.BookingCreateWithoutMembershipInput[] | Prisma.BookingUncheckedCreateWithoutMembershipInput[];
    connectOrCreate?: Prisma.BookingCreateOrConnectWithoutMembershipInput | Prisma.BookingCreateOrConnectWithoutMembershipInput[];
    upsert?: Prisma.BookingUpsertWithWhereUniqueWithoutMembershipInput | Prisma.BookingUpsertWithWhereUniqueWithoutMembershipInput[];
    createMany?: Prisma.BookingCreateManyMembershipInputEnvelope;
    set?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    disconnect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    delete?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    connect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    update?: Prisma.BookingUpdateWithWhereUniqueWithoutMembershipInput | Prisma.BookingUpdateWithWhereUniqueWithoutMembershipInput[];
    updateMany?: Prisma.BookingUpdateManyWithWhereWithoutMembershipInput | Prisma.BookingUpdateManyWithWhereWithoutMembershipInput[];
    deleteMany?: Prisma.BookingScalarWhereInput | Prisma.BookingScalarWhereInput[];
};
export type BookingUncheckedUpdateManyWithoutMembershipNestedInput = {
    create?: Prisma.XOR<Prisma.BookingCreateWithoutMembershipInput, Prisma.BookingUncheckedCreateWithoutMembershipInput> | Prisma.BookingCreateWithoutMembershipInput[] | Prisma.BookingUncheckedCreateWithoutMembershipInput[];
    connectOrCreate?: Prisma.BookingCreateOrConnectWithoutMembershipInput | Prisma.BookingCreateOrConnectWithoutMembershipInput[];
    upsert?: Prisma.BookingUpsertWithWhereUniqueWithoutMembershipInput | Prisma.BookingUpsertWithWhereUniqueWithoutMembershipInput[];
    createMany?: Prisma.BookingCreateManyMembershipInputEnvelope;
    set?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    disconnect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    delete?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    connect?: Prisma.BookingWhereUniqueInput | Prisma.BookingWhereUniqueInput[];
    update?: Prisma.BookingUpdateWithWhereUniqueWithoutMembershipInput | Prisma.BookingUpdateWithWhereUniqueWithoutMembershipInput[];
    updateMany?: Prisma.BookingUpdateManyWithWhereWithoutMembershipInput | Prisma.BookingUpdateManyWithWhereWithoutMembershipInput[];
    deleteMany?: Prisma.BookingScalarWhereInput | Prisma.BookingScalarWhereInput[];
};
export type EnumBookingStatusFieldUpdateOperationsInput = {
    set?: $Enums.BookingStatus;
};
export type BookingCreateWithoutCustomerInput = {
    id?: string;
    checkIn: Date | string;
    checkOut: Date | string;
    daysUsed?: number;
    nightsUsed?: number;
    status?: $Enums.BookingStatus;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    membership?: Prisma.MembershipCreateNestedOneWithoutBookingsInput;
};
export type BookingUncheckedCreateWithoutCustomerInput = {
    id?: string;
    membershipId?: string | null;
    checkIn: Date | string;
    checkOut: Date | string;
    daysUsed?: number;
    nightsUsed?: number;
    status?: $Enums.BookingStatus;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BookingCreateOrConnectWithoutCustomerInput = {
    where: Prisma.BookingWhereUniqueInput;
    create: Prisma.XOR<Prisma.BookingCreateWithoutCustomerInput, Prisma.BookingUncheckedCreateWithoutCustomerInput>;
};
export type BookingCreateManyCustomerInputEnvelope = {
    data: Prisma.BookingCreateManyCustomerInput | Prisma.BookingCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type BookingUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.BookingWhereUniqueInput;
    update: Prisma.XOR<Prisma.BookingUpdateWithoutCustomerInput, Prisma.BookingUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.BookingCreateWithoutCustomerInput, Prisma.BookingUncheckedCreateWithoutCustomerInput>;
};
export type BookingUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.BookingWhereUniqueInput;
    data: Prisma.XOR<Prisma.BookingUpdateWithoutCustomerInput, Prisma.BookingUncheckedUpdateWithoutCustomerInput>;
};
export type BookingUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.BookingScalarWhereInput;
    data: Prisma.XOR<Prisma.BookingUpdateManyMutationInput, Prisma.BookingUncheckedUpdateManyWithoutCustomerInput>;
};
export type BookingScalarWhereInput = {
    AND?: Prisma.BookingScalarWhereInput | Prisma.BookingScalarWhereInput[];
    OR?: Prisma.BookingScalarWhereInput[];
    NOT?: Prisma.BookingScalarWhereInput | Prisma.BookingScalarWhereInput[];
    id?: Prisma.StringFilter<"Booking"> | string;
    customerId?: Prisma.StringFilter<"Booking"> | string;
    membershipId?: Prisma.StringNullableFilter<"Booking"> | string | null;
    checkIn?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    checkOut?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    daysUsed?: Prisma.IntFilter<"Booking"> | number;
    nightsUsed?: Prisma.IntFilter<"Booking"> | number;
    status?: Prisma.EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus;
    notes?: Prisma.StringNullableFilter<"Booking"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Booking"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Booking"> | Date | string;
};
export type BookingCreateWithoutMembershipInput = {
    id?: string;
    checkIn: Date | string;
    checkOut: Date | string;
    daysUsed?: number;
    nightsUsed?: number;
    status?: $Enums.BookingStatus;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: Prisma.CustomerCreateNestedOneWithoutBookingsInput;
};
export type BookingUncheckedCreateWithoutMembershipInput = {
    id?: string;
    customerId: string;
    checkIn: Date | string;
    checkOut: Date | string;
    daysUsed?: number;
    nightsUsed?: number;
    status?: $Enums.BookingStatus;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BookingCreateOrConnectWithoutMembershipInput = {
    where: Prisma.BookingWhereUniqueInput;
    create: Prisma.XOR<Prisma.BookingCreateWithoutMembershipInput, Prisma.BookingUncheckedCreateWithoutMembershipInput>;
};
export type BookingCreateManyMembershipInputEnvelope = {
    data: Prisma.BookingCreateManyMembershipInput | Prisma.BookingCreateManyMembershipInput[];
    skipDuplicates?: boolean;
};
export type BookingUpsertWithWhereUniqueWithoutMembershipInput = {
    where: Prisma.BookingWhereUniqueInput;
    update: Prisma.XOR<Prisma.BookingUpdateWithoutMembershipInput, Prisma.BookingUncheckedUpdateWithoutMembershipInput>;
    create: Prisma.XOR<Prisma.BookingCreateWithoutMembershipInput, Prisma.BookingUncheckedCreateWithoutMembershipInput>;
};
export type BookingUpdateWithWhereUniqueWithoutMembershipInput = {
    where: Prisma.BookingWhereUniqueInput;
    data: Prisma.XOR<Prisma.BookingUpdateWithoutMembershipInput, Prisma.BookingUncheckedUpdateWithoutMembershipInput>;
};
export type BookingUpdateManyWithWhereWithoutMembershipInput = {
    where: Prisma.BookingScalarWhereInput;
    data: Prisma.XOR<Prisma.BookingUpdateManyMutationInput, Prisma.BookingUncheckedUpdateManyWithoutMembershipInput>;
};
export type BookingCreateManyCustomerInput = {
    id?: string;
    membershipId?: string | null;
    checkIn: Date | string;
    checkOut: Date | string;
    daysUsed?: number;
    nightsUsed?: number;
    status?: $Enums.BookingStatus;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BookingUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    membership?: Prisma.MembershipUpdateOneWithoutBookingsNestedInput;
};
export type BookingUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    membershipId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    membershipId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingCreateManyMembershipInput = {
    id?: string;
    customerId: string;
    checkIn: Date | string;
    checkOut: Date | string;
    daysUsed?: number;
    nightsUsed?: number;
    status?: $Enums.BookingStatus;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BookingUpdateWithoutMembershipInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneRequiredWithoutBookingsNestedInput;
};
export type BookingUncheckedUpdateWithoutMembershipInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingUncheckedUpdateManyWithoutMembershipInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.StringFieldUpdateOperationsInput | string;
    checkIn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    checkOut?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    daysUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    nightsUsed?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BookingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    membershipId?: boolean;
    checkIn?: boolean;
    checkOut?: boolean;
    daysUsed?: boolean;
    nightsUsed?: boolean;
    status?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.Booking$membershipArgs<ExtArgs>;
}, ExtArgs["result"]["booking"]>;
export type BookingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    membershipId?: boolean;
    checkIn?: boolean;
    checkOut?: boolean;
    daysUsed?: boolean;
    nightsUsed?: boolean;
    status?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.Booking$membershipArgs<ExtArgs>;
}, ExtArgs["result"]["booking"]>;
export type BookingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerId?: boolean;
    membershipId?: boolean;
    checkIn?: boolean;
    checkOut?: boolean;
    daysUsed?: boolean;
    nightsUsed?: boolean;
    status?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.Booking$membershipArgs<ExtArgs>;
}, ExtArgs["result"]["booking"]>;
export type BookingSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    membershipId?: boolean;
    checkIn?: boolean;
    checkOut?: boolean;
    daysUsed?: boolean;
    nightsUsed?: boolean;
    status?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BookingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerId" | "membershipId" | "checkIn" | "checkOut" | "daysUsed" | "nightsUsed" | "status" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["booking"]>;
export type BookingInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.Booking$membershipArgs<ExtArgs>;
};
export type BookingIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.Booking$membershipArgs<ExtArgs>;
};
export type BookingIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    customer?: boolean | Prisma.CustomerDefaultArgs<ExtArgs>;
    membership?: boolean | Prisma.Booking$membershipArgs<ExtArgs>;
};
export type $BookingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Booking";
    objects: {
        customer: Prisma.$CustomerPayload<ExtArgs>;
        membership: Prisma.$MembershipPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerId: string;
        membershipId: string | null;
        checkIn: Date;
        checkOut: Date;
        daysUsed: number;
        nightsUsed: number;
        status: $Enums.BookingStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["booking"]>;
    composites: {};
};
export type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BookingPayload, S>;
export type BookingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BookingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BookingCountAggregateInputType | true;
};
export interface BookingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Booking'];
        meta: {
            name: 'Booking';
        };
    };
    findUnique<T extends BookingFindUniqueArgs>(args: Prisma.SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BookingFindFirstArgs>(args?: Prisma.SelectSubset<T, BookingFindFirstArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BookingFindManyArgs>(args?: Prisma.SelectSubset<T, BookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BookingCreateArgs>(args: Prisma.SelectSubset<T, BookingCreateArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BookingCreateManyArgs>(args?: Prisma.SelectSubset<T, BookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BookingDeleteArgs>(args: Prisma.SelectSubset<T, BookingDeleteArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BookingUpdateArgs>(args: Prisma.SelectSubset<T, BookingUpdateArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BookingDeleteManyArgs>(args?: Prisma.SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BookingUpdateManyArgs>(args: Prisma.SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BookingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BookingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BookingUpsertArgs>(args: Prisma.SelectSubset<T, BookingUpsertArgs<ExtArgs>>): Prisma.Prisma__BookingClient<runtime.Types.Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BookingCountArgs>(args?: Prisma.Subset<T, BookingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BookingCountAggregateOutputType> : number>;
    aggregate<T extends BookingAggregateArgs>(args: Prisma.Subset<T, BookingAggregateArgs>): Prisma.PrismaPromise<GetBookingAggregateType<T>>;
    groupBy<T extends BookingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BookingGroupByArgs['orderBy'];
    } : {
        orderBy?: BookingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BookingFieldRefs;
}
export interface Prisma__BookingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    customer<T extends Prisma.CustomerDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    membership<T extends Prisma.Booking$membershipArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Booking$membershipArgs<ExtArgs>>): Prisma.Prisma__MembershipClient<runtime.Types.Result.GetResult<Prisma.$MembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BookingFieldRefs {
    readonly id: Prisma.FieldRef<"Booking", 'String'>;
    readonly customerId: Prisma.FieldRef<"Booking", 'String'>;
    readonly membershipId: Prisma.FieldRef<"Booking", 'String'>;
    readonly checkIn: Prisma.FieldRef<"Booking", 'DateTime'>;
    readonly checkOut: Prisma.FieldRef<"Booking", 'DateTime'>;
    readonly daysUsed: Prisma.FieldRef<"Booking", 'Int'>;
    readonly nightsUsed: Prisma.FieldRef<"Booking", 'Int'>;
    readonly status: Prisma.FieldRef<"Booking", 'BookingStatus'>;
    readonly notes: Prisma.FieldRef<"Booking", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Booking", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Booking", 'DateTime'>;
}
export type BookingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
    where: Prisma.BookingWhereUniqueInput;
};
export type BookingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
    where: Prisma.BookingWhereUniqueInput;
};
export type BookingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BookingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BookingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BookingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BookingCreateInput, Prisma.BookingUncheckedCreateInput>;
};
export type BookingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BookingCreateManyInput | Prisma.BookingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BookingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    data: Prisma.BookingCreateManyInput | Prisma.BookingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BookingIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BookingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BookingUpdateInput, Prisma.BookingUncheckedUpdateInput>;
    where: Prisma.BookingWhereUniqueInput;
};
export type BookingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BookingUpdateManyMutationInput, Prisma.BookingUncheckedUpdateManyInput>;
    where?: Prisma.BookingWhereInput;
    limit?: number;
};
export type BookingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BookingUpdateManyMutationInput, Prisma.BookingUncheckedUpdateManyInput>;
    where?: Prisma.BookingWhereInput;
    limit?: number;
    include?: Prisma.BookingIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BookingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
    where: Prisma.BookingWhereUniqueInput;
    create: Prisma.XOR<Prisma.BookingCreateInput, Prisma.BookingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BookingUpdateInput, Prisma.BookingUncheckedUpdateInput>;
};
export type BookingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
    where: Prisma.BookingWhereUniqueInput;
};
export type BookingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BookingWhereInput;
    limit?: number;
};
export type Booking$membershipArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MembershipSelect<ExtArgs> | null;
    omit?: Prisma.MembershipOmit<ExtArgs> | null;
    include?: Prisma.MembershipInclude<ExtArgs> | null;
    where?: Prisma.MembershipWhereInput;
};
export type BookingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BookingSelect<ExtArgs> | null;
    omit?: Prisma.BookingOmit<ExtArgs> | null;
    include?: Prisma.BookingInclude<ExtArgs> | null;
};
