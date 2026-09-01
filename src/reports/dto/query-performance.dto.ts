import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const PERFORMANCE_SORT_FIELDS = [
  'totalSales',
  'collected',
  'pending',
  'customers',
  'daysUsed',
  'name',
] as const;

export class QueryPerformanceDto {
  /** Match on executive name or email. */
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(PERFORMANCE_SORT_FIELDS)
  sortBy?: (typeof PERFORMANCE_SORT_FIELDS)[number];

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
