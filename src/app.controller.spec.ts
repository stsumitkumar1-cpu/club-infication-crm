// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test, type TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './database/prisma.service.js';

/** Bare `Mock` defaults to an unknown signature, which rejects mock payloads. */
type AnyMock = Mock<(...args: any[]) => any>;
const mockFn = (): AnyMock => jest.fn<(...args: any[]) => any>();

describe('AppController', () => {
  let appController: AppController;
  let prisma: { $queryRaw: AnyMock };
  /** Captures the status a passthrough response would have been given. */
  let res: { status: AnyMock };

  beforeEach(async () => {
    prisma = { $queryRaw: mockFn().mockResolvedValue([{ 1: 1 }]) };
    res = { status: mockFn() };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('identifies the service', () => {
      expect(appController.getHello()).toBe('Club Infication CRM API');
    });
  });

  describe('health check (Spec 15)', () => {
    it('reports ok when the database answers', async () => {
      const report = await appController.getHealth(res as any);

      expect(report.status).toBe('ok');
      expect(report.checks.database.status).toBe('up');
      expect(typeof report.checks.database.latencyMs).toBe('number');
      // 200 is the default, so no override is expected.
      expect(res.status).not.toHaveBeenCalled();
    });

    it('actually queries the database rather than assuming', async () => {
      await appController.getHealth(res as any);
      expect(prisma.$queryRaw).toHaveBeenCalled();
    });

    it('reports degraded and 503 when the database is unreachable', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

      const report = await appController.getHealth(res as any);

      expect(report.status).toBe('degraded');
      expect(report.checks.database.status).toBe('down');
      expect(report.checks.database.error).toMatch(/connection refused/);
      // A load balancer must see a failure code, not a cheerful 200.
      expect(res.status).toHaveBeenCalledWith(503);
    });

    it('includes uptime and a timestamp', async () => {
      const report = await appController.getHealth(res as any);
      expect(typeof report.uptimeSeconds).toBe('number');
      expect(() => new Date(report.timestamp).toISOString()).not.toThrow();
    });
  });
});
