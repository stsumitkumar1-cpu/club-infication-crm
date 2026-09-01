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
import { CustomersService } from './customers.service.js';
import {
  CreateCustomerDto,
  QueryCustomersDto,
  UpdateCustomerDto,
} from './dto/index.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Customer records — Master Spec 2.2: all three roles may add and update
 * customer data. Role alone is not the boundary; every method re-derives the
 * caller's record scope in the service, so an Executive can only ever reach
 * their own customers and a Manager only their team's.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  create(@Body() dto: CreateCustomerDto, @CurrentUser() user: AuthUser) {
    return this.customersService.create(dto, user);
  }

  @Get()
  findAll(@Query() query: QueryCustomersDto, @CurrentUser() user: AuthUser) {
    return this.customersService.findAll(query, user);
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.customersService.getStats(user);
  }

  /** Owner options for the customer form, scoped to what the caller may assign. */
  @Get('assignable-users')
  getAssignableUsers(@CurrentUser() user: AuthUser) {
    return this.customersService.findAssignableUsers(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.customersService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.MANAGER, Role.EXECUTIVE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.customersService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.customersService.remove(id, user);
  }
}
