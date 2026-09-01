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

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1200)
  validityMonths?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
