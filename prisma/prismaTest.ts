import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function clearDatabase() {
  await prisma.$transaction([
    prisma.atividadeAluno.deleteMany(),
    prisma.atividade.deleteMany(),
    prisma.registroHora.deleteMany(),
    prisma.projeto.deleteMany(),
    prisma.aluno.deleteMany(),
    prisma.professor.deleteMany(),
    prisma.usuario.deleteMany(),
  ]);
}

export default prisma;
