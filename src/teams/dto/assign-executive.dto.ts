import { IsOptional, IsUUID } from 'class-validator';

export class AssignExecutiveDto {
  @IsUUID()
  executiveId!: string;

  /**
   * Target manager. Required for SUPER_ADMIN (who may assign to any manager).
   * A MANAGER may only assign to themselves, so this is optional for them and
   * must equal their own id when supplied.
   */
  @IsOptional()
  @IsUUID()
  managerId?: string;
}
