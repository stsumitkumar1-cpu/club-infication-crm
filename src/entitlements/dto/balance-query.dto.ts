import { IsOptional, IsUUID } from 'class-validator';

export class BalanceQueryDto {
  @IsUUID()
  customerId!: string;

  /** Omit for the customer's whole balance across every membership. */
  @IsOptional()
  @IsUUID()
  membershipId?: string;
}
