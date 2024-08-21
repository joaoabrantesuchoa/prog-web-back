import { PrismaClient, Projeto } from "@prisma/client";

const prisma = new PrismaClient();

export class Project {
  private prisma = prisma;

  async getAllProjects(): Promise<Projeto[]> {
    return this.prisma.projeto.findMany();
  }

  async getProjectById(id: number): Promise<Projeto | null> {
    return this.prisma.projeto.findUnique({
      where: { id },
    });
  }

  async createProject(data: Omit<Projeto, "id">): Promise<Projeto> {
    return this.prisma.projeto.create({
      data,
    });
  }

  async updateProject(
    id: number,
    data: Partial<Omit<Projeto, "id">>,
  ): Promise<Projeto | null> {
    return this.prisma.projeto.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: number): Promise<void> {
    await this.prisma.projeto.delete({
      where: { id },
    });
  }
}
