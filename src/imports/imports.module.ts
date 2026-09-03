import { Module } from '@nestjs/common';
import { ImportsController } from './imports.controller.js';
import { ImportsService } from './imports.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { AuditModule } from '../audit/audit.module.js';
// Rows are written through CustomersService so the import cannot skip the
// invariants it guarantees — see ImportsService.commit.
import { CustomersModule } from '../customers/customers.module.js';

@Module({
  imports: [DatabaseModule, AuditModule, CustomersModule],
  controllers: [ImportsController],
  providers: [ImportsService],
})
export class ImportsModule {}
