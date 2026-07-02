require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const app = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");
const { ensureDefaultAdmin } = require("./services/auth.service");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;
let server;

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { message: error.message, stack: error.stack });
  process.exit(1);
});

const startServer = async () => {
  await connectDatabase();
  await ensureDefaultAdmin();

  server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
};

const shutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown.`);

  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    return;
  }

  if (mongoose.connection.readyState !== 0) {
    await disconnectDatabase();
  }

  process.exit(0);
};

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled promise rejection", { message: error.message, stack: error.stack });

  if (server) {
    server.close(() => process.exit(1));
    return;
  }

  process.exit(1);
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer().catch((error) => {
  logger.error("Server startup failed", { message: error.message, stack: error.stack });
  process.exit(1);
});
