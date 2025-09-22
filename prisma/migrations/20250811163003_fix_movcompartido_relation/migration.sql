/*
  Warnings:

  - The `estado` column on the `Asociacion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[asociacionId,modulo,recordId,sourceUserId]` on the table `AsociacionOculto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Asociacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceUserId` to the `AsociacionOculto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AsociacionEstado" AS ENUM ('PENDIENTE', 'ACTIVA', 'RECHAZADA', 'BLOQUEADA');

-- DropForeignKey
ALTER TABLE "public"."Asociacion" DROP CONSTRAINT "Asociacion_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AsociacionOculto" DROP CONSTRAINT "AsociacionOculto_asociacionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AsociacionPermiso" DROP CONSTRAINT "AsociacionPermiso_asociacionId_fkey";

-- AlterTable
ALTER TABLE "public"."Ahorro" ADD COLUMN     "colorTag" TEXT,
ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedId" TEXT;

-- AlterTable
ALTER TABLE "public"."Asociacion" ADD COLUMN     "aliasParaOwner" TEXT,
ADD COLUMN     "aliasParaPartner" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" "public"."AsociacionEstado" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "public"."AsociacionOculto" ADD COLUMN     "sourceUserId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Gasto" ADD COLUMN     "colorTag" TEXT,
ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedId" TEXT;

-- AlterTable
ALTER TABLE "public"."Ingreso" ADD COLUMN     "colorTag" TEXT,
ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedId" TEXT;

-- AlterTable
ALTER TABLE "public"."Inversion" ADD COLUMN     "colorTag" TEXT,
ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedId" TEXT;

-- CreateTable
CREATE TABLE "public"."MovimientoCompartido" (
    "id" TEXT NOT NULL,
    "asociacionId" TEXT NOT NULL,
    "modulo" "public"."ModuloTipo" NOT NULL,
    "concepto" TEXT NOT NULL,
    "montoTotal" DOUBLE PRECISION NOT NULL,
    "aporteOwner" DOUBLE PRECISION NOT NULL,
    "aportePartner" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdByUserId" INTEGER NOT NULL,

    CONSTRAINT "MovimientoCompartido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MovimientoCompartido_asociacionId_idx" ON "public"."MovimientoCompartido"("asociacionId");

-- CreateIndex
CREATE INDEX "MovimientoCompartido_createdByUserId_idx" ON "public"."MovimientoCompartido"("createdByUserId");

-- CreateIndex
CREATE INDEX "Ahorro_sharedId_idx" ON "public"."Ahorro"("sharedId");

-- CreateIndex
CREATE INDEX "Asociacion_ownerId_partnerUserId_idx" ON "public"."Asociacion"("ownerId", "partnerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "AsociacionOculto_asociacionId_modulo_recordId_sourceUserId_key" ON "public"."AsociacionOculto"("asociacionId", "modulo", "recordId", "sourceUserId");

-- CreateIndex
CREATE INDEX "Gasto_sharedId_idx" ON "public"."Gasto"("sharedId");

-- CreateIndex
CREATE INDEX "Ingreso_sharedId_idx" ON "public"."Ingreso"("sharedId");

-- CreateIndex
CREATE INDEX "Inversion_sharedId_idx" ON "public"."Inversion"("sharedId");

-- AddForeignKey
ALTER TABLE "public"."Asociacion" ADD CONSTRAINT "Asociacion_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsociacionPermiso" ADD CONSTRAINT "AsociacionPermiso_asociacionId_fkey" FOREIGN KEY ("asociacionId") REFERENCES "public"."Asociacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsociacionOculto" ADD CONSTRAINT "AsociacionOculto_asociacionId_fkey" FOREIGN KEY ("asociacionId") REFERENCES "public"."Asociacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsociacionOculto" ADD CONSTRAINT "AsociacionOculto_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoCompartido" ADD CONSTRAINT "MovimientoCompartido_asociacionId_fkey" FOREIGN KEY ("asociacionId") REFERENCES "public"."Asociacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoCompartido" ADD CONSTRAINT "MovimientoCompartido_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
