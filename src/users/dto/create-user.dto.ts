import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsStrongPassword } from '../../common/validators/index.js';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsStrongPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsString()
  managerId?: string;
}
