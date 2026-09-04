import { SalariesIncentivesService } from './salaries-incentives.service.js';
import { UpdateSalaryDto } from './dto/update-salary.dto.js';
export declare class SalariesIncentivesController {
    private readonly service;
    constructor(service: SalariesIncentivesService);
    getSalariesAndIncentives(period: string): Promise<{
        userId: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        totalSales: number;
        baseSalary: number;
        incentivePercentage: number;
        incentiveEarned: number;
        totalSalary: number;
    }[]>;
    updateSalaryAndIncentive(userId: string, dto: UpdateSalaryDto): Promise<{
        status: import(".prisma/client").$Enums.IncentiveStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        executiveId: string;
        totalSales: number;
        period: string;
        baseSalary: number;
        incentivePercentage: number;
        eligibleSales: number;
        incentiveEarned: number;
        incentivePaid: number;
        totalSalary: number;
    }>;
}
