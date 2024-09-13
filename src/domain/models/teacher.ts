import { PrismaClient, Professor } from "@prisma/client";

const prisma = new PrismaClient();

export class Teacher {
  static prisma = prisma;

  static async getAllTeachers(): Promise<Professor[]> {
    return this.prisma.professor.findMany();
  }

  static async getTeacherById(id: number): Promise<Professor | null> {
    return this.prisma.professor.findUnique({
      where: { id },
    });
  }

  static async createTeacher(data: Omit<Professor, "id">): Promise<Professor> {
    return this.prisma.professor.create({
      data,
    });
  }

  static async updateTeacher(
    updateData: { id: number } & Partial<{
      nome: string;
      email: string;
      password: string;
    }> &
      Partial<Omit<Teacher, "id">>,
  ): Promise<Professor | null> {
    const { id, nome, email, password, ...restData } = updateData;

    const updatedProfessor = await this.prisma.professor.update({
      where: { id },
      data: restData,
    });

    if (nome || email || password) {
      await this.prisma.usuario.update({
        where: { id: updatedProfessor.usuarioId },
        data: {
          ...(nome && { nome }),
          ...(email && { email }),
          ...(password && { password }),
        },
      });
    }

    return updatedProfessor;
  }

  static async deleteTeacher(id: number): Promise<Teacher> {
    const response = await this.prisma.professor.delete({
      where: { id },
    });

    return response;
  }
}
