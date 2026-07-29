# ETS-032 Question Engine

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le moteur de questions qui définit comment une question est structurée comme un objet complet avec goal, competencies, difficulty, expected signals, exit conditions, anti-patterns, followups, variants et localization.

---

## Spécification de la Question

### Question Object

```typescript
interface Question {
  id: string;
  text: string;
  goal: string;
  competencies: CompetencyType[];
  difficulty: number;
  expectedSignals: ExpectedSignal[];
  exitConditions: ExitCondition[];
  antiPatterns: AntiPattern[];
  followups: Followup[];
  variants: QuestionVariant[];
  localization: QuestionLocalization;
  metadata: QuestionMetadata;
}
```

---

### Goal

```typescript
interface Goal {
  description: string;
  objective: string;
  successCriteria: string[];
}
```

**Exemple**
```typescript
{
  description: "Évaluer la capacité du candidat à concevoir une architecture scalable",
  objective: "Vérifier que le candidat comprend les principes de scalabilité",
  successCriteria: [
    "Le candidat mentionne la scalabilité",
    "Le candidat explique les tradeoffs",
    "Le candidat donne des exemples concrets"
  ]
}
```

---

### Competencies

```typescript
type CompetencyType = 
  | 'leadership'
  | 'architecture'
  | 'problem_solving'
  | 'communication'
  | 'product'
  | 'debugging'
  | 'teamwork'
  | 'adaptability'
  | 'ownership'
  | 'metrics';
```

**Exemple**
```typescript
{
  competencies: ['architecture', 'problem_solving', 'communication']
}
```

---

### Difficulty

```typescript
interface Difficulty {
  level: number; // 1-10
  dimensions: DifficultyDimensions;
}

interface DifficultyDimensions {
  complexity: number; // 1-10
  ambiguity: number; // 1-10
  technicality: number; // 1-10
  abstraction: number; // 1-10
}
```

**Exemple**
```typescript
{
  difficulty: {
    level: 7,
    dimensions: {
      complexity: 8,
      ambiguity: 5,
      technicality: 7,
      abstraction: 6
    }
  }
}
```

---

### Expected Signals

```typescript
interface ExpectedSignal {
  type: SignalType;
  description: string;
  strength: number; // 0-1
  required: boolean;
}

type SignalType = 
  | 'evidence'
  | 'ownership'
  | 'metrics'
  | 'tradeoffs'
  | 'technical_depth'
  | 'clarity'
  | 'structure'
  | 'examples';
```

**Exemple**
```typescript
{
  expectedSignals: [
    {
      type: 'evidence',
      description: "Le candidat donne des preuves quantitatives",
      strength: 0.8,
      required: true
    },
    {
      type: 'technical_depth',
      description: "Le candidat démontre une compréhension technique profonde",
      strength: 0.7,
      required: true
    },
    {
      type: 'clarity',
      description: "Le candidat s'exprime clairement",
      strength: 0.6,
      required: false
    }
  ]
}
```

---

### Exit Conditions

```typescript
interface ExitCondition {
  type: ExitConditionType;
  condition: string;
  action: ExitAction;
}

type ExitConditionType = 
  | 'signal_detected'
  | 'signal_absent'
  | 'score_threshold'
  | 'time_elapsed'
  | 'relance_count';

type ExitAction = 
  | 'next_question'
  | 'next_stage'
  | 'relance'
  | 'adapt_difficulty'
  | 'end';
```

**Exemple**
```typescript
{
  exitConditions: [
    {
      type: 'signal_detected',
      condition: 'evidence AND technical_depth',
      action: 'next_question'
    },
    {
      type: 'signal_absent',
      condition: 'evidence',
      action: 'relance'
    },
    {
      type: 'relance_count',
      condition: 'relance_count >= 3',
      action: 'next_question'
    }
  ]
}
```

---

### Anti-Patterns

```typescript
interface AntiPattern {
  type: AntiPatternType;
  description: string;
  detection: string;
  mitigation: string;
  severity: 'low' | 'medium' | 'high';
}

type AntiPatternType = 
  | 'vague_response'
  | 'evasive_response'
  | 'overconfidence'
  | 'underconfidence'
  | 'buzzwords'
  | 'no_evidence'
  | 'no_ownership'
  | 'no_metrics';
```

**Exemple**
```typescript
{
  antiPatterns: [
    {
      type: 'vague_response',
      description: "Le candidat donne une réponse vague sans détails",
      detection: "response.length < 50 OR contains_generic_phrases",
      mitigation: "Clarification: 'Pouvez-vous préciser ?'",
      severity: 'medium'
    },
    {
      type: 'no_evidence',
      description: "Le candidat ne donne aucune preuve",
      detection: "NOT contains_numbers AND NOT contains_metrics",
      mitigation: "Evidence: 'Combien exactement ?'",
      severity: 'high'
    },
    {
      type: 'buzzwords',
      description: "Le candidat utilise des buzzwords sans contexte",
      detection: "contains_microservices AND NOT explains_architecture",
      mitigation: "Challenge: 'Pourquoi microservices ?'",
      severity: 'medium'
    }
  ]
}
```

---

### Followups

```typescript
interface Followup {
  id: string;
  trigger: FollowupTrigger;
  question: string;
  competency?: CompetencyType;
  difficulty?: number;
}

type FollowupTrigger = 
  | 'vague_response'
  | 'no_evidence'
  | 'no_ownership'
  | 'no_metrics'
  | 'no_tradeoffs'
  | 'excellent_response'
  | 'poor_response';
```

**Exemple**
```typescript
{
  followups: [
    {
      id: 'followup-1',
      trigger: 'vague_response',
      question: "Pouvez-vous préciser ?",
      competency: 'communication'
    },
    {
      id: 'followup-2',
      trigger: 'no_evidence',
      question: "Combien exactement ?",
      competency: 'metrics'
    },
    {
      id: 'followup-3',
      trigger: 'no_ownership',
      question: "Quel était votre rôle exact ?",
      competency: 'ownership'
    },
    {
      id: 'followup-4',
      trigger: 'excellent_response',
      question: "Comment avez-vous évolué l'architecture ?",
      competency: 'architecture',
      difficulty: 8
    }
  ]
}
```

---

### Variants

```typescript
interface QuestionVariant {
  id: string;
  text: string;
  difficulty: number;
  context: VariantContext;
  usage: VariantUsage;
}

interface VariantContext {
  persona?: PersonaType;
  scenario?: ScenarioType;
  seniority?: SeniorityLevel;
  domain?: DomainType;
}

type VariantUsage = 
  | 'primary'
  | 'alternative'
  | 'fallback'
  | 'cultural';

type SeniorityLevel = 
  | 'junior'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'principal'
  | 'staff';

type DomainType = 
  | 'backend'
  | 'frontend'
  | 'fullstack'
  | 'mobile'
  | 'devops'
  | 'data'
  | 'ml'
  | 'security';
```

**Exemple**
```typescript
{
  variants: [
    {
      id: 'variant-1',
      text: "Parlez-moi d'un projet d'architecture scalable que vous avez conçu.",
      difficulty: 7,
      context: {
        persona: 'google',
        seniority: 'senior',
        domain: 'backend'
      },
      usage: 'primary'
    },
    {
      id: 'variant-2',
      text: "Comment concevriez-vous un système scalable pour gérer 1 million d'utilisateurs ?",
      difficulty: 8,
      context: {
        persona: 'amazon',
        seniority: 'lead',
        domain: 'backend'
      },
      usage: 'alternative'
    },
    {
      id: 'variant-3',
      text: "Décrivez une architecture que vous avez améliorée pour la scalabilité.",
      difficulty: 6,
      context: {
        persona: 'microsoft',
        seniority: 'mid',
        domain: 'backend'
      },
      usage: 'fallback'
    }
  ]
}
```

---

### Localization

```typescript
interface QuestionLocalization {
  language: string;
  text: string;
  culturalContext: CulturalContext;
}

interface CulturalContext {
  tone: Tone;
  formality: Formality;
  directness: Directness;
}

type Tone = 
  | 'formal'
  | 'casual'
  | 'professional'
  | 'friendly';

type Formality = 
  | 'high'
  | 'medium'
  | 'low';

type Directness = 
  | 'direct'
  | 'indirect'
  | 'polite';
```

**Exemple**
```typescript
{
  localization: {
    language: 'fr',
    text: "Parlez-moi d'un projet d'architecture scalable que vous avez conçu.",
    culturalContext: {
      tone: 'professional',
      formality: 'medium',
      directness: 'polite'
    }
  }
}
```

---

### Metadata

```typescript
interface QuestionMetadata {
  category: QuestionCategory;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  usage: QuestionUsageStats;
}

type QuestionCategory = 
  | 'technical'
  | 'behavioral'
  | 'system_design'
  | 'architecture'
  | 'debugging'
  | 'leadership'
  | 'product'
  | 'culture_fit';

interface QuestionUsageStats {
  totalAsked: number;
  successRate: number;
  averageScore: number;
  lastUsed: Date;
}
```

**Exemple**
```typescript
{
  metadata: {
    category: 'architecture',
    tags: ['scalability', 'microservices', 'tradeoffs'],
    author: 'system',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    version: '1.2.0',
    usage: {
      totalAsked: 150,
      successRate: 0.75,
      averageScore: 72,
      lastUsed: new Date('2024-01-20')
    }
  }
}
```

---

## Question Engine

### Question Engine Interface

```typescript
interface QuestionEngine {
  generateQuestion(params: QuestionGenerationParams): Question;
  selectVariant(question: Question, context: VariantContext): QuestionVariant;
  selectFollowup(question: Question, answer: Answer): Followup;
  validateQuestion(question: Question): ValidationResult;
  adaptQuestion(question: Question, adaptation: QuestionAdaptation): Question;
  localizeQuestion(question: Question, language: string): Question;
}

interface QuestionGenerationParams {
  competency: CompetencyType;
  difficulty: number;
  persona: PersonaType;
  scenario: ScenarioType;
  seniority: SeniorityLevel;
  domain: DomainType;
  language: string;
}

interface QuestionAdaptation {
  type: AdaptationType;
  parameter: string;
  oldValue: any;
  newValue: any;
}

type AdaptationType = 
  | 'difficulty'
  | 'complexity'
  | 'ambiguity'
  | 'technicality'
  | 'abstraction';
```

---

### Question Generation

```typescript
async function generateQuestion(params: QuestionGenerationParams): Promise<Question> {
  // 1. Sélectionner la catégorie de question
  const category = selectCategory(params.competency);
  
  // 2. Sélectionner le template de question
  const template = selectTemplate(category, params.difficulty);
  
  // 3. Générer le texte de la question
  const text = generateText(template, params);
  
  // 4. Définir le goal
  const goal = defineGoal(params.competency);
  
  // 5. Définir les expected signals
  const expectedSignals = defineExpectedSignals(params.competency);
  
  // 6. Définir les exit conditions
  const exitConditions = defineExitConditions(params.competency);
  
  // 7. Définir les anti-patterns
  const antiPatterns = defineAntiPatterns(params.competency);
  
  // 8. Définir les followups
  const followups = defineFollowups(params.competency);
  
  // 9. Générer les variants
  const variants = generateVariants(params);
  
  // 10. Définir la localization
  const localization = defineLocalization(params.language);
  
  // 11. Définir les metadata
  const metadata = defineMetadata(category);
  
  // Assembler la question
  const question: Question = {
    id: generateId(),
    text,
    goal,
    competencies: [params.competency],
    difficulty: params.difficulty,
    expectedSignals,
    exitConditions,
    antiPatterns,
    followups,
    variants,
    localization,
    metadata
  };
  
  return question;
}
```

---

### Question Selection

```typescript
function selectVariant(question: Question, context: VariantContext): QuestionVariant {
  // Filtrer les variants par contexte
  const filteredVariants = question.variants.filter(variant => {
    if (context.persona && variant.context.persona !== context.persona) return false;
    if (context.scenario && variant.context.scenario !== context.scenario) return false;
    if (context.seniority && variant.context.seniority !== context.seniority) return false;
    if (context.domain && variant.context.domain !== context.domain) return false;
    return true;
  });
  
  // Sélectionner le variant primaire
  const primaryVariant = filteredVariants.find(v => v.usage === 'primary');
  if (primaryVariant) return primaryVariant;
  
  // Sélectionner le variant alternatif
  const alternativeVariant = filteredVariants.find(v => v.usage === 'alternative');
  if (alternativeVariant) return alternativeVariant;
  
  // Sélectionner le variant fallback
  const fallbackVariant = filteredVariants.find(v => v.usage === 'fallback');
  if (fallbackVariant) return fallbackVariant;
  
  // Retourner le premier variant
  return filteredVariants[0];
}
```

---

### Followup Selection

```typescript
function selectFollowup(question: Question, answer: Answer): Followup {
  // Analyser la réponse
  const analysis = analyzeAnswer(answer);
  
  // Sélectionner le trigger approprié
  let trigger: FollowupTrigger;
  
  if (analysis.isVague) {
    trigger = 'vague_response';
  } else if (analysis.noEvidence) {
    trigger = 'no_evidence';
  } else if (analysis.noOwnership) {
    trigger = 'no_ownership';
  } else if (analysis.noMetrics) {
    trigger = 'no_metrics';
  } else if (analysis.noTradeoffs) {
    trigger = 'no_tradeoffs';
  } else if (analysis.isExcellent) {
    trigger = 'excellent_response';
  } else if (analysis.isPoor) {
    trigger = 'poor_response';
  } else {
    return null;
  }
  
  // Sélectionner le followup correspondant
  const followup = question.followups.find(f => f.trigger === trigger);
  return followup || null;
}

interface AnswerAnalysis {
  isVague: boolean;
  noEvidence: boolean;
  noOwnership: boolean;
  noMetrics: boolean;
  noTradeoffs: boolean;
  isExcellent: boolean;
  isPoor: boolean;
}

function analyzeAnswer(answer: Answer): AnswerAnalysis {
  const analysis: AnswerAnalysis = {
    isVague: false,
    noEvidence: false,
    noOwnership: false,
    noMetrics: false,
    noTradeoffs: false,
    isExcellent: false,
    isPoor: false
  };
  
  // Analyser la réponse
  if (answer.text.length < 50) analysis.isVague = true;
  if (!answer.text.match(/\d+/)) analysis.noEvidence = true;
  if (!answer.text.includes('je')) analysis.noOwnership = true;
  if (!answer.text.match(/\d+%|\d+ms|\d+s/)) analysis.noMetrics = true;
  if (!answer.text.includes('tradeoff') && !answer.text.includes('compromis')) analysis.noTradeoffs = true;
  
  // Calculer le score
  const score = calculateAnswerScore(answer);
  if (score > 80) analysis.isExcellent = true;
  if (score < 40) analysis.isPoor = true;
  
  return analysis;
}
```

---

### Question Validation

```typescript
function validateQuestion(question: Question): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Valider le texte
  if (!question.text || question.text.length === 0) {
    errors.push({
      field: 'text',
      message: 'Question text is required',
      severity: 'error'
    });
  }
  
  // Valider les compétences
  if (!question.competencies || question.competencies.length === 0) {
    errors.push({
      field: 'competencies',
      message: 'At least one competency is required',
      severity: 'error'
    });
  }
  
  // Valider la difficulté
  if (question.difficulty < 1 || question.difficulty > 10) {
    errors.push({
      field: 'difficulty',
      message: 'Difficulty must be between 1 and 10',
      severity: 'error'
    });
  }
  
  // Valider les expected signals
  if (!question.expectedSignals || question.expectedSignals.length === 0) {
    warnings.push({
      field: 'expectedSignals',
      message: 'No expected signals defined',
      severity: 'warning'
    });
  }
  
  // Valider les exit conditions
  if (!question.exitConditions || question.exitConditions.length === 0) {
    warnings.push({
      field: 'exitConditions',
      message: 'No exit conditions defined',
      severity: 'warning'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
```

---

### Question Adaptation

```typescript
function adaptQuestion(question: Question, adaptation: QuestionAdaptation): Question {
  const adaptedQuestion = { ...question };
  
  switch (adaptation.type) {
    case 'difficulty':
      adaptedQuestion.difficulty = adaptation.newValue;
      break;
    case 'complexity':
      adaptedQuestion.difficulty = adaptation.newValue;
      break;
    case 'ambiguity':
      adaptedQuestion.text = adaptAmbiguity(question.text, adaptation.newValue);
      break;
    case 'technicality':
      adaptedQuestion.text = adaptTechnicality(question.text, adaptation.newValue);
      break;
    case 'abstraction':
      adaptedQuestion.text = adaptAbstraction(question.text, adaptation.newValue);
      break;
  }
  
  return adaptedQuestion;
}

function adaptAmbiguity(text: string, level: number): string {
  if (level > 5) {
    return text + " (soyez précis)";
  } else {
    return text.replace(/\(soyez précis\)/g, '');
  }
}

function adaptTechnicality(text: string, level: number): string {
  if (level > 5) {
    return text.replace(/concevoir/g, 'implémenter');
  } else {
    return text.replace(/implémenter/g, 'concevoir');
  }
}

function adaptAbstraction(text: string, level: number): string {
  if (level > 5) {
    return text.replace(/système/g, 'architecture');
  } else {
    return text.replace(/architecture/g, 'système');
  }
}
```

---

## Question Library

### Question Library Structure

```typescript
interface QuestionLibrary {
  questions: Map<string, Question>;
  categories: Map<QuestionCategory, string[]>;
  competencies: Map<CompetencyType, string[]>;
  difficulties: Map<number, string[]>;
}

interface QuestionLibraryBuilder {
  addQuestion(question: Question): void;
  removeQuestion(questionId: string): void;
  getQuestion(questionId: string): Question;
  getQuestionsByCategory(category: QuestionCategory): Question[];
  getQuestionsByCompetency(competency: CompetencyType): Question[];
  getQuestionsByDifficulty(difficulty: number): Question[];
  searchQuestions(query: string): Question[];
}
```

---

## Conclusion

Le Question Engine spécifie comment une question est structurée comme un objet complet avec :

1. **Question Object** : id, text, goal, competencies, difficulty, expected signals, exit conditions, anti-patterns, followups, variants, localization, metadata
2. **Goal** : description, objective, success criteria
3. **Competencies** : types de compétences
4. **Difficulty** : level, dimensions (complexity, ambiguity, technicality, abstraction)
5. **Expected Signals** : type, description, strength, required
6. **Exit Conditions** : type, condition, action
7. **Anti-Patterns** : type, description, detection, mitigation, severity
8. **Followups** : id, trigger, question, competency, difficulty
9. **Variants** : id, text, difficulty, context, usage
10. **Localization** : language, text, cultural context
11. **Metadata** : category, tags, author, usage stats
12. **Question Engine** : generateQuestion, selectVariant, selectFollowup, validateQuestion, adaptQuestion
13. **Question Library** : structure, builder

Ce document fournit une spécification exécutable pour implémenter le moteur de questions.
