import { AuditService } from './audit.service.js';
import { QueryAuditDto } from './dto/index.js';
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
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
    getFilters(): Promise<{
        entities: string[];
        actions: string[];
    }>;
}
