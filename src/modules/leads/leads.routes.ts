import { Router } from "express";
import { LeadsController } from "./leads.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// Public
router.post("/", LeadsController.createLead);

// Protected
router.get(
  "/",
  requireAuth,
  requireRole("admin", "chat_team"),
  LeadsController.getLeads
);

router.get(
  "/:id",
  requireAuth,
  requireRole("admin", "chat_team"),
  LeadsController.getLeadById
);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin", "chat_team"),
  LeadsController.updateStatus
);

export default router;