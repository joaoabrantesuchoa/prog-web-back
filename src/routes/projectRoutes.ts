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

const router = Router();

router.get("/", authMiddleware, getAllProjects);

router.get("/:id", authMiddleware, getProjectFromUserId);

router.post("/", authMiddleware, createProject);

router.delete("/", authMiddleware, deleteProject);

router.post("/:id/students/:studentId", authMiddleware, addStudentToProject);

router.delete(
  "/:id/students/:studentId",
  authMiddleware,
  removeStudentFromProject,
);

export default router;
