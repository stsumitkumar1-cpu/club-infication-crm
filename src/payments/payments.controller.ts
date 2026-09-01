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
import { PaymentsService } from './payments.service.js';
import {
  CreatePaymentDto,
  QueryPaymentsDto,
  UpdatePaymentDto,
} from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Payment history — Master Spec 17 `/payments`.
 *
 * All three roles may record money coming in: the client PDF makes "Enter
 * payment information" an Executive responsibility. Record scope is resolved
 * through the owning customer on every method.
 *
 * Correcting a payment is restricted (Spec 9.1): the amount can never be
 * edited, and deleting a row — which reverses the customer's running totals —
 * is Super Admin only.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  create(@Body() dto: CreatePaymentDto, @CurrentUser() user: AuthUser) {
    return this.paymentsService.create(dto, user);
  }

  @Get()
  findAll(@Query() query: QueryPaymentsDto, @CurrentUser() user: AuthUser) {
    return this.paymentsService.findAll(query, user);
  }

  /** Declared before :id so "stats" is not read as a payment id. */
  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.paymentsService.getStats(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.paymentsService.findOne(id, user);
  }

  /** Method, date and notes only — the amount is immutable. */
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.paymentsService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.paymentsService.remove(id, user);
  }
}
