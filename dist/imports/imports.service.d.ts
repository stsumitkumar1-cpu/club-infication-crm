import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { CustomersService } from '../customers/customers.service.js';
import type { AuthUser } from '../common/types/index.js';
export interface UploadedWorkbook {
    originalname: string;
    buffer: Buffer;
}
export declare class ImportsService {
    private prisma;
    private audit;
    private customers;
    private readonly logger;
    constructor(prisma: PrismaService, audit: AuditService, customers: CustomersService);
    stageWorkbook(file: UploadedWorkbook, currentUser: AuthUser): Promise<{
        batchId: string;
        fileName: string;
        sheetsRead: number;
        sheetsSkipped: string[];
        headerNotes: string[];
        totalRows: number;
        validRows: number;
        blockedRows: number;
        plans: {
            name: string;
            sales: number;
            minPrice: number | null;
            maxPrice: number | null;
        }[];
        consultants: {
            key: string;
            spellings: string[];
            sales: number;
        }[];
        stays: {
            total: number;
            readable: number;
            keptAsNotes: number;
        };
        warnings: {
            field: string;
            message: string;
            count: number;
        }[];
        blocked: {
            sheet: string;
            rowNumber: number;
            name: string | null;
            reasons: string[];
        }[];
        duplicates: {
            phones: number;
            mafNumbers: {
                mafNo: string | null;
                rows: {
                    name: string | null;
                    sheet: string;
                    rowNumber: number;
                }[];
            }[];
        };
    }>;
    private summarise;
    findOne(batchId: string): Promise<{
        fileName: string;
        status: import(".prisma/client").$Enums.ImportStatus;
        importedRows: number;
        uploadedBy: string | null;
        createdAt: Date;
        batchId: string;
        totalRows: number;
        validRows: number;
        blockedRows: number;
        plans: {
            name: string;
            sales: number;
            minPrice: number | null;
            maxPrice: number | null;
        }[];
        consultants: {
            key: string;
            spellings: string[];
            sales: number;
        }[];
        stays: {
            total: number;
            readable: number;
            keptAsNotes: number;
        };
        warnings: {
            field: string;
            message: string;
            count: number;
        }[];
        blocked: {
            sheet: string;
            rowNumber: number;
            name: string | null;
            reasons: string[];
        }[];
        duplicates: {
            phones: number;
            mafNumbers: {
                mafNo: string | null;
                rows: {
                    name: string | null;
                    sheet: string;
                    rowNumber: number;
                }[];
            }[];
        };
    }>;
    findAll(): Promise<{
        id: string;
        fileName: string;
        status: import(".prisma/client").$Enums.ImportStatus;
        totalRows: number;
        validRows: number;
        importedRows: number;
        uploadedBy: string | null;
        createdAt: Date;
    }[]>;
    private resolveConsultant;
    private resolvePackage;
    commit(batchId: string, currentUser: AuthUser): Promise<{
        batchId: string;
        attempted: number;
        imported: number;
        failed: number;
        failures: {
            rowNumber: number;
            name: string | null;
            reason: string;
        }[];
    }>;
    discard(batchId: string, currentUser: AuthUser): Promise<{
        message: string;
    }>;
}
