import { applyDecorators } from '@nestjs/common';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

/** Minimum length. Kept in one place so the UI hint cannot drift from the API. */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * bcrypt only hashes the first 72 bytes and silently ignores the rest, so a
 * longer password would give a false sense of strength.
 */
export const PASSWORD_MAX_LENGTH = 72;

export const PASSWORD_RULES_TEXT =
  'At least 8 characters, with an uppercase letter, a lowercase letter and a number.';

/**
 * One password policy for every entry point — user creation, admin edits and
 * self-service reset — so none of them can be the weak way in.
 *
 * Each rule is a separate check so the API returns which one failed rather
 * than one opaque "invalid password".
 */
export function IsStrongPassword(): PropertyDecorator {
  return applyDecorators(
    IsString(),
    MinLength(PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    }),
    MaxLength(PASSWORD_MAX_LENGTH, {
      message: `Password must be at most ${PASSWORD_MAX_LENGTH} characters`,
    }),
    Matches(/[a-z]/, {
      message: 'Password must contain a lowercase letter',
    }),
    Matches(/[A-Z]/, {
      message: 'Password must contain an uppercase letter',
    }),
    Matches(/[0-9]/, {
      message: 'Password must contain a number',
    }),
  );
}
