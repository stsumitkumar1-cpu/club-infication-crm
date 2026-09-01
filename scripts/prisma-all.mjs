/**
 * Runs a Prisma CLI command against EVERY configured database.
 *
 * This project deliberately keeps two Postgres instances in sync:
 *   DATABASE_URL         — primary        (PostgreSQL 18 @ localhost:5432)
 *   DATABASE_URL_MIRROR  — mirror        (PostgreSQL 16 @ localhost:5434)
 *
 * Applying a migration to only one of them is the main risk of that setup, so
 * every schema change must go through this script rather than a bare
 * `prisma migrate deploy`.
 *
 *   npm run migrate:all          -> migrate deploy on both
 *   npm run migrate:status:all   -> migrate status on both
 *   node scripts/prisma-all.mjs db push --accept-data-loss
 *
 * Exits non-zero if any target fails, so CI cannot go green on a half-applied
 * migration.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import dotenv from 'dotenv';

dotenv.config();

const require = createRequire(import.meta.url);
const prismaCli = require.resolve('prisma/build/index.js');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: node scripts/prisma-all.mjs <prisma command> [...args]');
  process.exit(2);
}

const targets = [
  { label: 'primary', envVar: 'DATABASE_URL' },
  { label: 'mirror', envVar: 'DATABASE_URL_MIRROR' },
]
  .map((t) => ({ ...t, url: process.env[t.envVar] }))
  .filter((t) => Boolean(t.url));

if (targets.length === 0) {
  console.error('No DATABASE_URL or DATABASE_URL_MIRROR found in the environment.');
  process.exit(2);
}

/** Never print credentials to the console. */
const redact = (url) => url.replace(/:\/\/([^:]+):[^@]*@/, '://$1:****@');

const failures = [];

for (const target of targets) {
  console.log(`\n=== ${target.label} (${target.envVar}) ===`);
  console.log(`    ${redact(target.url)}`);

  const result = spawnSync(
    process.execPath,
    [prismaCli, ...args],
    {
      // Prisma loads .env itself but does not overwrite an env var that is
      // already set, so this override decides the target database.
      env: { ...process.env, DATABASE_URL: target.url },
      stdio: 'inherit',
    },
  );

  if (result.status !== 0) {
    failures.push(`${target.label} (exit ${result.status})`);
  }
}

if (failures.length > 0) {
  console.error(`\nFAILED on: ${failures.join(', ')}`);
  console.error('The databases may now be out of sync — resolve before continuing.');
  process.exit(1);
}

console.log(`\nAll ${targets.length} database(s) completed: prisma ${args.join(' ')}`);
