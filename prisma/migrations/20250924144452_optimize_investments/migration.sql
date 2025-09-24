/*
  Warnings:

  - You are about to drop the column `categoria` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `colorTag` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `isShared` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `monto` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `recurrente` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `sharedId` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `FondoInversion` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `FondoInversion` table. All the data in the column will be lost.
  - You are about to drop the column `monto` on the `FondoInversion` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `Inversion` table. All the data in the column will be lost.
  - You are about to drop the column `colorTag` on the `Inversion` table. All the data in the column will be lost.
  - You are about to drop the column `isShared` on the `Inversion` table. All the data in the column will be lost.
  - You are about to drop the column `precioActual` on the `Inversion` table. All the data in the column will be lost.
  - You are about to drop the column `sharedId` on the `Inversion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,nombre]` on the table `FondoInversion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticker` to the `Inversion` table without a default value. This is not possible if the table is not empty.
  - Made the column `cantidad` on table `Inversion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `precioCompra` on table `Inversion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."AsociacionOculto" DROP CONSTRAINT "AsociacionOculto_asociacionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AsociacionPermiso" DROP CONSTRAINT "AsociacionPermiso_asociacionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inversion" DROP CONSTRAINT "Inversion_fondoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovimientoAhorro" DROP CONSTRAINT "MovimientoAhorro_ahorroId_fkey";

-- DropIndex
DROP INDEX "public"."Ahorro_sharedId_idx";

-- DropIndex
DROP INDEX "public"."Asociacion_ownerId_idx";

-- DropIndex
DROP INDEX "public"."Asociacion_ownerId_partnerUserId_idx";

-- DropIndex
DROP INDEX "public"."Asociacion_partnerUserId_idx";

-- DropIndex
DROP INDEX "public"."Inversion_sharedId_idx";

-- DropIndex
DROP INDEX "public"."MovimientoCompartido_createdByUserId_idx";

-- AlterTable
ALTER TABLE "public"."Ahorro" DROP COLUMN "categoria",
DROP COLUMN "colorTag",
DROP COLUMN "descripcion",
DROP COLUMN "fecha",
DROP COLUMN "isShared",
DROP COLUMN "monto",
DROP COLUMN "recurrente",
DROP COLUMN "sharedId",
ADD COLUMN     "aporteFijo" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fijo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "frecuencia" TEXT,
ADD COLUMN     "meta" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "objetivo" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."FondoInversion" DROP COLUMN "descripcion",
DROP COLUMN "fecha",
DROP COLUMN "monto";

-- AlterTable
ALTER TABLE "public"."Inversion" DROP COLUMN "categoria",
DROP COLUMN "colorTag",
DROP COLUMN "isShared",
DROP COLUMN "precioActual",
DROP COLUMN "sharedId",
ADD COLUMN     "ticker" TEXT NOT NULL,
ALTER COLUMN "cantidad" SET NOT NULL,
ALTER COLUMN "precioCompra" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserSettings" ALTER COLUMN "weekEndDay" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "FondoInversion_userId_nombre_key" ON "public"."FondoInversion"("userId", "nombre");

-- AddForeignKey
ALTER TABLE "public"."Inversion" ADD CONSTRAINT "Inversion_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "public"."FondoInversion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoAhorro" ADD CONSTRAINT "MovimientoAhorro_ahorroId_fkey" FOREIGN KEY ("ahorroId") REFERENCES "public"."Ahorro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsociacionPermiso" ADD CONSTRAINT "AsociacionPermiso_asociacionId_fkey" FOREIGN KEY ("asociacionId") REFERENCES "public"."Asociacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsociacionOculto" ADD CONSTRAINT "AsociacionOculto_asociacionId_fkey" FOREIGN KEY ("asociacionId") REFERENCES "public"."Asociacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
