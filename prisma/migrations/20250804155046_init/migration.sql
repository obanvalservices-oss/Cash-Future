-- CreateTable
CREATE TABLE "public"."Ingreso" (
    "id" SERIAL NOT NULL,
    "fuente" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "frecuencia" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "fijo" BOOLEAN NOT NULL,
    "categoria" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ingreso_pkey" PRIMARY KEY ("id")
);
