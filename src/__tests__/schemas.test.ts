import { describe, it, expect } from "vitest";
import { ResearchOutputSchema, SourceSchema } from "../schemas/research.js";

describe("SourceSchema", () => {
  it("validates a valid source", () => {
    const result = SourceSchema.safeParse({
      title: "Test",
      relevance: "high",
    });
    expect(result.success).toBe(true);
  });

  it("validates source with url", () => {
    const result = SourceSchema.safeParse({
      url: "https://example.com",
      title: "Test",
      relevance: "medium",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid relevance", () => {
    const result = SourceSchema.safeParse({
      title: "Test",
      relevance: "invalid",
    });
    expect(result.success).toBe(false);
  });
});

describe("ResearchOutputSchema", () => {
  it("validates complete output", () => {
    const result = ResearchOutputSchema.safeParse({
      summary: "Test summary",
      keyPoints: ["Point 1", "Point 2"],
      sources: [{ title: "Source 1", relevance: "high" }],
      topic: "Test Topic",
      confidence: "high",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty keyPoints", () => {
    const result = ResearchOutputSchema.safeParse({
      summary: "Test",
      keyPoints: [],
      sources: [],
      topic: "Test",
      confidence: "low",
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 10 keyPoints", () => {
    const result = ResearchOutputSchema.safeParse({
      summary: "Test",
      keyPoints: Array(11).fill("point"),
      sources: [],
      topic: "Test",
      confidence: "low",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid confidence", () => {
    const result = ResearchOutputSchema.safeParse({
      summary: "Test",
      keyPoints: ["point"],
      sources: [],
      topic: "Test",
      confidence: "very-high",
    });
    expect(result.success).toBe(false);
  });
});
