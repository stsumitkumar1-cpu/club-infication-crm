-- Adds the password-reset fields that schema.prisma already declared but that
-- no migration created (drift left over from Phase 1). Additive and nullable,
-- so it is safe on an existing database.
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
