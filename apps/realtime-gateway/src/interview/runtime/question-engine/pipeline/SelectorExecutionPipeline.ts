// runtime/question-engine/pipeline/SelectorExecutionPipeline.ts

import {
  BaseSelectorContext,
  ObjectiveSelectorContext,
  withContext,
} from "../selectors/shared/selectorContext";
import { DecisionTraceStore } from "../trace/DecisionTraceStore";

import type { SelectorResultEnvelope } from "../../contracts/selectors/SelectorResultEnvelope";
import { SelectorExecutionResult } from "./SelectorExecutionResult";
import { PipelineExecutionId } from "./PipelineExecutionId";
import { SelectorExecutionStep } from "./SelectorExecutionStep";
import { hashObjectStable } from "../../utils/hash";
import { selectTopic, TopicSelectorConfig } from "../selectors/TopicSelector";
import { selectDifficulty, DifficultySelectorConfig } from "../selectors/DifficultySelector";
import { selectObjective } from "../selectors/ObjectiveSelector";
import { TopicGraphSnapshot } from "../../types/graph";
import { PromptBudgetResult } from "../../types/prompt";

export interface PipelineConfig {
  topicConfig: TopicSelectorConfig;
  difficultyConfig: DifficultySelectorConfig;
}

/**
 * Deterministic orchestrator for selector execution pipeline.
 * Executes Topic → Difficulty → Objective selectors, all returning strict SelectorResultEnvelope values.
 */
export class SelectorExecutionPipeline {
  constructor(private readonly traceStore: DecisionTraceStore) {}

  private generateExecutionId(ctx: BaseSelectorContext): PipelineExecutionId {
    return hashObjectStable({
      timestamp: ctx.clock.now(),
      phase: ctx.interviewPhase,
    }) as unknown as PipelineExecutionId;
  }

  public async execute(
    baseCtx: BaseSelectorContext,
    snapshot: TopicGraphSnapshot,
    budgetResult: PromptBudgetResult,
    config: PipelineConfig,
  ): Promise<SelectorExecutionResult> {
    const executionId = this.generateExecutionId(baseCtx);
    const pipelineStart = baseCtx.clock.now();

    const steps: SelectorExecutionStep[] = [];

    // Topic selector
    const topicEnv = selectTopic(baseCtx, snapshot, budgetResult, config.topicConfig);
    this.persistTraces(topicEnv.traceEvents);
    steps.push(this.mapEnvelopeToStep(topicEnv, pipelineStart, baseCtx.clock.now()));

    // Difficulty selector
    const diffEnv = selectDifficulty(topicEnv.value, config.difficultyConfig);
    this.persistTraces(diffEnv.traceEvents);
    steps.push(this.mapEnvelopeToStep(diffEnv, baseCtx.clock.now(), baseCtx.clock.now()));

    // Objective selector
    const objectiveCtx = withContext<ObjectiveSelectorContext>(topicEnv.value, {
      selectedDifficulty: diffEnv.value,
      difficultyConfidence: diffEnv.confidence,
    });
    const objEnv = selectObjective(objectiveCtx);
    this.persistTraces(objEnv.traceEvents);
    steps.push(this.mapEnvelopeToStep(objEnv, baseCtx.clock.now(), baseCtx.clock.now()));

    const pipelineEnd = baseCtx.clock.now();
    const pipelineHash = hashObjectStable(steps.map((s) => s.stepHash));

    const finalContext = objectiveCtx;
    return Object.freeze({
      executionId,
      pipelineHash,
      totalDurationMs: pipelineEnd - pipelineStart,
      steps: Object.freeze(steps),
      finalContext,
    });
  }

  private mapEnvelopeToStep(
    env: SelectorResultEnvelope<any>,
    start: number,
    end: number,
  ): SelectorExecutionStep {
    return Object.freeze({
      // Cast to SelectorName to satisfy strict typing
      selectorName: env.selectorName as unknown as import("../models/SelectorName").SelectorName,
      selectorVersion: env.selectorVersion,
      startTimestamp: start,
      endTimestamp: end,
      durationMs: end - start,
      confidence: env.confidence,
      chosenValue: env.value,
      rejectedValues: [],
      policyOverridesApplied: [],
      inputContextHash: env.inputHash,
      outputContextHash: env.outputHash,
      stepHash: hashObjectStable({
        name: env.selectorName,
        in: env.inputHash,
        out: env.outputHash,
      }),
    });
  }

  private persistTraces(events: readonly any[]): void {
    for (const event of events) {
      this.traceStore.record(event);
    }
  }
}
