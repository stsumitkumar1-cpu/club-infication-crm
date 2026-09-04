import { SearchService } from './search.service.js';
import { QuerySearchDto } from './dto/index.js';
import type { AuthUser } from '../common/types/index.js';
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    search(query: QuerySearchDto, user: AuthUser): Promise<{
        query: string;
        total: number;
        groups: import("./search.service.js").SearchGroup[];
    }>;
}
