import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError("Authorization header missing", 401);
    }
    
    const token = authHeader.split(" ")[1] || "";

    const verifiedToken = verifyToken(token);

    if (!verifiedToken || !verifiedToken.id) {
      throw new AppError("Invalid token", 401);
    }
    req.userId = verifiedToken.id;
    next();
  } catch (error) {
    next(new AppError("Unauthorized", 401));
  }
};