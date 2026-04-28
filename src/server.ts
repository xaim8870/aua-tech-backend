// src/server.ts
import app from "./app";
import { env } from "./config/env";
import { verifyEmailTransport } from "./modules/notifications/email.service";

app.listen(env.PORT, "0.0.0.0", async () => {
  console.log(`AUA backend server running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Health check: ${env.APP_BASE_URL}/api/health`);

  try {
    await verifyEmailTransport();
  } catch (error) {
    console.warn("Email transport verification failed, but server is still running:");
    console.warn(error);
  }
});