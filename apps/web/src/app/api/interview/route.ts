/**
 * TRAJECTOIRE · HIIOS v4.0
 * API Route — Entretien
 * File: app/api/interview/route.ts
 */

import { NextResponse, NextRequest } from 'next/server';
import { KernelState } from '@/application/hiios/layer0-kernel/KernelState';
import { EvidenceType, EvidenceReliability, EvidenceDirection } from '@/application/hiios/interfaces/IHIIOSKernel';

// ──────────────────────────────────────────────────────────
// STORE EN MÉMOIRE (à remplacer par Redis/DB en production)
// ──────────────────────────────────────────────────────────

const sessions = new Map<string, KernelState>();

// ──────────────────────────────────────────────────────────
// POST /api/interview — Démarrer ou continuer un entretien
// ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InterviewRequest;
    const { action } = body;

    switch (action) {

      case 'START':
        return handleStart(body);

      case 'RESPOND':
        return handleRespond(body);

      case 'NEXT_QUESTION':
        return handleNextQuestion(body);

      case 'EXPLAIN':
        return handleExplain(body);

      case 'COMPLETE':
        return handleComplete(body);

      default:
        return NextResponse.json(
          { error: `Action inconnue : ${action}` },
          { status: 400 }
        );
    }
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ──────────────────────────────────────────────────────────
// START — Démarrer un entretien
// ──────────────────────────────────────────────────────────

function handleStart(body: InterviewRequest): NextResponse {
  const sessionId   = generateSessionId();
  const candidateId = body.candidate_id ?? 'anonyme';

  const kernel = new KernelState(sessionId, candidateId);

  // Initialiser quelques hypothèses de départ
  initializeDefaultHypotheses(kernel);

  sessions.set(sessionId, kernel);

  const firstQuestion = kernel.questions.selectNext({
    current_turn       : 0,
    interview_state    : 'EXPLORATION',
    empathy_level      : kernel.session.empathy_level,
    pressure_level     : kernel.session.pressure_level,
    active_bias_types  : [],
    candidate_archetype: 'Senior',
  });

  return NextResponse.json({
    session_id    : sessionId,
    message       : 'Bienvenue. Commençons par explorer votre parcours.',
    question      : firstQuestion.text,
    question_id   : firstQuestion.id,
    state         : kernel.session.interview_state,
    turn          : kernel.session.current_turn,
    snapshot      : kernel.snapshot(),
  });
}

// ──────────────────────────────────────────────────────────
// RESPOND — Traiter une réponse candidat
// ──────────────────────────────────────────────────────────

function handleRespond(body: InterviewRequest): NextResponse {
  const kernel = getSession(body.session_id);

  // 1. Extraire les observations de la réponse
  const observations = extractObservations(body.response ?? '');

  // 2. Créer les preuves depuis les observations
  const addedEvidenceIds: string[] = [];
  for (const obs of observations) {
    const ev = kernel.evidence.add({
      turn                : kernel.session.current_turn + 1,
      type                : obs.type,
      rawContent          : obs.content,
      context             : kernel.session.interview_state,
      weight              : obs.weight,
      reliability         : obs.reliability,
      direction           : obs.direction,
      skillsImpacted      : obs.skill_nodes,
      hypothesesImpacted  : obs.hypotheses,
      biasCheck           : { hasBias: false },
    });
    addedEvidenceIds.push(ev.id);

    // Mettre à jour les hypothèses
    for (const hypId of obs.hypotheses) {
      kernel.hypothesis.updateWithEvidence(hypId, ev, kernel.session.current_turn + 1);
    }
  }

  // 3. Vérifier les biais
  const biasCheck = detectBias(kernel, body.response ?? '');
  if (biasCheck) {
    kernel.recordBiasEvent(biasCheck);
  }

  // 4. Mettre à jour le Skill Graph
  kernel.refreshSkillGraph();

  // 5. Enregistrer le tour
  const hypothesesUpdated = kernel.hypothesis.getActive().map(h => ({
    hypothesis_id : h.id,
    label         : h.label,
    before        : h.confidence_history.at(-2)?.value ?? h.prior,
    after         : h.posterior,
    delta         : h.posterior - (h.confidence_history.at(-2)?.value ?? h.prior),
    trigger       : `Réponse Tour ${kernel.session.current_turn + 1}`,
  }));

  kernel.recordTurn({
    interview_state   : kernel.session.interview_state,
    question_asked    : body.question_text ?? '',
    question_id       : body.question_id ?? '',
    candidate_response: body.response ?? '',
    evidence_ids_added: addedEvidenceIds,
    hypotheses_updated: hypothesesUpdated,
    bias_events       : [],
    empathy_level     : kernel.session.empathy_level,
    pressure_level    : kernel.session.pressure_level,
    information_gain  : 0.35,
  });

  // 6. Sélectionner la prochaine question
  const nextQuestion = kernel.questions.selectNext({
    current_turn       : kernel.session.current_turn,
    interview_state    : kernel.session.interview_state,
    empathy_level      : kernel.session.empathy_level,
    pressure_level     : kernel.session.pressure_level,
    active_bias_types  : [],
    candidate_archetype: kernel.session.archetype ?? 'Senior',
  });

  return NextResponse.json({
    session_id       : body.session_id,
    turn             : kernel.session.current_turn,
    state            : kernel.session.interview_state,
    next_question    : nextQuestion.text,
    next_question_id : nextQuestion.id,
    information_gain : nextQuestion.information_gain,
    selection_reason : nextQuestion.selection_reason,
    snapshot         : kernel.snapshot(),
    hypothesis_map   : kernel.hypothesis.formatHypothesisMap(),
    coverage_map     : kernel.skills.formatCoverageMap(),
    bias_detected    : null,
  });
}

// ──────────────────────────────────────────────────────────
// EXPLAIN — Expliquer un raisonnement
// ──────────────────────────────────────────────────────────

function handleExplain(body: InterviewRequest): NextResponse {
  const kernel = getSession(body.session_id);

  const explanations: Record<string, string> = {
    next_question    : kernel.questions.formatSelectionReport(),
    hypothesis_map   : kernel.hypothesis.formatHypothesisMap(),
    evidence_map     : kernel.evidence.formatReport(),
    coverage_map     : kernel.skills.formatCoverageMap(),
    decision         : kernel.decision.formatDecisionLedger(kernel.decision.generate(kernel.session.id)),
  };

  const target  = body.explain_target ?? 'hypothesis_map';
  const content = explanations[target] ?? 'Explication non disponible.';

  return NextResponse.json({
    session_id : body.session_id,
    target,
    content,
    snapshot   : kernel.snapshot(),
  });
}

// ──────────────────────────────────────────────────────────
// COMPLETE — Terminer l'entretien
// ──────────────────────────────────────────────────────────

function handleComplete(body: InterviewRequest): NextResponse {
  const kernel = getSession(body.session_id);

  kernel.refreshSkillGraph();
  const decision = kernel.decision.generate(body.session_id ?? '');
  kernel.complete();

  return NextResponse.json({
    session_id    : body.session_id,
    message       : 'Entretien terminé. Voici la décision.',
    decision      : {
      recommendation    : decision.recommendation,
      confidence        : decision.confidence,
      probability_success: decision.probability_of_success,
      coverage          : decision.evidence_coverage,
      reasoning         : decision.final_reasoning,
      strong_signals    : decision.strong_signals,
      unexplored_zones  : decision.unexplored_zones,
    },
    decision_ledger: kernel.decision.formatDecisionLedger(decision),
    evidence_map   : kernel.evidence.formatReport(),
    hypothesis_map : kernel.hypothesis.formatHypothesisMap(),
    coverage_map   : kernel.skills.formatCoverageMap(),
    snapshot       : kernel.snapshot(),
  });
}

function handleNextQuestion(body: InterviewRequest): NextResponse {
  const kernel = getSession(body.session_id);

  const q = kernel.questions.selectNext({
    current_turn       : kernel.session.current_turn,
    interview_state    : kernel.session.interview_state,
    empathy_level      : kernel.session.empathy_level,
    pressure_level     : kernel.session.pressure_level,
    active_bias_types  : [],
    candidate_archetype: kernel.session.archetype ?? 'Senior',
  });

  return NextResponse.json({
    session_id      : body.session_id,
    question        : q.text,
    question_id     : q.id,
    information_gain: q.information_gain,
    category        : q.category,
    selection_reason: q.selection_reason,
    snapshot        : kernel.snapshot(),
  });
}

// ──────────────────────────────────────────────────────────
// UTILITAIRES
// ──────────────────────────────────────────────────────────

function getSession(sessionId?: string): KernelState {
  if (!sessionId) throw new Error('session_id requis.');
  const kernel = sessions.get(sessionId);
  if (!kernel)   throw new Error(`Session introuvable : ${sessionId}`);
  if (!kernel.session.is_active) throw new Error('Session terminée.');
  return kernel;
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function initializeDefaultHypotheses(kernel: KernelState): void {
  const defaults = [
    { label: 'Leadership fort sous pression',      node: 'leadership.decision',                 prior: 0.45 },
    { label: 'Communication claire',               node: 'communication.clarte',                prior: 0.45 },
    { label: 'Exécution fiable sous contrainte',   node: 'execution.livraison',                 prior: 0.45 },
    { label: 'Conscience de soi développée',       node: 'intelligence_emotionnelle.conscienceSoi', prior: 0.40 },
    { label: 'Résilience face à l\'échec',         node: 'intelligence_emotionnelle.resilience', prior: 0.45 },
  ];

  for (const d of defaults) {
    kernel.hypothesis.generate({
      label          : d.label,
      description    : `Hypothèse initiale — ${d.label}`,
      skill_node_id  : d.node,
      prior          : d.prior,
      created_at_turn: 0,
    });
  }
}

function extractObservations(response: string): Observation[] {
  // Version simplifiée — à remplacer par analyse NLP en production
  const observations: Observation[] = [];

  if (response.length > 50) {
    observations.push({
      type        : EvidenceType.CITATION,
      content     : response.slice(0, 200),
      weight      : 0.55,
      reliability : EvidenceReliability.MEDIUM,
      direction   : EvidenceDirection.CONFIRMS,
      skill_nodes : ['leadership.decision'],
      hypotheses  : [],
    });
  }

  return observations;
}

function detectBias(_kernel: KernelState, response: string): null {
  // Version simplifiée — à remplacer par détection réelle
  return null;
}

// ──────────────────────────────────────────────────────────
// TYPES DE REQUÊTE
// ──────────────────────────────────────────────────────────

interface InterviewRequest {
  action          : 'START' | 'RESPOND' | 'NEXT_QUESTION' | 'EXPLAIN' | 'COMPLETE';
  session_id     ?: string;
  candidate_id   ?: string;
  question_id    ?: string;
  question_text  ?: string;
  response       ?: string;
  explain_target ?: string;
}

interface Observation {
  type        : EvidenceType;
  content     : string;
  weight      : number;
  reliability : EvidenceReliability;
  direction   : EvidenceDirection;
  skill_nodes : string[];
  hypotheses  : string[];
}
