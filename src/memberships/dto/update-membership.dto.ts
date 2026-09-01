import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateMembershipDto {
  @IsOptional()
  @IsUUID()
  packageId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsEnum(['ACTIVE', 'EXPIRED', 'CANCELLED'])
  status?: string;
}
