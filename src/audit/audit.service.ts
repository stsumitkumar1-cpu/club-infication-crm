import { Injectable, Logger } from '@nestjs/common';
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

/**
 * Immutable audit trail — Master Spec §15.
 *
 * Prefer `withinTransaction()` so the audit row commits atomically with the
 * mutation it describes. `log()` exists for actions that have no surrounding
 * transaction (e.g. login attempts).
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  private toData(entry: AuditEntry): Prisma.AuditLogUncheckedCreateInput {
    return {
      actorId: entry.actorId ?? null,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId ?? null,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
    };
  }

  /** Writes the audit row inside an existing transaction. Failures roll back the caller. */
  async withinTransaction(
    tx: Prisma.TransactionClient,
    entry: AuditEntry,
  ): Promise<void> {
    await tx.auditLog.create({ data: this.toData(entry) });
  }

  /**
   * Standalone audit write. Never throws: a failed audit log must not mask the
   * business outcome, but it is logged at error level so it is not silent.
   */
  async log(entry: AuditEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({ data: this.toData(entry) });
    } catch (error) {
      this.logger.error(
        `Audit write failed: ${entry.action} on ${entry.entity} ${entry.entityId ?? ''}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  /**
   * Reads the trail — Master Spec 15 ("Audit review", Phase 10).
   *
   * Global and unscoped by design: the audit trail is the record of who did
   * what across the whole system, and a filtered version would be worthless
   * for review. That is precisely why the controller restricts it to
   * SUPER_ADMIN — a Manager must not be able to read another team's activity.
   *
   * There is no create/update/delete counterpart: the trail is append-only,
   * written only as a side effect of the operations it describes.
   */
  async findAll(query: QueryAuditDto) {
    const {
      actorId,
      entity,
      entityId,
      action,
      from,
      to,
      page = 1,
      limit = 50,
    } = query;

    const filters: Prisma.AuditLogWhereInput[] = [];
    if (actorId) filters.push({ actorId });
    if (entity) filters.push({ entity });
    if (entityId) filters.push({ entityId });
    if (action) filters.push({ action });
    if (from) filters.push({ timestamp: { gte: from } });
    if (to) filters.push({ timestamp: { lte: to } });

    const where: Prisma.AuditLogWhereInput =
      filters.length > 0 ? { AND: filters } : {};

    const [data, total, byAction] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          actor: { select: { id: true, name: true, email: true, role: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
    ]);

    return {
      // metadata is stored as a JSON string; parse it so callers need not.
      data: data.map((row) => ({
        ...row,
        metadata: row.metadata ? this.safeParse(row.metadata) : null,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        actionCounts: byAction
          .map((a) => ({ action: a.action, count: a._count }))
          .sort((a, b) => b.count - a.count),
      },
    };
  }

  /** A malformed metadata string must not break the whole listing. */
  private safeParse(value: string): unknown {
    try {
      return JSON.parse(value);
    } catch {
      return { unparsed: value };
    }
  }

  /** Distinct entities and actions present, for building filter dropdowns. */
  async getFilterOptions() {
    const [entities, actions] = await Promise.all([
      this.prisma.auditLog.findMany({
        distinct: ['entity'],
        select: { entity: true },
        orderBy: { entity: 'asc' },
      }),
      this.prisma.auditLog.findMany({
        distinct: ['action'],
        select: { action: true },
        orderBy: { action: 'asc' },
      }),
    ]);

    return {
      entities: entities.map((e) => e.entity),
      actions: actions.map((a) => a.action),
    };
  }
}
