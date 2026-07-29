# ETS-038 Analytics Engine

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le moteur d'analytics qui analyse les données des entretiens pour générer des insights, des rapports et des recommandations. Il définit comment collecter, traiter et analyser les données pour améliorer la plateforme.

---

## Architecture du Analytics Engine

### Analytics Engine

```typescript
interface AnalyticsEngine {
  dataCollection: AnalyticsDataCollection;
  dataProcessing: AnalyticsDataProcessing;
  analysis: AnalyticsAnalysis;
  reporting: AnalyticsReporting;
  insights: AnalyticsInsights;
  recommendations: AnalyticsRecommendations;
}
```

---

## Data Collection

### Analytics Data Collection Interface

```typescript
interface AnalyticsDataCollection {
  collectSessionMetrics(session: InterviewSession): SessionMetrics;
  collectQuestionMetrics(question: Question, answer: Answer): QuestionMetrics;
  collectEvaluationMetrics(evaluation: Evaluation): EvaluationMetrics;
  collectBehavioralMetrics(behavior: BehavioralProfile): BehavioralMetrics;
  collectStressMetrics(stress: StressProfile): StressMetrics;
  collectConfidenceMetrics(confidence: ConfidenceProfile): ConfidenceMetrics;
  collectSystemMetrics(system: SystemMetrics): SystemMetrics;
  storeMetrics(metrics: AnalyticsMetrics): void;
  retrieveMetrics(query: MetricsQuery): AnalyticsMetrics[];
}

interface SessionMetrics {
  sessionId: string;
  userId: string;
  scenario: ScenarioType;
  persona: PersonaType;
  duration: number;
  turnCount: number;
  overallScore: number;
  competencyScores: Map<CompetencyType, number>;
  difficulty: DifficultyAxes;
  stress: number;
  confidence: number;
  timestamp: Date;
}

interface QuestionMetrics {
  questionId: string;
  competency: CompetencyType;
  difficulty: number;
  responseTime: number;
  answerLength: number;
  score: number;
  signals: Signal[];
  relanceCount: number;
  timestamp: Date;
}

interface EvaluationMetrics {
  evaluationId: string;
  competency: CompetencyType;
  score: number;
  confidence: number;
  evidenceCount: number;
  evaluationTime: number;
  timestamp: Date;
}

interface BehavioralMetrics {
  userId: string;
  sessionId: string;
  teamwork: number;
  leadership: number;
  adaptability: number;
  communication: number;
  conflict: number;
  motivation: number;
  timestamp: Date;
}

interface StressMetrics {
  userId: string;
  sessionId: string;
  overall: number;
  triggerCount: number;
  responseCount: number;
  managementScore: number;
  timestamp: Date;
}

interface ConfidenceMetrics {
  userId: string;
  sessionId: string;
  overall: number;
  technical: number;
  behavioral: number;
  communication: number;
  stability: number;
  timestamp: Date;
}

interface SystemMetrics {
  sessionId: string;
  latency: number;
  tokenUsage: number;
  errorCount: number;
  uptime: number;
  timestamp: Date;
}

interface AnalyticsMetrics {
  type: 'session' | 'question' | 'evaluation' | 'behavioral' | 'stress' | 'confidence' | 'system';
  data: SessionMetrics | QuestionMetrics | EvaluationMetrics | BehavioralMetrics | StressMetrics | ConfidenceMetrics | SystemMetrics;
  timestamp: Date;
}

interface MetricsQuery {
  type?: AnalyticsMetrics['type'];
  userId?: string;
  sessionId?: string;
  competency?: CompetencyType;
  from?: Date;
  to?: Date;
}
```

---

### Analytics Data Collection Implementation

```typescript
class AnalyticsDataCollectionImpl implements AnalyticsDataCollection {
  private storage: Map<string, AnalyticsMetrics[]> = new Map();

  collectSessionMetrics(session: InterviewSession): SessionMetrics {
    const metrics: SessionMetrics = {
      sessionId: session.sessionId,
      userId: session.userId,
      scenario: session.scenario,
      persona: session.persona,
      duration: session.duration,
      turnCount: session.turnCount,
      overallScore: session.overallScore,
      competencyScores: session.competencyScores,
      difficulty: session.difficulty,
      stress: session.stress.overall,
      confidence: session.confidence.overall,
      timestamp: new Date()
    };

    this.storeMetrics({
      type: 'session',
      data: metrics,
      timestamp: new Date()
    });

    return metrics;
  }

  collectQuestionMetrics(question: Question, answer: Answer): QuestionMetrics {
    const metrics: QuestionMetrics = {
      questionId: question.id,
      competency: question.competencies[0],
      difficulty: question.difficulty,
      responseTime: answer.duration,
      answerLength: answer.text.length,
      score: 0,
      signals: answer.signals,
      relanceCount: 0,
      timestamp: new Date()
    };

    this.storeMetrics({
      type: 'question',
      data: metrics,
      timestamp: new Date()
    });

    return metrics;
  }

  collectEvaluationMetrics(evaluation: Evaluation): EvaluationMetrics {
    const metrics: EvaluationMetrics = {
      evaluationId: evaluation.id,
      competency: evaluation.competency,
      score: evaluation.score,
      confidence: evaluation.confidence,
      evidenceCount: evaluation.evidence.length,
      evaluationTime: 0,
      timestamp: new Date()
    };

    this.storeMetrics({
      type: 'evaluation',
      data: metrics,
      timestamp: new Date()
    });

    return metrics;
  }

  collectBehavioralMetrics(behavior: BehavioralProfile): BehavioralMetrics {
    const metrics: BehavioralMetrics = {
      userId: '',
      sessionId: '',
      teamwork: behavior.teamwork.overall,
      leadership: behavior.leadership.overall,
      adaptability: behavior.adaptability.overall,
      communication: behavior.communication.overall,
      conflict: behavior.conflict.overall,
      motivation: behavior.motivation.overall,
      timestamp: new Date()
    };

    this.storeMetrics({
      type: 'behavioral',
      data: metrics,
      timestamp: new Date()
    });

    return metrics;
  }

  collectStressMetrics(stress: StressProfile): StressMetrics {
    const metrics: StressMetrics = {
      userId: '',
      sessionId: '',
      overall: stress.overall,
      triggerCount: stress.triggers.length,
      responseCount: stress.responses.length,
      managementScore: stress.management.overall,
      timestamp: new Date()
    };

    this.storeMetrics({
      type: 'stress',
      data: metrics,
      timestamp: new Date()
    });

    return metrics;
  }

  collectConfidenceMetrics(confidence: ConfidenceProfile): ConfidenceMetrics {
    const metrics: ConfidenceMetrics = {
      userId: '',
      sessionId: '',
      overall: confidence.overall,
      technical: confidence.technical.overall,
      behavioral: confidence.behavioral.overall,
      communication: confidence.communication.overall,
      stability: confidence.stability.overall,
      timestamp: new Date()
    };

    this.storeMetrics({
      type: 'confidence',
      data: metrics,
      timestamp: new Date()
    });

    return metrics;
  }

  collectSystemMetrics(system: SystemMetrics): SystemMetrics {
    this.storeMetrics({
      type: 'system',
      data: system,
      timestamp: new Date()
    });

    return system;
  }

  storeMetrics(metrics: AnalyticsMetrics): void {
    const key = metrics.type;
    if (!this.storage.has(key)) {
      this.storage.set(key, []);
    }
    this.storage.get(key)!.push(metrics);
  }

  retrieveMetrics(query: MetricsQuery): AnalyticsMetrics[] {
    let results: AnalyticsMetrics[] = [];

    if (query.type) {
      results = this.storage.get(query.type) || [];
    } else {
      this.storage.forEach((data) => {
        results.push(...data);
      });
    }

    // Filtrer par userId
    if (query.userId) {
      results = results.filter(m => {
        if (m.type === 'session') {
          return (m.data as SessionMetrics).userId === query.userId;
        }
        return false;
      });
    }

    // Filtrer par sessionId
    if (query.sessionId) {
      results = results.filter(m => {
        if (m.type === 'session') {
          return (m.data as SessionMetrics).sessionId === query.sessionId;
        }
        return false;
      });
    }

    // Filtrer par competency
    if (query.competency) {
      results = results.filter(m => {
        if (m.type === 'question') {
          return (m.data as QuestionMetrics).competency === query.competency;
        }
        if (m.type === 'evaluation') {
          return (m.data as EvaluationMetrics).competency === query.competency;
        }
        return false;
      });
    }

    // Filtrer par date
    if (query.from || query.to) {
      results = results.filter(m => {
        if (query.from && m.timestamp < query.from!) return false;
        if (query.to && m.timestamp > query.to!) return false;
        return true;
      });
    }

    return results;
  }
}
```

---

## Data Processing

### Analytics Data Processing Interface

```typescript
interface AnalyticsDataProcessing {
  aggregateMetrics(metrics: AnalyticsMetrics[], aggregation: AggregationType): AggregatedMetrics;
  filterMetrics(metrics: AnalyticsMetrics[], filter: MetricsFilter): AnalyticsMetrics[];
  transformMetrics(metrics: AnalyticsMetrics[], transformation: MetricsTransformation): AnalyticsMetrics[];
  normalizeMetrics(metrics: AnalyticsMetrics[]): AnalyticsMetrics[];
  enrichMetrics(metrics: AnalyticsMetrics[], enrichment: MetricsEnrichment): AnalyticsMetrics[];
}

type AggregationType = 
  | 'sum'
  | 'average'
  | 'min'
  | 'max'
  | 'count'
  | 'median'
  | 'percentile';

interface AggregatedMetrics {
  type: string;
  aggregation: AggregationType;
  value: number;
  count: number;
  timestamp: Date;
}

interface MetricsFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
  value: any;
}

interface MetricsTransformation {
  type: 'map' | 'reduce' | 'group' | 'pivot';
  function: string;
}

interface MetricsEnrichment {
  type: 'join' | 'lookup' | 'calculate';
  source: string;
  field: string;
}
```

---

### Analytics Data Processing Implementation

```typescript
class AnalyticsDataProcessingImpl implements AnalyticsDataProcessing {
  aggregateMetrics(metrics: AnalyticsMetrics[], aggregation: AggregationType): AggregatedMetrics {
    const values = metrics.map(m => {
      switch (m.type) {
        case 'session':
          return (m.data as SessionMetrics).overallScore;
        case 'question':
          return (m.data as QuestionMetrics).score;
        case 'evaluation':
          return (m.data as EvaluationMetrics).score;
        default:
          return 0;
      }
    });

    let value: number;
    switch (aggregation) {
      case 'sum':
        value = values.reduce((sum, v) => sum + v, 0);
        break;
      case 'average':
        value = values.reduce((sum, v) => sum + v, 0) / values.length;
        break;
      case 'min':
        value = Math.min(...values);
        break;
      case 'max':
        value = Math.max(...values);
        break;
      case 'count':
        value = values.length;
        break;
      case 'median':
        value = this.calculateMedian(values);
        break;
      case 'percentile':
        value = this.calculatePercentile(values, 95);
        break;
    }

    return {
      type: metrics[0].type,
      aggregation,
      value,
      count: values.length,
      timestamp: new Date()
    };
  }

  filterMetrics(metrics: AnalyticsMetrics[], filter: MetricsFilter): AnalyticsMetrics[] {
    return metrics.filter(m => {
      const fieldValue = this.getFieldValue(m, filter.field);
      
      switch (filter.operator) {
        case 'eq':
          return fieldValue === filter.value;
        case 'ne':
          return fieldValue !== filter.value;
        case 'gt':
          return fieldValue > filter.value;
        case 'lt':
          return fieldValue < filter.value;
        case 'gte':
          return fieldValue >= filter.value;
        case 'lte':
          return fieldValue <= filter.value;
        case 'contains':
          return String(fieldValue).includes(String(filter.value));
        default:
          return false;
      }
    });
  }

  transformMetrics(metrics: AnalyticsMetrics[], transformation: MetricsTransformation): AnalyticsMetrics[] {
    switch (transformation.type) {
      case 'map':
        return metrics.map(m => this.applyMap(m, transformation.function));
      case 'reduce':
        return [this.applyReduce(metrics, transformation.function)];
      case 'group':
        return this.applyGroup(metrics, transformation.function);
      case 'pivot':
        return this.applyPivot(metrics, transformation.function);
      default:
        return metrics;
    }
  }

  normalizeMetrics(metrics: AnalyticsMetrics[]): AnalyticsMetrics[] {
    return metrics.map(m => {
      const normalized = { ...m };
      
      switch (m.type) {
        case 'session':
          const sessionData = m.data as SessionMetrics;
          sessionData.overallScore = sessionData.overallScore / 100;
          break;
        case 'question':
          const questionData = m.data as QuestionMetrics;
          questionData.score = questionData.score / 100;
          break;
        case 'evaluation':
          const evaluationData = m.data as EvaluationMetrics;
          evaluationData.score = evaluationData.score / 100;
          break;
      }
      
      return normalized;
    });
  }

  enrichMetrics(metrics: AnalyticsMetrics[], enrichment: MetricsEnrichment): AnalyticsMetrics[] {
    return metrics.map(m => {
      const enriched = { ...m };
      
      switch (enrichment.type) {
        case 'calculate':
          enriched.data = this.calculateField(m.data, enrichment.field);
          break;
        case 'lookup':
          enriched.data = this.lookupField(m.data, enrichment.source, enrichment.field);
          break;
        case 'join':
          enriched.data = this.joinField(m.data, enrichment.source, enrichment.field);
          break;
      }
      
      return enriched;
    });
  }

  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  private getFieldValue(metric: AnalyticsMetrics, field: string): any {
    const data = metric.data;
    return (data as any)[field];
  }

  private applyMap(metric: AnalyticsMetrics, func: string): AnalyticsMetrics {
    return metric;
  }

  private applyReduce(metrics: AnalyticsMetrics[], func: string): AnalyticsMetrics {
    return metrics[0];
  }

  private applyGroup(metrics: AnalyticsMetrics[], func: string): AnalyticsMetrics[] {
    return metrics;
  }

  private applyPivot(metrics: AnalyticsMetrics[], func: string): AnalyticsMetrics[] {
    return metrics;
  }

  private calculateField(data: any, field: string): any {
    return data;
  }

  private lookupField(data: any, source: string, field: string): any {
    return data;
  }

  private joinField(data: any, source: string, field: string): any {
    return data;
  }
}
```

---

## Analytics Analysis

### Analytics Analysis Interface

```typescript
interface AnalyticsAnalysis {
  analyzeSession(sessionId: string): SessionAnalysis;
  analyzeCompetency(competency: CompetencyType): CompetencyAnalysis;
  analyzeScenario(scenario: ScenarioType): ScenarioAnalysis;
  analyzePersona(persona: PersonaType): PersonaAnalysis;
  analyzeTrends(metrics: AnalyticsMetrics[]): TrendAnalysis;
  analyzeCorrelations(metrics: AnalyticsMetrics[]): CorrelationAnalysis;
  analyzeAnomalies(metrics: AnalyticsMetrics[]): AnomalyAnalysis;
}

interface SessionAnalysis {
  sessionId: string;
  overallScore: number;
  competencyScores: Map<CompetencyType, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  timestamp: Date;
}

interface CompetencyAnalysis {
  competency: CompetencyType;
  averageScore: number;
  distribution: ScoreDistribution;
  trends: CompetencyTrend[];
  correlations: CompetencyCorrelation[];
  recommendations: string[];
}

interface ScenarioAnalysis {
  scenario: ScenarioType;
  averageScore: number;
  completionRate: number;
  averageDuration: number;
  competencyPerformance: Map<CompetencyType, number>;
  recommendations: string[];
}

interface PersonaAnalysis {
  persona: PersonaType;
  averageScore: number;
  satisfaction: number;
  effectiveness: number;
  recommendations: string[];
}

interface TrendAnalysis {
  metric: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  rate: number;
  confidence: number;
  prediction: TrendPrediction;
}

interface CorrelationAnalysis {
  metric1: string;
  metric2: string;
  correlation: number;
  significance: number;
  interpretation: string;
}

interface AnomalyAnalysis {
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
}

interface ScoreDistribution {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  percentiles: Map<number, number>;
}

interface CompetencyTrend {
  period: string;
  score: number;
  change: number;
}

interface CompetencyCorrelation {
  competency: CompetencyType;
  correlation: number;
  significance: number;
}

interface TrendPrediction {
  futureValue: number;
  confidence: number;
  timeframe: string;
}
```

---

### Analytics Analysis Implementation

```typescript
class AnalyticsAnalysisImpl implements AnalyticsAnalysis {
  constructor(
    private dataCollection: AnalyticsDataCollection,
    private dataProcessing: AnalyticsDataProcessing
  ) {}

  analyzeSession(sessionId: string): SessionAnalysis {
    const sessionMetrics = <SessionMetrics[]>this.dataCollection.retrieveMetrics({
      type: 'session',
      sessionId
    });

    if (sessionMetrics.length === 0) {
      throw new Error(`No metrics found for session ${sessionId}`);
    }

    const session = sessionMetrics[0];

    // Analyser les scores de compétences
    const competencyScores = session.competencyScores;
    
    // Identifier les forces
    const strengths = this.identifyStrengths(competencyScores);
    
    // Identifier les faiblesses
    const weaknesses = this.identifyWeaknesses(competencyScores);
    
    // Générer des recommandations
    const recommendations = this.generateRecommendations(competencyScores);

    return {
      sessionId,
      overallScore: session.overallScore,
      competencyScores,
      strengths,
      weaknesses,
      recommendations,
      timestamp: new Date()
    };
  }

  analyzeCompetency(competency: CompetencyType): CompetencyAnalysis {
    const questionMetrics = <QuestionMetrics[]>this.dataCollection.retrieveMetrics({
      type: 'question',
      competency
    });

    const evaluationMetrics = <EvaluationMetrics[]>this.dataCollection.retrieveMetrics({
      type: 'evaluation',
      competency
    });

    // Calculer le score moyen
    const scores = [...questionMetrics.map(m => m.score), ...evaluationMetrics.map(m => m.score)];
    const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

    // Calculer la distribution
    const distribution = this.calculateDistribution(scores);

    // Analyser les tendances
    const trends = this.analyzeCompetencyTrends(competency);

    // Analyser les corrélations
    const correlations = this.analyzeCompetencyCorrelations(competency);

    // Générer des recommandations
    const recommendations = this.generateCompetencyRecommendations(competency, averageScore);

    return {
      competency,
      averageScore,
      distribution,
      trends,
      correlations,
      recommendations
    };
  }

  analyzeScenario(scenario: ScenarioType): ScenarioAnalysis {
    const sessionMetrics = <SessionMetrics[]>this.dataCollection.retrieveMetrics({
      type: 'session'
    });

    const scenarioSessions = sessionMetrics.filter(s => s.scenario === scenario);

    if (scenarioSessions.length === 0) {
      throw new Error(`No sessions found for scenario ${scenario}`);
    }

    // Calculer le score moyen
    const averageScore = scenarioSessions.reduce((sum, s) => sum + s.overallScore, 0) / scenarioSessions.length;

    // Calculer le taux de complétion
    const completionRate = 1.0; // À implémenter

    // Calculer la durée moyenne
    const averageDuration = scenarioSessions.reduce((sum, s) => sum + s.duration, 0) / scenarioSessions.length;

    // Analyser la performance par compétence
    const competencyPerformance = this.calculateCompetencyPerformance(scenarioSessions);

    // Générer des recommandations
    const recommendations = this.generateScenarioRecommendations(scenario, averageScore);

    return {
      scenario,
      averageScore,
      completionRate,
      averageDuration,
      competencyPerformance,
      recommendations
    };
  }

  analyzePersona(persona: PersonaType): PersonaAnalysis {
    const sessionMetrics = <SessionMetrics[]>this.dataCollection.retrieveMetrics({
      type: 'session'
    });

    const personaSessions = sessionMetrics.filter(s => s.persona === persona);

    if (personaSessions.length === 0) {
      throw new Error(`No sessions found for persona ${persona}`);
    }

    // Calculer le score moyen
    const averageScore = personaSessions.reduce((sum, s) => sum + s.overallScore, 0) / personaSessions.length;

    // Calculer la satisfaction
    const satisfaction = 0.8; // À implémenter

    // Calculer l'efficacité
    const effectiveness = 0.85; // À implémenter

    // Générer des recommandations
    const recommendations = this.generatePersonaRecommendations(persona, averageScore);

    return {
      persona,
      averageScore,
      satisfaction,
      effectiveness,
      recommendations
    };
  }

  analyzeTrends(metrics: AnalyticsMetrics[]): TrendAnalysis {
    // Analyser les tendances
    const values = metrics.map(m => {
      switch (m.type) {
        case 'session':
          return (m.data as SessionMetrics).overallScore;
        case 'question':
          return (m.data as QuestionMetrics).score;
        case 'evaluation':
          return (m.data as EvaluationMetrics).score;
        default:
          return 0;
      }
    });

    const direction = this.calculateTrendDirection(values);
    const rate = this.calculateTrendRate(values);
    const confidence = this.calculateTrendConfidence(values);
    const prediction = this.makeTrendPrediction(values);

    return {
      metric: metrics[0].type,
      direction,
      rate,
      confidence,
      prediction
    };
  }

  analyzeCorrelations(metrics: AnalyticsMetrics[]): CorrelationAnalysis {
    // Analyser les corrélations
    const correlation = 0.5; // À implémenter
    const significance = 0.05; // À implémenter
    const interpretation = this.interpretCorrelation(correlation);

    return {
      metric1: 'score',
      metric2: 'duration',
      correlation,
      significance,
      interpretation
    };
  }

  analyzeAnomalies(metrics: AnalyticsMetrics[]): AnomalyAnalysis {
    // Analyser les anomalies
    const values = metrics.map(m => {
      switch (m.type) {
        case 'session':
          return (m.data as SessionMetrics).overallScore;
        case 'question':
          return (m.data as QuestionMetrics).score;
        case 'evaluation':
          return (m.data as EvaluationMetrics).score;
        default:
          return 0;
      }
    });

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);

    const anomalies: AnomalyAnalysis[] = [];

    values.forEach((value, index) => {
      const deviation = Math.abs(value - mean) / stdDev;
      if (deviation > 2) {
        anomalies.push({
          metric: metrics[index].type,
          value,
          expected: mean,
          deviation,
          severity: deviation > 3 ? 'high' : 'medium',
          explanation: `Value is ${deviation.toFixed(2)} standard deviations from the mean`
        });
      }
    });

    return anomalies[0] || {
      metric: 'none',
      value: 0,
      expected: 0,
      deviation: 0,
      severity: 'low',
      explanation: 'No anomalies detected'
    };
  }

  private identifyStrengths(competencyScores: Map<CompetencyType, number>): string[] {
    const strengths: string[] = [];
    competencyScores.forEach((score, competency) => {
      if (score >= 70) {
        strengths.push(competency);
      }
    });
    return strengths;
  }

  private identifyWeaknesses(competencyScores: Map<CompetencyType, number>): string[] {
    const weaknesses: string[] = [];
    competencyScores.forEach((score, competency) => {
      if (score < 50) {
        weaknesses.push(competency);
      }
    });
    return weaknesses;
  }

  private generateRecommendations(competencyScores: Map<CompetencyType, number>): string[] {
    const recommendations: string[] = [];
    competencyScores.forEach((score, competency) => {
      if (score < 50) {
        recommendations.push(`Improve ${competency} through targeted practice`);
      } else if (score < 70) {
        recommendations.push(`Strengthen ${competency} with additional exercises`);
      }
    });
    return recommendations;
  }

  private calculateDistribution(scores: number[]): ScoreDistribution {
    const sorted = [...scores].sort((a, b) => a - b);
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const median = this.calculateMedian(sorted);
    const stdDev = Math.sqrt(scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length);

    const percentiles = new Map<number, number>();
    percentiles.set(25, this.calculatePercentile(sorted, 25));
    percentiles.set(50, median);
    percentiles.set(75, this.calculatePercentile(sorted, 75));
    percentiles.set(90, this.calculatePercentile(sorted, 90));
    percentiles.set(95, this.calculatePercentile(sorted, 95));

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean,
      median,
      stdDev,
      percentiles
    };
  }

  private analyzeCompetencyTrends(competency: CompetencyType): CompetencyTrend[] {
    return [];
  }

  private analyzeCompetencyCorrelations(competency: CompetencyType): CompetencyCorrelation[] {
    return [];
  }

  private generateCompetencyRecommendations(competency: CompetencyType, score: number): string[] {
    if (score < 50) {
      return [`Focus on improving ${competency} fundamentals`, `Practice ${competency} exercises`];
    } else if (score < 70) {
      return [`Strengthen ${competency} with advanced exercises`, `Apply ${competency} in real-world scenarios`];
    } else {
      return [`Maintain ${competency} excellence`, `Mentor others in ${competency}`];
    }
  }

  private calculateCompetencyPerformance(sessions: SessionMetrics[]): Map<CompetencyType, number> {
    const performance = new Map<CompetencyType, number>();
    sessions.forEach(session => {
      session.competencyScores.forEach((score, competency) => {
        const current = performance.get(competency) || 0;
        performance.set(competency, (current + score) / 2);
      });
    });
    return performance;
  }

  private generateScenarioRecommendations(scenario: ScenarioType, score: number): string[] {
    if (score < 50) {
      return [`Review ${scenario} difficulty settings`, `Provide more hints and guidance`];
    } else if (score < 70) {
      return [`Optimize ${scenario} for better engagement`, `Adjust question complexity`];
    } else {
      return [`Maintain ${scenario} effectiveness`, `Consider increasing difficulty`];
    }
  }

  private generatePersonaRecommendations(persona: PersonaType, score: number): string[] {
    if (score < 50) {
      return [`Review ${persona} configuration`, `Adjust challenge level`];
    } else if (score < 70) {
      return [`Fine-tune ${persona} parameters`, `Improve question selection`];
    } else {
      return [`Maintain ${persona} excellence`, `Consider expanding ${persona} capabilities`];
    }
  }

  private calculateTrendDirection(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    
    if (diff > 0.05) return 'increasing';
    if (diff < -0.05) return 'decreasing';
    return 'stable';
  }

  private calculateTrendRate(values: number[]): number {
    return 0.01;
  }

  private calculateTrendConfidence(values: number[]): number {
    return 0.8;
  }

  private makeTrendPrediction(values: number[]): TrendPrediction {
    const lastValue = values[values.length - 1];
    return {
      futureValue: lastValue * 1.01,
      confidence: 0.8,
      timeframe: '1_month'
    };
  }

  private interpretCorrelation(correlation: number): string {
    if (correlation > 0.7) return 'Strong positive correlation';
    if (correlation > 0.3) return 'Moderate positive correlation';
    if (correlation > -0.3) return 'Weak correlation';
    if (correlation > -0.7) return 'Moderate negative correlation';
    return 'Strong negative correlation';
  }

  private calculateMedian(values: number[]): number {
    const mid = Math.floor(values.length / 2);
    return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * values.length) - 1;
    return values[index];
  }
}
```

---

## Reporting

### Analytics Reporting Interface

```typescript
interface AnalyticsReporting {
  generateSessionReport(sessionId: string): SessionReport;
  generateCompetencyReport(competency: CompetencyType): CompetencyReport;
  generateScenarioReport(scenario: ScenarioType): ScenarioReport;
  generatePersonaReport(persona: PersonaType): PersonaReport;
  generateTrendReport(metrics: AnalyticsMetrics[]): TrendReport;
  generateDashboard(): DashboardReport;
  exportReport(report: AnalyticsReport, format: ExportFormat): ArrayBuffer;
}

interface SessionReport {
  sessionId: string;
  summary: ReportSummary;
  details: ReportDetails;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
  generatedAt: Date;
}

interface CompetencyReport {
  competency: CompetencyType;
  summary: ReportSummary;
  details: ReportDetails;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
  generatedAt: Date;
}

interface ScenarioReport {
  scenario: ScenarioType;
  summary: ReportSummary;
  details: ReportDetails;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
  generatedAt: Date;
}

interface PersonaReport {
  persona: PersonaType;
  summary: ReportSummary;
  details: ReportDetails;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
  generatedAt: Date;
}

interface TrendReport {
  metric: string;
  summary: ReportSummary;
  details: ReportDetails;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
  generatedAt: Date;
}

interface DashboardReport {
  overview: DashboardOverview;
  metrics: DashboardMetrics;
  charts: DashboardChart[];
  alerts: DashboardAlert[];
  generatedAt: Date;
}

interface ReportSummary {
  title: string;
  description: string;
  keyFindings: string[];
}

interface ReportDetails {
  data: any;
  tables: ReportTable[];
  charts: ReportChart[];
}

interface ReportInsight {
  type: InsightType;
  description: string;
  impact: number;
}

interface ReportRecommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: string;
}

type ExportFormat = 'pdf' | 'csv' | 'json' | 'html';

interface AnalyticsReport {
  type: 'session' | 'competency' | 'scenario' | 'persona' | 'trend' | 'dashboard';
  report: SessionReport | CompetencyReport | ScenarioReport | PersonaReport | TrendReport | DashboardReport;
  generatedAt: Date;
}

interface DashboardOverview {
  totalSessions: number;
  averageScore: number;
  completionRate: number;
  activeUsers: number;
}

interface DashboardMetrics {
  sessionMetrics: SessionMetrics[];
  competencyMetrics: Map<CompetencyType, number>;
  scenarioMetrics: Map<ScenarioType, number>;
  personaMetrics: Map<PersonaType, number>;
}

interface DashboardChart {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  title: string;
  data: any;
}

interface DashboardAlert {
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

interface ReportTable {
  title: string;
  headers: string[];
  rows: any[][];
}

interface ReportChart {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: any;
}
```

---

## Conclusion

Le Analytics Engine spécifie le moteur d'analytics qui analyse les données des entretiens avec :

1. **Data Collection** : collectSessionMetrics, collectQuestionMetrics, collectEvaluationMetrics, collectBehavioralMetrics, collectStressMetrics, collectConfidenceMetrics, collectSystemMetrics
2. **Data Processing** : aggregateMetrics, filterMetrics, transformMetrics, normalizeMetrics, enrichMetrics
3. **Analytics Analysis** : analyzeSession, analyzeCompetency, analyzeScenario, analyzePersona, analyzeTrends, analyzeCorrelations, analyzeAnomalies
4. **Reporting** : generateSessionReport, generateCompetencyReport, generateScenarioReport, generatePersonaReport, generateTrendReport, generateDashboard, exportReport

Ce document fournit une spécification exécutable pour implémenter le moteur d'analytics.
