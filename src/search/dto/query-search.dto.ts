import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class QuerySearchDto {
  /**
   * The term. Two characters minimum is enforced in the service rather than
   * here: a single character is a legitimate thing for a user to have typed on
   * the way to a longer word, so it returns an empty result instead of a 400
   * the search box would have to render as an error.
   */
  @IsString()
  @MaxLength(120)
  q!: string;

  /** Per-group cap, not an overall one — each group is capped separately. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}
