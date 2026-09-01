import { IsString, IsOptional, IsNumber, IsEmail, IsEnum, Min } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

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
   * How the opening "Amount paid" arrived. Optional — it only labels the
   * payment row the service writes for that amount; no amount, no row.
   */
  @IsOptional()
  @IsString()
  paymentMethod?: string;


  @IsOptional()
  /*
   * Kept in step with the CustomerStatus enum. EXPIRED was added when
   * Customer.status became a mirror of the memberships behind it, and omitting
   * it here made the list's own "Expired" filter a 400.
   */
  @IsEnum(['ACTIVE', 'PENDING', 'CANCELLED', 'EXPIRED'])
  status?: string;
}
