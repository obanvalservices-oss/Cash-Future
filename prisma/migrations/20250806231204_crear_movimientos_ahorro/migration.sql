/*
  Warnings:

  - The primary key for the `Ahorro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `aporte` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `fijo` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `frecuencia` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `montoMeta` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `saldo` on the `Ahorro` table. All the data in the column will be lost.
  - The `id` column on the `Ahorro` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Movimiento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoria` to the `Ahorro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monto` to the `Ahorro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objetivo` to the `Ahorro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recurrente` to the `Ahorro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ahorro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Movimiento" DROP CONSTRAINT "Movimiento_ahorroId_fkey";

-- AlterTable
ALTER TABLE "public"."Ahorro" DROP CONSTRAINT "Ahorro_pkey",
DROP COLUMN "aporte",
DROP COLUMN "descripcion",
DROP COLUMN "fijo",
DROP COLUMN "frecuencia",
DROP COLUMN "montoMeta",
DROP COLUMN "saldo",
ADD COLUMN     "categoria" TEXT NOT NULL,
ADD COLUMN     "monto" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "objetivo" TEXT NOT NULL,
ADD COLUMN     "recurrente" BOOLEAN NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Ahorro_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Movimiento";

-- CreateTable
CREATE TABLE "public"."MovimientoAhorro" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DOUBLE PRECISION NOT NULL,
    "motivo" TEXT NOT NULL,
    "fondoId" INTEGER NOT NULL,

    CONSTRAINT "MovimientoAhorro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MovimientoAhorro" ADD CONSTRAINT "MovimientoAhorro_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "public"."Ahorro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
