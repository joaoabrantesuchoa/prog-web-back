import { Aluno } from "@prisma/client";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../server";

describe("/projetos", () => {
  it("deve criar um estudante com sucesso", async () => {
    const student: Aluno = {
      nome: "Test Student",
      email: "email@email.com",
      id: 0,
    };

    const response = await request(app).post("/projetos").send(student);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        nome: student.nome,
        email: student.email,
      }),
    );
  });
});
