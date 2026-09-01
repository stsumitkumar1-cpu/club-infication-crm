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
import { MembershipStatus, Role } from '@prisma/client';
import { MembershipsService } from './memberships.service.js';
import {
  CreateMembershipDto,
  QueryMembershipsDto,
  UpdateMembershipDto,
} from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Customer purchase instances — Master Spec 17 `/memberships`.
 *
 * All three roles may record a sale (Spec 2.2), but every method resolves the
 * caller's record scope through the customer, so an Executive can only touch
 * memberships belonging to their own customers and a Manager only their team's.
 * Deletion stays with the Super Admin.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private membershipsService: MembershipsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  create(@Body() dto: CreateMembershipDto, @CurrentUser() user: AuthUser) {
    return this.membershipsService.create(dto, user);
  }

  @Get()
  findAll(@Query() query: QueryMembershipsDto, @CurrentUser() user: AuthUser) {
    return this.membershipsService.findAll(query, user);
  }

  /** Declared before :id so "stats" is not read as a membership id. */
  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.membershipsService.getStats(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.membershipsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMembershipDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.membershipsService.update(id, dto, user);
  }

  /** Ends a membership early. History is kept; only the status changes. */
  @Patch(':id/cancel')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.membershipsService.setStatus(
      id,
      MembershipStatus.CANCELLED,
      user,
    );
  }

  /** Closes a membership that has run its term, freeing the customer to buy again. */
  @Patch(':id/expire')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  expire(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.membershipsService.setStatus(id, MembershipStatus.EXPIRED, user);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.membershipsService.remove(id, user);
  }
}
