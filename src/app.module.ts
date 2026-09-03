import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { AuditModule } from './audit/audit.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { TeamsModule } from './teams/teams.module.js';
import { PackagesModule } from './packages/packages.module.js';
import { MembershipsModule } from './memberships/memberships.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { RefundsModule } from './refunds/refunds.module.js';
import { EntitlementsModule } from './entitlements/entitlements.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { SearchModule } from './search/search.module.js';
import { ExportsModule } from './exports/exports.module.js';
import { ImportsModule } from './imports/imports.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware.js';

@Module({
  imports: [
    DatabaseModule,
    AuditModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    PackagesModule,
    MembershipsModule,
    PaymentsModule,
    RefundsModule,
    EntitlementsModule,
    BookingsModule,
    ReportsModule,
    NotificationsModule,
    CustomersModule,
    SearchModule,
    ExportsModule,
    ImportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  /** Every request gets a correlation id before anything else runs (Spec 15). */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
