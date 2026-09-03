import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsEmail,
  IsUUID,
  IsDate,
  IsInt,
  Max,
  MaxLength,
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

  /**
   * Second contact number. 175 rows of the legacy sheet hold two numbers in one
   * cell, and the client confirmed both are wanted.
   */
  @IsOptional()
  @IsString()
  @MaxLength(40)
  altPhone?: string;

  /** Second applicant on the membership. Present in 819 of 821 sheet rows. */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  coApplicant?: string;

  /** Town or city — Bathinda, Moga, Ludhiana. 108 distinct in the sheet. */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  /**
   * When the sale happened. Defaults to today; supplied when back-dating a
   * membership, which every imported row does.
   */
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  saleDate?: Date;

  /** The legacy sheet Offers column, verbatim. */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  offersText?: string;

  /**
   * Complimentary nights promised with the sale, credited to their own bucket
   * so they never inflate what the plan itself is worth.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(366)
  complimentaryNights?: number;

  /** Membership conditions — "only for India", "03 & 04 Star properties". */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarksText?: string;

  /** Annual Divided Cost due each year, separate from the plan price. */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  adaAmount?: number;

  /** Stay history that could not be parsed into bookings, kept verbatim. */
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  usageNotes?: string;

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
