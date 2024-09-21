import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { clearDatabase } from "../../prisma/seed";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT || "secret";
let token: string;

describe("Teacher Routes", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  it("should create a teacher", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const newTeacher = {
      nome: "John Doe",
      email: "john@example.com",
      usuarioId: user.id,
    };

    const response = await request(app)
      .post("/professores")
      .set("Authorization", `Bearer ${token}`)
      .send(newTeacher);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.usuarioId).toBe(user.id);
  });

  it("should get all teachers", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    await prisma.professor.create({
      data: {
        usuarioId: user.id,
      },
    });

    const response = await request(app)
      .get("/professores")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a teacher by ID", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Jane Smith",
        email: "jane.smith@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const teacher = await prisma.professor.create({
      data: {
        usuarioId: user.id,
      },
    });

    const response = await request(app)
      .get(`/professores/${teacher.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(teacher.id);
    expect(response.body.usuarioId).toBe(user.id);
  });

  it("should update a teacher", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Michael Doe",
        email: "michael@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const newTeacher = {
      nome: "John Doe",
      email: "john@example.com",
      usuarioId: user.id,
    };

    let response = await request(app)
      .post("/professores")
      .set("Authorization", `Bearer ${token}`)
      .send(newTeacher);

    const teacherId = response.body.id;

    const updatedTeacherData = {
      nome: "Michael Smith",
      email: "michael.smith@example.com",
    };

    response = await request(app)
      .put(`/professores/${teacherId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedTeacherData);

    expect(response.status).toBe(200);
    expect(response.body.usuarioId).toBe(user.id);

    const updatedUser = await prisma.usuario.findUnique({
      where: { id: user.id },
    });

    expect(updatedUser?.nome).toBe("Michael Smith");
    expect(updatedUser?.email).toBe("michael.smith@example.com");
  });

  it("should delete a teacher", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Lisa Doe",
        email: "lisa@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const teacher = await prisma.professor.create({
      data: {
        usuarioId: user.id,
      },
    });

    const response = await request(app)
      .delete(`/professores/${teacher.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("should return 404 for non-existing teacher on GET by ID", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const response = await request(app)
      .get("/professores/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Professor não encontrado");
  });

  it("should return 400 for invalid data on POST create teacher", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const newTeacher = {
      email: "john@example.com",
      usuarioId: user.id,
    };

    const response = await request(app)
      .post("/professores")
      .set("Authorization", `Bearer ${token}`)
      .send(newTeacher);

    expect(response.status).toBe(400);
    expect(response.body.error[0].code).toBe("invalid_type");
  });

  it("should return 400 for invalid data on PUT update teacher", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const newTeacher = {
      nome: "John Doe",
      email: "john@example.com",
      usuarioId: user.id,
    };

    let response = await request(app)
      .post("/professores")
      .set("Authorization", `Bearer ${token}`)
      .send(newTeacher);

    const teacherId = response.body.id;

    const updatedTeacherData = {
      password: "aaa",
    };

    response = await request(app)
      .put(`/professores/${teacherId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedTeacherData);

    expect(response.status).toBe(400);
    expect(response.body.error[0].code).toBe("too_small");
  });

  it("should return 401 for unauthorized access", async () => {
    const response = await request(app)
      .get("/professores")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.status).toBe(401);
  });

  it("should return 403 for forbidden access", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Admin User",
        email: "admin@example.com",
        password: "adminpassword",
        role: "Aluno",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const response = await request(app)
      .post("/professores")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "John Doe",
        email: "john@example.com",
        usuarioId: user.id,
      });

    expect(response.status).toBe(403);
    expect(response.text).toBe(
      "Forbidden: You do not have the necessary permissions"
    );
  });

  it("should return 204 for successful DELETE with no content", async () => {
    const user = await prisma.usuario.create({
      data: {
        nome: "Lisa Doe",
        email: "lisa@example.com",
        password: "password123",
        role: "Professor",
      },
    });

    token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const teacher = await prisma.professor.create({
      data: {
        usuarioId: user.id,
      },
    });

    const response = await request(app)
      .delete(`/professores/${teacher.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
