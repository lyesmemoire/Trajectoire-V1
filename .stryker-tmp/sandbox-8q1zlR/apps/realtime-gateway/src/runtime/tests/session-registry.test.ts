// @ts-nocheck
import { describe, it, expect } from "vitest";
import { RuntimeBootstrap } from "../runtime-bootstrap.js";

describe("P6.6 - W2 Session Registry Rejection", () => {
  it("should reject WS messages if session is unknown", async () => {
    const bootstrap = new RuntimeBootstrap();
    
    // We do NOT register "s1"
    
    await expect(bootstrap.processWebSocketMessage("s1", { event: "msg", payload: {} }))
      .rejects.toThrow("Session not found in registry");
  });
});
