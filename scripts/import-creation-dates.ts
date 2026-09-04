import { readFileSync } from 'node:fs';
import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';
import {
  mapRow,
  mapHeaderRow,
  isCommittable,
} from '../src/imports/sheet-parser.js';

const prisma = new PrismaClient();

async function main() {
  const file = 'C:\\Users\\Admin\\Downloads\\Member sheet of Club Infication 2024-2025-2026.xlsx';
  console.log(`Reading ${file}...`);
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);

  const rows: any[] = [];

  for (const ws of wb.worksheets) {
    let headerRow = null;
    let fields: any = null;
    
    for (let r = 1; r <= Math.min(6, ws.rowCount); r += 1) {
      const raw: any = [];
      ws.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
        raw[col] = cell.value;
      });
      const { fields: mapped } = mapHeaderRow(raw);
      if (mapped.filter(Boolean).length >= 6) {
        headerRow = r;
        fields = mapped;
        break;
      }
    }

    if (!headerRow) continue;

    for (let r = headerRow + 1; r <= ws.rowCount; r += 1) {
      const raw: any = {};
      ws.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
        const field = fields[col];
        if (!field) return;
        const v = cell.value;
        raw[field] =
          v && typeof v === 'object' && !(v instanceof Date)
            ? ((v as any).result ?? (v as any).text ?? (v as any).hyperlink ?? null)
            : v;
      });

      const name = raw.name ? String(raw.name).trim() : '';
      if (!name || name === '-' || /^total/i.test(name)) continue;

      const mappedRow = mapRow(ws.name, r, raw);
      rows.push(mappedRow);
    }
  }

  console.log(`Found ${rows.length} committable rows from sheet.`);
  
  let updated = 0;
  let notFound = 0;

  for (const row of rows) {
    if (!row.saleDate) continue;

    let customers: any[] = [];
    
    if (row.phone) {
      customers = await prisma.customer.findMany({
        where: {
          OR: [
            { phone: { contains: row.phone } },
            { altPhone: { contains: row.phone } }
          ]
        },
      });
    }

    if (customers.length === 0 && row.name) {
      customers = await prisma.customer.findMany({
        where: { name: { contains: row.name.trim() } }
      });
    }

    if (customers.length > 0) {
      let customer = customers.find(c => c.name.toLowerCase().includes(row.name.toLowerCase()));
      if (!customer) customer = customers[0];

      await prisma.customer.update({
        where: { id: customer.id },
        data: { 
          createdAt: new Date('2026-09-02T12:00:00.000Z'),
          registrationDate: row.saleDate
        }
      });
      updated++;
    } else {
      notFound++;
    }
  }

  console.log(`\nImport complete!`);
  console.log(`Successfully updated: ${updated}`);
  console.log(`Not found in DB: ${notFound}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
