/*
  Warnings:

  - You are about to drop the `AlunoAtividade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlunoAtividade" DROP CONSTRAINT "AlunoAtividade_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "AlunoAtividade" DROP CONSTRAINT "AlunoAtividade_atividadeId_fkey";

-- DropTable
DROP TABLE "AlunoAtividade";

-- CreateTable
CREATE TABLE "AtividadeAluno" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "atividadeId" INTEGER NOT NULL,
    "status" "StatusAtividade" NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "AtividadeAluno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AtividadeAluno_alunoId_atividadeId_key" ON "AtividadeAluno"("alunoId", "atividadeId");

-- AddForeignKey
ALTER TABLE "AtividadeAluno" ADD CONSTRAINT "AtividadeAluno_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtividadeAluno" ADD CONSTRAINT "AtividadeAluno_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "Atividade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
