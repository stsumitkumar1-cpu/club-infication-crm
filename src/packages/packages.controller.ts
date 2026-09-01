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
import { PackagesService } from './packages.service.js';
import {
  CreatePackageDto,
  QueryPackagesDto,
  UpdatePackageDto,
} from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Plan catalog — Master Spec 17 `/packages`.
 *
 * Reads are open to every signed-in role: an Executive has to pick a plan when
 * adding a customer, and a Manager needs to see what their team is selling.
 * Writes are Super Admin only — the catalog is company-wide configuration.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('packages')
export class PackagesController {
  constructor(private packagesService: PackagesService) {}

  @Get()
  findAll(@Query() query: QueryPackagesDto) {
    return this.packagesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.packagesService.findOne(id);
  }

  /**
   * A Manager may add a plan as well as a Super Admin (client clarification,
   * 2026-08-28 — the spec's §2.1 gives Managers view-only on plans).
   *
   * Note this is genuinely global: the catalog has no team scope, so a plan a
   * Manager adds becomes sellable by every team. The audit row records who
   * created it.
   */
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @Post()
  create(@Body() dto: CreatePackageDto, @CurrentUser() user: AuthUser) {
    return this.packagesService.create(dto, user);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePackageDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.packagesService.update(id, dto, user);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/activate')
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.packagesService.setActive(id, true, user);
  }

  /** Deactivating keeps history intact while hiding the plan from new sales. */
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/deactivate')
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.packagesService.setActive(id, false, user);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.packagesService.remove(id, user);
  }
}
