import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service.js';
import { RateLimit } from './common/decorators/index.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Health check — Master Spec 15. Public and unauthenticated so a load
   * balancer or uptime monitor can poll it, but rate limited so it cannot be
   * used to hammer the database.
   *
   * Returns 503 when the database is unreachable, so orchestrators actually
   * react instead of seeing a cheerful 200.
   */
  @Get('health')
  @RateLimit({ limit: 60, windowSeconds: 60 })
  @HttpCode(HttpStatus.OK)
  async getHealth(@Res({ passthrough: true }) res: Response) {
    const report = await this.appService.getHealth();
    if (report.status !== 'ok') {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
    return report;
  }
}
