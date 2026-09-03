export declare class CreateCustomerDto {
    name: string;
    phone: string;
    email?: string;
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
