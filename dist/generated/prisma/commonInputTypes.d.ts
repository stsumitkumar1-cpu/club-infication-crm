import * as $Enums from "./enums.js";
import type * as Prisma from "./internal/prismaNamespace.js";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type FloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type EnumCustomerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CustomerStatus | Prisma.EnumCustomerStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CustomerStatus[] | Prisma.ListEnumCustomerStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CustomerStatus[] | Prisma.ListEnumCustomerStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCustomerStatusFilter<$PrismaModel> | $Enums.CustomerStatus;
};
export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatFilter<$PrismaModel>;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type EnumCustomerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CustomerStatus | Prisma.EnumCustomerStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CustomerStatus[] | Prisma.ListEnumCustomerStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CustomerStatus[] | Prisma.ListEnumCustomerStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCustomerStatusWithAggregatesFilter<$PrismaModel> | $Enums.CustomerStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCustomerStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCustomerStatusFilter<$PrismaModel>;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type EnumMembershipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MembershipStatus | Prisma.EnumMembershipStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MembershipStatus[] | Prisma.ListEnumMembershipStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MembershipStatus[] | Prisma.ListEnumMembershipStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMembershipStatusFilter<$PrismaModel> | $Enums.MembershipStatus;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type EnumMembershipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MembershipStatus | Prisma.EnumMembershipStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MembershipStatus[] | Prisma.ListEnumMembershipStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MembershipStatus[] | Prisma.ListEnumMembershipStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMembershipStatusWithAggregatesFilter<$PrismaModel> | $Enums.MembershipStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMembershipStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMembershipStatusFilter<$PrismaModel>;
};
export type EnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus;
};
export type EnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
};
export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
};
export type EnumIncentiveStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IncentiveStatus | Prisma.EnumIncentiveStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.IncentiveStatus[] | Prisma.ListEnumIncentiveStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncentiveStatus[] | Prisma.ListEnumIncentiveStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumIncentiveStatusFilter<$PrismaModel> | $Enums.IncentiveStatus;
};
export type EnumIncentiveStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IncentiveStatus | Prisma.EnumIncentiveStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.IncentiveStatus[] | Prisma.ListEnumIncentiveStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncentiveStatus[] | Prisma.ListEnumIncentiveStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumIncentiveStatusWithAggregatesFilter<$PrismaModel> | $Enums.IncentiveStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumIncentiveStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumIncentiveStatusFilter<$PrismaModel>;
};
export type EnumImportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportStatus | Prisma.EnumImportStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ImportStatus[] | Prisma.ListEnumImportStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ImportStatus[] | Prisma.ListEnumImportStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumImportStatusFilter<$PrismaModel> | $Enums.ImportStatus;
};
export type EnumImportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportStatus | Prisma.EnumImportStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ImportStatus[] | Prisma.ListEnumImportStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ImportStatus[] | Prisma.ListEnumImportStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumImportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ImportStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumImportStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumImportStatusFilter<$PrismaModel>;
};
export type EnumImportRowStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRowStatus | Prisma.EnumImportRowStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ImportRowStatus[] | Prisma.ListEnumImportRowStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ImportRowStatus[] | Prisma.ListEnumImportRowStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumImportRowStatusFilter<$PrismaModel> | $Enums.ImportRowStatus;
};
export type EnumImportRowStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRowStatus | Prisma.EnumImportRowStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ImportRowStatus[] | Prisma.ListEnumImportRowStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ImportRowStatus[] | Prisma.ListEnumImportRowStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumImportRowStatusWithAggregatesFilter<$PrismaModel> | $Enums.ImportRowStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumImportRowStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumImportRowStatusFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleFilter<$PrismaModel> | $Enums.Role;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | Prisma.EnumRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Role[] | Prisma.ListEnumRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRoleFilter<$PrismaModel>;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedEnumCustomerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CustomerStatus | Prisma.EnumCustomerStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CustomerStatus[] | Prisma.ListEnumCustomerStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CustomerStatus[] | Prisma.ListEnumCustomerStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCustomerStatusFilter<$PrismaModel> | $Enums.CustomerStatus;
};
export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatFilter<$PrismaModel>;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedEnumCustomerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CustomerStatus | Prisma.EnumCustomerStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CustomerStatus[] | Prisma.ListEnumCustomerStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CustomerStatus[] | Prisma.ListEnumCustomerStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCustomerStatusWithAggregatesFilter<$PrismaModel> | $Enums.CustomerStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCustomerStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCustomerStatusFilter<$PrismaModel>;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedEnumMembershipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MembershipStatus | Prisma.EnumMembershipStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MembershipStatus[] | Prisma.ListEnumMembershipStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MembershipStatus[] | Prisma.ListEnumMembershipStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMembershipStatusFilter<$PrismaModel> | $Enums.MembershipStatus;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedEnumMembershipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MembershipStatus | Prisma.EnumMembershipStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MembershipStatus[] | Prisma.ListEnumMembershipStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MembershipStatus[] | Prisma.ListEnumMembershipStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMembershipStatusWithAggregatesFilter<$PrismaModel> | $Enums.MembershipStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMembershipStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMembershipStatusFilter<$PrismaModel>;
};
export type NestedEnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus;
};
export type NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | Prisma.EnumBookingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BookingStatus[] | Prisma.ListEnumBookingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBookingStatusFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
};
export type NestedEnumIncentiveStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IncentiveStatus | Prisma.EnumIncentiveStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.IncentiveStatus[] | Prisma.ListEnumIncentiveStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncentiveStatus[] | Prisma.ListEnumIncentiveStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumIncentiveStatusFilter<$PrismaModel> | $Enums.IncentiveStatus;
};
export type NestedEnumIncentiveStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IncentiveStatus | Prisma.EnumIncentiveStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.IncentiveStatus[] | Prisma.ListEnumIncentiveStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.IncentiveStatus[] | Prisma.ListEnumIncentiveStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumIncentiveStatusWithAggregatesFilter<$PrismaModel> | $Enums.IncentiveStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumIncentiveStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumIncentiveStatusFilter<$PrismaModel>;
};
export type NestedEnumImportStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportStatus | Prisma.EnumImportStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ImportStatus[] | Prisma.ListEnumImportStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ImportStatus[] | Prisma.ListEnumImportStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumImportStatusFilter<$PrismaModel> | $Enums.ImportStatus;
};
export type NestedEnumImportStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportStatus | Prisma.EnumImportStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ImportStatus[] | Prisma.ListEnumImportStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ImportStatus[] | Prisma.ListEnumImportStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumImportStatusWithAggregatesFilter<$PrismaModel> | $Enums.ImportStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumImportStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumImportStatusFilter<$PrismaModel>;
};
export type NestedEnumImportRowStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRowStatus | Prisma.EnumImportRowStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ImportRowStatus[] | Prisma.ListEnumImportRowStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ImportRowStatus[] | Prisma.ListEnumImportRowStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumImportRowStatusFilter<$PrismaModel> | $Enums.ImportRowStatus;
};
export type NestedEnumImportRowStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRowStatus | Prisma.EnumImportRowStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ImportRowStatus[] | Prisma.ListEnumImportRowStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ImportRowStatus[] | Prisma.ListEnumImportRowStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumImportRowStatusWithAggregatesFilter<$PrismaModel> | $Enums.ImportRowStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumImportRowStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumImportRowStatusFilter<$PrismaModel>;
};
