import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import {
  createTransactionController,
  deleteTransactionController,
  getTransactionByIdController,
  getTransactionsController,
  importTransactionsController,
  updateTransactionController,
} from "./transactions.controller.js";
import { validate } from "../../shared/middlewares/validation.middleware.js";
import {
  transactionSchema,
  updateTransactionSchema,
} from "./transactions.validation.js";
import { upload } from "../../config/multer.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: accountId
 *         schema:
 *           type: string
 *         description: Filter by account ID
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE, TRANSFER]
 *         description: Filter by transaction type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
router.get("/", getTransactionsController);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction found
 *       404:
 *         description: Transaction not found
 */
router.get("/:id", getTransactionByIdController);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - date
 *               - accountId
 *               - categoryId
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50000
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE, TRANSFER]
 *                 example: EXPENSE
 *               description:
 *                 type: string
 *                 example: Almuerzo
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-15"
 *               accountId:
 *                 type: string
 *                 example: uuid-account
 *               categoryId:
 *                 type: string
 *                 example: uuid-category
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Invalid data
 */
router.post("/", validate(transactionSchema), createTransactionController);


/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE, TRANSFER]
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 *       404:
 *         description: Transaction not found
 */
router.put(
  "/:id",
  validate(updateTransactionSchema),
  updateTransactionController,
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       404:
 *         description: Transaction not found
 */
router.delete("/:id", deleteTransactionController);

/**
 * @swagger
 * /api/transactions/import:
 *   post:
 *     summary: Import transactions from CSV
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - accountId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file
 *               accountId:
 *                 type: string
 *                 description: Account ID to import into
 *     responses:
 *       200:
 *         description: Import completed
 *       400:
 *         description: Invalid file or data
 */
router.post("/import", upload.single("file"), importTransactionsController);

export default router;
