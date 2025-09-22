/*
  Warnings:

  - You are about to drop the column `colorTag` on the `Gasto` table. All the data in the column will be lost.
  - You are about to drop the column `isShared` on the `Gasto` table. All the data in the column will be lost.
  - You are about to drop the column `sharedId` on the `Gasto` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Gasto_sharedId_idx";

-- AlterTable
ALTER TABLE "public"."Gasto" DROP COLUMN "colorTag",
DROP COLUMN "isShared",
DROP COLUMN "sharedId";

-- AlterTable
ALTER TABLE "public"."MovimientoCompartido" ALTER COLUMN "createdByUserId" DROP NOT NULL;
