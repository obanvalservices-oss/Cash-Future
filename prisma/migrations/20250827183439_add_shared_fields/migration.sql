-- AlterTable
ALTER TABLE "public"."Gasto" ADD COLUMN     "colorTag" TEXT,
ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedId" TEXT;
