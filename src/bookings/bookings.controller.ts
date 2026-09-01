import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { BookingsService } from './bookings.service.js';
import {
  CreateBookingDto,
  QueryBookingsDto,
  UpdateBookingDto,
} from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Holiday booking / usage — Master Spec 17 `/bookings`.
 *
 * All three roles may record usage: the client PDF makes "Record customer
 * usage" an Executive responsibility. Scope is resolved through the owning
 * customer on every method.
 *
 * There is deliberately no DELETE: a booking and its ledger movements are
 * usage history (Spec 6.3). Cancelling returns the entitlement and keeps the
 * record.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  create(@Body() dto: CreateBookingDto, @CurrentUser() user: AuthUser) {
    return this.bookingsService.create(dto, user);
  }

  @Get()
  findAll(@Query() query: QueryBookingsDto, @CurrentUser() user: AuthUser) {
    return this.bookingsService.findAll(query, user);
  }

  /** Declared before :id so "stats" is not read as a booking id. */
  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.bookingsService.getStats(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookingsService.findOne(id, user);
  }

  /** Notes only — the dates and consumed days/nights are immutable. */
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookingsService.update(id, dto, user);
  }

  /** Returns the consumed days/nights to the customer's balance. */
  @Patch(':id/cancel')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookingsService.cancel(id, user);
  }

  /** Marks the stay as taken. No ledger movement — it was deducted on booking. */
  @Patch(':id/complete')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookingsService.complete(id, user);
  }
}
