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
  usuarioId: z.number(),
});

const updateStudentSchema = z.object({
  nome: z.string().min(1, { message: "Nome é obrigatório" }).optional(),
  email: z.string().email({ message: "E-mail inválido" }).optional(),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .optional(),
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

    const { usuarioId } = validation.data;

    const user = await User.getUserById(usuarioId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (user.role !== "Aluno") {
      return res
        .status(400)
        .json({ error: "O usuário não tem o papel de Aluno" });
    }
    const student = await Student.createStudent({ usuarioId });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar estudante: ${error}` });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const validation = updateStudentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const updated = await Student.updateStudent({
      id: Number(req.params.id),
      ...validation.data,
    });

    if (updated) {
      const updatedStudent = await Student.getStudentByIdOrFail(
        Number(req.params.id)
      );

      const updatedUserInformations = await User.getUserById(
        updatedStudent.usuarioId
      );

      res.json(updatedUserInformations);
    } else {
      res.status(404).json({ error: "Aluno não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: `Falha ao atualizar o aluno: ${error}` });
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
