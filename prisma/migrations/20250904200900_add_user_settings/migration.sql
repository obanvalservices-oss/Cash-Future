/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."UserSettings" DROP COLUMN "createdAt",
DROP COLUMN "timezone",
DROP COLUMN "updatedAt",
ADD COLUMN     "notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weekEndDay" INTEGER NOT NULL DEFAULT 7;
