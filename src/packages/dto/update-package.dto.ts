import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3650)
  days?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3650)
  nights?: number;

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

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1200)
  validityMonths?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
