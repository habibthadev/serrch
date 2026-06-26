import type { Context, NextFunction } from "grammy";
import { logger } from "../../lib/logger.js";

export async function botLogger(ctx: Context, next: NextFunction) {
  const start = Date.now();
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id;
  const text = ctx.message?.text;

  await next();

  const ms = Date.now() - start;
  logger.info({ userId, chatId, text: text?.slice(0, 50), ms }, "Bot update processed");
}
