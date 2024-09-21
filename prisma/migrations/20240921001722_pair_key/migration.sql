/*
  Warnings:

  - A unique constraint covering the columns `[alunoId,atividadeId]` on the table `AtividadeAluno` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AtividadeAluno_alunoId_atividadeId_key" ON "AtividadeAluno"("alunoId", "atividadeId");
