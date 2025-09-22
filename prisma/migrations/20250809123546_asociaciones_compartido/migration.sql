-- CreateEnum
CREATE TYPE "public"."RelacionTipo" AS ENUM ('PAREJA', 'AMIGO', 'SOCIO', 'FAMILIAR', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."ModuloTipo" AS ENUM ('INGRESOS', 'GASTOS', 'AHORROS', 'INVERSIONES');

-- CreateEnum
CREATE TYPE "public"."VisibilidadNivel" AS ENUM ('NADA', 'PARCIAL', 'TOTAL');

-- CreateTable
CREATE TABLE "public"."Asociacion" (
    "id" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "partnerUserId" INTEGER,
    "partnerEmail" TEXT NOT NULL,
    "partnerDisplayName" TEXT NOT NULL,
    "relacion" "public"."RelacionTipo" NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asociacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AsociacionPermiso" (
    "id" TEXT NOT NULL,
    "asociacionId" TEXT NOT NULL,
    "modulo" "public"."ModuloTipo" NOT NULL,
    "visibilidad" "public"."VisibilidadNivel" NOT NULL,

    CONSTRAINT "AsociacionPermiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AsociacionOculto" (
    "id" TEXT NOT NULL,
    "asociacionId" TEXT NOT NULL,
    "modulo" "public"."ModuloTipo" NOT NULL,
    "recordId" TEXT NOT NULL,

    CONSTRAINT "AsociacionOculto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Asociacion_ownerId_idx" ON "public"."Asociacion"("ownerId");

-- CreateIndex
CREATE INDEX "Asociacion_partnerUserId_idx" ON "public"."Asociacion"("partnerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Asociacion_ownerId_partnerEmail_key" ON "public"."Asociacion"("ownerId", "partnerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "AsociacionPermiso_asociacionId_modulo_key" ON "public"."AsociacionPermiso"("asociacionId", "modulo");

-- CreateIndex
CREATE INDEX "AsociacionOculto_asociacionId_modulo_idx" ON "public"."AsociacionOculto"("asociacionId", "modulo");

-- AddForeignKey
ALTER TABLE "public"."AsociacionPermiso" ADD CONSTRAINT "AsociacionPermiso_asociacionId_fkey" FOREIGN KEY ("asociacionId") REFERENCES "public"."Asociacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsociacionOculto" ADD CONSTRAINT "AsociacionOculto_asociacionId_fkey" FOREIGN KEY ("asociacionId") REFERENCES "public"."Asociacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
