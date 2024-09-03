-- CreateEnum
CREATE TYPE "StatusAtividade" AS ENUM ('PENDENTE', 'CONCLUIDA');

-- AlterTable
ALTER TABLE "AtividadeAluno" ADD COLUMN     "status" "StatusAtividade" NOT NULL DEFAULT 'PENDENTE';
