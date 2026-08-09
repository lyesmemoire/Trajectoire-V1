/**
 * Modèle de question unifié pour V2, V3 et le meta-brain.
 * Ce modèle définit la structure standard des questions d'entretien.
 */

export type InterviewRole = "hr" | "tech" | "exec";
export type QuestionTone = "friendly" | "neutral" | "executive";
export type QuestionPhase = "hr" | "tech" | "pressure" | "leadership" | "wrap";
export type QuestionGoal =
  | "explore_motivation"
  | "probe_technical_depth"
  | "probe_behavioral_example"
  | "test_consistency"
  | "stress_test"
  | "assess_leadership"
  | "wrap_up";

export type ProfileLevel = "junior" | "senior" | "executive";

export interface QuestionTemplate {
  id: string;
  text: string;                    // peut contenir des placeholders: {skill}, {role}, {context}
  language: "fr" | "en";

  role: InterviewRole;
  tone: QuestionTone;
  phase: QuestionPhase;
  primary_goal: QuestionGoal;

  difficulty: 1 | 2 | 3 | 4 | 5;   // 1 = très simple, 5 = très exigeant
  target_profile: ProfileLevel[];  // profils pour lesquels elle est adaptée

  tags: string[];                  // ex: ["api", "backend", "conflict", "team_lead"]
  triggers: string[];              // mots-clés CV/job qui la rendent pertinente

  // Optionnel : contraintes d'usage
  max_reuse_count?: number;        // éviter de poser 3x la même question
}
