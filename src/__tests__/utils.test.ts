import { describe, it, expect, vi } from "vitest";
import { chunkMessage } from "../bot/utils/format.js";

describe("chunkMessage", () => {
  it("handles empty string", () => {
    expect(chunkMessage("", 10)).toEqual([]);
  });

  it("handles strings shorter than chunk size", () => {
    expect(chunkMessage("hi", 10)).toEqual(["hi"]);
  });

  it("produces correct number of chunks", () => {
    const chunks = chunkMessage("abcdefghijklmno", 5);
    expect(chunks.length).toBe(3);
    expect(chunks[0]).toBe("abcde");
    expect(chunks[1]).toBe("fghij");
    expect(chunks[2]).toBe("klmno");
  });
});

describe("dedup updates", () => {
  it("tracks and skips duplicate update IDs", async () => {
    const { dedupUpdates } = await import("../bot/middleware/dedup.js");
    const next = vi.fn();

    const ctx1 = { update: { update_id: 1 } } as any;
    const ctx2 = { update: { update_id: 1 } } as any;

    await dedupUpdates(ctx1, next);
    expect(next).toHaveBeenCalledTimes(1);

    await dedupUpdates(ctx2, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
