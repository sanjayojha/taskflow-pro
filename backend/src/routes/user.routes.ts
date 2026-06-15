import { authenticate } from "../middlewares/authenticate";
import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { updateProfileSchema } from "../schemas/user.schema";
import { handleMulterError, uploadAvatar } from "../middlewares/upload";

const router = Router();

// every route need to be protected
router.use(authenticate);

router.get("/me/profile", userController.getProfile);

router.put("/me/profile", validate(updateProfileSchema), userController.updateProfile);

// multer runs first and then catches multer-specific errors
router.post("/me/avatar", uploadAvatar, handleMulterError, userController.uploadAvatar);

export default router;
