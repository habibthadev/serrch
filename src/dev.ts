import { bot } from "./bot/index.js";
import { handleMessage } from "./bot/handlers/message.js";
import {
  startCommand,
  historyCommand,
  clearCommand,
} from "./bot/handlers/commands.js";
import { rateLimit } from "./bot/middleware/rateLimit.js";
import { botLogger } from "./bot/middleware/logger.js";
import { connectDB, setupGracefulShutdown, disconnectDB } from "./db/connection.js";
import { logger } from "./lib/logger.js";

bot.use(botLogger);
bot.use(rateLimit);

bot.catch((err) => {
  logger.error({ error: err.error, ctx: err.ctx }, "Bot error");
});

bot.command("start", startCommand);
bot.command("history", historyCommand);
bot.command("clear", clearCommand);

bot.on("message:text", handleMessage);

async function main() {
  await connectDB();
  setupGracefulShutdown(disconnectDB);

  logger.info("Starting bot in polling mode...");
  bot.start({
    onStart: (botInfo) => {
      logger.info({ botInfo }, "Bot started in polling mode");
    },
  });
}

main().catch((err) => {
  logger.error({ err }, "Failed to start bot");
  process.exit(1);
});
