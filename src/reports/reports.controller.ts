import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { QueryPerformanceDto, QueryReportDto } from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Role-scoped dashboards and reports — Master Spec 17 `/reports`.
 *
 * There is no @Roles() gate here on purpose: every role gets the same
 * endpoints, and what differs is the scope of the data (Spec 12). A Super
 * Admin sees the company, a Manager their team, an Executive themselves —
 * enforced in the service by the same filters the operational endpoints use,
 * so a dashboard total can never include a record the caller cannot open.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  /** Everything the signed-in role's dashboard needs, in one call. */
  @Get('dashboard')
  getDashboard(@CurrentUser() user: AuthUser) {
    return this.reportsService.getDashboard(user);
  }

  /** Per-executive sales and usage rollup. */
  @Get('executive-performance')
  getExecutivePerformance(
    @Query() query: QueryPerformanceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reportsService.getExecutivePerformance(user, query);
  }

  /** Customers still owing money, largest first. */
  @Get('pending-payments')
  getPendingPayments(
    @Query() query: QueryReportDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reportsService.getPendingPayments(query, user);
  }

  /** Days/nights position per customer, from the ledger. */
  @Get('customer-usage')
  getCustomerUsage(
    @Query() query: QueryReportDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reportsService.getCustomerUsage(query, user);
  }
}
