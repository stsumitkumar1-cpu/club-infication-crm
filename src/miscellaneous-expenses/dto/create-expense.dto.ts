import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
