import { Router } from "express";
import { AuthController } from "./auth.controller";
import {
  requireAuth,
  requireAuthenticatedUser,
} from "../../middleware/auth.middleware";

const router = Router();

router.get("/me", requireAuth, AuthController.me);
router.post(
  "/bootstrap-profile",
  requireAuthenticatedUser,
  AuthController.bootstrapProfile
);

export default router;