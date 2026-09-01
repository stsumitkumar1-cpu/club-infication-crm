import { IsString, IsNotEmpty } from 'class-validator';
import { IsStrongPassword } from '../../common/validators/index.js';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsStrongPassword()
  newPassword: string;
}
