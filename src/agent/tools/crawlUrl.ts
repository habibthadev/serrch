import { tool } from "ai";
import { z } from "zod";
import FirecrawlApp from "@mendable/firecrawl-js";
import { env } from "../../schemas/env.js";
import { logger } from "../../lib/logger.js";

const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });

export const crawlUrl = tool({
  description:
    "Scrape and extract content from a URL. Use when the user provides a direct link.",
  parameters: z.object({
    url: z.string().url().describe("The URL to crawl"),
  }),
  execute: async ({ url }) => {
    logger.info({ url }, "Crawling URL");
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
    });

    if (!result.success) {
      throw new Error(`Firecrawl failed to scrape: ${url}`);
    }

    return { content: result.markdown, url };
  },
});
