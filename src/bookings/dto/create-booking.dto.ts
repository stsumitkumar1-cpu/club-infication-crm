import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  customerId!: string;

  /** Entitlement lives on the membership, so a booking must name one. */
  @IsUUID()
  membershipId!: string;

  @Type(() => Date)
  @IsDate()
  checkIn!: Date;

  @Type(() => Date)
  @IsDate()
  checkOut!: Date;

  /**
   * Normally derived from the dates (nights = checkOut - checkIn). Supply this
   * only to charge a stay fewer nights than its calendar span.
   *
   * There is deliberately no daysUsed counterpart: the day figure on a booking
   * is the span of the nights it charges, so accepting it separately would let
   * a stored figure contradict both the dates and the balance.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nightsUsed?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  /** Idempotency control (Spec 8): a retry must not consume entitlement twice. */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  idempotencyKey?: string;
}
