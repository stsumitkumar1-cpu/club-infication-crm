import { IsUUID } from 'class-validator';

export class UnassignExecutiveDto {
  @IsUUID()
  executiveId!: string;
}
