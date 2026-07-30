import { describe, it, expect } from "vitest";
import { NormalizerEngine, NormalizerManifest } from "../../apps/web/src/lib/ai/engines/NormalizerEngine";
import { EngineInput } from "../../apps/web/src/lib/ai/contracts/Engine";

describe("Phase A.5 - NormalizerEngine Tests", () => {
  it("should have correct manifest", () => {
    expect(NormalizerManifest.id).toBe("normalizer");
    expect(NormalizerManifest.version).toBe("1.0.0");
    expect(NormalizerManifest.consumes).toEqual(["RawTranscript"]);
    expect(NormalizerManifest.produces).toEqual(["NormalizedText"]);
    expect(NormalizerManifest.events).toEqual(["TextNormalized"]);
    expect(NormalizerManifest.timeout).toBe(5000);
    expect(NormalizerManifest.retries).toBe(2);
  });

  it("should remove hesitations", async () => {
    const engine = new NormalizerEngine();
    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        rawText: "euh je pense que hum c'est une bonne idée ben oui",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].payload.normalizedText).not.toContain("euh");
    expect(result.events[0].payload.normalizedText).not.toContain("hum");
    expect(result.events[0].payload.normalizedText).not.toContain("ben");
  });

  it("should add basic punctuation", async () => {
    const engine = new NormalizerEngine();
    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        rawText: "c'est une bonne idée",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].payload.normalizedText).toMatch(/[.!?]$/);
  });

  it("should normalize Unicode", async () => {
    const engine = new NormalizerEngine();
    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        rawText: "café résumé naïve",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].payload.normalizedText).toBeDefined();
  });

  it("should clean extra whitespace", async () => {
    const engine = new NormalizerEngine();
    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        rawText: "c'est   une   bonne   idée",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].payload.normalizedText).not.toContain("  ");
  });

  it("should segment sentences", async () => {
    const engine = new NormalizerEngine();
    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        rawText: "c'est une bonne idée. c'est important.",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    const normalized = result.events[0].payload.normalizedText;
    expect(normalized).toContain("\n");
  });

  it("should emit TextNormalizedEvent", async () => {
    const engine = new NormalizerEngine();
    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        rawText: "test text",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].eventType).toBe("TEXT_NORMALIZED");
    expect(result.events[0].payload).toHaveProperty("normalizedText");
  });

  it("should handle empty text", async () => {
    const engine = new NormalizerEngine();
    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        rawText: "",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].payload.normalizedText).toBeDefined();
  });

  it("should handle text with only hesitations", async () => {
    const engine = new NormalizerEngine();
    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        rawText: "euh hum ben euhm",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    expect(result.events[0].payload.normalizedText).not.toContain("euh");
    expect(result.events[0].payload.normalizedText).not.toContain("hum");
    expect(result.events[0].payload.normalizedText).not.toContain("ben");
  });

  it("should preserve meaningful content", async () => {
    const engine = new NormalizerEngine();
    const input: EngineInput<{ sessionId: string }, { rawText: string }> = {
      sessionId: "test-session",
      context: { sessionId: "test-session" },
      payload: {
        rawText: "j'ai 5 ans d'expérience en développement",
      },
    };

    const result = await engine.execute(input);
    expect(result.events.length).toBe(1);
    const normalized = result.events[0].payload.normalizedText;
    expect(normalized).toContain("5");
    expect(normalized).toContain("expérience");
    expect(normalized).toContain("développement");
  });
});
