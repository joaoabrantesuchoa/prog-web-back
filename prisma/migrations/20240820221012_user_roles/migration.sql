/*
  Warnings:

  - You are about to drop the column `email` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Professor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `Aluno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioId]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Professor', 'Aluno');

-- DropIndex
DROP INDEX "Aluno_email_key";

-- DropIndex
DROP INDEX "Professor_email_key";

-- AlterTable
ALTER TABLE "Aluno" DROP COLUMN "email",
DROP COLUMN "nome",
ADD COLUMN     "usuarioId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Professor" DROP COLUMN "email",
DROP COLUMN "nome",
ADD COLUMN     "usuarioId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_usuarioId_key" ON "Aluno"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_usuarioId_key" ON "Professor"("usuarioId");

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
