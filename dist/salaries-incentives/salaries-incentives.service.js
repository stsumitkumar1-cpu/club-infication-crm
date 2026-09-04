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
exports.SalariesIncentivesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../database/prisma.service.js");
let SalariesIncentivesService = class SalariesIncentivesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSalariesAndIncentives(period) {
        const [yearStr, monthStr] = period.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        const users = await this.prisma.user.findMany({
            where: {
                role: { in: ['MANAGER', 'EXECUTIVE'] },
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                role: true,
            },
        });
        const userIds = users.map((u) => u.id);
        const salesAggregation = await this.prisma.customer.groupBy({
            by: ['assignedExecId'],
            where: {
                assignedExecId: { in: userIds },
                registrationDate: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const salesMap = new Map();
        salesAggregation.forEach((agg) => {
            if (agg.assignedExecId) {
                salesMap.set(agg.assignedExecId, agg._sum.amount || 0);
            }
        });
        const pastRecords = await this.prisma.incentiveRecord.findMany({
            where: {
                executiveId: { in: userIds },
                period: { lte: period },
            },
            orderBy: { period: 'desc' },
        });
        const mostRecentRecordMap = new Map();
        const currentPeriodRecordMap = new Map();
        pastRecords.forEach((r) => {
            if (!mostRecentRecordMap.has(r.executiveId)) {
                mostRecentRecordMap.set(r.executiveId, r);
            }
            if (r.period === period) {
                currentPeriodRecordMap.set(r.executiveId, r);
            }
        });
        const result = users.map((user) => {
            const totalSales = salesMap.get(user.id) || 0;
            const exactRecord = currentPeriodRecordMap.get(user.id);
            const recentRecord = mostRecentRecordMap.get(user.id);
            let baseSalary = 0;
            let incentivePercentage = 0;
            let incentiveEarned = 0;
            let totalSalary = 0;
            if (exactRecord) {
                baseSalary = exactRecord.baseSalary;
                incentivePercentage = exactRecord.incentivePercentage;
                incentiveEarned = exactRecord.incentiveEarned;
                totalSalary = exactRecord.totalSalary;
            }
            else if (recentRecord) {
                baseSalary = recentRecord.baseSalary;
                incentivePercentage = recentRecord.incentivePercentage;
                incentiveEarned = (totalSales * incentivePercentage) / 100;
                totalSalary = baseSalary + incentiveEarned;
            }
            return {
                userId: user.id,
                name: user.name,
                role: user.role,
                totalSales,
                baseSalary,
                incentivePercentage,
                incentiveEarned,
                totalSalary,
            };
        });
        result.sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }
    async updateSalaryAndIncentive(userId, dto) {
        const { period, baseSalary, incentivePercentage } = dto;
        const [yearStr, monthStr] = period.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        const salesAggregation = await this.prisma.customer.aggregate({
            where: {
                assignedExecId: userId,
                registrationDate: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const totalSales = salesAggregation._sum.amount || 0;
        const incentiveEarned = (totalSales * incentivePercentage) / 100;
        const totalSalary = baseSalary + incentiveEarned;
        const record = await this.prisma.incentiveRecord.upsert({
            where: {
                executiveId_period: {
                    executiveId: userId,
                    period,
                },
            },
            create: {
                executiveId: userId,
                period,
                totalSales,
                baseSalary,
                incentivePercentage,
                incentiveEarned,
                totalSalary,
                status: 'PENDING',
            },
            update: {
                totalSales,
                baseSalary,
                incentivePercentage,
                incentiveEarned,
                totalSalary,
            },
        });
        return record;
    }
};
exports.SalariesIncentivesService = SalariesIncentivesService;
exports.SalariesIncentivesService = SalariesIncentivesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], SalariesIncentivesService);
//# sourceMappingURL=salaries-incentives.service.js.map