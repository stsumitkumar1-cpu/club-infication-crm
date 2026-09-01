import { IsStrongPassword } from '../../common/validators/index.js';

/**
 * An administrator setting someone else's password.
 *
 * Deliberately narrower than UpdateUserDto, which also carries email, name,
 * role, managerId and isActive. A Manager is trusted to reset their own
 * Executive's password; letting that arrive through the general update endpoint
 * would have handed them role changes and deactivation along with it.
 */
export class SetPasswordDto {
  /** Same policy as every other entry point — see IsStrongPassword. */
  @IsStrongPassword()
  password!: string;
}
