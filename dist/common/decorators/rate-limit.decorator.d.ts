export declare const RATE_LIMIT_KEY = "rateLimit";
export interface RateLimitOptions {
    limit: number;
    windowSeconds: number;
    message?: string;
}
export declare const RateLimit: (options: RateLimitOptions) => import("@nestjs/common", { with: { "resolution-mode": "import" } }).CustomDecorator<string>;
