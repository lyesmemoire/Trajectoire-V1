# ETS-035 Adaptive Difficulty

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le système de difficulté adaptative qui ajuste dynamiquement la difficulté de l'entretien en fonction des réponses du candidat. Au lieu d'un simple score (ex: difficulty=4), le système ajuste indépendamment plusieurs axes : Question Complexity, Ambiguity, Interruptions, Time Pressure, Challenge, Hints, Silence.

---

## Axes de Difficulté

### Difficulty Axes

```typescript
interface DifficultyAxes {
  questionComplexity: number; // 1-10
  ambiguity: number; // 1-10
  interruptions: number; // 1-10
  timePressure: number; // 1-10
  challenge: number; // 1-10
  hints: number; // 1-10 (inversé: plus haut = moins d'aide)
  silence: number; // 1-10
}
```

---

### Question Complexity

**Description** : Complexité des questions posées.

**Niveaux**
- 1-3 : Questions simples, directes, un seul concept
- 4-6 : Questions modérées, plusieurs concepts, quelques nuances
- 7-8 : Questions complexes, multiples concepts, tradeoffs
- 9-10 : Questions très complexes, architecture, system design

**Adaptation**
- Augmenter si : Réponse excellente, candidat confiant
- Diminuer si : Réponse faible, candidat stressé

**Exemple**
```typescript
interface QuestionComplexity {
  level: number;
  concepts: string[];
  depth: number;
  breadth: number;
  abstraction: number;
}
```

---

### Ambiguity

**Description** : Niveau d'ambiguïté dans les questions.

**Niveaux**
- 1-3 : Questions très précises, sans ambiguïté
- 4-6 : Questions modérément précises, quelques ambiguïtés
- 7-8 : Questions ambiguës, nécessitent clarification
- 9-10 : Questions très ambiguës, ouvertes à l'interprétation

**Adaptation**
- Augmenter si : Candidat excellent à clarifier
- Diminuer si : Candidat a du mal avec l'ambiguïté

**Exemple**
```typescript
interface Ambiguity {
  level: number;
  precision: number;
  openness: number;
  interpretation: number;
}
```

---

### Interruptions

**Description** : Fréquence des interruptions du recruteur.

**Niveaux**
- 1-3 : Interruptions rares, laisse le candidat s'exprimer
- 4-6 : Interruptions modérées, quelques clarifications
- 7-8 : Interruptions fréquentes, beaucoup de challenges
- 9-10 : Interruptions très fréquentes, pression constante

**Adaptation**
- Augmenter si : Candidat excellent, peut gérer la pression
- Diminuer si : Candidat stressé, a du mal avec les interruptions

**Exemple**
```typescript
interface Interruptions {
  level: number;
  frequency: number;
  timing: number;
  type: InterruptionType;
}

type InterruptionType = 
  | 'clarification'
  | 'challenge'
  | 'redirect'
  | 'pressure';
```

---

### Time Pressure

**Description** : Pression temporelle sur les réponses.

**Niveaux**
- 1-3 : Pas de pression, temps illimité
- 4-6 : Pression modérée, temps raisonnable
- 7-8 : Pression élevée, temps limité
- 9-10 : Pression très élevée, temps très limité

**Adaptation**
- Augmenter si : Candidat excellent sous pression
- Diminuer si : Candidat stressé par le temps

**Exemple**
```typescript
interface TimePressure {
  level: number;
  maxResponseTime: number;
  warningTime: number;
  strictness: number;
}
```

---

### Challenge

**Description** : Niveau de challenge dans les questions.

**Niveaux**
- 1-3 : Challenge faible, questions faciles
- 4-6 : Challenge modéré, questions normales
- 7-8 : Challenge élevé, questions difficiles
- 9-10 : Challenge très élevé, questions très difficiles

**Adaptation**
- Augmenter si : Candidat excellent, aime le challenge
- Diminuer si : Candidat a du mal avec le challenge

**Exemple**
```typescript
interface Challenge {
  level: number;
  intensity: number;
  frequency: number;
  type: ChallengeType;
}

type ChallengeType = 
  | 'technical'
  | 'behavioral'
  | 'logical'
  | 'creative';
```

---

### Hints

**Description** : Niveau d'aide fournie au candidat.

**Niveaux**
- 1-3 : Beaucoup d'aide, hints fréquents
- 4-6 : Aide modérée, quelques hints
- 7-8 : Peu d'aide, hints rares
- 9-10 : Pas d'aide, aucun hint

**Adaptation**
- Augmenter (diminuer l'aide) si : Candidat excellent
- Diminuer (augmenter l'aide) si : Candidat a besoin d'aide

**Exemple**
```typescript
interface Hints {
  level: number;
  frequency: number;
  specificity: number;
  timing: number;
}
```

---

### Silence

**Description** : Durée du silence avant les relances.

**Niveaux**
- 1-3 : Silence court (1-2 secondes)
- 4-6 : Silence moyen (2-3 secondes)
- 7-8 : Silence long (3-5 secondes)
- 9-10 : Silence très long (5+ secondes)

**Adaptation**
- Augmenter si : Candidat excellent, peut gérer le silence
- Diminuer si : Candidat stressé par le silence

**Exemple**
```typescript
interface Silence {
  level: number;
  duration: number;
  tolerance: number;
  purpose: SilencePurpose;
}

type SilencePurpose = 
  | 'reflection'
  | 'pressure'
  | 'observation'
  | 'evaluation';
```

---

## Spécification du Système

### Adaptive Difficulty System

```typescript
interface AdaptiveDifficultySystem {
  currentAxes: DifficultyAxes;
  targetAxes: DifficultyAxes;
  adaptationRules: AdaptationRule[];
  adaptationHistory: AdaptationHistory[];
  updateFromAnswer(answer: Answer, question: Question): void;
  updateFromEvaluation(evaluation: Evaluation): void;
  updateFromStress(stress: StressProfile): void;
  updateFromConfidence(confidence: ConfidenceProfile): void;
  adaptAxis(axis: keyof DifficultyAxes, delta: number): void;
  reset(): void;
}
```

---

### Adaptation Rules

```typescript
interface AdaptationRule {
  id: string;
  axis: keyof DifficultyAxes;
  trigger: AdaptationTrigger;
  action: AdaptationAction;
  priority: number;
  cooldown: number;
}

interface AdaptationTrigger {
  type: TriggerType;
  condition: string;
  threshold?: number;
}

type TriggerType = 
  | 'answer_quality'
  | 'answer_speed'
  | 'stress_level'
  | 'confidence_level'
  | 'competency_score'
  | 'relance_count';

interface AdaptationAction {
  type: 'increase' | 'decrease' | 'maintain';
  delta: number;
  min?: number;
  max?: number;
}
```

---

### Adaptation Rules Examples

```typescript
const ADAPTATION_RULES: AdaptationRule[] = [
  // Question Complexity
  {
    id: 'rule-1',
    axis: 'questionComplexity',
    trigger: {
      type: 'answer_quality',
      condition: 'score >= 80',
      threshold: 80
    },
    action: {
      type: 'increase',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 1,
    cooldown: 3
  },
  {
    id: 'rule-2',
    axis: 'questionComplexity',
    trigger: {
      type: 'answer_quality',
      condition: 'score <= 40',
      threshold: 40
    },
    action: {
      type: 'decrease',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 1,
    cooldown: 3
  },
  
  // Ambiguity
  {
    id: 'rule-3',
    axis: 'ambiguity',
    trigger: {
      type: 'answer_quality',
      condition: 'score >= 80 AND contains_clarification',
      threshold: 80
    },
    action: {
      type: 'increase',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 2,
    cooldown: 3
  },
  {
    id: 'rule-4',
    axis: 'ambiguity',
    trigger: {
      type: 'answer_quality',
      condition: 'score <= 40 AND contains_confusion',
      threshold: 40
    },
    action: {
      type: 'decrease',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 2,
    cooldown: 3
  },
  
  // Interruptions
  {
    id: 'rule-5',
    axis: 'interruptions',
    trigger: {
      type: 'confidence_level',
      condition: 'confidence >= 0.8',
      threshold: 0.8
    },
    action: {
      type: 'increase',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 3,
    cooldown: 5
  },
  {
    id: 'rule-6',
    axis: 'interruptions',
    trigger: {
      type: 'stress_level',
      condition: 'stress >= 0.7',
      threshold: 0.7
    },
    action: {
      type: 'decrease',
      delta: 2,
      min: 1,
      max: 10
    },
    priority: 3,
    cooldown: 2
  },
  
  // Time Pressure
  {
    id: 'rule-7',
    axis: 'timePressure',
    trigger: {
      type: 'answer_speed',
      condition: 'speed >= 0.8',
      threshold: 0.8
    },
    action: {
      type: 'increase',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 4,
    cooldown: 3
  },
  {
    id: 'rule-8',
    axis: 'timePressure',
    trigger: {
      type: 'stress_level',
      condition: 'stress >= 0.7',
      threshold: 0.7
    },
    action: {
      type: 'decrease',
      delta: 2,
      min: 1,
      max: 10
    },
    priority: 4,
    cooldown: 2
  },
  
  // Challenge
  {
    id: 'rule-9',
    axis: 'challenge',
    trigger: {
      type: 'answer_quality',
      condition: 'score >= 80',
      threshold: 80
    },
    action: {
      type: 'increase',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 5,
    cooldown: 3
  },
  {
    id: 'rule-10',
    axis: 'challenge',
    trigger: {
      type: 'answer_quality',
      condition: 'score <= 40',
      threshold: 40
    },
    action: {
      type: 'decrease',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 5,
    cooldown: 3
  },
  
  // Hints
  {
    id: 'rule-11',
    axis: 'hints',
    trigger: {
      type: 'answer_quality',
      condition: 'score >= 80',
      threshold: 80
    },
    action: {
      type: 'increase',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 6,
    cooldown: 3
  },
  {
    id: 'rule-12',
    axis: 'hints',
    trigger: {
      type: 'answer_quality',
      condition: 'score <= 40',
      threshold: 40
    },
    action: {
      type: 'decrease',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 6,
    cooldown: 3
  },
  
  // Silence
  {
    id: 'rule-13',
    axis: 'silence',
    trigger: {
      type: 'confidence_level',
      condition: 'confidence >= 0.8',
      threshold: 0.8
    },
    action: {
      type: 'increase',
      delta: 1,
      min: 1,
      max: 10
    },
    priority: 7,
    cooldown: 3
  },
  {
    id: 'rule-14',
    axis: 'silence',
    trigger: {
      type: 'stress_level',
      condition: 'stress >= 0.7',
      threshold: 0.7
    },
    action: {
      type: 'decrease',
      delta: 2,
      min: 1,
      max: 10
    },
    priority: 7,
    cooldown: 2
  }
];
```

---

### Adaptive Difficulty Implementation

```typescript
class AdaptiveDifficultySystemImpl implements AdaptiveDifficultySystem {
  private cooldowns: Map<string, number> = new Map();
  
  constructor(
    public currentAxes: DifficultyAxes,
    public targetAxes: DifficultyAxes,
    public adaptationRules: AdaptationRule[],
    public adaptationHistory: AdaptationHistory[]
  ) {}

  updateFromAnswer(answer: Answer, question: Question): void {
    // Calculer le score de la réponse
    const score = calculateAnswerScore(answer);
    
    // Appliquer les règles d'adaptation
    this.applyRules('answer_quality', score);
  }

  updateFromEvaluation(evaluation: Evaluation): void {
    // Calculer le score global
    const score = evaluation.overallScore;
    
    // Appliquer les règles d'adaptation
    this.applyRules('competency_score', score);
  }

  updateFromStress(stress: StressProfile): void {
    // Appliquer les règles d'adaptation
    this.applyRules('stress_level', stress.overall);
  }

  updateFromConfidence(confidence: ConfidenceProfile): void {
    // Appliquer les règles d'adaptation
    this.applyRules('confidence_level', confidence.overall);
  }

  applyRules(triggerType: TriggerType, value: number): void {
    // Filtrer les règles applicables
    const applicableRules = this.adaptationRules.filter(rule => {
      if (rule.trigger.type !== triggerType) return false;
      
      // Vérifier le cooldown
      const lastApplied = this.cooldowns.get(rule.id);
      if (lastApplied && Date.now() - lastApplied < rule.cooldown * 1000) {
        return false;
      }
      
      // Vérifier la condition
      return this.evaluateCondition(rule.trigger.condition, value);
    });
    
    // Trier par priorité
    applicableRules.sort((a, b) => a.priority - b.priority);
    
    // Appliquer les règles
    applicableRules.forEach(rule => {
      this.applyRule(rule);
      this.cooldowns.set(rule.id, Date.now());
    });
  }

  evaluateCondition(condition: string, value: number): boolean {
    // Parser la condition
    const parts = condition.split(' ');
    const operator = parts[1];
    const threshold = parseFloat(parts[2]);
    
    switch (operator) {
      case '>=':
        return value >= threshold;
      case '<=':
        return value <= threshold;
      case '>':
        return value > threshold;
      case '<':
        return value < threshold;
      case '==':
        return value === threshold;
      default:
        return false;
    }
  }

  applyRule(rule: AdaptationRule): void {
    const currentValue = this.currentAxes[rule.axis];
    let newValue = currentValue;
    
    switch (rule.action.type) {
      case 'increase':
        newValue = currentValue + rule.action.delta;
        break;
      case 'decrease':
        newValue = currentValue - rule.action.delta;
        break;
      case 'maintain':
        newValue = currentValue;
        break;
    }
    
    // Appliquer les limites
    if (rule.action.min !== undefined) {
      newValue = Math.max(newValue, rule.action.min);
    }
    if (rule.action.max !== undefined) {
      newValue = Math.min(newValue, rule.action.max);
    }
    
    // Mettre à jour l'axe
    this.adaptAxis(rule.axis, newValue - currentValue);
  }

  adaptAxis(axis: keyof DifficultyAxes, delta: number): void {
    const oldValue = this.currentAxes[axis];
    const newValue = Math.max(1, Math.min(10, oldValue + delta));
    
    this.currentAxes[axis] = newValue;
    
    // Enregistrer l'historique
    this.adaptationHistory.push({
      axis,
      oldValue,
      newValue,
      delta,
      timestamp: new Date()
    });
  }

  reset(): void {
    this.currentAxes = {
      questionComplexity: 5,
      ambiguity: 5,
      interruptions: 5,
      timePressure: 5,
      challenge: 5,
      hints: 5,
      silence: 5
    };
    this.targetAxes = { ...this.currentAxes };
    this.adaptationHistory = [];
    this.cooldowns.clear();
  }
}

interface AdaptationHistory {
  axis: keyof DifficultyAxes;
  oldValue: number;
  newValue: number;
  delta: number;
  timestamp: Date;
}

function calculateAnswerScore(answer: Answer): number {
  // Calculer le score de la réponse
  let score = 50;
  
  answer.signals.forEach(signal => {
    if (signal.type === 'evidence') score += signal.strength * 10;
    if (signal.type === 'confident') score += signal.strength * 5;
    if (signal.type === 'stressed') score -= signal.strength * 10;
  });
  
  return Math.max(0, Math.min(100, score));
}
```

---

## Configuration par Scénario

### Scenario Difficulty Configuration

```typescript
interface ScenarioDifficultyConfig {
  scenario: ScenarioType;
  initialAxes: DifficultyAxes;
  adaptationRules: AdaptationRule[];
  constraints: DifficultyConstraints;
}

interface DifficultyConstraints {
  minQuestionComplexity: number;
  maxQuestionComplexity: number;
  minAmbiguity: number;
  maxAmbiguity: number;
  minInterruptions: number;
  maxInterruptions: number;
  minTimePressure: number;
  maxTimePressure: number;
  minChallenge: number;
  maxChallenge: number;
  minHints: number;
  maxHints: number;
  minSilence: number;
  maxSilence: number;
}

const SCENARIO_DIFFICULTY_CONFIGS: ScenarioDifficultyConfig[] = [
  {
    scenario: 'junior_backend',
    initialAxes: {
      questionComplexity: 3,
      ambiguity: 3,
      interruptions: 3,
      timePressure: 3,
      challenge: 3,
      hints: 7,
      silence: 3
    },
    adaptationRules: ADAPTATION_RULES,
    constraints: {
      minQuestionComplexity: 1,
      maxQuestionComplexity: 6,
      minAmbiguity: 1,
      maxAmbiguity: 6,
      minInterruptions: 1,
      maxInterruptions: 6,
      minTimePressure: 1,
      maxTimePressure: 6,
      minChallenge: 1,
      maxChallenge: 6,
      minHints: 5,
      maxHints: 10,
      minSilence: 1,
      maxSilence: 6
    }
  },
  {
    scenario: 'senior_backend',
    initialAxes: {
      questionComplexity: 6,
      ambiguity: 5,
      interruptions: 5,
      timePressure: 5,
      challenge: 6,
      hints: 5,
      silence: 5
    },
    adaptationRules: ADAPTATION_RULES,
    constraints: {
      minQuestionComplexity: 3,
      maxQuestionComplexity: 9,
      minAmbiguity: 3,
      maxAmbiguity: 9,
      minInterruptions: 3,
      maxInterruptions: 9,
      minTimePressure: 3,
      maxTimePressure: 9,
      minChallenge: 3,
      maxChallenge: 9,
      minHints: 3,
      maxHints: 8,
      minSilence: 3,
      maxSilence: 9
    }
  },
  {
    scenario: 'principal_engineer',
    initialAxes: {
      questionComplexity: 8,
      ambiguity: 7,
      interruptions: 7,
      timePressure: 7,
      challenge: 8,
      hints: 3,
      silence: 7
    },
    adaptationRules: ADAPTATION_RULES,
    constraints: {
      minQuestionComplexity: 5,
      maxQuestionComplexity: 10,
      minAmbiguity: 5,
      maxAmbiguity: 10,
      minInterruptions: 5,
      maxInterruptions: 10,
      minTimePressure: 5,
      maxTimePressure: 10,
      minChallenge: 5,
      maxChallenge: 10,
      minHints: 1,
      maxHints: 6,
      minSilence: 5,
      maxSilence: 10
    }
  }
];
```

---

## Monitoring

### Difficulty Metrics

```typescript
interface DifficultyMetrics {
  currentAxes: DifficultyAxes;
  targetAxes: DifficultyAxes;
  adaptationCount: number;
  adaptationRate: number;
  axisStability: Map<keyof DifficultyAxes, number>;
  adaptationHistory: AdaptationHistory[];
}

function calculateDifficultyMetrics(system: AdaptiveDifficultySystem): DifficultyMetrics {
  const currentAxes = system.currentAxes;
  const targetAxes = system.targetAxes;
  const adaptationHistory = system.adaptationHistory;
  
  // Calculer le taux d'adaptation
  const adaptationCount = adaptationHistory.length;
  const adaptationRate = adaptationCount / 10; // par 10 tours
  
  // Calculer la stabilité de chaque axe
  const axisStability = new Map<keyof DifficultyAxes, number>();
  Object.keys(currentAxes).forEach(axis => {
    const axisHistory = adaptationHistory.filter(h => h.axis === axis);
    const variance = calculateVariance(axisHistory.map(h => h.newValue));
    axisStability.set(axis as keyof DifficultyAxes, 1 - variance);
  });
  
  return {
    currentAxes,
    targetAxes,
    adaptationCount,
    adaptationRate,
    axisStability,
    adaptationHistory
  };
}

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  
  return variance / 100; // normalisé
}
```

---

## Conclusion

Le Adaptive Difficulty spécifie le système de difficulté adaptative avec :

1. **7 axes de difficulté** : Question Complexity, Ambiguity, Interruptions, Time Pressure, Challenge, Hints, Silence
2. **Spécification de chaque axe** : niveaux, adaptation, exemple
3. **Adaptive Difficulty System** : currentAxes, targetAxes, adaptationRules, adaptationHistory
4. **Adaptation Rules** : trigger, action, priority, cooldown
5. **Adaptive Difficulty Implementation** : updateFromAnswer, updateFromEvaluation, updateFromStress, updateFromConfidence
6. **Configuration par scénario** : initialAxes, adaptationRules, constraints
7. **Monitoring** : DifficultyMetrics, adaptationCount, adaptationRate, axisStability

Ce document fournit une spécification exécutable pour implémenter le système de difficulté adaptative.
