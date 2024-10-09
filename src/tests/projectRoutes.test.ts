import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";
import prisma, { clearDatabase } from "../../prisma/prismaTest";

const SECRET_KEY = process.env.JWT || "secret";
let token: string;

beforeAll(async () => {
  await clearDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

describe("Project Routes", () => {
  it("should create a project", async () => {
    await clearDatabase();

    const user = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    const professor = await prisma.professor.create({
      data: {
        usuarioId: user.id,
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const newProject = {
      titulo: "New Project",
      descricao: "A new project for testing",
      professorId: professor.id,
    };

    const response = await request(app)
      .post("/projetos")
      .set("Authorization", `Bearer ${token}`)
      .send(newProject);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.titulo).toBe("New Project");
  });

  it("should add a student to a project", async () => {
    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
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
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Aluno",
      },
    });

    const student = await prisma.aluno.create({
      data: {
        usuarioId: alunoUser.id,
      },
    });

    const project = await prisma.projeto.create({
      data: {
        titulo: "New Project",
        descricao: "New project description",
        professorId: professor.id,
      },
    });

    token = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const response = await request(app)
      .post(`/projetos/${project.id}/students/${student.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.registros).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alunoId: student.id,
          projetoId: project.id,
          horasTrabalhadas: 0,
        }),
      ])
    );
  });

  it("should add and remove a student from a project", async () => {
    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
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
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Aluno",
      },
    });

    const student = await prisma.aluno.create({
      data: {
        usuarioId: alunoUser.id,
      },
    });

    const project = await prisma.projeto.create({
      data: {
        titulo: "New Project",
        descricao: "New project description",
        professorId: professor.id,
      },
    });

    token = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    let response = await request(app)
      .post(`/projetos/${project.id}/students/${student.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.registros).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alunoId: student.id,
          projetoId: project.id,
          horasTrabalhadas: 0,
        }),
      ])
    );

    response = await request(app)
      .delete(`/projetos/${project.id}/students/${student.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.registros).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alunoId: student.id,
          projetoId: project.id,
        }),
      ])
    );
  });

  it("should delete a project", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    const professor = await prisma.professor.create({
      data: {
        usuarioId: user.id,
      },
    });

    const project = await prisma.projeto.create({
      data: {
        titulo: "Project to Delete",
        descricao: "Project that will be deleted",
        professorId: professor.id,
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const response = await request(app)
      .delete(`/projetos/${project.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const deletedProject = await prisma.projeto.findUnique({
      where: { id: project.id },
    });

    expect(deletedProject).toBeNull();
  });

  it("should list all projects", async () => {
    await clearDatabase();

    const user = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    const professor = await prisma.professor.create({
      data: {
        usuarioId: user.id,
      },
    });

    await prisma.projeto.createMany({
      data: [
        {
          titulo: "Project 1",
          descricao: "Description 1",
          professorId: professor.id,
        },
        {
          titulo: "Project 2",
          descricao: "Description 2",
          professorId: professor.id,
        },
      ],
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const response = await request(app)
      .get("/projetos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("titulo", "Project 1");
    expect(response.body[1]).toHaveProperty("titulo", "Project 2");
  });

  it("should get the projects from a user id", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    const professor = await prisma.professor.create({
      data: {
        usuarioId: user.id,
      },
    });

    const project = await prisma.projeto.create({
      data: {
        titulo: "Single Project",
        descricao: "Description of the single project",
        professorId: professor.id,
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const response = await request(app)
      .get(`/projetos/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

      console.log(response.body)

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("id", project.id);
    expect(response.body[0]).toHaveProperty("titulo", "Single Project");
    expect(response.body[0]).toHaveProperty("professorId", professor.id);
  });

  it("should return 404 if student ID does not exist when adding to project", async () => {
    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    const professor = await prisma.professor.create({
      data: {
        usuarioId: professorUser.id,
      },
    });

    const project = await prisma.projeto.create({
      data: {
        titulo: "New Project",
        descricao: "New project description",
        professorId: professor.id,
      },
    });

    token = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Tenta adicionar um estudante com ID inexistente
    const nonExistentStudentId = 999;

    const response = await request(app)
      .post(`/projetos/${project.id}/students/${nonExistentStudentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Estudante não encontrado");
  });

  it("should return 404 if project ID does not exist when adding a student", async () => {
    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    await prisma.professor.create({
      data: {
        usuarioId: professorUser.id,
      },
    });

    const alunoUser = await prisma.usuario.create({
      data: {
        nome: "Aluno João",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Aluno",
      },
    });

    const student = await prisma.aluno.create({
      data: {
        usuarioId: alunoUser.id,
      },
    });

    token = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const nonExistentProjectId = 999;

    const response = await request(app)
      .post(`/projetos/${nonExistentProjectId}/students/${student.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Projeto não encontrado");
  });

  it("should return 400 if student ID is invalid format when adding to project", async () => {
    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    const professor = await prisma.professor.create({
      data: {
        usuarioId: professorUser.id,
      },
    });

    const project = await prisma.projeto.create({
      data: {
        titulo: "New Project",
        descricao: "New project description",
        professorId: professor.id,
      },
    });

    token = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const invalidStudentId = "invalidId";

    const response = await request(app)
      .post(`/projetos/${project.id}/students/${invalidStudentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
  });

  it("should return 404 if student ID does not exist when removing from project", async () => {
    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    const professor = await prisma.professor.create({
      data: {
        usuarioId: professorUser.id,
      },
    });

    const project = await prisma.projeto.create({
      data: {
        titulo: "New Project",
        descricao: "New project description",
        professorId: professor.id,
      },
    });

    token = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Tenta remover um estudante com ID inexistente
    const nonExistentStudentId = 999;

    const response = await request(app)
      .delete(`/projetos/${project.id}/students/${nonExistentStudentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Estudante não encontrado");
  });

  it("should return 404 if project ID does not exist when removing a student", async () => {
    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    const alunoUser = await prisma.usuario.create({
      data: {
        nome: "Aluno João",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Aluno",
      },
    });

    const student = await prisma.aluno.create({
      data: {
        usuarioId: alunoUser.id,
      },
    });

    token = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Tenta remover o estudante de um projeto com ID inexistente
    const nonExistentProjectId = 999;

    const response = await request(app)
      .delete(`/projetos/${nonExistentProjectId}/students/${student.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Projeto não encontrado");
  });

  it("should return 400 if project ID is invalid format when removing a student", async () => {
    const professorUser = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Professor",
      },
    });

    const alunoUser = await prisma.usuario.create({
      data: {
        nome: "Aluno João",
        email: `email${Math.random()}@example.com`,
        password: `${Math.random()}`,
        role: "Aluno",
      },
    });

    const student = await prisma.aluno.create({
      data: {
        usuarioId: alunoUser.id,
      },
    });

    token = jwt.sign(
      { id: professorUser.id, role: professorUser.role },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const invalidProjectId = "invalidId";

    const response = await request(app)
      .delete(`/projetos/${invalidProjectId}/students/${student.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
  });
});
