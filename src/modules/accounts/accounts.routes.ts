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

router.get("/", getAccountsController);
router.get("/:id", getAccountByIdController);
router.post("/", validate(accountSchema), createAccountController);
router.put("/:id", validate(updateAccountSchema), updateAccountController);
router.delete("/:id", deleteAccountController);

export default router;
