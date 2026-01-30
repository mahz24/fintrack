import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import {
  createAccountController,
  deleteAccountController,
  getAccountByIdController,
  getAccountsController,
  updateAccountController,
} from "./accounts.controller.js";
import { accountSchema, updateAccountSchema } from "./accounts.validation.js";
import { validate } from "../../shared/middlewares/validation.middleware.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user accounts
 *       401:
 *         description: Unauthorized
 */
router.get("/", getAccountsController);

/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account found
 *       404:
 *         description: Account not found
 */
router.get("/:id", getAccountByIdController);


/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Banco Davivienda
 *               type:
 *                 type: string
 *                 enum: [CHECKING, SAVINGS, CREDIT, CASH]
 *                 example: SAVINGS
 *               balance:
 *                 type: number
 *                 example: 1000000
 *               currency:
 *                 type: string
 *                 example: COP
 *     responses:
 *       201:
 *         description: Account created
 *       400:
 *         description: Invalid data
 */
router.post("/", validate(accountSchema), createAccountController);

/**
 * @swagger
 * /api/accounts/{id}:
 *   put:
 *     summary: Update an account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [CHECKING, SAVINGS, CREDIT, CASH]
 *               balance:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account updated
 *       404:
 *         description: Account not found
 */
router.put("/:id", validate(updateAccountSchema), updateAccountController);

/**
 * @swagger
 * /api/accounts/{id}:
 *   delete:
 *     summary: Delete an account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account deleted
 *       404:
 *         description: Account not found
 */
router.delete("/:id", deleteAccountController);

export default router;
