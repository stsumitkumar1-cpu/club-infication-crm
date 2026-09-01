/**
 * Repairs customers whose `amountPaid` disagrees with their payment rows.
 *
 * Why this exists: the intake form's "Amount paid" used to write only the
 * aggregate on Customer. Recording that same money from the payment panel then
 * added it a second time, so a customer who paid ₹1,00,000 once could end up
 * reading ₹2,00,000 paid with a single ₹1,00,000 row to account for it. The
 * form now writes a payment row, so new records cannot drift — but rows created
 * before that fix still carry the inflated figure.
 *
 * The payment rows are treated as the truth (Spec §9.1: amount paid is the sum
 * of payment records). `pendingAmount` is recomputed from the corrected total.
 *
 * A customer with an inflated aggregate and NO payment rows at all is left
 * alone and reported separately: there is nothing to prove the real figure, so
 * zeroing it would silently destroy an opening balance rather than fix a bug.
 *
 *   node scripts/reconcile-amount-paid.mjs                 # dry run, changes nothing
 *   node scripts/reconcile-amount-paid.mjs --apply         # writes
 *   node scripts/reconcile-amount-paid.mjs --apply --mirror # the PG16 mirror
 */
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ quiet: true });

const apply = process.argv.includes('--apply');
const mirror = process.argv.includes('--mirror');

const url = mirror ? process.env.DATABASE_URL_MIRROR : process.env.DATABASE_URL;
if (!url) {
  console.error(
    `\n${mirror ? 'DATABASE_URL_MIRROR' : 'DATABASE_URL'} is not set in .env.\n`,
  );
  process.exit(1);
}

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const round = (n) => Math.round(n * 100) / 100;

const prisma = new PrismaClient({ datasources: { db: { url } } });

try {
  const customers = await prisma.customer.findMany({
    select: {
      id: true,
      name: true,
      amount: true,
      amountPaid: true,
      pendingAmount: true,
      payments: { select: { id: true, amount: true, membershipId: true } },
      memberships: { where: { status: 'ACTIVE' }, select: { id: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const fixable = [];
  const unprovable = [];
  /*
   * Payments recorded before the service learned to attribute them show a blank
   * "for plan" column. Where the customer holds exactly one ACTIVE membership
   * the attribution is unambiguous, so fill it in; otherwise leave it blank
   * rather than guess which plan the money was for.
   */
  const orphanPayments = [];

  for (const c of customers) {
    const rowsTotal = round(c.payments.reduce((s, p) => s + p.amount, 0));

    if (c.memberships.length === 1) {
      for (const p of c.payments) {
        if (!p.membershipId) {
          orphanPayments.push({
            paymentId: p.id,
            membershipId: c.memberships[0].id,
            customerName: c.name,
            amount: p.amount,
          });
        }
      }
    }

    if (rowsTotal === round(c.amountPaid)) continue;

    (c.payments.length === 0 ? unprovable : fixable).push({ ...c, rowsTotal });
  }

  console.log(
    `\n${mirror ? 'MIRROR (PG16)' : 'PRIMARY (PG18)'} — ${customers.length} customers scanned`,
  );

  if (!fixable.length && !unprovable.length && !orphanPayments.length) {
    console.log('Every customer already matches their payment rows. Nothing to do.\n');
  }

  for (const c of fixable) {
    const nextPending = round(Math.max(c.amount - c.rowsTotal, 0));
    console.log(
      `  ${apply ? 'FIX ' : 'WOULD FIX'}  ${c.name}\n` +
        `      amountPaid    ${money(c.amountPaid)} -> ${money(c.rowsTotal)}` +
        `   (${c.payments.length} payment row${c.payments.length === 1 ? '' : 's'})\n` +
        `      pendingAmount ${money(c.pendingAmount)} -> ${money(nextPending)}`,
    );

    if (apply) {
      await prisma.customer.update({
        where: { id: c.id },
        data: { amountPaid: c.rowsTotal, pendingAmount: nextPending },
      });
    }
  }

  for (const o of orphanPayments) {
    console.log(
      `  ${apply ? 'LINK' : 'WOULD LINK'}  ${o.customerName}: ` +
        `${money(o.amount)} payment attributed to its active membership`,
    );
    if (apply) {
      await prisma.payment.update({
        where: { id: o.paymentId },
        data: { membershipId: o.membershipId },
      });
    }
  }

  for (const c of unprovable) {
    console.log(
      `  SKIP      ${c.name} — ${money(c.amountPaid)} paid with no payment rows.\n` +
        `      Left untouched: this may be a genuine opening balance, not the bug.`,
    );
  }

  const changes = fixable.length + orphanPayments.length;
  if (changes && !apply) {
    console.log('\nDry run — nothing was written. Re-run with --apply to fix.\n');
  } else if (changes) {
    console.log(`\nCorrected ${fixable.length} customer total(s), linked ${orphanPayments.length} payment(s).\n`);
  }
} finally {
  await prisma.$disconnect();
}
