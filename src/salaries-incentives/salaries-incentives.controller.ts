import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SalariesIncentivesService } from './salaries-incentives.service.js';
import { UpdateSalaryDto } from './dto/update-salary.dto.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { Roles } from '../common/decorators/index.js';
import { Role } from '@prisma/client';

@Controller('salaries-incentives')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalariesIncentivesController {
  constructor(private readonly service: SalariesIncentivesService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  getSalariesAndIncentives(@Query('period') period: string) {
    if (!period) {
      // Default to current month if not provided
      const now = new Date();
      period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    return this.service.getSalariesAndIncentives(period);
  }

  @Patch(':userId')
  @Roles(Role.SUPER_ADMIN)
  updateSalaryAndIncentive(
    @Param('userId') userId: string,
    @Body() dto: UpdateSalaryDto,
  ) {
    return this.service.updateSalaryAndIncentive(userId, dto);
  }
}
