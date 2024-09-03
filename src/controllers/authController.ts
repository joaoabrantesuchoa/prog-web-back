import { Request, Response } from "express";
import { User } from "../domain/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Student } from "../domain/models/student";
import { Teacher } from "../domain/models/teacher";
import { z } from "zod";

const JWT_SECRET = process.env.JWT || "";

const registerSchema = z.object({
  nome: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(["Aluno", "Professor"], { message: "Função inválida" }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: validation.error.errors.map((err) => err.message).join(", "),
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.createUser({
      ...req.body,
      password: hashedPassword,
    });

    if (user) {
      if (user.role === "Aluno") {
        await Student.createStudent({
          usuarioId: user.id,
        });
      } else {
        await Teacher.createTeacher({
          usuarioId: user.id,
        });
      }
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: `Falha ao registrar usuário: ${error}`,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: validation.error.errors.map((err) => err.message).join(", "),
      });
    }

    const user = await User.getUserByEmail(req.body.email);

    if (!user) {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Email inválido",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        code: "INVALID_CREDENTIALS",
        message: "Email ou senha inválidos",
      });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: `Falha ao realizar login: ${error}`,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: "Successfully logged out" });
};
