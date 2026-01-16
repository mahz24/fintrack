import { Router } from "express";
import { validate } from "../../shared/middlewares/validation.middleware.js";
import { loginController, refreshController, registerController } from "./auth.controller.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh", validate(refreshSchema), refreshController);  

export default router;