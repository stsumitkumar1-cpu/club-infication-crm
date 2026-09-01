import { Module } from '@nestjs/common';
import { RefundsController } from './refunds.controller.js';
import { RefundsService } from './refunds.service.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [AuditModule],
  controllers: [RefundsController],
  providers: [RefundsService],
  exports: [RefundsService],
})
export class RefundsModule {}
