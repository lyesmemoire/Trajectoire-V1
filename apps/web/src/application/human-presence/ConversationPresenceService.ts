/**
 * Conversation Presence Service
 * Modifie la conversation pour la rendre plus naturelle
 */

import { PresenceContext } from "./interfaces/IHumanPresenceService";

// ============================================================================
// CONVERSATION PRESENCE SERVICE CLASS
// ============================================================================

export class ConversationPresenceService {
  private static instance: ConversationPresenceService;

  private constructor() {}

  static getInstance(): ConversationPresenceService {
    if (!ConversationPresenceService.instance) {
      ConversationPresenceService.instance = new ConversationPresenceService();
    }
    return ConversationPresenceService.instance;
  }

  /**
   * Modify conversation for naturalness
   */
  async modifyConversation(context: PresenceContext): Promise<{
    modified: string;
    naturalnessScore: number;
  }> {
    const hesitations = ["euh...", "en fait...", "c'est-à-dire..."];
    const reformulations = ["ce que je veux dire c'est...", "pour être plus précis..."];
    
    let modified = context.originalDecision;
    
    // Ajouter une hésitation aléatoire
    if (Math.random() > 0.7) {
      const hesitation = hesitations[Math.floor(Math.random() * hesitations.length)];
      modified = `${hesitation} ${modified}`;
    }
    
    // Ajouter une reformulation aléatoire
    if (Math.random() > 0.8) {
      const reformulation = reformulations[Math.floor(Math.random() * reformulations.length)];
      modified = `${reformulation} ${modified}`;
    }
    
    return {
      modified,
      naturalnessScore: 0.85,
    };
  }
}

export const conversationPresenceService = ConversationPresenceService.getInstance();
