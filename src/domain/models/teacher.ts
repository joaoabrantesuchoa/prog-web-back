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
    updateData: { id: number } & Partial<Omit<Teacher, "id">>
  ): Promise<Professor | null> {
    const { id, ...data } = updateData;
    return this.prisma.professor.update({
      where: { id },
      data,
    });
  }

  static async deleteTeacher(id: number): Promise<boolean> {
    try {
      await this.prisma.professor.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
