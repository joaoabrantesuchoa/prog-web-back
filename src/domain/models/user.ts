import { PrismaClient, Usuario } from "@prisma/client";

const prisma = new PrismaClient();

export class User {
  static prisma = prisma;

  static async getAllUsers(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  static async getUserById(id: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  static async getUserByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  static async createUser(data: Omit<Usuario, "id">): Promise<Usuario> {
    return this.prisma.usuario.create({
      data,
    });
  }

  static async updateUser(
    id: number,
    data: Partial<Omit<Usuario, "id">>
  ): Promise<Usuario | null> {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: number): Promise<void> {
    await this.prisma.usuario.delete({
      where: { id },
    });
  }
}
