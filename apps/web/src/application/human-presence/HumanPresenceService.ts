/**
 * Human Presence Service
 * Service principal qui coordonne tous les services de présence
 * Modifie uniquement la manière dont la décision est vécue par le candidat
 */

import {
  PresenceContext,
  PresenceModification,
  PresenceMetrics,
  HumanPresenceConfig,
  defaultHumanPresenceConfig,
} from "./interfaces/IHumanPresenceService";

import { conversationPresenceService } from "./ConversationPresenceService";
import { presenceConversationService } from "./PresenceConversationService";
import { presenceMemoryService } from "./PresenceMemoryService";
import { presenceEmotionService } from "./PresenceEmotionService";
import { presenceRhythmService } from "./PresenceRhythmService";
import { presenceReflectionService } from "./PresenceReflectionService";
import { presenceTrustService } from "./PresenceTrustService";
import { presenceSilenceService } from "./PresenceSilenceService";
import { presenceAttentionService } from "./PresenceAttentionService";
import { presenceNaturalnessService } from "./PresenceNaturalnessService";

// ============================================================================
// HUMAN PRESENCE SERVICE CLASS
// ============================================================================

export class HumanPresenceService {
  private static instance: HumanPresenceService;
  private config: HumanPresenceConfig;
  private modifications: Map<string, PresenceModification> = new Map();
  private metrics: Map<string, PresenceMetrics> = new Map();

  private constructor() {
    this.config = defaultHumanPresenceConfig;
  }

  static getInstance(): HumanPresenceService {
    if (!HumanPresenceService.instance) {
      HumanPresenceService.instance = new HumanPresenceService();
    }
    return HumanPresenceService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<HumanPresenceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Apply presence to a decision
   * Modifie uniquement la manière dont la décision est vécue
   */
  async applyPresence(
    userId: string,
    sessionId: string,
    originalDecision: string,
    context: Record<string, unknown>
  ): Promise<PresenceModification> {
    const modificationId = `modification_${sessionId}_${Date.now()}`;

    // Créer le contexte de présence
    const presenceContext: PresenceContext = {
      userId,
      sessionId,
      originalDecision,
      context,
      timestamp: new Date(),
    };

    // Étape 1 : PresenceConversationService transforme comme un réalisateur de cinéma
    const conversationTransformation = await presenceConversationService.transformConversation(presenceContext);
    let currentDecision = conversationTransformation.modified;

    // Étape 2 : Appliquer les autres services de présence sur la décision transformée
    const memoryModification = await presenceMemoryService.modifyMemory({
      ...presenceContext,
      originalDecision: currentDecision,
    });
    const emotionModification = await presenceEmotionService.modifyEmotion({
      ...presenceContext,
      originalDecision: currentDecision,
    });
    const rhythmModification = await presenceRhythmService.modifyRhythm({
      ...presenceContext,
      originalDecision: currentDecision,
    });
    const reflectionModification = await presenceReflectionService.modifyReflection({
      ...presenceContext,
      originalDecision: currentDecision,
    });
    const trustModification = await presenceTrustService.modifyTrust({
      ...presenceContext,
      originalDecision: currentDecision,
    });
    const silenceModification = await presenceSilenceService.modifySilence({
      ...presenceContext,
      originalDecision: currentDecision,
    });
    const attentionModification = await presenceAttentionService.modifyAttention({
      ...presenceContext,
      originalDecision: currentDecision,
    });
    const naturalnessModification = await presenceNaturalnessService.modifyNaturalness({
      ...presenceContext,
      originalDecision: currentDecision,
    });

    // Combiner toutes les modifications
    const combinedModification: PresenceModification = {
      id: modificationId,
      userId,
      sessionId,
      originalDecision,
      modifiedDecision: this.combineModifications(
        currentDecision,
        memoryModification,
        emotionModification,
        rhythmModification,
        reflectionModification,
        trustModification,
        silenceModification,
        attentionModification,
        naturalnessModification
      ),
      conversation: {
        modified: conversationTransformation.modified,
        naturalnessScore: conversationTransformation.naturalnessScore,
        direction: conversationTransformation.direction,
      },
      memory: memoryModification,
      emotion: emotionModification,
      rhythm: rhythmModification,
      reflection: reflectionModification,
      trust: trustModification,
      silence: silenceModification,
      attention: attentionModification,
      naturalness: naturalnessModification,
      presenceScore: conversationTransformation.naturalnessScore,
      timestamp: new Date(),
    };

    this.modifications.set(modificationId, combinedModification);

    return combinedModification;
  }

  /**
   * Combiner toutes les modifications
   */
  private combineModifications(
    original: string,
    memory: any,
    emotion: any,
    rhythm: any,
    reflection: any,
    trust: any,
    silence: any,
    attention: any,
    naturalness: any
  ): string {
    let modified = original;

    // Appliquer la modification de mémoire
    if (memory && memory.modified) {
      modified = memory.modified;
    }

    // Appliquer la modification d'émotion
    if (emotion && emotion.modified) {
      modified = emotion.modified;
    }

    // Appliquer la modification de rythme
    if (rhythm && rhythm.modified) {
      modified = rhythm.modified;
    }

    // Appliquer la modification de réflexion
    if (reflection && reflection.modified) {
      modified = reflection.modified;
    }

    // Appliquer la modification de confiance
    if (trust && trust.modified) {
      modified = trust.modified;
    }

    // Appliquer la modification de silence
    if (silence && silence.modified) {
      modified = silence.modified;
    }

    // Appliquer la modification d'attention
    if (attention && attention.modified) {
      modified = attention.modified;
    }

    // Appliquer la modification de naturalité
    if (naturalness && naturalness.modified) {
      modified = naturalness.modified;
    }

    return modified;
  }

  /**
   * Get metrics
   */
  getMetrics(): PresenceMetrics {
    const totalModifications = this.modifications.size;

    const modifications = Array.from(this.modifications.values());
    const averagePresenceScore = modifications.length > 0
      ? modifications.reduce((sum, m) => sum + (m.presenceScore || 0.8), 0) / modifications.length
      : 0.8;

    const averageNaturalnessScore = modifications.length > 0
      ? modifications.reduce((sum, m) => sum + (m.naturalness?.naturalnessScore || 0.8), 0) / modifications.length
      : 0.8;

    const averageEmpathyScore = modifications.length > 0
      ? modifications.reduce((sum, m) => sum + (m.emotion?.empathyScore || 0.8), 0) / modifications.length
      : 0.8;

    const averageRhythmScore = modifications.length > 0
      ? modifications.reduce((sum, m) => sum + (m.rhythm?.rhythmScore || 0.8), 0) / modifications.length
      : 0.8;

    return {
      totalModifications,
      averagePresenceScore,
      averageNaturalnessScore,
      averageEmpathyScore,
      averageRhythmScore,
    };
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.modifications.clear();
    this.metrics.clear();
  }
}

export const humanPresenceService = HumanPresenceService.getInstance();
