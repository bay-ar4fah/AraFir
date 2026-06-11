import { Router } from "express";
import { changePassword } from "../controllers/passwordController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.patch(
  "/change-password",
  requireAuth,
  changePassword
);

export default router;