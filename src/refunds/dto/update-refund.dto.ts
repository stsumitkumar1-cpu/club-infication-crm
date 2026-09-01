import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * As with payments, the amount is immutable — a wrong refund amount is deleted
 * and re-recorded so the history reflects reality (Spec 9.1).
 */
export class UpdateRefundDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
