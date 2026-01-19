import { Router } from "express";
import { createCategoryController, deleteCategoryController, getCategoriesController, getCategoryByIdController, updateCategoryController } from "./categories.controller.js";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { categorySchema, updateCategorySchema } from "./categories.validation.js";
import { validate } from "../../shared/middlewares/validation.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);
router.post("/", validate(categorySchema),createCategoryController);
router.put("/:id", validate(updateCategorySchema), updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;