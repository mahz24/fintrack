import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { AppError } from "../errors/AppError.js";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = schema.safeParse(req.body);
    if (!data.success) {
      const message = data.error.issues.map((err) => err.message).join(", ");
      throw new AppError(message, 400);
    }
    next();
  };
};
