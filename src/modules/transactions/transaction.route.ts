import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import {
  createTransactionController,
  deleteTransactionController,
  getTransactionByIdController,
  getTransactionsController,
  updateTransactionController,
} from "./transactions.controller.js";
import { validate } from "../../shared/middlewares/validation.middleware.js";
import {
  transactionSchema,
  updateTransactionSchema,
} from "./transactions.validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTransactionsController);
router.get("/:id", getTransactionByIdController);
router.post("/", validate(transactionSchema), createTransactionController);
router.put(
  "/:id",
  validate(updateTransactionSchema),
  updateTransactionController,
);
router.delete("/:id", deleteTransactionController);

export default router;
