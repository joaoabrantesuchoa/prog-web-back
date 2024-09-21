import { PrismaClient, Atividade, AtividadeAluno } from "@prisma/client";

const prisma = new PrismaClient();

export class Activity {
  static prisma = prisma;

  static async createActivity(data: {
    projetoId: number;
    titulo: string;
    descricao?: string;
    horasNecessarias: number;
  }): Promise<Atividade> {
    return this.prisma.atividade.create({
      data,
    });
  }

  static async assignActivityToStudents(
    projetoId: number,
    atividadeId: number
  ) {
    const students = await prisma.aluno.findMany({
      where: { registros: { some: { projetoId } } },
    });

    const createActivityPromises = students.map((student) =>
      prisma.atividadeAluno.create({
        data: {
          atividadeId: atividadeId,
          alunoId: student.id,
          status: "PENDENTE",
        },
      })
    );

    return await prisma.$transaction(createActivityPromises);
  }

  static async concludeActivity(
    alunoId: number,
    atividadeId: number
  ): Promise<AtividadeAluno | null> {
    const atividadeAluno = await this.prisma.atividadeAluno.findUnique({
      where: {
        alunoId_atividadeId: {
          alunoId,
          atividadeId,
        },
      },
    });

    console.log({ atividadeAluno });

    if (!atividadeAluno) {
      throw new Error("Atividade não encontrada ou não associada ao aluno");
    }

    if (atividadeAluno.status === "CONCLUIDA") {
      throw new Error("Atividade já está concluída");
    }

    return this.prisma.atividadeAluno.update({
      where: {
        id: atividadeAluno.id,
      },
      data: {
        status: "CONCLUIDA",
      },
    });
  }

  static async getActivitiesByStatus(
    alunoId: number,
    projetoId: number,
    status: "PENDENTE" | "CONCLUIDA"
  ) {
    return this.prisma.atividadeAluno.findMany({
      where: {
        alunoId,
        atividade: {
          projetoId,
        },
        status,
      },
      include: {
        atividade: true,
      },
    });
  }
}
