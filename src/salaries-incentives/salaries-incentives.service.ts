import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { UpdateSalaryDto } from './dto/update-salary.dto.js';

@Injectable()
export class SalariesIncentivesService {
  constructor(private readonly prisma: PrismaService) {}

  async getSalariesAndIncentives(period: string) {
    // period format: YYYY-MM
    const [yearStr, monthStr] = period.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Get all active managers and executives
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

    // Aggregate sales (Customers created in this month assigned to the user)
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

    const salesMap = new Map<string, number>();
    salesAggregation.forEach((agg) => {
      if (agg.assignedExecId) {
        salesMap.set(agg.assignedExecId, agg._sum.amount || 0);
      }
    });

    // Get incentive records up to this period for the users to carry over salaries
    const pastRecords = await this.prisma.incentiveRecord.findMany({
      where: {
        executiveId: { in: userIds },
        period: { lte: period },
      },
      orderBy: { period: 'desc' },
    });

    const mostRecentRecordMap = new Map<string, any>();
    const currentPeriodRecordMap = new Map<string, any>();

    pastRecords.forEach((r) => {
      if (!mostRecentRecordMap.has(r.executiveId)) {
        mostRecentRecordMap.set(r.executiveId, r);
      }
      if (r.period === period) {
        currentPeriodRecordMap.set(r.executiveId, r);
      }
    });

    // Combine data
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
      } else if (recentRecord) {
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

    // Sort by name
    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }

  async updateSalaryAndIncentive(userId: string, dto: UpdateSalaryDto) {
    const { period, baseSalary, incentivePercentage } = dto;

    const [yearStr, monthStr] = period.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Calculate total sales
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

    // Calculate incentive and total salary
    const incentiveEarned = (totalSales * incentivePercentage) / 100;
    const totalSalary = baseSalary + incentiveEarned;

    // Upsert the record
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
}
