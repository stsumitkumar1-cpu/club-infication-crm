export declare const PERFORMANCE_SORT_FIELDS: readonly ["totalSales", "collected", "pending", "customers", "daysUsed", "name"];
export declare class QueryPerformanceDto {
    search?: string;
    sortBy?: (typeof PERFORMANCE_SORT_FIELDS)[number];
    sortDir?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
