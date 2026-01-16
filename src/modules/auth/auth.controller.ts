import type { NextFunction, Request, Response } from "express";
import { login, refresh, register } from "./auth.service.js";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await refresh(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
