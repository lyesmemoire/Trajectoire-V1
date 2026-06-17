// runtime/question-engine/__tests__/TopicSelector.test.ts
/**
 * Unit tests for TopicSelector – ensures deterministic behavior.
 * Uses jest mocking for scoring primitives which are placeholder implementations.
 */
import { selectTopic, TopicSelectorConfig } from "../selectors/TopicSelector";
import type { TopicGraphSnapshot } from "../../types/graph";
import type { PromptBudgetResult } from "../../types/prompt";

// Mock scoring functions – they are imported by the selector.
jest.mock("../scoring/computePriorityScore", () => ({
  computePriorityScore: jest.fn(),
}));
jest.mock("../scoring/computeNoveltyScore", () => ({
  computeNoveltyScore: jest.fn(),
}));
jest.mock("../scoring/computeCoverageScore", () => ({
  computeCoverageScore: jest.fn(),
}));
jest.mock("../scoring/computeFatigueScore", () => ({
  computeFatigueScore: jest.fn(),
}));
jest.mock("../scoring/computeContradictionPenalty", () => ({
  computeContradictionPenalty: jest.fn(),
}));

// Import the mocked functions for setting return values.
import { computePriorityScore } from "../scoring/computePriorityScore";
import { computeNoveltyScore } from "../scoring/computeNoveltyScore";
import { computeCoverageScore } from "../scoring/computeCoverageScore";
import { computeFatigueScore } from "../scoring/computeFatigueScore";
import { computeContradictionPenalty } from "../scoring/computeContradictionPenalty";

const dummyBudget: PromptBudgetResult = {
  memoryEntries: [],
  topicNodes: [],
  contradictions: [],
  weakSignals: [],
  recentEvents: [],
  report: {
    initialMemoryEntries: 0,
    finalMemoryEntries: 0,
    initialTopics: 0,
    finalTopics: 0,
    initialContradictions: 0,
    finalContradictions: 0,
    initialWeakSignals: 0,
    finalWeakSignals: 0,
    initialRecentEvents: 0,
    finalRecentEvents: 0,
    removedMemoryEntries: 0,
    removedTopics: 0,
    removedContradictions: 0,
    removedWeakSignals: 0,
    removedRecentEvents: 0,
    appliedStrategies: [],
    initialTokenEstimate: 0,
    finalTokenEstimate: 0,
    truncated: false,
  },
};

describe("TopicSelector deterministic behavior", () => {
  const baseSnapshot: TopicGraphSnapshot = {
    version: "1.0.0",
    createdAt: Date.now(),
    nodes: [
      { id: "a" as any, topic: "Alpha", saturationScore: 0 },
      { id: "b" as any, topic: "Beta", saturationScore: 0 },
    ],
    edges: [],
  } as any;

  const config: TopicSelectorConfig = { explorationFactor: 0 };

  beforeEach(() => {
    // Default mock returns – same for all nodes.
    (computePriorityScore as jest.Mock).mockReturnValue(10);
    (computeNoveltyScore as jest.Mock).mockReturnValue(0);
    (computeCoverageScore as jest.Mock).mockReturnValue(5);
    (computeFatigueScore as jest.Mock).mockReturnValue(0);
    (computeContradictionPenalty as jest.Mock).mockReturnValue(0);
  });

  test("same input yields same output (determinism)", () => {
    const result1 = selectTopic(baseSnapshot, dummyBudget, config);
    const result2 = selectTopic(baseSnapshot, dummyBudget, config);
    expect(result1).toEqual(result2);
  });

  test("lexical tie‑break when scores equal", () => {
    // All scores equal – selector should pick lexical smallest id 'a'.
    const result = selectTopic(baseSnapshot, dummyBudget, config);
    expect(result.value).toBe("a");
    expect(result.rejected).toContain("b");
  });

  test("explorationFactor influences novelty weighting", () => {
    // Override novelty scores to differentiate nodes.
    (computePriorityScore as jest.Mock).mockReturnValue(10);
    (computeCoverageScore as jest.Mock).mockReturnValue(5);
    (computeNoveltyScore as jest.Mock).mockImplementation(({ node }) =>
      node.id === "a" ? 2 : 0,
    );
    const explConfig: TopicSelectorConfig = { explorationFactor: 1 };
    const result = selectTopic(baseSnapshot, dummyBudget, explConfig);
    // Node 'a' gets extra novelty weight, should be selected.
    expect(result.value).toBe("a");
  });

  test("saturation filtering removes fully saturated topics", () => {
    const saturatedSnapshot = {
      ...baseSnapshot,
      nodes: [
        { id: "a" as any, topic: "Alpha", saturationScore: 1 }, // saturated
        { id: "b" as any, topic: "Beta", saturationScore: 0 },
      ],
    } as any;
    const result = selectTopic(saturatedSnapshot, dummyBudget, config);
    expect(result.value).toBe("b");
    expect(result.rejected).toEqual([]);
  });

  test("contradiction penalty lowers ranking", () => {
    (computePriorityScore as jest.Mock).mockReturnValue(10);
    (computeCoverageScore as jest.Mock).mockReturnValue(5);
    (computeNoveltyScore as jest.Mock).mockReturnValue(0);
    (computeFatigueScore as jest.Mock).mockReturnValue(0);
    // Node 'a' gets penalty 5, node 'b' gets 0 -> b should win.
    (computeContradictionPenalty as jest.Mock).mockImplementation(({ node }) =>
      node.id === "a" ? 5 : 0,
    );
    const result = selectTopic(baseSnapshot, dummyBudget, config);
    expect(result.value).toBe("b");
  });

  test("result is deep‑frozen (immutable)", () => {
    const result = selectTopic(baseSnapshot, dummyBudget, config);
    expect(Object.isFrozen(result)).toBe(true);
    // Attempting mutation should throw in strict mode – we just ensure freeze.
  });
});
