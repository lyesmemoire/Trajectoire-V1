/**
 * Presence Attention Service
 * Montre que le recruteur est attentif
 */

import { PresenceContext } from "./interfaces/IHumanPresenceService";

export class PresenceAttentionService {
  private static instance: PresenceAttentionService;

  private constructor() {}

  static getInstance(): PresenceAttentionService {
    if (!PresenceAttentionService.instance) {
      PresenceAttentionService.instance = new PresenceAttentionService();
    }
    return PresenceAttentionService.instance;
  }

  async modifyAttention(context: PresenceContext): Promise<{
    modified: string;
    attentionScore: number;
  }> {
    const attentionIndicators = [
      "C'est intéressant ce que tu dis.",
      "Je t'écoute attentivement.",
      "Je comprends ton point de vue.",
    ];
    
    let modified = context.originalDecision;
    
    // Ajouter un indicateur d'attention
    if (Math.random() > 0.9) {
      const indicator = attentionIndicators[Math.floor(Math.random() * attentionIndicators.length)];
      modified = `${indicator} ${modified}`;
    }
    
    return {
      modified,
      attentionScore: 0.85,
    };
  }
}

export const presenceAttentionService = PresenceAttentionService.getInstance();
