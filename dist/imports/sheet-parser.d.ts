export declare function isBlank(value: unknown): boolean;
export declare function text(value: unknown): string | null;
export declare function money(value: unknown): number | null;
export declare function integer(value: unknown): number | null;
export declare function years(value: unknown): number | null;
export declare function nightsPerYear(value: unknown): {
    nights: number;
    days: number | null;
} | null;
export declare function totalNights(value: unknown): number | null;
export declare function phones(value: unknown): {
    phone: string | null;
    altPhone: string | null;
};
export declare function complimentaryNights(value: unknown): number | null;
export declare function excelDate(value: unknown): Date | null;
export declare const PAYMENT_METHODS: readonly ["Cash", "UPI", "Credit Card", "Debit Card", "Cheque", "Bank Transfer"];
export declare function paymentMethod(value: unknown): string | null;
export declare function consultantKey(value: unknown): string | null;
export declare function consultantFirstName(value: unknown): string | null;
export interface ParsedStay {
    nights: number | null;
    checkIn: Date | null;
    checkOut: Date | null;
    place: string | null;
    hotel: string | null;
    rawNights: string | null;
    rawDates: string | null;
    confident: boolean;
}
export declare function parseStays(usedNights: unknown, dates: unknown, place: unknown, hotel: unknown): ParsedStay[];
export declare function normaliseHeader(header: unknown): string | null;
export type SheetField = 'saleDate' | 'serial' | 'name' | 'coApplicant' | 'phone' | 'email' | 'consultant' | 'location' | 'product' | 'productCost' | 'paidAmount' | 'paymentMode' | 'pending' | 'mafNo' | 'ada' | 'adaPaid' | 'nightsPerYear' | 'totalNights' | 'usedNights' | 'offers' | 'remarks' | 'stayDates' | 'place' | 'hotel' | 'vCall' | 'courier' | 'emiMonth' | 'emiDoc' | 'extraUpdate';
export declare function mapHeaderRow(headers: unknown[]): {
    fields: (SheetField | null)[];
    duplicates: string[];
};
export type RawRow = Partial<Record<SheetField, unknown>>;
export interface RowIssue {
    field: string;
    severity: 'error' | 'warning';
    message: string;
}
export interface MappedRow {
    sheet: string;
    rowNumber: number;
    name: string | null;
    coApplicant: string | null;
    phone: string | null;
    altPhone: string | null;
    email: string | null;
    location: string | null;
    consultant: string | null;
    saleDate: Date | null;
    years: number | null;
    nightsPerYear: number | null;
    daysPerYear: number | null;
    totalNights: number | null;
    productCost: number | null;
    paidAmount: number | null;
    paymentMode: string | null;
    pending: number | null;
    mafNo: string | null;
    ada: number | null;
    adaPaid: number | null;
    offers: string | null;
    complimentaryNights: number | null;
    remarks: string | null;
    stays: ParsedStay[];
    usageNotes: string | null;
    issues: RowIssue[];
}
export declare function mapRow(sheet: string, rowNumber: number, raw: RawRow): MappedRow;
export declare function isCommittable(row: MappedRow): boolean;
export declare function planNameFor(years: number, nightsPerYear: number): string;
