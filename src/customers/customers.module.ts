import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller.js';
import { CustomersService } from './customers.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { AuditModule } from '../audit/audit.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { MembershipsModule } from '../memberships/memberships.module.js';

@Module({
  // MembershipsModule so intake can record the first plan purchase in the same
  // transaction. Not circular: MembershipsModule does not import this one.
  imports: [
    DatabaseModule,
    AuditModule,
    NotificationsModule,
    MembershipsModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
