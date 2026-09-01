import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuditService } from './audit.service.js';
import { QueryAuditDto } from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { Roles } from '../common/decorators/index.js';

/**
 * Audit trail review — Master Spec 15, Phase 10.
 *
 * SUPER_ADMIN only. The trail is deliberately unscoped — it is the record of
 * everything that happened across the system — so restricting the whole
 * controller by role is what keeps a Manager from reading another team's
 * activity through it.
 *
 * Read-only: there is no endpoint to write, edit or delete an entry. Rows are
 * created only as a side effect of the operations they describe, inside the
 * same transaction.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  findAll(@Query() query: QueryAuditDto) {
    return this.auditService.findAll(query);
  }

  /** Distinct entities and actions on record, for filter dropdowns. */
  @Get('filters')
  getFilters() {
    return this.auditService.getFilterOptions();
  }
}
