import { Role } from '@prisma/client';

/**
 * Shape of the JWT payload attached to `request.user` by JwtAuthGuard.
 * `sub` is the user id — see AuthService.generateTokens().
 */
export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  role: Role;
}
