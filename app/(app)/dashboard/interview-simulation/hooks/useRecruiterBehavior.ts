import { useState, useCallback } from "react";
import { RecruiterBehavior, InterviewConfig, PrivateNote } from "../types/interview";

const THINKING_MESSAGES = [
  "Le recruteur réfléchit...",
  "Le recruteur consulte ses notes...",
  "Le recruteur analyse votre réponse...",
  "Le recruteur prépare sa prochaine question...",
  "Le recruteur prend le temps de réfléchir...",
  "Le recruteur évalue votre réponse...",
  "Le recruteur note quelques points...",
];

const POSSIBLE_NOTES = [
  { content: "Leadership crédible", category: "positive" as const },
  { content: "Communication claire", category: "positive" as const },
  { content: "Arguments solides", category: "positive" as const },
  { content: "Excellent exemple STAR", category: "positive" as const },
  { content: "Bonne énergie", category: "positive" as const },
  { content: "Impact peu quantifié", category: "negative" as const },
  { content: "Réponse trop longue", category: "negative" as const },
  { content: "STAR incomplète", category: "negative" as const },
  { content: "Manque de précision", category: "negative" as const },
  { content: "Structure confuse", category: "negative" as const },
  { content: "Bonne synthèse", category: "neutral" as const },
  { content: "Réponse équilibrée", category: "neutral" as const },
  { content: "Exemple pertinent", category: "neutral" as const },
  { content: "Réponse hésitante", category: "neutral" as const },
  { content: "Approche intéressante", category: "neutral" as const },
];

const CHALLENGE_PHRASES = [
  "Pourtant...",
  "Je comprends...",
  "Cependant...",
  "Êtes-vous certain ?",
  "Comment pouvez-vous le prouver ?",
  "Pourquoi pensez-vous cela ?",
  "Cette décision était-elle réellement la meilleure ?",
  "Est-ce vraiment le cas ?",
  "Avez-vous envisagé d'autres options ?",
  "Quelle est votre justification ?",
];

export function useRecruiterBehavior(_config: InterviewConfig) {
  const [behavior, setBehavior] = useState<RecruiterBehavior>({
    isThinking: false,
    isTakingNotes: false,
    currentExpression: "neutral",
    currentFocus: "candidate",
  });
  const [privateNotes, setPrivateNotes] = useState<PrivateNote[]>([]);

  const startThinking = useCallback(() => {
    setBehavior((prev) => ({
      ...prev,
      isThinking: true,
      currentFocus: "thinking",
      currentExpression: "thoughtful",
    }));
  }, []);

  const stopThinking = useCallback(() => {
    setBehavior((prev) => ({
      ...prev,
      isThinking: false,
      currentFocus: "candidate",
      currentExpression: "neutral",
    }));
  }, []);

  const startTakingNotes = useCallback(() => {
    setBehavior((prev) => ({
      ...prev,
      isTakingNotes: true,
      currentFocus: "notes",
    }));
  }, []);

  const stopTakingNotes = useCallback(() => {
    setBehavior((prev) => ({
      ...prev,
      isTakingNotes: false,
      currentFocus: "candidate",
    }));
  }, []);

  const setExpression = useCallback((expression: RecruiterBehavior["currentExpression"]) => {
    setBehavior((prev) => ({ ...prev, currentExpression: expression }));
  }, []);

  const getRandomThinkingMessage = useCallback((): string => {
    const safeArray = THINKING_MESSAGES.length > 0 ? THINKING_MESSAGES : ["Le recruteur réfléchit..."];
    const randomIndex = Math.floor(Math.random() * safeArray.length);
    return safeArray[randomIndex] as string;
  }, []);

  const addPrivateNote = useCallback((content: string, category: PrivateNote["category"]) => {
    const note: PrivateNote = {
      id: `note-${Date.now()}-${Math.random()}`,
      content,
      timestamp: Date.now(),
      category,
    };
    setPrivateNotes((prev) => [...prev, note]);
  }, []);

  const addRandomNote = useCallback(() => {
    const safeArray = POSSIBLE_NOTES.length > 0 ? POSSIBLE_NOTES : POSSIBLE_NOTES.slice(0, 1);
    const randomIndex = Math.floor(Math.random() * safeArray.length);
    const note = safeArray[randomIndex];
    if (note) {
      addPrivateNote(note.content, note.category);
    }
  }, [addPrivateNote]);

  const getChallengePhrase = useCallback((): string => {
    const safeArray = CHALLENGE_PHRASES.length > 0 ? CHALLENGE_PHRASES : ["Êtes-vous certain ?"];
    const randomIndex = Math.floor(Math.random() * safeArray.length);
    return safeArray[randomIndex] as string;
  }, []);

  const getRandomThinkingDuration = useCallback((): number => {
    return Math.floor(Math.random() * (2200 - 600 + 1)) + 600;
  }, []);

  const adaptExpressionBasedOnResponse = useCallback((responseQuality: "good" | "average" | "poor") => {
    switch (responseQuality) {
      case "good":
        setExpression("encouraging");
        break;
      case "average":
        setExpression("thoughtful");
        break;
      case "poor":
        setExpression("serious");
        break;
      default:
        setExpression("neutral");
    }
  }, [setExpression]);

  const simulateThinking = useCallback((duration: number, callback: () => void) => {
    startThinking();
    setTimeout(() => {
      stopThinking();
      callback();
    }, duration);
  }, [startThinking, stopThinking]);

  const simulateNoteTaking = useCallback((duration: number, callback: () => void) => {
    startTakingNotes();
    setTimeout(() => {
      stopTakingNotes();
      addRandomNote();
      callback();
    }, duration);
  }, [startTakingNotes, stopTakingNotes, addRandomNote]);

  return {
    behavior,
    privateNotes,
    startThinking,
    stopThinking,
    startTakingNotes,
    stopTakingNotes,
    setExpression,
    getRandomThinkingMessage,
    addPrivateNote,
    addRandomNote,
    getChallengePhrase,
    getRandomThinkingDuration,
    adaptExpressionBasedOnResponse,
    simulateThinking,
    simulateNoteTaking,
  };
}
