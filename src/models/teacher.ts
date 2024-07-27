import { PrismaClient, Professor } from "@prisma/client";

const prisma = new PrismaClient();

export class Teacher {
  private prisma = prisma;

  async getAllTeachers(): Promise<Professor[]> {
    return this.prisma.professor.findMany();
  }

  async getTeacherById(id: number): Promise<Professor | null> {
    return this.prisma.professor.findUnique({
      where: { id },
    });
  }

  async createTeacher(data: Omit<Professor, "id">): Promise<Professor> {
    return this.prisma.professor.create({
      data,
    });
  }

  async updateTeacher(
    id: number,
    data: Partial<Omit<Professor, "id">>
  ): Promise<Professor | null> {
    return this.prisma.professor.update({
      where: { id },
      data,
    });
  }

  async deleteTeacher(id: number): Promise<void> {
    await this.prisma.professor.delete({
      where: { id },
    });
  }
}
