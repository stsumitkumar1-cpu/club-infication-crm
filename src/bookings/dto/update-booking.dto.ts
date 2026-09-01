import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Notes only. Dates and consumed days/nights are immutable because the ledger
 * already records what they took — changing them would desynchronise the
 * balance from its own history. Cancel and re-book instead.
 */
export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
