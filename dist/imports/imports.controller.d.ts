import { ImportsService, type UploadedWorkbook } from './imports.service.js';
import type { AuthUser } from '../common/types/index.js';
export declare class ImportsController {
    private importsService;
    constructor(importsService: ImportsService);
    upload(file: UploadedWorkbook | undefined, user: AuthUser): Promise<{
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
    findOne(id: string): Promise<{
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
    commit(id: string, user: AuthUser): Promise<{
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
    discard(id: string, user: AuthUser): Promise<{
        message: string;
    }>;
}
