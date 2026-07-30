export interface SafetyValidationResult {
  isValid: boolean;
  reason?: string;
  suggestedAction?: string;
}

export class SafetyLayer {
  /**
   * Validates the generated question before sending it to the candidate.
   * Checks for discrimination, illegal questions, repetition, and rule compliance.
   */
  public validateQuestion(question: string, history: string[]): SafetyValidationResult {
    // Basic heuristics for safety layer.
    // In a real implementation, this could call a fast LLM or use NLP rules.
    const forbiddenKeywords = ["age", "religion", "marié", "enfants", "grossesse"];
    
    const lowerQuestion = question.toLowerCase();
    for (const keyword of forbiddenKeywords) {
      if (lowerQuestion.includes(keyword)) {
        return {
          isValid: false,
          reason: `Question contains potentially discriminatory topic: ${keyword}`,
          suggestedAction: "REJECT"
        };
      }
    }

    // Check repetition
    for (const pastQuestion of history) {
      if (pastQuestion.toLowerCase() === lowerQuestion) {
        return {
          isValid: false,
          reason: "Question is a direct repetition.",
          suggestedAction: "REGENERATE"
        };
      }
    }

    return { isValid: true };
  }
}
