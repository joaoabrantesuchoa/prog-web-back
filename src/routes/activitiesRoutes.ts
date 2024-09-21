import { Router } from "express";
import { authMiddleware } from "../middleware/token";
import {
  concludeActivity,
  createActivity,
  getActivitiesByStatus,
} from "../controllers/activityController";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/create/:projectId",
  authMiddleware([Role.Professor]),
  createActivity
);

router.put(
  "/aluno/:alunoId/atividade/:atividadeId/conclude",
  authMiddleware([Role.Professor, Role.Aluno]),
  concludeActivity
);

router.get(
  "/aluno/:alunoId/atividade/status/:status",
  authMiddleware([Role.Professor, Role.Aluno]),
  getActivitiesByStatus
);

export default router;
