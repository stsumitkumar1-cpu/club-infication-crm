import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { MiscellaneousExpensesService } from './miscellaneous-expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { CurrentUser, Roles } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';
import { Role } from '@prisma/client';

@Controller('miscellaneous-expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class MiscellaneousExpensesController {
  constructor(private readonly expensesService: MiscellaneousExpensesService) {}

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.expensesService.create(createExpenseDto, user);
  }

  @Get()
  findAll() {
    return this.expensesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
