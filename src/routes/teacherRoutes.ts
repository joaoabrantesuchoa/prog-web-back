import { Router } from "express";
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController";
import { authMiddleware } from "../middleware/token";

const router = Router();

router.get("/", authMiddleware, getAllTeachers);

router.get("/:id", authMiddleware, getTeacherById);

router.post("/", authMiddleware, createTeacher);

router.put("/:id", authMiddleware, updateTeacher);

router.delete("/:id", authMiddleware, deleteTeacher);

export default router;
