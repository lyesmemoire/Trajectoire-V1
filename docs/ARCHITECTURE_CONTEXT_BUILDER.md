# Architecture - Context Builder

## Objectif

Le Context Builder est responsable de :
- Sélectionner uniquement les informations pertinentes pour le contexte
- Filtrer selon le stage actuel
- Prioriser les informations importantes
- Optimiser la taille du contexte

**La mémoire peut devenir volumineuse. Le Context Builder choisit uniquement ce qui est pertinent.**

---

## Position dans l'Architecture

```
Prompt Orchestrator
        ↓
Context Builder
        ↓
Memory Snapshot
Evaluation Snapshot
Persona Parameters
```

---

## Responsabilités

### 1. Filtrage par stage

Selon le stage actuel, sélectionner les informations pertinentes :
- **System Design** : Compétences architecture, projets techniques
- **Leadership** : Compétences soft skills, exemples de leadership
- **Algorithms** : Compétences techniques, algorithmes
- **Behavioral** : Compétences communication, STAR elements

### 2. Priorisation

Prioriser les informations selon leur importance :
- **Haute priorité** : Compétences du stage actuel
- **Moyenne priorité** : Compétences adjacentes
- **Basse priorité** : Compétences non pertinentes

### 3. Compression

Compresser les informations pour réduire la taille :
- Résumer les projets longs
- Sélectionner les compétences les plus importantes
- Limiter le nombre d'exemples

### 4. Relevance Scoring

Calculer un score de pertinence pour chaque information :
- Score basé sur le stage actuel
- Score basé sur les compétences évaluées
- Score basé sur l'historique des questions

---

## Interface

```typescript
interface ContextBuilder {
  // Construire le contexte filtré
  build(context: PromptContext): Promise<FilteredContext>;
  
  // Calculer le score de pertinence
  calculateRelevanceScore(item: ContextItem, stage: InterviewStage): number;
  
  // Filtrer les items par score
  filterByScore(items: ContextItem[], threshold: number): ContextItem[];
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
  turnNumber: number;
}

interface FilteredContext {
  stage: InterviewStage;
  objective: StageObjective;
  candidate: CandidateInfo;
  evaluation: EvaluationInfo;
  persona: PersonaParameters;
  difficulty: number;
  constraints: string[];
}

interface CandidateInfo {
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  leadershipExamples?: LeadershipExample[];
  contradictions?: Contradiction[];
}

interface EvaluationInfo {
  overallScore: number;
  competencies: Record<Competency, CompetencyScore>;
  topStrengths: Competency[];
  topWeaknesses: Competency[];
}
```

---

## Implémentation

### 1. Smart Context Builder

```typescript
class SmartContextBuilder implements ContextBuilder {
  private relevanceRules: Map<InterviewStage, RelevanceRule> = new Map();

  constructor() {
    this.initializeRelevanceRules();
  }

  async build(context: PromptContext): Promise<FilteredContext> {
    const rule = this.relevanceRules.get(context.currentStage);
    
    if (!rule) {
      return this.buildDefaultContext(context);
    }

    return {
      stage: context.currentStage,
      objective: context.currentObjective,
      candidate: await this.filterCandidate(context.memorySnapshot, rule),
      evaluation: this.filterEvaluation(context.evaluationSnapshot, rule),
      persona: context.persona,
      difficulty: context.difficulty,
      constraints: rule.constraints,
    };
  }

  private async filterCandidate(
    memory: MemorySnapshot,
    rule: RelevanceRule
  ): Promise<CandidateInfo> {
    const skills = this.filterSkills(memory.skills, rule);
    const projects = this.filterProjects(memory.projects, rule);
    const achievements = this.filterAchievements(memory.achievements, rule);
    const leadershipExamples = rule.includeLeadership
      ? memory.leadershipExamples?.slice(0, 3)
      : undefined;
    const contradictions = rule.includeContradictions
      ? memory.contradictions?.slice(0, 2)
      : undefined;

    return {
      skills,
      projects,
      achievements,
      leadershipExamples,
      contradictions,
    };
  }

  private filterSkills(skills: Skill[], rule: RelevanceRule): Skill[] {
    return skills
      .map(skill => ({
        ...skill,
        relevanceScore: this.calculateRelevanceScore(skill, rule.stage),
      }))
      .filter(skill => skill.relevanceScore >= rule.minRelevanceScore)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, rule.maxSkills);
  }

  private filterProjects(projects: Project[], rule: RelevanceRule): Project[] {
    return projects
      .map(project => ({
        ...project,
        relevanceScore: this.calculateRelevanceScore(project, rule.stage),
      }))
      .filter(project => project.relevanceScore >= rule.minRelevanceScore)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, rule.maxProjects);
  }

  private filterAchievements(achievements: Achievement[], rule: RelevanceRule): Achievement[] {
    return achievements
      .map(achievement => ({
        ...achievement,
        relevanceScore: this.calculateRelevanceScore(achievement, rule.stage),
      }))
      .filter(achievement => achievement.relevanceScore >= rule.minRelevanceScore)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, rule.maxAchievements);
  }

  private filterEvaluation(
    evaluation: EvaluationSnapshot,
    rule: RelevanceRule
  ): EvaluationInfo {
    const relevantCompetencies = rule.relevantCompetencies;
    
    const filteredCompetencies = Object.fromEntries(
      Object.entries(evaluation.competencies)
        .filter(([comp]) => relevantCompetencies.includes(comp as Competency))
    );

    const topStrengths = this.getTopCompetencies(filteredCompetencies, 3, 'high');
    const topWeaknesses = this.getTopCompetencies(filteredCompetencies, 3, 'low');

    return {
      overallScore: evaluation.overallScore,
      competencies: filteredCompetencies as Record<Competency, CompetencyScore>,
      topStrengths,
      topWeaknesses,
    };
  }

  private getTopCompetencies(
    competencies: Record<string, CompetencyScore>,
    count: number,
    type: 'high' | 'low'
  ): Competency[] {
    return Object.entries(competencies)
      .sort(([, a], [, b]) => type === 'high' ? b.score - a.score : a.score - b.score)
      .slice(0, count)
      .map(([comp]) => comp as Competency);
  }

  calculateRelevanceScore(item: ContextItem, stage: InterviewStage): number {
    // Base score
    let score = 0.5;

    // Boost si la catégorie est pertinente pour le stage
    if (this.isCategoryRelevant(item.category, stage)) {
      score += 0.3;
    }

    // Boost si l'item a été mentionné récemment
    if (item.lastMentioned && this.isRecent(item.lastMentioned)) {
      score += 0.2;
    }

    // Boost si l'item a une haute importance
    if (item.importance === 'high') {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private isCategoryRelevant(category: string, stage: InterviewStage): boolean {
    const relevantCategories: Record<InterviewStage, string[]> = {
      [InterviewStage.ARCHITECTURE]: ['technical', 'architecture', 'system-design'],
      [InterviewStage.SYSTEM_DESIGN]: ['technical', 'architecture', 'system-design'],
      [InterviewStage.ALGORITHMS]: ['technical', 'algorithms', 'problem-solving'],
      [InterviewStage.LEADERSHIP]: ['soft', 'leadership', 'management'],
      [InterviewStage.BEHAVIORAL]: ['soft', 'communication', 'teamwork'],
      [InterviewStage.CULTURE_FIT]: ['soft', 'culture', 'values'],
      [InterviewStage.EXPERIENCE]: ['technical', 'soft'],
      [InterviewStage.CONFLICT]: ['soft', 'conflict', 'communication'],
      [InterviewStage.INTRODUCTION]: ['soft', 'technical'],
      [InterviewStage.ICE_BREAKER]: ['soft'],
      [InterviewStage.PRESENTATION]: ['soft', 'technical'],
      [InterviewStage.CANDIDATE_QUESTIONS]: ['soft', 'technical'],
      [InterviewStage.CONCLUSION]: ['soft', 'technical'],
    };

    return relevantCategories[stage]?.includes(category) || false;
  }

  private isRecent(timestamp: Date): boolean {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    return diff < 5 * 60 * 1000; // 5 minutes
  }

  private initializeRelevanceRules(): void {
    this.relevanceRules.set(InterviewStage.ARCHITECTURE, {
      stage: InterviewStage.ARCHITECTURE,
      relevantCompetencies: [
        Competency.ARCHITECTURE,
        Competency.TECHNICAL_DEPTH,
        Competency.PROBLEM_SOLVING,
      ],
      minRelevanceScore: 0.6,
      maxSkills: 8,
      maxProjects: 3,
      maxAchievements: 3,
      includeLeadership: false,
      includeContradictions: false,
      constraints: [
        'Focus on scalability and reliability',
        'Ask about specific technologies',
        'Probe for trade-offs',
      ],
    });

    this.relevanceRules.set(InterviewStage.LEADERSHIP, {
      stage: InterviewStage.LEADERSHIP,
      relevantCompetencies: [
        Competency.LEADERSHIP,
        Competency.COMMUNICATION,
        Competency.DECISION_MAKING,
        Competency.INFLUENCE,
      ],
      minRelevanceScore: 0.6,
      maxSkills: 5,
      maxProjects: 2,
      maxAchievements: 3,
      includeLeadership: true,
      includeContradictions: true,
      constraints: [
        'Focus on STAR methodology',
        'Ask for specific examples',
        'Probe for decision-making process',
      ],
    });

    // ... autres stages
  }

  private buildDefaultContext(context: PromptContext): FilteredContext {
    return {
      stage: context.currentStage,
      objective: context.currentObjective,
      candidate: {
        skills: context.memorySnapshot.skills.slice(0, 5),
        projects: context.memorySnapshot.projects.slice(0, 2),
        achievements: context.memorySnapshot.achievements.slice(0, 2),
      },
      evaluation: {
        overallScore: context.evaluationSnapshot.overallScore,
        competencies: context.evaluationSnapshot.competencies,
        topStrengths: [],
        topWeaknesses: [],
      },
      persona: context.persona,
      difficulty: context.difficulty,
      constraints: [],
    };
  }
}
```

### 2. Relevance Rule

```typescript
interface RelevanceRule {
  stage: InterviewStage;
  relevantCompetencies: Competency[];
  minRelevanceScore: number;
  maxSkills: number;
  maxProjects: number;
  maxAchievements: number;
  includeLeadership: boolean;
  includeContradictions: boolean;
  constraints: string[];
}

interface ContextItem {
  id: string;
  category: string;
  importance: 'low' | 'medium' | 'high';
  lastMentioned?: Date;
  relevanceScore?: number;
}
```

---

## Exemples de Filtrage

### Architecture Stage

**Entrée (Memory Snapshot)**
```typescript
{
  skills: [
    { name: 'React', category: 'technical', importance: 'high' },
    { name: 'Node.js', category: 'technical', importance: 'high' },
    { name: 'Leadership', category: 'soft', importance: 'medium' },
    { name: 'Communication', category: 'soft', importance: 'medium' },
    { name: 'System Design', category: 'technical', importance: 'high' },
    { name: 'AWS', category: 'technical', importance: 'high' },
    { name: 'Teamwork', category: 'soft', importance: 'low' },
  ],
  projects: [
    { name: 'E-commerce', technologies: ['React', 'Node.js', 'AWS'] },
    { name: 'Team Management', technologies: [] },
    { name: 'Microservices', technologies: ['Node.js', 'Docker', 'Kubernetes'] },
  ],
}
```

**Sortie (Filtered Context)**
```typescript
{
  skills: [
    { name: 'System Design', relevanceScore: 0.9 },
    { name: 'AWS', relevanceScore: 0.85 },
    { name: 'Node.js', relevanceScore: 0.8 },
    { name: 'React', relevanceScore: 0.75 },
  ],
  projects: [
    { name: 'Microservices', relevanceScore: 0.9 },
    { name: 'E-commerce', relevanceScore: 0.85 },
  ],
  achievements: [],
}
```

### Leadership Stage

**Entrée (Memory Snapshot)**
```typescript
{
  skills: [
    { name: 'React', category: 'technical', importance: 'high' },
    { name: 'Leadership', category: 'soft', importance: 'high' },
    { name: 'Communication', category: 'soft', importance: 'high' },
    { name: 'Decision Making', category: 'soft', importance: 'high' },
  ],
  leadershipExamples: [
    { description: 'Led team of 10 developers' },
    { description: 'Mentored junior developers' },
    { description: 'Resolved team conflict' },
  ],
}
```

**Sortie (Filtered Context)**
```typescript
{
  skills: [
    { name: 'Leadership', relevanceScore: 0.9 },
    { name: 'Communication', relevanceScore: 0.85 },
    { name: 'Decision Making', relevanceScore: 0.8 },
  ],
  projects: [],
  leadershipExamples: [
    { description: 'Led team of 10 developers' },
    { description: 'Resolved team conflict' },
  ],
}
```

---

## Tests

### Tests unitaires

```typescript
describe('ContextBuilder', () => {
  it('should filter skills for architecture stage', async () => {
    const context = createTestContext({
      currentStage: InterviewStage.ARCHITECTURE,
      memorySnapshot: createTestMemorySnapshot(),
    });

    const filtered = await contextBuilder.build(context);

    expect(filtered.candidate.skills).toHaveLength(8);
    expect(filtered.candidate.skills.every(s => s.category === 'technical')).toBe(true);
  });

  it('should include leadership examples for leadership stage', async () => {
    const context = createTestContext({
      currentStage: InterviewStage.LEADERSHIP,
      memorySnapshot: createTestMemorySnapshot({
        leadershipExamples: [
          { description: 'Led team' },
          { description: 'Mentored juniors' },
        ],
      }),
    });

    const filtered = await contextBuilder.build(context);

    expect(filtered.candidate.leadershipExamples).toBeDefined();
    expect(filtered.candidate.leadershipExamples?.length).toBeGreaterThan(0);
  });

  it('should calculate relevance score', () => {
    const skill = { category: 'technical', importance: 'high' };
    const score = contextBuilder.calculateRelevanceScore(skill, InterviewStage.ARCHITECTURE);

    expect(score).toBeGreaterThan(0.5);
  });
});
```

---

## Checklist

### Avant implémentation

- [ ] Interface ContextBuilder définie
- [ ] Relevance Rules définies
- [ ] Scoring algorithm défini
- [ ] Filtering logic défini

### Après implémentation

- [ ] ContextBuilder implémenté
- [ ] Relevance Rules configurées
- [ ] Scoring fonctionnel
- [ ] Filtering fonctionnel
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent

---

## Timeline

| Tâche | Durée |
|-------|-------|
| Interface definition | 1 jour |
| ContextBuilder implémenté | 2 jours |
| Relevance Rules configurées | 2 jours |
| Scoring algorithm | 2 jours |
| Tests | 1 jour |
| **Total** | **8 jours (~1 semaine)** |

---

## Conclusion

Le Context Builder permet :

1. **Contexte optimisé** : Informations pertinentes uniquement
2. **Filtrage intelligent** : Basé sur le stage actuel
3. **Priorisation** : Score de pertinence
4. **Compression** : Réduction de la taille du contexte
5. **Performance** : Réduction des tokens envoyés à OpenAI
