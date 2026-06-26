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

    try {
      const result = await firecrawl.scrapeUrl(url, {
        formats: ["markdown"],
      });

      if (!result.success) {
        logger.warn({ url, error: result.error }, "Firecrawl scrape failed");
        return {
          ok: false,
          error: `Failed to scrape URL. The site may block automated requests.`,
          url,
        };
      }

      return { ok: true, content: result.markdown, url };
    } catch (err) {
      logger.error({ url, err }, "Firecrawl scrape threw");
      return {
        ok: false,
        error: `Could not access URL: ${(err as Error).message}`,
        url,
      };
    }
  },
});
