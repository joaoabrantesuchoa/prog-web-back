-- DropForeignKey
ALTER TABLE "Atividade" DROP CONSTRAINT "Atividade_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "AtividadeAluno" DROP CONSTRAINT "AtividadeAluno_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "AtividadeAluno" DROP CONSTRAINT "AtividadeAluno_atividadeId_fkey";

-- AddForeignKey
ALTER TABLE "Atividade" ADD CONSTRAINT "Atividade_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtividadeAluno" ADD CONSTRAINT "AtividadeAluno_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "Atividade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtividadeAluno" ADD CONSTRAINT "AtividadeAluno_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
