/*
  Warnings:

  - You are about to drop the `AtividadeAluno` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AtividadeAluno" DROP CONSTRAINT "AtividadeAluno_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "AtividadeAluno" DROP CONSTRAINT "AtividadeAluno_atividadeId_fkey";

-- DropTable
DROP TABLE "AtividadeAluno";

-- CreateTable
CREATE TABLE "AlunoAtividade" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "atividadeId" INTEGER NOT NULL,
    "status" "StatusAtividade" NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "AlunoAtividade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlunoAtividade_alunoId_atividadeId_key" ON "AlunoAtividade"("alunoId", "atividadeId");

-- AddForeignKey
ALTER TABLE "AlunoAtividade" ADD CONSTRAINT "AlunoAtividade_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlunoAtividade" ADD CONSTRAINT "AlunoAtividade_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "Atividade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
