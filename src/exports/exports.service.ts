import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { PrismaService } from '../database/prisma.service.js';
import { customerScopeFilter } from '../common/scope/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Excel export.
 *
 * Deliberately laid out like the client's own member sheet — Date, Name, Co
 * Applicant, Phone, Consultant, Product, Product Cost, Paid, Pending, MAF No,
 * Nights per Year, Total Nights and so on. The team has read that shape every
 * month for two years; an export in a tidier order of our own choosing would
 * be harder for them to use, not easier.
 *
 * Where the CRM knows something the sheet could not, it is added at the end
 * rather than woven in: nights actually remaining, and how the figures were
 * derived.
 */
@Injectable()
export class ExportsService {
  constructor(private prisma: PrismaService) {}

  /** "06N/07Days", the way the sheet writes an annual entitlement. */
  private nightsPerYearText(
    nightsPerYear: number | null,
    days: number,
  ): string {
    if (!nightsPerYear) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(nightsPerYear)}N/${pad(days)}Days`;
  }

  private dateOnly(value: Date | null | undefined): string {
    if (!value) return '';
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${d}-${m}-${y}`;
  }

  /**
   * Every customer the caller is allowed to see, as an xlsx buffer.
   *
   * Scoped through the same filter as every other read (Spec 2.3), so a
   * Manager's export contains their team and nothing else — an export that
   * ignored scope would be the easiest way to walk out with the whole database.
   */
  async customersWorkbook(currentUser: AuthUser): Promise<{
    buffer: Buffer;
    fileName: string;
    rowCount: number;
  }> {
    const customers = await this.prisma.customer.findMany({
      where: customerScopeFilter(currentUser),
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

    const wb = new ExcelJS.Workbook();
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
    // Keeps the header visible while scrolling 800 rows.
    ws.views = [{ state: 'frozen', ySplit: 1 }];

    customers.forEach((c, i) => {
      // The current plan is the newest membership; older ones are history.
      const m = c.memberships[0] ?? null;

      const plan = m?.package ?? null;
      const adaDue = (m?.adaCharges ?? []).reduce((s, a) => s + a.amount, 0);
      const adaPaid = (m?.adaCharges ?? []).reduce(
        (s, a) => s + a.paidAmount,
        0,
      );

      /*
       * Nights come from the ledger, never from a stored counter — the same
       * rule the rest of the app follows, so an export can never disagree with
       * what the screen shows. Plan and complimentary are reported apart, as
       * the client asked.
       */
      const planNights = c.entitlementLog.filter((l) => l.bucket === 'PLAN');
      const compNights = c.entitlementLog.filter(
        (l) => l.bucket === 'COMPLIMENTARY',
      );
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
        // Distinct methods actually recorded, rather than the sheet's free text.
        mode: [...new Set(c.payments.map((p) => p.method).filter(Boolean))].join(
          ', ',
        ),
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
    // exceljs types the return as the DOM's ArrayBuffer-ish shape under Node.
    const raw = await wb.xlsx.writeBuffer();

    return {
      buffer: Buffer.from(raw as ArrayBuffer),
      fileName: `club-infication-members-${stamp}.xlsx`,
      rowCount: customers.length,
    };
  }
}
