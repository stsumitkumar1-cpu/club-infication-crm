import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rateLimit';

export interface RateLimitOptions {
  /** Requests allowed per window. 0 disables limiting for the route. */
  limit: number;
  windowSeconds: number;
  /** Overrides the default 429 message. */
  message?: string;
}

/**
 * Tightens (or loosens) the rate limit for one route or controller.
 * Without it a route gets DEFAULT_LIMIT from RateLimitGuard.
 *
 * Authentication endpoints need a far stricter limit than ordinary reads —
 * Master Spec 16.
 */
export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);
