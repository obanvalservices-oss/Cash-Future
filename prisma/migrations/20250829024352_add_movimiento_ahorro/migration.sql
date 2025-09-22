/*
  Warnings:

  - You are about to drop the column `fondoId` on the `MovimientoAhorro` table. All the data in the column will be lost.
  - Added the required column `ahorroId` to the `MovimientoAhorro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."MovimientoAhorro" DROP CONSTRAINT "MovimientoAhorro_fondoId_fkey";

-- AlterTable
ALTER TABLE "public"."MovimientoAhorro" DROP COLUMN "fondoId",
ADD COLUMN     "ahorroId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "monto" SET DEFAULT 0,
ALTER COLUMN "motivo" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "public"."MovimientoAhorro" ADD CONSTRAINT "MovimientoAhorro_ahorroId_fkey" FOREIGN KEY ("ahorroId") REFERENCES "public"."Ahorro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
