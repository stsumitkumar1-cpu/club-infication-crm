import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller.js';
import { PackagesService } from './packages.service.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [AuditModule],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}
