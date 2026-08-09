import { getJsonCompletion } from "../../../ai/openai.js";
import { loadPrompt } from "./loadPrompt.js";
import { MetaDecision, UnifiedSignals, GeneratedQuestion } from "./types.js";
import { selectQuestionFromDb } from "../question-db/index.js";
import { QuestionGoal } from "../question-model.js";

export interface MultiEngineQuestionInput {
  job_context: {
    job_title: string;
    job_requirements: string[];
  };
  candidate_profile: {
    cv_summary: string;
    key_strengths: string[];
    key_gaps: string[];
  };
  interview_state: {
    current_phase: "hr" | "tech" | "pressure" | "leadership" | "wrap";
    current_pressure_level: number;
    profile_level: "junior" | "senior" | "executive";
    turn_count: number;
    max_turns: number;
  };
  meta_decision: MetaDecision["meta_decision"];
  engine_routing: MetaDecision["engine_routing"];
  unified_signals: UnifiedSignals;
  candidate_recent_answers: Array<{
    question: string;
    answer: string;
    timestamp: string;
  }>;
}

/**
 * Exécute le générateur de questions multi-moteur.
 * Produit la prochaine question en tenant compte de la décision méta, du profil, du job, du CV, et en choisissant le style adapté.
 * 
 * Si engine_routing.use_llm_question === false, utilise la base de questions déterministe.
 * Sinon, utilise le LLM pour générer une question.
 */
export async function runMultiEngineQuestionGenerator(
  input: MultiEngineQuestionInput,
): Promise<GeneratedQuestion> {
  // Si le routing indique d'utiliser la base de questions (mode déterministe)
  if (!input.engine_routing.use_llm_question) {
    const dbQuestion = selectQuestionFromDb({
      phase: input.meta_decision.target_phase,
      primary_goal: inferGoalFromAction(input.meta_decision.action),
      target_profile: input.interview_state.profile_level,
      tags: inferTagsFromJob(input.job_context.job_requirements),
      triggers: inferTriggersFromCV(input.candidate_profile.key_strengths),
      minDifficulty: mapPressureToDifficulty(input.interview_state.current_pressure_level).min,
      maxDifficulty: mapPressureToDifficulty(input.interview_state.current_pressure_level).max
    });

    if (dbQuestion) {
      // Question trouvée dans la base - retourner sans appel LLM
      return {
        next_question: {
          interviewer_role: dbQuestion.role as "hr" | "tech" | "exec",
          tone: dbQuestion.tone,
          target_phase: input.meta_decision.target_phase,
          target_pressure_level: input.meta_decision.target_pressure_level,
          question_text: dbQuestion.text
        },
        question_intent: {
          primary_goal: dbQuestion.primary_goal,
          focus_skill_or_topic: dbQuestion.tags.join(", "),
          expected_answer_style: inferAnswerStyleFromGoal(dbQuestion.primary_goal)
        }
      };
    }
    // Si pas de question trouvée, fallback sur LLM
  }

  // Mode LLM (génération dynamique)
  const systemPrompt = await loadPrompt("PROMPT-MULTI-ENGINE-QUESTION-GENERATOR.md");
  
  const response = await getJsonCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(input) },
  ]);

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty question generator response");
  }

  return JSON.parse(content) as GeneratedQuestion;
}

// Helpers pour mapper les décisions méta vers les critères de sélection

function inferGoalFromAction(
  action: MetaDecision["meta_decision"]["action"]
): QuestionGoal {
  switch (action) {
    case "test_consistency": return "test_consistency";
    case "escalate_pressure": return "stress_test";
    case "wrap_up": return "wrap_up";
    case "dig_deeper": return "probe_technical_depth";
    case "change_topic": return "probe_behavioral_example";
    case "deescalate_pressure": return "probe_behavioral_example";
    default: return "probe_technical_depth";
  }
}

function inferTagsFromJob(jobRequirements: string[]): string[] {
  return jobRequirements.flatMap(req => 
    req.toLowerCase().split(/\s+/).filter(word => word.length > 3)
  );
}

function inferTriggersFromCV(strengths: string[]): string[] {
  return strengths.flatMap(strength => 
    strength.toLowerCase().split(/\s+/).filter(word => word.length > 3)
  );
}

function mapPressureToDifficulty(pressureLevel: number): { min: number; max: number } {
  // pressureLevel est 1-5, difficulty est 1-5
  // Plus de pression = questions plus difficiles
  const min = Math.max(1, pressureLevel - 1);
  const max = Math.min(5, pressureLevel + 1);
  return { min, max };
}

function inferAnswerStyleFromGoal(goal: QuestionGoal): "narrative" | "structured_example" | "technical_deep_dive" | "strategic_reflection" {
  switch (goal) {
    case "probe_technical_depth": return "technical_deep_dive";
    case "probe_behavioral_example": return "structured_example";
    case "test_consistency": return "structured_example";
    case "stress_test": return "structured_example";
    case "assess_leadership": return "strategic_reflection";
    case "explore_motivation": return "narrative";
    case "wrap_up": return "narrative";
    default: return "structured_example";
  }
}
