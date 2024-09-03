import { Request, Response } from "express";
import { Activity } from "../domain/models/activity";

export const createActivity = async (req: Request, res: Response) => {
  try {
    const projetoId = Number(req.params.id);

    const { titulo, descricao, horasNecessarias } = req.body;

    if (!projetoId || !projetoId || !titulo || !horasNecessarias) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newActivity = await Activity.createActivity({
      projetoId,
      titulo,
      descricao,
      horasNecessarias,
    });

    await Activity.assignActivityToStudents(projetoId, newActivity.id);

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: `Failed to create activity: ${error}` });
  }
};

export const concludeActivity = async (req: Request, res: Response) => {
  try {
    const alunoId = Number(req.params.alunoId);
    const atividadeId = Number(req.params.atividadeId);

    if (!alunoId || !atividadeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedActivity = await Activity.concludeActivity(
      alunoId,
      atividadeId,
    );

    if (updatedActivity.count === 0) {
      return res
        .status(404)
        .json({ error: "Activity not found or already concluded" });
    }

    res.status(200).json({ message: "Activity concluded successfully" });
  } catch (error) {
    res.status(500).json({ error: `Failed to conclude activity: ${error}` });
  }
};

export const getActivitiesByStatus = async (req: Request, res: Response) => {
  try {
    const alunoId = Number(req.params.alunoId);
    const projetoId = Number(req.params.projetoId);
    const status = req.params.status as "PENDENTE" | "CONCLUIDA";

    if (!alunoId || !projetoId || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const activities = await Activity.getActivitiesByStatus(
      alunoId,
      projetoId,
      status,
    );

    if (activities.length === 0) {
      return res
        .status(404)
        .json({ error: `No ${status.toLowerCase()} activities found` });
    }

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch activities: ${error}` });
  }
};
