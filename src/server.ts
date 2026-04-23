import app from "./app";
import { env } from "./config/env";
import { verifyEmailTransport } from "./modules/notifications/email.service";
app.listen(env.PORT, () => {
  console.log(`AUA backend server running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Health check: ${env.APP_BASE_URL}/api/health`);
});
const startServer = async () => {
  try {
    await verifyEmailTransport();

    app.listen(env.PORT, () => {
      console.log(`AUA backend server running on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`Health check: ${env.APP_BASE_URL}/api/health`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();