import { IsNumber, IsString } from 'class-validator';

export class UpdateSalaryDto {
  @IsString()
  period: string; // YYYY-MM

  @IsNumber()
  baseSalary: number;

  @IsNumber()
  incentivePercentage: number;
}
