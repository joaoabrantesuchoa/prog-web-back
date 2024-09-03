import { Request, Response } from "express";
import { z } from "zod";
import { Teacher } from "../domain/models/teacher";

const teacherSchema = z.object({
  nome: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  usuarioId: z.number(),
});

export const getAllTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await Teacher.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: `Falha ao buscar professores: ${error}` });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacherId = Number(req.params.id);

    if (isNaN(teacherId)) {
      return res.status(400).json({ error: "ID do professor inválido" });
    }

    const teacher = await Teacher.getTeacherById(teacherId);
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ error: "Professor não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: `Falha ao buscar professor: ${error}` });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const validation = teacherSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const teacher = await Teacher.createTeacher(validation.data);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: `Falha ao criar professor: ${error}` });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const validation = teacherSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const updated = await Teacher.updateTeacher({
      id: Number(req.params.id),
      ...validation.data,
    });

    if (updated) {
      const updatedTeacher = await Teacher.getTeacherById(
        Number(req.params.id)
      );
      res.json(updatedTeacher);
    } else {
      res.status(404).json({ error: "Professor não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: `Falha ao atualizar professor: ${error}` });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacherId = Number(req.params.id);

    if (isNaN(teacherId)) {
      return res.status(400).json({ error: "ID do professor inválido" });
    }

    const deleted = await Teacher.deleteTeacher(teacherId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Professor não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: `Falha ao deletar professor: ${error}` });
  }
};
