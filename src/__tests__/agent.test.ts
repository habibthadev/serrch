import { describe, it, expect } from "vitest";
import { SYSTEM_PROMPT } from "../agent/prompts.js";

describe("prompts", () => {
  it("includes blocked site guidance", () => {
    expect(SYSTEM_PROMPT).toContain("ok: false");
    expect(SYSTEM_PROMPT).toContain("blocked");
  });

  it("instructs JSON output", () => {
    expect(SYSTEM_PROMPT).toContain("JSON object");
    expect(SYSTEM_PROMPT).toContain("summary");
    expect(SYSTEM_PROMPT).toContain("keyPoints");
    expect(SYSTEM_PROMPT).toContain("sources");
    expect(SYSTEM_PROMPT).toContain("confidence");
  });

  it("covers all tool flows", () => {
    expect(SYSTEM_PROMPT).toContain("crawlUrl");
    expect(SYSTEM_PROMPT).toContain("searchWeb");
    expect(SYSTEM_PROMPT).toContain("recallMemory");
  });
});
