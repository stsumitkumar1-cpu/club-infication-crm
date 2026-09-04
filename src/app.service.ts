import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './database/prisma.service.js';
import { env } from './config/env.js';

export interface HealthReport {
  status: 'ok' | 'degraded';
  service: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  checks: {
    database: { status: 'up' | 'down'; latencyMs?: number; error?: string };
  };
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Club Infication CRM API';
  }

  /**
   * Health check — Master Spec 15.
   *
   * Actually queries the database rather than just returning 200: a process
   * that is running but cannot reach MySQL is not healthy, and that is
   * exactly the failure a load balancer needs to detect.
   */
  async getHealth(): Promise<HealthReport> {
    const startedAt = Date.now();
    let database: HealthReport['checks']['database'];

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = { status: 'up', latencyMs: Date.now() - startedAt };
    } catch (error) {
      this.logger.error(
        'Health check failed: database unreachable',
        error instanceof Error ? error.stack : undefined,
      );
      database = {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    return {
      status: database.status === 'up' ? 'ok' : 'degraded',
      service: 'club-infication-crm-api',
      environment: env.nodeEnv,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      checks: { database },
    };
  }
}
