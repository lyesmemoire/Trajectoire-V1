# Architecture - Prompt Orchestrator

## Objectif

Le Prompt Orchestrator est responsable de :
- Assembler le contexte pour OpenAI
- Injecter les règles métier
- Sélectionner les informations utiles
- Limiter la taille du contexte (1-2k tokens max)
- Gérer les versions des prompts

**Le Director ne doit jamais construire directement les instructions envoyées au modèle.**

---

## Position dans l'Architecture

```
Conversation Director
        ↓
Prompt Orchestrator
        ↓
Context Builder
        ↓
OpenAI Realtime
```

---

## Responsabilités

### 1. Assembler le contexte

Collecter toutes les informations nécessaires pour le prompt :
- Current Stage
- Current Objective
- Current Persona
- Current Difficulty
- Current Memory Snapshot
- Current Evaluation
- Forbidden Behaviors
- Allowed Strategies

### 2. Injecter les règles métier

Ajouter les contraintes et règles :
- Règles de comportement du recruteur
- Règles de format de réponse
- Règles de sécurité (ne pas donner la réponse)
- Règles de langue

### 3. Sélectionner les informations pertinentes

Filtrer les informations selon le contexte :
- Si stage = System Design : envoyer compétences architecture
- Si stage = Behavioral : envoyer compétences leadership
- Si stage = Algorithms : envoyer compétences techniques

### 4. Limiter la taille du contexte

Garantir que le contexte ne dépasse pas 1-2k tokens :
- Compression des informations
- Priorisation des informations importantes
- Suppression des informations redondantes

### 5. Gérer les versions des prompts

Versionner les prompts pour :
- A/B testing
- Rollback
- Migration progressive

---

## Interface

```typescript
interface PromptOrchestrator {
  // Construire le prompt pour OpenAI
  buildPrompt(context: PromptContext): Promise<PromptResult>;
  
  // Construire le prompt pour une relance
  buildFollowupPrompt(context: PromptContext, lastAnswer: string): Promise<PromptResult>;
  
  // Construire le prompt pour une interruption
  buildInterruptionPrompt(context: PromptContext): Promise<PromptResult>;
  
  // Valider la taille du prompt
  validatePromptSize(prompt: string): boolean;
}

interface PromptContext {
  sessionId: string;
  currentStage: InterviewStage;
  currentObjective: StageObjective;
  persona: PersonaParameters;
  difficulty: number;
  memorySnapshot: MemorySnapshot;
  evaluationSnapshot: EvaluationSnapshot;
  candidateState: CandidateStateSnapshot;
  allowedStrategies: string[];
  forbiddenBehaviors: string[];
  lastQuestion?: string;
  lastAnswer?: string;
  turnNumber: number;
}

interface PromptResult {
  systemPrompt: string;
  userPrompt: string;
  contextSize: number; // tokens
  version: string;
}
```

---

## Implémentation

### 1. Prompt Builder

```typescript
class PromptOrchestrator implements PromptOrchestrator {
  constructor(
    private contextBuilder: ContextBuilder,
    private promptTemplates: PromptTemplates,
    private tokenizer: Tokenizer
  ) {}

  async buildPrompt(context: PromptContext): Promise<PromptResult> {
    // 1. Sélectionner le template selon le stage
    const template = this.promptTemplates.getTemplate(context.currentStage);
    
    // 2. Construire le contexte filtré
    const filteredContext = await this.contextBuilder.build(context);
    
    // 3. Assembler le prompt système
    const systemPrompt = this.buildSystemPrompt(template, context.persona, filteredContext);
    
    // 4. Assembler le prompt utilisateur
    const userPrompt = this.buildUserPrompt(template, filteredContext, context.lastQuestion);
    
    // 5. Valider la taille
    const contextSize = this.tokenizer.count(systemPrompt + userPrompt);
    
    if (contextSize > 2000) {
      // Réduire le contexte
      const reducedContext = this.reduceContext(filteredContext, contextSize - 2000);
      return this.buildPrompt({ ...context, ...reducedContext });
    }
    
    return {
      systemPrompt,
      userPrompt,
      contextSize,
      version: template.version,
    };
  }

  private buildSystemPrompt(
    template: PromptTemplate,
    persona: PersonaParameters,
    context: FilteredContext
  ): string {
    return `
${template.systemPrompt}

# Persona
You are a ${this.getPersonaDescription(persona)}.

# Parameters
- Warmth: ${persona.warmth}/10
- Pressure: ${persona.pressure}/10
- Aggressiveness: ${persona.aggressiveness}/10
- Tone: ${persona.tone}
- Energy: ${persona.energy}
- Followup Strategy: ${persona.followupStrategy}
- Technical Focus: ${persona.technicalFocus}/10

# Current Context
${this.formatContext(context)}

# Constraints
${this.formatConstraints(template.constraints)}
`.trim();
  }

  private buildUserPrompt(
    template: PromptTemplate,
    context: FilteredContext,
    lastQuestion?: string
  ): string {
    let prompt = template.userPrompt;
    
    if (lastQuestion) {
      prompt += `\n\nLast question: "${lastQuestion}"`;
    }
    
    if (context.candidateAnswer) {
      prompt += `\n\nCandidate answer: "${context.candidateAnswer}"`;
    }
    
    return prompt;
  }
}
```

### 2. Context Builder

```typescript
interface ContextBuilder {
  build(context: PromptContext): Promise<FilteredContext>;
}

class SmartContextBuilder implements ContextBuilder {
  async build(context: PromptContext): Promise<FilteredContext> {
    const filtered: FilteredContext = {
      stage: context.currentStage,
      objective: context.currentObjective,
      candidate: this.filterCandidate(context.memorySnapshot, context.currentStage),
      evaluation: this.filterEvaluation(context.evaluationSnapshot, context.currentStage),
      persona: context.persona,
      difficulty: context.difficulty,
    };
    
    return filtered;
  }

  private filterCandidate(memory: MemorySnapshot, stage: InterviewStage): CandidateInfo {
    // Filtrer selon le stage
    switch (stage) {
      case InterviewStage.ARCHITECTURE:
      case InterviewStage.SYSTEM_DESIGN:
        return {
          skills: memory.skills.filter(s => s.category === 'technical'),
          projects: memory.projects.filter(p => p.technologies.length > 0),
          achievements: memory.achievements.filter(a => a.category === 'technical'),
        };
      
      case InterviewStage.LEADERSHIP:
      case InterviewStage.BEHAVIORAL:
        return {
          skills: memory.skills.filter(s => s.category === 'soft'),
          leadershipExamples: memory.leadershipExamples,
          achievements: memory.achievements.filter(a => a.category === 'leadership'),
        };
      
      default:
        return {
          skills: memory.skills.slice(0, 5), // Top 5 skills
          projects: memory.projects.slice(0, 3), // Top 3 projects
          achievements: memory.achievements.slice(0, 3), // Top 3 achievements
        };
    }
  }

  private filterEvaluation(evaluation: EvaluationSnapshot, stage: InterviewStage): EvaluationInfo {
    // Filtrer les compétences pertinentes pour le stage
    const relevantCompetencies = this.getRelevantCompetencies(stage);
    
    return {
      overallScore: evaluation.overallScore,
      competencies: Object.fromEntries(
        Object.entries(evaluation.competencies)
          .filter(([comp]) => relevantCompetencies.includes(comp as Competency))
      ),
    };
  }

  private getRelevantCompetencies(stage: InterviewStage): Competency[] {
    switch (stage) {
      case InterviewStage.ARCHITECTURE:
      case InterviewStage.SYSTEM_DESIGN:
        return [Competency.ARCHITECTURE, Competency.TECHNICAL_DEPTH, Competency.PROBLEM_SOLVING];
      
      case InterviewStage.LEADERSHIP:
      case InterviewStage.BEHAVIORAL:
        return [Competency.LEADERSHIP, Competency.COMMUNICATION, Competency.DECISION_MAKING];
      
      case InterviewStage.ALGORITHMS:
        return [Competency.ALGORITHMS, Competency.PROBLEM_SOLVING, Competency.TECHNICAL_DEPTH];
      
      default:
        return Object.values(Competency);
    }
  }
}
```

### 3. Prompt Templates

```typescript
interface PromptTemplates {
  getTemplate(stage: InterviewStage): PromptTemplate;
}

interface PromptTemplate {
  version: string;
  systemPrompt: string;
  userPrompt: string;
  constraints: string[];
}

class PromptTemplatesV1 implements PromptTemplates {
  private templates: Record<InterviewStage, PromptTemplate> = {
    [InterviewStage.INTRODUCTION]: {
      version: '1.0.0',
      systemPrompt: `You are a professional interviewer conducting a job interview.
Your goal is to establish rapport and set expectations for the interview.`,
      userPrompt: `Start the interview with a warm welcome and explain the structure.`,
      constraints: [
        'Be welcoming and professional',
        'Explain the interview structure',
        'Ask the candidate to introduce themselves',
      ],
    },
    
    [InterviewStage.ARCHITECTURE]: {
      version: '1.0.0',
      systemPrompt: `You are a technical interviewer conducting a system design interview.
Your goal is to assess the candidate's architectural thinking and system design skills.`,
      userPrompt: `Ask a system design question relevant to the candidate's experience.`,
      constraints: [
        'Focus on scalability, reliability, and trade-offs',
        'Ask about specific technologies and patterns',
        'Probe for depth of understanding',
        'Do not provide the solution',
      ],
    },
    
    [InterviewStage.LEADERSHIP]: {
      version: '1.0.0',
      systemPrompt: `You are a leadership interviewer assessing management and soft skills.
Your goal is to evaluate the candidate's leadership potential and people skills.`,
      userPrompt: `Ask a behavioral question about leadership or team management.`,
      constraints: [
        'Focus on STAR methodology',
        'Ask for specific examples',
        'Probe for decision-making process',
        'Assess communication style',
      ],
    },
    
    // ... autres stages
  };

  getTemplate(stage: InterviewStage): PromptTemplate {
    return this.templates[stage] || this.templates[InterviewStage.INTRODUCTION];
  }
}
```

### 4. Tokenizer

```typescript
interface Tokenizer {
  count(text: string): number;
}

class GPT4Tokenizer implements Tokenizer {
  count(text: string): number {
    // Approximation : 1 token ≈ 4 caractères
    return Math.ceil(text.length / 4);
  }
}
```

---

## Exemples de Prompts

### Introduction

```
System Prompt:
You are a professional interviewer conducting a job interview.
Your goal is to establish rapport and set expectations for the interview.

# Persona
You are a supportive interviewer.
- Warmth: 8/10
- Pressure: 2/10
- Aggressiveness: 1/10
- Tone: warm
- Energy: moderate
- Followup Strategy: clarifying
- Technical Focus: 3/10

# Current Context
Stage: Introduction
Objective: Establish rapport and set expectations

# Constraints
- Be welcoming and professional
- Explain the interview structure
- Ask the candidate to introduce themselves

User Prompt:
Start the interview with a warm welcome and explain the structure.
```

### Architecture

```
System Prompt:
You are a technical interviewer conducting a system design interview.
Your goal is to assess the candidate's architectural thinking and system design skills.

# Persona
You are a technical lead interviewer.
- Warmth: 4/10
- Pressure: 6/10
- Aggressiveness: 5/10
- Tone: direct
- Energy: high
- Followup Strategy: probing
- Technical Focus: 10/10

# Current Context
Stage: Architecture
Objective: Assess technical depth and architecture skills

# Candidate
Skills: React, Node.js, PostgreSQL, Redis, AWS
Projects: E-commerce platform (50k users), Real-time chat app

# Evaluation
Overall Score: 65/100
Architecture: 70/100
Technical Depth: 60/100

# Constraints
- Focus on scalability, reliability, and trade-offs
- Ask about specific technologies and patterns
- Probe for depth of understanding
- Do not provide the solution

User Prompt:
Ask a system design question relevant to the candidate's experience.

Last question: "Can you tell me about your experience with system design?"
```

---

## Versioning

### Gestion des versions

```typescript
interface PromptVersion {
  version: string;
  template: PromptTemplate;
  rolloutPercentage: number; // 0-100
  startDate: Date;
  endDate?: Date;
}

class PromptVersionManager {
  private versions: Record<string, PromptVersion> = {
    '1.0.0': {
      version: '1.0.0',
      template: /* template V1 */,
      rolloutPercentage: 100,
      startDate: new Date('2024-01-01'),
    },
    '1.1.0': {
      version: '1.1.0',
      template: /* template V1.1 */,
      rolloutPercentage: 10, // Canary
      startDate: new Date('2024-06-01'),
    },
  };

  getTemplate(stage: InterviewStage, userId?: string): PromptTemplate {
    // A/B testing basé sur userId
    const version = this.selectVersion(userId);
    return this.versions[version].template;
  }

  private selectVersion(userId?: string): string {
    if (!userId) return '1.0.0';
    
    // Hash du userId pour déterminer la version
    const hash = this.hashUserId(userId);
    const percentage = hash % 100;
    
    // Sélectionner la version selon le rollout
    for (const [version, config] of Object.entries(this.versions)) {
      if (percentage < config.rolloutPercentage) {
        return version;
      }
    }
    
    return '1.0.0';
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
```

---

## Tests

### Tests unitaires

```typescript
describe('PromptOrchestrator', () => {
  it('should build prompt for introduction', async () => {
    const context = createTestContext({
      currentStage: InterviewStage.INTRODUCTION,
    });
    
    const result = await orchestrator.buildPrompt(context);
    
    expect(result.systemPrompt).toContain('professional interviewer');
    expect(result.contextSize).toBeLessThanOrEqual(2000);
  });
  
  it('should filter candidate info for architecture stage', async () => {
    const context = createTestContext({
      currentStage: InterviewStage.ARCHITECTURE,
      memorySnapshot: createTestMemorySnapshot(),
    });
    
    const result = await orchestrator.buildPrompt(context);
    
    expect(result.systemPrompt).toContain('technical interviewer');
    expect(result.systemPrompt).toContain('system design');
  });
  
  it('should reduce context if too large', async () => {
    const context = createTestContext({
      memorySnapshot: createLargeMemorySnapshot(), // > 2000 tokens
    });
    
    const result = await orchestrator.buildPrompt(context);
    
    expect(result.contextSize).toBeLessThanOrEqual(2000);
  });
});
```

### Tests d'intégration

```typescript
describe('PromptOrchestrator Integration', () => {
  it('should work with OpenAI Realtime', async () => {
    const context = createTestContext();
    const prompt = await orchestrator.buildPrompt(context);
    
    const response = await openaiRealtime.chat({
      systemPrompt: prompt.systemPrompt,
      userPrompt: prompt.userPrompt,
    });
    
    expect(response).toBeDefined();
    expect(response.content).toBeDefined();
  });
});
```

---

## Checklist

### Avant implémentation

- [ ] Interface PromptOrchestrator définie
- [ ] Interface ContextBuilder définie
- [ ] Prompt Templates définis
- [ ] Tokenizer implémenté
- [ ] Versioning strategy définie

### Après implémentation

- [ ] PromptOrchestrator implémenté
- [ ] ContextBuilder implémenté
- [ ] Prompt Templates V1 créés
- [ ] Tokenizer fonctionnel
- [ ] Versioning fonctionnel
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Taille des prompts < 2k tokens

---

## Timeline

| Tâche | Durée |
|-------|-------|
| Interface definition | 1 jour |
| PromptOrchestrator implémenté | 2 jours |
| ContextBuilder implémenté | 2 jours |
| Prompt Templates créés | 3 jours |
| Tokenizer implémenté | 1 jour |
| Versioning implémenté | 2 jours |
| Tests | 2 jours |
| **Total** | **13 jours (~2 semaines)** |

---

## Conclusion

Le Prompt Orchestrator permet :

1. **Séparation des responsabilités** : Director ne construit pas les prompts
2. **Contexte optimisé** : Filtrage intelligent des informations
3. **Taille contrôlée** : Garantie < 2k tokens
4. **Versioning** : A/B testing et rollback
5. **Templates réutilisables** : Standardisation des prompts
6. **Validation** : Contrôle de la taille et du contenu
