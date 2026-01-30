import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import {
  getByCategoryController,
  getMonthlyTrendController,
  getSummaryController,
} from "./reports.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/summary", getSummaryController);
router.get("/by-category", getByCategoryController);
router.get("/monthly-trend", getMonthlyTrendController);

export default router;
