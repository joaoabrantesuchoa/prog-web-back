import { PrismaClient, Aluno } from "@prisma/client";

const prisma = new PrismaClient();

export class Student {
  static prisma = prisma;

  static async getAllStudents(): Promise<Aluno[]> {
    return this.prisma.aluno.findMany();
  }

  static async getStudentById(id: number): Promise<Aluno | null> {
    return this.prisma.aluno.findUnique({
      where: { id },
    });
  }

  static async createStudent(data: Omit<Aluno, "id">): Promise<Aluno> {
    return this.prisma.aluno.create({
      data,
    });
  }

  static async updateStudent(
    updateData: { id: number } & Partial<{
      nome: string;
      email: string;
      password: string;
    }> &
      Partial<Omit<Student, "id">>,
  ): Promise<Aluno | null> {
    const { id, nome, email, password, ...restData } = updateData;

    const updatedAluno = await this.prisma.aluno.update({
      where: { id },
      data: restData,
    });

    if (nome || email || password) {
      await this.prisma.usuario.update({
        where: { id: updatedAluno.usuarioId },
        data: {
          ...(nome && { nome }),
          ...(email && { email }),
          ...(password && { password }),
        },
      });
    }

    return updatedAluno;
  }

  static async deleteStudent(id: number): Promise<Student> {
    const response = await this.prisma.aluno.delete({
      where: { id },
    });

    return response;
  }
}
