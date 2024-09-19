import { Request, Response } from "express";
import { Project } from "../domain/models/project";
import { z } from "zod";

const createProjectSchema = z.object({
  titulo: z.string().min(1, { message: "O título é obrigatório" }),
  descricao: z.string().optional().default(""),
  professorId: z.number({ required_error: "O ID do professor é obrigatório" }),
});

const projectStudentSchema = z.object({
  projectId: z.string().regex(/^\d+$/, { message: "ID do projeto inválido" }),
  studentId: z.string().regex(/^\d+$/, { message: "ID do aluno inválido" }),
});

const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: "ID do usuário inválido" }),
});

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar os projetos: ${error}` });
  }
};

export const getProjectFromUserId = async (req: Request, res: Response) => {
  try {
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.errors[0].message });
    }

    const userId = Number(req.params.id);
    const users = await Project.getProjectById(userId);

    if (users) {
      res.json(users);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Erro ao buscar projetos do usuário: ${error}` });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const validation = createProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.errors[0].message });
    }

    const project = await Project.createProject(validation.data);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar projeto: ${error}` });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = Number(req.params.id);

    if (isNaN(projectId)) {
      return res.status(400).json({ error: "ID do projeto inválido" });
    }

    const deleted = await Project.deleteProject(projectId);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Projeto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: `Erro ao deletar projeto: ${error}` });
  }
};

export const addStudentToProject = async (req: Request, res: Response) => {
  try {
    const validation = projectStudentSchema.safeParse(req.params);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.errors[0].message });
    }

    const { projectId, studentId } = validation.data;
    const updatedProject = await Project.addStudentToProject(
      Number(projectId),
      Number(studentId)
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Erro ao adicionar aluno ao projeto: ${error}` });
  }
};

export const removeStudentFromProject = async (req: Request, res: Response) => {
  try {
    const validation = projectStudentSchema.safeParse(req.params);
    if (!validation.success) {
      return res
        .status(400)
        .json({ error: validation.error.errors[0].message });
    }

    const { projectId, studentId } = validation.data;
    const updatedProject = await Project.removeStudentFromProject(
      Number(projectId),
      Number(studentId)
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Erro ao remover aluno do projeto: ${error}` });
  }
};
