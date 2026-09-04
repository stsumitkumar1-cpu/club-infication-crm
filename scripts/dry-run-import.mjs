/**
 * Reads a legacy member workbook and reports exactly what an import would do —
 * without writing a single row.
 *
 * Runs the real parser from src/, compiled into dist/, so the report cannot
 * drift from what the import actually does. Meant to be run with the client on
 * the call: every number below is a decision they can act on.
 *
 *   npm run import:dry-run -- "C:/path/to/Member sheet.xlsx"
 */
import { readFileSync } from 'node:fs';
import ExcelJS from 'exceljs';
import {
  mapRow,
  mapHeaderRow,
  isCommittable,
  planNameFor,
  consultantKey,
} from '../dist/imports/sheet-parser.js';

const file = process.argv[2];
if (!file) {
  console.error('\nUsage: npm run import:dry-run -- "path/to/workbook.xlsx"\n');
  process.exit(1);
}
readFileSync(file); // fail early and clearly if the path is wrong

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(file);

const rows = [];
const skippedSheets = [];
const skippedHeaders = [];

for (const ws of wb.worksheets) {
  /*
   * The header is the first row carrying several recognisable column names,
   * because a few tabs put a title or a blank line above it.
   */
  let headerRow = null;
  let fields = null;
  const dupHeaders = [];
  for (let r = 1; r <= Math.min(6, ws.rowCount); r += 1) {
    const raw = [];
    ws.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
      raw[col] = cell.value;
    });
    // Mapped across the whole row, so the three columns called "Date" are told
    // apart rather than overwriting each other.
    const { fields: mapped, duplicates } = mapHeaderRow(raw);
    if (mapped.filter(Boolean).length >= 6) {
      headerRow = r;
      fields = mapped;
      dupHeaders.push(...duplicates.map((d) => `${ws.name}: ${d}`));
      break;
    }
  }
  if (dupHeaders.length) skippedHeaders.push(...dupHeaders);

  if (!headerRow) {
    skippedSheets.push(ws.name);
    continue;
  }

  for (let r = headerRow + 1; r <= ws.rowCount; r += 1) {
    const raw = {};
    ws.getRow(r).eachCell({ includeEmpty: true }, (cell, col) => {
      const field = fields[col];
      if (!field) return;
      // exceljs wraps formula and rich-text cells; take the readable part.
      const v = cell.value;
      raw[field] =
        v && typeof v === 'object' && !(v instanceof Date)
          ? (v.result ?? v.text ?? v.hyperlink ?? null)
          : v;
    });

    // A totals line or a spacer, not a member.
    const name = raw.name ? String(raw.name).trim() : '';
    if (!name || name === '-' || /^total/i.test(name)) continue;

    rows.push(mapRow(ws.name, r, raw));
  }
}

/* ------------------------------- the report ------------------------------ */

const ok = rows.filter(isCommittable);
const blocked = rows.filter((r) => !isCommittable(r));

console.log('\n================ IMPORT DRY RUN =================');
console.log(`file    : ${file.split(/[\\/]/).pop()}`);
console.log(`tabs    : ${wb.worksheets.length} read, ${skippedSheets.length} skipped (no header)`);
if (skippedSheets.length) console.log(`          skipped: ${skippedSheets.join(', ')}`);
if (skippedHeaders.length) {
  console.log(`headers : ${skippedHeaders.length} duplicate column heading(s) ignored`);
  for (const d of skippedHeaders.slice(0, 6)) console.log(`          ${d}`);
}
console.log(`rows    : ${rows.length} member rows found`);
console.log(`          ${ok.length} ready to import`);
console.log(`          ${blocked.length} blocked, listed below`);

/* what the catalogue becomes */
const plans = new Map();
for (const r of ok) {
  if (!r.years || !r.nightsPerYear) continue;
  const key = planNameFor(r.years, r.nightsPerYear);
  const p = plans.get(key) ?? { n: 0, min: Infinity, max: 0 };
  p.n += 1;
  if (r.productCost !== null) {
    p.min = Math.min(p.min, r.productCost);
    p.max = Math.max(p.max, r.productCost);
  }
  plans.set(key, p);
}
console.log(`\n--- PLANS to create: ${plans.size}`);
for (const [name, p] of [...plans].sort((a, b) => b[1].n - a[1].n)) {
  const range = p.min === Infinity ? '' : `  Rs${p.min.toLocaleString('en-IN')} - ${p.max.toLocaleString('en-IN')}`;
  console.log(`  ${String(p.n).padStart(4)} sales   ${name.padEnd(34)}${range}`);
}

/* consultants, grouped by normalised key so spellings collapse */
const people = new Map();
for (const r of rows) {
  if (!r.consultant) continue;
  const key = consultantKey(r.consultant);
  const p = people.get(key) ?? { spellings: new Set(), n: 0 };
  p.spellings.add(r.consultant);
  p.n += 1;
  people.set(key, p);
}
console.log(`\n--- CONSULTANTS to match to users: ${people.size} distinct keys`);
for (const [, p] of [...people].sort((a, b) => b[1].n - a[1].n).slice(0, 25)) {
  console.log(`  ${String(p.n).padStart(4)}  ${[...p.spellings].join(' | ')}`);
}

/* stays */
const allStays = rows.flatMap((r) => r.stays);
const confident = allStays.filter((s) => s.confident);
console.log('\n--- STAYS');
console.log(`  ${allStays.length} found in ${rows.filter((r) => r.stays.length).length} rows`);
console.log(`  ${confident.length} readable as bookings`);
console.log(`  ${allStays.length - confident.length} kept as notes for the team to enter`);

/* the things needing a human */
const warnings = new Map();
for (const r of rows) {
  for (const i of r.issues) {
    if (i.severity !== 'warning') continue;
    const bucket = `${i.field}: ${i.message.replace(/"[^"]*"/g, '"…"').replace(/\d+/g, 'N')}`;
    warnings.set(bucket, (warnings.get(bucket) ?? 0) + 1);
  }
}
console.log('\n--- WARNINGS (imported anyway, flagged for correction)');
for (const [msg, n] of [...warnings].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${msg}`);
}

if (blocked.length) {
  console.log('\n--- BLOCKED ROWS');
  for (const r of blocked.slice(0, 25)) {
    const why = r.issues.filter((i) => i.severity === 'error').map((i) => i.message).join('; ');
    console.log(`  ${r.sheet} r${r.rowNumber}  ${r.name ?? '(no name)'}: ${why}`);
  }
  if (blocked.length > 25) console.log(`  ... and ${blocked.length - 25} more`);
}

/* duplicates the reviewer has to resolve */
const byPhone = new Map();
const byMaf = new Map();
for (const r of ok) {
  if (r.phone) byPhone.set(r.phone, [...(byPhone.get(r.phone) ?? []), r]);
  if (r.mafNo) byMaf.set(r.mafNo, [...(byMaf.get(r.mafNo) ?? []), r]);
}
const dupPhone = [...byPhone.values()].filter((v) => v.length > 1);
const dupMaf = [...byMaf.values()].filter((v) => v.length > 1);
console.log('\n--- DUPLICATES (imported as-is, per the client)');
console.log(`  ${dupPhone.length} phone number(s) used by more than one row`);
console.log(`  ${dupMaf.length} MAF number(s) used by more than one row`);
for (const g of dupMaf.slice(0, 6)) {
  console.log(`     MAF ${g[0].mafNo}: ${g.map((r) => `${r.name} (${r.sheet} r${r.rowNumber})`).join(' | ')}`);
}

console.log('\nNothing was written. This is a report only.\n');
