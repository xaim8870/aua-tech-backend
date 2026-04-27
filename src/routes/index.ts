// src/routes/index.ts
import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import authRoutes from "../modules/auth/auth.routes";
import leadsRoutes from "../modules/leads/leads.routes";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    const { error } = await supabaseAdmin.from("profiles").select("id").limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Server is running but Supabase connection failed.",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Server and Supabase connection are healthy.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error.";

    return res.status(500).json({
      success: false,
      message: "Health check failed.",
      error: message,
    });
  }
});

router.use("/auth", authRoutes);
router.use("/leads", leadsRoutes);

export default router;