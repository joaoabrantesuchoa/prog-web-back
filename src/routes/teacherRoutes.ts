import { Router } from "express";
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController";
import { authMiddleware } from "../middleware/token";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authMiddleware([Role.Professor]), getAllTeachers);

router.get("/:id", authMiddleware([Role.Professor]), getTeacherById);

router.post("/", authMiddleware([Role.Professor]), createTeacher);

router.put("/:id", authMiddleware([Role.Professor]), updateTeacher);

router.delete("/:id", authMiddleware([Role.Professor]), deleteTeacher);

export default router;
