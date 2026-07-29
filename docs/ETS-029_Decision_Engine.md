# ETS-029 Decision Engine

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le moteur de décision qui définit comment le recruteur prend des décisions. Il définit tous les arbres de décision pour chaque type de réponse et chaque stratégie.

---

## Arbres de Décision

### Arbre de Décision Principal

```
Question
    ↓
Réponse du Candidat
    ↓
Analyse
    ↓
Evidence ?
    ↓
Oui
    ↓
Preuves solides ?
    ↓
Oui
    ↓
Compétence validée
    ↓
Question suivante
```

```
Question
    ↓
Réponse du Candidat
    ↓
Analyse
    ↓
Evidence ?
    ↓
Non
    ↓
Clarification
    ↓
Toujours flou ?
    ↓
Oui
    ↓
Challenge
    ↓
Toujours flou ?
    ↓
Oui
    ↓
Move Stage
```

---

### Arbre de Décision : Evidence

```
Réponse
    ↓
Contient des chiffres ?
    ↓
Oui
    ↓
Contient des métriques ?
    ↓
Oui
    ↓
Contient des exemples ?
    ↓
Oui
    ↓
Evidence solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des chiffres ?
    ↓
Non
    ↓
Clarification
    ↓
"Combien exactement ?"
    ↓
Réponse améliorée
    ↓
Evidence solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des chiffres ?
    ↓
Non
    ↓
Clarification
    ↓
"Combien exactement ?"
    ↓
Toujours pas de chiffres
    ↓
Challenge
    ↓
"Pourquoi pas de chiffres ?"
    ↓
Réponse améliorée
    ↓
Evidence solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des chiffres ?
    ↓
Non
    ↓
Clarification
    ↓
"Combien exactement ?"
    ↓
Toujours pas de chiffres
    ↓
Challenge
    ↓
"Pourquoi pas de chiffres ?"
    ↓
Toujours pas de chiffres
    ↓
Compétence non validée
    ↓
Move Stage
```

---

### Arbre de Décision : Ownership

```
Réponse
    ↓
Utilise "je" ?
    ↓
Oui
    ↓
Rôle clair ?
    ↓
Oui
    ↓
Ownership solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Utilise "je" ?
    ↓
Non
    ↓
Utilise "nous" ?
    ↓
Oui
    ↓
Clarification
    ↓
"Quel était votre rôle exact ?"
    ↓
Réponse améliorée
    ↓
Ownership solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Utilise "je" ?
    ↓
Non
    ↓
Utilise "nous" ?
    ↓
Oui
    ↓
Clarification
    ↓
"Quel était votre rôle exact ?"
    ↓
Toujours "nous"
    ↓
Challenge
    ↓
"Qu'avez-vous fait personnellement ?"
    ↓
Réponse améliorée
    ↓
Ownership solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Utilise "je" ?
    ↓
Non
    ↓
Utilise "nous" ?
    ↓
Oui
    ↓
Clarification
    ↓
"Quel était votre rôle exact ?"
    ↓
Toujours "nous"
    ↓
Challenge
    ↓
"Qu'avez-vous fait personnellement ?"
    ↓
Toujours "nous"
    ↓
Ownership faible
    ↓
Compétence non validée
    ↓
Move Stage
```

---

### Arbre de Décision : Metrics

```
Réponse
    ↓
Contient des métriques ?
    ↓
Oui
    ↓
Métriques mesurables ?
    ↓
Oui
    ↓
Métriques solides
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des métriques ?
    ↓
Non
    ↓
Clarification
    ↓
"Comment avez-vous mesuré ?"
    ↓
Réponse améliorée
    ↓
Métriques solides
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des métriques ?
    ↓
Non
    ↓
Clarification
    ↓
"Comment avez-vous mesuré ?"
    ↓
Toujours pas de métriques
    ↓
Challenge
    ↓
"Pourquoi pas de métriques ?"
    ↓
Réponse améliorée
    ↓
Métriques solides
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des métriques ?
    ↓
Non
    ↓
Clarification
    ↓
"Comment avez-vous mesuré ?"
    ↓
Toujours pas de métriques
    ↓
Challenge
    ↓
"Pourquoi pas de métriques ?"
    ↓
Toujours pas de métriques
    ↓
Métriques faibles
    ↓
Compétence non validée
    ↓
Move Stage
```

---

### Arbre de Décision : Tradeoffs

```
Réponse
    ↓
Contient des tradeoffs ?
    ↓
Oui
    ↓
Tradeoffs justifiés ?
    ↓
Oui
    ↓
Tradeoffs solides
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des tradeoffs ?
    ↓
Non
    ↓
Clarification
    ↓
"Quels étaient les tradeoffs ?"
    ↓
Réponse améliorée
    ↓
Tradeoffs solides
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des tradeoffs ?
    ↓
Non
    ↓
Clarification
    ↓
"Quels étaient les tradeoffs ?"
    ↓
Toujours pas de tradeoffs
    ↓
Challenge
    ↓
"Pourquoi pas de tradeoffs ?"
    ↓
Réponse améliorée
    ↓
Tradeoffs solides
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des tradeoffs ?
    ↓
Non
    ↓
Clarification
    ↓
"Quels étaient les tradeoffs ?"
    ↓
Toujours pas de tradeoffs
    ↓
Challenge
    ↓
"Pourquoi pas de tradeoffs ?"
    ↓
Toujours pas de tradeoffs
    ↓
Tradeoffs faibles
    ↓
Compétence non validée
    ↓
Move Stage
```

---

### Arbre de Décision : Failure

```
Réponse
    ↓
Contient des échecs ?
    ↓
Oui
    ↓
Leçons apprises ?
    ↓
Oui
    ↓
Failure solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des échecs ?
    ↓
Non
    ↓
Clarification
    ↓
"Quels échecs avez-vous rencontrés ?"
    ↓
Réponse améliorée
    ↓
Failure solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des échecs ?
    ↓
Non
    ↓
Clarification
    ↓
"Quels échecs avez-vous rencontrés ?"
    ↓
Toujours pas d'échecs
    ↓
Challenge
    ↓
"Pourquoi pas d'échecs ?"
    ↓
Réponse améliorée
    ↓
Failure solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des échecs ?
    ↓
Non
    ↓
Clarification
    ↓
"Quels échecs avez-vous rencontrés ?"
    ↓
Toujours pas d'échecs
    ↓
Challenge
    ↓
"Pourquoi pas d'échecs ?"
    ↓
Toujours pas d'échecs
    ↓
Failure faible
    ↓
Compétence non validée
    ↓
Move Stage
```

---

### Arbre de Décision : Leadership

```
Réponse
    ↓
Contient des exemples de leadership ?
    ↓
Oui
    ↓
Leadership clair ?
    ↓
Oui
    ↓
Leadership solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des exemples de leadership ?
    ↓
Non
    ↓
Clarification
    ↓
"Comment avez-vous dirigé l'équipe ?"
    ↓
Réponse améliorée
    ↓
Leadership solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des exemples de leadership ?
    ↓
Non
    ↓
Clarification
    ↓
"Comment avez-vous dirigé l'équipe ?"
    ↓
Toujours pas d'exemples
    ↓
Challenge
    ↓
"Qu'avez-vous fait en tant que leader ?"
    ↓
Réponse améliorée
    ↓
Leadership solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient des exemples de leadership ?
    ↓
Non
    ↓
Clarification
    ↓
"Comment avez-vous dirigé l'équipe ?"
    ↓
Toujours pas d'exemples
    ↓
Challenge
    ↓
"Qu'avez-vous fait en tant que leader ?"
    ↓
Toujours pas d'exemples
    ↓
Leadership faible
    ↓
Compétence non validée
    ↓
Move Stage
```

---

### Arbre de Décision : Architecture

```
Réponse
    ↓
Contient une description d'architecture ?
    ↓
Oui
    ↓
Architecture justifiée ?
    ↓
Oui
    ↓
Architecture solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient une description d'architecture ?
    ↓
Non
    ↓
Clarification
    ↓
"Quelle était l'architecture ?"
    ↓
Réponse améliorée
    ↓
Architecture solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient une description d'architecture ?
    ↓
Non
    ↓
Clarification
    ↓
"Quelle était l'architecture ?"
    ↓
Toujours pas d'architecture
    ↓
Challenge
    ↓
"Pourquoi pas d'architecture ?"
    ↓
Réponse améliorée
    ↓
Architecture solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient une description d'architecture ?
    ↓
Non
    ↓
Clarification
    ↓
"Quelle était l'architecture ?"
    ↓
Toujours pas d'architecture
    ↓
Challenge
    ↓
"Pourquoi pas d'architecture ?"
    ↓
Toujours pas d'architecture
    ↓
Architecture faible
    ↓
Compétence non validée
    ↓
Move Stage
```

---

### Arbre de Décision : Debugging

```
Réponse
    ↓
Contient une méthodologie de debugging ?
    ↓
Oui
    ↓
Méthodologie claire ?
    ↓
Oui
    ↓
Debugging solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient une méthodologie de debugging ?
    ↓
Non
    ↓
Clarification
    ↓
"Comment avez-vous identifié le problème ?"
    ↓
Réponse améliorée
    ↓
Debugging solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient une méthodologie de debugging ?
    ↓
Non
    ↓
Clarification
    ↓
"Comment avez-vous identifié le problème ?"
    ↓
Toujours pas de méthodologie
    ↓
Challenge
    ↓
"Quelle était votre approche ?"
    ↓
Réponse améliorée
    ↓
Debugging solide
    ↓
Compétence validée
```

```
Réponse
    ↓
Contient une méthodologie de debugging ?
    ↓
Non
    ↓
Clarification
    ↓
"Comment avez-vous identifié le problème ?"
    ↓
Toujours pas de méthodologie
    ↓
Challenge
    ↓
"Quelle était votre approche ?"
    ↓
Toujours pas de méthodologie
    ↓
Debugging faible
    ↓
Compétence non validée
    ↓
Move Stage
```

---

### Arbre de Décision : Réponse Excellente

```
Réponse excellente
    ↓
Augmenter la difficulté
    ↓
Compétence : Architecture
    ↓
Question : "Quelle était l'architecture ?"
    ↓
Réponse excellente
    ↓
Compétence : Leadership
    ↓
Question : "Comment avez-vous dirigé l'équipe ?"
    ↓
Réponse excellente
    ↓
Compétence : Tradeoffs
    ↓
Question : "Quels étaient les tradeoffs ?"
```

---

### Arbre de Décision : Réponse Moyenne

```
Réponse moyenne
    ↓
Clarifier
    ↓
Relance : "Pouvez-vous préciser ?"
    ↓
Réponse améliorée
    ↓
Continuer
    ↓
Réponse toujours moyenne
    ↓
Passer à autre chose
    ↓
Compétence partiellement validée
```

---

### Arbre de Décision : Réponse Faible

```
Réponse faible
    ↓
Challenge
    ↓
Relance : "Pourquoi ?"
    ↓
Réponse améliorée
    ↓
Continuer
    ↓
Réponse toujours faible
    ↓
Passer à autre chose
    ↓
Compétence non validée
```

---

### Arbre de Décision : Évitement

```
Évitement détecté
    ↓
Clarifier
    ↓
Relance : "Pouvez-vous répondre à la question ?"
    ↓
Réponse toujours évasive
    ↓
Challenge
    ↓
Relance : "Pourquoi évitez-vous cette question ?"
    ↓
Réponse toujours évasive
    ↓
Compétence non validée
    ↓
Noter l'évitement
```

---

## Spécification du Moteur de Décision

### Decision Engine

```typescript
interface DecisionEngine {
  makeDecision(state: InterviewRuntimeState): Decision;
  evaluateAnswer(answer: Answer, question: Question): AnswerEvaluation;
  selectRelance(evaluation: AnswerEvaluation): RelanceType;
  selectNextCompetency(state: InterviewRuntimeState): CompetencyType;
  shouldTransitionStage(state: InterviewRuntimeState): boolean;
  selectNextStage(state: InterviewRuntimeState): StageType;
}
```

### Decision

```typescript
interface Decision {
  id: string;
  type: DecisionType;
  action: ActionType;
  competency?: CompetencyType;
  stage?: StageType;
  relanceType?: RelanceType;
  reason: string;
  confidence: number;
  at: Date;
}

type DecisionType = 
  | 'continue'
  | 'relance'
  | 'transition'
  | 'adapt'
  | 'complete';

type ActionType = 
  | 'clarification'
  | 'evidence'
  | 'challenge'
  | 'ownership'
  | 'metrics'
  | 'tradeoffs'
  | 'failure'
  | 'next_question'
  | 'next_stage'
  | 'end';
```

### Answer Evaluation

```typescript
interface AnswerEvaluation {
  answerId: string;
  questionId: string;
  competency: CompetencyType;
  score: number;
  confidence: number;
  evidence: Evidence[];
  signals: Signal[];
  quality: AnswerQuality;
  needsRelance: boolean;
  relanceType?: RelanceType;
}

type AnswerQuality = 
  | 'excellent'
  | 'good'
  | 'average'
  | 'poor'
  | 'evasive';
```

### Decision Rules

```typescript
interface DecisionRule {
  id: string;
  name: string;
  condition: DecisionCondition;
  action: DecisionAction;
  priority: number;
}

interface DecisionCondition {
  type: 'signal' | 'score' | 'pattern' | 'context';
  rules: ConditionRule[];
}

interface ConditionRule {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'not_contains';
  value: any;
}

interface DecisionAction {
  type: ActionType;
  parameters?: Record<string, any>;
}
```

### Decision Tree

```typescript
interface DecisionTree {
  id: string;
  name: string;
  rootNode: DecisionNode;
}

interface DecisionNode {
  id: string;
  condition?: DecisionCondition;
  trueNode?: DecisionNode;
  falseNode?: DecisionNode;
  action?: DecisionAction;
}
```

---

## Stratégies de Décision

### Evidence Strategy

```typescript
interface EvidenceStrategy {
  name: 'evidence';
  rules: DecisionRule[];
  tree: DecisionTree;
}

const EVIDENCE_STRATEGY: EvidenceStrategy = {
  name: 'evidence',
  rules: [
    {
      id: 'evidence-1',
      name: 'Check for numbers',
      condition: {
        type: 'signal',
        rules: [
          { field: 'signals', operator: 'contains', value: 'evidence' }
        ]
      },
      action: { type: 'next_question' },
      priority: 1
    },
    {
      id: 'evidence-2',
      name: 'Clarify if no numbers',
      condition: {
        type: 'signal',
        rules: [
          { field: 'signals', operator: 'not_contains', value: 'evidence' }
        ]
      },
      action: { type: 'clarification' },
      priority: 2
    }
  ],
  tree: {
    id: 'evidence-tree',
    name: 'Evidence Decision Tree',
    rootNode: {
      id: 'root',
      condition: {
        type: 'signal',
        rules: [
          { field: 'signals', operator: 'contains', value: 'evidence' }
        ]
      },
      trueNode: {
        id: 'has-evidence',
        action: { type: 'next_question' }
      },
      falseNode: {
        id: 'no-evidence',
        action: { type: 'clarification' }
      }
    }
  }
};
```

### Ownership Strategy

```typescript
interface OwnershipStrategy {
  name: 'ownership';
  rules: DecisionRule[];
  tree: DecisionTree;
}

const OWNERSHIP_STRATEGY: OwnershipStrategy = {
  name: 'ownership',
  rules: [
    {
      id: 'ownership-1',
      name: 'Check for "je"',
      condition: {
        type: 'signal',
        rules: [
          { field: 'signals', operator: 'contains', value: 'ownership' }
        ]
      },
      action: { type: 'next_question' },
      priority: 1
    },
    {
      id: 'ownership-2',
      name: 'Clarify if "nous"',
      condition: {
        type: 'signal',
        rules: [
          { field: 'signals', operator: 'not_contains', value: 'ownership' }
        ]
      },
      action: { type: 'ownership' },
      priority: 2
    }
  ],
  tree: {
    id: 'ownership-tree',
    name: 'Ownership Decision Tree',
    rootNode: {
      id: 'root',
      condition: {
        type: 'signal',
        rules: [
          { field: 'signals', operator: 'contains', value: 'ownership' }
        ]
      },
      trueNode: {
        id: 'has-ownership',
        action: { type: 'next_question' }
      },
      falseNode: {
        id: 'no-ownership',
        action: { type: 'ownership' }
      }
    }
  }
};
```

### Metrics Strategy

```typescript
interface MetricsStrategy {
  name: 'metrics';
  rules: DecisionRule[];
  tree: DecisionTree;
}

const METRICS_STRATEGY: MetricsStrategy = {
  name: 'metrics',
  rules: [
    {
      id: 'metrics-1',
      name: 'Check for metrics',
      condition: {
        type: 'signal',
        rules: [
          { field: 'signals', operator: 'contains', value: 'metrics' }
        ]
      },
      action: { type: 'next_question' },
      priority: 1
    },
    {
      id: 'metrics-2',
      name: 'Clarify if no metrics',
      condition: {
        type: 'signal',
        rules: [
          { field: 'signals', operator: 'not_contains', value: 'metrics' }
        ]
      },
      action: { type: 'metrics' },
      priority: 2
    }
  ],
  tree: {
    id: 'metrics-tree',
    name: 'Metrics Decision Tree',
    rootNode: {
      id: 'root',
      condition: {
        type: 'signal',
        rules: [
          { field: 'signals', operator: 'contains', value: 'metrics' }
        ]
      },
      trueNode: {
        id: 'has-metrics',
        action: { type: 'next_question' }
      },
      falseNode: {
        id: 'no-metrics',
        action: { type: 'metrics' }
      }
    }
  }
};
```

---

## Adaptation de la Difficulté

### Difficulty Adaptation

```typescript
interface DifficultyAdaptation {
  strategy: DifficultyAdaptationStrategy;
  rules: DifficultyAdaptationRule[];
}

type DifficultyAdaptationStrategy = 
  | 'increase'
  | 'decrease'
  | 'maintain';

interface DifficultyAdaptationRule {
  id: string;
  condition: DecisionCondition;
  adaptation: DifficultyAdaptation;
  priority: number;
}

interface DifficultyAdaptation {
  axis: DifficultyAxis;
  oldValue: number;
  newValue: number;
  reason: string;
}
```

### Difficulty Adaptation Rules

```typescript
const DIFFICULTY_ADAPTATION_RULES: DifficultyAdaptationRule[] = [
  {
    id: 'diff-adapt-1',
    name: 'Increase difficulty on excellent answer',
    condition: {
      type: 'score',
      rules: [
        { field: 'score', operator: 'gte', value: 80 }
      ]
    },
    adaptation: {
      axis: 'questionComplexity',
      oldValue: 0,
      newValue: 0,
      reason: 'Excellent answer, increase difficulty'
    },
    priority: 1
  },
  {
    id: 'diff-adapt-2',
    name: 'Decrease difficulty on poor answer',
    condition: {
      type: 'score',
      rules: [
        { field: 'score', operator: 'lte', value: 40 }
      ]
    },
    adaptation: {
      axis: 'questionComplexity',
      oldValue: 0,
      newValue: 0,
      reason: 'Poor answer, decrease difficulty'
    },
    priority: 2
  }
];
```

---

## Conclusion

Le Decision Engine spécifie comment le recruteur prend des décisions avec :

1. **Arbres de décision** : Evidence, Ownership, Metrics, Tradeoffs, Failure, Leadership, Architecture, Debugging, Réponse Excellente, Réponse Moyenne, Réponse Faible, Évitement
2. **Spécification du moteur** : Decision Engine, Decision, Answer Evaluation, Decision Rules, Decision Tree
3. **Stratégies de décision** : Evidence Strategy, Ownership Strategy, Metrics Strategy
4. **Adaptation de la difficulté** : Difficulty Adaptation, Difficulty Adaptation Rules

Ce document fournit une spécification exécutable pour implémenter le moteur de décision.
