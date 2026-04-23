import dotenv from "dotenv";
import { requireEnv } from "../shared/utils/requireEnv";

dotenv.config();

const parsePort = (value: string | undefined): number => {
  if (!value) return 5000;

  const port = Number(value);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error("Invalid PORT value in environment variables.");
  }

  return port;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parsePort(process.env.PORT),

  SUPABASE_URL: requireEnv("SUPABASE_URL", process.env.SUPABASE_URL),
  SUPABASE_SERVICE_ROLE_KEY: requireEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ),

  APP_BASE_URL: process.env.APP_BASE_URL || "http://localhost:5000",

  OFFICIAL_EMAIL: process.env.OFFICIAL_EMAIL || "",

  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || "",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",

  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || "",
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  WHATSAPP_BUSINESS_ACCOUNT_ID: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "",
} as const;