import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { User } from "../domain/models/user";
import { Role } from '@prisma/client';


const SECRET_KEY: Secret = process.env.JWT || "secret";

interface CustomRequest extends Request {
  user?: User;
  token?: string | jwt.JwtPayload;
}

interface CustomRequest extends Request {
  user?: User;
  token?: string | jwt.JwtPayload;
}

export const authMiddleware = (roles: Role[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
      }

      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & { role: Role };

      if (!decoded.id) {
        return res.status(401).send("Unauthorized: Invalid token");
      }

      const user = await User.getUserById(decoded.id);

      if (!user) {
        return res.status(401).send("Unauthorized: User not found");
      }

      req.user = user;

      if (!roles.includes(user.role)) {
        return res.status(403).send("Forbidden: You do not have the necessary permissions");
      }

      next();
    } catch (error) {
      res.status(401).send(`Unauthorized: ${error}`);
    }
  };
};
