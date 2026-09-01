import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { env, isProduction } from './config/env.js';
import { RateLimitGuard } from './common/guards/index.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Quieter in production; full detail while developing.
    logger: isProduction
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  /*
   * Security headers — Spec 16. Sets nosniff, frameguard, HSTS and friends.
   * contentSecurityPolicy is disabled because this process serves only JSON;
   * the React app is served separately and needs its own policy.
   */
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  /*
   * Required for rate limiting to work behind a reverse proxy: without it
   * Express reports the proxy's address for every request, so all clients
   * share one counter. Only enabled in production, where a proxy is expected.
   */
  if (isProduction) {
    app.set('trust proxy', 1);
  }

  // Global API prefix: all routes become /api/...
  app.setGlobalPrefix('api');

  // Global validation pipe: auto-validates all DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Strip properties not in the DTO
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true,         // Auto-transform payloads to DTO instances
    }),
  );

  // One error shape everywhere, with the correlation id attached (Spec 17).
  app.useGlobalFilters(new AllExceptionsFilter());

  /*
   * Rate limiting applies to every route by default (Spec 16). Individual
   * routes tighten it with @RateLimit() — the auth endpoints do.
   */
  app.useGlobalGuards(new RateLimitGuard(app.get(Reflector)));

  // CORS: allow frontend dev server
  app.enableCors({
    origin: env.frontendUrl,
    credentials: true,
    exposedHeaders: ['X-Correlation-Id', 'Retry-After', 'X-RateLimit-Remaining'],
  });

  await app.listen(env.port);

  const logger = new Logger('Bootstrap');
  logger.log(
    `Club Infication CRM API running on http://localhost:${env.port}/api (${env.nodeEnv})`,
  );
  logger.log(`Health check: http://localhost:${env.port}/api/health`);
}
bootstrap();
