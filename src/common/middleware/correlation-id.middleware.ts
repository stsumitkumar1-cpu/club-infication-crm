import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

/** Header clients may send to carry their own trace id through. */
export const CORRELATION_HEADER = 'x-correlation-id';

declare module 'express-serve-static-core' {
  interface Request {
    correlationId?: string;
  }
}

/**
 * Gives every request an id — Master Spec 15 ("Request / correlation IDs").
 *
 * Without one, a customer reporting "it failed at 3pm" cannot be tied to a log
 * line or an error response. An inbound id is honoured so a trace can span the
 * frontend and the API; otherwise one is generated.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const inbound = req.headers[CORRELATION_HEADER];
    const id =
      (Array.isArray(inbound) ? inbound[0] : inbound)?.slice(0, 100) ||
      randomUUID();

    req.correlationId = id;
    // Echoed back so the caller can quote it in a bug report.
    res.setHeader(CORRELATION_HEADER, id);
    next();
  }
}
