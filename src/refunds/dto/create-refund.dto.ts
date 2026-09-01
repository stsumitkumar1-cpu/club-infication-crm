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

export class CreateRefundDto {
  @IsUUID()
  customerId!: string;

  /** Spec 9.2: a refund belongs to a customer AND, where known, a membership. */
  @IsOptional()
  @IsUUID()
  membershipId?: string;

  @IsNumber()
  @Min(0.01, { message: 'Refund amount must be greater than zero' })
  amount!: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  idempotencyKey?: string;
}
