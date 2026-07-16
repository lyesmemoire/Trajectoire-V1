import { ScoreSignal, AnswerEvaluation } from "../../domain/types.js";
import { SerializationError } from "../errors/ProviderErrors.js";

export class EvaluationMapper {
  static fromJSON(jsonString: string): AnswerEvaluation {
    try {
      const parsed = JSON.parse(jsonString);
      
      if (typeof parsed.score !== "number" || typeof parsed.completeness !== "boolean" || typeof parsed.analysis !== "string") {
        throw new Error("Missing required fields in Evaluation JSON");
      }

      const score = ScoreSignal.create(parsed.score);
      return AnswerEvaluation.create(score, parsed.completeness, parsed.analysis);
    } catch (error) {
      throw new SerializationError("Failed to parse evaluation response", error);
    }
  }
}
