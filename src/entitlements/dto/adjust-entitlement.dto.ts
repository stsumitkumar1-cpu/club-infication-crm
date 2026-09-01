import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Manual entitlement correction — Spec 7 ADJUSTMENT.
 * A reason is mandatory: an unexplained movement in a financial-grade ledger
 * is worse than no movement at all.
 */
export class AdjustEntitlementDto {
  @IsUUID()
  customerId!: string;

  @IsOptional()
  @IsUUID()
  membershipId?: string;

  /**
   * Positive credits, negative debits. Nights are the entire budget — the day
   * figure shown beside a balance is derived from it, so there is nothing to
   * adjust separately.
   */
  @Type(() => Number)
  @IsInt()
  @Min(-3650)
  @Max(3650)
  nights!: number;

  @IsString()
  @IsNotEmpty({ message: 'A reason is required for a manual adjustment' })
  @MaxLength(500)
  reason!: string;
}
