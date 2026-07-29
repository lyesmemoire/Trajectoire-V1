# ETS-028 Prompt Runtime Specification

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le moteur de prompt runtime qui gère la génération temps réel des prompts pour OpenAI Realtime API. Il définit le flux de génération, le budget token de chaque couche, et les stratégies de compression.

---

## Flux de Génération

```
Planner
    ↓
Director
    ↓
Memory
    ↓
Evaluation
    ↓
ATS
    ↓
Persona
    ↓
Compression
    ↓
AI Guard
    ↓
Realtime
```

---

## Couches du Prompt

### 1. System Prompt Layer

**Budget** : 500 tokens

**Contenu**
- Instructions système pour l'IA
- Rôle de l'intervieweur
- Règles de comportement
- Contraintes de réponse

**Structure**
```typescript
interface SystemPromptLayer {
  role: string;
  instructions: string[];
  constraints: string[];
  examples: Example[];
  tokens: number;
}

interface Example {
  input: string;
  output: string;
  explanation: string;
}
```

**Budget par sous-couche**
- Role : 50 tokens
- Instructions : 250 tokens
- Constraints : 100 tokens
- Examples : 100 tokens

---

### 2. Persona Layer

**Budget** : 100 tokens

**Contenu**
- Définition de la persona
- Style de questionnement
- Tone
- Tolérance à l'imprécision
- Niveau d'interruption

**Structure**
```typescript
interface PersonaLayer {
  persona: PersonaType;
  questioningStyle: QuestioningStyle;
  tone: Tone;
  tolerancePrecision: number;
  challengeLevel: number;
  interruptionLevel: number;
  tokens: number;
}
```

**Budget par sous-couche**
- Persona : 30 tokens
- Questioning Style : 20 tokens
- Tone : 15 tokens
- Tolerance : 15 tokens
- Challenge : 10 tokens
- Interruption : 10 tokens

---

### 3. Memory Layer

**Budget** : 300 tokens

**Contenu**
- Profil du candidat
- Compétences
- Expériences
- Projets
- Réalisations

**Structure**
```typescript
interface MemoryLayer {
  profile: CandidateProfile;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  achievements: Achievement[];
  tokens: number;
}
```

**Budget par sous-couche**
- Profile : 50 tokens
- Skills : 100 tokens
- Experiences : 75 tokens
- Projects : 50 tokens
- Achievements : 25 tokens

---

### 4. Evaluation Layer

**Budget** : 200 tokens

**Contenu**
- Scores de compétences
- Évaluations précédentes
- Preuves collectées
- Tendances

**Structure**
```typescript
interface EvaluationLayer {
  competencyScores: Map<CompetencyType, CompetencyScore>;
  recentEvaluations: Evaluation[];
  evidence: Evidence[];
  trends: Trend[];
  tokens: number;
}
```

**Budget par sous-couche**
- Competency Scores : 100 tokens
- Recent Evaluations : 50 tokens
- Evidence : 30 tokens
- Trends : 20 tokens

---

### 5. Planner Layer

**Budget** : 150 tokens

**Contenu**
- Plan du tour courant
- Compétence cible
- Difficulté
- Objectifs
- Signaux attendus

**Structure**
```typescript
interface PlannerLayer {
  currentPlan: InterviewPlan;
  targetCompetency: CompetencyType;
  difficulty: number;
  goals: Goal[];
  expectedSignals: string[];
  tokens: number;
}
```

**Budget par sous-couche**
- Current Plan : 50 tokens
- Target Competency : 30 tokens
- Difficulty : 20 tokens
- Goals : 30 tokens
- Expected Signals : 20 tokens

---

### 6. ATS Layer

**Budget** : 150 tokens

**Contenu**
- Analyse ATS du CV
- Match avec le job description
- Compétences requises
- Expériences pertinentes

**Structure**
```typescript
interface ATSLayer {
  cvAnalysis: CVAnalysis;
  jobMatch: JobMatch;
  requiredSkills: Skill[];
  relevantExperience: Experience[];
  tokens: number;
}
```

**Budget par sous-couche**
- CV Analysis : 50 tokens
- Job Match : 40 tokens
- Required Skills : 30 tokens
- Relevant Experience : 30 tokens

---

### 7. Career DNA Layer

**Budget** : 140 tokens

**Contenu**
- Profil de carrière
- Trajectoire
- Intérêts
- Objectifs

**Structure**
```typescript
interface CareerDNALayer {
  careerProfile: CareerProfile;
  trajectory: CareerTrajectory;
  interests: Interest[];
  goals: CareerGoal[];
  tokens: number;
}
```

**Budget par sous-couche**
- Career Profile : 40 tokens
- Trajectory : 40 tokens
- Interests : 30 tokens
- Goals : 30 tokens

---

### 8. Context Layer

**Budget** : 250 tokens

**Contenu**
- Historique de conversation
- Questions précédentes
- Réponses précédentes
- Relances

**Structure**
```typescript
interface ContextLayer {
  conversationHistory: ConversationHistory;
  previousQuestions: Question[];
  previousAnswers: Answer[];
  relances: Relance[];
  tokens: number;
}
```

**Budget par sous-couche**
- Conversation History : 100 tokens
- Previous Questions : 50 tokens
- Previous Answers : 50 tokens
- Relances : 50 tokens

---

### 9. User Input Layer

**Budget** : 150 tokens

**Contenu**
- Réponse du candidat
- Transcription
- Signaux détectés

**Structure**
```typescript
interface UserInputLayer {
  answer: Answer;
  transcription: string;
  signals: Signal[];
  tokens: number;
}
```

**Budget par sous-couche**
- Answer : 100 tokens
- Transcription : 30 tokens
- Signals : 20 tokens

---

### 10. AI Guard Layer

**Budget** : 40 tokens

**Contenu**
- Instructions de validation
- Règles de sécurité
- Contraintes de réponse

**Structure**
```typescript
interface AIGuardLayer {
  validationRules: ValidationRule[];
  safetyRules: SafetyRule[];
  responseConstraints: ResponseConstraint[];
  tokens: number;
}
```

**Budget par sous-couche**
- Validation Rules : 15 tokens
- Safety Rules : 15 tokens
- Response Constraints : 10 tokens

---

## Budget Total

### Budget Optimisé

| Couche | Budget | Justification |
|--------|--------|---------------|
| System Prompt | 500 | Instructions système |
| Persona | 100 | Définition de la persona |
| Memory | 300 | Mémoire du candidat |
| Evaluation | 200 | Évaluations précédentes |
| Planner | 150 | Plan du tour |
| ATS | 150 | Analyse ATS |
| Career DNA | 140 | Profil de carrière |
| Context | 250 | Historique de conversation |
| User Input | 150 | Réponse du candidat |
| AI Guard | 40 | Validation |
| **Total Input** | **1980** | **Budget input** |

### Budget Output

| Couche | Budget | Justification |
|--------|--------|---------------|
| AI Response | 400 | Réponse de l'IA |
| **Total Output** | **400** | **Budget output** |

### Budget Total

| Type | Budget |
|------|--------|
| Input | 1980 tokens |
| Output | 400 tokens |
| **Total** | **2380 tokens** |

---

## Stratégies de Compression

### Compression Dynamique

```typescript
interface CompressionStrategy {
  priority: CompressionPriority;
  layers: Layer[];
  algorithm: CompressionAlgorithm;
  targetBudget: number;
}

type CompressionPriority = 
  | 'keep'
  | 'reduce'
  | 'remove'
  | 'last_resort';

interface Layer {
  name: string;
  currentBudget: number;
  targetBudget: number;
  compressionFunction: CompressionFunction;
}

type CompressionAlgorithm = 
  | 'truncation'
  | 'summarization'
  | 'filtering'
  | 'prioritization';

type CompressionFunction = 
  | 'keep_most_recent'
  | 'keep_most_important'
  | 'keep_most_relevant'
  | 'random_sampling';
```

### Algorithme de Compression

```typescript
function compressPrompt(prompt: Prompt, budget: number): Prompt {
  const currentTokens = countTokens(prompt);
  
  if (currentTokens <= budget) {
    return prompt;
  }
  
  const excess = currentTokens - budget;
  
  // Priority 1 : Réduire Memory
  if (prompt.memory.tokens > 200) {
    prompt.memory = compressLayer(prompt.memory, 200, 'keep_most_important');
    excess -= (prompt.memory.tokens - 200);
  }
  
  // Priority 2 : Réduire Evaluation
  if (excess > 0 && prompt.evaluation.tokens > 150) {
    prompt.evaluation = compressLayer(prompt.evaluation, 150, 'keep_most_recent');
    excess -= (prompt.evaluation.tokens - 150);
  }
  
  // Priority 3 : Réduire Context
  if (excess > 0 && prompt.context.tokens > 150) {
    prompt.context = compressLayer(prompt.context, 150, 'keep_most_recent');
    excess -= (prompt.context.tokens - 150);
  }
  
  // Priority 4 : Réduire Planner
  if (excess > 0 && prompt.planner.tokens > 100) {
    prompt.planner = compressLayer(prompt.planner, 100, 'truncation');
    excess -= (prompt.planner.tokens - 100);
  }
  
  // Priority 5 : Réduire ATS
  if (excess > 0 && prompt.ats.tokens > 100) {
    prompt.ats = compressLayer(prompt.ats, 100, 'truncation');
    excess -= (prompt.ats.tokens - 100);
  }
  
  // Priority 6 : Réduire Career DNA
  if (excess > 0 && prompt.careerDNA.tokens > 100) {
    prompt.careerDNA = compressLayer(prompt.careerDNA, 100, 'truncation');
    excess -= (prompt.careerDNA.tokens - 100);
  }
  
  // Priority 7 : Réduire AI Guard
  if (excess > 0 && prompt.aiGuard.tokens > 20) {
    prompt.aiGuard = compressLayer(prompt.aiGuard, 20, 'truncation');
    excess -= (prompt.aiGuard.tokens - 20);
  }
  
  // Priority 8 : Réduire AI Response
  if (excess > 0 && prompt.aiResponse.tokens > 300) {
    prompt.aiResponse = compressLayer(prompt.aiResponse, 300, 'truncation');
  }
  
  return prompt;
}
```

---

## Génération Temps Réel

### Prompt Builder

```typescript
interface PromptBuilder {
  buildPrompt(state: InterviewRuntimeState): Prompt;
  compressPrompt(prompt: Prompt, budget: number): Prompt;
  validatePrompt(prompt: Prompt): ValidationResult;
  countTokens(prompt: Prompt): number;
}

interface Prompt {
  systemPrompt: SystemPromptLayer;
  persona: PersonaLayer;
  memory: MemoryLayer;
  evaluation: EvaluationLayer;
  planner: PlannerLayer;
  ats: ATSLayer;
  careerDNA: CareerDNALayer;
  context: ContextLayer;
  userInput: UserInputLayer;
  aiGuard: AIGuardLayer;
  totalTokens: number;
}
```

### Flux de Génération

```typescript
async function buildPromptRuntime(state: InterviewRuntimeState): Promise<Prompt> {
  // 1. System Prompt
  const systemPrompt = buildSystemPrompt(state.persona);
  
  // 2. Persona
  const persona = buildPersonaLayer(state.persona);
  
  // 3. Memory
  const memory = buildMemoryLayer(state.memory);
  
  // 4. Evaluation
  const evaluation = buildEvaluationLayer(state.evaluation);
  
  // 5. Planner
  const planner = buildPlannerLayer(state.planner);
  
  // 6. ATS
  const ats = buildATSLayer(state.ats);
  
  // 7. Career DNA
  const careerDNA = buildCareerDNALayer(state.careerDNA);
  
  // 8. Context
  const context = buildContextLayer(state.memory.conversationMemory);
  
  // 9. User Input
  const userInput = buildUserInputLayer(state.speech.transcription);
  
  // 10. AI Guard
  const aiGuard = buildAIGuardLayer(state.aiGuard);
  
  // Assembler le prompt
  const prompt: Prompt = {
    systemPrompt,
    persona,
    memory,
    evaluation,
    planner,
    ats,
    careerDNA,
    context,
    userInput,
    aiGuard,
    totalTokens: 0
  };
  
  // Compter les tokens
  prompt.totalTokens = countTokens(prompt);
  
  // Compresser si nécessaire
  if (prompt.totalTokens > 2500) {
    const compressedPrompt = compressPrompt(prompt, 2500);
    return compressedPrompt;
  }
  
  return prompt;
}
```

---

## Validation

### Validation du Prompt

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  tokenCount: number;
  budgetExceeded: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error';
}

interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning';
}

function validatePrompt(prompt: Prompt): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Valider le budget
  if (prompt.totalTokens > 2500) {
    errors.push({
      field: 'totalTokens',
      message: `Token budget exceeded: ${prompt.totalTokens} > 2500`,
      severity: 'error'
    });
  }
  
  // Valider les couches
  if (prompt.systemPrompt.tokens > 500) {
    warnings.push({
      field: 'systemPrompt',
      message: `System prompt exceeds budget: ${prompt.systemPrompt.tokens} > 500`,
      severity: 'warning'
    });
  }
  
  if (prompt.memory.tokens > 300) {
    warnings.push({
      field: 'memory',
      message: `Memory exceeds budget: ${prompt.memory.tokens} > 300`,
      severity: 'warning'
    });
  }
  
  // ... autres validations
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    tokenCount: prompt.totalTokens,
    budgetExceeded: prompt.totalTokens > 2500
  };
}
```

---

## Monitoring

### Métriques de Prompt

```typescript
interface PromptMetrics {
  generationTime: number;
  tokenCount: number;
  compressionApplied: boolean;
  compressionRatio: number;
  validationPassed: boolean;
  layerMetrics: Map<string, LayerMetrics>;
}

interface LayerMetrics {
  name: string;
  originalTokens: number;
  compressedTokens: number;
  compressionRatio: number;
}
```

### Alertes

```typescript
interface PromptAlert {
  type: 'budget_exceeded' | 'compression_applied' | 'validation_failed';
  severity: 'warning' | 'critical';
  message: string;
  prompt: Prompt;
  at: Date;
}
```

---

## Caching

### Cache de Prompts

```typescript
interface PromptCache {
  key: string;
  prompt: Prompt;
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
}

interface PromptCacheStrategy {
  maxSize: number;
  ttl: number;
  evictionPolicy: 'lru' | 'lfu' | 'fifo';
}
```

### Clés de Cache

```typescript
function generateCacheKey(state: InterviewRuntimeState): string {
  const key = {
    persona: state.persona.persona,
    competency: state.planner.nextCompetency,
    difficulty: state.difficulty.overall,
    stage: state.session.currentStage,
    turn: state.session.turnCount
  };
  
  return JSON.stringify(key);
}
```

---

## Versioning

### Version du Prompt

```typescript
interface PromptVersion {
  version: string;
  schema: PromptSchema;
  migration?: PromptMigration;
  deprecatedAt?: Date;
}

interface PromptSchema {
  layers: LayerSchema[];
  budget: BudgetSchema;
}

interface LayerSchema {
  name: string;
  budget: number;
  structure: any;
}

interface BudgetSchema {
  input: number;
  output: number;
  total: number;
}
```

---

## Conclusion

Le Prompt Runtime Specification spécifie la génération temps réel des prompts pour OpenAI Realtime API avec :

1. **10 couches de prompt** : System Prompt (500), Persona (100), Memory (300), Evaluation (200), Planner (150), ATS (150), Career DNA (140), Context (250), User Input (150), AI Guard (40)
2. **Budget total** : 1980 input + 400 output = 2380 tokens
3. **Stratégies de compression** : Compression dynamique avec 8 priorités
4. **Génération temps réel** : Prompt Builder avec flux de génération
5. **Validation** : Validation du prompt avec erreurs et warnings
6. **Monitoring** : Métriques de prompt et alertes
7. **Caching** : Cache de prompts avec stratégie d'éviction
8. **Versioning** : Version du prompt avec schema et migration

Ce document fournit une spécification exécutable pour implémenter le moteur de prompt runtime.
