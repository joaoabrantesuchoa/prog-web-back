import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";
import prisma, { clearDatabase } from "../../prisma/prismaTest";
import { StatusAtividade } from "@prisma/client";
import { Project } from "../domain/models/project";

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

    await Project.addStudentToProject(projeto.id, aluno.id);

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

  it("should get all pending activities for a student", async () => {
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

    await Project.addStudentToProject(projeto.id, aluno.id);

    const atividades = [
      { titulo: "Atividade 1", descricao: "Descrição", horasNecessarias: 3 },
      { titulo: "Atividade 2", descricao: "Descrição", horasNecessarias: 2 },
    ];

    for (const atividade of atividades) {
      await request(app)
        .post(`/atividades/create/${projeto.id}`)
        .set("Authorization", `Bearer ${tokenProfessor}`)
        .send(atividade);
    }

    const response = await request(app)
      .get(
        `/atividades/aluno/${aluno.id}/projeto/${projeto.id}/atividade/status/CONCLUIDA`
      )
      .set("Authorization", `Bearer ${tokenAluno}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("should get one pending and one completed activity for a student", async () => {
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

    await Project.addStudentToProject(projeto.id, aluno.id);

    // Criar atividades
    const atividades = [
      { titulo: "Atividade 1", descricao: "Descrição", horasNecessarias: 3 },
      { titulo: "Atividade 2", descricao: "Descrição", horasNecessarias: 2 },
    ];

    const atividade1Response = await request(app)
      .post(`/atividades/create/${projeto.id}`)
      .set("Authorization", `Bearer ${tokenProfessor}`)
      .send(atividades[0]);

    await request(app)
      .post(`/atividades/create/${projeto.id}`)
      .set("Authorization", `Bearer ${tokenProfessor}`)
      .send(atividades[1]);

    const atividade1 = atividade1Response.body;

    // Concluir a primeira atividade
    await request(app)
      .put(`/atividades/aluno/${aluno.id}/atividade/${atividade1.id}/conclude`)
      .set("Authorization", `Bearer ${tokenAluno}`);

    // Verificar atividades pendentes
    const responsePendente = await request(app)
      .get(
        `/atividades/aluno/${aluno.id}/projeto/${projeto.id}/atividade/status/PENDENTE`
      )
      .set("Authorization", `Bearer ${tokenAluno}`);

    expect(responsePendente.status).toBe(200);
    expect(responsePendente.body).toHaveLength(1);
    expect(responsePendente.body[0].atividade.titulo).toBe("Atividade 2");

    // Verificar atividades concluídas
    const responseConcluida = await request(app)
      .get(
        `/atividades/aluno/${aluno.id}/projeto/${projeto.id}/atividade/status/CONCLUIDA`
      )
      .set("Authorization", `Bearer ${tokenAluno}`);

    expect(responseConcluida.status).toBe(200);
    expect(responseConcluida.body).toHaveLength(1);
    expect(responseConcluida.body[0].atividade.titulo).toBe("Atividade 1");
  });

  it("should get two pending activities for a student", async () => {
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

    await Project.addStudentToProject(projeto.id, aluno.id);

    const atividades = [
      { titulo: "Atividade 1", descricao: "Descrição", horasNecessarias: 3 },
      { titulo: "Atividade 2", descricao: "Descrição", horasNecessarias: 2 },
    ];

    for (const atividade of atividades) {
      await request(app)
        .post(`/atividades/create/${projeto.id}`)
        .set("Authorization", `Bearer ${tokenProfessor}`)
        .send(atividade);
    }

    const response = await request(app)
      .get(
        `/atividades/aluno/${aluno.id}/projeto/${projeto.id}/atividade/status/PENDENTE`
      )
      .set("Authorization", `Bearer ${tokenAluno}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].atividade.titulo).toBe("Atividade 1");
    expect(response.body[1].atividade.titulo).toBe("Atividade 2");
  });

  it("should return error when getting activities with invalid status", async () => {
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
  
    await Project.addStudentToProject(projeto.id, aluno.id);
  
    tokenAluno = jwt.sign(
      { id: alunoUser.id, role: alunoUser.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
  
    const response = await request(app)
      .get(
        `/atividades/aluno/${aluno.id}/projeto/${projeto.id}/atividade/status/INVALID`
      )
      .set("Authorization", `Bearer ${tokenAluno}`);
  
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Status inválido");
  });
  
});
