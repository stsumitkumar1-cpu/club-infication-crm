import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsEmail,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  plan: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountPaid?: number;

  @IsOptional()
  @IsString()
  validity?: string;

  @IsOptional()
  @IsNumber()
  totalDays?: number;

  @IsOptional()
  @IsNumber()
  totalNights?: number;

  @IsOptional()
  @IsString()
  assignedExecId?: string;

  @IsOptional()
  @IsString()
  membershipId?: string;

  /**
   * The catalogue plan being sold, if one is being sold now.
   *
   * Optional so a customer can still be recorded before a plan is agreed. When
   * given, the plan purchase, its entitlement allocation and the opening payment
   * are all written in the same transaction as the customer — Spec 8.1. Without
   * it the customer's plan columns would name a plan they do not actually hold.
   */
  @IsOptional()
  @IsUUID()
  packageId?: string;

  /**
   * How the opening "Amount paid" arrived. Optional — it only labels the
   * payment row the service writes for that amount; no amount, no row.
   */
  @IsOptional()
  @IsString()
  paymentMethod?: string;

}
