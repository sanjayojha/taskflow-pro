import { Router } from "express";

import authRoutes from "./auth.routes";
import orgRoutes from "./org.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/orgs", orgRoutes);

export default router;
