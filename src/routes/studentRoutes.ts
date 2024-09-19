import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";
import { authMiddleware } from "../middleware/token";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authMiddleware([Role.Aluno]), getAllStudents);

router.get("/:id", authMiddleware([Role.Aluno]), getStudentById);

router.post("/", authMiddleware([Role.Aluno]), createStudent);

router.put("/:id", authMiddleware([Role.Aluno]), updateStudent);

router.delete("/:id", authMiddleware([Role.Aluno]), deleteStudent);

export default router;
