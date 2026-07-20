// lib/interview/generate-questions.ts
// Génère un set de 7 questions d'entretien avec variation contrôlée

import { questionBank } from "./question-bank";

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * Génère 7 questions d'entretien couvrant toutes les catégories clés.
 * 2 questions "challenge" pour tester la profondeur.
 */
export function generateInterviewQuestions(): string[] {
  return [
    randomItem(questionBank.intro),
    randomItem(questionBank.motivation),
    randomItem(questionBank.failure),
    randomItem(questionBank.conflict),
    randomItem(questionBank.strengths),
    randomItem(questionBank.challenge),
    randomItem(questionBank.challenge),
  ];
}

/**
 * Labels pour l'UI — associe chaque index à sa catégorie.
 */
export const questionLabels = [
  "Introduction",
  "Motivation",
  "Gestion d'échec",
  "Gestion de conflit",
  "Forces & Faiblesses",
  "Mise en situation",
  "Mise en situation",
];
