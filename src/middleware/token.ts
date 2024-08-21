// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { User } from "../domain/models/user";

const SECRET_KEY: Secret = process.env.JWT || "secret";

interface CustomRequest extends Request {
  user?: User;
  token?: string | jwt.JwtPayload;
}

export enum Role {
  Aluno,
  Professor,
}

export const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & {
      role: Role;
    };

    if (!decoded.id) {
      throw new Error("Token missing user id");
    }

    const user = await User.getUserById(decoded.id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).send(`Please authenticate: ${error}`);
  }
};
