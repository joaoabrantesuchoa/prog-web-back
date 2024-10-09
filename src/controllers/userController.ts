import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../domain/models/user";

const userInformationSchema = z.object({
  userEmail: z
    .string()
    .email({ message: "Formato de email inválido" })
    .min(1, { message: "O email é obrigatório" }),
});

export const getUserByEmail = async (req: Request, res: Response) => {
  const validation = userInformationSchema.safeParse(req.params);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }

  const { userEmail } = validation.data;

  try {
    const user = await User.getUserByEmail(userEmail);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar estudantes: ${error}` });
  }
};
