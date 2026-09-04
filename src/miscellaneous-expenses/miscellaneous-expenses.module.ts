import { Module } from '@nestjs/common';
import { MiscellaneousExpensesService } from './miscellaneous-expenses.service.js';
import { MiscellaneousExpensesController } from './miscellaneous-expenses.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [MiscellaneousExpensesController],
  providers: [MiscellaneousExpensesService],
})
export class MiscellaneousExpensesModule {}
