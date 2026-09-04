import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { QueryAuditDto } from './dto/index.js';
export interface AuditEntry {
    actorId?: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
}
export declare class AuditService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private toData;
    withinTransaction(tx: Prisma.TransactionClient, entry: AuditEntry): Promise<void>;
    log(entry: AuditEntry): Promise<void>;
    findAll(query: QueryAuditDto): Promise<{
        data: {
            metadata: unknown;
            actor: {
                id: string;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.Role;
            } | null;
            timestamp: Date;
            actorId: string | null;
            entity: string;
            entityId: string | null;
            action: string;
            id: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            actionCounts: {
                action: string;
                count: number;
            }[];
        };
    }>;
    private safeParse;
    getFilterOptions(): Promise<{
        entities: string[];
        actions: string[];
    }>;
}
