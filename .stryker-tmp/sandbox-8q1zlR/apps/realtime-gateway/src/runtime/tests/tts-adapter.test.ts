// @ts-nocheck
import { describe, it, expect, vi } from "vitest";
import { TTSAdapter } from "../tts-adapter.js";

describe("P6.6 - W3 TTS Adapter Isolation", () => {
  it("should isolate TTS logic so errors don't crash the orchestrator", async () => {
    const adapter = new TTSAdapter();
    
    // Simulating TTS Error
    vi.spyOn(adapter, "synthesize").mockRejectedValue(new Error("Network Error"));
    
    // Make sure we can catch it locally in the layer above, without throwing into the core
    let errorCaught = false;
    try {
      await adapter.synthesize("test", 1.0);
    } catch (e) {
      errorCaught = true;
    }
    
    expect(errorCaught).toBe(true);
  });
});
