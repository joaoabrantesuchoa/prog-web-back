import { Request, Response } from "express";
import { Project } from "../domain/models/project";

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch students ${error}` });
  }
};

export const getProjectFromUserId = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const users = await Project.getProjectById(userId);
    if (users) {
      res.json(users);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch student ${error}` });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const student = await Project.createProject(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: `Failed to create student ${error}` });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = Number(req.params.id);

    const deleted = await Project.deleteProject(projectId);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to delete student ${error}` });
  }
};

export const addStudentToProject = async (req: Request, res: Response) => {
  try {
    const { projectId, studentId } = req.params;

    const updatedProject = await Project.addStudentToProject(
      Number(projectId),
      Number(studentId),
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to add student to project: ${error}` });
  }
};

export const removeStudentFromProject = async (req: Request, res: Response) => {
  try {
    const { projectId, studentId } = req.params;

    const updatedProject = await Project.removeStudentFromProject(
      Number(projectId),
      Number(studentId),
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to remove student from project: ${error}` });
  }
};
