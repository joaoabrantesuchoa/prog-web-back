import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT || "secret";
let token: string;

describe("Student Routes", () => {
  beforeAll(async () => {
    await prisma.aluno.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  afterEach(async () => {
    await prisma.aluno.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a student", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "John Doe",
        email: "john.student@example.com",
        password: "password123",
        role: "Aluno",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const newStudent = {
      nome: "John Doe",
      email: "john.student@example.com",
      usuarioId: user.id,
    };

    const response = await request(app)
      .post("/alunos")
      .set("Authorization", `Bearer ${token}`)
      .send(newStudent);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.usuarioId).toBe(user.id);
  });

  it("should get all students", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Jane Doe",
        email: "jane.student@example.com",
        password: "password123",
        role: "Aluno",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    await prisma.aluno.create({
      data: {
        usuarioId: user.id,
      },
    });

    const response = await request(app)
      .get("/alunos")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a student by ID", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Jane Smith",
        email: "jane.smith@student.com",
        password: "password123",
        role: "Aluno",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const student = await prisma.aluno.create({
      data: {
        usuarioId: user.id,
      },
    });

    const response = await request(app)
      .get(`/alunos/${student.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(student.id);
    expect(response.body.usuarioId).toBe(user.id);
  });

  it("should update a student", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Michael Doe",
        email: "michael@student.com",
        password: "password123",
        role: "Aluno",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const newStudent = {
      nome: "Michael Doe",
      email: "michael@student.com",
      usuarioId: user.id,
    };

    let response = await request(app)
      .post("/alunos")
      .set("Authorization", `Bearer ${token}`)
      .send(newStudent);

    const studentId = response.body.id;

    const updatedStudentData = {
      nome: "Michael Smith",
      email: "michael.smith@student.com",
    };

    response = await request(app)
      .put(`/alunos/${studentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedStudentData);

    expect(response.status).toBe(200);
    expect(response.body.usuarioId).toBe(user.id);

    const updatedUser = await prisma.usuario.findUnique({
      where: { id: user.id },
    });

    expect(updatedUser?.nome).toBe("Michael Smith");
    expect(updatedUser?.email).toBe("michael.smith@student.com");
  });

  it("should delete a student", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Lisa Doe",
        email: "lisa@student.com",
        password: "password123",
        role: "Aluno",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const student = await prisma.aluno.create({
      data: {
        usuarioId: user.id,
      },
    });

    const response = await request(app)
      .delete(`/alunos/${student.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("should return 404 for non-existing student on GET by ID", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "John Doe",
        email: "john@student.com",
        password: "password123",
        role: "Aluno",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const response = await request(app)
      .get("/alunos/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Estudante não encontrado");
  });

  it("should return 400 for invalid data on POST create student", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "John Doe",
        email: "john@student.com",
        password: "password123",
        role: "Aluno",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const newStudent = {
      email: "john@student.com",
      usuarioId: user.id,
    };

    const response = await request(app)
      .post("/alunos")
      .set("Authorization", `Bearer ${token}`)
      .send(newStudent);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Required");
  });

  it("should return 400 for invalid data on PUT update student", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "John Doe",
        email: "john@student.com",
        password: "password123",
        role: "Aluno",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const newStudent = {
      nome: "John Doe",
      email: "john@student.com",
      usuarioId: user.id,
    };

    let response = await request(app)
      .post("/alunos")
      .set("Authorization", `Bearer ${token}`)
      .send(newStudent);

    const studentId = response.body.id;

    const updatedStudentData = {
      password: "abc",
    };

    response = await request(app)
      .put(`/alunos/${studentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedStudentData);

    expect(response.status).toBe(400);
    expect(response.body.error[0].code).toBe("too_small");
  });

  it("should return 401 for unauthorized access", async () => {
    const response = await request(app)
      .get("/alunos")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.status).toBe(401);
  });

  it("should return 403 for forbidden access", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Admin User",
        email: "admin@student.com",
        password: "adminpassword",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const response = await request(app)
      .post("/alunos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "John Doe",
        email: "john@student.com",
        usuarioId: user.id,
      });

    expect(response.status).toBe(403);
    expect(response.text).toBe(
      "Forbidden: You do not have the necessary permissions"
    );
  });
});
