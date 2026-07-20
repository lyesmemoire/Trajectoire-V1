/**
 * Presence Reflection Service
 * Ajoute des pauses de réflexion naturelles
 */

import { PresenceContext } from "./interfaces/IHumanPresenceService";

export class PresenceReflectionService {
  private static instance: PresenceReflectionService;

  private constructor() {}

  static getInstance(): PresenceReflectionService {
    if (!PresenceReflectionService.instance) {
      PresenceReflectionService.instance = new PresenceReflectionService();
    }
    return PresenceReflectionService.instance;
  }

  async modifyReflection(context: PresenceContext): Promise<{
    modified: string;
    reflectionScore: number;
  }> {
    const reflections = [
      "Je réfléchis...",
      "Laisse-moi réfléchir un instant...",
      "Hmm, intéressant...",
    ];
    
    let modified = context.originalDecision;
    
    // Ajouter une réflexion naturelle
    if (Math.random() > 0.9) {
      const reflection = reflections[Math.floor(Math.random() * reflections.length)];
      modified = `${reflection} ${modified}`;
    }
    
    return {
      modified,
      reflectionScore: 0.85,
    };
  }
}

export const presenceReflectionService = PresenceReflectionService.getInstance();
