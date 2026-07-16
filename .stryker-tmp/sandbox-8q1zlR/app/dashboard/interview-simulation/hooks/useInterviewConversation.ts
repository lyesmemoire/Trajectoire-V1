// @ts-nocheck
import { useState, useCallback } from "react";
import { Message, InterviewConfig, ConversationContext, FollowUpQuestion } from "../types/interview";
import { RecruiterQuestionAIEngine } from "@/core/intelligence/engines/recruiterQuestionAIEngine";
import { candidateAIBrain } from "@/core/ai/brain/CandidateAIBrain";

const FOLLOW_UP_QUESTIONS: FollowUpQuestion[] = [
  { id: "1", question: "Pouvez-vous développer ?", type: "clarification", difficulty: 1 },
  { id: "2", question: "J'aimerais comprendre ce choix.", type: "clarification", difficulty: 2 },
  { id: "3", question: "Pourquoi avoir pris cette décision ?", type: "clarification", difficulty: 2 },
  { id: "4", question: "Comment votre équipe a-t-elle réagi ?", type: "deepening", difficulty: 2 },
  { id: "5", question: "Que referiez-vous différemment ?", type: "deepening", difficulty: 3 },
  { id: "6", question: "Quel résultat concret ?", type: "deepening", difficulty: 2 },
  { id: "7", question: "Qu'avez-vous appris ?", type: "deepening", difficulty: 2 },
  { id: "8", question: "Quel était votre rôle exact ?", type: "clarification", difficulty: 1 },
  { id: "9", question: "Pourquoi ce projet ?", type: "clarification", difficulty: 2 },
  { id: "10", question: "Comment mesurez-vous ce succès ?", type: "deepening", difficulty: 3 },
  { id: "11", question: "Quelle a été la plus grande difficulté ?", type: "deepening", difficulty: 2 },
  { id: "12", question: "Comment avez-vous géré les résistances ?", type: "deepening", difficulty: 3 },
  { id: "13", question: "Quelle a été votre stratégie ?", type: "clarification", difficulty: 2 },
  { id: "14", question: "Pouvez-vous me donner un exemple précis ?", type: "example", difficulty: 2 },
  { id: "15", question: "Comment avez-vous communiqué cela ?", type: "deepening", difficulty: 2 },
  { id: "16", question: "Quels étaient les enjeux ?", type: "clarification", difficulty: 2 },
  { id: "17", question: "Comment avez-vous priorisé ?", type: "deepening", difficulty: 3 },
  { id: "18", question: "Quelle a été la réaction des parties prenantes ?", type: "deepening", difficulty: 2 },
  { id: "19", question: "Comment avez-vous assuré la qualité ?", type: "deepening", difficulty: 2 },
  { id: "20", question: "Quelles leçons en tirez-vous ?", type: "deepening", difficulty: 2 },
  { id: "21", question: "Comment cela s'inscrit-il dans votre vision ?", type: "deepening", difficulty: 3 },
  { id: "22", question: "Quelle a été l'impact sur votre équipe ?", type: "deepening", difficulty: 2 },
  { id: "23", question: "Comment avez-vous géré le stress ?", type: "deepening", difficulty: 2 },
  { id: "24", question: "Quels outils avez-vous utilisés ?", type: "clarification", difficulty: 1 },
  { id: "25", question: "Comment avez-vous motivé votre équipe ?", type: "deepening", difficulty: 2 },
  { id: "26", question: "Quelle a été la timeline ?", type: "clarification", difficulty: 1 },
  { id: "27", question: "Comment avez-vous géré les imprévus ?", type: "deepening", difficulty: 3 },
  { id: "28", question: "Quelle a été votre plus grande contribution ?", type: "deepening", difficulty: 2 },
  { id: "29", question: "Comment avez-vous validé votre approche ?", type: "deepening", difficulty: 2 },
  { id: "30", question: "Quelles alternatives avez-vous envisagées ?", type: "deepening", difficulty: 3 },
  { id: "31", question: "Comment avez-vous géré les conflits ?", type: "deepening", difficulty: 2 },
  { id: "32", question: "Quelle a été la réaction de votre manager ?", type: "deepening", difficulty: 2 },
  { id: "33", question: "Comment avez-vous documenté le processus ?", type: "clarification", difficulty: 1 },
  { id: "34", question: "Quels KPIs avez-vous suivis ?", type: "clarification", difficulty: 2 },
  { id: "35", question: "Comment avez-vous communiqué les résultats ?", type: "deepening", difficulty: 2 },
  { id: "36", question: "Quelle a été la plus grande réussite ?", type: "deepening", difficulty: 2 },
  { id: "37", question: "Comment avez-vous géré les délais ?", type: "deepening", difficulty: 2 },
  { id: "38", question: "Quelles ressources avez-vous mobilisées ?", type: "clarification", difficulty: 1 },
  { id: "39", question: "Comment avez-vous assuré l'adoption ?", type: "deepening", difficulty: 2 },
  { id: "40", question: "Quelle a été l'impact business ?", type: "deepening", difficulty: 3 },
  { id: "41", question: "Comment avez-vous géré les risques ?", type: "deepening", difficulty: 3 },
  { id: "42", question: "Quelle a été votre marge de manœuvre ?", type: "clarification", difficulty: 2 },
  { id: "43", question: "Comment avez-vous aligné les parties prenantes ?", type: "deepening", difficulty: 3 },
  { id: "44", question: "Quels feedbacks avez-vous reçus ?", type: "deepening", difficulty: 2 },
  { id: "45", question: "Comment avez-vous itéré ?", type: "deepening", difficulty: 2 },
  { id: "46", question: "Quelle a été votre plus grande erreur ?", type: "deepening", difficulty: 3 },
  { id: "47", question: "Comment avez-vous corrigé le tir ?", type: "deepening", difficulty: 2 },
  { id: "48", question: "Quels étaient les contraintes ?", type: "clarification", difficulty: 1 },
  { id: "49", question: "Comment avez-vous géré les attentes ?", type: "deepening", difficulty: 2 },
  { id: "50", question: "Quelle a été la réaction des clients ?", type: "deepening", difficulty: 2 },
  { id: "51", question: "Comment avez-vous mesuré le succès ?", type: "deepening", difficulty: 2 },
  { id: "52", question: "Quels ont été les obstacles ?", type: "clarification", difficulty: 1 },
  { id: "53", question: "Comment avez-vous maintenu la motivation ?", type: "deepening", difficulty: 2 },
  { id: "54", question: "Quelle a été votre stratégie de communication ?", type: "deepening", difficulty: 2 },
  { id: "55", question: "Comment avez-vous géré les changements ?", type: "deepening", difficulty: 3 },
  { id: "56", question: "Quels ont été les bénéfices ?", type: "deepening", difficulty: 2 },
  { id: "57", question: "Comment avez-vous assuré la pérennité ?", type: "deepening", difficulty: 3 },
  { id: "58", question: "Quelle a été votre plus grande surprise ?", type: "deepening", difficulty: 2 },
  { id: "59", question: "Comment avez-vous capitalisé ?", type: "deepening", difficulty: 2 },
  { id: "60", question: "Quels sont les enseignements clés ?", type: "deepening", difficulty: 3 },
];

const TRANSITIONS = [
  "Merci. J'aimerais maintenant revenir sur votre expérience chez",
  "Très intéressant. Passons maintenant au management.",
  "Je voudrais approfondir un point.",
  "Merci pour ces précisions. Continuons sur un autre sujet.",
  "Bien. J'aimerais aborder un aspect différent.",
  "Merci. Changeons de sujet un instant.",
  "Intéressant. Je voudrais revenir sur quelque chose.",
  "Merci. Passons à autre chose.",
];

export function useInterviewConversation(config: InterviewConfig) {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [context, setContext] = useState<ConversationContext>({
    mentionedNumbers: [],
    mentionedProjects: [],
    mentionedTeams: [],
    mentionedTechnologies: [],
    mentionedResults: [],
    mentionedExperiences: [],
  });
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  const addMessage = useCallback((role: "recruiter" | "candidate", content: string) => {
    const message: Message = {
      role,
      content,
      timestamp: Date.now(),
    };
    setConversationHistory((prev) => [...prev, message]);
  }, []);

  const extractContext = useCallback((text: string) => {
    const numbers = text.match(/\d+/g) || [];
    const newContext = {
      mentionedNumbers: [...context.mentionedNumbers, ...numbers],
      mentionedProjects: context.mentionedProjects,
      mentionedTeams: context.mentionedTeams,
      mentionedTechnologies: context.mentionedTechnologies,
      mentionedResults: context.mentionedResults,
      mentionedExperiences: context.mentionedExperiences,
    };
    setContext(newContext);
  }, [context]);

  const getRandomFollowUp = useCallback((currentDifficulty: number): FollowUpQuestion => {
    const filtered = FOLLOW_UP_QUESTIONS.filter((q) => q.difficulty <= currentDifficulty);
    const safeArray = filtered.length > 0 ? filtered : FOLLOW_UP_QUESTIONS;
    const randomIndex = Math.floor(Math.random() * safeArray.length);
    return safeArray[randomIndex] as FollowUpQuestion;
  }, []);

  const getRandomTransition = useCallback((): string => {
    const safeArray = TRANSITIONS.length > 0 ? TRANSITIONS : ["Merci. Continuons."];
    const randomIndex = Math.floor(Math.random() * safeArray.length);
    return safeArray[randomIndex] as string;
  }, []);

  const increaseDifficulty = useCallback(() => {
    setDifficultyLevel((prev) => Math.min(prev + 0.5, 5));
  }, []);

  const getReferenceToPrevious = useCallback((type: keyof ConversationContext): string | null => {
    const items = context[type];
    if (items.length === 0) return null;
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    const references = {
      mentionedNumbers: `Tout à l'heure vous évoquiez le chiffre ${randomItem}.`,
      mentionedProjects: `Vous m'avez parlé du projet ${randomItem}.`,
      mentionedTeams: `Vous avez mentionné une équipe de ${randomItem}.`,
      mentionedTechnologies: `Vous avez indiqué avoir utilisé ${randomItem}.`,
      mentionedResults: `Vous avez évoqué un résultat de ${randomItem}.`,
      mentionedExperiences: `Vous m'avez décrit une expérience avec ${randomItem}.`,
    };
    
    return references[type];
  }, [context]);

  const generateAIQuestion = useCallback(async (
    candidateProfile: string,
    strengths: string[],
    weaknesses: string[],
    careerLevel: string,
    experience: string,
    lastCandidateResponse: string
  ): Promise<string> => {
    try {
      // Get brain context
      const brainInsights = candidateAIBrain.getInsights();
      const brainObservations = candidateAIBrain.getObservations();
      const brainPatterns = candidateAIBrain.getPatterns();
      
      const historicalInsights = brainInsights.slice(0, 5).map(i => i.description);
      const previousInterviews = brainObservations
        .filter(o => o.type === "interview")
        .slice(0, 3)
        .map(o => `${o.source}: ${JSON.stringify(o.data).substring(0, 100)}...`);
      const knownPatterns = brainPatterns.patterns
        .slice(0, 5)
        .map((p: any) => `${p.pattern} (${p.category})`);

      const result = await RecruiterQuestionAIEngine.generateQuestion({
        candidateProfile,
        strengths,
        weaknesses,
        careerLevel,
        experience,
        interviewContext: JSON.stringify(context),
        conversationHistory: conversationHistory.map(m => `${m.role}: ${m.content}`).join("\n"),
        lastCandidateResponse,
        difficulty: difficultyLevel,
        interviewType: config.interviewType,
        targetPosition: config.position,
        historicalInsights,
        previousInterviews,
        knownPatterns,
      });
      
      // Adjust difficulty based on AI response
      if (result.difficulty !== difficultyLevel) {
        setDifficultyLevel(result.difficulty);
      }
      
      return result.question;
    } catch (error) {
      // Fallback to random follow-up if AI fails
      console.error("AI question generation failed, falling back to static:", error);
      const fallback = getRandomFollowUp(difficultyLevel);
      return fallback.question;
    }
  }, [context, conversationHistory, difficultyLevel, config.interviewType, config.position, getRandomFollowUp]);

  return {
    conversationHistory,
    context,
    difficultyLevel,
    addMessage,
    extractContext,
    getRandomFollowUp,
    getRandomTransition,
    increaseDifficulty,
    getReferenceToPrevious,
    generateAIQuestion,
  };
}
