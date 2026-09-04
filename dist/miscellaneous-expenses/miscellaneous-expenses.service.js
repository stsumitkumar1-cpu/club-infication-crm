"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscellaneousExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../database/prisma.service.js");
let MiscellaneousExpensesService = class MiscellaneousExpensesService {
    db;
    constructor(db) {
        this.db = db;
    }
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
    async create(createExpenseDto, user) {
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
    async remove(id) {
        const expense = await this.db.miscellaneousExpense.findUnique({
            where: { id },
        });
        if (!expense) {
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
        return this.db.miscellaneousExpense.delete({
            where: { id },
        });
    }
};
exports.MiscellaneousExpensesService = MiscellaneousExpensesService;
exports.MiscellaneousExpensesService = MiscellaneousExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], MiscellaneousExpensesService);
//# sourceMappingURL=miscellaneous-expenses.service.js.map