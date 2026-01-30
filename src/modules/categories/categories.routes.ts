import { Router } from "express";
import { createCategoryController, deleteCategoryController, getCategoriesController, getCategoryByIdController, updateCategoryController } from "./categories.controller.js";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";
import { categorySchema, updateCategorySchema } from "./categories.validation.js";
import { validate } from "../../shared/middlewares/validation.middleware.js";

const router = Router();

router.use(authMiddleware);


/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *      -bearerAuth: []
 *     responses:
 *       200:
 *         description: Get general categories and categories perzonalied
 *       401:
 *         description: Unauthorized
 */
router.get("/", getCategoriesController);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategoryByIdController);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *                 example: Gimnasio
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: EXPENSE
 *               icon:
 *                 type: string
 *                 example: "🏋️"
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Invalid data
 */
router.post("/", validate(categorySchema), createCategoryController);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
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
 *                 enum: [INCOME, EXPENSE]
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */
router.put("/:id", validate(updateCategorySchema), updateCategoryController);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete("/:id", deleteCategoryController);

export default router;