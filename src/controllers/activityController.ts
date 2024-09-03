import { Request, Response } from "express";
import { z } from "zod";
import { Activity } from "../domain/models/activity";

// Definição dos schemas usando zod
const createActivitySchema = z.object({
  titulo: z.string().min(1, { message: "Título é obrigatório" }),
  descricao: z.string().optional(),
  horasNecessarias: z
    .number()
    .min(1, { message: "Horas necessárias deve ser um número positivo" }),
});

const concludeActivitySchema = z.object({
  alunoId: z.number().int().min(1, { message: "ID do aluno inválido" }),
  atividadeId: z.number().int().min(1, { message: "ID da atividade inválido" }),
});

const getActivitiesByStatusSchema = z.object({
  alunoId: z.number().int().min(1, { message: "ID do aluno inválido" }),
  projetoId: z.number().int().min(1, { message: "ID do projeto inválido" }),
  status: z.enum(["PENDENTE", "CONCLUIDA"], {
    errorMap: () => ({ message: "Status inválido" }),
  }),
});

export const createActivity = async (req: Request, res: Response) => {
  try {
    const projetoId = Number(req.params.id);

    const validation = createActivitySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: validation.error.errors.map((err) => err.message).join(", "),
      });
    }

    const { titulo, descricao, horasNecessarias } = validation.data;

    const newActivity = await Activity.createActivity({
      projetoId,
      titulo,
      descricao,
      horasNecessarias,
    });

    await Activity.assignActivityToStudents(projetoId, newActivity.id);

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: `Falha ao criar atividade: ${error}`,
    });
  }
};

export const concludeActivity = async (req: Request, res: Response) => {
  try {
    const validation = concludeActivitySchema.safeParse({
      alunoId: Number(req.params.alunoId),
      atividadeId: Number(req.params.atividadeId),
    });
    if (!validation.success) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: validation.error.errors.map((err) => err.message).join(", "),
      });
    }

    const { alunoId, atividadeId } = validation.data;

    const updatedActivity = await Activity.concludeActivity(
      alunoId,
      atividadeId
    );

    if (updatedActivity.count === 0) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "Atividade não encontrada ou já concluída",
      });
    }

    res.status(200).json({ message: "Atividade concluída com sucesso" });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: `Falha ao concluir atividade: ${error}`,
    });
  }
};

export const getActivitiesByStatus = async (req: Request, res: Response) => {
  try {
    const validation = getActivitiesByStatusSchema.safeParse({
      alunoId: Number(req.params.alunoId),
      projetoId: Number(req.params.projetoId),
      status: req.params.status as "PENDENTE" | "CONCLUIDA",
    });

    if (!validation.success) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: validation.error.errors.map((err) => err.message).join(", "),
      });
    }

    const { alunoId, projetoId, status } = validation.data;

    const activities = await Activity.getActivitiesByStatus(
      alunoId,
      projetoId,
      status
    );

    if (activities.length === 0) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: `Nenhuma atividade ${status.toLowerCase()} encontrada`,
      });
    }

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
      message: `Falha ao buscar atividades: ${error}`,
    });
  }
};
