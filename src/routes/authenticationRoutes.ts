import { Router } from "express";
import { login, logout, registerUser } from "../controllers/authController";

const router = Router();

router.post("/login", login);

router.post("/logout", logout);

router.post("/register", registerUser);

export default router;
