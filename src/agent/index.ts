import { generateText } from "ai";
import { createFireworks } from "@ai-sdk/fireworks";
import { env } from "../schemas/env.js";
import { crawlUrl } from "./tools/crawlUrl.js";
import { searchWeb } from "./tools/searchWeb.js";
import { recallMemory } from "./tools/recallMemory.js";
import { ResearchOutputSchema } from "../schemas/research.js";
import type { ResearchOutput } from "../schemas/research.js";
import { ResearchModel } from "../db/models/research.js";
import { SYSTEM_PROMPT } from "./prompts.js";
import { logger } from "../lib/logger.js";

const fireworks = createFireworks({ apiKey: env.FIREWORKS_API_KEY });

export async function runResearchAgent({
  query,
  telegramUserId,
  chatId,
}: {
  query: string;
  telegramUserId: number;
  chatId: number;
}) {
  logger.info({ query, telegramUserId }, "Running research agent");

  const result = await generateText({
    model: fireworks("accounts/fireworks/models/gpt-oss-120b"),
    system: SYSTEM_PROMPT,
    prompt: query,
    tools: {
      crawlUrl,
      searchWeb,
      recallMemory: recallMemory(telegramUserId),
    },
    maxSteps: 5,
  });

  const text = result.text;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in model response");
  }

  const parsed = ResearchOutputSchema.safeParse(JSON.parse(jsonMatch[0]));

  if (!parsed.success) {
    logger.error({ error: parsed.error, text }, "Failed to parse research output");
    throw new Error("Invalid research output schema");
  }

  const output: ResearchOutput = parsed.data;

  await ResearchModel.create({
    telegramUserId,
    chatId,
    query,
    output,
  });

  return output;
}
