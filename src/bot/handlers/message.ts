import type { Context } from "grammy";
import { runResearchAgent } from "../../agent/index.js";
import { formatOutput, chunkMessage } from "../utils/format.js";
import { logger } from "../../lib/logger.js";

export async function handleMessage(ctx: Context) {
  const text = ctx.message?.text;
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id;

  if (!text || !userId || !chatId) return;

  const statusMsg = await ctx.reply("Researching...");

  try {
    const result = await runResearchAgent({
      query: text,
      telegramUserId: userId,
      chatId,
    });

    const formatted = formatOutput(result);

    if (formatted.length <= 4096) {
      await ctx.api.editMessageText(
        chatId,
        statusMsg.message_id,
        formatted,
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.api.editMessageText(
        chatId,
        statusMsg.message_id,
        "Research complete — here are the full results:"
      );
      const chunks = chunkMessage(formatted, 4096);
      for (const chunk of chunks) {
        await ctx.reply(chunk, { parse_mode: "Markdown" });
      }
    }
  } catch (error) {
    logger.error({ error, userId, chatId }, "Agent failed");
    await ctx.api.editMessageText(
      chatId,
      statusMsg.message_id,
      "Research failed. Try again or rephrase your query."
    );
  }
}
