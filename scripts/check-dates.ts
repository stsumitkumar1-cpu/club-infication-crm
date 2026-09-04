import ExcelJS from 'exceljs';
import { mapHeaderRow, excelDate } from '../src/imports/sheet-parser.js';

async function main() {
  const filePath = 'C:\\Users\\Admin\\Downloads\\Member sheet of Club Infication 2024-2025-2026.xlsx';
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  let totalNulls = 0;

  for (const sheet of workbook.worksheets) {
    if (sheet.name === 'Master Data' || sheet.rowCount === 0) continue;

    let headerRow = null;
    let fields: any = null;
    
    for (let r = 1; r <= Math.min(6, sheet.rowCount); r += 1) {
      const raw: any = [];
      sheet.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
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

    for (let r = headerRow + 1; r <= sheet.rowCount; r += 1) {
      const raw: any = {};
      sheet.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
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

      const dateVal = raw.saleDate;
      const saleDate = excelDate(dateVal);

      if (!saleDate) {
        console.log(`[${sheet.name} Row ${r}] Unparsed Date: "${dateVal}" | Name: ${name}`);
        totalNulls++;
      }
    }
  }
  
  console.log(`Total unparsed dates: ${totalNulls}`);
}

main().catch(console.error);
