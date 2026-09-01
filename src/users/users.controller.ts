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
import { UsersService } from './users.service.js';
import {
  CreateUserDto,
  QueryUsersDto,
  SetPasswordDto,
  UpdateUserDto,
} from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Super Admin may create any role. A Manager may onboard Executives into
   * their own team only — the service forces the team and rejects any other
   * role, so this decorator is the outer gate, not the whole rule.
   */
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @Post()
  create(@Body() dto: CreateUserDto, @CurrentUser() currentUser: AuthUser) {
    return this.usersService.create(dto, currentUser);
  }

  /** Scope-filtered list. Every role may call it; each sees only its own scope. */
  @Get()
  findAll(
    @Query() query: QueryUsersDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.usersService.findAll(currentUser, query);
  }

  /** Declared before :id so "stats" is not swallowed as a user id. */
  @Get('stats')
  getStats(@CurrentUser() currentUser: AuthUser) {
    return this.usersService.getStats(currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.usersService.findOne(id, currentUser);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.usersService.update(id, dto, currentUser);
  }

  /**
   * Set someone else's password. Super Admin for any Manager or Executive; a
   * Manager only for an Executive in their own team — see
   * UsersService.setPassword.
   *
   * Separate from PATCH :id because that one also carries role, email,
   * managerId and isActive, none of which a Manager may touch.
   */
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @Patch(':id/password')
  setPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetPasswordDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.usersService.setPassword(id, dto, currentUser);
  }

  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/activate')
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.usersService.setActive(id, true, currentUser);
  }

  /**
   * Deactivation replaces deletion for users: employees own customer records,
   * audit rows and incentive history, so the row must survive (Spec 6.3).
   */
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/deactivate')
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.usersService.setActive(id, false, currentUser);
  }

  /**
   * Permanently deletes a user. Only possible for an account with no customers,
   * team members, incentive records or audit history — anything else must be
   * deactivated instead so the trail survives.
   */
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.usersService.remove(id, currentUser);
  }
}
