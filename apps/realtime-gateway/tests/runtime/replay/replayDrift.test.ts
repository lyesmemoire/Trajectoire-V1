// tests/runtime/replay/replayDrift.test.ts
/**
 * Replay Drift Test
 * Verifies that running the deterministic pipeline twice with identical inputs
 * produces identical runtime graph, hashes, state, and byte‑wise serialization.
 */
import { SimpleDeterministicClock } from "../../../tests/helpers/deterministicClock";
import { selectTopic } from "../../../src/interview/runtime/question-engine/selectors/TopicSelector";
import { selectDifficulty } from "../../../src/interview/runtime/question-engine/selectors/DifficultySelector";
import { selectObjective } from "../../../src/interview/runtime/question-engine/selectors/ObjectiveSelector";
import { computeRuntimeStateHash } from "../../../src/interview/runtime/question-engine/utils/computeRuntimeStateHash";
import { stableSerialize } from "../../../src/interview/runtime/utils/hash";
import { hashObjectStable } from "../../../src/interview/runtime/utils/hash";

/**
 * Helper to execute the simplified deterministic pipeline.
 * Returns an object containing the final state and deterministic hashes.
 */
function runPipeline(clockStart = 0) {
  // deterministic clock
  const clock = new SimpleDeterministicClock(clockStart);

  // fixed empty signal registry (extend as needed)
  const signals = {} as unknown;

  // mock context – only includes clock and signals for selectors
  const baseContext = { clock, signals } as unknown;

  // Run selectors in deterministic order
  const topicResult = selectTopic(
    baseContext,
    { nodes: [{ id: "t1", saturationScore: 0 }] } as unknown,
    {} as unknown,
    { explorationFactor: 0 } as unknown,
  );
  const difficultyResult = (selectDifficulty as unknown)(
    baseContext,
    {} as unknown,
    {} as unknown,
    {} as unknown,
  );
  const objectiveResult = (selectObjective as unknown)(
    baseContext,
    {} as unknown,
    {} as unknown,
    {} as unknown,
  );

  // Assemble a simple final state from selector outputs
  const finalState = {
    selectedTopicId: (topicResult.value as unknown).selectedTopicId,
    topicConfidence: topicResult.confidence,
    difficulty: (difficultyResult.value as unknown).difficulty,
    objective: (objectiveResult.value as unknown).objective,
    // include deterministic clock timestamp for completeness
    timestamp: clock.now,
  } as const;

  // Compute deterministic hashes
  const stateHash = computeRuntimeStateHash(finalState as unknown);
  const pipelineReplayChecksum = hashObjectStable({
    topicResult,
    difficultyResult,
    objectiveResult,
  });
  const traceHash = hashObjectStable({
    topicTrace: topicResult.traceEvents,
    difficultyTrace: difficultyResult.traceEvents,
    objectiveTrace: objectiveResult.traceEvents,
  });

  return { finalState, stateHash, pipelineReplayChecksum, traceHash };
}

describe("replayDrift – deterministic pipeline", () => {
  test("same input yields identical runtime graph and hashes", () => {
    const runA = runPipeline(0);
    const runB = runPipeline(0);

    // A. final state equality
    expect(runA.finalState).toStrictEqual(runB.finalState);

    // B. state hash equality
    expect(runA.stateHash).toBe(runB.stateHash);

    // C. replay checksum equality
    expect(runA.pipelineReplayChecksum).toBe(runB.pipelineReplayChecksum);

    // D. trace hash equality
    expect(runA.traceHash).toBe(runB.traceHash);

    // E. byte‑wise serialization equality
    expect(stableSerialize(runA.finalState)).toBe(
      stableSerialize(runB.finalState),
    );
  });
});
