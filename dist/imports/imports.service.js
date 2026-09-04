"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ImportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportsService = void 0;
const common_1 = require("@nestjs/common");
const exceljs_1 = __importDefault(require("exceljs"));
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const client_1 = require("@prisma/client");
const prisma_service_js_1 = require("../database/prisma.service.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const customers_service_js_1 = require("../customers/customers.service.js");
const sheet_parser_js_1 = require("./sheet-parser.js");
const HEADER_SEARCH_ROWS = 6;
const HEADER_MIN_FIELDS = 6;
let ImportsService = ImportsService_1 = class ImportsService {
    prisma;
    audit;
    customers;
    logger = new common_1.Logger(ImportsService_1.name);
    constructor(prisma, audit, customers) {
        this.prisma = prisma;
        this.audit = audit;
        this.customers = customers;
    }
    async stageWorkbook(file, currentUser) {
        const wb = new exceljs_1.default.Workbook();
        try {
            const loader = wb.xlsx;
            await loader.load(file.buffer);
        }
        catch {
            throw new common_1.BadRequestException('That file could not be read as an Excel workbook (.xlsx).');
        }
        const rows = [];
        const sheetsSkipped = [];
        const headerNotes = [];
        for (const ws of wb.worksheets) {
            let headerRow = null;
            let fields = [];
            for (let r = 1; r <= Math.min(HEADER_SEARCH_ROWS, ws.rowCount); r += 1) {
                const raw = [];
                ws.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
                    raw[col] = cell.value;
                });
                const mapped = (0, sheet_parser_js_1.mapHeaderRow)(raw);
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
                const raw = {};
                ws.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
                    const field = fields[col];
                    if (!field)
                        return;
                    const v = cell.value;
                    raw[field] =
                        v && typeof v === 'object' && !(v instanceof Date)
                            ? (v.result ??
                                v.text ??
                                null)
                            : v;
                });
                const name = raw.name ? String(raw.name).trim() : '';
                if (!name || name === '-' || /^total/i.test(name))
                    continue;
                rows.push((0, sheet_parser_js_1.mapRow)(ws.name, r, raw));
            }
        }
        if (rows.length === 0) {
            throw new common_1.BadRequestException('No member rows were found. Check that the file is the member sheet and that its column headings are intact.');
        }
        const valid = rows.filter(sheet_parser_js_1.isCommittable);
        const batch = await this.prisma.$transaction(async (tx) => {
            const created = await tx.importBatch.create({
                data: {
                    fileName: file.originalname,
                    status: client_1.ImportStatus.VALIDATED,
                    totalRows: rows.length,
                    validRows: valid.length,
                    uploadedById: currentUser.sub,
                },
            });
            await tx.importStaging.createMany({
                data: rows.map((row) => ({
                    batchId: created.id,
                    rowNumber: row.rowNumber,
                    rawData: JSON.stringify({ sheet: row.sheet, row: row.rowNumber }),
                    mappedData: JSON.stringify(row),
                    validationErrors: row.issues.length
                        ? JSON.stringify(row.issues)
                        : null,
                    importStatus: (0, sheet_parser_js_1.isCommittable)(row)
                        ? client_1.ImportRowStatus.PENDING
                        : client_1.ImportRowStatus.INVALID,
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
    summarise(batchId, rows) {
        const valid = rows.filter(sheet_parser_js_1.isCommittable);
        const blocked = rows.filter((r) => !(0, sheet_parser_js_1.isCommittable)(r));
        const plans = new Map();
        for (const r of valid) {
            if (!r.years || !r.nightsPerYear)
                continue;
            const name = (0, sheet_parser_js_1.planNameFor)(r.years, r.nightsPerYear);
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
        const people = new Map();
        for (const r of rows) {
            const key = (0, sheet_parser_js_1.consultantKey)(r.consultant);
            if (!key)
                continue;
            const p = people.get(key) ?? { spellings: [], sales: 0 };
            if (r.consultant && !p.spellings.includes(r.consultant)) {
                p.spellings.push(r.consultant);
            }
            p.sales += 1;
            people.set(key, p);
        }
        const stays = rows.flatMap((r) => r.stays);
        const warnings = new Map();
        for (const r of rows) {
            for (const i of r.issues) {
                if (i.severity !== 'warning')
                    continue;
                const bucket = `${i.field}|${i.message
                    .replace(/"[^"]*"/g, '"…"')
                    .replace(/\d+/g, 'N')}`;
                warnings.set(bucket, (warnings.get(bucket) ?? 0) + 1);
            }
        }
        const byPhone = new Map();
        const byMaf = new Map();
        for (const r of valid) {
            if (r.phone)
                byPhone.set(r.phone, [...(byPhone.get(r.phone) ?? []), r]);
            if (r.mafNo)
                byMaf.set(r.mafNo, [...(byMaf.get(r.mafNo) ?? []), r]);
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
    async findOne(batchId) {
        const batch = await this.prisma.importBatch.findUnique({
            where: { id: batchId },
            include: {
                uploadedBy: { select: { id: true, name: true } },
                stagingRows: { select: { mappedData: true }, orderBy: { rowNumber: 'asc' } },
            },
        });
        if (!batch) {
            throw new common_1.NotFoundException('Import batch not found');
        }
        const rows = batch.stagingRows
            .map((r) => (r.mappedData ? JSON.parse(r.mappedData) : null))
            .filter((r) => r !== null);
        return {
            ...this.summarise(batch.id, rows),
            fileName: batch.fileName,
            status: batch.status,
            importedRows: batch.importedRows,
            uploadedBy: batch.uploadedBy?.name ?? null,
            createdAt: batch.createdAt,
        };
    }
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
    async resolveConsultant(tx, name, cache) {
        const key = (0, sheet_parser_js_1.consultantKey)(name);
        if (!key || !name)
            return null;
        if (cache.has(key))
            return cache.get(key) ?? null;
        const candidates = await tx.user.findMany({
            select: { id: true, name: true },
        });
        const match = candidates.find((u) => (0, sheet_parser_js_1.consultantKey)(u.name) === key);
        if (match) {
            cache.set(key, match.id);
            return match.id;
        }
        const created = await tx.user.create({
            data: {
                name,
                email: `${key}.imported@clubinfication.invalid`,
                role: client_1.Role.EXECUTIVE,
                passwordHash: await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10),
                isActive: false,
            },
            select: { id: true },
        });
        cache.set(key, created.id);
        return created.id;
    }
    async resolvePackage(tx, row, cache) {
        if (!row.years || !row.nightsPerYear)
            return null;
        const name = (0, sheet_parser_js_1.planNameFor)(row.years, row.nightsPerYear);
        const cached = cache.get(name);
        if (cached)
            return cached;
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
    async commit(batchId, currentUser) {
        const batch = await this.prisma.importBatch.findUnique({
            where: { id: batchId },
            include: {
                stagingRows: {
                    where: { importStatus: client_1.ImportRowStatus.PENDING },
                    orderBy: { rowNumber: 'asc' },
                },
            },
        });
        if (!batch) {
            throw new common_1.NotFoundException('Import batch not found');
        }
        if (batch.status === client_1.ImportStatus.COMPLETED) {
            throw new common_1.BadRequestException('This batch has already been imported. Upload the file again to import it a second time.');
        }
        const consultantCache = new Map();
        const packageCache = new Map();
        let imported = 0;
        const failures = [];
        for (const staged of batch.stagingRows) {
            const row = staged.mappedData
                ? JSON.parse(staged.mappedData)
                : null;
            if (!row || !row.name)
                continue;
            try {
                await this.prisma.$transaction(async (tx) => {
                    const assignedExecId = await this.resolveConsultant(tx, row.consultant, consultantCache);
                    const packageId = await this.resolvePackage(tx, row, packageCache);
                    if (!packageId) {
                        throw new Error('No plan could be derived from this row');
                    }
                    packageCache.set((0, sheet_parser_js_1.planNameFor)(row.years, row.nightsPerYear), packageId);
                    if (assignedExecId && row.consultant) {
                        consultantCache.set((0, sheet_parser_js_1.consultantKey)(row.consultant), assignedExecId);
                    }
                });
                const assignedExecId = row.consultant
                    ? (consultantCache.get((0, sheet_parser_js_1.consultantKey)(row.consultant)) ?? null)
                    : null;
                const packageId = packageCache.get((0, sheet_parser_js_1.planNameFor)(row.years, row.nightsPerYear));
                await this.customers.create({
                    name: row.name,
                    phone: row.phone ?? `IMPORT-${staged.rowNumber}-${row.sheet}`,
                    altPhone: row.altPhone ?? undefined,
                    email: row.email ?? undefined,
                    coApplicant: row.coApplicant ?? undefined,
                    location: row.location ?? undefined,
                    plan: (0, sheet_parser_js_1.planNameFor)(row.years, row.nightsPerYear),
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
                }, currentUser, { legacyImport: true });
                await this.prisma.importStaging.update({
                    where: { id: staged.id },
                    data: { importStatus: client_1.ImportRowStatus.IMPORTED },
                });
                imported += 1;
            }
            catch (error) {
                const reason = error instanceof Error ? error.message : 'Unknown error';
                failures.push({ rowNumber: staged.rowNumber, name: row.name, reason });
                await this.prisma.importStaging.update({
                    where: { id: staged.id },
                    data: {
                        importStatus: client_1.ImportRowStatus.INVALID,
                        validationErrors: JSON.stringify([
                            ...(staged.validationErrors
                                ? JSON.parse(staged.validationErrors)
                                : []),
                            { field: 'commit', severity: 'error', message: reason },
                        ]),
                    },
                });
                this.logger.warn(`Import row ${staged.rowNumber} (${row.name}) failed: ${reason}`);
            }
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.importBatch.update({
                where: { id: batchId },
                data: {
                    status: client_1.ImportStatus.COMPLETED,
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
    async discard(batchId, currentUser) {
        const batch = await this.prisma.importBatch.findUnique({
            where: { id: batchId },
            select: { id: true, status: true, fileName: true },
        });
        if (!batch) {
            throw new common_1.NotFoundException('Import batch not found');
        }
        if (batch.status === client_1.ImportStatus.COMPLETED) {
            throw new common_1.BadRequestException('This batch has been imported. Its staging rows are the record of what was brought in and are kept.');
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
};
exports.ImportsService = ImportsService;
exports.ImportsService = ImportsService = ImportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService,
        customers_service_js_1.CustomersService])
], ImportsService);
//# sourceMappingURL=imports.service.js.map