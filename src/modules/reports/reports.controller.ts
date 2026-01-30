import type { NextFunction, Request, Response } from "express";
import {
  getByCategory,
  getMonthlyTrend,
  getSummary,
} from "./reports.service.js";

export const getSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const report = await getSummary(userId);
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

export const getByCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate } = req.query;

    const report = await getByCategory(
      userId,
      startDate as string | undefined,
      endDate as string | undefined,
    );
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyTrendController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const report = await getMonthlyTrend(userId);
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};
