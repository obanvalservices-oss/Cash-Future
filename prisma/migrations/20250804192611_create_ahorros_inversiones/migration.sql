-- CreateTable
CREATE TABLE "public"."Ahorro" (
    "id" SERIAL NOT NULL,
    "objetivo" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "categoria" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "recurrente" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ahorro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inversion" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "plataforma" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "riesgoAlto" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inversion_pkey" PRIMARY KEY ("id")
);
