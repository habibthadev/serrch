import type { Context, NextFunction } from "grammy";
import { logger } from "../../lib/logger.js";

const requests = new Map<number, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

export async function rateLimit(ctx: Context, next: NextFunction) {
  const chatId = ctx.chat?.id;
  if (!chatId) return next();

  const now = Date.now();
  const timestamps = requests.get(chatId) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    logger.warn({ chatId }, "Rate limit exceeded");
    await ctx.reply("Too many requests. Wait a minute and try again.");
    return;
  }

  recent.push(now);
  requests.set(chatId, recent);

  return next();
}
