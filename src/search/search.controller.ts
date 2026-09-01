import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service.js';
import { QuerySearchDto } from './dto/index.js';
import { JwtAuthGuard } from '../common/guards/index.js';
import { CurrentUser, RateLimit } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * The header's "search anything" box — Master Spec 11.
 *
 * Every signed-in role may call it; what comes back is scoped to what the
 * caller can already see, so there is no @Roles gate. A search box fires on
 * keystrokes, so the window is wider than the global default (a 300ms debounce
 * makes ~200/min the realistic ceiling for continuous typing) while still
 * bounded — an unbounded search endpoint is a cheap way to probe a database.
 */
@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @RateLimit({ limit: 300, windowSeconds: 60 })
  @Get()
  search(@Query() query: QuerySearchDto, @CurrentUser() user: AuthUser) {
    return this.searchService.searchAll(query, user);
  }
}
