import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT || "secret";
let token: string;

describe("Project Routes", () => {
  beforeAll(async () => {
    await prisma.projeto.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  afterEach(async () => {
    await prisma.projeto.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a project", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: "professor@example.com",
        password: "password123",
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

  it("should update a project", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: "professor2@example.com",
        password: "password123",
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
        titulo: "Old Project",
        descricao: "Old description",
        professorId: professor.id,
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const updatedProject = {
      titulo: "Updated Project",
      descricao: "Updated description",
    };

    const response = await request(app)
      .put(`/projetos/${project.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProject);

    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe("Updated Project");
    expect(response.body.descricao).toBe("Updated description");
  });

  it("should delete a project", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: "professor3@example.com",
        password: "password123",
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

    console.log({response})

    expect(response.status).toBe(204);

    const deletedProject = await prisma.projeto.findUnique({
      where: { id: project.id },
    });

    expect(deletedProject).toBeNull();
  });

  it("should list all projects", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: "professor4@example.com",
        password: "password123",
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

  it("should get a project by ID", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Professor John",
        email: "professor5@example.com",
        password: "password123",
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
      .get(`/projetos/${project.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", project.id);
    expect(response.body).toHaveProperty("titulo", "Single Project");
  });
});
