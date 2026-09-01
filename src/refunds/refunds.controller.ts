import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { RefundsService } from './refunds.service.js';
import {
  CreateRefundDto,
  QueryRefundsDto,
  UpdateRefundDto,
} from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Refund records — Master Spec 17 `/refunds`.
 *
 * CLIENT_CLARIFICATION_REQUIRED (Spec 22 #3): who may create or approve a
 * refund is unconfirmed. Money leaving the business is treated as a
 * higher-trust action than money arriving, so recording a refund is limited to
 * SUPER_ADMIN and MANAGER while Executives may only read their own customers'
 * refunds. Widening this to Executives is a one-line change once confirmed.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('refunds')
export class RefundsController {
  constructor(private refundsService: RefundsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  create(@Body() dto: CreateRefundDto, @CurrentUser() user: AuthUser) {
    return this.refundsService.create(dto, user);
  }

  /** Readable by every role, scope-filtered through the owning customer. */
  @Get()
  findAll(@Query() query: QueryRefundsDto, @CurrentUser() user: AuthUser) {
    return this.refundsService.findAll(query, user);
  }

  /** Declared before :id so "stats" is not read as a refund id. */
  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.refundsService.getStats(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.refundsService.findOne(id, user);
  }

  /** Reason and date only — the amount is immutable. */
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRefundDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.refundsService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.refundsService.remove(id, user);
  }
}
