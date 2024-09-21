import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function clearDatabase() {
  await prisma.atividadeAluno.deleteMany({})
  await prisma.registroHora.deleteMany({})
  await prisma.atividade.deleteMany({})
  await prisma.projeto.deleteMany({})
  await prisma.aluno.deleteMany({})
  await prisma.professor.deleteMany({})
  await prisma.usuario.deleteMany({})
}
