import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  customerId!: string;

  /** Which purchase the money is against. Optional for legacy/ad-hoc receipts. */
  @IsOptional()
  @IsUUID()
  membershipId?: string;

  @IsNumber()
  @Min(0.01, { message: 'Payment amount must be greater than zero' })
  amount!: number;

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

  /**
   * Idempotency control (Spec 8). Send a stable key and a retried request
   * returns the original payment rather than recording it a second time.
   */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  idempotencyKey?: string;
}
