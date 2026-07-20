/**
 * TRAJECTOIRE · HIIOS v4.0
 * Moteur 4 — Skill Graph
 * File: layer0-kernel/SkillGraph.ts
 */

import { EvidenceEngine } from './EvidenceEngine';

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

export interface SkillNode {
  id             : string;            // Ex : "leadership.decision"
  label          : string;            // Ex : "Décision sous pression"
  domain         : string;            // Ex : "leadership"
  domain_label   : string;            // Ex : "Leadership"
  weight         : number;            // Importance relative dans le domaine
  score          : number;            // 0.0 → 1.0 · calculé depuis les preuves
  evidence_count : number;
  coverage       : number;            // 0.0 → 1.0 · proportion du nœud explorée
  children       : string[];          // IDs des nœuds enfants
  parents        : string[];          // IDs des nœuds parents
}

export interface SkillDomain {
  id     : string;
  label  : string;
  nodes  : SkillNode[];
  score  : number;            // Moyenne pondérée des nœuds
  coverage: number;
}

// ──────────────────────────────────────────────────────────
// GRAPHE DE COMPÉTENCES
// ──────────────────────────────────────────────────────────

const SKILL_GRAPH_DEFINITION: Omit<SkillNode, 'score' | 'evidence_count' | 'coverage'>[] = [

  // LEADERSHIP
  { id: 'leadership.decision',           label: 'Décision sous pression',      domain: 'leadership',               domain_label: 'Leadership',               weight: 0.85, children: [], parents: ['leadership'] },
  { id: 'leadership.influence',          label: 'Influence sans autorité',      domain: 'leadership',               domain_label: 'Leadership',               weight: 0.75, children: [], parents: ['leadership'] },
  { id: 'leadership.responsabilisation', label: 'Responsabilisation d\'équipe', domain: 'leadership',               domain_label: 'Leadership',               weight: 0.80, children: [], parents: ['leadership'] },
  { id: 'leadership.conflit',            label: 'Gestion du conflit',           domain: 'leadership',               domain_label: 'Leadership',               weight: 0.70, children: [], parents: ['leadership'] },
  { id: 'leadership.vision',             label: 'Vision et sens',               domain: 'leadership',               domain_label: 'Leadership',               weight: 0.65, children: [], parents: ['leadership'] },

  // COMMUNICATION
  { id: 'communication.clarte',          label: 'Clarté sous pression',         domain: 'communication',            domain_label: 'Communication',            weight: 0.80, children: [], parents: ['communication'] },
  { id: 'communication.ecoute',          label: 'Écoute active',                domain: 'communication',            domain_label: 'Communication',            weight: 0.75, children: [], parents: ['communication'] },
  { id: 'communication.adaptation',      label: 'Adaptation du message',        domain: 'communication',            domain_label: 'Communication',            weight: 0.70, children: [], parents: ['communication'] },
  { id: 'communication.desaccord',       label: 'Gestion du désaccord',         domain: 'communication',            domain_label: 'Communication',            weight: 0.65, children: [], parents: ['communication'] },

  // EXÉCUTION
  { id: 'execution.priorisation',        label: 'Priorisation',                 domain: 'execution',                domain_label: 'Exécution',                weight: 0.85, children: [], parents: ['execution'] },
  { id: 'execution.incertitude',         label: 'Gestion de l\'incertitude',    domain: 'execution',                domain_label: 'Exécution',                weight: 0.80, children: [], parents: ['execution'] },
  { id: 'execution.livraison',           label: 'Livraison sous contrainte',    domain: 'execution',                domain_label: 'Exécution',                weight: 0.75, children: [], parents: ['execution'] },
  { id: 'execution.apprentissage',       label: 'Apprentissage par l\'échec',   domain: 'execution',                domain_label: 'Exécution',                weight: 0.70, children: [], parents: ['execution'] },

  // INTELLIGENCE ÉMOTIONNELLE
  { id: 'intelligence_emotionnelle.conscienceSoi', label: 'Conscience de soi',  domain: 'intelligence_emotionnelle', domain_label: 'Intelligence émotionnelle', weight: 0.80, children: [], parents: ['intelligence_emotionnelle'] },
  { id: 'intelligence_emotionnelle.regulation',    label: 'Régulation émotionnelle', domain: 'intelligence_emotionnelle', domain_label: 'Intelligence émotionnelle', weight: 0.75, children: [], parents: ['intelligence_emotionnelle'] },
  { id: 'intelligence_emotionnelle.empathie',      label: 'Empathie',            domain: 'intelligence_emotionnelle', domain_label: 'Intelligence émotionnelle', weight: 0.70, children: [], parents: ['intelligence_emotionnelle'] },
  { id: 'intelligence_emotionnelle.resilience',    label: 'Résilience',          domain: 'intelligence_emotionnelle', domain_label: 'Intelligence émotionnelle', weight: 0.85, children: [], parents: ['intelligence_emotionnelle'] },
];

// ──────────────────────────────────────────────────────────
// SKILL GRAPH ENGINE
// ──────────────────────────────────────────────────────────

export class SkillGraph {

  private nodes          : Map<string, SkillNode> = new Map();
  private evidenceEngine : EvidenceEngine;

  constructor(evidenceEngine: EvidenceEngine) {
    this.evidenceEngine = evidenceEngine;
    this.initializeNodes();
  }

  private initializeNodes(): void {
    for (const def of SKILL_GRAPH_DEFINITION) {
      this.nodes.set(def.id, {
        ...def,
        score         : 0,
        evidence_count: 0,
        coverage      : 0,
      });
    }
  }

  // ────────────────────────────────────────────────────────
  // MISE À JOUR DES SCORES
  // ────────────────────────────────────────────────────────

  updateFromEvidence(nodeId: string): void {

    const node      = this.getNode(nodeId);
    const evidences = this.evidenceEngine.getForSkillNode(nodeId);

    if (evidences.length === 0) {
      node.score         = 0;
      node.evidence_count= 0;
      node.coverage      = 0;
      return;
    }

    const confirming  = evidences.filter(e => e.direction === 'CONFIRMS');
    const infirming   = evidences.filter(e => e.direction === 'INFIRMS');

    const positiveScore = confirming.reduce((s, e) => s + e.weight, 0);
    const negativeScore = infirming.reduce((s, e) => s + e.weight, 0);
    const netScore      = Math.max(0, positiveScore - negativeScore);

    // Normalisation basée sur le poids maximum possible
    const maxPossible   = node.weight * 3;  // 3 preuves HIGH idéales
    const rawScore      = Math.min(1, netScore / maxPossible);

    // Bonus pour les patterns (preuves répétées)
    const patternBonus  = evidences.filter(e => e.type === 'PATTERN').length * 0.05;
    node.score          = Math.min(1, rawScore + patternBonus);
    node.evidence_count = evidences.length;
    node.coverage       = Math.min(1, evidences.length / 3);  // Couverture complète = 3 preuves

    this.nodes.set(nodeId, node);
  }

  // ────────────────────────────────────────────────────────
  // REQUÊTES
  // ────────────────────────────────────────────────────────

  getNode(id: string): SkillNode {
    const n = this.nodes.get(id);
    if (!n) throw new Error(`Nœud introuvable : ${id}`);
    return n;
  }

  getAllNodes(): SkillNode[] {
    return Array.from(this.nodes.values());
  }

  getByDomain(domain: string): SkillNode[] {
    return this.getAllNodes().filter(n => n.domain === domain);
  }

  getUncovered(): SkillNode[] {
    return this.getAllNodes().filter(n => n.coverage === 0);
  }

  getStrong(): SkillNode[] {
    return this.getAllNodes().filter(n => n.score >= 0.70);
  }

  getWeak(): SkillNode[] {
    return this.getAllNodes().filter(n => n.score < 0.40 && n.evidence_count > 0);
  }

  getCoveragePercent(): number {
    const nodes   = this.getAllNodes();
    const covered = nodes.filter(n => n.coverage > 0).length;
    return covered / nodes.length;
  }

  getDomains(): SkillDomain[] {
    const domainIds = [...new Set(this.getAllNodes().map(n => n.domain))];
    return domainIds.map(domainId => {
      const nodes       = this.getByDomain(domainId);
      const totalWeight = nodes.reduce((s, n) => s + n.weight, 0);
      const weightedScore = nodes.reduce((s, n) => s + n.score * n.weight, 0);
      return {
        id      : domainId,
        label   : nodes[0]?.domain_label ?? domainId,
        nodes,
        score   : totalWeight > 0 ? weightedScore / totalWeight : 0,
        coverage: nodes.reduce((s, n) => s + n.coverage, 0) / nodes.length,
      };
    });
  }

  // ────────────────────────────────────────────────────────
  // COVERAGE MAP — RAPPORT FORMATÉ
  // ────────────────────────────────────────────────────────

  formatCoverageMap(): string {
    const lines  : string[] = [];
    const domains = this.getDomains();

    lines.push(`╔${'═'.repeat(74)}╗`);
    lines.push(`║  CARTE DE COUVERTURE · TRAJECTOIRE${' '.repeat(38)}║`);
    lines.push(`║  Compétences explorées vs compétences disponibles${' '.repeat(24)}║`);
    lines.push(`╠${'═'.repeat(74)}╣`);

    for (const domain of domains) {
      const domainBar = this.progressBar(domain.score, 20);
      const domainCov = `${(domain.coverage * 100).toFixed(0)}%`.padStart(4);
      lines.push(`║  ${domain.label.toUpperCase().padEnd(28)} ${domainBar} ${domain.score.toFixed(2)} Cov:${domainCov}  ║`);

      for (const node of domain.nodes) {
        const nodeBar = this.progressBar(node.score, 16);
        const nodeCov = node.coverage === 0
          ? '░░░ non exploré'
          : `${(node.coverage * 100).toFixed(0)}% couvert`;
        const indicator = node.score >= 0.70 ? '✓' : node.coverage === 0 ? '○' : '◐';
        lines.push(`║    ${indicator} ${node.label.padEnd(30)} ${nodeBar} ${nodeCov.padEnd(14)}║`);
      }

      lines.push(`╠${'═'.repeat(74)}╣`);
    }

    const globalCov = this.getCoveragePercent();
    const globalBar = this.progressBar(globalCov, 30);
    lines.push(`║  COUVERTURE GLOBALE  ${globalBar} ${(globalCov * 100).toFixed(0)}%${' '.repeat(15)}║`);
    lines.push(`╚${'═'.repeat(74)}╝`);

    return lines.join('\n');
  }

  getConfidenceCurves(): Record<string, { turn: number; value: number }[]> {
    const result: Record<string, { turn: number; value: number }[]> = {};
    for (const node of this.getAllNodes()) {
      result[node.id] = this.evidenceEngine
        .getForSkillNode(node.id)
        .map((ev, i) => ({ turn: ev.turn, value: Math.min(1, (i + 1) * 0.25) }));
    }
    return result;
  }

  private progressBar(value: number, width: number): string {
    const filled = Math.round(value * width);
    return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}]`;
  }
}
