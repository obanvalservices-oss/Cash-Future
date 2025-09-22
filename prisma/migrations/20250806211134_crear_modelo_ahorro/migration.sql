/*
  Warnings:

  - The primary key for the `Ahorro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoria` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `monto` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `objetivo` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `recurrente` on the `Ahorro` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ahorro` table. All the data in the column will be lost.
  - Added the required column `aporte` to the `Ahorro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descripcion` to the `Ahorro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fijo` to the `Ahorro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frecuencia` to the `Ahorro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoMeta` to the `Ahorro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ahorro" DROP CONSTRAINT "Ahorro_pkey",
DROP COLUMN "categoria",
DROP COLUMN "monto",
DROP COLUMN "objetivo",
DROP COLUMN "recurrente",
DROP COLUMN "updatedAt",
ADD COLUMN     "aporte" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "descripcion" TEXT NOT NULL,
ADD COLUMN     "fijo" BOOLEAN NOT NULL,
ADD COLUMN     "frecuencia" TEXT NOT NULL,
ADD COLUMN     "montoMeta" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Ahorro_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Ahorro_id_seq";

-- CreateTable
CREATE TABLE "public"."Movimiento" (
    "id" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ahorroId" TEXT NOT NULL,

    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Movimiento" ADD CONSTRAINT "Movimiento_ahorroId_fkey" FOREIGN KEY ("ahorroId") REFERENCES "public"."Ahorro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
