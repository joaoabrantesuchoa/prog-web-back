// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const SECRET_KEY: Secret = process.env.JWT || "secret";

interface CustomRequest extends Request {
  token?: string | jwt.JwtPayload;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    res.status(401).send("Please authenticate");
  }
};
