/*
  Warnings:

  - You are about to drop the column `sourceUserId` on the `AsociacionOculto` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Ahorro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `FondoInversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Gasto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Ingreso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Inversion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."AsociacionEstado" ADD VALUE 'REVOCADA';

-- DropForeignKey
ALTER TABLE "public"."AsociacionOculto" DROP CONSTRAINT "AsociacionOculto_asociacionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AsociacionOculto" DROP CONSTRAINT "AsociacionOculto_sourceUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AsociacionPermiso" DROP CONSTRAINT "AsociacionPermiso_asociacionId_fkey";

-- DropIndex
DROP INDEX "public"."AsociacionOculto_asociacionId_modulo_recordId_sourceUserId_key";

-- AlterTable
ALTER TABLE "public"."Ahorro" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."AsociacionOculto" DROP COLUMN "sourceUserId";

-- AlterTable
ALTER TABLE "public"."FondoInversion" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Gasto" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Ingreso" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Inversion" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Ingreso" ADD CONSTRAINT "Ingreso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gasto" ADD CONSTRAINT "Gasto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ahorro" ADD CONSTRAINT "Ahorro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FondoInversion" ADD CONSTRAINT "FondoInversion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inversion" ADD CONSTRAINT "Inversion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsociacionPermiso" ADD CONSTRAINT "AsociacionPermiso_asociacionId_fkey" FOREIGN KEY ("asociacionId") REFERENCES "public"."Asociacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsociacionOculto" ADD CONSTRAINT "AsociacionOculto_asociacionId_fkey" FOREIGN KEY ("asociacionId") REFERENCES "public"."Asociacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
