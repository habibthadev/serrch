import type { Context, NextFunction } from "grammy";
import { logger } from "../../lib/logger.js";

const processed = new Set<number>();
const MAX_SIZE = 1000;

export async function dedupUpdates(ctx: Context, next: NextFunction) {
  const updateId = ctx.update.update_id;

  if (processed.has(updateId)) {
    logger.warn({ updateId }, "Duplicate update skipped");
    return;
  }

  processed.add(updateId);

  if (processed.size > MAX_SIZE) {
    const toDelete = [...processed].slice(0, processed.size - MAX_SIZE);
    for (const id of toDelete) processed.delete(id);
  }

  return next();
}
