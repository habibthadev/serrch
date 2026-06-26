import { z } from "zod";

export const SourceSchema = z.object({
  url: z.string().url().optional(),
  title: z.string(),
  relevance: z.enum(["high", "medium", "low"]),
});

export const ResearchOutputSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()).min(1).max(10),
  sources: z.array(SourceSchema),
  topic: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
});

export const ResearchSessionSchema = z.object({
  telegramUserId: z.number(),
  chatId: z.number(),
  query: z.string(),
  output: ResearchOutputSchema,
  createdAt: z.date().default(() => new Date()),
});

export type Source = z.infer<typeof SourceSchema>;
export type ResearchOutput = z.infer<typeof ResearchOutputSchema>;
export type ResearchSession = z.infer<typeof ResearchSessionSchema>;
