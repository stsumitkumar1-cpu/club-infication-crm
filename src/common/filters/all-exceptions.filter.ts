import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { isProduction } from '../../config/env.js';

/**
 * One error shape for every endpoint — Master Spec 17 ("All endpoints return
 * consistent error response format").
 *
 * Two things this fixes beyond consistency:
 *
 * 1. An unexpected error previously surfaced Nest's default 500 body, which can
 *    carry an internal message. Outside development the message is replaced
 *    with a generic one, and the real error goes to the log with the
 *    correlation id so it is still diagnosable (Spec 16).
 * 2. Every response carries the correlation id, so a user can quote it.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const correlationId = req.correlationId;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';
    let error = HttpStatus[status] ?? 'Error';
    let extra: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object') {
        const asRecord = body as Record<string, unknown>;
        // class-validator returns message as an array; keep it as one.
        message = (asRecord.message as string | string[]) ?? exception.message;
        error = (asRecord.error as string) ?? error;
        // Preserve extras such as the rate limiter's retryAfter.
        const { message: _m, error: _e, statusCode: _s, ...rest } = asRecord;
        extra = rest;
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR || !isProduction) {
      console.error('\n' + '='.repeat(70));
      console.error(`🚨 [ERROR] ${req.method} ${req.originalUrl}`);
      console.error(`🆔 Correlation ID: ${correlationId}`);
      console.error(`📊 Status Code: ${status} (${error})`);
      if (exception instanceof Error) {
        console.error(`❌ Error Name: ${exception.name}`);
        console.error(`💬 Error Message: ${exception.message}`);
        console.error(`📍 Stack Trace:\n${exception.stack}`);
        if ((exception as any).cause) {
          console.error(`🔍 Cause:`, (exception as any).cause);
        }
      } else {
        console.error(`❌ Raw Exception:`, exception);
      }
      console.error('='.repeat(70) + '\n');

      this.logger.error(
        `${req.method} ${req.originalUrl} failed [${correlationId}]`,
        exception instanceof Error ? exception.stack : String(exception),
      );

      if (exception instanceof Error) {
        message = exception.message;
        extra = {
          ...extra,
          details: exception.stack,
          name: exception.name,
        };
      } else if (typeof exception === 'string') {
        message = exception;
      }
    }

    res.status(status).json({
      statusCode: status,
      message,
      error,
      correlationId,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
      ...extra,
    });
  }
}
