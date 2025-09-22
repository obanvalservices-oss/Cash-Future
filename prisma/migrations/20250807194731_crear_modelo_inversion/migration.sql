/*
  Warnings:

  - You are about to drop the column `fecha` on the `Inversion` table. All the data in the column will be lost.
  - You are about to drop the column `fuentePrecio` on the `Inversion` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Inversion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Inversion" DROP COLUMN "fecha",
DROP COLUMN "fuentePrecio",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
