import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/** Plan definition — Master Spec 6.2 `packages`. */
export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(0)
  @Max(3650)
  days!: number;

  @IsInt()
  @Min(0)
  @Max(3650)
  nights!: number;

  /**
   * Nights granted each membership year.
   *
   * The legacy sheet quotes plans this way ("06N/07Days" per year, "30Nights"
   * over five years) and the client confirmed unused nights lapse at the end of
   * each year. Optional: leaving it out keeps the older behaviour, where
   * `nights` is one pool for the whole term with no annual cap.
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(366)
  nightsPerYear?: number;

  /** Validity in months, e.g. 60 for a 5-year plan. */
  @IsInt()
  @Min(1)
  @Max(1200)
  validityMonths!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
