import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

/**
 * Customer search & filters — Master Spec 11.
 * `search` covers membership ID, name, phone and email in one term.
 */
export class QueryCustomersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  /*
   * Kept in step with the CustomerStatus enum. EXPIRED was added when
   * Customer.status became a mirror of the memberships behind it, and omitting
   * it here made the list's own "Expired" filter a 400.
   */
  @IsEnum(['ACTIVE', 'PENDING', 'CANCELLED', 'EXPIRED'])
  status?: string;

  @IsOptional()
  @IsString()
  plan?: string;

  /** Filter by the owning Executive. Still subject to the caller's own scope. */
  @IsOptional()
  @IsUUID()
  assignedExecId?: string;

  /** Filter by Manager — matches customers owned by that manager's executives. */
  @IsOptional()
  @IsUUID()
  assignedManagerId?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

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
