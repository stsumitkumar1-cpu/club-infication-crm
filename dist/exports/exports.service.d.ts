import { PrismaService } from '../database/prisma.service.js';
import type { AuthUser } from '../common/types/index.js';
export declare class ExportsService {
    private prisma;
    constructor(prisma: PrismaService);
    private nightsPerYearText;
    private dateOnly;
    customersWorkbook(currentUser: AuthUser): Promise<{
        buffer: Buffer;
        fileName: string;
        rowCount: number;
    }>;
}
