import request from "supertest";
import app from "../server"; // Certifique-se de que esse é o caminho correto para seu arquivo do Express
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const SECRET_KEY = process.env.JWT || "secret";

describe("Authentication and Authorization Routes", () => {
  beforeAll(async () => {
    await prisma.professor.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  afterEach(async () => {
    await prisma.professor.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const newUser = {
        nome: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "Professor",
      };

      const response = await request(app).post("/register").send(newUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe(newUser.email);
    });

    it("should return a validation error for invalid email", async () => {
      const invalidUser = {
        nome: "John Doe",
        email: "invalid-email",
        password: "password123",
        role: "Professor",
      };

      const response = await request(app).post("/register").send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", "VALIDATION_ERROR");
    });
  });

  describe("POST /login", () => {
    it("should login with valid credentials", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);

      await prisma.usuario.create({
        data: {
          nome: "John Doe",
          email: "john@example.com",
          password: hashedPassword,
          role: "Professor",
        },
      });

      const response = await request(app).post("/login").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return an error for invalid credentials", async () => {
      const response = await request(app).post("/login").send({
        email: "invalid@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("code", "INVALID_CREDENTIALS");
    });
  });

  describe("POST /logout", () => {
    it("should logout successfully", async () => {
      const response = await request(app).post("/logout");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Successfully logged out");
    });
  });

  describe("Protected Routes with Role Authorization", () => {
    let token: string;

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = await prisma.usuario.create({
        data: {
          nome: "John Doe",
          email: "john@example.com",
          password: hashedPassword,
          role: "Aluno", // Papel de aluno para testar acesso negado
        },
      });

      token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
        expiresIn: "1h",
      });
    });

    it("should return 403 if user does not have necessary permissions", async () => {
      const response = await request(app)
        .post("/professores") // Rota que requer permissão de "Professor"
        .set("Authorization", `Bearer ${token}`)
        .send({
          nome: "Jane Doe",
          email: "jane@example.com",
        });

      expect(response.status).toBe(403);
      expect(response.text).toBe(
        "Forbidden: You do not have the necessary permissions",
      );
    });

    it("should return 401 if no token is provided", async () => {
      const response = await request(app).post("/professores").send({
        nome: "Jane Doe",
        email: "jane@example.com",
      });

      expect(response.status).toBe(401);
      expect(response.text).toBe("Unauthorized: No token provided");
    });
  });
});
