/**
 * TRAJECTOIRE · HIIOS v4.0
 * Moteur 2 — Hypothesis Engine
 * File: layer0-kernel/HypothesisEngine.ts
 */

import { Evidence, EvidenceDirection } from '../interfaces/IHIIOSKernel';
import { EvidenceEngine } from './EvidenceEngine';

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

export type HypothesisStatus =
  | 'GENERATED'  // Créée. Pas encore testée.
  | 'ACTIVE'     // Au moins une preuve. En exploration.
  | 'CONFIRMED'  // Posterior ≥ 0.75. Minimum 3 preuves. Biais vérifié.
  | 'INFIRMED'   // Posterior ≤ 0.20. Contradiction fatale.
  | 'SUSPENDED'  // Incertitude trop haute. Questions nécessaires manquantes.
  | 'ABANDONED'  // Définitivement écartée.

// ──────────────────────────────────────────────────────────
// STRUCTURE D'UNE HYPOTHÈSE
// ──────────────────────────────────────────────────────────

export interface Hypothesis {
  id                : string;
  label             : string;            // Ex : "Leadership fort sous pression"
  description       : string;            // Description détaillée
  skill_node_id     : string;            // Nœud du Skill Graph concerné
  status            : HypothesisStatus;

  // Probabilités bayésiennes
  prior             : number;            // Probabilité initiale
  posterior         : number;            // Probabilité courante
  likelihood        : number;            // P(E|H) — mise à jour par chaque preuve

  // Preuves
  evidence_for      : string[];          // IDs des preuves qui confirment
  evidence_against  : string[];          // IDs des preuves qui infirment
  evidence_neutral  : string[];          // IDs des preuves neutres

  // Contradictions
  contradictions    : ContradictionRecord[];

  // Questions restantes
  open_questions    : string[];          // Questions encore disponibles pour tester

  // Métadonnées
  created_at_turn   : number;
  last_updated_turn : number;
  confidence_history: ConfidencePoint[]; // Historique tour par tour
}

export interface ContradictionRecord {
  id              : string;
  evidence_id     : string;
  severity        : 'LOW' | 'MEDIUM' | 'HIGH' | 'FATAL';
  bayesian_impact : number;
  resolution      : 'PENDING' | 'EXPLORED' | 'EXPLAINED' | 'UNRESOLVED';
  created_at_turn : number;
}

export interface ConfidencePoint {
  turn   : number;
  value  : number;
  delta  : number;
  trigger: string;   // Ce qui a déclenché ce changement
}

// ──────────────────────────────────────────────────────────
// HYPOTHESIS ENGINE
// ──────────────────────────────────────────────────────────

export class HypothesisEngine {

  private hypotheses     : Map<string, Hypothesis> = new Map();
  private evidenceEngine: EvidenceEngine;

  // Seuils de statut
  private readonly CONFIRMED_THRESHOLD  = 0.75;
  private readonly INFIRMED_THRESHOLD   = 0.20;
  private readonly MIN_EVIDENCE_CONFIRM = 3;

  constructor(evidenceEngine: EvidenceEngine) {
    this.evidenceEngine = evidenceEngine;
  }

  // ────────────────────────────────────────────────────────
  // GÉNÉRER UNE HYPOTHÈSE
  // ────────────────────────────────────────────────────────

  generate(input: {
    label          : string;
    description    : string;
    skill_node_id  : string;
    prior          : number;
    created_at_turn: number;
  }): Hypothesis {

    this.validatePrior(input.prior);

    const hypothesis: Hypothesis = {
      id                : this.generateId(),
      label             : input.label,
      description       : input.description,
      skill_node_id     : input.skill_node_id,
      status            : 'GENERATED',
      prior             : input.prior,
      posterior         : input.prior,
      likelihood        : 0.5,
      evidence_for      : [],
      evidence_against  : [],
      evidence_neutral  : [],
      contradictions    : [],
      open_questions    : [],
      created_at_turn   : input.created_at_turn,
      last_updated_turn : input.created_at_turn,
      confidence_history: [{
        turn   : input.created_at_turn,
        value  : input.prior,
        delta  : 0,
        trigger: 'Hypothèse générée',
      }],
    };

    this.hypotheses.set(hypothesis.id, hypothesis);
    return hypothesis;
  }

  // ────────────────────────────────────────────────────────
  // METTRE À JOUR AVEC UNE PREUVE
  // ────────────────────────────────────────────────────────

  updateWithEvidence(
    hypothesisId: string,
    evidence    : Evidence,
    currentTurn : number,
  ): Hypothesis {

    const hyp = this.getById(hypothesisId);
    const previousPosterior = hyp.posterior;

    // Mise à jour bayésienne
    const newPosterior = this.calculatePosterior(hyp, evidence);
    const delta = newPosterior - previousPosterior;

    // Enregistrement de la preuve
    if (evidence.direction === EvidenceDirection.CONFIRMS) {
      hyp.evidence_for.push(evidence.id);
    } else if (evidence.direction === EvidenceDirection.INFIRMS) {
      hyp.evidence_against.push(evidence.id);
      // Ajout d'une contradiction
      hyp.contradictions.push({
        id             : this.generateId(),
        evidence_id    : evidence.id,
        severity       : this.assessContradictionSeverity(evidence.weight),
        bayesian_impact: Math.abs(delta),
        resolution     : 'PENDING',
        created_at_turn: currentTurn,
      });
    } else {
      hyp.evidence_neutral.push(evidence.id);
    }

    // Mise à jour du posterior
    hyp.posterior         = newPosterior;
    hyp.last_updated_turn = currentTurn;
    hyp.confidence_history.push({
 turn   : currentTurn,
      value  : newPosterior,
      delta,
      trigger: `${evidence.type} ajoutée · ${evidence.direction}`,
    });

    // Mise à jour du statut
    hyp.status = this.calculateStatus(hyp);

    this.hypotheses.set(hypothesisId, hyp);
    return hyp;
  }

  // ────────────────────────────────────────────────────────
  // APPLIQUER UNE PÉNALITÉ DE BIAIS
  // ────────────────────────────────────────────────────────

  applyBiasPenalty(
    hypothesisId: string,
    penalty      : number,
    biasType     : string,
    currentTurn  : number,
  ): Hypothesis {

    const hyp = this.getById(hypothesisId);
    const previousPosterior = hyp.posterior;
    const newPosterior = Math.max(0, hyp.posterior - penalty);
    const delta = newPosterior - previousPosterior;

    hyp.posterior         = newPosterior;
    hyp.last_updated_turn = currentTurn;
    hyp.confidence_history.push({
      turn   : currentTurn,
      value  : newPosterior,
      delta,
      trigger: `Pénalité biais : ${biasType} (-${penalty.toFixed(2)})`,
    });

    hyp.status = this.calculateStatus(hyp);
    this.hypotheses.set(hypothesisId, hyp);
    return hyp;
  }

  // ────────────────────────────────────────────────────────
  // REQUÊTES
  // ────────────────────────────────────────────────────────

  getById(id: string): Hypothesis {
    const h = this.hypotheses.get(id);
    if (!h) throw new Error(`Hypothèse introuvable : ${id}`);
    return h;
  }

  getAll(): Hypothesis[] {
    return Array.from(this.hypotheses.values());
  }

  getByStatus(status: HypothesisStatus): Hypothesis[] {
    return this.getAll().filter(h => h.status === status);
  }

  getActive(): Hypothesis[] {
    return this.getAll().filter(
      h => h.status === 'ACTIVE' || h.status === 'CONFIRMED'
    );
  }

  getIndistinguishable(margin = 0.08): Hypothesis[][] {
    const active = this.getActive();
    const pairs : Hypothesis[][] = [];

    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        if (Math.abs(active[i].posterior - active[j].posterior) <= margin) {
          pairs.push([active[i], active[j]]);
        }
      }
    }

    return pairs;
  }

  getNearThreshold(margin = 0.15): Hypothesis[] {
    return this.getActive().filter(h =>
      Math.abs(h.posterior - 0.50) <= margin
    );
  }

  getBelowPosterior(threshold: number): Hypothesis[] {
    return this.getActive().filter(h => h.posterior < threshold);
  }

  getConfidencePath(id: string): ConfidencePoint[] {
    return this.getById(id).confidence_history;
  }

  // ────────────────────────────────────────────────────────
  // CALCUL BAYÉSIEN
  // ────────────────────────────────────────────────────────

  private calculatePosterior(hyp: Hypothesis, evidence: Evidence): number {

    const prior      = hyp.posterior;
    const likelihood = evidence.direction === EvidenceDirection.CONFIRMS
                       ? 0.5 + evidence.weight * 0.4
                       : 0.5 - evidence.weight * 0.4;

    // Mise à jour bayésienne simplifiée
    // P(H|E) ∝ P(E|H) × P(H)
    const raw = likelihood * prior;
    const normalized = raw / (raw + (1 - likelihood) * (1 - prior));

    // Application du poids de la preuve
    const weighted = prior + (normalized - prior) * evidence.weight;

    return Math.max(0.01, Math.min(0.99, weighted));
  }

  private calculateStatus(hyp: Hypothesis): HypothesisStatus {

    if (hyp.posterior <= this.INFIRMED_THRESHOLD) {
      return hyp.contradictions.some(c => c.severity === 'FATAL')
        ? 'INFIRMED'
        : 'ACTIVE';
    }

    if (
      hyp.posterior >= this.CONFIRMED_THRESHOLD &&
      hyp.evidence_for.length >= this.MIN_EVIDENCE_CONFIRM
    ) {
      return 'CONFIRMED';
    }

    if (hyp.status === 'GENERATED' && hyp.evidence_for.length > 0) {
      return 'ACTIVE';
    }

    return hyp.status;
  }

  private assessContradictionSeverity(
    weight: number
  ): ContradictionRecord['severity'] {
    if (weight >= 0.80) return 'FATAL';
    if (weight >= 0.60) return 'HIGH';
    if (weight >= 0.40) return 'MEDIUM';
    return 'LOW';
  }

  private validatePrior(prior: number): void {
    if (prior < 0.10 || prior > 0.70) {
      throw new Error(
        `Prior invalide : ${prior}. Doit être compris entre 0.10 et 0.70.`
      );
    }
  }

  private generateId(): string {
    return `hyp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  }

  // ────────────────────────────────────────────────────────
  // RAPPORT — CONFIDENCE HISTORY
  // ────────────────────────────────────────────────────────

  formatConfidenceHistory(hypothesisId: string): string {

    const hyp     = this.getById(hypothesisId);
    const lines  : string[] = [];
    const history = hyp.confidence_history;

    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  HISTORIQUE DE CONFIANCE · "${hyp.label}"${' '.repeat(Math.max(0, 74 - hyp.label.length - 30))}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const point of history) {
      const bar   = this.progressBar(point.value, 25);
      const sign  = point.delta >= 0 ? '+' : '';
      const delta = point.delta !== 0 ? ` (${sign}${point.delta.toFixed(2)})` : '';
      lines.push(`║  Tour ${String(point.turn).padEnd(3)} ${bar} ${point.value.toFixed(2)}${delta.padEnd(10)} ║`);
      lines.push(`║          ${point.trigger.slice(0, 62).padEnd(62)}  ║`);
    }

    lines.push(`╠${'═'.repeat(74)}╣`);
    lines.push(`║  Statut final : ${hyp.status.padEnd(12)} · Posterior : ${hyp.posterior.toFixed(2)}${' '.repeat(25)}║`);
    lines.push(`╚${'═'.repeat(74)}╝`);

    return lines.join('\n');
  }

  // ────────────────────────────────────────────────────────
  // RAPPORT — HYPOTHESIS MAP
  // ────────────────────────────────────────────────────────

  formatHypothesisMap(): string {

    const lines   : string[] = [];
    const statuses: HypothesisStatus[] = [
      'CONFIRMED', 'ACTIVE', 'SUSPENDED', 'INFIRMED', 'ABANDONED'
    ];
    const labels: Record<HypothesisStatus, string> = {
      CONFIRMED : 'Confirmées',
      ACTIVE    : 'Actives',
      SUSPENDED : 'Suspendues',
      INFIRMED  : 'Infirmées',
      ABANDONED : 'Abandonnées',
      GENERATED : 'Générées',
    };

    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  CARTE DES HYPOTHÈSES · TRAJECTOIRE${' '.repeat(37)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const status of statuses) {
      const group = this.getByStatus(status);
      if (group.length === 0) continue;

      lines.push(`║  ${labels[status].toUpperCase()} (${group.length})${' '.repeat(Math.max(0, 68 - labels[status].length - String(group.length).length))}║`);

      for (const h of group) {
        const bar     = this.progressBar(h.posterior, 20);
        const preuves = `${h.evidence_for.length}✓ ${h.evidence_against.length}✗`;
        lines.push(`║    ${h.label.slice(0, 32).padEnd(32)} ${bar} ${h.posterior.toFixed(2)} ${preuves.padEnd(8)}║`);
      }

      lines.push(`╠${'═'.repeat(74)}╣`);
    }

    lines.push(`╚${'═'.repeat(74)}╝`);
    return lines.join('\n');
  }

  private progressBar(value: number, width: number): string {
    const filled = Math.round(value * width);
    return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}]`;
  }
}
