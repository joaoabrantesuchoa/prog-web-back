import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";
import prisma, { clearDatabase } from "../../prisma/prismaTest";
import { StatusAtividade } from "@prisma/client";

const SECRET_KEY = process.env.JWT || "secret";
let tokenProfessor: string;
let tokenAluno: string;

beforeAll(async () => {
  await clearDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

describe("Activity Routes", () => {
  it("should create an activity", async () => {
    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: "professor@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    const professor = await prisma.professor.create({
      data: {
        usuarioId: professorUser.id,
      },
    });

    const alunoUser = await prisma.usuario.create({
      data: {
        nome: "Aluno João",
        email: "joao@example.com",
        password: "password",
        role: "Aluno",
      },
    });

    await prisma.aluno.create({
      data: {
        usuarioId: alunoUser.id,
      },
    });

    const projeto = await prisma.projeto.create({
      data: {
        titulo: "Projeto de Teste",
        descricao: "Projeto para testar atividades",
        professorId: professor.id,
      },
    });

    tokenProfessor = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    tokenAluno = jwt.sign(
      { id: alunoUser.id, role: alunoUser.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const newActivity = {
      titulo: "Nova Atividade",
      descricao: "Descrição da atividade",
      horasNecessarias: 5,
    };

    const response = await request(app)
      .post(`/atividades/create/${projeto.id}`)
      .set("Authorization", `Bearer ${tokenProfessor}`)
      .send(newActivity);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.titulo).toBe("Nova Atividade");
    expect(response.body.horasNecessarias).toBe(5);
  });

  it("should conclude an activity for a student", async () => {
    await clearDatabase();

    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: "professor@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    const professor = await prisma.professor.create({
      data: {
        usuarioId: professorUser.id,
      },
    });

    const alunoUser = await prisma.usuario.create({
      data: {
        nome: "Aluno João",
        email: "joao@example.com",
        password: "password",
        role: "Aluno",
      },
    });

    const aluno = await prisma.aluno.create({
      data: {
        usuarioId: alunoUser.id,
      },
    });

    const projeto = await prisma.projeto.create({
      data: {
        titulo: "Projeto de Teste",
        descricao: "Projeto para testar atividades",
        professorId: professor.id,
      },
    });

    tokenProfessor = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    tokenAluno = jwt.sign(
      { id: alunoUser.id, role: alunoUser.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const newActivity = {
      titulo: "Nova Atividade",
      descricao: "Descrição da atividade",
      horasNecessarias: 5,
    };

    const createActivityResponse = await request(app)
      .post(`/atividades/create/${projeto.id}`)
      .set("Authorization", `Bearer ${tokenProfessor}`)
      .send(newActivity);

    const atividade = createActivityResponse.body;

    const concludeActivityResponse = await request(app)
      .put(`/atividades/aluno/${aluno.id}/atividade/${atividade.id}/conclude`)
      .set("Authorization", `Bearer ${tokenAluno}`);

    expect(concludeActivityResponse.status).toBe(200);
    expect(concludeActivityResponse.body).toHaveProperty(
      "message",
      "Atividade concluída com sucesso"
    );

    const atividadeConcluida = await prisma.atividadeAluno.findFirst({
      where: { alunoId: aluno.id, atividadeId: atividade.id },
    });

    expect(atividadeConcluida?.status).toBe(StatusAtividade.CONCLUIDA);
  });

  /*it("should return error when concluding a non-existing activity", async () => {
    const response = await request(app)
      .put(`/aluno/${aluno.id}/activities/999/conclude`)
      .set("Authorization", `Bearer ${tokenAluno}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Atividade não encontrada ou já concluída"
    );
  });

  it("should get all pending activities for a student", async () => {
    await prisma.atividade.createMany({
      data: [
        {
          titulo: "Atividade 1",
          descricao: "Descrição",
          horasNecessarias: 3,
          projetoId: projeto.id,
        },
        {
          titulo: "Atividade 2",
          descricao: "Descrição",
          horasNecessarias: 2,
          projetoId: projeto.id,
        },
      ],
    });

    const response = await request(app)
      .get(`/aluno/${aluno.id}/activities/status/PENDENTE`)
      .set("Authorization", `Bearer ${tokenAluno}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("titulo", "Atividade 1");
  });

  it("should return error when getting activities with invalid status", async () => {
    const response = await request(app)
      .get(`/aluno/${aluno.id}/activities/status/INVALID`)
      .set("Authorization", `Bearer ${tokenAluno}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Status inválido");
  });*/
});
