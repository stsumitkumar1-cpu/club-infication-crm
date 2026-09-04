import { PrismaService } from '../database/prisma.service.js';
import type { AuthUser } from '../common/types/index.js';
import { QuerySearchDto } from './dto/index.js';
export interface SearchHit {
    id: string;
    title: string;
    subtitle: string | null;
    badge: string | null;
}
export interface SearchGroup {
    type: 'customer' | 'user' | 'plan';
    label: string;
    total: number;
    items: SearchHit[];
}
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    searchAll(query: QuerySearchDto, currentUser: AuthUser): Promise<{
        query: string;
        total: number;
        groups: SearchGroup[];
    }>;
    private searchCustomers;
    private searchUsers;
    private searchPlans;
}
