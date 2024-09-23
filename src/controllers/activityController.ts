import { Request, Response } from "express";
import { z } from "zod";
import { Activity } from "../domain/models/activity";

const createActivityIdSchema = z.object({
  projectId: z.string().regex(/^\d+$/, { message: "ID do usuário inválido" }),
});

const activityOperationSchema = z.object({
  alunoId: z.string().regex(/^\d+$/, { message: "ID do aluno inválido" }),
  atividadeId: z
    .string()
    .regex(/^\d+$/, { message: "ID da atividade inválido" }),
});

const createActivitySchema = z.object({
  titulo: z.string().min(1, { message: "Título é obrigatório" }),
  descricao: z.string().optional(),
  horasNecessarias: z
    .number()
    .min(1, { message: "Horas necessárias deve ser um número positivo" }),
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
    const idSchemaValidation = createActivityIdSchema.safeParse(req.params);

    if (!idSchemaValidation.success) {
      return res
        .status(400)
        .json({ error: idSchemaValidation.error.errors[0].message });
    }

    const validation = createActivitySchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: validation.error.errors.map((err) => err.message).join(", "),
      });
    }

    const { projectId } = idSchemaValidation.data;

    const { titulo, descricao, horasNecessarias } = validation.data;

    const newActivity = await Activity.createActivity({
      projetoId: Number(projectId),
      titulo,
      descricao,
      horasNecessarias,
    });

    await Activity.assignActivityToStudents(
      Number(projectId),
      newActivity.id
    );

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
    const validation = activityOperationSchema.safeParse(req.params);

    if (!validation.success) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: validation.error.errors.map((err) => err.message).join(", "),
      });
    }

    const { alunoId, atividadeId } = validation.data;

    await Activity.concludeActivity(Number(alunoId), Number(atividadeId));

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
