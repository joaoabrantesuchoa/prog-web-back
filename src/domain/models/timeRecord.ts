import { PrismaClient, RegistroHora } from "@prisma/client";

const prisma = new PrismaClient();

export class TimeRecord {
  private prisma = prisma;

  async getAllTimeRecords(): Promise<RegistroHora[]> {
    return this.prisma.registroHora.findMany();
  }

  async getTimeRecordById(id: number): Promise<RegistroHora | null> {
    return this.prisma.registroHora.findUnique({
      where: { id },
    });
  }

  async createTimeRecord(
    data: Omit<RegistroHora, "id">,
  ): Promise<RegistroHora> {
    return this.prisma.registroHora.create({
      data,
    });
  }

  async updateTimeRecord(
    id: number,
    data: Partial<Omit<RegistroHora, "id">>,
  ): Promise<RegistroHora | null> {
    return this.prisma.registroHora.update({
      where: { id },
      data,
    });
  }

  async deleteTimeRecord(id: number): Promise<void> {
    await this.prisma.registroHora.delete({
      where: { id },
    });
  }
}
