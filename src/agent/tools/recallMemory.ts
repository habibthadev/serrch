import { tool } from "ai";
import { z } from "zod";
import { ResearchModel } from "../../db/models/research.js";
import { logger } from "../../lib/logger.js";

export const recallMemory = (telegramUserId: number) =>
  tool({
    description:
      "Recall past research sessions for this user. Use when they reference previous topics or ask follow-up questions.",
    parameters: z.object({
      query: z
        .string()
        .describe("Topic or keywords to search past research"),
    }),
    execute: async ({ query }) => {
      logger.info({ telegramUserId, query }, "Recalling memory");

      const results = await ResearchModel.find(
        {
          telegramUserId,
          $text: { $search: query },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(3)
        .lean();

      if (!results.length) return { found: false, sessions: [] };

      return {
        found: true,
        sessions: results.map((r) => ({
          topic: r.output.topic,
          summary: r.output.summary,
          keyPoints: r.output.keyPoints,
          researchedAt: r.createdAt,
        })),
      };
    },
  });
