import { Request, Response } from "express";
import { User } from "../domain/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT || "";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.createUser({
      ...req.body,
      password: hashedPassword,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.getUserByEmail(req.body.email);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: "Successfully logged out" });
};
