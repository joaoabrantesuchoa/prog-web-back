import { Request, Response } from "express";
import { Student } from "../domain/models/student";

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const students = await Student.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch students ${error}` });
  }
};

export const getProjectFromUserId = async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.id);

    const student = await Student.getStudentById(studentId);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch student ${error}` });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const student = await Student.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: `Failed to create student ${error}` });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.id);

    const deleted = await Student.deleteStudent(studentId);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to delete student ${error}` });
  }
};
