// @ts-nocheck
import type { TextEvaluationPort, EvaluationContextDTO } from "../../application/ports/AIPorts.js";
import type { AnswerEvaluation } from "../../domain/types.js";
import * as crypto from "crypto";

export interface CacheBackend {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
}

export class CachingDecorator implements TextEvaluationPort {
  constructor(private delegate: TextEvaluationPort, private cache: CacheBackend) {}

  async evaluateAnswer(transcript: string, context: EvaluationContextDTO): Promise<AnswerEvaluation> {
    const hash = crypto.createHash("sha256").update(transcript).digest("hex");
    const key = `eval:${context.targetRole}:${context.currentPhase}:${hash}`;

    const cached = await this.cache.get(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Reconstruct value object using factory
      return {
        score: { value: parsed.score },
        completeness: parsed.completeness,
        analysis: parsed.analysis
      };
    }

    const result = await this.delegate.evaluateAnswer(transcript, context);
    await this.cache.set(key, JSON.stringify({
      score: result.score.value,
      completeness: result.completeness,
      analysis: result.analysis
    }), 3600); // 1 hour TTL

    return result;
  }
}
