-- Phase 6: Entitlements & Bookings
--
-- Links each ledger movement to the booking that caused it (Spec 6.1:
-- "Booking -- EntitlementLedger (usage deduction)") so a cancellation can
-- restore exactly what was consumed, and adds booking idempotency for the
-- mandatory duplicate-booking test in Spec 18.
--
-- Defaults are supplied on the NOT NULL column so this is safe on a table
-- that already holds rows.

-- AlterTable
ALTER TABLE "EntitlementLedger"
  ADD COLUMN "bookingId" TEXT,
  ADD COLUMN "actorId"   TEXT,
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Booking"
  ADD COLUMN "idempotencyKey" TEXT;

-- CreateIndex
CREATE INDEX "EntitlementLedger_bookingId_idx" ON "EntitlementLedger"("bookingId");
CREATE INDEX "EntitlementLedger_type_idx" ON "EntitlementLedger"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_idempotencyKey_key" ON "Booking"("idempotencyKey");
CREATE INDEX "Booking_checkIn_idx" ON "Booking"("checkIn");

-- AddForeignKey
ALTER TABLE "EntitlementLedger" ADD CONSTRAINT "EntitlementLedger_bookingId_fkey"
  FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
