# ETS-033 Follow-up Engine

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le moteur de follow-up qui définit toutes les stratégies de relance : Clarification, Evidence, Metrics, Ownership, Tradeoffs, Architecture, Failure, STAR, Root Cause, Leadership, Debugging, Incident.

---

## Stratégies de Follow-up

### Clarification Strategy

**Objectif** : Clarifier une réponse vague ou ambiguë.

**Trigger**
- Réponse vague
- Réponse imprécise
- Réponse ambiguë
- Réponse générique

**Questions**
- "Pouvez-vous préciser X ?"
- "Que voulez-vous dire par Y ?"
- "Donnez-moi un exemple concret"
- "Comment exactement ?"

**Spécification**
```typescript
interface ClarificationStrategy {
  name: 'clarification';
  triggers: ClarificationTrigger[];
  questions: ClarificationQuestion[];
  priority: number;
  maxAttempts: number;
}

interface ClarificationTrigger {
  type: 'vague' | 'imprecise' | 'ambiguous' | 'generic';
  condition: string;
}

interface ClarificationQuestion {
  id: string;
  text: string;
  context: string[];
  intensity: number;
}
```

**Exemple**
```typescript
{
  name: 'clarification',
  triggers: [
    {
      type: 'vague',
      condition: 'response.length < 50 OR contains_generic_phrases'
    },
    {
      type: 'imprecise',
      condition: 'NOT contains_numbers AND NOT contains_specific_terms'
    }
  ],
  questions: [
    {
      id: 'clarif-1',
      text: "Pouvez-vous préciser ?",
      context: ['general'],
      intensity: 1
    },
    {
      id: 'clarif-2',
      text: "Que voulez-vous dire par X ?",
      context: ['specific'],
      intensity: 2
    },
    {
      id: 'clarif-3',
      text: "Donnez-moi un exemple concret",
      context: ['example'],
      intensity: 3
    }
  ],
  priority: 1,
  maxAttempts: 3
}
```

---

### Evidence Strategy

**Objectif** : Obtenir des preuves quantitatives ou qualitatives.

**Trigger**
- Réponse sans chiffres
- Réponse sans métriques
- Réponse sans résultats
- Réponse sans exemples

**Questions**
- "Combien exactement ?"
- "Quelle était l'ampleur de X ?"
- "Quels résultats avez-vous obtenus ?"
- "Comment avez-vous mesuré X ?"

**Spécification**
```typescript
interface EvidenceStrategy {
  name: 'evidence';
  triggers: EvidenceTrigger[];
  questions: EvidenceQuestion[];
  priority: number;
  maxAttempts: number;
}

interface EvidenceTrigger {
  type: 'no_numbers' | 'no_metrics' | 'no_results' | 'no_examples';
  condition: string;
}

interface EvidenceQuestion {
  id: string;
  text: string;
  evidenceType: EvidenceType;
  intensity: number;
}

type EvidenceType = 
  | 'quantitative'
  | 'qualitative'
  | 'direct'
  | 'indirect';
```

**Exemple**
```typescript
{
  name: 'evidence',
  triggers: [
    {
      type: 'no_numbers',
      condition: 'NOT contains_numbers'
    },
    {
      type: 'no_metrics',
      condition: 'NOT contains_metrics'
    }
  ],
  questions: [
    {
      id: 'evid-1',
      text: "Combien exactement ?",
      evidenceType: 'quantitative',
      intensity: 1
    },
    {
      id: 'evid-2',
      text: "Quelle était l'ampleur de X ?",
      evidenceType: 'quantitative',
      intensity: 2
    },
    {
      id: 'evid-3',
      text: "Quels résultats avez-vous obtenus ?",
      evidenceType: 'quantitative',
      intensity: 3
    },
    {
      id: 'evid-4',
      text: "Comment avez-vous mesuré X ?",
      evidenceType: 'quantitative',
      intensity: 4
    }
  ],
  priority: 2,
  maxAttempts: 3
}
```

---

### Metrics Strategy

**Objectif** : Obtenir des métriques quantitatives.

**Trigger**
- Réponse sans métriques
- Réponse sans chiffres
- Réponse sans mesure
- Réponse sans suivi

**Questions**
- "Comment avez-vous mesuré X ?"
- "Quelles étaient les métriques ?"
- "Quel était l'impact chiffré ?"
- "Comment avez-vous suivi les progrès ?"

**Spécification**
```typescript
interface MetricsStrategy {
  name: 'metrics';
  triggers: MetricsTrigger[];
  questions: MetricsQuestion[];
  priority: number;
  maxAttempts: number;
}

interface MetricsTrigger {
  type: 'no_metrics' | 'no_measurement' | 'no_tracking';
  condition: string;
}

interface MetricsQuestion {
  id: string;
  text: string;
  metricType: MetricType;
  intensity: number;
}

type MetricType = 
  | 'performance'
  | 'quality'
  | 'quantity'
  | 'time'
  | 'cost';
```

**Exemple**
```typescript
{
  name: 'metrics',
  triggers: [
    {
      type: 'no_metrics',
      condition: 'NOT contains_metrics'
    },
    {
      type: 'no_measurement',
      condition: 'NOT contains_measurement'
    }
  ],
  questions: [
    {
      id: 'metric-1',
      text: "Comment avez-vous mesuré X ?",
      metricType: 'performance',
      intensity: 1
    },
    {
      id: 'metric-2',
      text: "Quelles étaient les métriques ?",
      metricType: 'performance',
      intensity: 2
    },
    {
      id: 'metric-3',
      text: "Quel était l'impact chiffré ?",
      metricType: 'quantity',
      intensity: 3
    },
    {
      id: 'metric-4',
      text: "Comment avez-vous suivi les progrès ?",
      metricType: 'time',
      intensity: 4
    }
  ],
  priority: 3,
  maxAttempts: 3
}
```

---

### Ownership Strategy

**Objectif** : Identifier le rôle exact du candidat.

**Trigger**
- Réponse à la première personne du pluriel ("nous")
- Réponse vague sur le rôle
- Réponse sans responsabilité claire
- Réponse sans contribution personnelle

**Questions**
- "Quel était précisément votre rôle ?"
- "Qu'avez-vous fait personnellement ?"
- "Quelle partie avez-vous dirigée ?"
- "Comment avez-vous contribué ?"

**Spécification**
```typescript
interface OwnershipStrategy {
  name: 'ownership';
  triggers: OwnershipTrigger[];
  questions: OwnershipQuestion[];
  priority: number;
  maxAttempts: number;
}

interface OwnershipTrigger {
  type: 'we_instead_of_i' | 'vague_role' | 'no_responsibility' | 'no_contribution';
  condition: string;
}

interface OwnershipQuestion {
  id: string;
  text: string;
  ownershipLevel: OwnershipLevel;
  intensity: number;
}

type OwnershipLevel = 
  | 'individual'
  | 'team'
  | 'leadership'
  | 'collaborative';
```

**Exemple**
```typescript
{
  name: 'ownership',
  triggers: [
    {
      type: 'we_instead_of_i',
      condition: 'contains_we AND NOT contains_i'
    },
    {
      type: 'vague_role',
      condition: 'NOT contains_specific_role'
    }
  ],
  questions: [
    {
      id: 'own-1',
      text: "Quel était précisément votre rôle ?",
      ownershipLevel: 'individual',
      intensity: 1
    },
    {
      id: 'own-2',
      text: "Qu'avez-vous fait personnellement ?",
      ownershipLevel: 'individual',
      intensity: 2
    },
    {
      id: 'own-3',
      text: "Quelle partie avez-vous dirigée ?",
      ownershipLevel: 'leadership',
      intensity: 3
    },
    {
      id: 'own-4',
      text: "Comment avez-vous contribué ?",
      ownershipLevel: 'collaborative',
      intensity: 4
    }
  ],
  priority: 4,
  maxAttempts: 3
}
```

---

### Tradeoffs Strategy

**Objectif** : Identifier les compromis et les décisions.

**Trigger**
- Réponse sans compromis
- Réponse sans contraintes
- Réponse sans arbitrage
- Réponse sans sacrifice

**Questions**
- "Quels étaient les tradeoffs ?"
- "Quelles contraintes avez-vous rencontrées ?"
- "Comment avez-vous arbitré entre X et Y ?"
- "Qu'avez-vous sacrifié ?"

**Spécification**
```typescript
interface TradeoffsStrategy {
  name: 'tradeoffs';
  triggers: TradeoffsTrigger[];
  questions: TradeoffsQuestion[];
  priority: number;
  maxAttempts: number;
}

interface TradeoffsTrigger {
  type: 'no_tradeoffs' | 'no_constraints' | 'no_arbitration' | 'no_sacrifice';
  condition: string;
}

interface TradeoffsQuestion {
  id: string;
  text: string;
  tradeoffType: TradeoffType;
  intensity: number;
}

type TradeoffType = 
  | 'performance_vs_complexity'
  | 'consistency_vs_availability'
  | 'cost_vs_quality'
  | 'speed_vs_accuracy';
```

**Exemple**
```typescript
{
  name: 'tradeoffs',
  triggers: [
    {
      type: 'no_tradeoffs',
      condition: 'NOT contains_tradeoff AND NOT contains_compromis'
    },
    {
      type: 'no_constraints',
      condition: 'NOT contains_constraint'
    }
  ],
  questions: [
    {
      id: 'trade-1',
      text: "Quels étaient les tradeoffs ?",
      tradeoffType: 'performance_vs_complexity',
      intensity: 1
    },
    {
      id: 'trade-2',
      text: "Quelles contraintes avez-vous rencontrées ?",
      tradeoffType: 'cost_vs_quality',
      intensity: 2
    },
    {
      id: 'trade-3',
      text: "Comment avez-vous arbitré entre X et Y ?",
      tradeoffType: 'consistency_vs_availability',
      intensity: 3
    },
    {
      id: 'trade-4',
      text: "Qu'avez-vous sacrifié ?",
      tradeoffType: 'speed_vs_accuracy',
      intensity: 4
    }
  ],
  priority: 5,
  maxAttempts: 3
}
```

---

### Architecture Strategy

**Objectif** : Évaluer les compétences d'architecture.

**Trigger**
- Réponse sans architecture
- Réponse sans justification
- Réponse sans tradeoffs
- Réponse sans évolution

**Questions**
- "Quelle était l'architecture ?"
- "Pourquoi avez-vous choisi X ?"
- "Quels étaient les tradeoffs ?"
- "Comment avez-vous évolué l'architecture ?"

**Spécification**
```typescript
interface ArchitectureStrategy {
  name: 'architecture';
  triggers: ArchitectureTrigger[];
  questions: ArchitectureQuestion[];
  priority: number;
  maxAttempts: number;
}

interface ArchitectureTrigger {
  type: 'no_architecture' | 'no_justification' | 'no_tradeoffs' | 'no_evolution';
  condition: string;
}

interface ArchitectureQuestion {
  id: string;
  text: string;
  architectureType: ArchitectureType;
  intensity: number;
}

type ArchitectureType = 
  | 'monolith'
  | 'microservices'
  | 'serverless'
  | 'event_driven'
  | 'layered';
```

**Exemple**
```typescript
{
  name: 'architecture',
  triggers: [
    {
      type: 'no_architecture',
      condition: 'NOT contains_architecture AND NOT contains_design'
    },
    {
      type: 'no_justification',
      condition: 'NOT contains_because AND NOT contains_why'
    }
  ],
  questions: [
    {
      id: 'arch-1',
      text: "Quelle était l'architecture ?",
      architectureType: 'microservices',
      intensity: 1
    },
    {
      id: 'arch-2',
      text: "Pourquoi avez-vous choisi X ?",
      architectureType: 'microservices',
      intensity: 2
    },
    {
      id: 'arch-3',
      text: "Quels étaient les tradeoffs ?",
      architectureType: 'microservices',
      intensity: 3
    },
    {
      id: 'arch-4',
      text: "Comment avez-vous évolué l'architecture ?",
      architectureType: 'microservices',
      intensity: 4
    }
  ],
  priority: 6,
  maxAttempts: 3
}
```

---

### Failure Strategy

**Objectif** : Identifier les échecs et les leçons apprises.

**Trigger**
- Réponse sans échecs
- Réponse sans leçons
- Réponse sans réflexion
- Réponse sans critique

**Questions**
- "Quels échecs avez-vous rencontrés ?"
- "Qu'avez-vous appris de X ?"
- "Comment auriez-vous fait différemment ?"
- "Quels étaient les points faibles ?"

**Spécification**
```typescript
interface FailureStrategy {
  name: 'failure';
  triggers: FailureTrigger[];
  questions: FailureQuestion[];
  priority: number;
  maxAttempts: number;
}

interface FailureTrigger {
  type: 'no_failures' | 'no_lessons' | 'no_reflection' | 'no_critique';
  condition: string;
}

interface FailureQuestion {
  id: string;
  text: string;
  failureType: FailureType;
  intensity: number;
}

type FailureType = 
  | 'technical'
  | 'process'
  | 'communication'
  | 'decision';
```

**Exemple**
```typescript
{
  name: 'failure',
  triggers: [
    {
      type: 'no_failures',
      condition: 'NOT contains_failure AND NOT contains_error AND NOT contains_problem'
    },
    {
      type: 'no_lessons',
      condition: 'NOT contains_learned AND NOT contains_lesson'
    }
  ],
  questions: [
    {
      id: 'fail-1',
      text: "Quels échecs avez-vous rencontrés ?",
      failureType: 'technical',
      intensity: 1
    },
    {
      id: 'fail-2',
      text: "Qu'avez-vous appris de X ?",
      failureType: 'process',
      intensity: 2
    },
    {
      id: 'fail-3',
      text: "Comment auriez-vous fait différemment ?",
      failureType: 'decision',
      intensity: 3
    },
    {
      id: 'fail-4',
      text: "Quels étaient les points faibles ?",
      failureType: 'communication',
      intensity: 4
    }
  ],
  priority: 7,
  maxAttempts: 3
}
```

---

### STAR Strategy

**Objectif** : Obtenir une réponse structurée STAR (Situation, Task, Action, Result).

**Trigger**
- Réponse non structurée
- Réponse sans contexte
- Réponse sans action
- Réponse sans résultat

**Questions**
- "Quelle était la situation ?"
- "Quelle était votre tâche ?"
- "Quelle action avez-vous prise ?"
- "Quel fut le résultat ?"

**Spécification**
```typescript
interface STARStrategy {
  name: 'star';
  triggers: STARTrigger[];
  questions: STARQuestion[];
  priority: number;
  maxAttempts: number;
}

interface STARTrigger {
  type: 'no_situation' | 'no_task' | 'no_action' | 'no_result';
  condition: string;
}

interface STARQuestion {
  id: string;
  text: string;
  starComponent: STARComponent;
  intensity: number;
}

type STARComponent = 
  | 'situation'
  | 'task'
  | 'action'
  | 'result';
```

**Exemple**
```typescript
{
  name: 'star',
  triggers: [
    {
      type: 'no_situation',
      condition: 'NOT contains_situation AND NOT contains_context'
    },
    {
      type: 'no_task',
      condition: 'NOT contains_task AND NOT contains_objective'
    }
  ],
  questions: [
    {
      id: 'star-1',
      text: "Quelle était la situation ?",
      starComponent: 'situation',
      intensity: 1
    },
    {
      id: 'star-2',
      text: "Quelle était votre tâche ?",
      starComponent: 'task',
      intensity: 2
    },
    {
      id: 'star-3',
      text: "Quelle action avez-vous prise ?",
      starComponent: 'action',
      intensity: 3
    },
    {
      id: 'star-4',
      text: "Quel fut le résultat ?",
      starComponent: 'result',
      intensity: 4
    }
  ],
  priority: 8,
  maxAttempts: 4
}
```

---

### Root Cause Strategy

**Objectif** : Identifier la cause racine d'un problème.

**Trigger**
- Réponse sans cause racine
- Réponse sans investigation
- Réponse sans méthodologie
- Réponse sans profondeur

**Questions**
- "Quelle était la cause racine ?"
- "Comment avez-vous investigué ?"
- "Quelle méthodologie avez-vous utilisée ?"
- "Comment êtes-vous arrivé à cette conclusion ?"

**Spécification**
```typescript
interface RootCauseStrategy {
  name: 'root_cause';
  triggers: RootCauseTrigger[];
  questions: RootCauseQuestion[];
  priority: number;
  maxAttempts: number;
}

interface RootCauseTrigger {
  type: 'no_root_cause' | 'no_investigation' | 'no_methodology' | 'no_depth';
  condition: string;
}

interface RootCauseQuestion {
  id: string;
  text: string;
  investigationMethod: InvestigationMethod;
  intensity: number;
}

type InvestigationMethod = 
  | 'five_whys'
  | 'fishbone'
  | 'pareto'
  | 'timeline';
```

**Exemple**
```typescript
{
  name: 'root_cause',
  triggers: [
    {
      type: 'no_root_cause',
      condition: 'NOT contains_cause AND NOT contains_root'
    },
    {
      type: 'no_investigation',
      condition: 'NOT contains_investigated AND NOT contains_analyzed'
    }
  ],
  questions: [
    {
      id: 'root-1',
      text: "Quelle était la cause racine ?",
      investigationMethod: 'five_whys',
      intensity: 1
    },
    {
      id: 'root-2',
      text: "Comment avez-vous investigué ?",
      investigationMethod: 'fishbone',
      intensity: 2
    },
    {
      id: 'root-3',
      text: "Quelle méthodologie avez-vous utilisée ?",
      investigationMethod: 'pareto',
      intensity: 3
    },
    {
      id: 'root-4',
      text: "Comment êtes-vous arrivé à cette conclusion ?",
      investigationMethod: 'timeline',
      intensity: 4
    }
  ],
  priority: 9,
  maxAttempts: 3
}
```

---

### Leadership Strategy

**Objectif** : Évaluer les compétences de leadership.

**Trigger**
- Réponse sans leadership
- Réponse sans motivation
- Réponse sans gestion de conflits
- Réponse sans développement

**Questions**
- "Comment avez-vous motivé l'équipe ?"
- "Comment avez-vous géré les conflits ?"
- "Comment avez-vous pris des décisions difficiles ?"
- "Comment avez-vous développé les talents ?"

**Spécification**
```typescript
interface LeadershipStrategy {
  name: 'leadership';
  triggers: LeadershipTrigger[];
  questions: LeadershipQuestion[];
  priority: number;
  maxAttempts: number;
}

interface LeadershipTrigger {
  type: 'no_leadership' | 'no_motivation' | 'no_conflict' | 'no_development';
  condition: string;
}

interface LeadershipQuestion {
  id: string;
  text: string;
  leadershipAspect: LeadershipAspect;
  intensity: number;
}

type LeadershipAspect = 
  | 'motivation'
  | 'conflict_resolution'
  | 'decision_making'
  | 'talent_development';
```

**Exemple**
```typescript
{
  name: 'leadership',
  triggers: [
    {
      type: 'no_leadership',
      condition: 'NOT contains_led AND NOT contains_directed AND NOT contains_managed'
    },
    {
      type: 'no_motivation',
      condition: 'NOT contains_motivated AND NOT contains_inspired'
    }
  ],
  questions: [
    {
      id: 'lead-1',
      text: "Comment avez-vous motivé l'équipe ?",
      leadershipAspect: 'motivation',
      intensity: 1
    },
    {
      id: 'lead-2',
      text: "Comment avez-vous géré les conflits ?",
      leadershipAspect: 'conflict_resolution',
      intensity: 2
    },
    {
      id: 'lead-3',
      text: "Comment avez-vous pris des décisions difficiles ?",
      leadershipAspect: 'decision_making',
      intensity: 3
    },
    {
      id: 'lead-4',
      text: "Comment avez-vous développé les talents ?",
      leadershipAspect: 'talent_development',
      intensity: 4
    }
  ],
  priority: 10,
  maxAttempts: 3
}
```

---

### Debugging Strategy

**Objectif** : Évaluer les compétences de debugging.

**Trigger**
- Réponse sans investigation
- Réponse sans outils
- Réponse sans résolution
- Réponse sans apprentissage

**Questions**
- "Comment avez-vous identifié le problème ?"
- "Comment avez-vous investigué ?"
- "Comment avez-vous résolu ?"
- "Qu'avez-vous appris ?"

**Spécification**
```typescript
interface DebuggingStrategy {
  name: 'debugging';
  triggers: DebuggingTrigger[];
  questions: DebuggingQuestion[];
  priority: number;
  maxAttempts: number;
}

interface DebuggingTrigger {
  type: 'no_investigation' | 'no_tools' | 'no_resolution' | 'no_learning';
  condition: string;
}

interface DebuggingQuestion {
  id: string;
  text: string;
  debuggingPhase: DebuggingPhase;
  intensity: number;
}

type DebuggingPhase = 
  | 'identification'
  | 'investigation'
  | 'resolution'
  | 'learning';
```

**Exemple**
```typescript
{
  name: 'debugging',
  triggers: [
    {
      type: 'no_investigation',
      condition: 'NOT contains_investigated AND NOT contains_analyzed'
    },
    {
      type: 'no_tools',
      condition: 'NOT contains_tool AND NOT contains_profiler AND NOT contains_debugger'
    }
  ],
  questions: [
    {
      id: 'debug-1',
      text: "Comment avez-vous identifié le problème ?",
      debuggingPhase: 'identification',
      intensity: 1
    },
    {
      id: 'debug-2',
      text: "Comment avez-vous investigué ?",
      debuggingPhase: 'investigation',
      intensity: 2
    },
    {
      id: 'debug-3',
      text: "Comment avez-vous résolu ?",
      debuggingPhase: 'resolution',
      intensity: 3
    },
    {
      id: 'debug-4',
      text: "Qu'avez-vous appris ?",
      debuggingPhase: 'learning',
      intensity: 4
    }
  ],
  priority: 11,
  maxAttempts: 3
}
```

---

### Incident Strategy

**Objectif** : Évaluer la gestion d'incident de production.

**Trigger**
- Réponse sans incident
- Réponse sans communication
- Réponse sans coordination
- Réponse sans post-mortem

**Questions**
- "Qu'est-ce qui s'est passé ?"
- "Comment avez-vous communiqué ?"
- "Comment avez-vous coordonné ?"
- "Qu'avez-vous appris ?"

**Spécification**
```typescript
interface IncidentStrategy {
  name: 'incident';
  triggers: IncidentTrigger[];
  questions: IncidentQuestion[];
  priority: number;
  maxAttempts: number;
}

interface IncidentTrigger {
  type: 'no_incident' | 'no_communication' | 'no_coordination' | 'no_postmortem';
  condition: string;
}

interface IncidentQuestion {
  id: string;
  text: string;
  incidentPhase: IncidentPhase;
  intensity: number;
}

type IncidentPhase = 
  | 'detection'
  | 'response'
  | 'resolution'
  | 'postmortem';
```

**Exemple**
```typescript
{
  name: 'incident',
  triggers: [
    {
      type: 'no_incident',
      condition: 'NOT contains_incident AND NOT contains_outage AND NOT contains_downtime'
    },
    {
      type: 'no_communication',
      condition: 'NOT contains_communicated AND NOT contains_informed'
    }
  ],
  questions: [
    {
      id: 'incident-1',
      text: "Qu'est-ce qui s'est passé ?",
      incidentPhase: 'detection',
      intensity: 1
    },
    {
      id: 'incident-2',
      text: "Comment avez-vous communiqué ?",
      incidentPhase: 'response',
      intensity: 2
    },
    {
      id: 'incident-3',
      text: "Comment avez-vous coordonné ?",
      incidentPhase: 'resolution',
      intensity: 3
    },
    {
      id: 'incident-4',
      text: "Qu'avez-vous appris ?",
      incidentPhase: 'postmortem',
      intensity: 4
    }
  ],
  priority: 12,
  maxAttempts: 3
}
```

---

## Follow-up Engine

### Follow-up Engine Interface

```typescript
interface FollowupEngine {
  selectStrategy(answer: Answer, question: Question): FollowupStrategy;
  generateFollowup(strategy: FollowupStrategy, context: FollowupContext): Followup;
  evaluateFollowup(followup: Followup, answer: Answer): FollowupEvaluation;
  adaptStrategy(strategy: FollowupStrategy, feedback: FollowupFeedback): FollowupStrategy;
}

interface FollowupContext {
  persona: PersonaType;
  difficulty: number;
  attemptCount: number;
  previousFollowups: Followup[];
}

interface FollowupEvaluation {
  success: boolean;
  improvement: number;
  shouldContinue: boolean;
  nextStrategy?: FollowupStrategy;
}

interface FollowupFeedback {
  effective: boolean;
  improvement: number;
  reason: string;
}
```

---

### Follow-up Selection

```typescript
function selectStrategy(answer: Answer, question: Question): FollowupStrategy {
  // Analyser la réponse
  const analysis = analyzeAnswer(answer);
  
  // Sélectionner la stratégie appropriée
  if (analysis.isVague) {
    return CLARIFICATION_STRATEGY;
  } else if (analysis.noEvidence) {
    return EVIDENCE_STRATEGY;
  } else if (analysis.noMetrics) {
    return METRICS_STRATEGY;
  } else if (analysis.noOwnership) {
    return OWNERSHIP_STRATEGY;
  } else if (analysis.noTradeoffs) {
    return TRADEOFFS_STRATEGY;
  } else if (analysis.noArchitecture) {
    return ARCHITECTURE_STRATEGY;
  } else if (analysis.noFailure) {
    return FAILURE_STRATEGY;
  } else if (analysis.noSTAR) {
    return STAR_STRATEGY;
  } else if (analysis.noRootCause) {
    return ROOT_CAUSE_STRATEGY;
  } else if (analysis.noLeadership) {
    return LEADERSHIP_STRATEGY;
  } else if (analysis.noDebugging) {
    return DEBUGGING_STRATEGY;
  } else if (analysis.noIncident) {
    return INCIDENT_STRATEGY;
  } else {
    return null;
  }
}

interface AnswerAnalysis {
  isVague: boolean;
  noEvidence: boolean;
  noMetrics: boolean;
  noOwnership: boolean;
  noTradeoffs: boolean;
  noArchitecture: boolean;
  noFailure: boolean;
  noSTAR: boolean;
  noRootCause: boolean;
  noLeadership: boolean;
  noDebugging: boolean;
  noIncident: boolean;
}
```

---

### Follow-up Generation

```typescript
function generateFollowup(strategy: FollowupStrategy, context: FollowupContext): Followup {
  // Sélectionner la question appropriée
  const question = selectQuestion(strategy, context);
  
  // Adapter l'intensité
  const intensity = adaptIntensity(question.intensity, context.attemptCount);
  
  // Générer le follow-up
  const followup: Followup = {
    id: generateId(),
    strategy: strategy.name,
    question: question.text,
    intensity,
    attemptCount: context.attemptCount + 1,
    generatedAt: new Date()
  };
  
  return followup;
}

function selectQuestion(strategy: FollowupStrategy, context: FollowupContext): FollowupQuestion {
  // Filtrer les questions par contexte
  const filteredQuestions = strategy.questions.filter(q => {
    if (context.persona && !q.context.includes(context.persona)) return false;
    return true;
  });
  
  // Sélectionner la question avec l'intensité appropriée
  const targetIntensity = Math.min(context.attemptCount + 1, filteredQuestions.length);
  const question = filteredQuestions.find(q => q.intensity === targetIntensity);
  
  return question || filteredQuestions[0];
}

function adaptIntensity(baseIntensity: number, attemptCount: number): number {
  // Augmenter l'intensité avec le nombre de tentatives
  return Math.min(baseIntensity + attemptCount, 10);
}
```

---

### Follow-up Evaluation

```typescript
function evaluateFollowup(followup: Followup, answer: Answer): FollowupEvaluation {
  // Analyser la nouvelle réponse
  const newAnalysis = analyzeAnswer(answer);
  const oldAnalysis = getPreviousAnalysis(followup);
  
  // Calculer l'amélioration
  const improvement = calculateImprovement(oldAnalysis, newAnalysis);
  
  // Déterminer si le follow-up a réussi
  const success = improvement > 0.5;
  
  // Déterminer s'il faut continuer
  const shouldContinue = !success && followup.attemptCount < 3;
  
  // Sélectionner la prochaine stratégie si nécessaire
  const nextStrategy = shouldContinue ? selectNextStrategy(followup, improvement) : null;
  
  return {
    success,
    improvement,
    shouldContinue,
    nextStrategy
  };
}

function calculateImprovement(oldAnalysis: AnswerAnalysis, newAnalysis: AnswerAnalysis): number {
  let improvement = 0;
  
  if (oldAnalysis.isVague && !newAnalysis.isVague) improvement += 0.2;
  if (oldAnalysis.noEvidence && !newAnalysis.noEvidence) improvement += 0.2;
  if (oldAnalysis.noMetrics && !newAnalysis.noMetrics) improvement += 0.2;
  if (oldAnalysis.noOwnership && !newAnalysis.noOwnership) improvement += 0.2;
  if (oldAnalysis.noTradeoffs && !newAnalysis.noTradeoffs) improvement += 0.2;
  
  return Math.min(improvement, 1);
}

function selectNextStrategy(followup: Followup, improvement: number): FollowupStrategy {
  // Si l'amélioration est faible, essayer une stratégie différente
  if (improvement < 0.3) {
    return getNextStrategy(followup.strategy);
  }
  
  // Sinon, continuer avec la même stratégie
  return getStrategy(followup.strategy);
}
```

---

## Conclusion

Le Follow-up Engine spécifie toutes les stratégies de relance avec :

1. **12 stratégies** : Clarification, Evidence, Metrics, Ownership, Tradeoffs, Architecture, Failure, STAR, Root Cause, Leadership, Debugging, Incident
2. **Spécification de chaque stratégie** : name, triggers, questions, priority, maxAttempts
3. **Follow-up Engine Interface** : selectStrategy, generateFollowup, evaluateFollowup, adaptStrategy
4. **Follow-up Selection** : analyse de la réponse, sélection de la stratégie
5. **Follow-up Generation** : sélection de la question, adaptation de l'intensité
6. **Follow-up Evaluation** : calcul de l'amélioration, détermination du succès

Ce document fournit une spécification exécutable pour implémenter le moteur de follow-up.
