// src/app.ts
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",

  "https://auatechnologies.com",
  "https://www.auatechnologies.com",
  "https://aua-technologies-dashboard.netlify.app",

  process.env.PUBLIC_FRONTEND_URL,
  process.env.PUBLIC_FRONTEND_WWW_URL,
  process.env.ADMIN_DASHBOARD_URL,
].filter((origin): origin is string => {
  return typeof origin === "string" && origin.length > 0;
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AUA backend is running.",
  });
});

app.use("/api", routes);

export default app;