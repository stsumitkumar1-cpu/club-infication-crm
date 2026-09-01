import { IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../../common/validators/index.js';

/**
 * Self-service password change for the signed-in user.
 *
 * The current password is required and re-verified server-side. A valid access
 * token alone is not enough: tokens outlive the browser tab they were issued in,
 * so without this check an unattended session would be enough to lock the real
 * owner out of their own account.
 */
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Your current password is required' })
  currentPassword!: string;

  /** Same policy as every other entry point — see IsStrongPassword. */
  @IsStrongPassword()
  newPassword!: string;
}
