import { Router } from "express";
import { authMiddleware } from "../middleware/token";
import {
  concludeActivity,
  createActivity,
  getActivitiesByStatus,
} from "../controllers/activityController";

const router = Router();

router.post("/project/:id", authMiddleware, createActivity);

router.put(
  "aluno/:alunoId/activities/:id/conclude",
  authMiddleware,
  concludeActivity,
);

router.get(
  "aluno/:alunoId/activities/status/:status",
  authMiddleware,
  getActivitiesByStatus,
);

export default router;
