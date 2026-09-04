import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type RateLimitOptions } from '../decorators/rate-limit.decorator.js';
export declare const DEFAULT_LIMIT: RateLimitOptions;
export declare class RateLimitGuard implements CanActivate {
    private reflector;
    private readonly logger;
    private readonly counters;
    private lastSweep;
    private static readonly SWEEP_INTERVAL_MS;
    constructor(reflector: Reflector);
    private sweep;
    private clientKey;
    canActivate(context: ExecutionContext): boolean;
}
