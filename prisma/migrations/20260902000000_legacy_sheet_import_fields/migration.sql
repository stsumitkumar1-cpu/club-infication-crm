-- Fields and rules the legacy member sheet needs, per the client's answers of
-- 2026-09-02. Every change is additive or a constraint relaxation, so no
-- existing row is altered and nothing already recorded becomes invalid.

-- ---------------------------------------------------------------------------
-- 1. Which pool an entitlement movement belongs to.
--    Complimentary nights are a gift on top of the plan; the client wants them
--    counted apart from it, otherwise "nights left on your plan" has no answer.
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "EntitlementBucket" AS ENUM ('PLAN', 'COMPLIMENTARY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "EntitlementLedger"
  ADD COLUMN IF NOT EXISTS "bucket" "EntitlementBucket" NOT NULL DEFAULT 'PLAN',
  -- Which membership year the movement concerns. Entitlement is annual and
  -- unused nights lapse, so an allocation and its expiry both name their year.
  -- Null on rows written before the annual rule existed.
  ADD COLUMN IF NOT EXISTS "yearIndex" INTEGER;

CREATE INDEX IF NOT EXISTS "EntitlementLedger_membershipId_bucket_yearIndex_idx"
  ON "EntitlementLedger" ("membershipId", "bucket", "yearIndex");

-- ---------------------------------------------------------------------------
-- 2. Annual entitlement on the catalogue.
--    Nullable on purpose: null keeps the older behaviour, where `nights` is one
--    pool for the whole term. Existing plans are left exactly as they are.
-- ---------------------------------------------------------------------------
ALTER TABLE "Package"
  ADD COLUMN IF NOT EXISTS "nightsPerYear" INTEGER;

-- ---------------------------------------------------------------------------
-- 3. Customer fields the sheet carries and the CRM had nowhere to put.
-- ---------------------------------------------------------------------------
ALTER TABLE "Customer"
  ADD COLUMN IF NOT EXISTS "altPhone"    TEXT,
  ADD COLUMN IF NOT EXISTS "coApplicant" TEXT,
  ADD COLUMN IF NOT EXISTS "location"    TEXT;

-- ---------------------------------------------------------------------------
-- 4. Two unique constraints dropped, deliberately.
--
--    phone: the sheet has two members sharing one number (family). Rejecting
--    them would lose real customers.
--
--    membershipId (MAF No): 153 of 821 rows have none and 21 numbers repeat,
--    a few across two different people. The client's instruction is to import
--    exactly what the sheet says and let a Manager or Super Admin correct it,
--    so the constraint would block the import rather than protect anything.
--
--    Both are still surfaced as warnings in the UI — the check moves from the
--    database to a place a human can act on.
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS "Customer_phone_key";
DROP INDEX IF EXISTS "Customer_membershipId_key";

-- Kept as plain indexes: both are primary search criteria (Spec 11).
CREATE INDEX IF NOT EXISTS "Customer_phone_idx" ON "Customer" ("phone");
CREATE INDEX IF NOT EXISTS "Customer_membershipId_idx" ON "Customer" ("membershipId");

-- ---------------------------------------------------------------------------
-- 5. Per-sale price and the sheet's free-text columns, on the Membership.
--    salePrice is the negotiated figure; Package.price is only a reference.
-- ---------------------------------------------------------------------------
ALTER TABLE "Membership"
  ADD COLUMN IF NOT EXISTS "salePrice"   DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "offersText"  TEXT,
  ADD COLUMN IF NOT EXISTS "remarksText" TEXT,
  -- Stay history that could not be parsed into Bookings, kept verbatim so
  -- nothing is lost and the team can enter those few by hand.
  ADD COLUMN IF NOT EXISTS "usageNotes"  TEXT;

-- ---------------------------------------------------------------------------
-- 6. ADA — the sheet's "Annual Divided Cost".
--
--    A recurring annual charge with its own payment status, deliberately NOT a
--    Payment row: Spec 9.1 makes Customer.amountPaid the sum of the plan's
--    payments, and folding a maintenance fee into that total would misstate
--    what the member owes on their plan.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "AdaCharge" (
  "id"           TEXT NOT NULL,
  "membershipId" TEXT NOT NULL,
  "yearIndex"    INTEGER NOT NULL,
  "amount"       DOUBLE PRECISION NOT NULL,
  "dueDate"      TIMESTAMP(3),
  -- An amount rather than a flag: part payments are normal.
  "paidAmount"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "paidDate"     TIMESTAMP(3),
  "method"       TEXT,
  "notes"        TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdaCharge_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AdaCharge_membershipId_yearIndex_key"
  ON "AdaCharge" ("membershipId", "yearIndex");
CREATE INDEX IF NOT EXISTS "AdaCharge_membershipId_idx"
  ON "AdaCharge" ("membershipId");

DO $$ BEGIN
  ALTER TABLE "AdaCharge"
    ADD CONSTRAINT "AdaCharge_membershipId_fkey"
    FOREIGN KEY ("membershipId") REFERENCES "Membership"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
