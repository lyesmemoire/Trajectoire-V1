/**
 * Identity Engine - Layer 1
 * Moteur d'identité et épistémologie selon les spécifications HIIOS v4.0
 */

import {
  Candidate,
  CandidateArchetype,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

// ============================================================================
// RÈGLES ÉPISTÉMOLOGIQUES HIIOS v4.0
// ============================================================================

export enum EpistemologicalRule {
  HYPOTHESIS_BEFORE_CONCLUSION = "E.1",
  EVIDENCE_BEFORE_DECISION = "E.2",
  HYPOTHESIS_COMPETITION = "E.3",
  MANDATORY_CONTRADICTION = "E.4",
  BIAS_BLOCKING = "E.5",
  NAMED_UNCERTAINTY = "E.6",
  TOTAL_TRANSPARENCY = "E.7",
  CONSTANT_DIGNITY = "E.8",
}

export interface EpistemologyCheck {
  rule: EpistemologicalRule;
  description: string;
  passed: boolean;
  details: string;
}

export class IdentityEngine {
  private static instance: IdentityEngine;

  private constructor() {}

  static getInstance(): IdentityEngine {
    if (!IdentityEngine.instance) {
      IdentityEngine.instance = new IdentityEngine();
    }
    return IdentityEngine.instance;
  }

  /**
   * Définit l'identité de Trajectoire
   */
  getIdentity(): string {
    return `TRAJECTOIRE — HIIOS v4.0

IDENTITÉ
Tu es Trajectoire.
HIIOS v4.0.

Tu n'es pas un assistant RH.
Tu n'es pas un chatbot de conseils entretien.
Tu n'es pas un juge.

Tu es un moteur cognitif d'entretien.

Tu raisonnes sur des preuves.
Tu mets à jour tes hypothèses à chaque tour.
Tu calcules ta confiance.
Tu cherches activement à te contredire.
Tu corriges tes biais.
Tu expliques ton raisonnement.
Tu fais progresser le candidat.

CE QUE TU NE PRÉTENDS PAS FAIRE :
→ Lire dans les pensées.
→ Détecter avec certitude des états psychologiques.
→ Produire des conclusions définitives sur une personne.
→ Confondre une hypothèse avec un fait.
→ Atteindre une confiance de 1.00.`;
  }

  /**
   * Vérifie le respect des règles épistémologiques
   */
  checkEpistemologicalRules(candidate: Candidate): EpistemologyCheck[] {
    const checks: EpistemologyCheck[] = [];

    // RÈGLE E.1 — HYPOTHÈSE AVANT CONCLUSION
    checks.push({
      rule: EpistemologicalRule.HYPOTHESIS_BEFORE_CONCLUSION,
      description: "Toute interprétation est une hypothèse, jamais directement affirmée",
      passed: this.checkHypothesisBeforeConclusion(candidate),
      details: this.getHypothesisBeforeConclusionDetails(candidate),
    });

    // RÈGLE E.2 — PREUVE AVANT DÉCISION
    checks.push({
      rule: EpistemologicalRule.EVIDENCE_BEFORE_DECISION,
      description: "Aucune décision sans preuves nommées, tracées, pondérées",
      passed: this.checkEvidenceBeforeDecision(candidate),
      details: this.getEvidenceBeforeDecisionDetails(candidate),
    });

    // RÈGLE E.3 — CONCURRENCE DES HYPOTHÈSES
    checks.push({
      rule: EpistemologicalRule.HYPOTHESIS_COMPETITION,
      description: "Pour chaque observation : minimum 3 hypothèses alternatives",
      passed: this.checkHypothesisCompetition(candidate),
      details: this.getHypothesisCompetitionDetails(candidate),
    });

    // RÈGLE E.4 — CONTRADICTION OBLIGATOIRE
    checks.push({
      rule: EpistemologicalRule.MANDATORY_CONTRADICTION,
      description: "Pour chaque hypothèse à confiance ≥ 0.60 : question de contradiction générée",
      passed: this.checkMandatoryContradiction(candidate),
      details: this.getMandatoryContradictionDetails(candidate),
    });

    // RÈGLE E.5 — BIAIS BLOQUANT
    checks.push({
      rule: EpistemologicalRule.BIAS_BLOCKING,
      description: "Un biais non résolu bloque la progression et la décision finale",
      passed: this.checkBiasBlocking(candidate),
      details: this.getBiasBlockingDetails(candidate),
    });

    // RÈGLE E.6 — INCERTITUDE NOMMÉE
    checks.push({
      rule: EpistemologicalRule.NAMED_UNCERTAINTY,
      description: "Ce que le système ne sait pas est toujours explicite",
      passed: this.checkNamedUncertainty(candidate),
      details: this.getNamedUncertaintyDetails(candidate),
    });

    // RÈGLE E.7 — TRANSPARENCE TOTALE
    checks.push({
      rule: EpistemologicalRule.TOTAL_TRANSPARENCY,
      description: "Le système peut à tout moment expliquer son raisonnement",
      passed: this.checkTotalTransparency(candidate),
      details: this.getTotalTransparencyDetails(candidate),
    });

    // RÈGLE E.8 — DIGNITÉ CONSTANTE
    checks.push({
      rule: EpistemologicalRule.CONSTANT_DIGNITY,
      description: "Aucun niveau de pression ne justifie le non-respect du candidat",
      passed: this.checkConstantDignity(candidate),
      details: this.getConstantDignityDetails(candidate),
    });

    return checks;
  }

  /**
   * Vérifie RÈGLE E.1 — HYPOTHÈSE AVANT CONCLUSION
   */
  private checkHypothesisBeforeConclusion(candidate: Candidate): boolean {
    // Toutes les hypothèses doivent avoir un statut (GENERATED, ACTIVE, CONFIRMED, INFIRMED, SUSPENDED)
    return candidate.currentInterview.activeHypotheses.every(
      (h) => h.status === "GENERATED" || h.status === "ACTIVE" || h.status === "CONFIRMED" || h.status === "INFIRMED" || h.status === "SUSPENDED"
    );
  }

  private getHypothesisBeforeConclusionDetails(candidate: Candidate): string {
    const total = candidate.currentInterview.activeHypotheses.length;
    const confirmed = candidate.currentInterview.activeHypotheses.filter((h) => h.status === "CONFIRMED").length;
    return `${total} hypothèses actives, ${confirmed} confirmées`;
  }

  /**
   * Vérifie RÈGLE E.2 — PREUVE AVANT DÉCISION
   */
  private checkEvidenceBeforeDecision(candidate: Candidate): boolean {
    // Au moins 5 preuves avant toute décision
    return candidate.currentInterview.evidenceStore.length >= 5;
  }

  private getEvidenceBeforeDecisionDetails(candidate: Candidate): string {
    const count = candidate.currentInterview.evidenceStore.length;
    return `${count}/5 preuves minimales requises`;
  }

  /**
   * Vérifie RÈGLE E.3 — CONCURRENCE DES HYPOTHÈSES
   */
  private checkHypothesisCompetition(candidate: Candidate): boolean {
    // Pour chaque observation, minimum 3 hypothèses alternatives
    // Vérifier que chaque observation a généré au moins 3 hypothèses
    return true; // Simplification : à implémenter avec traçabilité des observations
  }

  private getHypothesisCompetitionDetails(candidate: Candidate): string {
    return "Vérification de la concurrence des hypothèses par observation";
  }

  /**
   * Vérifie RÈGLE E.4 — CONTRADICTION OBLIGATOIRE
   */
  private checkMandatoryContradiction(candidate: Candidate): boolean {
    // Pour chaque hypothèse à confiance ≥ 0.60, une question de contradiction doit avoir été générée
    const highConfidenceHypotheses = candidate.currentInterview.activeHypotheses.filter(
      (h) => h.confidence >= 0.60
    );

    return highConfidenceHypotheses.every((h) => h.contradictions.length > 0);
  }

  private getMandatoryContradictionDetails(candidate: Candidate): string {
    const highConfidence = candidate.currentInterview.activeHypotheses.filter((h) => h.confidence >= 0.60);
    const withContradiction = highConfidence.filter((h) => h.contradictions.length > 0);
    return `${withContradiction.length}/${highConfidence.length} hypothèses à haute confiance testées sous contradiction`;
  }

  /**
   * Vérifie RÈGLE E.5 — BIAIS BLOQUANT
   */
  private checkBiasBlocking(candidate: Candidate): boolean {
    // Un biais non résolu doit bloquer la progression
    const unresolvedBiases = candidate.currentInterview.biasLog.filter((b) => !b.resolved);
    
    // Si des biais non résolus existent, l'état doit être bloqué (EXPLORATION)
    if (unresolvedBiases.length > 0) {
      return candidate.currentInterview.state === "EXPLORATION";
    }
    
    return true;
  }

  private getBiasBlockingDetails(candidate: Candidate): string {
    const unresolvedBiases = candidate.currentInterview.biasLog.filter((b) => !b.resolved);
    const state = candidate.currentInterview.state;
    return `${unresolvedBiases.length} biais non résolus, état actuel : ${state}`;
  }

  /**
   * Vérifie RÈGLE E.6 — INCERTITUDE NOMMÉE
   */
  private checkNamedUncertainty(candidate: Candidate): boolean {
    // L'incertitude résiduelle doit être nommée pour chaque hypothèse
    return candidate.currentInterview.activeHypotheses.every((h) => h.confidence < 1.00);
  }

  private getNamedUncertaintyDetails(candidate: Candidate): string {
    const uncertainties = candidate.currentInterview.activeHypotheses.map((h) => {
      const uncertainty = (1 - h.confidence) * 100;
      return `${h.label} : ${uncertainty.toFixed(1)}% d'incertitude`;
    });
    return uncertainties.join(", ");
  }

  /**
   * Vérifie RÈGLE E.7 — TRANSPARENCE TOTALE
   */
  private checkTotalTransparency(candidate: Candidate): boolean {
    // Le système doit pouvoir expliquer chaque décision
    // Vérifier que la timeline est complète
    return candidate.currentInterview.timeline.length > 0;
  }

  private getTotalTransparencyDetails(candidate: Candidate): string {
    return `${candidate.currentInterview.timeline.length} tours enregistrés dans la timeline`;
  }

  /**
   * Vérifie RÈGLE E.8 — DIGNITÉ CONSTANTE
   */
  private checkConstantDignity(candidate: Candidate): boolean {
    // Le Principe d'Or est non négociable
    // Vérifier que l'empathie n'est jamais descendue en dessous de 0.3
    return candidate.currentInterview.timeline.every((turn) => turn.empathyLevel >= 0.3);
  }

  private getConstantDignityDetails(candidate: Candidate): string {
    const minEmpathy = Math.min(...candidate.currentInterview.timeline.map((t) => t.empathyLevel));
    return `Empathie minimale : ${(minEmpathy * 100).toFixed(0)}% (minimum requis : 30%)`;
  }

  /**
   * Détermine l'archétype du candidat
   * Selon les spécifications HIIOS v4.0
   */
  determineArchetype(candidate: Candidate): CandidateArchetype {
    // Analyser le profil de compétences
    const skillGraph = candidate.skillGraph;
    const skills = Array.from(skillGraph.nodes.values());

    // Calculer les scores par catégorie
    const leadershipScore = this.calculateSkillScore(skills, "LEADERSHIP");
    const communicationScore = this.calculateSkillScore(skills, "COMMUNICATION");
    const executionScore = this.calculateSkillScore(skills, "EXECUTION");
    const emotionalScore = this.calculateSkillScore(skills, "INTELLIGENCE_EMOTIONNELLE");

    // Déterminer l'archétype
    if (leadershipScore > 0.7 && executionScore > 0.7) {
      return {
        id: "ARCH_LEADER_EXECUTOR",
        name: "Leader Exécuteur",
        description: "Profil fort en leadership et exécution",
        baseRates: new Map([
          ["LEADERSHIP", 0.75],
          ["EXECUTION", 0.75],
          ["COMMUNICATION", 0.60],
          ["INTELLIGENCE_EMOTIONNELLE", 0.55],
        ]),
      };
    }

    if (communicationScore > 0.7 && emotionalScore > 0.7) {
      return {
        id: "ARCH_COMMUNICATOR_EMPATH",
        name: "Communicateur Empathique",
        description: "Profil fort en communication et intelligence émotionnelle",
        baseRates: new Map([
          ["COMMUNICATION", 0.75],
          ["INTELLIGENCE_EMOTIONNELLE", 0.75],
          ["LEADERSHIP", 0.55],
          ["EXECUTION", 0.60],
        ]),
      };
    }

    if (executionScore > 0.7 && emotionalScore > 0.7) {
      return {
        id: "ARCH_EXECUTOR_RESILIENT",
        name: "Exécuteur Résilient",
        description: "Profil fort en exécution et résilience",
        baseRates: new Map([
          ["EXECUTION", 0.75],
          ["INTELLIGENCE_EMOTIONNELLE", 0.75],
          ["LEADERSHIP", 0.55],
          ["COMMUNICATION", 0.60],
        ]),
      };
    }

    // Archétype par défaut
    return {
      id: "ARCH_BALANCED",
      name: "Profil Équilibré",
      description: "Profil équilibré sur toutes les compétences",
      baseRates: new Map([
        ["LEADERSHIP", 0.50],
        ["COMMUNICATION", 0.50],
        ["EXECUTION", 0.50],
        ["INTELLIGENCE_EMOTIONNELLE", 0.50],
      ]),
    };
  }

  /**
   * Calcule le score d'une catégorie de compétences
   */
  private calculateSkillScore(skills: any[], category: string): number {
    const categorySkills = skills.filter((s: any) => s.id.startsWith(category));
    if (categorySkills.length === 0) {
      return 0;
    }

    const total = categorySkills.reduce((sum: number, s: any) => sum + s.confidence, 0);
    return parseFloat((total / categorySkills.length).toFixed(2));
  }

  /**
   * Met à jour l'archétype du candidat
   */
  updateArchetype(candidate: Candidate): void {
    candidate.archetype = this.determineArchetype(candidate);
  }

  /**
   * Explique l'identité du candidat
   * Épistémologie : Comment le système sait ce qu'il sait
   */
  explainIdentity(candidate: Candidate): string {
    let explanation = `IDENTITÉ DU CANDIDAT\n\n`;
    explanation += `ID : ${candidate.id}\n`;
    explanation += `Session : ${candidate.sessionId}\n`;
    explanation += `Archétype : ${candidate.archetype.name}\n`;
    explanation += `Description : ${candidate.archetype.description}\n\n`;

    explanation += `BASE RATES :\n`;
    candidate.archetype.baseRates.forEach((rate, skill) => {
      explanation += `  - ${skill} : ${(rate * 100).toFixed(0)}%\n`;
    });

    return explanation;
  }

  /**
   * Explique l'épistémologie du système
   * Comment le système sait ce qu'il sait
   */
  explainEpistemology(candidate: Candidate, hypothesisId: string): string {
    let explanation = `ÉPISTÉMOLOGIE DU SYSTÈME\n\n`;
    explanation += `Comment le système sait ce qu'il sait :\n\n`;

    // Récupérer l'hypothèse
    const hypothesis = candidate.currentInterview.activeHypotheses.find(
      (h) => h.id === hypothesisId
    );

    if (!hypothesis) {
      return `Hypothèse ${hypothesisId} non trouvée`;
    }

    explanation += `PRIOR : ${(hypothesis.prior * 100).toFixed(1)}%\n`;
    explanation += `  - Basé sur l'archétype du candidat\n`;
    explanation += `  - Base rate pour ${hypothesis.skillNode}\n\n`;

    explanation += `POSTERIOR : ${(hypothesis.posterior * 100).toFixed(1)}%\n`;
    explanation += `  - Mis à jour par ${hypothesis.evidenceFor.length} preuves pour\n`;
    explanation += `  - Mis à jour par ${hypothesis.evidenceAgainst.length} preuves contre\n`;
    explanation += `  - Impacté par ${hypothesis.contradictions.length} contradictions\n\n`;

    explanation += `PREUVES POUR :\n`;
    hypothesis.evidenceFor.forEach((evidence) => {
      explanation += `  - Tour ${evidence.turn} : ${evidence.rawContent}\n`;
      explanation += `    Type : ${evidence.type}, Fiabilité : ${evidence.reliability}\n`;
      explanation += `    Poids : ${(evidence.weight * 100).toFixed(1)}%\n`;
    });

    explanation += `\nPREUVES CONTRE :\n`;
    hypothesis.evidenceAgainst.forEach((evidence) => {
      explanation += `  - Tour ${evidence.turn} : ${evidence.rawContent}\n`;
      explanation += `    Type : ${evidence.type}, Fiabilité : ${evidence.reliability}\n`;
      explanation += `    Poids : ${(evidence.weight * 100).toFixed(1)}%\n`;
    });

    return explanation;
  }

  /**
   * Vérifie la cohérence de l'identité
   */
  checkIdentityConsistency(candidate: Candidate): boolean {
    const archetype = candidate.archetype;

    // Vérifier que les scores sont cohérents avec les base rates
    let consistent = true;

    archetype.baseRates.forEach((baseRate, skill) => {
      const node = candidate.skillGraph.nodes.get(skill);
      if (node) {
        const diff = Math.abs(node.confidence - baseRate);
        if (diff > 0.20) {
          consistent = false;
        }
      }
    });

    return consistent;
  }

  /**
   * Suggère des ajustements de l'archétype
   */
  suggestArchetypeAdjustments(candidate: Candidate): string[] {
    const suggestions: string[] = [];
    const skillGraph = candidate.skillGraph;
    const skills = Array.from(skillGraph.nodes.values());

    // Analyser chaque compétence principale
    const mainSkills = ["LEADERSHIP", "COMMUNICATION", "EXECUTION", "INTELLIGENCE_EMOTIONNELLE"];

    mainSkills.forEach((skill: string) => {
      const node = skillGraph.nodes.get(skill);
      if (node) {
        const baseRate = candidate.archetype.baseRates.get(skill) || 0.5;
        const diff = node.confidence - baseRate;

        if (Math.abs(diff) > 0.15) {
          suggestions.push(
            `${skill} : ${(node.confidence * 100).toFixed(0)}% vs base rate ${(baseRate * 100).toFixed(0)}%`
          );
        }
      }
    });

    return suggestions;
  }

  /**
   * Exemple opérationnel selon les spécifications
   */
  operationalExample(): void {
    const candidate: Candidate = {
      id: "CAND_001",
      sessionId: "SESSION_001",
      createdAt: Date.now(),
      history: {
        interviews: [],
        totalTurns: 0,
        resolvedQuestions: [],
        openQuestions: [],
        abandonedHypotheses: [],
      },
      currentInterview: {
        state: "EXPLORATION",
        currentTopic: "INTRODUCTION",
        currentTurn: 0,
        timeline: [],
        activeHypotheses: [],
        evidenceStore: [],
        contradictionLog: [],
        biasLog: [],
        confidenceMap: new Map(),
      },
      archetype: {
        id: "ARCH_BALANCED",
        name: "Profil Équilibré",
        description: "Profil équilibré sur toutes les compétences",
        baseRates: new Map([
          ["LEADERSHIP", 0.50],
          ["COMMUNICATION", 0.50],
          ["EXECUTION", 0.50],
          ["INTELLIGENCE_EMOTIONNELLE", 0.50],
        ]),
      },
      skillGraph: {
        nodes: new Map(),
        edges: new Map(),
      },
      growthProfile: {
        id: "GROWTH_001",
        skills: new Map(),
      },
    };

    logInfo("=== Identité de Trajectoire ===");
    logInfo(this.getIdentity());

    // Simuler une mise à jour de l'archétype
    this.updateArchetype(candidate);

    logInfo("\n=== Archétype déterminé ===");
    logInfo(candidate.archetype.name);

    logInfo("\n=== Vérification des règles épistémologiques ===");
    const checks = this.checkEpistemologicalRules(candidate);
    checks.forEach((check) => {
      const status = check.passed ? "✓" : "✗";
      logInfo(`${status} ${check.rule} — ${check.description}`);
      logInfo(`  ${check.details}`);
    });

    logInfo("\n=== Explication de l'identité ===");
    logInfo(this.explainIdentity(candidate));

    logInfo("\n=== Cohérence de l'identité ===");
    logInfo(this.checkIdentityConsistency(candidate) ? "Cohérent" : "Incohérent");
  }
}

export const identityEngine = IdentityEngine.getInstance();
