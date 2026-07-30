/**
 * HIIOS v4 Enterprise — Feature Flag Engine
 *
 * Déploiement progressif et A/B testing des prompts,
 * questions et comportements du système.
 */

import { randomUUID } from "crypto";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

// Canonical Reference: COS-OBJ-010 (blueprint.runtime.featureflag)
// Owner: COS Team
export interface FeatureFlag {
  readonly id:        string;
  readonly key:       string;
  name:               string;
  description:        string;
  enabled:            boolean;
  rolloutPercentage:  number;      // 0–100
  targeting:          TargetingRule[];
  variants:           Variant[];
  defaultVariant:     string;
  createdAt:          Date;
  updatedAt:          Date;
  expiresAt?:         Date;
  tags:               string[];
}

export interface TargetingRule {
  id:          string;
  description: string;
  conditions:  TargetingCondition[];
  variant:     string;
  priority:    number;
}

export interface TargetingCondition {
  attribute:  string;   // "organizationId", "role", "plan", "userId"
  operator:   "EQ" | "IN" | "NOT_IN" | "CONTAINS" | "GT" | "LT";
  value:      string | string[] | number;
}

export interface Variant {
  id:          string;
  key:         string;
  description: string;
  payload?:    Record<string, unknown>;
  weight:      number;   // Pour les A/B tests pondérés
}

export interface FlagContext {
  userId?:         string;
  organizationId?: string;
  role?:           string;
  plan?:           string;
  sessionId?:      string;
  custom?:         Record<string, string | number | boolean>;
}

export interface FlagEvaluation {
  flagKey:   string;
  enabled:   boolean;
  variant:   string;
  payload?:  Record<string, unknown>;
  reason:    EvaluationReason;
}

export type EvaluationReason =
  | "FLAG_DISABLED"
  | "NOT_IN_ROLLOUT"
  | "TARGETING_MATCH"
  | "DEFAULT_VARIANT"
  | "A_B_ASSIGNMENT"
  | "FLAG_NOT_FOUND"
  | "FLAG_EXPIRED";

// ─────────────────────────────────────────────
// FLAGS PRÉDÉFINIS POUR HIIOS
// ─────────────────────────────────────────────

export const HIIOS_FLAGS: Partial<FeatureFlag>[] = [
  {
    key:         "new_question_scoring",
    name:        "Nouveau scoring des questions",
    description: "Algorithme de scoring v2 pour la sélection des questions",
    enabled:     false,
    rolloutPercentage: 0,
    variants: [
      { id: "v1", key: "control",    description: "Algorithme v1", weight: 50, payload: { version: 1 } },
      { id: "v2", key: "treatment",  description: "Algorithme v2", weight: 50, payload: { version: 2 } },
    ],
    defaultVariant: "control",
    tags: ["algorithm", "questions", "ab-test"],
  },
  {
    key:         "extended_pattern_library",
    name:        "Bibliothèque de patterns étendue",
    description: "400+ patterns comportementaux (en cours de validation)",
    enabled:     false,
    rolloutPercentage: 10,
    variants: [
      { id: "v1", key: "disabled", description: "15 patterns", weight: 90, payload: { patternCount: 15 } },
      { id: "v2", key: "enabled",  description: "400+ patterns", weight: 10, payload: { patternCount: 400 } },
    ],
    defaultVariant: "disabled",
    tags: ["patterns", "knowledge"],
  },
  {
    key:         "streaming_analysis",
    name:        "Analyse en streaming",
    description: "Retour en temps réel de l'analyse LLM",
    enabled:     true,
    rolloutPercentage: 100,
    variants: [
      { id: "v1", key: "enabled", description: "Streaming activé", weight: 100, payload: {} },
    ],
    defaultVariant: "enabled",
    tags: ["streaming", "ux"],
  },
  {
    key:         "recruiter_coaching",
    name:        "Coaching recruteur temps réel",
    description: "Alertes et suggestions en cours d'entretien pour le recruteur",
    enabled:     false,
    rolloutPercentage: 25,
    variants: [
      { id: "v1", key: "control",   description: "Pas de coaching", weight: 75 },
      { id: "v2", key: "treatment", description: "Coaching activé", weight: 25 },
    ],
    defaultVariant: "control",
    tags: ["recruiter", "coaching", "ab-test"],
  },
  {
    key:         "knowledge_graph_inference",
    name:        "Inférence via Knowledge Graph",
    description: "Propagation des preuves via le graphe cognitif",
    enabled:     true,
    rolloutPercentage: 50,
    variants: [
      { id: "v1", key: "control",   description: "Sans inférence", weight: 50 },
      { id: "v2", key: "treatment", description: "Avec inférence", weight: 50 },
    ],
    defaultVariant: "control",
    tags: ["knowledge", "inference", "ab-test"],
  },
];

// ─────────────────────────────────────────────
// MOTEUR
// ─────────────────────────────────────────────

export class FeatureFlagEngine {

  private flags:       Map<string, FeatureFlag>    = new Map();
  private assignments: Map<string, string>         = new Map(); // userId+flagKey → variantKey

  constructor() {
    for (const partial of HIIOS_FLAGS) {
      const flag: FeatureFlag = {
        id:                randomUUID(),
        key:               partial.key!,
        name:              partial.name ?? partial.key!,
        description:       partial.description ?? "",
        enabled:           partial.enabled ?? false,
        rolloutPercentage: partial.rolloutPercentage ?? 0,
        targeting:         partial.targeting ?? [],
        variants:          partial.variants ?? [],
        defaultVariant:    partial.defaultVariant ?? "control",
        createdAt:         new Date(),
        updatedAt:         new Date(),
        expiresAt:         partial.expiresAt,
        tags:              partial.tags ?? [],
      };
      this.flags.set(flag.key, flag);
    }
  }

  // ── Évaluation d'un flag ───────────────────

  evaluate(flagKey: string, context: FlagContext): FlagEvaluation {
    const flag = this.flags.get(flagKey);

    if (!flag) {
      return { flagKey, enabled: false, variant: "off", reason: "FLAG_NOT_FOUND" };
    }

    // Vérifier l'expiration
    if (flag.expiresAt && flag.expiresAt < new Date()) {
      return { flagKey, enabled: false, variant: flag.defaultVariant, reason: "FLAG_EXPIRED" };
    }

    // Flag désactivé
    if (!flag.enabled) {
      return { flagKey, enabled: false, variant: flag.defaultVariant, reason: "FLAG_DISABLED" };
    }

    // Ciblage
    for (const rule of [...flag.targeting].sort((a, b) => b.priority - a.priority)) {
      if (this.matchesTargeting(rule, context)) {
        const variant = flag.variants.find(v => v.key === rule.variant);
        return {
          flagKey,
          enabled: true,
          variant:  rule.variant,
          payload:  variant?.payload,
          reason:   "TARGETING_MATCH",
        };
      }
    }

    // Rollout
    if (!this.isInRollout(flag, context)) {
      return { flagKey, enabled: false, variant: flag.defaultVariant, reason: "NOT_IN_ROLLOUT" };
    }

    // A/B assignment
    if (flag.variants.length > 1) {
      const variant = this.assignVariant(flag, context);
      return {
        flagKey,
        enabled: true,
        variant:  variant.key,
        payload:  variant.payload,
        reason:   "A_B_ASSIGNMENT",
      };
    }

    // Variant par défaut
    const defaultVariant = flag.variants.find(v => v.key === flag.defaultVariant);
    return {
      flagKey,
      enabled: true,
      variant:  flag.defaultVariant,
      payload:  defaultVariant?.payload,
      reason:   "DEFAULT_VARIANT",
    };
  }

  // ── Évaluation multiple ────────────────────

  evaluateAll(context: FlagContext): Record<string, FlagEvaluation> {
    const results: Record<string, FlagEvaluation> = {};
    for (const flag of this.flags.values()) {
      results[flag.key] = this.evaluate(flag.key, context);
    }
    return results;
  }

  // ── Helpers ────────────────────────────────

  private matchesTargeting(rule: TargetingRule, context: FlagContext): boolean {
    return rule.conditions.every(cond => {
      const value = this.resolveContextAttribute(cond.attribute, context);
      if (value === undefined) return false;
      return this.evaluateCondition(value, cond.operator, cond.value);
    });
  }

  private resolveContextAttribute(
    attribute: string,
    context:   FlagContext
  ): string | number | undefined {
    switch (attribute) {
      case "userId":         return context.userId;
      case "organizationId": return context.organizationId;
      case "role":           return context.role;
      case "plan":           return context.plan;
      default:
        return context.custom?.[attribute] as string | number | undefined;
    }
  }

  private evaluateCondition(
    value:    string | number,
    operator: TargetingCondition["operator"],
    target:   TargetingCondition["value"]
  ): boolean {
    switch (operator) {
      case "EQ":       return value === target;
      case "IN":       return Array.isArray(target) && target.includes(value as string);
      case "NOT_IN":   return Array.isArray(target) && !target.includes(value as string);
      case "CONTAINS": return typeof value === "string" && value.includes(target as string);
      case "GT":       return typeof value === "number" && value > (target as number);
      case "LT":       return typeof value === "number" && value < (target as number);
      default:         return false;
    }
  }

  private isInRollout(flag: FeatureFlag, context: FlagContext): boolean {
    if (flag.rolloutPercentage >= 100) return true;
    if (flag.rolloutPercentage <= 0)  return false;

    const key  = `${context.userId ?? context.organizationId ?? "anonymous"}:${flag.key}`;
    const hash = this.hashString(key);
    return (hash % 100) < flag.rolloutPercentage;
  }

  private assignVariant(flag: FeatureFlag, context: FlagContext): Variant {
    const assignmentKey = `${context.userId ?? "anon"}:${flag.key}`;

    // Vérifier si une assignation existe déjà (sticky)
    const cached = this.assignments.get(assignmentKey);
    if (cached) {
      return flag.variants.find(v => v.key === cached) ?? flag.variants[0];
    }

    // Nouvelle assignation pondérée
    const hash   = this.hashString(assignmentKey);
    const bucket = hash % 100;
    let   cumulative = 0;

    const totalWeight = flag.variants.reduce((s, v) => s + v.weight, 0);

    for (const variant of flag.variants) {
      cumulative += (variant.weight / totalWeight) * 100;
      if (bucket < cumulative) {
        this.assignments.set(assignmentKey, variant.key);
        return variant;
      }
    }

    const fallback = flag.variants[flag.variants.length - 1];
    this.assignments.set(assignmentKey, fallback.key);
    return fallback;
  }

  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash; // 32-bit
    }
    return Math.abs(hash);
  }

  // ── Admin ──────────────────────────────────

  upsertFlag(flag: Partial<FeatureFlag> & { key: string }): void {
    const existing = this.flags.get(flag.key);
    const merged: FeatureFlag = {
      id:                existing?.id ?? randomUUID(),
      key:               flag.key,
      name:              flag.name ?? existing?.name ?? flag.key,
      description:       flag.description ?? existing?.description ?? "",
      enabled:           flag.enabled ?? existing?.enabled ?? false,
      rolloutPercentage: flag.rolloutPercentage ?? existing?.rolloutPercentage ?? 0,
      targeting:         flag.targeting ?? existing?.targeting ?? [],
      variants:          flag.variants ?? existing?.variants ?? [],
      defaultVariant:    flag.defaultVariant ?? existing?.defaultVariant ?? "control",
      createdAt:         existing?.createdAt ?? new Date(),
      updatedAt:         new Date(),
      expiresAt:         flag.expiresAt ?? existing?.expiresAt,
      tags:              flag.tags ?? existing?.tags ?? [],
    };
    this.flags.set(flag.key, merged);
  }

  getFlag(key: string): FeatureFlag | undefined {
    return this.flags.get(key);
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  getExperiments(): FeatureFlag[] {
    return this.getAllFlags().filter(f => f.variants.length > 1);
  }
}
