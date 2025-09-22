/*
  Warnings:

  - The primary key for the `Gasto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `Gasto` table. All the data in the column will be lost.
  - Added the required column `frecuencia` to the `Gasto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origen` to the `Gasto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Gasto" DROP CONSTRAINT "Gasto_pkey",
DROP COLUMN "updatedAt",
ADD COLUMN     "frecuencia" TEXT NOT NULL,
ADD COLUMN     "origen" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Gasto_id_seq";
