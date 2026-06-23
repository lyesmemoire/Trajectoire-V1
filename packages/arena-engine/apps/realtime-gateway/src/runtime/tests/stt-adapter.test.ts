import { describe, it, expect, vi } from "vitest";
import { RuntimeBootstrap } from "../runtime-bootstrap.js";

describe("P6.6 - W4 STT Adapter Isolation", () => {
  it("should catch STT errors without failing the core runtime", async () => {
    const bootstrap = new RuntimeBootstrap();
    bootstrap.registry.add("s1");
    
    // Simulate STT failing
    vi.spyOn(bootstrap.sttAdapter, "recognize").mockRejectedValue(new Error("Audio parse error"));

    await expect(bootstrap.processAudioInput("s1", new Uint8Array()))
      .rejects.toThrow("STT Processing failed"); // Trapped and translated

    // Ensure session is still there and core is untouched
    expect(bootstrap.registry.has("s1")).toBe(true);
  });
});
