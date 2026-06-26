import { Hono } from "hono";
import { webhookCallback } from "grammy";
import { serve } from "@hono/node-server";
import { bot } from "./bot/index.js";
import { handleMessage } from "./bot/handlers/message.js";
import {
  startCommand,
  historyCommand,
  clearCommand,
} from "./bot/handlers/commands.js";
import { dedupUpdates } from "./bot/middleware/dedup.js";
import { rateLimit } from "./bot/middleware/rateLimit.js";
import { botLogger } from "./bot/middleware/logger.js";
import { connectDB, setupGracefulShutdown, disconnectDB } from "./db/connection.js";
import { env } from "./schemas/env.js";
import { logger } from "./lib/logger.js";

bot.use(dedupUpdates);
bot.use(botLogger);
bot.use(rateLimit);

bot.catch((err) => {
  logger.error({ error: err.error, ctx: err.ctx }, "Bot error");
});

bot.command("start", startCommand);
bot.command("history", historyCommand);
bot.command("clear", clearCommand);

bot.on("message:text", handleMessage);

const app = new Hono();

app.post(`/webhook/${env.TELEGRAM_BOT_TOKEN}`, webhookCallback(bot, "hono"));

app.get("/health", (c) => c.json({ status: "ok" }));

async function main() {
  await connectDB();
  setupGracefulShutdown(disconnectDB);

  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    logger.info({ port: info.port }, "Server running");
  });
}

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
