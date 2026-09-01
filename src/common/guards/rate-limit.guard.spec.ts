// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitGuard, DEFAULT_LIMIT } from './rate-limit.guard.js';
import type { RateLimitOptions } from '../decorators/rate-limit.decorator.js';

/** Bare `Mock` defaults to an unknown signature, which rejects mock payloads. */
type AnyMock = Mock<(...args: any[]) => any>;
const mockFn = (): AnyMock => jest.fn<(...args: any[]) => any>();

describe('RateLimitGuard (Spec 16)', () => {
  let guard: RateLimitGuard;
  let reflector: { getAllAndOverride: AnyMock };
  let headers: Record<string, string>;

  /** Minimal ExecutionContext for one request from `ip` to `path`. */
  const ctx = (ip: string, path = '/auth/login', method = 'POST') =>
    ({
      getHandler: () => () => undefined,
      getClass: () => class {},
      switchToHttp: () => ({
        getRequest: () => ({
          ip,
          method,
          path,
          route: { path },
          socket: { remoteAddress: ip },
        }),
        getResponse: () => ({
          setHeader: (k: string, v: string) => {
            headers[k] = v;
          },
        }),
      }),
    }) as any;

  const withLimit = (options: RateLimitOptions | undefined) => {
    reflector.getAllAndOverride.mockReturnValue(options);
  };

  beforeEach(() => {
    headers = {};
    reflector = { getAllAndOverride: mockFn().mockReturnValue(undefined) };
    guard = new RateLimitGuard(reflector as unknown as Reflector);
  });

  describe('the brute-force case', () => {
    it('allows exactly the configured number then refuses', () => {
      withLimit({ limit: 5, windowSeconds: 60 });

      // Five attempts are fine — a real person mistyping.
      for (let i = 0; i < 5; i++) {
        expect(guard.canActivate(ctx('1.2.3.4'))).toBe(true);
      }

      // The sixth is the script.
      expect(() => guard.canActivate(ctx('1.2.3.4'))).toThrow(HttpException);
    });

    it('answers 429 with a Retry-After', () => {
      withLimit({ limit: 1, windowSeconds: 60 });
      guard.canActivate(ctx('1.2.3.4'));

      try {
        guard.canActivate(ctx('1.2.3.4'));
        throw new Error('should have thrown');
      } catch (error) {
        const e = error as HttpException;
        expect(e.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
        const body = e.getResponse() as Record<string, unknown>;
        expect(body.retryAfter).toBeGreaterThan(0);
        expect(headers['Retry-After']).toBeDefined();
      }
    });

    it('uses a custom message when one is given', () => {
      withLimit({
        limit: 1,
        windowSeconds: 60,
        message: 'Too many sign-in attempts.',
      });
      guard.canActivate(ctx('1.2.3.4'));

      try {
        guard.canActivate(ctx('1.2.3.4'));
        throw new Error('should have thrown');
      } catch (error) {
        const body = (error as HttpException).getResponse() as Record<
          string,
          unknown
        >;
        expect(body.message).toBe('Too many sign-in attempts.');
      }
    });
  });

  describe('isolation between callers and routes', () => {
    it('counts each IP separately, so one attacker cannot lock everyone out', () => {
      withLimit({ limit: 2, windowSeconds: 60 });

      guard.canActivate(ctx('1.1.1.1'));
      guard.canActivate(ctx('1.1.1.1'));
      expect(() => guard.canActivate(ctx('1.1.1.1'))).toThrow();

      // A different client is unaffected.
      expect(guard.canActivate(ctx('2.2.2.2'))).toBe(true);
    });

    it('counts each route separately', () => {
      withLimit({ limit: 1, windowSeconds: 60 });

      guard.canActivate(ctx('1.1.1.1', '/auth/login'));
      expect(() => guard.canActivate(ctx('1.1.1.1', '/auth/login'))).toThrow();

      // Hammering login must not exhaust the budget for reading customers.
      expect(guard.canActivate(ctx('1.1.1.1', '/customers', 'GET'))).toBe(true);
    });

    it('falls back to the socket address when req.ip is absent', () => {
      withLimit({ limit: 1, windowSeconds: 60 });
      const context = ctx(undefined as unknown as string);
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('the window expires', () => {
    it('allows requests again once the window has passed', () => {
      withLimit({ limit: 1, windowSeconds: 1 });
      const now = Date.now();
      const spy = jest.spyOn(Date, 'now');

      spy.mockReturnValue(now);
      guard.canActivate(ctx('1.1.1.1'));
      expect(() => guard.canActivate(ctx('1.1.1.1'))).toThrow();

      // Two seconds later the window has rolled over.
      spy.mockReturnValue(now + 2000);
      expect(guard.canActivate(ctx('1.1.1.1'))).toBe(true);

      spy.mockRestore();
    });
  });

  describe('configuration', () => {
    it('applies the default limit when a route declares none', () => {
      withLimit(undefined);

      for (let i = 0; i < DEFAULT_LIMIT.limit; i++) {
        expect(guard.canActivate(ctx('1.1.1.1', '/customers', 'GET'))).toBe(
          true,
        );
      }
      expect(() => guard.canActivate(ctx('1.1.1.1', '/customers', 'GET'))).toThrow();
    });

    it('a limit of 0 disables limiting entirely', () => {
      withLimit({ limit: 0, windowSeconds: 60 });
      for (let i = 0; i < 50; i++) {
        expect(guard.canActivate(ctx('1.1.1.1'))).toBe(true);
      }
    });

    it('publishes the standard rate-limit headers', () => {
      withLimit({ limit: 5, windowSeconds: 60 });
      guard.canActivate(ctx('1.1.1.1'));

      expect(headers['X-RateLimit-Limit']).toBe('5');
      expect(headers['X-RateLimit-Remaining']).toBe('4');
      expect(headers['X-RateLimit-Reset']).toBeDefined();
    });
  });
});
