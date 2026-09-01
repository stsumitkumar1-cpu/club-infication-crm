/**
 * Records the missing plan purchase for customers whose plan column names a
 * plan they hold no Membership for.
 *
 * Why these exist: the intake form used to set a customer's plan, amount, days
 * and nights from the catalogue but never record the Membership. So a customer
 * read "Plan: Bronze, 6 Months" while the system held zero plan purchases, zero
 * nights, and any opening payment attributed to no plan. Intake now records the
 * sale in the same transaction; these are the records made before that.
 *
 * Deliberately driven through the API rather than by writing rows directly.
 * Creating a membership means choosing dates, allocating nights into the ledger,
 * attributing payments and syncing the customer's status — reimplementing those
 * rules in a script is how a backfill ends up disagreeing with the application
 * that has to live with its output. This posts to /memberships and lets the
 * service do exactly what it does for a human.
 *
 * The start date is the customer's createdAt: that is when the sale was actually
 * recorded, so it is the honest start of their term. The end date and the night
 * allocation come from the plan, via the service.
 *
 *   node scripts/backfill-memberships.mjs                     # dry run
 *   node scripts/backfill-memberships.mjs --apply
 *   node scripts/backfill-memberships.mjs --apply --port 3099
 *
 * Requires the API to be running. Pass --port if it is not on 3000.
 */
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ quiet: true });

const apply = process.argv.includes('--apply');
const portIndex = process.argv.indexOf('--port');
const port = portIndex !== -1 ? process.argv[portIndex + 1] : '3000';
const base = `http://localhost:${port}/api`;

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
if (!email || !password) {
  console.error(
    '\nSEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env — the\n' +
      'backfill signs in as the Super Admin so every membership it creates\n' +
      'carries a real actor in the audit log.\n',
  );
  process.exit(1);
}

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

async function login() {
  let res;
  try {
    res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    console.error(
      `\nCannot reach the API at ${base}. Start the backend first, or pass --port.\n`,
    );
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`\nLogin failed (${res.status}). Check the .env credentials.\n`);
    process.exit(1);
  }
  return (await res.json()).accessToken;
}

const prisma = new PrismaClient();

try {
  const [customers, packages] = await Promise.all([
    prisma.customer.findMany({
      where: { memberships: { none: {} } },
      select: {
        id: true,
        name: true,
        plan: true,
        amount: true,
        amountPaid: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.package.findMany({
      select: { id: true, name: true, nights: true, validityMonths: true, isActive: true },
    }),
  ]);

  const byName = new Map(packages.map((p) => [p.name.toLowerCase(), p]));

  const ready = [];
  const skipped = [];

  for (const c of customers) {
    const pkg = c.plan ? byName.get(c.plan.trim().toLowerCase()) : undefined;
    if (!pkg) {
      skipped.push({
        ...c,
        why: c.plan
          ? `no catalogue plan named "${c.plan}"`
          : 'no plan recorded, so nothing was bought',
      });
      continue;
    }
    if (!pkg.isActive) {
      skipped.push({ ...c, why: `"${pkg.name}" is inactive and cannot be sold` });
      continue;
    }
    ready.push({ ...c, pkg });
  }

  console.log(`\n${customers.length} customer(s) hold no membership.`);

  for (const c of ready) {
    console.log(
      `  ${apply ? 'RECORD  ' : 'WOULD RECORD'}  ${c.name}: ${c.pkg.name}\n` +
        `      start ${c.createdAt.toISOString().slice(0, 10)} · ` +
        `${c.pkg.validityMonths} months · allocates ${c.pkg.nights} nights · ` +
        `${money(c.amountPaid)} of ${money(c.amount)} collected`,
    );
  }

  for (const c of skipped) {
    console.log(`  SKIP      ${c.name} — ${c.why}`);
  }

  if (!ready.length) {
    console.log('');
  } else if (!apply) {
    console.log('\nDry run — nothing was written. Re-run with --apply.\n');
  } else {
    const token = await login();
    let done = 0;

    for (const c of ready) {
      const res = await fetch(`${base}/memberships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: c.id,
          packageId: c.pkg.id,
          startDate: c.createdAt.toISOString(),
        }),
      });

      if (res.ok) {
        done += 1;
      } else {
        const body = await res.json().catch(() => null);
        console.log(
          `      FAILED ${c.name}: ${body?.message ?? res.status}`,
        );
      }
    }

    console.log(`\nRecorded ${done} of ${ready.length} membership(s).\n`);
  }
} finally {
  await prisma.$disconnect();
}
