import { Request, Response } from "express";
import { Teacher } from "../domain/models/teacher";

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch teachers ${error}` });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacherId = Number(req.params.id);

    const teacher = await Teacher.getTeacherById(teacherId);
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ error: "Teacher not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch teacher ${error}` });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.createTeacher(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: `Failed to create teacher ${error}` });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const updated = await Teacher.updateTeacher({
      id: Number(req.params.id),
      ...req.body,
    });
    if (updated) {
      const teacherId = Number(req.params.id);

      const updatedTeacher = await Teacher.getTeacherById(teacherId);
      res.json(updatedTeacher);
    } else {
      res.status(404).json({ error: "Teacher not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to update teacher ${error}` });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacherId = Number(req.params.id);

    const deleted = await Teacher.deleteTeacher(teacherId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Teacher not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to delete teacher ${error}` });
  }
};
