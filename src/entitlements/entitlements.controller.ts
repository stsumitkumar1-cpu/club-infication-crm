import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { EntitlementsService } from './entitlements.service.js';
import {
  AdjustEntitlementDto,
  BalanceQueryDto,
  QueryLedgerDto,
} from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Days/nights balance and ledger — Master Spec 17 `/entitlements`.
 *
 * There is no endpoint to edit or delete a ledger row: the ledger is
 * append-only (Spec 7), so a correction is a new ADJUSTMENT movement rather
 * than a rewrite of history. Adjustments are Super Admin only.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('entitlements')
export class EntitlementsController {
  constructor(private entitlementsService: EntitlementsService) {}

  /** Remaining days/nights, with the credit/debit breakdown behind it. */
  @Get('balance')
  getBalance(
    @Query() query: BalanceQueryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.entitlementsService.getBalance(query, user);
  }

  /** The movement history itself. */
  @Get()
  findAll(@Query() query: QueryLedgerDto, @CurrentUser() user: AuthUser) {
    return this.entitlementsService.findAll(query, user);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('adjust')
  adjust(@Body() dto: AdjustEntitlementDto, @CurrentUser() user: AuthUser) {
    return this.entitlementsService.adjust(dto, user);
  }
}
