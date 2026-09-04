import { Module } from '@nestjs/common';
import { SalariesIncentivesService } from './salaries-incentives.service.js';
import { SalariesIncentivesController } from './salaries-incentives.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [SalariesIncentivesController],
  providers: [SalariesIncentivesService],
})
export class SalariesIncentivesModule {}
