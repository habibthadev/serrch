import type { Context } from "grammy";
import { ResearchModel } from "../../db/models/research.js";
import { logger } from "../../lib/logger.js";

export async function startCommand(ctx: Context) {
  await ctx.reply(
    "I'm Serrch, your research assistant.\n\n" +
      "Send me a URL or a topic and I'll research it for you.\n\n" +
      "Commands:\n" +
      "/history — View your past research\n" +
      "/clear — Clear your research history"
  );
}

export async function historyCommand(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;

  try {
    const sessions = await ResearchModel.find({ telegramUserId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    if (sessions.length === 0) {
      await ctx.reply("No research history yet.");
      return;
    }

    const lines = sessions.map((s, i) => {
      const date = s.createdAt.toLocaleDateString();
      return `${i + 1}. **${s.output.topic}** — ${date}`;
    });

    await ctx.reply(lines.join("\n"), { parse_mode: "Markdown" });
  } catch (error) {
    logger.error({ error, userId }, "Failed to fetch history");
    await ctx.reply("Failed to fetch history. Try again later.");
  }
}

export async function clearCommand(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;

  try {
    const result = await ResearchModel.deleteMany({ telegramUserId: userId });
    await ctx.reply(`Cleared ${result.deletedCount} research sessions.`);
  } catch (error) {
    logger.error({ error, userId }, "Failed to clear history");
    await ctx.reply("Failed to clear history. Try again later.");
  }
}
