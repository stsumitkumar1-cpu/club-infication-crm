-- Phase 5: Payments & Refunds
--
-- Adds the membership link (Spec 9.2 records a refund against the relevant
-- customer AND membership) and an idempotency key (Spec 8 / mandatory test in
-- Spec 18: a duplicate payment request must be rejected or idempotent).
--
-- `updatedAt` carries DEFAULT CURRENT_TIMESTAMP so this migration is safe on a
-- table that already holds rows; Prisma's own diff omits the default and would
-- fail against existing data.

-- AlterTable
ALTER TABLE "Payment"
  ADD COLUMN "membershipId"   TEXT,
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Refund"
  ADD COLUMN "membershipId"   TEXT,
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_idempotencyKey_key" ON "Payment"("idempotencyKey");
CREATE INDEX "Payment_membershipId_idx" ON "Payment"("membershipId");
CREATE INDEX "Payment_date_idx" ON "Payment"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_idempotencyKey_key" ON "Refund"("idempotencyKey");
CREATE INDEX "Refund_membershipId_idx" ON "Refund"("membershipId");
CREATE INDEX "Refund_date_idx" ON "Refund"("date");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_membershipId_fkey"
  FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_membershipId_fkey"
  FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
