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
    updateData: { id: number } & Partial<Omit<Aluno, "id">>,
  ): Promise<Aluno | null> {
    const { id, ...data } = updateData;
    return this.prisma.aluno.update({
      where: { id },
      data,
    });
  }

  static async deleteStudent(id: number): Promise<Student> {
    const response = await this.prisma.aluno.delete({
      where: { id },
    });

    return response;
  }
}
