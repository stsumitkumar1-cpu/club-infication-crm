import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Creates the first Super Admin so the system has a way in.
 *
 * Credentials come from the environment (Spec 16) — nothing is hardcoded, and
 * there is no fallback: a default admin password committed to the repository
 * would be a published credential for every deployment.
 */
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    console.error(
      `\nMissing ${name}.\n` + `Set it in backend/.env before seeding — see .env.example.\n`,
    );
    process.exit(1);
  }
  return value;
}

async function main() {
  const email = requiredEnv('SEED_ADMIN_EMAIL').toLowerCase().trim();
  const password = requiredEnv('SEED_ADMIN_PASSWORD');
  const name = process.env.SEED_ADMIN_NAME?.trim() || 'Super Admin';

  if (password.length < 8) {
    console.error('\nSEED_ADMIN_PASSWORD must be at least 8 characters.\n');
    process.exit(1);
  }

  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash(password, 10);

  // Upsert keeps re-seeding safe. An existing admin's password is deliberately
  // left alone so re-running the seed cannot silently reset a live credential.
  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('Super Admin ready:');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
