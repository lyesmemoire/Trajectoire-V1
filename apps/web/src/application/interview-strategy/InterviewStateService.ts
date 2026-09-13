import { InterviewState, CompetencyState, InterviewStateSchema, CandidateClaim, ClaimConflict } from "@/lib/ai/schemas/interview-state.schema";
import type { AnswerEvaluation } from "@/lib/ai/schemas/answer-evaluation.schema";

export class InterviewStateService {
  /**
   * Initialise l'état stratégique à partir des compétences à tester.
   */
  static initializeState(targetSkills: string[]): InterviewState {
    const uniqueSkills = [...new Set(targetSkills)];
    return {
      competencies: uniqueSkills.map((name) => ({
        name,
        status: "NOT_TESTED",
        evidenceCount: 0,
        bestScore: 0,
        missingEvidence: [],
        attempts: 0,
        lastEvaluatedAtTurn: null,
      })),
      currentCompetency: uniqueSkills.length > 0 ? uniqueSkills[0] : null,
      completedCompetencies: [],
      weakCompetencies: [],
      turnNumber: 0,
      claims: [],
      conflicts: [],
    };
  }

  /**
   * Met à jour l'état suite à une évaluation de réponse.
   */
  static updateState(state: InterviewState, evaluation: AnswerEvaluation): InterviewState {
    const newState = { ...state, turnNumber: state.turnNumber + 1 };

    if (!newState.currentCompetency) return newState;

    const compIndex = newState.competencies.findIndex(c => c.name === newState.currentCompetency);
    if (compIndex === -1) return newState;

    const comp = { ...newState.competencies[compIndex] };

    // Update attempts
    comp.attempts += 1;
    comp.lastEvaluatedAtTurn = newState.turnNumber;
    comp.bestScore = Math.max(comp.bestScore, evaluation.relevanceScore);

    // Filter missing evidence to match our schema enum strictly
    const validEvidence = ["example", "personal_role", "metrics", "result", "clarification", "technical_depth"];
    comp.missingEvidence = evaluation.missingEvidence.filter(e => validEvidence.includes(e)) as any[];

    // Update status based on demonstratedCompetency, but never downgrade a PROVEN
    if (comp.status !== "PROVEN") {
      if (evaluation.demonstratedCompetency === "strong") {
        comp.status = "PROVEN";
      } else if (evaluation.demonstratedCompetency === "partial") {
        comp.status = "PARTIAL";
      } else if (evaluation.demonstratedCompetency === "insufficient") {
        comp.status = "WEAK";
      }
    }

    if (evaluation.recommendedAction !== "FOLLOW_UP") {
      comp.evidenceCount += 1;
    }

    newState.competencies[compIndex] = comp;

    // Update global arrays
    if (comp.status === "PROVEN" && !newState.completedCompetencies.includes(comp.name)) {
      newState.completedCompetencies.push(comp.name);
    }
    if (comp.status === "WEAK" && !newState.weakCompetencies.includes(comp.name)) {
      newState.weakCompetencies.push(comp.name);
    }

    // Process and deduplicate claims
    const existingClaims = newState.claims || [];
    const newClaims: CandidateClaim[] = [];

    if (evaluation.extractedClaims && evaluation.extractedClaims.length > 0) {
      for (const extracted of evaluation.extractedClaims) {
        // Simple deduplication: avoid adding if key AND value are identical
        const isDuplicate = existingClaims.some(
          (c) => c.key === extracted.key && c.value === extracted.value
        );

        if (!isDuplicate) {
          newClaims.push({
            ...extracted,
            sourceTurn: newState.turnNumber,
            competency: newState.currentCompetency,
          });
        }
      }
    }

    newState.claims = [...existingClaims, ...newClaims];

    // Process conflicts
    const existingConflicts = newState.conflicts || [];
    const newConflicts: ClaimConflict[] = [];

    if (evaluation.claimConflicts && evaluation.claimConflicts.length > 0) {
      for (const conflict of evaluation.claimConflicts) {
        // Prevent duplicate conflicts
        const isDuplicate = existingConflicts.some(
          (c) => c.key === conflict.key && c.newValue === conflict.newValue
        );

        if (!isDuplicate) {
          // Find the previous claim to get its statement and turn
          const previousClaim = existingClaims.find((c) => c.key === conflict.key && c.value === conflict.previousValue);
          const newClaim = newClaims.find((c) => c.key === conflict.key && c.value === conflict.newValue) || existingClaims.find((c) => c.key === conflict.key && c.value === conflict.newValue);

          if (previousClaim) {
            newConflicts.push({
              key: conflict.key,
              previousValue: conflict.previousValue,
              newValue: conflict.newValue,
              previousStatement: previousClaim.statement,
              newStatement: newClaim ? newClaim.statement : conflict.newValue,
              previousTurn: previousClaim.sourceTurn,
              currentTurn: newState.turnNumber,
              severity: conflict.severity,
              reason: conflict.reason,
              status: "OPEN",
            });
          }
        }
      }
    }

    newState.conflicts = [...existingConflicts, ...newConflicts];

    // Mark resolved conflicts
    if (evaluation.resolvedConflicts && evaluation.resolvedConflicts.length > 0) {
      newState.conflicts.forEach((conflict) => {
        if (conflict.status === "OPEN" && evaluation.resolvedConflicts!.includes(conflict.key)) {
          conflict.status = "CLARIFIED";
        }
      });
    }

    // Priority to follow-up on severe contradictions
    const hasSevereOpenConflict = newState.conflicts.some(
      (c) => c.status === "OPEN" && (c.severity === "MEDIUM" || c.severity === "HIGH")
    );

    if (hasSevereOpenConflict) {
      evaluation.recommendedAction = "FOLLOW_UP";
      evaluation.followUpType = "CLARIFY_CONTRADICTION";
    }

    return newState;
  }

  /**
   * Détermine la prochaine compétence à tester.
   */
  static selectNextCompetency(state: InterviewState, evaluation?: AnswerEvaluation): string | null {
    // Si la réponse précédente exige une relance, on reste sur la compétence
    if (evaluation && evaluation.recommendedAction === "FOLLOW_UP") {
      return state.currentCompetency;
    }

    const { competencies } = state;
    if (competencies.length === 0) return null;

    // A. Priorité absolue: NOT_TESTED
    const notTested = competencies.find(c => c.status === "NOT_TESTED");
    if (notTested) return notTested.name;

    // B. Priorité 2: PARTIAL (pour donner une chance de valider)
    // On trie par lastEvaluatedAtTurn (le plus ancien d'abord)
    const partial = competencies
      .filter(c => c.status === "PARTIAL")
      .sort((a, b) => (a.lastEvaluatedAtTurn || 0) - (b.lastEvaluatedAtTurn || 0));
    if (partial.length > 0) return partial[0].name;

    // C. Priorité 3: WEAK
    const weak = competencies
      .filter(c => c.status === "WEAK")
      .sort((a, b) => (a.lastEvaluatedAtTurn || 0) - (b.lastEvaluatedAtTurn || 0));
    if (weak.length > 0) return weak[0].name;

    // D. Si tout est PROVEN, on boucle (comportement fallback)
    const proven = competencies
      .filter(c => c.status === "PROVEN")
      .sort((a, b) => (a.lastEvaluatedAtTurn || 0) - (b.lastEvaluatedAtTurn || 0));
    if (proven.length > 0) return proven[0].name;

    return null;
  }

  /**
   * Safe parser for backward compatibility
   */
  static parse(raw: any, fallbackSkills: string[]): InterviewState {
    const result = InterviewStateSchema.safeParse(raw);
    if (result.success) {
      return result.data;
    }
    // Backward compatibility fallback
    return this.initializeState(fallbackSkills);
  }
}
