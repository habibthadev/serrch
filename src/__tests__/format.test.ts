import { describe, it, expect } from "vitest";
import { formatOutput, chunkMessage } from "../bot/utils/format.js";
import type { ResearchOutput } from "../schemas/research.js";

describe("formatOutput", () => {
  it("formats research output to markdown", () => {
    const output: ResearchOutput = {
      summary: "TypeScript is a typed superset of JavaScript.",
      keyPoints: ["Static typing", "Compiles to JS", "Large ecosystem"],
      sources: [
        { title: "TypeScript Docs", url: "https://typescriptlang.org", relevance: "high" },
      ],
      topic: "TypeScript",
      confidence: "high",
    };

    const result = formatOutput(output);

    expect(result).toContain("**TypeScript**");
    expect(result).toContain("TypeScript is a typed superset");
    expect(result).toContain("- Static typing");
    expect(result).toContain("- TypeScript Docs");
    expect(result).toContain("Confidence: high");
  });

  it("handles sources without URLs", () => {
    const output: ResearchOutput = {
      summary: "Test summary",
      keyPoints: ["Point 1"],
      sources: [{ title: "No URL Source", relevance: "medium" }],
      topic: "Test",
      confidence: "medium",
    };

    const result = formatOutput(output);
    expect(result).toContain("- No URL Source");
    expect(result).not.toContain("<");
  });

  it("encodes underscores in URLs to prevent Markdown italics", () => {
    const output: ResearchOutput = {
      summary: "Test",
      keyPoints: ["Point"],
      sources: [
        { title: "Wiki", url: "https://en.wikipedia.org/wiki/GNI_(nominal)_per_capita", relevance: "high" },
      ],
      topic: "Test",
      confidence: "high",
    };

    const result = formatOutput(output);
    expect(result).toContain("%5Fper%5Fcapita");
    expect(result).not.toContain("_per_capita");
  });
});

describe("chunkMessage", () => {
  it("returns single chunk for short messages", () => {
    const chunks = chunkMessage("hello", 10);
    expect(chunks).toEqual(["hello"]);
  });

  it("splits long messages into chunks", () => {
    const chunks = chunkMessage("abcdefghij", 4);
    expect(chunks).toEqual(["abcd", "efgh", "ij"]);
  });

  it("handles exact chunk size", () => {
    const chunks = chunkMessage("abcd", 4);
    expect(chunks).toEqual(["abcd"]);
  });
});
