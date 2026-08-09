/**
 * evaluate-answer.ts — Cœur P3 : évaluation déterministe d'une réponse d'entretien.
 *
 * 100 % déterministe (aucun LLM, aucun réseau). Module ISOLÉ :
 * ne dépend PAS du moteur ATS, de ProductOutput, ni du pipeline CV/job.
 *
 * Heuristique : longueur (structure minimale), présence des 4 dimensions STAR,
 * couverture du gap visé, présence d'un résultat chiffré.
 */
export interface EvaluateAnswerInput {
    answer: string;
    /** Compétence/gap visé par la question (optionnel). */
    gap?: string;
}
export type FeedbackLevel = "faible" | "moyen" | "fort";
export interface AnswerFeedback {
    level: FeedbackLevel;
    message: string;
    /** Ce qui est déjà bien (renforcement positif, anti-stress). */
    positives: string[];
    /** Pistes concrètes d'amélioration. */
    improve: string[];
}
export interface EvaluateAnswerResult {
    score: number;
    feedback: AnswerFeedback;
    /** Détail des dimensions STAR détectées (transparence). */
    star: {
        situation: boolean;
        task: boolean;
        action: boolean;
        result: boolean;
    };
}
export declare function evaluateAnswer(input: EvaluateAnswerInput): EvaluateAnswerResult;
//# sourceMappingURL=evaluate-answer.d.ts.map