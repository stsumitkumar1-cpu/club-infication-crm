import { PrismaService } from './database/prisma.service.js';
export interface HealthReport {
    status: 'ok' | 'degraded';
    service: string;
    environment: string;
    uptimeSeconds: number;
    timestamp: string;
    checks: {
        database: {
            status: 'up' | 'down';
            latencyMs?: number;
            error?: string;
        };
    };
}
export declare class AppService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getHello(): string;
    getHealth(): Promise<HealthReport>;
}
