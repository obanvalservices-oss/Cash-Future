/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Inversion` table. All the data in the column will be lost.
  - You are about to drop the column `monto` on the `Inversion` table. All the data in the column will be lost.
  - You are about to drop the column `plataforma` on the `Inversion` table. All the data in the column will be lost.
  - You are about to drop the column `riesgoAlto` on the `Inversion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Inversion` table. All the data in the column will be lost.
  - Added the required column `activo` to the `Inversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoria` to the `Inversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fondoId` to the `Inversion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ahorro" ALTER COLUMN "categoria" SET DEFAULT '',
ALTER COLUMN "monto" SET DEFAULT 0,
ALTER COLUMN "objetivo" SET DEFAULT '',
ALTER COLUMN "recurrente" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Inversion" DROP COLUMN "createdAt",
DROP COLUMN "monto",
DROP COLUMN "plataforma",
DROP COLUMN "riesgoAlto",
DROP COLUMN "updatedAt",
ADD COLUMN     "activo" TEXT NOT NULL,
ADD COLUMN     "cantidad" DOUBLE PRECISION,
ADD COLUMN     "categoria" TEXT NOT NULL,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "fondoId" INTEGER NOT NULL,
ADD COLUMN     "fuentePrecio" TEXT,
ADD COLUMN     "precioActual" DOUBLE PRECISION,
ADD COLUMN     "precioCompra" DOUBLE PRECISION,
ALTER COLUMN "fecha" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."FondoInversion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,

    CONSTRAINT "FondoInversion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Inversion" ADD CONSTRAINT "Inversion_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "public"."FondoInversion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
