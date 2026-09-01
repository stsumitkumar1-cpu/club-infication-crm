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

  /** Validity in months, e.g. 60 for a 5-year plan. */
  @IsInt()
  @Min(1)
  @Max(1200)
  validityMonths!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
