-- CreateTable
CREATE TABLE "public"."Gasto" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "categoria" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "fijo" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);
