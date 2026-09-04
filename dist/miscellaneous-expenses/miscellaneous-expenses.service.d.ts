import { PrismaService } from '../database/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import type { AuthUser } from '../common/types/index.js';
export declare class MiscellaneousExpensesService {
    private readonly db;
    constructor(db: PrismaService);
    findAll(): Promise<({
        recordedBy: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        description: string | null;
        date: Date;
        title: string;
        recordedById: string;
    })[]>;
    create(createExpenseDto: CreateExpenseDto, user: AuthUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        description: string | null;
        date: Date;
        title: string;
        recordedById: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        description: string | null;
        date: Date;
        title: string;
        recordedById: string;
    }>;
}
