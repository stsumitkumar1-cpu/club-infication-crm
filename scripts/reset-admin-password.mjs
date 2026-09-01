/**
 * Sets a user's password directly in the database.
 *
 * The database stores only a bcrypt hash, so the plaintext exists nowhere after
 * this runs. That makes the hash the single source of truth — .env is only ever
 * bootstrap *input*, never a record of the current password.
 *
 * Preferred (nothing sensitive left on disk):
 *   npm run admin:reset-password -- --password 'NewPass123'
 *   npm run admin:reset-password -- --email someone@x.com --password 'NewPass123'
 *
 * Fallback for first-time local setup, using .env:
 *   npm run admin:reset-password
 *
 * The password is never printed or logged.
 */
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

dotenv.config({ quiet: true });

/** Reads `--flag value` from argv. */
function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const email = (arg('email') ?? process.env.SEED_ADMIN_EMAIL)?.toLowerCase().trim();
const password = arg('password') ?? process.env.SEED_ADMIN_PASSWORD;
const fromEnv = !arg('password');

if (!email) {
  console.error(
    '\nNo email given. Pass --email, or set SEED_ADMIN_EMAIL in .env.\n',
  );
  process.exit(1);
}
if (!password) {
  console.error(
    '\nNo password given.\n' +
      "  Pass it directly:  npm run admin:reset-password -- --password 'NewPass123'\n" +
      '  Or set SEED_ADMIN_PASSWORD in .env.\n',
  );
  process.exit(1);
}
if (password.length < 8) {
  console.error('\nPassword must be at least 8 characters.\n');
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  });

  if (!user) {
    console.error(
      `\nNo user found with email ${email}. Run \`npm run seed\` first.\n`,
    );
    process.exit(1);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(password, 10),
      // Any outstanding reset request is void once the password changes.
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  console.log(`\nPassword updated for ${email} (${user.role}).`);

  if (fromEnv) {
    console.log(
      '\nIt came from SEED_ADMIN_PASSWORD in .env. Now that the hash is\n' +
        'stored, you can blank that line — the database is the source of\n' +
        'truth, and .env will only go stale if the password changes later.\n' +
        "Future rotations: npm run admin:reset-password -- --password '...'\n",
    );
  } else {
    console.log('It was taken from --password and written nowhere else.\n');
  }
} finally {
  await prisma.$disconnect();
}
