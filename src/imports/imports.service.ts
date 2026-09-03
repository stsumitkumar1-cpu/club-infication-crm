import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import ExcelJS from 'exceljs';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ImportRowStatus, ImportStatus, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { CustomersService } from '../customers/customers.service.js';
import type { AuthUser } from '../common/types/index.js';
import {
  consultantKey,
  isCommittable,
  mapHeaderRow,
  mapRow,
  planNameFor,
  type MappedRow,
} from './sheet-parser.js';

/** How far down a tab to look for the header row. */
const HEADER_SEARCH_ROWS = 6;

/** Recognisable column names needed before a row counts as the header. */
const HEADER_MIN_FIELDS = 6;

/**
 * The parts of a multipart upload this service needs.
 *
 * Declared here rather than as Express.Multer.File: the global namespace that
 * type lives in is not reliably visible under this project's ESM/NodeNext
 * resolution, and the service only ever touches these two fields.
 */
export interface UploadedWorkbook {
  originalname: string;
  buffer: Buffer;
}

@Injectable()
export class ImportsService {
  private readonly logger = new Logger(ImportsService.name);

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private customers: CustomersService,
  ) {}

  /**
   * Reads a workbook into the staging tables. Nothing live is touched.
   *
   * Two steps on purpose. A 29-tab, 822-row workbook written by hand over two
   * years has too many judgement calls in it to import blind — so it is parsed,
   * every reading and every doubt is recorded per row, and a human approves the
   * result before anything reaches a customer record. ImportStaging keeps the
   * original cells alongside the interpretation, so a wrong reading can always
   * be traced back to what the sheet actually said.
   */
  async stageWorkbook(
    file: UploadedWorkbook,
    currentUser: AuthUser,
  ) {
    const wb = new ExcelJS.Workbook();
    try {
      /*
       * Cast at the call rather than on the buffer. Node 22 types Buffer as
       * Buffer<ArrayBufferLike> while exceljs's bundled types still expect the
       * older invariant Buffer, so the two are structurally incompatible even
       * though the value is exactly what the library wants. Narrowed to this one
       * line so the mismatch cannot spread.
       */
      const loader = wb.xlsx as unknown as {
        load(data: unknown): Promise<unknown>;
      };
      await loader.load(file.buffer);
    } catch {
      throw new BadRequestException(
        'That file could not be read as an Excel workbook (.xlsx).',
      );
    }

    const rows: MappedRow[] = [];
    const sheetsSkipped: string[] = [];
    const headerNotes: string[] = [];

    for (const ws of wb.worksheets) {
      let headerRow: number | null = null;
      let fields: (string | null)[] = [];

      for (let r = 1; r <= Math.min(HEADER_SEARCH_ROWS, ws.rowCount); r += 1) {
        const raw: unknown[] = [];
        ws.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
          raw[col] = cell.value;
        });
        const mapped = mapHeaderRow(raw);
        if (mapped.fields.filter(Boolean).length >= HEADER_MIN_FIELDS) {
          headerRow = r;
          fields = mapped.fields;
          headerNotes.push(...mapped.duplicates.map((d) => `${ws.name}: ${d}`));
          break;
        }
      }

      if (!headerRow) {
        sheetsSkipped.push(ws.name);
        continue;
      }

      for (let r = headerRow + 1; r <= ws.rowCount; r += 1) {
        const raw: Record<string, unknown> = {};
        ws.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
          const field = fields[col];
          if (!field) return;
          const v = cell.value;
          // exceljs wraps formula and rich-text cells; take the readable part.
          raw[field] =
            v && typeof v === 'object' && !(v instanceof Date)
              ? ((v as unknown as Record<string, unknown>).result ??
                (v as unknown as Record<string, unknown>).text ??
                null)
              : v;
        });

        // A totals line or a spacer, not a member.
        const name = raw.name ? String(raw.name).trim() : '';
        if (!name || name === '-' || /^total/i.test(name)) continue;

        rows.push(mapRow(ws.name, r, raw));
      }
    }

    if (rows.length === 0) {
      throw new BadRequestException(
        'No member rows were found. Check that the file is the member sheet and that its column headings are intact.',
      );
    }

    const valid = rows.filter(isCommittable);

    const batch = await this.prisma.$transaction(async (tx) => {
      const created = await tx.importBatch.create({
        data: {
          fileName: file.originalname,
          status: ImportStatus.VALIDATED,
          totalRows: rows.length,
          validRows: valid.length,
          uploadedById: currentUser.sub,
        },
      });

      /*
       * createMany rather than a row at a time: 822 individual inserts inside
       * one transaction is slow enough to time the request out.
       */
      await tx.importStaging.createMany({
        data: rows.map((row) => ({
          batchId: created.id,
          rowNumber: row.rowNumber,
          rawData: JSON.stringify({ sheet: row.sheet, row: row.rowNumber }),
          mappedData: JSON.stringify(row),
          validationErrors: row.issues.length
            ? JSON.stringify(row.issues)
            : null,
          importStatus: isCommittable(row)
            ? ImportRowStatus.PENDING
            : ImportRowStatus.INVALID,
        })),
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'IMPORT_UPLOAD',
        entity: 'ImportBatch',
        entityId: created.id,
        metadata: {
          fileName: file.originalname,
          totalRows: rows.length,
          validRows: valid.length,
          sheetsSkipped,
        },
      });

      return created;
    });

    return {
      ...this.summarise(batch.id, rows),
      batchId: batch.id,
      fileName: file.originalname,
      sheetsRead: wb.worksheets.length - sheetsSkipped.length,
      sheetsSkipped,
      headerNotes: headerNotes.slice(0, 20),
    };
  }

  /** The report a reviewer reads before committing. */
  private summarise(batchId: string, rows: MappedRow[]) {
    const valid = rows.filter(isCommittable);
    const blocked = rows.filter((r) => !isCommittable(r));

    /* what the catalogue will become */
    const plans = new Map<string, { sales: number; minPrice: number; maxPrice: number }>();
    for (const r of valid) {
      if (!r.years || !r.nightsPerYear) continue;
      const name = planNameFor(r.years, r.nightsPerYear);
      const p = plans.get(name) ?? {
        sales: 0,
        minPrice: Number.POSITIVE_INFINITY,
        maxPrice: 0,
      };
      p.sales += 1;
      if (r.productCost !== null) {
        p.minPrice = Math.min(p.minPrice, r.productCost);
        p.maxPrice = Math.max(p.maxPrice, r.productCost);
      }
      plans.set(name, p);
    }

    /* consultants, with their spellings collapsed */
    const people = new Map<string, { spellings: string[]; sales: number }>();
    for (const r of rows) {
      const key = consultantKey(r.consultant);
      if (!key) continue;
      const p = people.get(key) ?? { spellings: [], sales: 0 };
      if (r.consultant && !p.spellings.includes(r.consultant)) {
        p.spellings.push(r.consultant);
      }
      p.sales += 1;
      people.set(key, p);
    }

    const stays = rows.flatMap((r) => r.stays);

    /* the warnings, grouped so 168 of the same thing read as one line */
    const warnings = new Map<string, number>();
    for (const r of rows) {
      for (const i of r.issues) {
        if (i.severity !== 'warning') continue;
        const bucket = `${i.field}|${i.message
          .replace(/"[^"]*"/g, '"…"')
          .replace(/\d+/g, 'N')}`;
        warnings.set(bucket, (warnings.get(bucket) ?? 0) + 1);
      }
    }

    /* duplicates, which the client asked to import as-is and correct later */
    const byPhone = new Map<string, MappedRow[]>();
    const byMaf = new Map<string, MappedRow[]>();
    for (const r of valid) {
      if (r.phone) byPhone.set(r.phone, [...(byPhone.get(r.phone) ?? []), r]);
      if (r.mafNo) byMaf.set(r.mafNo, [...(byMaf.get(r.mafNo) ?? []), r]);
    }

    return {
      batchId,
      totalRows: rows.length,
      validRows: valid.length,
      blockedRows: blocked.length,

      plans: [...plans]
        .map(([name, p]) => ({
          name,
          sales: p.sales,
          minPrice: p.minPrice === Number.POSITIVE_INFINITY ? null : p.minPrice,
          maxPrice: p.maxPrice || null,
        }))
        .sort((a, b) => b.sales - a.sales),

      consultants: [...people]
        .map(([key, p]) => ({ key, spellings: p.spellings, sales: p.sales }))
        .sort((a, b) => b.sales - a.sales),

      stays: {
        total: stays.length,
        readable: stays.filter((s) => s.confident).length,
        keptAsNotes: stays.filter((s) => !s.confident).length,
      },

      warnings: [...warnings]
        .map(([bucket, count]) => {
          const [field, message] = bucket.split('|');
          return { field, message, count };
        })
        .sort((a, b) => b.count - a.count),

      blocked: blocked.slice(0, 50).map((r) => ({
        sheet: r.sheet,
        rowNumber: r.rowNumber,
        name: r.name,
        reasons: r.issues
          .filter((i) => i.severity === 'error')
          .map((i) => i.message),
      })),

      duplicates: {
        phones: [...byPhone.values()].filter((v) => v.length > 1).length,
        mafNumbers: [...byMaf.values()]
          .filter((v) => v.length > 1)
          .slice(0, 20)
          .map((group) => ({
            mafNo: group[0].mafNo,
            rows: group.map((r) => ({
              name: r.name,
              sheet: r.sheet,
              rowNumber: r.rowNumber,
            })),
          })),
      },
    };
  }

  /** A staged batch and its report, rebuilt from what was stored. */
  async findOne(batchId: string) {
    const batch = await this.prisma.importBatch.findUnique({
      where: { id: batchId },
      include: {
        uploadedBy: { select: { id: true, name: true } },
        stagingRows: { select: { mappedData: true }, orderBy: { rowNumber: 'asc' } },
      },
    });
    if (!batch) {
      throw new NotFoundException('Import batch not found');
    }

    const rows: MappedRow[] = batch.stagingRows
      .map((r) => (r.mappedData ? (JSON.parse(r.mappedData) as MappedRow) : null))
      .filter((r): r is MappedRow => r !== null);

    return {
      ...this.summarise(batch.id, rows),
      fileName: batch.fileName,
      status: batch.status,
      importedRows: batch.importedRows,
      uploadedBy: batch.uploadedBy?.name ?? null,
      createdAt: batch.createdAt,
    };
  }

  /** Every batch, newest first. */
  async findAll() {
    const batches = await this.prisma.importBatch.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { uploadedBy: { select: { name: true } } },
    });
    return batches.map((b) => ({
      id: b.id,
      fileName: b.fileName,
      status: b.status,
      totalRows: b.totalRows,
      validRows: b.validRows,
      importedRows: b.importedRows,
      uploadedBy: b.uploadedBy?.name ?? null,
      createdAt: b.createdAt,
    }));
  }

  /**
   * Finds the user a consultant name refers to, creating an inactive one when
   * nobody matches.
   *
   * Inactive is the client's own instruction for staff who have left: their
   * past sales stay attributed to them and visible to a Manager or Super Admin,
   * but the account cannot be signed into. The password is a random value
   * nobody holds — an admin sets a real one if the person ever returns.
   */
  private async resolveConsultant(
    tx: Prisma.TransactionClient,
    name: string | null,
    cache: Map<string, string | null>,
  ): Promise<string | null> {
    const key = consultantKey(name);
    if (!key || !name) return null;
    if (cache.has(key)) return cache.get(key) ?? null;

    /*
     * Matched on the normalised key rather than on the raw string, so "Vijay
     * Kumar", "Vijay kumar" and "VijayKumar" all find the same person. Done in
     * memory because Postgres has no index on a normalised name and the user
     * table is tiny.
     */
    const candidates = await tx.user.findMany({
      select: { id: true, name: true },
    });
    const match = candidates.find((u) => consultantKey(u.name) === key);
    if (match) {
      cache.set(key, match.id);
      return match.id;
    }

    const created = await tx.user.create({
      data: {
        name,
        // Unique but obviously not a real address, so nobody mails it.
        email: `${key}.imported@clubinfication.invalid`,
        role: Role.EXECUTIVE,
        passwordHash: await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10),
        isActive: false,
      },
      select: { id: true },
    });
    cache.set(key, created.id);
    return created.id;
  }

  /**
   * Finds or creates the catalogue plan a row describes.
   *
   * The sheet has no plan names, so one is composed from the validity and the
   * annual entitlement it does record — 822 rows collapse to 24 plans. The
   * price stored is only a reference: what each member actually paid goes on
   * their own membership, because the same plan went out anywhere between
   * 10,000 and 300,000.
   */
  private async resolvePackage(
    tx: Prisma.TransactionClient,
    row: MappedRow,
    cache: Map<string, string>,
  ): Promise<string | null> {
    if (!row.years || !row.nightsPerYear) return null;

    const name = planNameFor(row.years, row.nightsPerYear);
    const cached = cache.get(name);
    if (cached) return cached;

    const existing = await tx.package.findUnique({
      where: { name },
      select: { id: true },
    });
    if (existing) {
      cache.set(name, existing.id);
      return existing.id;
    }

    const created = await tx.package.create({
      data: {
        name,
        price: row.productCost ?? 0,
        nightsPerYear: row.nightsPerYear,
        // The sheet's own total where it has one, otherwise the arithmetic.
        nights: row.totalNights ?? row.years * row.nightsPerYear,
        days: row.daysPerYear ?? row.nightsPerYear + 1,
        validityMonths: row.years * 12,
        isActive: true,
      },
      select: { id: true },
    });
    cache.set(name, created.id);
    return created.id;
  }

  /**
   * Writes the staged rows into the live tables.
   *
   * Each row is its own transaction, deliberately. One transaction around 818
   * rows would mean a single bad row discarding the whole import, and would
   * hold locks for minutes; per-row means a failure costs exactly that row and
   * is reported against it.
   *
   * Every row goes through CustomersService.create rather than writing tables
   * directly, so the import cannot skip the things that service guarantees —
   * the opening payment row, the membership, the annual night allocation, the
   * ADA charge, the complimentary nights and the customer status mirror.
   */
  async commit(batchId: string, currentUser: AuthUser) {
    const batch = await this.prisma.importBatch.findUnique({
      where: { id: batchId },
      include: {
        stagingRows: {
          where: { importStatus: ImportRowStatus.PENDING },
          orderBy: { rowNumber: 'asc' },
        },
      },
    });
    if (!batch) {
      throw new NotFoundException('Import batch not found');
    }
    if (batch.status === ImportStatus.COMPLETED) {
      throw new BadRequestException(
        'This batch has already been imported. Upload the file again to import it a second time.',
      );
    }

    const consultantCache = new Map<string, string | null>();
    const packageCache = new Map<string, string>();

    let imported = 0;
    const failures: { rowNumber: number; name: string | null; reason: string }[] = [];

    for (const staged of batch.stagingRows) {
      const row = staged.mappedData
        ? (JSON.parse(staged.mappedData) as MappedRow)
        : null;
      if (!row || !row.name) continue;

      try {
        await this.prisma.$transaction(async (tx) => {
          const assignedExecId = await this.resolveConsultant(
            tx,
            row.consultant,
            consultantCache,
          );
          const packageId = await this.resolvePackage(tx, row, packageCache);
          if (!packageId) {
            throw new Error('No plan could be derived from this row');
          }
          // Cached across rows, so the next 264 sales of the same plan reuse it.
          packageCache.set(planNameFor(row.years!, row.nightsPerYear!), packageId);
          if (assignedExecId && row.consultant) {
            consultantCache.set(consultantKey(row.consultant)!, assignedExecId);
          }
        });

        const assignedExecId = row.consultant
          ? (consultantCache.get(consultantKey(row.consultant)!) ?? null)
          : null;
        const packageId = packageCache.get(
          planNameFor(row.years!, row.nightsPerYear!),
        );

        await this.customers.create(
          {
            name: row.name,
            phone: row.phone ?? `IMPORT-${staged.rowNumber}-${row.sheet}`,
            altPhone: row.altPhone ?? undefined,
            email: row.email ?? undefined,
            coApplicant: row.coApplicant ?? undefined,
            location: row.location ?? undefined,
            plan: planNameFor(row.years!, row.nightsPerYear!),
            amount: row.productCost ?? 0,
            amountPaid: row.paidAmount ?? 0,
            paymentMethod: row.paymentMode ?? undefined,
            membershipId: row.mafNo ?? undefined,
            packageId,
            assignedExecId: assignedExecId ?? undefined,
            saleDate: row.saleDate ? new Date(row.saleDate) : undefined,
            adaAmount: row.ada ?? undefined,
            complimentaryNights: row.complimentaryNights ?? undefined,
            offersText: row.offers ?? undefined,
            remarksText: row.remarks ?? undefined,
            usageNotes: row.usageNotes ?? undefined,
          },
          currentUser,
          // Relaxes the duplicate and inactive-owner checks. See CustomersService.create.
          { legacyImport: true },
        );

        await this.prisma.importStaging.update({
          where: { id: staged.id },
          data: { importStatus: ImportRowStatus.IMPORTED },
        });
        imported += 1;
      } catch (error: unknown) {
        const reason =
          error instanceof Error ? error.message : 'Unknown error';
        failures.push({ rowNumber: staged.rowNumber, name: row.name, reason });

        await this.prisma.importStaging.update({
          where: { id: staged.id },
          data: {
            importStatus: ImportRowStatus.INVALID,
            validationErrors: JSON.stringify([
              ...(staged.validationErrors
                ? (JSON.parse(staged.validationErrors) as unknown[])
                : []),
              { field: 'commit', severity: 'error', message: reason },
            ]),
          },
        });
        this.logger.warn(
          `Import row ${staged.rowNumber} (${row.name}) failed: ${reason}`,
        );
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.importBatch.update({
        where: { id: batchId },
        data: {
          status: ImportStatus.COMPLETED,
          importedRows: imported,
        },
      });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'IMPORT_COMMIT',
        entity: 'ImportBatch',
        entityId: batchId,
        metadata: {
          fileName: batch.fileName,
          attempted: batch.stagingRows.length,
          imported,
          failed: failures.length,
        },
      });
    });

    return {
      batchId,
      attempted: batch.stagingRows.length,
      imported,
      failed: failures.length,
      failures: failures.slice(0, 50),
    };
  }

  /** Discards a staged batch that was never committed. */
  async discard(batchId: string, currentUser: AuthUser) {
    const batch = await this.prisma.importBatch.findUnique({
      where: { id: batchId },
      select: { id: true, status: true, fileName: true },
    });
    if (!batch) {
      throw new NotFoundException('Import batch not found');
    }
    if (batch.status === ImportStatus.COMPLETED) {
      throw new BadRequestException(
        'This batch has been imported. Its staging rows are the record of what was brought in and are kept.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.importStaging.deleteMany({ where: { batchId } });
      await tx.importBatch.delete({ where: { id: batchId } });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'IMPORT_DISCARD',
        entity: 'ImportBatch',
        entityId: batchId,
        metadata: { fileName: batch.fileName },
      });
    });

    return { message: 'Import discarded. Nothing was written.' };
  }
}
