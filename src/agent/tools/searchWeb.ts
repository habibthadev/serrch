import { tool } from "ai";
import { z } from "zod";
import FirecrawlApp from "@mendable/firecrawl-js";
import { env } from "../../schemas/env.js";
import { logger } from "../../lib/logger.js";

const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });

export const searchWeb = tool({
  description:
    "Search the web for a topic. Use when the user asks about a subject rather than providing a URL.",
  parameters: z.object({
    query: z.string().describe("The search query"),
    limit: z.number().min(1).max(5).default(3),
  }),
  execute: async ({ query, limit }) => {
    logger.info({ query, limit }, "Searching web");

    try {
      const result = await firecrawl.search(query, { limit });

      if (!result.success) {
        logger.warn({ query, error: result.error }, "Firecrawl search failed");
        return { ok: false, error: `Search failed for: ${query}` };
      }

      return {
        ok: true,
        results: result.data.map((r) => ({
          url: r.url,
          title: r.title,
          content: r.markdown,
        })),
      };
    } catch (err) {
      logger.error({ query, err }, "Firecrawl search threw");
      return { ok: false, error: `Search error: ${(err as Error).message}` };
    }
  },
});
