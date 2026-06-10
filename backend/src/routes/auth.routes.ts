import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/auth.schema";
import { authenticate } from "../middlewares/authenticate";
import { authLimiter, passwordResetLimiter } from "../config/rateLimiter";

const router = Router();
router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", passwordResetLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password/:token", passwordResetLimiter, validate(resetPasswordSchema), authController.resetPassword);

//protected route
router.get("/me", authenticate, authController.getMe);

export default router;
