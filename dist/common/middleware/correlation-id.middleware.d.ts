import { type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
export declare const CORRELATION_HEADER = "x-correlation-id";
declare module 'express-serve-static-core' {
    interface Request {
        correlationId?: string;
    }
}
export declare class CorrelationIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
