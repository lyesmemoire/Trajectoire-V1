/**
 * Loader et index pour la base de questions.
 * Permet de sélectionner des questions selon des critères structurés.
 */

import questionsFr from "./questions.fr.json" with { type: "json" };
import { QuestionTemplate, QuestionPhase, QuestionGoal, ProfileLevel } from "../question-model.js";

const ALL_QUESTIONS: QuestionTemplate[] = questionsFr as unknown as QuestionTemplate[]; // plus tard: concat fr/en, par domaines, etc.

interface QuestionSelectionCriteria {
  phase: QuestionPhase;
  primary_goal?: QuestionGoal;
  target_profile: ProfileLevel;
  tags?: string[];         // topics souhaités
  triggers?: string[];     // mots-clés CV/job
  maxDifficulty?: number;
  minDifficulty?: number;
}

export function selectQuestionFromDb(
  criteria: QuestionSelectionCriteria
): QuestionTemplate | null {
  let candidates = ALL_QUESTIONS.filter((q) =>
    q.phase === criteria.phase &&
    q.target_profile.includes(criteria.target_profile)
  );

  if (criteria.primary_goal) {
    candidates = candidates.filter(
      (q) => q.primary_goal === criteria.primary_goal
    );
  }

  if (criteria.tags && criteria.tags.length > 0) {
    candidates = candidates.filter((q) =>
      criteria.tags!.some((tag) => q.tags.includes(tag))
    );
  }

  if (criteria.triggers && criteria.triggers.length > 0) {
    candidates = candidates.filter((q) =>
      criteria.triggers!.some((t) => q.triggers.includes(t))
    );
  }

  if (criteria.minDifficulty) {
    candidates = candidates.filter(
      (q) => q.difficulty >= criteria.minDifficulty!
    );
  }
  if (criteria.maxDifficulty) {
    candidates = candidates.filter(
      (q) => q.difficulty <= criteria.maxDifficulty!
    );
  }

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function getAllQuestions(): QuestionTemplate[] {
  return ALL_QUESTIONS;
}

export function getQuestionsByPhase(phase: QuestionPhase): QuestionTemplate[] {
  return ALL_QUESTIONS.filter((q) => q.phase === phase);
}

export function getQuestionsByGoal(goal: QuestionGoal): QuestionTemplate[] {
  return ALL_QUESTIONS.filter((q) => q.primary_goal === goal);
}
