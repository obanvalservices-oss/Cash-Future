-- CreateEnum
CREATE TYPE "public"."PaySource" AS ENUM ('INCOME', 'SAVINGS');

-- CreateTable
CREATE TABLE "public"."Debt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "principal" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "dueDay" INTEGER,
    "frequency" TEXT,
    "installmentAmount" DOUBLE PRECISION,
    "initialDownPayment" DOUBLE PRECISION DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Debt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DebtPayment" (
    "id" SERIAL NOT NULL,
    "debtId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "paySource" "public"."PaySource" NOT NULL DEFAULT 'INCOME',
    "ahorroId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DebtPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Debt" ADD CONSTRAINT "Debt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DebtPayment" ADD CONSTRAINT "DebtPayment_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "public"."Debt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DebtPayment" ADD CONSTRAINT "DebtPayment_ahorroId_fkey" FOREIGN KEY ("ahorroId") REFERENCES "public"."Ahorro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
