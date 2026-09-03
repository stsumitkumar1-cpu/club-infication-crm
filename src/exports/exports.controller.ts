import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { Role } from '@prisma/client';
import { ExportsService } from './exports.service.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Excel export.
 *
 * Super Admin and Manager only. An Executive is deliberately excluded: their
 * scope is a handful of customers they already see on screen, and a one-click
 * spreadsheet of member names, phone numbers and payment history is the kind of
 * thing that should need a reason. The Manager's export is still scoped to
 * their own team.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exports')
export class ExportsController {
  constructor(private exportsService: ExportsService) {}

  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @Get('customers')
  async customers(@CurrentUser() user: AuthUser, @Res() res: Response) {
    const { buffer, fileName, rowCount } =
      await this.exportsService.customersWorkbook(user);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`,
    );
    // Read by the frontend to report how many rows were exported. Must be
    // exposed in CORS or the browser cannot see it.
    res.setHeader('X-Export-Rows', String(rowCount));
    res.setHeader('Content-Length', String(buffer.length));
    res.end(buffer);
  }
}
