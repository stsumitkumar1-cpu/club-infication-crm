import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { TeamsService } from './teams.service.js';
import { AssignExecutiveDto, UnassignExecutiveDto } from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Team structure (Manager <-> Executive) — Master Spec 2.2.
 * Executives have no team-management rights, so the whole controller is
 * restricted to SUPER_ADMIN and MANAGER; per-team scope is enforced again in
 * the service so a valid id from the wrong team still fails.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.MANAGER)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(@CurrentUser() currentUser: AuthUser) {
    return this.teamsService.findAll(currentUser);
  }

  @Get('unassigned-executives')
  findUnassigned() {
    return this.teamsService.findUnassignedExecutives();
  }

  @Get(':managerId')
  findOne(
    @Param('managerId', ParseUUIDPipe) managerId: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.teamsService.findOne(managerId, currentUser);
  }

  @Post('assign')
  assign(
    @Body() dto: AssignExecutiveDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.teamsService.assignExecutive(dto, currentUser);
  }

  @Post('unassign')
  unassign(
    @Body() dto: UnassignExecutiveDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.teamsService.unassignExecutive(dto.executiveId, currentUser);
  }
}
