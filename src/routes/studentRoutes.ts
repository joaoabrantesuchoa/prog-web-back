import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";
import { authMiddleware } from "../middleware/token";

const router = Router();

router.get("/", authMiddleware, getAllStudents);

router.get("/:id", authMiddleware, getStudentById);

router.post("/", authMiddleware, createStudent);

router.put("/:id", authMiddleware, updateStudent);

router.delete("/:id", authMiddleware, deleteStudent);

export default router;
