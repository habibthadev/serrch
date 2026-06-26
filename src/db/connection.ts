import mongoose from "mongoose";
import { env } from "../schemas/env.js";
import { logger } from "../lib/logger.js";

export async function connectDB(): Promise<void> {
  logger.info("Connecting to MongoDB...");

  await mongoose.connect(env.MONGODB_URI);

  logger.info("MongoDB connected");

  mongoose.connection.on("error", (err) => {
    logger.error({ err }, "MongoDB connection error");
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
}

export async function disconnectDB(): Promise<void> {
  logger.info("Disconnecting from MongoDB...");
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}

export function setupGracefulShutdown(disconnect: () => Promise<void>): void {
  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Received signal, shutting down gracefully");
    await disconnect();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
