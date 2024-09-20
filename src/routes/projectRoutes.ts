import { Router } from "express";
import { authMiddleware } from "../middleware/token";
import {
  getAllProjects,
  getProjectFromUserId,
  createProject,
  deleteProject,
  addStudentToProject,
  removeStudentFromProject,
} from "../controllers/projectController";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authMiddleware([Role.Professor]), getAllProjects);

router.get("/:id", authMiddleware([Role.Professor]), getProjectFromUserId);

router.post("/", authMiddleware([Role.Professor]), createProject);

router.delete("/:id", authMiddleware([Role.Professor]), deleteProject);

router.post("/:projectId/students/:studentId", authMiddleware([Role.Professor]), addStudentToProject);

router.delete(
  "/:projectId/students/:studentId",
  authMiddleware([Role.Professor]),
  removeStudentFromProject,
);

export default router;
