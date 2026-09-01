import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class QueryAuditDto {
  /** Who performed the action. */
  @IsOptional()
  @IsUUID()
  actorId?: string;

  /** Table/model name, e.g. "Customer", "Payment". */
  @IsOptional()
  @IsString()
  entity?: string;

  /** The specific record's id. */
  @IsOptional()
  @IsString()
  entityId?: string;

  /** CREATE, UPDATE, DELETE, CANCEL, ADJUSTMENT... */
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}
