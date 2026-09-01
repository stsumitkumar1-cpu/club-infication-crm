import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Spec 9.1: payment history must never be overwritten, so the amount is
 * deliberately absent — it cannot be edited. Correcting an amount means
 * deleting the row (Super Admin, audited) and recording the right one.
 */
export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  method?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
