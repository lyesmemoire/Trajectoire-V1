/**
 * TRAJECTOIRE · HIIOS v4.0
 * Moteur 5 — Decision Ledger
 * File: layer5-decision/DecisionLedger.ts
 */

import { HypothesisEngine, Hypothesis } from '../layer0-kernel/HypothesisEngine';
import { EvidenceEngine } from '../layer0-kernel/EvidenceEngine';
import { SkillGraph, SkillNode } from '../layer0-kernel/SkillGraph';

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

export type HiringRecommendation =
  | 'HIRE'      // Recruter
  | 'NO_HIRE'   // Ne pas recruter
  | 'DEFER'     // Reporter (plus d'information nécessaire);

export interface DecisionLedgerOutput {
  session_id               : string;
  generated_at             : Date;
  recommendation           : HiringRecommendation;
  confidence               : number;            // 0.0 → 1.0
  probability_of_success   : number;            // Probabilité de succès à 12 mois
  probability_of_error     : number;            // Probabilité d'erreur (faux positif + faux négatif)
  evidence_coverage        : number;            // % du Skill Graph couvert
  remaining_uncertainty    : number;            // 1 - evidence_coverage
  strong_signals           : Signal[];
  weak_signals             : Signal[];
  unexplored_zones         : UnexploredZone[];
  resolved_biases          : ResolvedBias[];
  reasoning_chain          : ReasoningStep[];
  final_reasoning          : string;
}

export interface Signal {
  type        : 'CITATION' | 'PATTERN' | 'BEHAVIOR' | 'ABSENCE';
  weight      : number;
  turn        : number;
  reliability : string;
  description : string;
}

export interface UnexploredZone {
  skill_node_id   : string;
  skill_label     : string;
  impact_estimated: 'HIGH' | 'MEDIUM' | 'LOW';
  reason          : string;
}

export interface ResolvedBias {
  bias_type        : string;
  turn             : number;
  penalty          : number;
  corrective_action: string;
}

export interface ReasoningStep {
  step_number : number;
  description : string;
  evidence    : string[];
  conclusion  : string;
}

// ──────────────────────────────────────────────────────────
// DECISION LEDGER ENGINE
// ──────────────────────────────────────────────────────────

export class DecisionLedger {

  private hypothesisEngine: HypothesisEngine;
  private evidenceEngine  : EvidenceEngine;
  private skillGraph      : SkillGraph;

  constructor(
    hypothesisEngine: HypothesisEngine,
    evidenceEngine  : EvidenceEngine,
    skillGraph      : SkillGraph,
  ) {
    this.hypothesisEngine = hypothesisEngine;
    this.evidenceEngine   = evidenceEngine;
    this.skillGraph       = skillGraph;
  }

  // ────────────────────────────────────────────────────────
  // GÉNÉRER LE LEDGER DE DÉCISION
  // ────────────────────────────────────────────────────────

  generate(sessionId: string): DecisionLedgerOutput {

    const recommendation     = this.calculateRecommendation();
    const confidence           = this.calculateConfidence();
    const probabilityOfSuccess = this.calculateProbabilityOfSuccess();
    const probabilityOfError   = this.calculateProbabilityOfError();
    const evidenceCoverage    = this.skillGraph.getCoveragePercent();
    const remainingUncertainty = 1 - evidenceCoverage;

    const strongSignals   = this.extractStrongSignals();
    const weakSignals     = this.extractWeakSignals();
    const unexploredZones = this.identifyUnexploredZones();
    const resolvedBiases  = this.extractResolvedBiases();
    const reasoningChain  = this.buildReasoningChain(recommendation, strongSignals, unexploredZones);
    const finalReasoning  = this.generateFinalReasoning(recommendation, reasoningChain, unexploredZones);

    return {
      session_id           : sessionId,
      generated_at         : new Date(),
      recommendation,
      confidence,
      probability_of_success: probabilityOfSuccess,
      probability_of_error  : probabilityOfError,
      evidence_coverage     : evidenceCoverage,
      remaining_uncertainty : remainingUncertainty,
      strong_signals        : strongSignals,
      weak_signals          : weakSignals,
      unexplored_zones      : unexploredZones,
      resolved_biases       : resolvedBiases,
      reasoning_chain       : reasoningChain,
      final_reasoning       : finalReasoning,
    };
  }

  // ────────────────────────────────────────────────────────
  // CALCUL DE LA RECOMMANDATION
  // ────────────────────────────────────────────────────────

  private calculateRecommendation(): HiringRecommendation {

    const confirmed = this.hypothesisEngine.getByStatus('CONFIRMED');
    const infirmed  = this.hypothesisEngine.getByStatus('INFIRMED');
    const active    = this.hypothesisEngine.getActive();

    const confirmedScore = confirmed.reduce((s, h) => s + h.posterior, 0);
    const infirmedScore  = infirmed.reduce((s, h) => s + h.posterior, 0);
    const activeScore     = active.reduce((s, h) => s + h.posterior, 0);

    const netScore = confirmedScore - infirmedScore + (activeScore * 0.5);

    if (netScore >= 0.75) return 'HIRE';
    if (netScore >= 0.40) return 'DEFER';
    return 'NO_HIRE';
  }

  // ────────────────────────────────────────────────────────
  // CALCUL DE LA CONFIANCE
  // ────────────────────────────────────────────────────────

  private calculateConfidence(): number {

    const confirmed = this.hypothesisEngine.getByStatus('CONFIRMED');
    const infirmed  = this.hypothesisEngine.getByStatus('INFIRMED');
    const totalHyp  = this.hypothesisEngine.getAll().length;

    if (totalHyp === 0) return 0;

    const ratioConfirmed = confirmed.length / totalHyp;
    const ratioInfirmed   = infirmed.length / totalHyp;
    const evidenceCount   = this.evidenceEngine.getAll().length;

    // Plus d'hypothèses confirmées = plus de confiance
    let confidence = ratioConfirmed * 0.6;
    confidence += (1 - ratioInfirmed) * 0.2;
    confidence += Math.min(0.2, evidenceCount * 0.02);

    return Math.min(1, Math.max(0, confidence));
  }

  // ────────────────────────────────────────────────────────
  // CALCUL DE LA PROBABILITÉ DE SUCCÈS
  // ────────────────────────────────────────────────────────

  private calculateProbabilityOfSuccess(): number {

    const domains = this.skillGraph.getDomains();
    const avgDomainScore = domains.reduce((s, d) => s + d.score, 0) / domains.length;
    const confidence = this.calculateConfidence();

    // Probabilité de succès = moyenne des domaines * 0.7 + confiance * 0.3
    return (avgDomainScore * 0.7) + (confidence * 0.3);
  }

  // ────────────────────────────────────────────────────────
  // CALCUL DE LA PROBABILITÉ D'ERREUR
  // ────────────────────────────────────────────────────────

  private calculateProbabilityOfError(): number {

    const confidence        = this.calculateConfidence();
    const evidenceCoverage = this.skillGraph.getCoveragePercent();

    // Erreur = (1 - confiance) * 0.5 + (1 - couverture) * 0.5
    return ((1 - confidence) * 0.5) + ((1 - evidenceCoverage) * 0.5);
  }

  // ────────────────────────────────────────────────────────
  // EXTRAIRE LES SIGNAUX FORTS
  // ────────────────────────────────────────────────────────

  private extractStrongSignals(): Signal[] {

    const signals: Signal[] = [];
    const topEvidences = this.evidenceEngine.getTopByWeight(10);

    for (const ev of topEvidences) {
      if (ev.weight >= 0.70) {
        signals.push({
          type        : ev.type,
          weight      : ev.weight,
          turn        : ev.turn,
          reliability : ev.reliability,
          description : ev.rawContent.slice(0, 100),
        });
      }
    }

    // Ajouter les patterns confirmés
    const patterns = this.evidenceEngine.getPatterns();
    for (const pat of patterns) {
      if (pat.weight >= 0.70) {
        signals.push({
          type        : 'PATTERN',
          weight      : pat.weight,
          turn        : pat.turn,
          reliability : pat.reliability,
          description : pat.rawContent.slice(0, 100),
        });
      }
    }

    return signals;
  }

  // ────────────────────────────────────────────────────────
  // EXTRAIRE LES SIGNAUX FAIBLES
  // ────────────────────────────────────────────────────────

  private extractWeakSignals(): Signal[] {

    const signals: Signal[] = [];
    const allEvidences = this.evidenceEngine.getAll();

    for (const ev of allEvidences) {
      if (ev.weight < 0.50) {
        signals.push({
          type        : ev.type,
          weight      : ev.weight,
          turn        : ev.turn,
          reliability : ev.reliability,
          description : ev.rawContent.slice(0, 100),
        });
      }
    }

    return signals;
  }

  // ────────────────────────────────────────────────────────
  // IDENTIFIER LES ZONES NON EXPLORÉES
  // ────────────────────────────────────────────────────────

  private identifyUnexploredZones(): UnexploredZone[] {

    const zones: UnexploredZone[] = [];
    const uncovered = this.skillGraph.getUncovered();

    for (const node of uncovered) {
      const impact = node.weight >= 0.80 ? 'HIGH' : node.weight >= 0.70 ? 'MEDIUM' : 'LOW';
      zones.push({
        skill_node_id   : node.id,
        skill_label     : node.label,
        impact_estimated: impact,
        reason          : 'Aucune preuve collectée',
      });
    }

    return zones;
  }

  // ────────────────────────────────────────────────────────
  // EXTRAIRE LES BIAIS RÉSOLUS
  // ────────────────────────────────────────────────────────

  private extractResolvedBiases(): ResolvedBias[] {

    // Pour l'instant, retourner un tableau vide
    // L'implémentation complète nécessiterait un BiasEngine
    return [];
  }

  // ────────────────────────────────────────────────────────
  // CONSTRUIRE LA CHAÎNE DE RAISONNEMENT
  // ────────────────────────────────────────────────────────

  private buildReasoningChain(
    recommendation: HiringRecommendation,
    strongSignals : Signal[],
    unexploredZones: UnexploredZone[],
  ): ReasoningStep[] {

    const chain: ReasoningStep[] = [];
    let stepNumber = 1;

    // Étape 1 : Analyse des signaux forts
    chain.push({
      step_number : stepNumber++,
      description : 'Analyse des signaux forts',
      evidence    : strongSignals.slice(0, 3).map(s => s.description),
      conclusion  : `${strongSignals.length} signaux forts identifiés avec un poids moyen de ${this.averageWeight(strongSignals).toFixed(2)}`,
    });

    // Étape 2 : Analyse des hypothèses
    const confirmed = this.hypothesisEngine.getByStatus('CONFIRMED');
    chain.push({
      step_number : stepNumber++,
      description : 'Analyse des hypothèses confirmées',
      evidence    : confirmed.map(h => h.label),
      conclusion  : `${confirmed.length} hypothèses confirmées sur ${this.hypothesisEngine.getAll().length}`,
    });

    // Étape 3 : Analyse de la couverture
    const coverage = this.skillGraph.getCoveragePercent();
    chain.push({
      step_number : stepNumber++,
      description : 'Analyse de la couverture du Skill Graph',
      evidence    : [`Couverture : ${(coverage * 100).toFixed(0)}%`],
      conclusion  : coverage >= 0.70 ? 'Couverture satisfaisante' : 'Couverture insuffisante',
    });

    // Étape 4 : Analyse des zones non explorées
    if (unexploredZones.length > 0) {
      chain.push({
        step_number : stepNumber++,
        description : 'Identification des zones non explorées',
        evidence    : unexploredZones.map(z => z.skill_label),
        conclusion  : `${unexploredZones.length} compétences non explorées identifiées`,
      });
    }

    // Étape 5 : Synthèse
    chain.push({
      step_number : stepNumber++,
      description : 'Synthèse et recommandation',
      evidence    : [`Confiance : ${(this.calculateConfidence() * 100).toFixed(0)}%`],
      conclusion  : `Recommandation : ${recommendation}`,
    });

    return chain;
  }

  // ────────────────────────────────────────────────────────
  // GÉNÉRER LE RAISONNEMENT FINAL
  // ────────────────────────────────────────────────────────

  private generateFinalReasoning(
    recommendation: HiringRecommendation,
    reasoningChain: ReasoningStep[],
    unexploredZones: UnexploredZone[],
  ): string {

    const strongSignals = this.extractStrongSignals();
    const confirmed    = this.hypothesisEngine.getByStatus('CONFIRMED');
    const coverage     = this.skillGraph.getCoveragePercent();

    let reasoning = `La recommandation ${recommendation} repose sur ${strongSignals.length} preuves fortes convergentes sur `;

    if (confirmed.length > 0) {
      reasoning += confirmed.map(h => h.label).join(' et ');
    } else {
      reasoning += 'les compétences principales';
    }

    reasoning += `. L'incertitude résiduelle de ${((1 - coverage) * 100).toFixed(0)}% porte sur `;

    if (unexploredZones.length > 0) {
      reasoning += unexploredZones.map(z => z.skill_label).join(', ');
      reasoning += unexploredZones.length > 1 ? ' non explorés' : ' non exploré';
    } else {
      reasoning += 'aucune zone spécifique';
    }

    if (recommendation === 'HIRE') {
      reasoning += '. Ce risque est acceptable pour ce poste.';
    } else if (recommendation === 'DEFER') {
      reasoning += '. Un complément d\'information est recommandé.';
    } else {
      reasoning += '. Ce profil ne correspond pas aux exigences du poste.';
    }

    return reasoning;
  }

  private averageWeight(signals: Signal[]): number {
    if (signals.length === 0) return 0;
    return signals.reduce((s, sig) => s + sig.weight, 0) / signals.length;
  }

  // ────────────────────────────────────────────────────────
  // RAPPORT FORMATÉ
  // ────────────────────────────────────────────────────────

  formatDecisionLedger(ledger: DecisionLedgerOutput): string {

    const lines: string[] = [];

    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  LEDGER DE DÉCISION · TRAJECTOIRE${' '.repeat(38)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Session : ${ledger.session_id.padEnd(60)}║`);
    lines.push(`║  Généré le : ${ledger.generated_at.toLocaleDateString('fr-FR').padEnd(54)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  RECOMMANDATION : ${ledger.recommendation.padEnd(55)}║`);
    lines.push(`║  CONFIANCE : ${(ledger.confidence * 100).toFixed(0)}%${' '.repeat(58)}║`);
    lines.push(`║  PROBABILITÉ DE SUCCÈS : ${(ledger.probability_of_success * 100).toFixed(0)}%${' '.repeat(48)}║`);
    lines.push(`║  PROBABILITÉ D'ERREUR : ${(ledger.probability_of_error * 100).toFixed(0)}%${' '.repeat(49)}║`);
    lines.push(`║  COUVERTURE DE PREUVES : ${(ledger.evidence_coverage * 100).toFixed(0)}%${' '.repeat(47)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    // Signaux forts
    lines.push(`║  SIGNAUX FORTS (${ledger.strong_signals.length})${' '.repeat(58 - String(ledger.strong_signals.length).length)}║`);
    for (const sig of ledger.strong_signals.slice(0, 5)) {
      lines.push(`║    [${sig.type.padEnd(8)}] Poids ${sig.weight.toFixed(2)} · Tour ${sig.turn} · ${sig.description.slice(0, 42).padEnd(42)}║`);
    }

    lines.push(`╠${'═'.repeat(74)}╣`);

    // Zones non explorées
    lines.push(`║  ZONES NON EXPLORÉES (${ledger.unexplored_zones.length})${' '.repeat(52 - String(ledger.unexplored_zones.length).length)}║`);
    for (const zone of ledger.unexplored_zones.slice(0, 5)) {
      lines.push(`║    [${zone.impact_estimated.padEnd(5)}] ${zone.skill_label.padEnd(30)} · ${zone.reason.padEnd(20)}║`);
    }

    lines.push(`╠${'═'.repeat(74)}╣`);

    // Chaîne de raisonnement
    lines.push(`║  CHAÎNE DE RAISONNEMENT${' '.repeat(54)}║`);
    for (const step of ledger.reasoning_chain) {
      lines.push(`║    ${step.step_number}. ${step.description.padEnd(62)}║`);
      lines.push(`║       → ${step.conclusion.slice(0, 64).padEnd(64)}║`);
    }

    lines.push(`╠${'═'.repeat(74)}╣`);

    // Raisonnement final
    lines.push(`║  RAISONNEMENT FINAL${' '.repeat(58)}║`);
    const finalWords = ledger.final_reasoning.match(/.{1,72}/g) || [];
    for (const word of finalWords) {
      lines.push(`║  ${word.padEnd(72)}║`);
    }

    lines.push(`╚${'═'.repeat(74)}╝`);

    return lines.join('\n');
  }
}
