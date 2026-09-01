/**
 * Repairs customers whose status disagrees with their memberships.
 *
 * Why this exists: cancelling or expiring a membership updated the membership
 * row and nothing else, so the customers list kept reading ACTIVE while the
 * customer's own page showed CANCELLED. MembershipsService now keeps the mirror
 * in step on every transition, but rows changed before that fix still carry the
 * stale value.
 *
 * The memberships are the truth (Spec 11 names the filter "Membership status"):
 *   - any ACTIVE membership  -> ACTIVE
 *   - otherwise the newest membership's own status, mapped across
 *   - no memberships at all  -> left alone, and reported
 *
 * That last case is deliberate. A customer is created before any plan exists and
 * sits at whatever the staff chose, usually PENDING. There is nothing to derive
 * from, so deriving anything would replace a deliberate value with a guess.
 *
 *   node scripts/reconcile-customer-status.mjs                  # dry run
 *   node scripts/reconcile-customer-status.mjs --apply
 *   node scripts/reconcile-customer-status.mjs --apply --mirror
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

const prisma = new PrismaClient({ datasources: { db: { url } } });

/** Mirrors MembershipsService.syncCustomerStatus exactly. */
function derive(memberships) {
  if (memberships.length === 0) return null;
  if (memberships.some((m) => m.status === 'ACTIVE')) return 'ACTIVE';
  return memberships[0].status === 'CANCELLED' ? 'CANCELLED' : 'EXPIRED';
}

try {
  const customers = await prisma.customer.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      memberships: {
        orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
        select: { status: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  const fixable = [];
  const noMemberships = [];

  for (const c of customers) {
    const next = derive(c.memberships);
    if (next === null) {
      noMemberships.push(c);
      continue;
    }
    if (next !== c.status) {
      fixable.push({ ...c, next });
    }
  }

  console.log(
    `\n${mirror ? 'MIRROR (PG16)' : 'PRIMARY (PG18)'} — ${customers.length} customers scanned`,
  );

  if (!fixable.length) {
    console.log('Every customer already matches their memberships.');
  }

  for (const c of fixable) {
    const plans = c.memberships.map((m) => m.status).join(', ');
    console.log(
      `  ${apply ? 'FIX ' : 'WOULD FIX'}  ${c.name}: ${c.status} -> ${c.next}\n` +
        `      memberships: ${plans}`,
    );
    if (apply) {
      await prisma.customer.update({
        where: { id: c.id },
        data: { status: c.next },
      });
    }
  }

  if (noMemberships.length) {
    console.log(
      `\n  ${noMemberships.length} customer(s) have no membership yet, so their ` +
        `status is staff-set and was left alone:`,
    );
    for (const c of noMemberships) {
      console.log(`      ${c.name} (${c.status})`);
    }
  }

  if (fixable.length && !apply) {
    console.log('\nDry run — nothing was written. Re-run with --apply to fix.\n');
  } else if (fixable.length) {
    console.log(`\nCorrected ${fixable.length} customer(s).\n`);
  } else {
    console.log('');
  }
} finally {
  await prisma.$disconnect();
}
