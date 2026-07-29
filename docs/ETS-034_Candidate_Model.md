# ETS-034 Candidate Model

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le modèle dynamique du candidat qui évolue pendant la session. Il capture les aspects techniques, comportementaux, de communication, de stress, d'apprentissage, de vocabulaire, de pensée et de confiance.

---

## Structure du Modèle

### Candidate Model

```typescript
interface CandidateModel {
  id: string;
  sessionId: string;
  profile: CandidateProfile;
  technical: TechnicalProfile;
  behavioral: BehavioralProfile;
  communication: CommunicationProfile;
  stress: StressProfile;
  learning: LearningProfile;
  vocabulary: VocabularyProfile;
  thinking: ThinkingProfile;
  confidence: ConfidenceProfile;
  evolution: ModelEvolution;
  lastUpdated: Date;
}
```

---

### Technical Profile

```typescript
interface TechnicalProfile {
  skills: Skill[];
  experience: ExperienceLevel;
  domains: Domain[];
  depth: TechnicalDepth;
  breadth: TechnicalBreadth;
  problemSolving: ProblemSolvingAbility;
  architecture: ArchitectureAbility;
  debugging: DebuggingAbility;
  patterns: TechnicalPattern[];
}

interface Skill {
  name: string;
  category: SkillCategory;
  level: number;
  confidence: number;
  evidence: Evidence[];
  lastMentioned: Date;
}

type SkillCategory = 
  | 'language'
  | 'framework'
  | 'database'
  | 'tool'
  | 'platform'
  | 'cloud'
  | 'devops'
  | 'security';

type ExperienceLevel = 
  | 'junior'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'principal'
  | 'staff';

type Domain = 
  | 'backend'
  | 'frontend'
  | 'fullstack'
  | 'mobile'
  | 'devops'
  | 'data'
  | 'ml'
  | 'security';

interface TechnicalDepth {
  overall: number;
  architecture: number;
  algorithms: number;
  systems: number;
  performance: number;
}

interface TechnicalBreadth {
  overall: number;
  languages: number;
  frameworks: number;
  databases: number;
  tools: number;
}

interface ProblemSolvingAbility {
  overall: number;
  analysis: number;
  creativity: number;
  methodology: number;
  speed: number;
}

interface ArchitectureAbility {
  overall: number;
  design: number;
  evolution: number;
  tradeoffs: number;
  patterns: number;
}

interface DebuggingAbility {
  overall: number;
  investigation: number;
  resolution: number;
  tools: number;
  methodology: number;
}

interface TechnicalPattern {
  type: PatternType;
  description: string;
  frequency: number;
  lastDetected: Date;
}

type PatternType = 
  | 'overengineering'
  | 'underengineering'
  | 'premature_optimization'
  | 'copy_paste'
  | 'reinventing_wheel';
```

---

### Behavioral Profile

```typescript
interface BehavioralProfile {
  teamwork: TeamworkAbility;
  leadership: LeadershipAbility;
  adaptability: AdaptabilityAbility;
  communication: CommunicationAbility;
  conflict: ConflictResolution;
  motivation: MotivationLevel;
  values: ValueSystem;
  culture: CultureFit;
}

interface TeamworkAbility {
  overall: number;
  collaboration: number;
  empathy: number;
  listening: number;
  feedback: number;
}

interface LeadershipAbility {
  overall: number;
  vision: number;
  influence: number;
  decision: number;
  development: number;
}

interface AdaptabilityAbility {
  overall: number;
  change: number;
  learning: number;
  flexibility: number;
  resilience: number;
}

interface CommunicationAbility {
  overall: number;
  clarity: number;
  conciseness: number;
  structure: number;
  audience: number;
}

interface ConflictResolution {
  overall: number;
  identification: number;
  mediation: number;
  resolution: number;
  prevention: number;
}

interface MotivationLevel {
  overall: number;
  intrinsic: number;
  extrinsic: number;
  growth: number;
  impact: number;
}

interface ValueSystem {
  values: Value[];
  alignment: number;
  consistency: number;
}

interface Value {
  name: string;
  importance: number;
  evidence: Evidence[];
}

interface CultureFit {
  overall: number;
  alignment: number;
  adaptation: number;
  contribution: number;
}
```

---

### Communication Profile

```typescript
interface CommunicationProfile {
  style: CommunicationStyle;
  clarity: ClarityLevel;
  structure: StructureLevel;
  vocabulary: VocabularyLevel;
  listening: ListeningAbility;
  nonverbal: NonverbalSignals;
}

type CommunicationStyle = 
  | 'direct'
  | 'indirect'
  | 'formal'
  | 'casual'
  | 'technical'
  | 'business';

interface ClarityLevel {
  overall: number;
  articulation: number;
  precision: number;
  simplicity: number;
}

interface StructureLevel {
  overall: number;
  organization: number;
  flow: number;
  completeness: number;
}

interface VocabularyLevel {
  overall: number;
  technical: number;
  business: number;
  variety: number;
}

interface ListeningAbility {
  overall: number;
  comprehension: number;
  retention: number;
  questioning: number;
}

interface NonverbalSignals {
  tone: ToneAnalysis;
  pace: PaceAnalysis;
  volume: VolumeAnalysis;
  pauses: PauseAnalysis;
}

interface ToneAnalysis {
  overall: string;
  confidence: number;
  enthusiasm: number;
  calmness: number;
}

interface PaceAnalysis {
  overall: number;
  speed: number;
  variability: number;
  appropriateness: number;
}

interface VolumeAnalysis {
  overall: number;
  consistency: number;
  projection: number;
}

interface PauseAnalysis {
  overall: number;
  frequency: number;
  duration: number;
  effectiveness: number;
}
```

---

### Stress Profile

```typescript
interface StressProfile {
  overall: number;
  triggers: StressTrigger[];
  responses: StressResponse[];
  management: StressManagement;
  indicators: StressIndicators;
}

interface StressTrigger {
  type: StressTriggerType;
  description: string;
  severity: number;
  frequency: number;
}

type StressTriggerType = 
  | 'technical_question'
  | 'behavioral_question'
  | 'time_pressure'
  | 'challenge'
  | 'silence'
  | 'interruption';

interface StressResponse {
  type: StressResponseType;
  description: string;
  severity: number;
  frequency: number;
}

type StressResponseType = 
  | 'hesitation'
  | 'repetition'
  | 'speed_increase'
  | 'speed_decrease'
  | 'volume_increase'
  | 'volume_decrease'
  | 'loss_clarity'
  | 'rambling';

interface StressManagement {
  overall: number;
  recovery: number;
  coping: number;
  adaptation: number;
}

interface StressIndicators {
  speech: SpeechIndicators;
  content: ContentIndicators;
  behavior: BehaviorIndicators;
}

interface SpeechIndicators {
  hesitations: number;
  repetitions: number;
  fillers: number;
  pace_variability: number;
}

interface ContentIndicators {
  vagueness: number;
  contradictions: number;
  omissions: number;
}

interface BehaviorIndicators {
  fidgeting: number;
  avoidance: number;
  defensiveness: number;
}
```

---

### Learning Profile

```typescript
interface LearningProfile {
  overall: number;
  style: LearningStyle;
  speed: LearningSpeed;
  retention: LearningRetention;
  application: LearningApplication;
  curiosity: CuriosityLevel;
  feedback: FeedbackReceptivity;
}

type LearningStyle = 
  | 'visual'
  | 'auditory'
  | 'kinesthetic'
  | 'reading'
  | 'experiential';

interface LearningSpeed {
  overall: number;
  acquisition: number;
  comprehension: number;
  mastery: number;
}

interface LearningRetention {
  overall: number;
  short_term: number;
  long_term: number;
  application: number;
}

interface LearningApplication {
  overall: number;
  transfer: number;
  adaptation: number;
  innovation: number;
}

interface CuriosityLevel {
  overall: number;
  questions: number;
  exploration: number;
  depth: number;
}

interface FeedbackReceptivity {
  overall: number;
  acceptance: number;
  implementation: number;
  improvement: number;
}
```

---

### Vocabulary Profile

```typescript
interface VocabularyProfile {
  overall: number;
  technical: TechnicalVocabulary;
  business: BusinessVocabulary;
  variety: VocabularyVariety;
  precision: VocabularyPrecision;
  evolution: VocabularyEvolution;
}

interface TechnicalVocabulary {
  level: number;
  breadth: number;
  depth: number;
  accuracy: number;
}

interface BusinessVocabulary {
  level: number;
  breadth: number;
  depth: number;
  accuracy: number;
}

interface VocabularyVariety {
  overall: number;
  diversity: number;
  sophistication: number;
  appropriateness: number;
}

interface VocabularyPrecision {
  overall: number;
  specificity: number;
  accuracy: number;
  context: number;
}

interface VocabularyEvolution {
  newTerms: string[];
  improvedUsage: string[];
  deprecatedUsage: string[];
}
```

---

### Thinking Profile

```typescript
interface ThinkingProfile {
  style: ThinkingStyle;
  depth: ThinkingDepth;
  structure: ThinkingStructure;
  creativity: ThinkingCreativity;
  logic: ThinkingLogic;
  speed: ThinkingSpeed;
}

type ThinkingStyle = 
  | 'analytical'
  | 'creative'
  | 'practical'
  | 'strategic'
  | 'intuitive';

interface ThinkingDepth {
  overall: number;
  analysis: number;
  synthesis: number;
  evaluation: number;
}

interface ThinkingStructure {
  overall: number;
  organization: number;
  flow: number;
  completeness: number;
}

interface ThinkingCreativity {
  overall: number;
  innovation: number;
  originality: number;
  flexibility: number;
}

interface ThinkingLogic {
  overall: number;
  reasoning: number;
  consistency: number;
  validity: number;
}

interface ThinkingSpeed {
  overall: number;
  processing: number;
  response: number;
  decision: number;
}
```

---

### Confidence Profile

```typescript
interface ConfidenceProfile {
  overall: number;
  technical: TechnicalConfidence;
  behavioral: BehavioralConfidence;
  communication: CommunicationConfidence;
  stability: ConfidenceStability;
  evolution: ConfidenceEvolution;
}

interface TechnicalConfidence {
  overall: number;
  skills: number;
  knowledge: number;
  problem_solving: number;
}

interface BehavioralConfidence {
  overall: number;
  leadership: number;
  teamwork: number;
  communication: number;
}

interface CommunicationConfidence {
  overall: number;
  articulation: number;
  clarity: number;
  assertiveness: number;
}

interface ConfidenceStability {
  overall: number;
  consistency: number;
  resilience: number;
  adaptability: number;
}

interface ConfidenceEvolution {
  trend: ConfidenceTrend;
  triggers: ConfidenceTrigger[];
  responses: ConfidenceResponse[];
}

type ConfidenceTrend = 
  | 'increasing'
  | 'decreasing'
  | 'stable'
  | 'fluctuating';

interface ConfidenceTrigger {
  type: ConfidenceTriggerType;
  description: string;
  impact: number;
}

type ConfidenceTriggerType = 
  | 'success'
  | 'failure'
  | 'challenge'
  | 'feedback'
  | 'recognition';

interface ConfidenceResponse {
  type: ConfidenceResponseType;
  description: string;
  effectiveness: number;
}

type ConfidenceResponseType = 
  | 'boosted'
  | 'diminished'
  | 'maintained'
  | 'recovered';
```

---

### Model Evolution

```typescript
interface ModelEvolution {
  version: number;
  changes: ModelChange[];
  trends: ModelTrend[];
  predictions: ModelPrediction[];
}

interface ModelChange {
  component: string;
  oldValue: any;
  newValue: any;
  reason: string;
  timestamp: Date;
}

interface ModelTrend {
  component: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  rate: number;
  confidence: number;
}

interface ModelPrediction {
  component: string;
  predictedValue: number;
  confidence: number;
  timeframe: string;
}
```

---

## Mise à jour du Modèle

### Model Update Engine

```typescript
interface CandidateModelUpdateEngine {
  updateFromAnswer(answer: Answer, question: Question): void;
  updateFromRelance(relance: Relance, answer: Answer): void;
  updateFromEvaluation(evaluation: Evaluation): void;
  updateFromStress(stress: StressProfile): void;
  updateFromConfidence(confidence: ConfidenceProfile): void;
  detectTrends(): ModelTrend[];
  predictFuture(): ModelPrediction[];
}

class CandidateModelUpdater implements CandidateModelUpdateEngine {
  constructor(private model: CandidateModel) {}

  updateFromAnswer(answer: Answer, question: Question): void {
    // Mettre à jour le profil technique
    this.updateTechnicalProfile(answer, question);
    
    // Mettre à jour le profil comportemental
    this.updateBehavioralProfile(answer, question);
    
    // Mettre à jour le profil de communication
    this.updateCommunicationProfile(answer);
    
    // Mettre à jour le profil de stress
    this.updateStressProfile(answer);
    
    // Mettre à jour le profil de confiance
    this.updateConfidenceProfile(answer);
    
    // Mettre à jour le profil de vocabulaire
    this.updateVocabularyProfile(answer);
    
    // Mettre à jour le profil de pensée
    this.updateThinkingProfile(answer);
    
    // Enregistrer l'évolution
    this.recordEvolution('answer', answer);
  }

  updateTechnicalProfile(answer: Answer, question: Question): void {
    const competency = question.competency;
    
    // Mettre à jour les compétences
    answer.signals.forEach(signal => {
      if (signal.type === 'evidence' || signal.type === 'technical_depth') {
        this.updateSkill(competency, signal.strength);
      }
    });
  }

  updateBehavioralProfile(answer: Answer, question: Question): void {
    // Analyser les signaux comportementaux
    answer.signals.forEach(signal => {
      if (signal.type === 'leadership') {
        this.model.behavioral.leadership.overall += signal.strength * 0.1;
      }
      if (signal.type === 'teamwork') {
        this.model.behavioral.teamwork.overall += signal.strength * 0.1;
      }
    });
  }

  updateCommunicationProfile(answer: Answer): void {
    // Analyser la clarté
    if (answer.text.length > 50 && answer.text.length < 500) {
      this.model.communication.clarity.overall += 0.05;
    }
    
    // Analyser la structure
    if (answer.text.includes('first') && answer.text.includes('then') && answer.text.includes('finally')) {
      this.model.communication.structure.overall += 0.1;
    }
  }

  updateStressProfile(answer: Answer): void {
    // Analyser les signaux de stress
    answer.signals.forEach(signal => {
      if (signal.type === 'stressed') {
        this.model.stress.overall += signal.strength * 0.2;
      }
    });
  }

  updateConfidenceProfile(answer: Answer): void {
    // Analyser la confiance
    answer.signals.forEach(signal => {
      if (signal.type === 'confident') {
        this.model.confidence.overall += signal.strength * 0.1;
      }
      if (signal.type === 'underconfident') {
        this.model.confidence.overall -= signal.strength * 0.1;
      }
    });
  }

  updateVocabularyProfile(answer: Answer): void {
    // Analyser le vocabulaire
    const technicalTerms = extractTechnicalTerms(answer.text);
    this.model.vocabulary.technical.breadth += technicalTerms.length * 0.01;
  }

  updateThinkingProfile(answer: Answer): void {
    // Analyser le style de pensée
    if (answer.text.includes('however') && answer.text.includes('therefore')) {
      this.model.thinking.logic.overall += 0.1;
    }
  }

  recordEvolution(source: string, data: any): void {
    const change: ModelChange = {
      component: source,
      oldValue: this.model,
      newValue: this.model,
      reason: `Updated from ${source}`,
      timestamp: new Date()
    };
    
    this.model.evolution.changes.push(change);
    this.model.evolution.version++;
    this.model.lastUpdated = new Date();
  }

  detectTrends(): ModelTrend[] {
    const trends: ModelTrend[] = [];
    
    // Analyser les changements
    this.model.evolution.changes.forEach(change => {
      const trend = this.analyzeTrend(change);
      if (trend) {
        trends.push(trend);
      }
    });
    
    return trends;
  }

  analyzeTrend(change: ModelChange): ModelTrend | null {
    // Analyser la tendance pour chaque composant
    const componentChanges = this.model.evolution.changes.filter(c => c.component === change.component);
    
    if (componentChanges.length < 2) return null;
    
    const firstChange = componentChanges[0];
    const lastChange = componentChanges[componentChanges.length - 1];
    
    const direction = lastChange.newValue > firstChange.oldValue ? 'increasing' : 
                     lastChange.newValue < firstChange.oldValue ? 'decreasing' : 'stable';
    
    return {
      component: change.component,
      direction,
      rate: 0.1,
      confidence: 0.8
    };
  }

  predictFuture(): ModelPrediction[] {
    const predictions: ModelPrediction[] = [];
    
    // Prédire l'évolution de chaque composant
    const trends = this.detectTrends();
    
    trends.forEach(trend => {
      const currentValue = this.getComponentValue(trend.component);
      const predictedValue = currentValue + (trend.rate * 10);
      
      predictions.push({
        component: trend.component,
        predictedValue,
        confidence: trend.confidence,
        timeframe: '10_turns'
      });
    });
    
    return predictions;
  }

  getComponentValue(component: string): number {
    switch (component) {
      case 'technical':
        return this.model.technical.depth.overall;
      case 'behavioral':
        return this.model.behavioral.leadership.overall;
      case 'communication':
        return this.model.communication.clarity.overall;
      case 'stress':
        return this.model.stress.overall;
      case 'confidence':
        return this.model.confidence.overall;
      default:
        return 0;
    }
  }

  updateFromRelance(relance: Relance, answer: Answer): void {
    // Mettre à jour le modèle après une relance
    this.updateFromAnswer(answer, relance as any);
  }

  updateFromEvaluation(evaluation: Evaluation): void {
    // Mettre à jour le modèle après une évaluation
    evaluation.competencyScores.forEach((score, competency) => {
      this.updateSkill(competency, score.score / 100);
    });
  }

  updateFromStress(stress: StressProfile): void {
    // Mettre à jour le profil de stress
    this.model.stress = stress;
  }

  updateFromConfidence(confidence: ConfidenceProfile): void {
    // Mettre à jour le profil de confiance
    this.model.confidence = confidence;
  }

  private updateSkill(competency: string, strength: number): void {
    const skill = this.model.technical.skills.find(s => s.name === competency);
    if (skill) {
      skill.level = Math.min(100, skill.level + strength * 10);
      skill.confidence = Math.min(1, skill.confidence + strength * 0.1);
      skill.lastMentioned = new Date();
    } else {
      this.model.technical.skills.push({
        name: competency,
        category: 'technical',
        level: strength * 10,
        confidence: strength * 0.1,
        evidence: [],
        lastMentioned: new Date()
      });
    }
  }
}

function extractTechnicalTerms(text: string): string[] {
  const technicalTerms = [
    'api', 'database', 'framework', 'algorithm', 'architecture',
    'microservices', 'scalability', 'performance', 'latency', 'throughput',
    'sql', 'nosql', 'redis', 'kubernetes', 'docker', 'aws', 'azure', 'gcp'
  ];
  
  return technicalTerms.filter(term => text.toLowerCase().includes(term));
}
```

---

## Conclusion

Le Candidate Model spécifie le modèle dynamique du candidat qui évolue pendant la session avec :

1. **Structure du modèle** : profile, technical, behavioral, communication, stress, learning, vocabulary, thinking, confidence, evolution
2. **Technical Profile** : skills, experience, domains, depth, breadth, problem solving, architecture, debugging, patterns
3. **Behavioral Profile** : teamwork, leadership, adaptability, communication, conflict, motivation, values, culture
4. **Communication Profile** : style, clarity, structure, vocabulary, listening, nonverbal
5. **Stress Profile** : overall, triggers, responses, management, indicators
6. **Learning Profile** : overall, style, speed, retention, application, curiosity, feedback
7. **Vocabulary Profile** : overall, technical, business, variety, precision, evolution
8. **Thinking Profile** : style, depth, structure, creativity, logic, speed
9. **Confidence Profile** : overall, technical, behavioral, communication, stability, evolution
10. **Model Evolution** : version, changes, trends, predictions
11. **Model Update Engine** : updateFromAnswer, updateFromRelance, updateFromEvaluation, detectTrends, predictFuture

Ce document fournit une spécification exécutable pour implémenter le modèle dynamique du candidat.
