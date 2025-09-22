-- AlterTable
ALTER TABLE "public"."UserSettings" ADD COLUMN     "timezone" TEXT DEFAULT 'UTC',
ALTER COLUMN "currency" DROP NOT NULL;
