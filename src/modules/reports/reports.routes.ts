import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import {
  getByCategoryController,
  getMonthlyTrendController,
  getSummaryController,
} from "./reports.controller.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Get financial summary
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBalance:
 *                   type: number
 *                   example: 5000000
 *                 monthIncome:
 *                   type: number
 *                   example: 3000000
 *                 monthExpenses:
 *                   type: number
 *                   example: 1500000
 *                 monthSavings:
 *                   type: number
 *                   example: 1500000
 *       401:
 *         description: Unauthorized
 */
router.get("/summary", getSummaryController);

/**
 * @swagger
 * /api/reports/by-category:
 *   get:
 *     summary: Get expenses by category
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Expenses grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoryId:
 *                     type: string
 *                   categoryName:
 *                     type: string
 *                   total:
 *                     type: number
 *                   percentage:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/by-category", getByCategoryController);

/**
 * @swagger
 * /api/reports/monthly-trend:
 *   get:
 *     summary: Get monthly trend (last 12 months)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly income and expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: "2026-01"
 *                   income:
 *                     type: number
 *                     example: 3000000
 *                   expenses:
 *                     type: number
 *                     example: 1500000
 *       401:
 *         description: Unauthorized
 */
router.get("/monthly-trend", getMonthlyTrendController);

export default router;
