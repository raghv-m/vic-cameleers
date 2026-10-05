-- AlterTable
ALTER TABLE "customers" ADD COLUMN "emailOptOutAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "business_settings" ADD COLUMN "quoteFollowUpDays" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN "quoteFollowUpEnabled" BOOLEAN NOT NULL DEFAULT true;
