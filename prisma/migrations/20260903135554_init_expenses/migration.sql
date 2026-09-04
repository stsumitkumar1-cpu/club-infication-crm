-- DropIndex
DROP INDEX "Customer_membershipId_idx";

-- DropIndex
DROP INDEX "Customer_phone_idx";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Refund" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "MiscellaneousExpense" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiscellaneousExpense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MiscellaneousExpense_date_idx" ON "MiscellaneousExpense"("date");

-- CreateIndex
CREATE INDEX "MiscellaneousExpense_recordedById_idx" ON "MiscellaneousExpense"("recordedById");

-- AddForeignKey
ALTER TABLE "MiscellaneousExpense" ADD CONSTRAINT "MiscellaneousExpense_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
