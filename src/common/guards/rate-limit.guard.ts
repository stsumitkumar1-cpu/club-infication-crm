import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import {
  RATE_LIMIT_KEY,
  type RateLimitOptions,
} from '../decorators/rate-limit.decorator.js';

/**
 * Fixed-window rate limiting — Master Spec 16 ("Rate limiting for
 * authentication endpoints").
 *
 * Deliberately in-process rather than Redis-backed: §3 rules Redis out, and a
 * modular monolith on one instance needs nothing more. The trade-off is that
 * counters are per-process, so behind several instances each would allow the
 * limit independently. If this ever scales horizontally, swap the store for a
 * PostgreSQL table or a sticky load balancer — the guard interface stays the
 * same.
 *
 * @nestjs/throttler was the obvious choice but it declares peer support only
 * up to @nestjs/common ^11 and ships CJS, while this project runs Nest 12 as
 * ESM.
 */

interface Counter {
  count: number;
  /** Epoch ms at which this window ends. */
  resetAt: number;
}

/** Applied to any route without its own @RateLimit(). */
export const DEFAULT_LIMIT: RateLimitOptions = { limit: 120, windowSeconds: 60 };

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);
  private readonly counters = new Map<string, Counter>();

  /** Stops the map growing without bound on a long-running process. */
  private lastSweep = Date.now();
  private static readonly SWEEP_INTERVAL_MS = 60_000;

  constructor(private reflector: Reflector) {}

  private sweep(now: number): void {
    if (now - this.lastSweep < RateLimitGuard.SWEEP_INTERVAL_MS) {
      return;
    }
    for (const [key, counter] of this.counters) {
      if (counter.resetAt <= now) {
        this.counters.delete(key);
      }
    }
    this.lastSweep = now;
  }

  /**
   * The caller's identity for counting purposes.
   *
   * `req.ip` respects Express's trust-proxy setting, so behind a reverse proxy
   * `app.set('trust proxy', ...)` must be configured or every request will
   * look like it comes from the proxy itself.
   */
  private clientKey(req: Request): string {
    return (
      req.ip ??
      req.socket?.remoteAddress ??
      'unknown'
    );
  }

  canActivate(context: ExecutionContext): boolean {
    const options =
      this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? DEFAULT_LIMIT;

    // A limit of 0 disables the guard for that route.
    if (options.limit <= 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse();
    const now = Date.now();

    this.sweep(now);

    // Counted per client AND per route, so hammering login cannot exhaust a
    // user's budget for reading customers.
    const routeKey = `${req.method} ${(req.route?.path as string) ?? req.path}`;
    const key = `${this.clientKey(req)}|${routeKey}`;

    let counter = this.counters.get(key);
    if (!counter || counter.resetAt <= now) {
      counter = { count: 0, resetAt: now + options.windowSeconds * 1000 };
      this.counters.set(key, counter);
    }

    counter.count += 1;

    const remaining = Math.max(options.limit - counter.count, 0);
    const retryAfterSeconds = Math.ceil((counter.resetAt - now) / 1000);

    // Standard headers so clients can back off before being refused.
    res.setHeader?.('X-RateLimit-Limit', String(options.limit));
    res.setHeader?.('X-RateLimit-Remaining', String(remaining));
    res.setHeader?.(
      'X-RateLimit-Reset',
      String(Math.ceil(counter.resetAt / 1000)),
    );

    if (counter.count > options.limit) {
      res.setHeader?.('Retry-After', String(retryAfterSeconds));

      // Logged at warn: repeated hits on an auth route are worth noticing.
      this.logger.warn(
        `Rate limit exceeded: ${routeKey} from ${this.clientKey(req)} (${counter.count}/${options.limit})`,
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message:
            options.message ??
            `Too many requests. Please try again in ${retryAfterSeconds} second(s).`,
          error: 'Too Many Requests',
          retryAfter: retryAfterSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
