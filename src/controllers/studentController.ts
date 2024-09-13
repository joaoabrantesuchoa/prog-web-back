import { Request, Response } from "express";
import { Student } from "../domain/models/student";
import { z } from "zod";
import { User } from "../domain/models/user";

const studentSchema = z.object({
  nome: z.string().min(1, { message: "O nome é obrigatório" }),
  email: z
    .string()
    .email({ message: "Formato de email inválido" })
    .min(1, { message: "O email é obrigatório" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(["Aluno"]).default("Aluno"),
});

const studentIdSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: "ID do estudante inválido" }),
});

export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await Student.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar estudantes: ${error}` });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const validation = studentIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.errors[0].message });
    }

    const studentId = Number(req.params.id);
    const student = await Student.getStudentById(studentId);

    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: "Estudante não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar estudante: ${error}` });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const validation = studentSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.errors[0].message });
    }

    const user = await User.createUser({
      nome: validation.data.nome,
      email: validation.data.email,
      password: validation.data.password,
      role: validation.data.role,
    });

    if (user) {
      const student = await Student.createStudent({
        usuarioId: user.id,
      });

      res.status(201).json(student);
    } else {
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar estudante: ${error}` });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const validation = studentIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.errors[0].message });
    }

    const updateValidation = studentSchema.partial().safeParse(req.body);
    if (!updateValidation.success) {
      return res
        .status(400)
        .json({ error: updateValidation.error.errors[0].message });
    }

    const updated = await Student.updateStudent({
      id: Number(req.params.id),
      ...updateValidation.data,
    });

    if (updated) {
      const updatedStudent = await Student.getStudentById(
        Number(req.params.id),
      );
      res.json(updatedStudent);
    } else {
      res.status(404).json({ error: "Estudante não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar estudante: ${error}` });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const validation = studentIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.errors[0].message });
    }

    const studentId = Number(req.params.id);
    const deleted = await Student.deleteStudent(studentId);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Estudante não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: `Erro ao deletar estudante: ${error}` });
  }
};
