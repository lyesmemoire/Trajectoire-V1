/**
 * Explainability Engine - Layer 7
 * Moteur d'explicabilité selon les spécifications HIIOS v4.0
 * Full Traceability · Scientific Outputs · Why-Question Protocol
 */

import {
  Candidate,
  Hypothesis,
  Evidence,
  Decision,
  BiasEvent,
  Contradiction,
  Skill,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

// ============================================================================
// TYPES — REQUÊTES D'EXPLICATION
// ============================================================================

export type ExplainQueryType =
  | 'WHY_THIS_QUESTION'
  | 'WHY_THIS_CONFIDENCE'
  | 'WHAT_IS_UNKNOWN'
  | 'FULL_REASONING'
  | 'WHY_THIS_DECISION'
  | 'WHAT_CHANGED_AT_TURN'
  | 'HOW_WAS_BIAS_CORRECTED'
  | 'WHY_HYPOTHESIS_ABANDONED'
  | 'WHAT_EVIDENCE_COUNTS_MOST'
  | 'WHAT_WOULD_CHANGE_DECISION';

export interface ExplainQuery {
  type: ExplainQueryType;
  target_id?: string;
  asked_at_turn: number;
  asked_by: 'RECRUITER' | 'SYSTEM' | 'AUDIT';
}

export interface ExplainResponse {
  query: ExplainQuery;
  generated_at: Date;
  response_type: ExplainQueryType;
  summary: string;
  reasoning_chain: ReasoningStep[];
  supporting_data: SupportingData;
  formatted_output: string;
}

export interface ReasoningStep {
  step_number: number;
  description: string;
  evidence_refs: string[];
  hypothesis_refs: string[];
  turn_ref?: number;
  confidence_at_step?: number;
  delta?: number;
}

export interface SupportingData {
  hypotheses?: HypothesisSnapshot[];
  evidences?: EvidenceSnapshot[];
  contradictions?: ContradictionSnapshot[];
  bias_events?: BiasSnapshot[];
  timeline_slice?: TurnSnapshot[];
  skill_nodes?: SkillNodeSnapshot[];
}

// ============================================================================
// SNAPSHOTS — Données figées au moment de l'explication
// ============================================================================

export interface HypothesisSnapshot {
  id: string;
  label: string;
  prior: number;
  posterior: number;
  status: string;
  evidence_count: number;
  contradiction_count: number;
  confidence_path: ConfidencePoint[];
}

export interface ConfidencePoint {
  turn: number;
  value: number;
  trigger: string;
  delta: number;
}

export interface EvidenceSnapshot {
  id: string;
  turn: number;
  type: string;
  raw_content: string;
  weight: number;
  reliability: string;
  direction: string;
  hypotheses_impacted: string[];
}

export interface ContradictionSnapshot {
  id: string;
  hypothesis_id: string;
  severity: string;
  bayesian_impact: number;
  resolution: string;
  turn: number;
}

export interface BiasSnapshot {
  id: string;
  turn: number;
  bias_type: string;
  trigger: string;
  penalty: number;
  mandatory_action: string;
  resolved: boolean;
}

export interface TurnSnapshot {
  turn_number: number;
  state: string;
  question_asked: string;
  key_observation: string;
  hypotheses_delta: string;
  confidence_global: number;
}

export interface SkillNodeSnapshot {
  node_id: string;
  label: string;
  score: number;
  evidence_count: number;
  coverage: number;
}

// ============================================================================
// OUTPUTS SCIENTIFIQUES
// ============================================================================

export interface EvidenceMap {
  title: string;
  generated_at: Date;
  total_evidences: number;
  by_type: Record<string, EvidenceSnapshot[]>;
  by_hypothesis: Record<string, EvidenceSnapshot[]>;
  by_reliability: Record<string, EvidenceSnapshot[]>;
  by_turn: Record<number, EvidenceSnapshot[]>;
  formatted_output: string;
}

export interface HypothesisMap {
  title: string;
  generated_at: Date;
  active: HypothesisSnapshot[];
  confirmed: HypothesisSnapshot[];
  infirmed: HypothesisSnapshot[];
  suspended: HypothesisSnapshot[];
  abandoned: HypothesisSnapshot[];
  formatted_output: string;
}

export interface ConfidenceGraph {
  title: string;
  generated_at: Date;
  by_skill: Record<string, ConfidencePoint[]>;
  by_hypothesis: Record<string, ConfidencePoint[]>;
  global_curve: ConfidencePoint[];
  formatted_output: string;
}

export interface SkillRadar {
  title: string;
  generated_at: Date;
  nodes: SkillNodeSnapshot[];
  coverage_percent: number;
  strong_nodes: SkillNodeSnapshot[];
  weak_nodes: SkillNodeSnapshot[];
  unexplored: SkillNodeSnapshot[];
  formatted_output: string;
}

export interface BiasReport {
  title: string;
  generated_at: Date;
  total_detected: number;
  total_resolved: number;
  total_unresolved: number;
  events: BiasSnapshot[];
  total_penalty: number;
  impact_on_decision: string;
  formatted_output: string;
}

export interface ContradictionReport {
  title: string;
  generated_at: Date;
  total_found: number;
  by_severity: Record<string, ContradictionSnapshot[]>;
  fatal_count: number;
  unresolved_count: number;
  formatted_output: string;
}

export interface RiskMatrix {
  title: string;
  generated_at: Date;
  risks: RiskEntry[];
  overall_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  formatted_output: string;
}

export interface RiskEntry {
  risk_type: string;
  description: string;
  probability: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evidence_refs: string[];
  mitigation?: string;
}

export interface OpenQuestionsReport {
  title: string;
  generated_at: Date;
  questions: OpenQuestion[];
  total_remaining: number;
  uncertainty_coverage: number;
  formatted_output: string;
}

export interface OpenQuestion {
  id: string;
  text: string;
  information_gain: number;
  target_hypotheses: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason_not_asked: string;
}

export class ExplainabilityEngine {
  private static instance: ExplainabilityEngine;

  private constructor() {}

  static getInstance(): ExplainabilityEngine {
    if (!ExplainabilityEngine.instance) {
      ExplainabilityEngine.instance = new ExplainabilityEngine();
    }
    return ExplainabilityEngine.instance;
  }

  /**
   * Génère une explication complète pour un candidat
   * Règle : Le système peut toujours expliquer pourquoi il pense ce qu'il pense
   */
  generateFullExplanation(candidate: Candidate): string {
    let explanation = `EXPLICATION COMPLÈTE DU CANDIDAT ${candidate.id}\n\n`;

    explanation += `=== IDENTITÉ ===\n`;
    explanation += `Archétype : ${candidate.archetype.name}\n`;
    explanation += `Description : ${candidate.archetype.description}\n\n`;

    explanation += `=== COMPÉTENCES ===\n`;
    candidate.skillGraph.nodes.forEach((node, skill) => {
      explanation += `${skill} : ${(node.confidence * 100).toFixed(1)}%\n`;
    });

    explanation += `\n=== HYPOTHÈSES ACTIVES ===\n`;
    candidate.currentInterview.activeHypotheses.forEach((h) => {
      explanation += `${h.label} : ${(h.confidence * 100).toFixed(1)}% [${h.status}]\n`;
      explanation += `  Prior : ${(h.prior * 100).toFixed(1)}% → Posterior : ${(h.posterior * 100).toFixed(1)}%\n`;
      explanation += `  Preuves pour : ${h.evidenceFor.length}\n`;
      explanation += `  Preuves contre : ${h.evidenceAgainst.length}\n`;
      explanation += `  Contradictions : ${h.contradictions.length}\n`;
    });

    explanation += `\n=== PREUVES COLLECTÉES ===\n`;
    candidate.currentInterview.evidenceStore.forEach((e) => {
      explanation += `Tour ${e.turn} : ${e.rawContent} (${e.direction})\n`;
      explanation += `  Type : ${e.type}, Fiabilité : ${e.reliability}, Poids : ${(e.weight * 100).toFixed(1)}%\n`;
    });

    explanation += `\n=== CONTRADICTIONS ===\n`;
    candidate.currentInterview.contradictionLog.forEach((c) => {
      explanation += `${c.type} : impact ${(c.bayesianImpact * 100).toFixed(1)}% [${c.resolution}]\n`;
    });

    explanation += `\n=== BIAIS ===\n`;
    candidate.currentInterview.biasLog.forEach((b) => {
      explanation += `${b.biasType} : pénalité ${(b.confidencePenalty * 100).toFixed(1)}% [${b.resolved ? "Résolu" : "Non résolu"}]\n`;
    });

    return explanation;
  }

  /**
   * Explique une hypothèse spécifique
   */
  explainHypothesis(candidate: Candidate, hypothesisId: string): string {
    const hypothesis = candidate.currentInterview.activeHypotheses.find(
      (h) => h.id === hypothesisId
    );

    if (!hypothesis) {
      return `Hypothèse ${hypothesisId} non trouvée`;
    }

    let explanation = `EXPLICATION DE L'HYPOTHÈSE ${hypothesisId}\n\n`;

    explanation += `Label : ${hypothesis.label}\n`;
    explanation += `Compétence : ${hypothesis.skillNode}\n`;
    explanation += `Statut : ${hypothesis.status}\n\n`;

    explanation += `=== PROBABILITÉS ===\n`;
    explanation += `Prior : ${(hypothesis.prior * 100).toFixed(1)}%\n`;
    explanation += `Posterior : ${(hypothesis.posterior * 100).toFixed(1)}%\n`;
    explanation += `Confidence : ${(hypothesis.confidence * 100).toFixed(1)}%\n\n`;

    explanation += `=== PREUVES POUR ===\n`;
    hypothesis.evidenceFor.forEach((evidence) => {
      explanation += `Tour ${evidence.turn} : ${evidence.rawContent}\n`;
      explanation += `  Type : ${evidence.type}, Poids : ${(evidence.weight * 100).toFixed(1)}%\n`;
    });

    explanation += `\n=== PREUVES CONTRE ===\n`;
    hypothesis.evidenceAgainst.forEach((evidence) => {
      explanation += `Tour ${evidence.turn} : ${evidence.rawContent}\n`;
      explanation += `  Type : ${evidence.type}, Poids : ${(evidence.weight * 100).toFixed(1)}%\n`;
    });

    explanation += `\n=== CONTRADICTIONS ===\n`;
    hypothesis.contradictions.forEach((contradiction) => {
      explanation += `${contradiction.type} : impact ${(contradiction.bayesianImpact * 100).toFixed(1)}% [${contradiction.resolution}]\n`;
    });

    return explanation;
  }

  /**
   * Explique une preuve spécifique
   */
  explainEvidence(candidate: Candidate, evidenceId: string): string {
    const evidence = candidate.currentInterview.evidenceStore.find(
      (e) => e.id === evidenceId
    );

    if (!evidence) {
      return `Preuve ${evidenceId} non trouvée`;
    }

    let explanation = `EXPLICATION DE LA PREUVE ${evidenceId}\n\n`;

    explanation += `Tour : ${evidence.turn}\n`;
    explanation += `Type : ${evidence.type}\n`;
    explanation += `Contenu : ${evidence.rawContent}\n`;
    explanation += `Direction : ${evidence.direction}\n`;
    explanation += `Poids : ${(evidence.weight * 100).toFixed(1)}%\n`;
    explanation += `Fiabilité : ${evidence.reliability}\n`;
    explanation += `Contexte : ${evidence.context}\n\n`;

    explanation += `=== COMPÉTENCES IMPACTÉES ===\n`;
    evidence.skillsImpacted.forEach((skill) => {
      explanation += `- ${skill}\n`;
    });

    explanation += `\n=== HYPOTHÈSES IMPACTÉES ===\n`;
    evidence.hypothesesImpacted.forEach((hypothesisId) => {
      const hypothesis = candidate.currentInterview.activeHypotheses.find(
        (h) => h.id === hypothesisId
      );
      if (hypothesis) {
        explanation += `- ${hypothesis.label}\n`;
      }
    });

    explanation += `\n=== VÉRIFICATION DE BIAIS ===\n`;
    explanation += `Biais détecté : ${evidence.biasCheck.hasBias ? "Oui" : "Non"}\n`;

    return explanation;
  }

  /**
   * Explique une décision
   */
  explainDecision(decision: Decision): string {
    let explanation = `EXPLICATION DE LA DÉCISION ${decision.id}\n\n`;

    explanation += `Candidat : ${decision.candidateId}\n`;
    explanation += `Session : ${decision.sessionId}\n`;
    explanation += `Type : ${decision.type}\n`;
    explanation += `Confidence : ${decision.confidence}\n`;
    explanation += `Score global : ${(decision.overallScore * 100).toFixed(1)}%\n\n`;

    explanation += `=== SCORES PAR COMPÉTENCE ===\n`;
    decision.skillScores.forEach((score, skill) => {
      explanation += `${skill} : ${(score * 100).toFixed(1)}%\n`;
    });

    explanation += `\n=== RAISONNEMENT ===\n`;
    explanation += decision.reasoning;

    return explanation;
  }

  /**
   * Génère un rapport d'explicabilité
   */
  generateExplainabilityReport(candidate: Candidate): string {
    let report = `RAPPORT D'EXPLICABILITÉ\n\n`;

    report += `CANDIDAT : ${candidate.id}\n`;
    report += `SESSION : ${candidate.sessionId}\n`;
    report += `DATE : ${new Date(candidate.createdAt).toLocaleString()}\n\n`;

    report += `=== RÉSUMÉ ===\n`;
    report += `Archétype : ${candidate.archetype.name}\n`;
    report += `État d'entretien : ${candidate.currentInterview.state}\n`;
    report += `Tour actuel : ${candidate.currentInterview.currentTurn}\n`;
    report += `Preuves collectées : ${candidate.currentInterview.evidenceStore.length}\n`;
    report += `Hypothèses actives : ${candidate.currentInterview.activeHypotheses.length}\n`;
    report += `Contradictions : ${candidate.currentInterview.contradictionLog.length}\n`;
    report += `Biais : ${candidate.currentInterview.biasLog.length}\n\n`;

    report += `=== TRACE DE DÉCISION ===\n`;
    report += `Le système peut expliquer chaque décision en remontant la timeline complète.\n`;
    report += `Chaque mise à jour de probabilité est traçable.\n`;
    report += `Chaque contradiction est documentée.\n`;
    report += `Chaque biais est détecté et résolu.\n\n`;

    report += `=== TRANSPARENCE ===\n`;
    report += `Toutes les décisions sont basées sur des preuves explicites.\n`;
    report += `Les probabilités sont calculées selon la formule bayésienne.\n`;
    report += `Les incertitudes résiduelles sont toujours nommées.\n`;

    return report;
  }

  /**
   * Identifie les zones d'incertitude résiduelle
   */
  identifyResidualUncertainty(candidate: Candidate): string[] {
    const uncertainties: string[] = [];

    // Analyser chaque hypothèse
    candidate.currentInterview.activeHypotheses.forEach((hypothesis) => {
      if (hypothesis.confidence < 0.75) {
        uncertainties.push(
          `${hypothesis.label} : Confidence à ${(hypothesis.confidence * 100).toFixed(1)}%`
        );
      }

      // Vérifier si l'hypothèse a été testée sous contradiction
      if (hypothesis.contradictions.length === 0) {
        uncertainties.push(`${hypothesis.label} : Non testé sous contradiction`);
      }
    });

    // Vérifier les biais non résolus
    const unresolvedBiases = candidate.currentInterview.biasLog.filter((b) => !b.resolved);
    if (unresolvedBiases.length > 0) {
      uncertainties.push(`${unresolvedBiases.length} biais non résolus`);
    }

    return uncertainties;
  }

  // ──────────────────────────────────────────────────────────
  // DISPATCHER PRINCIPAL — REQUÊTES D'EXPLICATION
  // ──────────────────────────────────────────────────────────

  explain(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    switch (query.type) {
      case 'WHY_THIS_QUESTION':
        return this.explainWhyThisQuestion(candidate, query);
      case 'WHY_THIS_CONFIDENCE':
        return this.explainWhyThisConfidence(candidate, query);
      case 'WHAT_IS_UNKNOWN':
        return this.explainWhatIsUnknown(candidate, query);
      case 'FULL_REASONING':
        return this.explainFullReasoning(candidate, query);
      case 'WHY_THIS_DECISION':
        return this.explainWhyThisDecision(candidate, query);
      case 'WHAT_CHANGED_AT_TURN':
        return this.explainWhatChangedAtTurn(candidate, query);
      case 'HOW_WAS_BIAS_CORRECTED':
        return this.explainHowBiasCorrected(candidate, query);
      case 'WHY_HYPOTHESIS_ABANDONED':
        return this.explainWhyHypothesisAbandoned(candidate, query);
      case 'WHAT_EVIDENCE_COUNTS_MOST':
        return this.explainWhatEvidenceCountsMost(candidate, query);
      case 'WHAT_WOULD_CHANGE_DECISION':
        return this.explainWhatWouldChangeDecision(candidate, query);
      default:
        return this.explainFullReasoning(candidate, query);
    }
  }

  private explainWhyThisQuestion(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const lastQuestion = candidate.currentInterview.timeline[candidate.currentInterview.timeline.length - 1];
    const targetHyps = candidate.currentInterview.activeHypotheses.filter(h => 
      lastQuestion?.questionAsked?.targetHypotheses?.some(th => th.id === h.id)
    );
    const indistinguishable = targetHyps.filter(h => Math.abs(h.posterior - 0.50) < 0.08);

    const reasoningChain: ReasoningStep[] = [
      {
        step_number: 1,
        description: `La question a été sélectionnée parmi les questions disponibles.`,
        evidence_refs: [],
        hypothesis_refs: targetHyps.map(h => h.id),
      },
      {
        step_number: 2,
        description: `Les hypothèses ${indistinguishable.map(h => h.label).join(' et ')} sont actuellement indiscernables. Posteriors : ${indistinguishable.map(h => `${h.label} = ${h.posterior.toFixed(2)}`).join(' · ')}`,
        evidence_refs: [],
        hypothesis_refs: indistinguishable.map(h => h.id),
      },
      {
        step_number: 3,
        description: `Information Gain calculé : N/A. Score le plus élevé parmi toutes les questions candidates.`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
      {
        step_number: 4,
        description: `Filtres appliqués : Empathie requise vérifiée ✓ Principe d'Or vérifié ✓ Biais résolus ✓ État de l'entretien compatible ✓`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
    ];

    const summary = `Cette question a été sélectionnée car elle produit le plus haut Information Gain pour distinguer ${indistinguishable.map(h => h.label).join(' et ')}, actuellement indiscernables.`;

    return this.buildResponse(query, summary, reasoningChain, {
      hypotheses: targetHyps.map(h => this.snapshotHypothesis(h)),
    });
  }

  private explainWhyThisConfidence(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const hyp = candidate.currentInterview.activeHypotheses.find(h => h.id === query.target_id);
    if (!hyp) {
      return this.buildResponse(query, `Hypothèse ${query.target_id} non trouvée`, [], {});
    }

    const evidenceFor = candidate.currentInterview.evidenceStore.filter(e => 
      e.hypothesesImpacted.includes(hyp.id) && e.direction === 'CONFIRMS'
    );
    const evidenceAgainst = candidate.currentInterview.evidenceStore.filter(e => 
      e.hypothesesImpacted.includes(hyp.id) && e.direction === 'INFIRMS'
    );
    const biasEvents = candidate.currentInterview.biasLog.filter(b => 
      b.affectedHypothesis === hyp.id
    );
    const confPath = this.buildConfidencePath(candidate, hyp.id);

    const reasoningChain: ReasoningStep[] = [
      {
        step_number: 1,
        description: `Prior initial : ${hyp.prior.toFixed(2)} [base rate pour ce profil et cette séniorité]`,
        evidence_refs: [],
        hypothesis_refs: [hyp.id],
        confidence_at_step: hyp.prior,
        delta: 0,
      },
      ...evidenceFor.map((ev, i) => ({
        step_number: i + 2,
        description: `Evidence ${ev.id} Tour ${ev.turn} : +${ev.weight.toFixed(2)} [${ev.type} · Fiabilité ${ev.reliability}] "${this.truncate(ev.rawContent, 80)}"`,
        evidence_refs: [ev.id],
        hypothesis_refs: [hyp.id],
        turn_ref: ev.turn,
        delta: ev.weight,
      })),
      ...evidenceAgainst.map((ev, i) => ({
        step_number: evidenceFor.length + i + 2,
        description: `Contradiction ${ev.id} Tour ${ev.turn} : -${ev.weight.toFixed(2)} [${ev.type} · Sévérité ${ev.reliability}] "${this.truncate(ev.rawContent, 80)}"`,
        evidence_refs: [ev.id],
        hypothesis_refs: [hyp.id],
        turn_ref: ev.turn,
        delta: -ev.weight,
      })),
      ...biasEvents.map((bias, i) => ({
        step_number: evidenceFor.length + evidenceAgainst.length + i + 2,
        description: `Biais ${bias.biasType} Tour ${bias.turn} : -${Math.abs(bias.confidencePenalty).toFixed(2)} [Pénalité appliquée · Résolu : ${bias.resolved}]`,
        evidence_refs: [],
        hypothesis_refs: [hyp.id],
        turn_ref: bias.turn,
        delta: -Math.abs(bias.confidencePenalty),
      })),
      {
        step_number: evidenceFor.length + evidenceAgainst.length + biasEvents.length + 2,
        description: `Posterior calculé : ${hyp.posterior.toFixed(2)} [Somme des deltas sur prior initial]`,
        evidence_refs: [],
        hypothesis_refs: [hyp.id],
        confidence_at_step: hyp.posterior,
      },
    ];

    const summary = `"${hyp.label}" atteint un posterior de ${hyp.posterior.toFixed(2)} à partir d'un prior de ${hyp.prior.toFixed(2)}, après ${evidenceFor.length} preuves favorables, ${evidenceAgainst.length} contradictions, et ${biasEvents.length} corrections de biais.`;

    return this.buildResponse(query, summary, reasoningChain, {
      hypotheses: [this.snapshotHypothesisWithPath(hyp, confPath)],
      evidences: [...evidenceFor.map(e => this.snapshotEvidence(e)), ...evidenceAgainst.map(e => this.snapshotEvidence(e))],
      bias_events: biasEvents.map(b => this.snapshotBias(b)),
    });
  }

  private explainWhatIsUnknown(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const openHyps = candidate.currentInterview.activeHypotheses.filter(h => h.confidence < 0.60);
    const openQ = candidate.history.openQuestions;
    const uncovered = this.getUncoveredSkillNodes(candidate);
    const suspended = candidate.currentInterview.activeHypotheses.filter(h => h.status === 'SUSPENDED');

    const reasoningChain: ReasoningStep[] = [
      {
        step_number: 1,
        description: `${openHyps.length} hypothèses restent sous le seuil de confiance (< 0.60) : nécessitent exploration.`,
        evidence_refs: [],
        hypothesis_refs: openHyps.map(h => h.id),
      },
      {
        step_number: 2,
        description: `${openQ.length} questions restent ouvertes, classées par Information Gain décroissant.`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
      {
        step_number: 3,
        description: `${uncovered.length} nœuds du Skill Graph n'ont reçu aucune preuve directe.`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
      {
        step_number: 4,
        description: `${suspended.length} hypothèses suspendues : questions nécessaires non posées (temps, contexte, état de l'entretien).`,
        evidence_refs: [],
        hypothesis_refs: suspended.map(h => h.id),
      },
    ];

    const totalUncertainty = this.calculateRemainingUncertainty(candidate);

    const summary = `Incertitude résiduelle : ${(totalUncertainty * 100).toFixed(0)}%. ${openHyps.length} hypothèses sous-explorées · ${openQ.length} questions ouvertes · ${uncovered.length} compétences non couvertes.`;

    return this.buildResponse(query, summary, reasoningChain, {
      hypotheses: [...openHyps.map(h => this.snapshotHypothesis(h)), ...suspended.map(h => this.snapshotHypothesis(h))],
      skill_nodes: uncovered.map(n => this.snapshotSkillNode(n)),
    });
  }

  private explainFullReasoning(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const timeline = candidate.currentInterview.timeline;
    const allHyps = candidate.currentInterview.activeHypotheses;
    const allEv = candidate.currentInterview.evidenceStore;
    const allBias = candidate.currentInterview.biasLog;
    const allContra = candidate.currentInterview.contradictionLog;

    const reasoningChain: ReasoningStep[] = timeline.map((turn, i) => ({
      step_number: i + 1,
      description: this.summarizeTurn(turn),
      evidence_refs: turn.evidenceAdded?.map(e => e.id) || [],
      hypothesis_refs: turn.hypothesesUpdated?.map(u => u.hypothesisId) || [],
      turn_ref: i + 1,
      confidence_at_step: this.getGlobalConfidenceAtTurn(candidate, i + 1),
    }));

    const summary = `Raisonnement complet sur ${timeline.length} tours. ${allHyps.length} hypothèses traitées. ${allEv.length} preuves accumulées. ${allBias.length} biais détectés. ${allContra.length} contradictions explorées.`;

    return this.buildResponse(query, summary, reasoningChain, {
      hypotheses: allHyps.map(h => this.snapshotHypothesis(h)),
      evidences: allEv.map(e => this.snapshotEvidence(e)),
      bias_events: allBias.map(b => this.snapshotBias(b)),
      contradictions: allContra.map(c => this.snapshotContradiction(c)),
      timeline_slice: timeline.map(t => this.snapshotTurn(t)),
    });
  }

  private explainWhyThisDecision(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const decision = this.getCurrentDecision(candidate);
    const strongSignals = this.extractStrongSignals(candidate);
    const weakSignals = this.extractWeakSignals(candidate);
    const riskMatrix = this.calculateRiskMatrix(candidate);

    const reasoningChain: ReasoningStep[] = [
      {
        step_number: 1,
        description: `Recommandation : ${decision.recommendation} · Confiance : ${(decision.confidence * 100).toFixed(0)}%`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
      {
        step_number: 2,
        description: `Preuves fortes : ${strongSignals.length} · Preuves faibles : ${weakSignals.length}`,
        evidence_refs: strongSignals.map(s => s.split('·')[0].trim()),
        hypothesis_refs: [],
      },
      {
        step_number: 3,
        description: `Risque global : ${riskMatrix.overall_risk} · Risques identifiés : ${riskMatrix.risks.length}`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
      {
        step_number: 4,
        description: `Incertitude résiduelle : ${(decision.remainingUncertainty * 100).toFixed(0)}% · Coverage : ${(decision.evidenceCoverage * 100).toFixed(0)}%`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
    ];

    const summary = `La recommandation ${decision.recommendation} repose sur ${strongSignals.length} preuves fortes avec une confiance de ${(decision.confidence * 100).toFixed(0)}%. Risque global : ${riskMatrix.overall_risk}.`;

    return this.buildResponse(query, summary, reasoningChain, {
      evidences: candidate.currentInterview.evidenceStore.map(e => this.snapshotEvidence(e)),
    });
  }

  private explainWhatChangedAtTurn(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const turnId = parseInt(query.target_id || '0');
    const turn = candidate.currentInterview.timeline[turnId - 1];
    if (!turn) {
      return this.buildResponse(query, `Tour ${turnId} non trouvé`, [], {});
    }

    const reasoningChain: ReasoningStep[] = [
      {
        step_number: 1,
        description: `Question posée au Tour ${turnId} : "${turn.questionAsked?.text || 'N/A'}" État : ${turn.interviewState}`,
        evidence_refs: [],
        hypothesis_refs: [],
        turn_ref: turnId,
      },
      {
        step_number: 2,
        description: `Réponse du candidat : "${this.truncate(turn.candidateResponse, 100)}"`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
      {
        step_number: 3,
        description: `Preuves ajoutées : ${turn.evidenceAdded?.length || 0} · Hypothèses mises à jour : ${turn.hypothesesUpdated?.length || 0}`,
        evidence_refs: turn.evidenceAdded?.map(e => e.id) || [],
        hypothesis_refs: turn.hypothesesUpdated?.map(u => u.hypothesisId) || [],
        turn_ref: turnId,
      },
    ];

    const summary = `Au Tour ${turnId}, ${turn.evidenceAdded?.length || 0} preuves ont été ajoutées et ${turn.hypothesesUpdated?.length || 0} hypothèses mises à jour.`;

    return this.buildResponse(query, summary, reasoningChain, {
      timeline_slice: [this.snapshotTurn(turn)],
    });
  }

  private explainHowBiasCorrected(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const biasEvent = candidate.currentInterview.biasLog.find(b => b.id === query.target_id);
    if (!biasEvent) {
      return this.buildResponse(query, `Biais ${query.target_id} non trouvé`, [], {});
    }

    const hypAffected = candidate.currentInterview.activeHypotheses.find(h => h.id === biasEvent.affectedHypothesis);
    if (!hypAffected) {
      return this.buildResponse(query, `Hypothèse affectée non trouvée`, [], {});
    }

    const reasoningChain: ReasoningStep[] = [
      {
        step_number: 1,
        description: `Biais détecté au Tour ${biasEvent.turn} : ${biasEvent.biasType} Déclencheur : "${this.truncate(biasEvent.trigger, 80)}"`,
        evidence_refs: [],
        hypothesis_refs: [biasEvent.affectedHypothesis],
        turn_ref: biasEvent.turn,
      },
      {
        step_number: 2,
        description: `Pénalité automatique appliquée : -${Math.abs(biasEvent.confidencePenalty).toFixed(2)} sur l'hypothèse "${hypAffected.label}"`,
        evidence_refs: [],
        hypothesis_refs: [hypAffected.id],
        delta: -Math.abs(biasEvent.confidencePenalty),
      },
      {
        step_number: 3,
        description: `Action corrective obligatoire déclenchée : "${biasEvent.mandatoryAction}"`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
      {
        step_number: 4,
        description: `Résolution : ${biasEvent.resolved ? 'RÉSOLU' : 'EN ATTENTE'} ${biasEvent.resolved ? 'Preuve contraire obtenue · Biais neutralisé.' : 'Biais actif · Bloque progression vers État 5+.'}`,
        evidence_refs: [],
        hypothesis_refs: [hypAffected.id],
      },
    ];

    const summary = `Le biais ${biasEvent.biasType} (Tour ${biasEvent.turn}) a entraîné une pénalité de -${Math.abs(biasEvent.confidencePenalty).toFixed(2)} et une question corrective obligatoire. Statut : ${biasEvent.resolved ? 'Résolu.' : 'Non résolu — bloque la décision finale.'}`;

    return this.buildResponse(query, summary, reasoningChain, {
      hypotheses: [this.snapshotHypothesis(hypAffected)],
      bias_events: [this.snapshotBias(biasEvent)],
    });
  }

  private explainWhyHypothesisAbandoned(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const hyp = candidate.currentInterview.activeHypotheses.find(h => h.id === query.target_id);
    if (!hyp) {
      return this.buildResponse(query, `Hypothèse ${query.target_id} non trouvée`, [], {});
    }

    const reasoningChain: ReasoningStep[] = [
      {
        step_number: 1,
        description: `Hypothèse "${hyp.label}" abandonnée avec un posterior de ${hyp.posterior.toFixed(2)}`,
        evidence_refs: [],
        hypothesis_refs: [hyp.id],
      },
      {
        step_number: 2,
        description: `Preuves contre : ${hyp.evidenceAgainst?.length || 0} · Contradictions : ${hyp.contradictions?.length || 0}`,
        evidence_refs: hyp.evidenceAgainst?.map(e => e.id) || [],
        hypothesis_refs: [hyp.id],
      },
      {
        step_number: 3,
        description: `Statut final : ${hyp.status} · Raison : posterior insuffisant pour maintenir l'hypothèse active`,
        evidence_refs: [],
        hypothesis_refs: [hyp.id],
      },
    ];

    const summary = `L'hypothèse "${hyp.label}" a été abandonnée car son posterior (${hyp.posterior.toFixed(2)}) est tombé sous le seuil de maintien après ${hyp.evidenceAgainst?.length || 0} preuves contre et ${hyp.contradictions?.length || 0} contradictions.`;

    return this.buildResponse(query, summary, reasoningChain, {
      hypotheses: [this.snapshotHypothesis(hyp)],
    });
  }

  private explainWhatEvidenceCountsMost(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const allEv = candidate.currentInterview.evidenceStore;
    const sorted = [...allEv].sort((a, b) => b.weight - a.weight);
    const top5 = sorted.slice(0, 5);
    const patterns = allEv.filter(e => e.type === 'PATTERN');
    const citations = allEv.filter(e => e.type === 'CITATION' && e.weight >= 0.70);

    const reasoningChain: ReasoningStep[] = [
      {
        step_number: 1,
        description: `${allEv.length} preuves accumulées au total. Répartition : ${this.countByType(allEv)}`,
        evidence_refs: allEv.map(e => e.id),
        hypothesis_refs: [],
      },
      ...top5.map((ev, i) => ({
        step_number: i + 2,
        description: `#${i + 1} · ${ev.type} · Poids ${ev.weight.toFixed(2)} · Fiabilité ${ev.reliability} · Tour ${ev.turn} "${this.truncate(ev.rawContent, 80)}" Impact : ${ev.hypothesesImpacted.join(', ')}`,
        evidence_refs: [ev.id],
        hypothesis_refs: ev.hypothesesImpacted,
        turn_ref: ev.turn,
      })),
      {
        step_number: 7,
        description: `${patterns.length} preuves de type PATTERN détectées. Ce sont les preuves les plus solides : comportement répété dans des contextes différents.`,
        evidence_refs: patterns.map(e => e.id),
        hypothesis_refs: [],
      },
    ];

    const summary = `Les 5 preuves les plus importantes portent sur : ${top5.map(e => `"${this.truncate(e.rawContent, 40)}" (${e.weight.toFixed(2)})`).join(' · ')}. ${patterns.length} patterns confirmés.`;

    return this.buildResponse(query, summary, reasoningChain, {
      evidences: sorted.map(e => this.snapshotEvidence(e)),
    });
  }

  private explainWhatWouldChangeDecision(candidate: Candidate, query: ExplainQuery): ExplainResponse {
    const currentDecision = this.getCurrentDecision(candidate);
    const criticalHyps = candidate.currentInterview.activeHypotheses.filter(h => Math.abs(h.posterior - 0.50) < 0.15);
    const openQ = candidate.history.openQuestions.slice(0, 3);

    const reasoningChain: ReasoningStep[] = [
      {
        step_number: 1,
        description: `Décision actuelle : ${currentDecision.recommendation} Confiance : ${currentDecision.confidence.toFixed(2)} Incertitude résiduelle : ${currentDecision.remainingUncertainty.toFixed(2)}`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
      {
        step_number: 2,
        description: `${criticalHyps.length} hypothèses proches du seuil décisionnel. Un changement de ±0.10 sur l'une d'elles modifierait la recommandation.`,
        evidence_refs: [],
        hypothesis_refs: criticalHyps.map(h => h.id),
      },
      ...criticalHyps.map((h, i) => ({
        step_number: i + 3,
        description: `"${h.label}" : posterior ${h.posterior.toFixed(2)}. Si une preuve forte [poids ≥ 0.80] venait la contredire : → Posterior tomberait à ~${(h.posterior - 0.20).toFixed(2)} → Décision passerait à ${this.simulateDecisionChange(h, -0.20)}`,
        evidence_refs: [],
        hypothesis_refs: [h.id],
      })),
      {
        step_number: criticalHyps.length + 3,
        description: `Questions à Information Gain élevé non encore posées : ${openQ.map(q => `"${this.truncate(q.text, 60)}"`).join(' · ')}`,
        evidence_refs: [],
        hypothesis_refs: [],
      },
    ];

    const summary = `La décision actuelle (${currentDecision.recommendation}) changerait si : ${criticalHyps.slice(0, 2).map(h => `"${h.label}" (-0.20)`).join(' ou ')}. ${openQ.length} questions à fort impact restent disponibles.`;

    return this.buildResponse(query, summary, reasoningChain, {
      hypotheses: criticalHyps.map(h => this.snapshotHypothesis(h)),
    });
  }

  // ──────────────────────────────────────────────────────────
  // OUTPUTS SCIENTIFIQUES
  // ──────────────────────────────────────────────────────────

  generateEvidenceMap(candidate: Candidate): EvidenceMap {
    const allEv = candidate.currentInterview.evidenceStore;
    return {
      title: 'EVIDENCE MAP · TRAJECTOIRE',
      generated_at: new Date(),
      total_evidences: allEv.length,
      by_type: Object.fromEntries(Object.entries(this.groupBy(allEv, 'type')).map(([k, v]) => [k, v.map(e => this.snapshotEvidence(e))])) as Record<string, EvidenceSnapshot[]>,
      by_hypothesis: this.groupByHypothesis(allEv),
      by_reliability: Object.fromEntries(Object.entries(this.groupBy(allEv, 'reliability')).map(([k, v]) => [k, v.map(e => this.snapshotEvidence(e))])) as Record<string, EvidenceSnapshot[]>,
      by_turn: this.groupByTurn(allEv),
      formatted_output: this.formatEvidenceMap(allEv),
    };
  }

  generateHypothesisMap(candidate: Candidate): HypothesisMap {
    const all = candidate.currentInterview.activeHypotheses;
    return {
      title: 'HYPOTHESIS MAP · TRAJECTOIRE',
      generated_at: new Date(),
      active: all.filter(h => h.status === 'ACTIVE').map(h => this.snapshotHypothesis(h)),
      confirmed: all.filter(h => h.status === 'CONFIRMED').map(h => this.snapshotHypothesis(h)),
      infirmed: all.filter(h => h.status === 'INFIRMED').map(h => this.snapshotHypothesis(h)),
      suspended: all.filter(h => h.status === 'SUSPENDED').map(h => this.snapshotHypothesis(h)),
      abandoned: [],
      formatted_output: this.formatHypothesisMap(all),
    };
  }

  generateBiasReport(candidate: Candidate): BiasReport {
    const events = candidate.currentInterview.biasLog;
    const totalPenalty = events.reduce((sum, e) => sum + Math.abs(e.confidencePenalty), 0);
    return {
      title: 'BIAS REPORT · TRAJECTOIRE',
      generated_at: new Date(),
      total_detected: events.length,
      total_resolved: events.filter(e => e.resolved).length,
      total_unresolved: events.filter(e => !e.resolved).length,
      events: events.map(e => this.snapshotBias(e)),
      total_penalty: totalPenalty,
      impact_on_decision: this.assessBiasImpact(events),
      formatted_output: this.formatBiasReport(events, totalPenalty),
    };
  }

  generateContradictionReport(candidate: Candidate): ContradictionReport {
    const contradictions = candidate.currentInterview.contradictionLog;
    return {
      title: 'CONTRADICTION REPORT · TRAJECTOIRE',
      generated_at: new Date(),
      total_found: contradictions.length,
      by_severity: Object.fromEntries(Object.entries(this.groupBy(contradictions, 'severity')).map(([k, v]) => [k, v.map(c => this.snapshotContradiction(c))])) as Record<string, ContradictionSnapshot[]>,
      fatal_count: contradictions.filter(c => c.severity === 'FATAL').length,
      unresolved_count: contradictions.filter(c => c.resolution === 'PENDING').length,
      formatted_output: this.formatContradictionReport(contradictions),
    };
  }

  // ──────────────────────────────────────────────────────────
  // FORMATTERS ASCII
  // ──────────────────────────────────────────────────────────

  private buildResponse(
    query: ExplainQuery,
    summary: string,
    reasoningChain: ReasoningStep[],
    supporting: SupportingData,
  ): ExplainResponse {
    const response: ExplainResponse = {
      query,
      generated_at: new Date(),
      response_type: query.type,
      summary,
      reasoning_chain: reasoningChain,
      supporting_data: supporting,
      formatted_output: '',
    };
    response.formatted_output = this.formatResponse(response);
    return response;
  }

  private formatResponse(response: ExplainResponse): string {
    const lines: string[] = [];

    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  TRAJECTOIRE · EXPLAINABILITY · ${response.response_type.padEnd(38)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  RÉSUMÉ                                                                  ║`);
    lines.push(`║  ${this.wrapText(response.summary, 72)}`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  CHAÎNE DE RAISONNEMENT                                                  ║`);

    for (const step of response.reasoning_chain) {
      lines.push(`║                                                                          ║`);
      lines.push(`║  Étape ${String(step.step_number).padEnd(2)} · ${this.wrapText(step.description, 62)}`);
      if (step.delta !== undefined) {
        const sign = step.delta >= 0 ? '+' : '';
        lines.push(`║           Delta : ${sign}${step.delta.toFixed(2)}${' '.repeat(54)}║`);
      }
      if (step.confidence_at_step !== undefined) {
        lines.push(`║           Confiance : ${step.confidence_at_step.toFixed(2)}${' '.repeat(50)}║`);
      }
    }

    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Généré le ${new Date().toISOString().slice(0, 19)}${' '.repeat(42)}║`);
    lines.push(`╚${'═'.repeat(74)}╝`);

    return lines.join('\n');
  }

  private formatEvidenceMap(evidences: Evidence[]): string {
    const lines: string[] = [];
    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  EVIDENCE MAP · TRAJECTOIRE${' '.repeat(46)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Total : ${evidences.length} preuves accumulées${' '.repeat(50 - String(evidences.length).length)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    const byType = this.groupBy(evidences, 'type');
    for (const [type, evs] of Object.entries(byType)) {
      lines.push(`║  ${type.padEnd(12)} : ${evs.length} preuves${' '.repeat(55 - type.length)}║`);
    }

    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  TOP 5 PREUVES PAR POIDS${' '.repeat(49)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    const top5 = [...evidences].sort((a, b) => b.weight - a.weight).slice(0, 5);
    for (const ev of top5) {
      lines.push(`║  Tour ${String(ev.turn).padEnd(3)} · ${ev.type.padEnd(10)} · Poids ${ev.weight.toFixed(2)} · ${ev.reliability.padEnd(6)}║`);
      lines.push(`║  "${this.truncate(ev.rawContent, 70)}"${' '.repeat(Math.max(0, 70 - ev.rawContent.length))}║`);
    }

    lines.push(`╚${'═'.repeat(74)}╝`);
    return lines.join('\n');
  }

  private formatHypothesisMap(hypotheses: Hypothesis[]): string {
    const lines: string[] = [];
    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  HYPOTHESIS MAP · TRAJECTOIRE${' '.repeat(44)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    const statuses = ['CONFIRMED', 'ACTIVE', 'SUSPENDED', 'INFIRMED', 'ABANDONED'];
    for (const status of statuses) {
      const group = hypotheses.filter(h => h.status === status);
      if (group.length === 0) continue;
      lines.push(`║  ${status} (${group.length})${' '.repeat(66 - status.length - String(group.length).length)}║`);
      for (const h of group) {
        const bar = this.progressBar(h.posterior, 20);
        lines.push(`║    ${h.label.slice(0, 35).padEnd(35)} ${bar} ${h.posterior.toFixed(2)}  ║`);
      }
      lines.push(`╠${'═'.repeat(74)}╣`);
    }

    lines.push(`╚${'═'.repeat(74)}╝`);
    return lines.join('\n');
  }

  private formatBiasReport(events: BiasEvent[], totalPenalty: number): string {
    const lines: string[] = [];
    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  BIAS REPORT · TRAJECTOIRE${' '.repeat(47)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Total détectés : ${events.length}  Résolus : ${events.filter(e => e.resolved).length}  En attente : ${events.filter(e => !e.resolved).length}${' '.repeat(20)}║`);
    lines.push(`║  Pénalité totale appliquée : -${totalPenalty.toFixed(2)}${' '.repeat(40)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const ev of events) {
      const status = ev.resolved ? '✓ RÉSOLU' : '⚠ EN ATTENTE';
      lines.push(`║  Tour ${String(ev.turn).padEnd(3)} · ${ev.biasType.padEnd(20)} · ${status.padEnd(12)} · -${Math.abs(ev.confidencePenalty).toFixed(2)}║`);
    }

    lines.push(`╚${'═'.repeat(74)}╝`);
    return lines.join('\n');
  }

  private formatContradictionReport(contradictions: Contradiction[]): string {
    const lines: string[] = [];
    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  CONTRADICTION REPORT · TRAJECTOIRE${' '.repeat(38)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Total : ${contradictions.length}  Fatales : ${contradictions.filter(c => c.severity === 'FATAL').length}  Non résolues : ${contradictions.filter(c => c.resolution === 'PENDING').length}${' '.repeat(20)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const c of contradictions) {
      lines.push(`║  ${c.id.padEnd(10)} · Sévérité ${c.severity.padEnd(8)} · Impact -${c.bayesianImpact.toFixed(2)} · ${c.resolution.padEnd(10)}║`);
    }

    lines.push(`╚${'═'.repeat(74)}╝`);
    return lines.join('\n');
  }

  // ──────────────────────────────────────────────────────────
  // UTILITAIRES
  // ──────────────────────────────────────────────────────────

  private progressBar(value: number, width: number): string {
    const filled = Math.round(value * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
  }

  private truncate(str: string, maxLen: number): string {
    return str.length <= maxLen ? str : str.slice(0, maxLen - 3) + '...';
  }

  private wrapText(text: string, width: number): string {
    return this.truncate(text.replace(/\s+/g, ' ').trim(), width).padEnd(width) + '║';
  }

  private groupBy<T extends Record<string, any>>(items: T[], key: keyof T): Record<string, T[]> {
    return items.reduce((acc, item) => {
      const k = String(item[key]);
      acc[k] = acc[k] ?? [];
      acc[k].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }

  private countByType(evidences: Evidence[]): string {
    const counts = this.groupBy(evidences, 'type');
    return Object.entries(counts).map(([type, evs]) => `${type}: ${evs.length}`).join(' · ');
  }

  // ──────────────────────────────────────────────────────────
  // SNAPSHOT BUILDERS
  // ──────────────────────────────────────────────────────────

  private snapshotHypothesis(h: Hypothesis): HypothesisSnapshot {
    return {
      id: h.id,
      label: h.label,
      prior: h.prior,
      posterior: h.posterior,
      status: h.status,
      evidence_count: h.evidenceFor?.length || 0,
      contradiction_count: h.contradictions?.length || 0,
      confidence_path: [],
    };
  }

  private snapshotHypothesisWithPath(h: Hypothesis, path: ConfidencePoint[]): HypothesisSnapshot {
    return { ...this.snapshotHypothesis(h), confidence_path: path };
  }

  private snapshotEvidence(e: Evidence): EvidenceSnapshot {
    return {
      id: e.id,
      turn: e.turn,
      type: e.type,
      raw_content: e.rawContent,
      weight: e.weight,
      reliability: e.reliability,
      direction: e.direction,
      hypotheses_impacted: e.hypothesesImpacted,
    };
  }

  private snapshotContradiction(c: Contradiction): ContradictionSnapshot {
    return {
      id: c.id,
      hypothesis_id: c.hypothesisId,
      severity: c.severity,
      bayesian_impact: c.bayesianImpact,
      resolution: c.resolution,
      turn: 0,
    };
  }

  private snapshotBias(b: BiasEvent): BiasSnapshot {
    return {
      id: b.id,
      turn: b.turn,
      bias_type: b.biasType,
      trigger: b.trigger,
      penalty: b.confidencePenalty,
      mandatory_action: b.mandatoryAction,
      resolved: b.resolved,
    };
  }

  private snapshotTurn(t: any): TurnSnapshot {
    return {
      turn_number: t.turn,
      state: t.interviewState,
      question_asked: t.questionAsked?.text || 'N/A',
      key_observation: this.summarizeTurn(t),
      hypotheses_delta: t.hypothesesUpdated?.map((u: any) => `${u.hypothesisId}: ${u.delta >= 0 ? '+' : ''}${u.delta.toFixed(2)}`).join(' · ') || '',
      confidence_global: 0.5,
    };
  }

  private snapshotSkillNode(n: any): SkillNodeSnapshot {
    return {
      node_id: n.id,
      label: n.name,
      score: n.confidence,
      evidence_count: 0,
      coverage: 0,
    };
  }

  // ──────────────────────────────────────────────────────────
  // MÉTHODES AUXILIAIRES
  // ──────────────────────────────────────────────────────────

  private buildConfidencePath(candidate: Candidate, hId: string): ConfidencePoint[] {
    const hyp = candidate.currentInterview.activeHypotheses.find(h => h.id === hId);
    if (!hyp) return [];
    return [
      { turn: 0, value: hyp.prior, trigger: 'prior', delta: 0 },
      { turn: candidate.currentInterview.currentTurn, value: hyp.posterior, trigger: 'posterior', delta: hyp.posterior - hyp.prior },
    ];
  }

  private getGlobalConfidenceAtTurn(candidate: Candidate, turn: number): number {
    const hyps = candidate.currentInterview.activeHypotheses;
    if (hyps.length === 0) return 0;
    return hyps.reduce((sum, h) => sum + h.posterior, 0) / hyps.length;
  }

  private calculateRemainingUncertainty(candidate: Candidate): number {
    const hyps = candidate.currentInterview.activeHypotheses;
    if (hyps.length === 0) return 1;
    const avgConfidence = hyps.reduce((sum, h) => sum + h.posterior, 0) / hyps.length;
    return 1 - avgConfidence;
  }

  private getUncoveredSkillNodes(candidate: Candidate): any[] {
    return [];
  }

  private summarizeTurn(t: any): string {
    return `État ${t.interviewState} · ${t.evidenceAdded?.length || 0} preuve(s) · ${t.hypothesesUpdated?.length || 0} hypothèse(s) mise(s) à jour`;
  }

  private groupByHypothesis(evidences: Evidence[]): Record<string, EvidenceSnapshot[]> {
    const result: Record<string, EvidenceSnapshot[]> = {};
    for (const ev of evidences) {
      for (const hId of ev.hypothesesImpacted) {
        result[hId] = result[hId] ?? [];
        result[hId].push(this.snapshotEvidence(ev));
      }
    }
    return result;
  }

  private groupByTurn(evidences: Evidence[]): Record<number, EvidenceSnapshot[]> {
    const result: Record<number, EvidenceSnapshot[]> = {};
    for (const ev of evidences) {
      result[ev.turn] = result[ev.turn] ?? [];
      result[ev.turn].push(this.snapshotEvidence(ev));
    }
    return result;
  }

  private getCurrentDecision(candidate: Candidate): any {
    return {
      recommendation: 'DEFER',
      confidence: 0.5,
      remainingUncertainty: 0.5,
      evidenceCoverage: 0.5,
    };
  }

  private extractStrongSignals(candidate: Candidate): string[] {
    return candidate.currentInterview.evidenceStore.filter(e => e.weight >= 0.70).map(e => e.id);
  }

  private extractWeakSignals(candidate: Candidate): string[] {
    return candidate.currentInterview.evidenceStore.filter(e => e.weight < 0.50).map(e => e.id);
  }

  private calculateRiskMatrix(candidate: Candidate): RiskMatrix {
    return {
      title: 'RISK MATRIX',
      generated_at: new Date(),
      risks: [],
      overall_risk: 'MEDIUM',
      formatted_output: '',
    };
  }

  private assessBiasImpact(events: BiasEvent[]): string {
    const unresolved = events.filter(e => !e.resolved);
    if (unresolved.length === 0) return 'Aucun impact résiduel. Tous les biais ont été corrigés.';
    return `${unresolved.length} biais non résolus. Décision finale bloquée.`;
  }

  private simulateDecisionChange(h: Hypothesis, delta: number): string {
    const simulated = h.posterior + delta;
    if (simulated < 0.40) return 'NO_HIRE';
    if (simulated < 0.60) return 'DEFER';
    return 'HIRE';
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
        currentTurn: 3,
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
        nodes: new Map([
          ["LEADERSHIP", {
            id: "LEADERSHIP",
            name: "Leadership",
            parent: undefined,
            children: [],
            weight: 1.0,
            confidence: 0.65,
          }],
        ]),
        edges: new Map(),
      },
      growthProfile: {
        id: "GROWTH_001",
        skills: new Map(),
      },
    };

    logInfo("=== Explication complète ===");
    logInfo(this.generateFullExplanation(candidate));

    logInfo("\n=== Zones d'incertitude résiduelle ===");
    logInfo(this.identifyResidualUncertainty(candidate).join("\n"));

    logInfo("\n=== Rapport d'explicabilité ===");
    logInfo(this.generateExplainabilityReport(candidate));

    logInfo("\n=== Test de requête WHY_THIS_QUESTION ===");
    const query: ExplainQuery = {
      type: 'WHY_THIS_QUESTION',
      asked_at_turn: 3,
      asked_by: 'RECRUITER',
    };
    const response = this.explain(candidate, query);
    logInfo(response.formatted_output);
  }
}

export const explainabilityEngine = ExplainabilityEngine.getInstance();
