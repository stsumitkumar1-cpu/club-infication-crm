"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RateLimitGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = exports.DEFAULT_LIMIT = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rate_limit_decorator_js_1 = require("../decorators/rate-limit.decorator.js");
exports.DEFAULT_LIMIT = { limit: 120, windowSeconds: 60 };
let RateLimitGuard = class RateLimitGuard {
    static { RateLimitGuard_1 = this; }
    reflector;
    logger = new common_1.Logger(RateLimitGuard_1.name);
    counters = new Map();
    lastSweep = Date.now();
    static SWEEP_INTERVAL_MS = 60_000;
    constructor(reflector) {
        this.reflector = reflector;
    }
    sweep(now) {
        if (now - this.lastSweep < RateLimitGuard_1.SWEEP_INTERVAL_MS) {
            return;
        }
        for (const [key, counter] of this.counters) {
            if (counter.resetAt <= now) {
                this.counters.delete(key);
            }
        }
        this.lastSweep = now;
    }
    clientKey(req) {
        return (req.ip ??
            req.socket?.remoteAddress ??
            'unknown');
    }
    canActivate(context) {
        const options = this.reflector.getAllAndOverride(rate_limit_decorator_js_1.RATE_LIMIT_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? exports.DEFAULT_LIMIT;
        if (options.limit <= 0) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const now = Date.now();
        this.sweep(now);
        const routeKey = `${req.method} ${req.route?.path ?? req.path}`;
        const key = `${this.clientKey(req)}|${routeKey}`;
        let counter = this.counters.get(key);
        if (!counter || counter.resetAt <= now) {
            counter = { count: 0, resetAt: now + options.windowSeconds * 1000 };
            this.counters.set(key, counter);
        }
        counter.count += 1;
        const remaining = Math.max(options.limit - counter.count, 0);
        const retryAfterSeconds = Math.ceil((counter.resetAt - now) / 1000);
        res.setHeader?.('X-RateLimit-Limit', String(options.limit));
        res.setHeader?.('X-RateLimit-Remaining', String(remaining));
        res.setHeader?.('X-RateLimit-Reset', String(Math.ceil(counter.resetAt / 1000)));
        if (counter.count > options.limit) {
            res.setHeader?.('Retry-After', String(retryAfterSeconds));
            this.logger.warn(`Rate limit exceeded: ${routeKey} from ${this.clientKey(req)} (${counter.count}/${options.limit})`);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                message: options.message ??
                    `Too many requests. Please try again in ${retryAfterSeconds} second(s).`,
                error: 'Too Many Requests',
                retryAfter: retryAfterSeconds,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = RateLimitGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map