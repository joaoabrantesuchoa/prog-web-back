import { PrismaClient, Projeto, Role } from "@prisma/client";

const prisma = new PrismaClient();

export class Project {
  static prisma = prisma;

  static async getAllProjects(): Promise<Projeto[]> {
    return this.prisma.projeto.findMany();
  }

  static async getProjectById(id: number): Promise<Projeto | null> {
    return this.prisma.projeto.findUnique({
      where: { id },
    });
  }

  static async getProjectsByUserId(userId: number): Promise<Projeto[]> {
    // Primeiro, obtemos o usuário e verificamos o papel dele
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        Professor: true,
        Aluno: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === Role.Professor && user.Professor) {
      return this.prisma.projeto.findMany({
        where: { professorId: user.Professor.id },
        include: {
          professor: true,
          Atividade: true,
          registros: true,
        },
      });
    } else if (user.role === Role.Aluno && user.Aluno) {
      return this.prisma.projeto.findMany({
        where: {
          registros: {
            some: {
              alunoId: user.Aluno.id,
            },
          },
        },
        include: {
          professor: true,
          Atividade: true,
          registros: true,
        },
      });
    } else {
      return [];
    }
  }

  static async createProject(data: Omit<Projeto, "id">): Promise<Projeto> {
    return this.prisma.projeto.create({
      data,
    });
  }

  static async updateProject(
    id: number,
    data: Partial<Omit<Projeto, "id">>,
  ): Promise<Projeto | null> {
    return this.prisma.projeto.update({
      where: { id },
      data,
    });
  }

  static async deleteProject(id: number): Promise<Project> {
    const response = await this.prisma.projeto.delete({
      where: { id },
    });

    return response;
  }

  static async addStudentToProject(
    projectId: number,
    studentId: number,
  ): Promise<Projeto | null> {
    await this.prisma.registroHora.create({
      data: {
        alunoId: studentId,
        projetoId: projectId,
        horasTrabalhadas: 0,
      },
    });

    return this.prisma.projeto.findUnique({
      where: { id: projectId },
      include: {
        registros: true,
      },
    });
  }

  static async removeStudentFromProject(
    projectId: number,
    studentId: number,
  ): Promise<Projeto | null> {
    await this.prisma.registroHora.deleteMany({
      where: {
        alunoId: studentId,
        projetoId: projectId,
      },
    });

    return this.prisma.projeto.findUnique({
      where: { id: projectId },
      include: {
        registros: true,
      },
    });
  }
}
