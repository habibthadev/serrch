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
    const result = await firecrawl.search(query, { limit });

    if (!result.success) {
      throw new Error(`Firecrawl search failed for: ${query}`);
    }

    return result.data.map((r) => ({
      url: r.url,
      title: r.title,
      content: r.markdown,
    }));
  },
});
