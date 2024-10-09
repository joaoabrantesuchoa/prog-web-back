import { Router } from "express";
import { getUserByEmail } from "../controllers/userController";

const router = Router();

router.get("/informations/:userEmail", getUserByEmail);

export default router;
