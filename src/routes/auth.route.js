import express from "express";
import AuthController from "../controllers/auth.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema, validateBody } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), AuthController.register);
router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/logout", AuthMiddleware.verifyToken, AuthController.logout);

export default router;