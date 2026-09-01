import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

/**
 * A membership is a customer's purchased instance of a package — Spec 6.2.
 *
 * `endDate` is normally left out and derived from the package's
 * `validityMonths`, so validity stops being the free-text "5 Years" on the
 * customer record and becomes a real date the system can reason about.
 */
export class CreateMembershipDto {
  @IsUUID()
  customerId!: string;

  @IsUUID()
  packageId!: string;

  /** Defaults to now. */
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  /** Overrides the date derived from the package validity. */
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
