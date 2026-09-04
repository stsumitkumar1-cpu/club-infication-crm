import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import type { AuthUser } from '../common/types/index.js';

@Injectable()
export class MiscellaneousExpensesService {
  constructor(private readonly db: PrismaService) {}

  async findAll() {
    return this.db.miscellaneousExpense.findMany({
      orderBy: { date: 'desc' },
      include: {
        recordedBy: {
          select: { name: true, id: true },
        },
      },
    });
  }

  async create(createExpenseDto: CreateExpenseDto, user: AuthUser) {
    return this.db.miscellaneousExpense.create({
      data: {
        title: createExpenseDto.title,
        amount: createExpenseDto.amount,
        date: createExpenseDto.date ? new Date(createExpenseDto.date) : new Date(),
        description: createExpenseDto.description,
        recordedById: user.sub,
      },
    });
  }

  async remove(id: string) {
    const expense = await this.db.miscellaneousExpense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return this.db.miscellaneousExpense.delete({
      where: { id },
    });
  }
}
