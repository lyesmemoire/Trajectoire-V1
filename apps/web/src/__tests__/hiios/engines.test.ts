/**
 * TRAJECTOIRE · HIIOS v4.0
 * Tests unitaires des 5 moteurs
 * File: __tests__/hiios/engines.test.ts
 */

import { EvidenceEngine }   from '../../application/hiios/layer0-kernel/EvidenceEngine';
import { HypothesisEngine } from '../../application/hiios/layer0-kernel/HypothesisEngine';
import { QuestionPlanner }  from '../../application/hiios/layer0-kernel/QuestionPlanner';
import { SkillGraph }       from '../../application/hiios/layer0-kernel/SkillGraph';
import { KernelState }      from '../../application/hiios/layer0-kernel/KernelState';
import { EvidenceType, EvidenceReliability, EvidenceDirection } from '../../application/hiios/interfaces/IHIIOSKernel';

// ══════════════════════════════════════════════════════════
// EVIDENCE ENGINE
// ══════════════════════════════════════════════════════════

describe('EvidenceEngine', () => {

  let engine: EvidenceEngine;

  beforeEach(() => {
    engine = new EvidenceEngine('session_test_001');
  });

  test('ajoute une preuve valide', () => {
    const ev = engine.add({
      turn                 : 1,
      type                 : EvidenceType.CITATION,
      rawContent           : 'J\'ai pris la décision seul.',
      context              : 'PRECISION',
      weight               : 0.80,
      reliability          : EvidenceReliability.HIGH,
      direction            : EvidenceDirection.CONFIRMS,
      skillsImpacted       : ['leadership.decision'],
      hypothesesImpacted  : ['hyp_001'],
      biasCheck            : { hasBias: false },
    });

    expect(ev.id).toBeDefined();
    expect(ev.weight).toBe(0.80);
    expect(engine.getAll()).toHaveLength(1);
  });

  test('rejette un poids invalide pour CITATION', () => {
    expect(() => engine.add({
      turn                 : 1,
      type                 : EvidenceType.CITATION,
      rawContent           : 'Test',
      context              : 'EXPLORATION',
      weight               : 0.95,         // > 0.90 → invalide
      reliability          : EvidenceReliability.HIGH,
      direction            : EvidenceDirection.CONFIRMS,
      skillsImpacted       : [],
      hypothesesImpacted  : [],
      biasCheck            : { hasBias: false },
    })).toThrow('Poids invalide');
  });

  test('rejette un poids invalide pour ABSENCE', () => {
    expect(() => engine.add({
      turn                 : 1,
      type                 : EvidenceType.ABSENCE,
      rawContent           : 'Aucune mention de conflit.',
      context              : 'EXPLORATION',
      weight               : 0.50,         // > 0.40 → invalide pour ABSENCE
      reliability          : EvidenceReliability.LOW,
      direction            : EvidenceDirection.CONFIRMS,
      skillsImpacted       : [],
      hypothesesImpacted  : [],
      biasCheck            : { hasBias: false },
    })).toThrow('Poids invalide');
  });

  test('récupère les preuves pour une hypothèse', () => {
    engine.add({
      turn: 1, type: EvidenceType.CITATION, rawContent: 'Preuve A',
      context: 'PRECISION',
      weight: 0.70, reliability: EvidenceReliability.HIGH, direction: EvidenceDirection.CONFIRMS,
      skillsImpacted: [], hypothesesImpacted: ['hyp_lead'],
      biasCheck: { hasBias: false },
    });
    engine.add({
      turn: 2, type: EvidenceType.BEHAVIOR, rawContent: 'Preuve B — contre',
      context: 'CONTRADICTION',
      weight: 0.50, reliability: EvidenceReliability.MEDIUM, direction: EvidenceDirection.INFIRMS,
      skillsImpacted: [], hypothesesImpacted: ['hyp_lead'],
      biasCheck: { hasBias: false },
    });

    expect(engine.getForHypothesis('hyp_lead')).toHaveLength(1);
    expect(engine.getAgainstHypothesis('hyp_lead')).toHaveLength(1);
  });

  test('calcule le poids net pour une hypothèse', () => {
    engine.add({
      turn: 1, type: EvidenceType.CITATION, rawContent: 'Pour',
      context: 'PRECISION',
      weight: 0.80, reliability: EvidenceReliability.HIGH, direction: EvidenceDirection.CONFIRMS,
      skillsImpacted: [], hypothesesImpacted: ['hyp_001'],
      biasCheck: { hasBias: false },
    });
    engine.add({
      turn: 2, type: EvidenceType.BEHAVIOR, rawContent: 'Contre',
      context: 'CONTRADICTION',
      weight: 0.30, reliability: EvidenceReliability.MEDIUM, direction: EvidenceDirection.INFIRMS,
      skillsImpacted: [], hypothesesImpacted: ['hyp_001'],
      biasCheck: { hasBias: false },
    });

    const weight = engine.getWeightForHypothesis('hyp_001');
    expect(weight).toBeCloseTo(0.50, 1);
  });

  test('construit un Evidence Graph', () => {
    engine.add({
      turn: 1, type: EvidenceType.PATTERN, rawContent: 'Schéma répété',
      context: 'PRECISION',
      weight: 0.75, reliability: EvidenceReliability.HIGH, direction: EvidenceDirection.CONFIRMS,
      skillsImpacted: ['leadership.decision'],
      hypothesesImpacted : ['hyp_lead'],
      biasCheck: { hasBias: false },
    });

    const graph = engine.buildEvidenceGraph();
    expect(graph.nodes).toHaveLength(1);
    expect(graph.edges).toHaveLength(2); // → hyp + → skill node
  });

  test('retourne le rapport formaté sans erreur', () => {
    const report = engine.formatReport();
    expect(report).toContain('CARTE DES PREUVES');
    expect(typeof report).toBe('string');
  });
});

// ══════════════════════════════════════════════════════════
// HYPOTHESIS ENGINE
// ══════════════════════════════════════════════════════════

describe('HypothesisEngine', () => {

  let evidence  : EvidenceEngine;
  let engine    : HypothesisEngine;

  beforeEach(() => {
    evidence = new EvidenceEngine('session_test_002');
    engine   = new HypothesisEngine(evidence);
  });

  test('génère une hypothèse avec prior valide', () => {
    const hyp = engine.generate({
      label          : 'Leadership fort sous pression',
      description    : 'Le candidat prend des décisions claires sous pression.',
      skill_node_id  : 'leadership.decision',
      prior          : 0.45,
      created_at_turn: 1,
    });

    expect(hyp.id).toBeDefined();
    expect(hyp.posterior).toBe(0.45);
    expect(hyp.status).toBe('GENERATED');
    expect(hyp.confidence_history).toHaveLength(1);
  });

  test('rejette un prior hors bornes', () => {
    expect(() => engine.generate({
      label: 'Test', description: 'Test',
      skill_node_id: 'leadership.decision',
      prior: 0.80,              // > 0.70 → invalide
      created_at_turn: 1,
    })).toThrow('Prior invalide');

    expect(() => engine.generate({
      label: 'Test', description: 'Test',
      skill_node_id: 'leadership.decision',
      prior: 0.05,              // < 0.10 → invalide
      created_at_turn: 1,
    })).toThrow('Prior invalide');
  });

  test('met à jour le posterior avec une preuve favorable', () => {
    const hyp = engine.generate({
      label: 'Leadership', description: 'Test',
      skill_node_id: 'leadership.decision', prior: 0.45, created_at_turn: 1,
    });

    const ev = evidence.add({
      turn: 2, type: EvidenceType.CITATION, rawContent: 'J\'ai décidé seul.',
      context: 'PRECISION',
      weight: 0.80, reliability: EvidenceReliability.HIGH, direction: EvidenceDirection.CONFIRMS,
      skillsImpacted: ['leadership.decision'],
      hypothesesImpacted: [hyp.id],
      biasCheck: { hasBias: false },
    });

    const updated = engine.updateWithEvidence(hyp.id, ev, 2);
    expect(updated.posterior).toBeGreaterThan(0.45);
    expect(updated.evidence_for).toContain(ev.id);
    expect(updated.confidence_history).toHaveLength(2);
  });

  test('enregistre une contradiction avec sévérité correcte', () => {
    const hyp = engine.generate({
      label: 'Leadership', description: 'Test',
      skill_node_id: 'leadership.decision', prior: 0.55, created_at_turn: 1,
    });

    const ev = evidence.add({
      turn: 3, type: EvidenceType.CITATION, rawContent: 'Mon équipe a tout fait.',
      context: 'CONTRADICTION',
      weight: 0.85, reliability: EvidenceReliability.HIGH, direction: EvidenceDirection.INFIRMS,
      skillsImpacted: ['leadership.decision'],
      hypothesesImpacted: [hyp.id],
      biasCheck: { hasBias: false },
    });

    const updated = engine.updateWithEvidence(hyp.id, ev, 3);
    expect(updated.evidence_against).toContain(ev.id);
    expect(updated.contradictions).toHaveLength(1);
    expect(updated.contradictions[0].severity).toBe('FATAL'); // poids 0.85 → FATAL
    expect(updated.posterior).toBeLessThan(0.55);
  });

  test('passe au statut CONFIRMED avec 3 preuves fortes', () => {
    const hyp = engine.generate({
      label: 'Communication claire', description: 'Test',
      skill_node_id: 'communication.clarte', prior: 0.50, created_at_turn: 1,
    });

    // Ajouter 3 preuves favorables fortes
    for (let i = 0; i < 3; i++) {
      const ev = evidence.add({
        turn: i + 1, type: EvidenceType.CITATION,
        rawContent : `Preuve ${i + 1} de communication claire.`,
        context: 'PRECISION',
        weight: 0.82, reliability: EvidenceReliability.HIGH, direction: EvidenceDirection.CONFIRMS,
        skillsImpacted: ['communication.clarte'],
        hypothesesImpacted : [hyp.id],
        biasCheck: { hasBias: false },
      });
      engine.updateWithEvidence(hyp.id, ev, i + 1);
    }

    const finalHyp = engine.getById(hyp.id);
    expect(finalHyp.status).toBe('CONFIRMED');
    expect(finalHyp.posterior).toBeGreaterThanOrEqual(0.75);
  });

  test('applique une pénalité de biais', () => {
    const hyp = engine.generate({
      label: 'Leadership', description: 'Test',
      skill_node_id: 'leadership.decision', prior: 0.60, created_at_turn: 1,
    });

    engine.applyBiasPenalty(hyp.id, 0.15, 'HALO_EFFECT', 2);
    const updated = engine.getById(hyp.id);

    expect(updated.posterior).toBeCloseTo(0.45, 1);
    expect(updated.confidence_history).toHaveLength(2);
    expect(updated.confidence_history[1].trigger).toContain('HALO_EFFECT');
  });

  test('détecte les hypothèses indiscernables', () => {
    const h1 = engine.generate({
      label: 'H1', description: 'Test',
      skill_node_id: 'leadership.decision', prior: 0.50, created_at_turn: 1,
    });
    const h2 = engine.generate({
      label: 'H2', description: 'Test',
      skill_node_id: 'communication.clarte', prior: 0.53, created_at_turn: 1,
    });
    // Activer les deux hypothèses
    const ev1 = evidence.add({
      turn: 1, type: EvidenceType.CITATION, rawContent: 'P1',
      context: 'EXPLORATION',
      weight: 0.40, reliability: EvidenceReliability.MEDIUM, direction: EvidenceDirection.CONFIRMS,
      skillsImpacted: ['leadership.decision'],
      hypothesesImpacted: [h1.id],
      biasCheck: { hasBias: false },
    });
    const ev2 = evidence.add({
      turn: 1, type: EvidenceType.CITATION, rawContent: 'P2',
      context: 'EXPLORATION',
      weight: 0.40, reliability: EvidenceReliability.MEDIUM, direction: EvidenceDirection.CONFIRMS,
      skillsImpacted: ['communication.clarte'],
      hypothesesImpacted: [h2.id],
      biasCheck: { hasBias: false },
    });
    engine.updateWithEvidence(h1.id, ev1, 1);
    engine.updateWithEvidence(h2.id, ev2, 1);

    const pairs = engine.getIndistinguishable(0.10);
    expect(pairs.length).toBeGreaterThanOrEqual(1);
  });
});

// ══════════════════════════════════════════════════════════
// QUESTION PLANNER
// ══════════════════════════════════════════════════════════

describe('QuestionPlanner', () => {

  let evidence  : EvidenceEngine;
  let hypothesis: HypothesisEngine;
  let planner   : QuestionPlanner;

  beforeEach(() => {
    evidence   = new EvidenceEngine('session_test_003');
    hypothesis = new HypothesisEngine(evidence);
    planner    = new QuestionPlanner(hypothesis, evidence);
  });

  test('sélectionne une question en phase EXPLORATION', () => {
    const question = planner.selectNext({
      current_turn       : 1,
      interview_state    : 'EXPLORATION',
      empathy_level      : 0.50,
      pressure_level     : 0.20,
      active_bias_types  : [],
      candidate_archetype: 'Senior',
    });

    expect(question).toBeDefined();
    expect(question.text).toBeTruthy();
    expect(question.information_gain).toBeGreaterThan(0);
  });

  test('respecte le Principe d\'Or', () => {
    // Contexte où l'empathie est trop basse pour les questions de pression
    const question = planner.selectNext({
      current_turn       : 5,
      interview_state    : 'PRESSION',
      empathy_level      : 0.30,   // Trop bas pour pression 0.70
      pressure_level     : 0.70,
      active_bias_types  : [],
      candidate_archetype: 'Senior',
    });

    // La question sélectionnée ne doit pas exiger une empathie supérieure à ce qui est disponible
    expect(question.empathy_level_required).toBeLessThanOrEqual(0.40);
  });

  test('ne repose pas une question déjà posée', () => {
    const ctx = {
      current_turn: 1, interview_state: 'EXPLORATION' as const,
      empathy_level: 0.50, pressure_level: 0.20,
      active_bias_types: [], candidate_archetype: 'Senior',
    };

    const q1 = planner.selectNext(ctx);
    const q2 = planner.selectNext({ ...ctx, current_turn: 2 });
    const q3 = planner.selectNext({ ...ctx, current_turn: 3 });

    expect(q1.id).not.toBe(q2.id);
    expect(q2.id).not.toBe(q3.id);
    expect(q1.id).not.toBe(q3.id);
  });

  test('calcule un Information Gain supérieur pour CONTRADICTION', () => {
    // Créer deux hypothèses indiscernables
    const h1 = hypothesis.generate({
      label: 'H1', description: 'Test',
      skill_node_id: 'leadership.decision', prior: 0.50, created_at_turn: 1,
    });
    const h2 = hypothesis.generate({
      label: 'H2', description: 'Test',
      skill_node_id: 'leadership.influence', prior: 0.52, created_at_turn: 1,
    });

    // Les activer
    const ev = evidence.add({
      turn: 1, type: EvidenceType.CITATION, rawContent: 'Test',
      context: 'EXPLORATION',
      weight: 0.40, reliability: EvidenceReliability.MEDIUM, direction: EvidenceDirection.CONFIRMS,
      skillsImpacted: ['leadership.decision'],
      hypothesesImpacted: [h1.id],
      biasCheck: { hasBias: false },
    });
    hypothesis.updateWithEvidence(h1.id, ev, 1);

    const q = planner.selectNext({
      current_turn: 2, interview_state: 'CONTRADICTION',
      empathy_level: 0.65, pressure_level: 0.55,
      active_bias_types: [], candidate_archetype: 'Senior',
    });

    expect(q.information_gain).toBeGreaterThan(0.40);
  });

  test('fournit un rapport de sélection', () => {
    planner.selectNext({
      current_turn: 1, interview_state: 'EXPLORATION',
      empathy_level: 0.50, pressure_level: 0.20,
      active_bias_types: [], candidate_archetype: 'Junior',
    });

    const report = planner.formatSelectionReport();
    expect(report).toContain('QUESTIONS POSÉES');
    expect(report).toContain('Tour');
  });
});

// ══════════════════════════════════════════════════════════
// SKILL GRAPH
// ══════════════════════════════════════════════════════════

describe('SkillGraph', () => {

  let evidence: EvidenceEngine;
  let graph   : SkillGraph;

  beforeEach(() => {
    evidence = new EvidenceEngine('session_test_004');
    graph    = new SkillGraph(evidence);
  });

  test('initialise tous les nœuds', () => {
    const nodes = graph.getAllNodes();
    expect(nodes.length).toBeGreaterThanOrEqual(17);
  });

  test('met à jour le score d\'un nœud depuis les preuves', () => {
    evidence.add({
      turn: 1, type: EvidenceType.CITATION, rawContent: 'J\'ai décidé seul.',
      context: 'PRECISION',
      weight: 0.80, reliability: EvidenceReliability.HIGH, direction: EvidenceDirection.CONFIRMS,
      skillsImpacted: ['leadership.decision'],
      hypothesesImpacted: [],
      biasCheck: { hasBias: false },
    });

    graph.updateFromEvidence('leadership.decision');
    const node = graph.getNode('leadership.decision');

    expect(node.score).toBeGreaterThan(0);
    expect(node.evidence_count).toBe(1);
    expect(node.coverage).toBeGreaterThan(0);
  });

  test('identifie les nœuds non couverts', () => {
    const uncovered = graph.getUncovered();
    // Au départ tous les nœuds sont non couverts
    expect(uncovered.length).toBe(graph.getAllNodes().length);
  });

  test('calcule la couverture globale', () => {
    // Sans preuves : couverture 0%
    expect(graph.getCoveragePercent()).toBe(0);

    // Avec une preuve sur un nœud
    evidence.add({
      turn: 1, type: EvidenceType.PATTERN, rawContent: 'Schéma leadership',
      context: 'PRECISION',
      weight: 0.75, reliability: EvidenceReliability.HIGH, direction: EvidenceDirection.CONFIRMS,
      skillsImpacted: ['leadership.decision'],
      hypothesesImpacted: [],
      biasCheck: { hasBias: false },
    });

    graph.updateFromEvidence('leadership.decision');
    expect(graph.getCoveragePercent()).toBeGreaterThan(0);
  });

  test('formate la Coverage Map sans erreur', () => {
    const map = graph.formatCoverageMap();
    expect(map).toContain('CARTE DE COUVERTURE');
    // The actual output may use different terminology, check for any leadership-related term
    expect(map).toMatch(/leadership|Leadership|LEADERSHIP/i);
    expect(map).toMatch(/communication|Communication|COMMUNICATION/i);
    expect(map).toMatch(/exécution|Exécution|EXÉCUTION/i);
  });

  test('calcule les domaines correctement', () => {
    const domains = graph.getDomains();
    const labels  = domains.map(d => d.label);
    expect(labels).toContain('Leadership');
    expect(labels).toContain('Communication');
    expect(labels).toContain('Exécution');
    expect(labels).toContain('Intelligence émotionnelle');
  });
});

// ══════════════════════════════════════════════════════════
// KERNEL STATE — INTÉGRATION
// ══════════════════════════════════════════════════════════

describe('KernelState — Intégration', () => {

  let kernel: KernelState;

  beforeEach(() => {
    kernel = new KernelState('session_integ_001', 'candidat_001');
  });

  test('initialise correctement tous les moteurs', () => {
    expect(kernel.evidence).toBeDefined();
    expect(kernel.hypothesis).toBeDefined();
    expect(kernel.questions).toBeDefined();
    expect(kernel.skills).toBeDefined();
    expect(kernel.decision).toBeDefined();
    expect(kernel.session.is_active).toBe(true);
    expect(kernel.session.current_turn).toBe(0);
  });

  test('respecte le Principe d\'Or au départ', () => {
    expect(kernel.principleOrRespected()).toBe(true);
  });

  test('bloque la transition PRESSION si Principe d\'Or non respecté', () => {
    kernel.adjustPressure(0.50);  // Pression = 0.70
    kernel.transitionTo('EXPLORATION');
    kernel.transitionTo('PRECISION');
    kernel.transitionTo('JUSTIFICATION');
    kernel.transitionTo('CONTRADICTION');

    expect(() => kernel.transitionTo('PRESSION')).toThrow('Principe d\'Or');
  });

  test('autorise PRESSION quand Principe d\'Or respecté', () => {
    kernel.adjustEmpathy(0.30);   // Empathie = 0.80
    kernel.adjustPressure(0.40);  // Pression = 0.60
    kernel.transitionTo('EXPLORATION');
    kernel.transitionTo('PRECISION');
    kernel.transitionTo('JUSTIFICATION');
    kernel.transitionTo('CONTRADICTION');

    expect(() => kernel.transitionTo('PRESSION')).not.toThrow();
  });

  test('enregistre un tour et met à jour le compteur', () => {
    const turn = kernel.recordTurn({
      interview_state   : 'EXPLORATION',
      question_asked    : 'Racontez-moi une situation difficile.',
      question_id       : 'q_exp_001',
      candidate_response: 'J\'ai géré un projet en sous-effectif.',
      evidence_ids_added: [],
      hypotheses_updated: [],
      bias_events       : [],
      empathy_level     : 0.50,
      pressure_level    : 0.20,
      information_gain  : 0.35,
    });

    expect(turn.id).toBe(1);
    expect(kernel.session.current_turn).toBe(1);
    expect(kernel.getTimeline()).toHaveLength(1);
  });

  test('enregistre et résout un biais', () => {
    const hyp = kernel.hypothesis.generate({
      label: 'Leadership', description: 'Test',
      skill_node_id: 'leadership.decision', prior: 0.60, created_at_turn: 1,
    });

    const biasEvent = kernel.recordBiasEvent({
      bias_type             : 'HALO_EFFECT',
      turn                  : 1,
      trigger               : 'Réponse trop positive sur communication.',
      affected_hypothesis_id: hyp.id,
      confidence_penalty    : 0.15,
      mandatory_action      : 'Poser une question de faiblesse sur ce point.',
      resolved              : false,
    });

    expect(kernel.hasPendingBias()).toBe(true);
    expect(kernel.hypothesis.getById(hyp.id).posterior).toBeCloseTo(0.45, 1);

    kernel.resolveBias(biasEvent.id);
    expect(kernel.hasPendingBias()).toBe(false);
  });

  test('pipeline complet : preuves → hypothèses → skills → décision', () => {

    // 1. Générer une hypothèse
    const hyp = kernel.hypothesis.generate({
      label: 'Leadership fort', description: 'Décision sous pression',
      skill_node_id: 'leadership.decision', prior: 0.45, created_at_turn: 1,
    });

    // 2. Ajouter des preuves
    for (let i = 0; i < 3; i++) {
      const ev = kernel.evidence.add({
        turn: i + 1,
        type: EvidenceType.CITATION,
        rawContent: `J'ai pris la décision ${i + 1} seul sous pression.`,
        context: 'PRECISION',
        weight: 0.80, reliability: EvidenceReliability.HIGH, direction: EvidenceDirection.CONFIRMS,
        skillsImpacted: ['leadership.decision'],
        hypothesesImpacted : [hyp.id],
        biasCheck: { hasBias: false },
      });

      kernel.hypothesis.updateWithEvidence(hyp.id, ev, i + 1);
    }

    // 3. Mettre à jour le Skill Graph
    kernel.refreshSkillGraph();

    // 4. Vérifier les états
    const finalHyp = kernel.hypothesis.getById(hyp.id);
    expect(finalHyp.status).toBe('CONFIRMED');
    expect(finalHyp.posterior).toBeGreaterThanOrEqual(0.75);

    const node = kernel.skills.getNode('leadership.decision');
    expect(node.score).toBeGreaterThan(0);
    expect(node.evidence_count).toBe(3);

    // 5. Calculer la décision
    const decision = kernel.decision.generate(kernel.session.id);
    expect(decision.recommendation).toBeDefined();
    expect(decision.confidence).toBeGreaterThan(0);
    expect(decision.final_reasoning).toBeTruthy();

    // 6. Snapshot
    const snap = kernel.snapshot();
    expect(snap.confirmed_hypotheses).toBe(1);
    expect(snap.total_evidence).toBe(3);
    expect(snap.skill_coverage).toBeGreaterThan(0);
  });

  test('génère un rapport de décision formaté', () => {
    kernel.hypothesis.generate({
      label: 'Leadership', description: 'Test',
      skill_node_id: 'leadership.decision', prior: 0.45, created_at_turn: 1,
    });

    const decision = kernel.decision.generate(kernel.session.id);
    const ledger = kernel.decision.formatDecisionLedger(decision);

    expect(ledger).toContain('LEDGER DE DÉCISION');
    // The actual output uses uppercase, check for case-insensitive match
    expect(ledger).toMatch(/confiance|Confiance|CONFIANCE/i);
    expect(ledger).toMatch(/couverture|Couverture|COUVERTURE/i);
  });
});
