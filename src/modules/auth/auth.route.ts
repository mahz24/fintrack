import { Router } from "express";
import { validate } from "../../shared/middlewares/validation.middleware.js";
import { loginController, refreshController, registerController } from "./auth.controller.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.validation.js";

const router = Router();


/** 
 * @swagger
 * /api/auth/register:
 *  post:
 *    summary: Register a new user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - password
 *            properties:
 *              name:
 *                type: string
 *                example: Marco
 *              email:
 *                type: string
 *                example: marco@gmail.com
 *              password:
 *                type: string
 *                example: "12345678"
 *    responses:
 *      201:
 *        description: User registered succesfully
 *      400:
 *        description: Invalid data or email already exist
 */
router.post("/register", validate(registerSchema), registerController);

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Login user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                example: marco@gmail.com
 *              password:
 *                type: string
 *                example: "12345678"
 *    responses:
 *      200:
 *        description: Login user succesfully.
 *      401:
 *        description: Invalid credentials.
 */
router.post("/login", validate(loginSchema), loginController);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renew access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh", validate(refreshSchema), refreshController);  

export default router;