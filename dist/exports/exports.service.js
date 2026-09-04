"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportsService = void 0;
const common_1 = require("@nestjs/common");
const exceljs_1 = __importDefault(require("exceljs"));
const prisma_service_js_1 = require("../database/prisma.service.js");
const index_js_1 = require("../common/scope/index.js");
let ExportsService = class ExportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    nightsPerYearText(nightsPerYear, days) {
        if (!nightsPerYear)
            return '';
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(nightsPerYear)}N/${pad(days)}Days`;
    }
    dateOnly(value) {
        if (!value)
            return '';
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        return `${d}-${m}-${y}`;
    }
    async customersWorkbook(currentUser) {
        const customers = await this.prisma.customer.findMany({
            where: (0, index_js_1.customerScopeFilter)(currentUser),
            orderBy: { createdAt: 'asc' },
            include: {
                assignedExec: {
                    select: { name: true, manager: { select: { name: true } } },
                },
                memberships: {
                    orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
                    include: {
                        package: {
                            select: {
                                name: true,
                                nights: true,
                                nightsPerYear: true,
                                days: true,
                                validityMonths: true,
                            },
                        },
                        adaCharges: { select: { amount: true, paidAmount: true } },
                    },
                },
                payments: { select: { amount: true, method: true, date: true } },
                entitlementLog: { select: { nights: true, bucket: true } },
            },
        });
        const wb = new exceljs_1.default.Workbook();
        wb.creator = 'Club Infication CRM';
        wb.created = new Date();
        const ws = wb.addWorksheet('Members');
        ws.columns = [
            { header: 'Date', key: 'date', width: 12 },
            { header: 'Sr.No', key: 'sr', width: 7 },
            { header: 'Name', key: 'name', width: 24 },
            { header: 'Co Applicant', key: 'co', width: 20 },
            { header: 'Phone No.', key: 'phone', width: 16 },
            { header: 'Alt Phone', key: 'altPhone', width: 16 },
            { header: 'Email id', key: 'email', width: 28 },
            { header: 'Consultant', key: 'consultant', width: 18 },
            { header: 'Manager', key: 'manager', width: 18 },
            { header: 'Location', key: 'location', width: 16 },
            { header: 'Product', key: 'product', width: 22 },
            { header: 'Product Cost', key: 'cost', width: 14 },
            { header: 'Paid Amt', key: 'paid', width: 12 },
            { header: 'Pending', key: 'pending', width: 12 },
            { header: 'Mode Of Payment', key: 'mode', width: 24 },
            { header: 'MAF No', key: 'maf', width: 12 },
            { header: 'ADA', key: 'ada', width: 10 },
            { header: 'ADA Paid', key: 'adaPaid', width: 10 },
            { header: 'Nights Per Year', key: 'npy', width: 15 },
            { header: 'Total Nights', key: 'totalNights', width: 12 },
            { header: 'Nights Used', key: 'nightsUsed', width: 12 },
            { header: 'Nights Remaining', key: 'nightsLeft', width: 16 },
            { header: 'Complimentary Nights', key: 'compNights', width: 20 },
            { header: 'Offers', key: 'offers', width: 30 },
            { header: 'Membership Status', key: 'status', width: 16 },
            { header: 'Validity From', key: 'from', width: 13 },
            { header: 'Validity To', key: 'to', width: 13 },
            { header: 'Remarks', key: 'remarks', width: 30 },
            { header: 'Usage Notes (imported)', key: 'usageNotes', width: 40 },
        ];
        ws.getRow(1).font = { bold: true };
        ws.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEEF2FF' },
        };
        ws.views = [{ state: 'frozen', ySplit: 1 }];
        customers.forEach((c, i) => {
            const m = c.memberships[0] ?? null;
            const plan = m?.package ?? null;
            const adaDue = (m?.adaCharges ?? []).reduce((s, a) => s + a.amount, 0);
            const adaPaid = (m?.adaCharges ?? []).reduce((s, a) => s + a.paidAmount, 0);
            const planNights = c.entitlementLog.filter((l) => l.bucket === 'PLAN');
            const compNights = c.entitlementLog.filter((l) => l.bucket === 'COMPLIMENTARY');
            const nightsLeft = planNights.reduce((s, l) => s + l.nights, 0);
            const credited = planNights
                .filter((l) => l.nights > 0)
                .reduce((s, l) => s + l.nights, 0);
            ws.addRow({
                date: this.dateOnly(m?.startDate ?? c.createdAt),
                sr: i + 1,
                name: c.name,
                co: c.coApplicant ?? '',
                phone: c.phone,
                altPhone: c.altPhone ?? '',
                email: c.email ?? '',
                consultant: c.assignedExec?.name ?? '',
                manager: c.assignedExec?.manager?.name ?? '',
                location: c.location ?? '',
                product: plan?.name ?? c.plan ?? '',
                cost: m?.salePrice ?? c.amount,
                paid: c.amountPaid,
                pending: c.pendingAmount,
                mode: [...new Set(c.payments.map((p) => p.method).filter(Boolean))].join(', '),
                maf: c.membershipId ?? '',
                ada: adaDue || '',
                adaPaid: adaPaid || '',
                npy: plan
                    ? this.nightsPerYearText(plan.nightsPerYear, plan.days)
                    : '',
                totalNights: plan?.nights ?? c.totalNights,
                nightsUsed: Math.max(credited - nightsLeft, 0),
                nightsLeft,
                compNights: compNights.reduce((s, l) => s + l.nights, 0) || '',
                offers: m?.offersText ?? '',
                status: m?.status ?? c.status,
                from: this.dateOnly(m?.startDate),
                to: this.dateOnly(m?.endDate),
                remarks: m?.remarksText ?? '',
                usageNotes: m?.usageNotes ?? '',
            });
        });
        const stamp = new Date().toISOString().slice(0, 10);
        const raw = await wb.xlsx.writeBuffer();
        return {
            buffer: Buffer.from(raw),
            fileName: `club-infication-members-${stamp}.xlsx`,
            rowCount: customers.length,
        };
    }
};
exports.ExportsService = ExportsService;
exports.ExportsService = ExportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], ExportsService);
//# sourceMappingURL=exports.service.js.map