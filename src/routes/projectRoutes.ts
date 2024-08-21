import { Router } from "express";
import { authMiddleware } from "../middleware/token";
import {
  getAllProjects,
  getProjectFromUserId,
  createProject,
  deleteProject,
} from "../controllers/projectController";

const router = Router();

router.get("/", authMiddleware, getAllProjects);

router.get("/:id", authMiddleware, getProjectFromUserId);

router.post("/", authMiddleware, createProject);

router.post("/", authMiddleware, deleteProject);

export default router;
