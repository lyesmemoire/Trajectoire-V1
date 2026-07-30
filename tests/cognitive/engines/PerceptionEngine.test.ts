import { describe, it, expect } from "vitest";
import { z } from "zod";
import { PerceptionEngine } from "../../../apps/web/src/lib/ai/engines/perception/PerceptionEngine";
import { StructuredLLMProvider } from "../../../apps/web/src/lib/ai/contracts/LLMProvider";
import { PerceptionOutput, ObservationType } from "../../../apps/web/src/lib/ai/engines/perception/PerceptionTypes";

// ===================================================================
// MOCK LLM PROVIDER
// ===================================================================

class MockLLMProvider implements StructuredLLMProvider {
  constructor(private readonly mockResponses: Record<string, PerceptionOutput>) {}

  async generateObject<T>(params: {
    system: string;
    prompt: string;
    schema: z.ZodSchema<T>;
    schemaName: string;
    schemaDescription: string;
  }): Promise<{
    object: T;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    // Find a matching mock response based on the candidate's answer in the prompt
    let response: PerceptionOutput = { observations: [] };
    
    for (const [key, value] of Object.entries(this.mockResponses)) {
      if (params.prompt.includes(key)) {
        response = value;
        break;
      }
    }

    // Cast response to T as we trust the mock matches the schema
    return {
      object: response as unknown as T,
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    };
  }
}

describe("PerceptionEngine", () => {
  const sessionId = crypto.randomUUID();

  // Define the mock outputs corresponding to the test cases
  const mockResponses: Record<string, PerceptionOutput> = {
    // Cas 1
    "I worked with React.": {
      observations: [
        {
          id: crypto.randomUUID(),
          type: "CLAIM",
          quote: "I worked with React.",
          normalizedFact: "Worked with React",
          confidence: 0.9,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          technologies: ["React"],
          entities: [], numbers: [], competenciesMentioned: [],
          projects: [], companies: [], metrics: [], dates: [], locations: [],
          sourceQuestion: null,
        },
      ],
    },
    // Cas 2
    "I migrated 180 services to Kubernetes.": {
      observations: [
        {
          id: crypto.randomUUID(),
          type: "FACT",
          quote: "I migrated 180 services to Kubernetes.",
          normalizedFact: "Migrated 180 services to Kubernetes",
          confidence: 0.95,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          technologies: ["Kubernetes"],
          metrics: ["180 services"],
          numbers: [180],
          entities: [], competenciesMentioned: [],
          projects: [], companies: [], dates: [], locations: [],
          sourceQuestion: null,
        },
        {
          id: crypto.randomUUID(),
          type: "METRIC",
          quote: "180 services",
          normalizedFact: "Handled 180 services",
          confidence: 0.95,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          metrics: ["180 services"], numbers: [180],
          entities: [], technologies: [], competenciesMentioned: [],
          projects: [], companies: [], dates: [], locations: [],
          sourceQuestion: null,
        },
        {
          id: crypto.randomUUID(),
          type: "TECHNOLOGY",
          quote: "Kubernetes",
          normalizedFact: "Used Kubernetes",
          confidence: 0.95,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          technologies: ["Kubernetes"],
          entities: [], numbers: [], competenciesMentioned: [],
          projects: [], companies: [], metrics: [], dates: [], locations: [],
          sourceQuestion: null,
        },
        {
          id: crypto.randomUUID(),
          type: "RESPONSIBILITY",
          quote: "I migrated",
          normalizedFact: "Responsible for migration",
          confidence: 0.95,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          entities: [], numbers: [], technologies: [], competenciesMentioned: [],
          projects: [], companies: [], metrics: [], dates: [], locations: [],
          sourceQuestion: null,
        }
      ],
    },
    // Cas 3
    "We reduced latency from 400ms to 40ms.": {
      observations: [
        {
          id: crypto.randomUUID(),
          type: "METRIC",
          quote: "reduced latency from 400ms to 40ms",
          normalizedFact: "Reduced latency from 400ms to 40ms",
          confidence: 0.95,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          metrics: ["400ms to 40ms latency reduction"],
          numbers: [400, 40],
          entities: [], technologies: [], competenciesMentioned: [],
          projects: [], companies: [], dates: [], locations: [],
          sourceQuestion: null,
        },
        {
          id: crypto.randomUUID(),
          type: "SUCCESS",
          quote: "reduced latency",
          normalizedFact: "Successfully reduced latency",
          confidence: 0.9,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          entities: [], numbers: [], technologies: [], competenciesMentioned: [],
          projects: [], companies: [], metrics: [], dates: [], locations: [],
          sourceQuestion: null,
        },
        {
          id: crypto.randomUUID(),
          type: "DECISION",
          quote: "We reduced",
          normalizedFact: "Decided to reduce latency",
          confidence: 0.8,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          entities: [], numbers: [], technologies: [], competenciesMentioned: [],
          projects: [], companies: [], metrics: [], dates: [], locations: [],
          sourceQuestion: null,
        }
      ],
    },
    // Cas 4
    "I think I'm good at leadership.": {
      observations: [
        {
          id: crypto.randomUUID(),
          type: "CLAIM",
          quote: "I think I'm good at leadership.",
          normalizedFact: "Claims to be good at leadership",
          confidence: 0.9,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          competenciesMentioned: ["leadership"],
          entities: [], numbers: [], technologies: [],
          projects: [], companies: [], metrics: [], dates: [], locations: [],
          sourceQuestion: null,
        },
      ],
    },
    // Cas 5
    "I don't remember.": {
      observations: [
        {
          id: crypto.randomUUID(),
          type: "UNKNOWN",
          quote: "I don't remember.",
          normalizedFact: "Does not remember",
          confidence: 0.9,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          entities: [], numbers: [], technologies: [], competenciesMentioned: [],
          projects: [], companies: [], metrics: [], dates: [], locations: [],
          sourceQuestion: null,
        },
      ],
    },
    // Cas 6
    "We had a production outage.": {
      observations: [
        {
          id: crypto.randomUUID(),
          type: "FAILURE",
          quote: "We had a production outage.",
          normalizedFact: "Experienced a production outage",
          confidence: 0.9,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          entities: [], numbers: [], technologies: [], competenciesMentioned: [],
          projects: [], companies: [], metrics: [], dates: [], locations: [],
          sourceQuestion: null,
        },
      ],
    },
    // Cas 7
    "I was responsible for 12 engineers.": {
      observations: [
        {
          id: crypto.randomUUID(),
          type: "RESPONSIBILITY",
          quote: "I was responsible for 12 engineers.",
          normalizedFact: "Responsible for 12 engineers",
          confidence: 0.9,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          numbers: [12], metrics: ["12 engineers"],
          entities: [], technologies: [], competenciesMentioned: [],
          projects: [], companies: [], dates: [], locations: [],
          sourceQuestion: null,
        },
        {
          id: crypto.randomUUID(),
          type: "METRIC",
          quote: "12 engineers",
          normalizedFact: "Managed 12 engineers",
          confidence: 0.9,
          speaker: "CANDIDATE",
          messageIndex: 1,
          timestamp: new Date().toISOString(),
          numbers: [12], metrics: ["12 engineers"],
          entities: [], technologies: [], competenciesMentioned: [],
          projects: [], companies: [], dates: [], locations: [],
          sourceQuestion: null,
        },
      ],
    },
  };

  const provider = new MockLLMProvider(mockResponses);
  const engine = new PerceptionEngine(provider);

  const runEngine = async (answer: string) => {
    return engine.execute({
      sessionId,
      context: { currentQuestion: "Tell me about your experience.", messageIndex: 1 },
      payload: { candidateAnswer: answer },
    });
  };

  it("Cas 1: 'I worked with React.' -> CLAIM", async () => {
    const result = await runEngine("I worked with React.");
    const types = result.events.map((e) => e.payload.type);
    
    expect(types).toContain("CLAIM");
    expect(types).not.toContain("FACT");
    expect(result.events[0].payload.technologies).toContain("React");
  });

  it("Cas 2: 'I migrated 180 services to Kubernetes.' -> FACT, METRIC, TECHNOLOGY, RESPONSIBILITY", async () => {
    const result = await runEngine("I migrated 180 services to Kubernetes.");
    const types = result.events.map((e) => e.payload.type);
    
    expect(types).toContain("FACT");
    expect(types).toContain("METRIC");
    expect(types).toContain("TECHNOLOGY");
    expect(types).toContain("RESPONSIBILITY");
    
    const factEvent = result.events.find((e) => e.payload.type === "FACT");
    expect(factEvent?.payload.metrics).toContain("180 services");
    expect(factEvent?.payload.technologies).toContain("Kubernetes");
  });

  it("Cas 3: 'We reduced latency from 400ms to 40ms.' -> METRIC, SUCCESS, DECISION", async () => {
    const result = await runEngine("We reduced latency from 400ms to 40ms.");
    const types = result.events.map((e) => e.payload.type);
    
    expect(types).toContain("METRIC");
    expect(types).toContain("SUCCESS"); // Treating Improvement as Success
    expect(types).toContain("DECISION");
  });

  it("Cas 4: 'I think I'm good at leadership.' -> CLAIM", async () => {
    const result = await runEngine("I think I'm good at leadership.");
    const types = result.events.map((e) => e.payload.type);
    
    expect(types).toContain("CLAIM");
    expect(types).not.toContain("FACT");
  });

  it("Cas 5: 'I don't remember.' -> UNKNOWN", async () => {
    const result = await runEngine("I don't remember.");
    const types = result.events.map((e) => e.payload.type);
    
    expect(types).toContain("UNKNOWN");
  });

  it("Cas 6: 'We had a production outage.' -> FAILURE", async () => {
    const result = await runEngine("We had a production outage.");
    const types = result.events.map((e) => e.payload.type);
    
    expect(types).toContain("FAILURE");
  });

  it("Cas 7: 'I was responsible for 12 engineers.' -> RESPONSIBILITY, METRIC", async () => {
    const result = await runEngine("I was responsible for 12 engineers.");
    const types = result.events.map((e) => e.payload.type);
    
    expect(types).toContain("RESPONSIBILITY");
    expect(types).toContain("METRIC");
  });

  it("Ensures the Engine outputs match the EngineResult contract", async () => {
    const result = await runEngine("I worked with React.");
    
    expect(result.engine).toBe("PerceptionEngine");
    expect(result.version).toBe("1.0.0");
    expect(result.tokens).toHaveProperty("total");
    expect(result.events.length).toBeGreaterThan(0);
    
    const event = result.events[0];
    expect(event.eventType).toBe("OBSERVATION_EXTRACTED");
    expect(event.sessionId).toBe(sessionId);
    expect(event.payload.quote).toBeDefined();
    expect(event.createdAt).toBeInstanceOf(Date);
  });
});
