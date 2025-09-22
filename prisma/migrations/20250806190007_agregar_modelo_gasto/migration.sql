/*
  Warnings:

  - You are about to drop the column `categoria` on the `Gasto` table. All the data in the column will be lost.
  - Added the required column `categoriaId` to the `Gasto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Gasto" DROP COLUMN "categoria",
ADD COLUMN     "categoriaId" TEXT NOT NULL,
ALTER COLUMN "frecuencia" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Gasto" ADD CONSTRAINT "Gasto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
