import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import inquiryRoutes from "./src/routes/inquiryRoutes.js";

dotenv.config();
const app = express();

app.use(cors());                // If you want to restrict: cors({ origin: ["https://auatechnologies.com"] })
app.use(express.json());

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("❌ MongoDB error:", e.message));

// Routes
app.get("/", (_req, res) => res.send("AUA Backend running."));
app.use("/api/auth", authRoutes);
app.use("/api/inquiries", inquiryRoutes);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend on http://localhost:${PORT}`));
