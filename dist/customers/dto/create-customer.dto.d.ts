export declare class CreateCustomerDto {
    name: string;
    phone: string;
    email?: string;
    altPhone?: string;
    coApplicant?: string;
    location?: string;
    saleDate?: Date;
    offersText?: string;
    complimentaryNights?: number;
    remarksText?: string;
    adaAmount?: number;
    usageNotes?: string;
    plan: string;
    amount: number;
    amountPaid?: number;
    validity?: string;
    totalDays?: number;
    totalNights?: number;
    assignedExecId?: string;
    membershipId?: string;
    packageId?: string;
    paymentMethod?: string;
}
