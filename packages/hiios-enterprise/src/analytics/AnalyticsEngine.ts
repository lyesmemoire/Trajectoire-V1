/**
 * HIIOS v4 Enterprise — Analytics Engine
 *
 * Métriques d'entretien, de qualité et de prédiction.
 * Toutes les métriques sont épistémiquement honnêtes :
 * intervalles de confiance, tailles d'échantillon, limites.
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface OrganizationMetrics {
  organizationId:      string;
  period:              MetricsPeriod;
  interviewMetrics:    InterviewMetrics;
  qualityMetrics:      QualityMetrics;
  recruiterMetrics:    RecruiterMetrics[];
  skillMetrics:        SkillMetrics[];
  patternMetrics:      PatternMetrics[];
  predictionMetrics:   PredictionMetrics;
  trends:              TrendData[];
  generatedAt:         Date;
  dataQualityWarnings: string[];
}

export interface MetricsPeriod {
  start: Date;
  end:   Date;
  label: "7d" | "30d" | "90d" | "1y" | "custom";
}

export interface InterviewMetrics {
  total:               number;
  completed:           number;
  cancelled:           number;
  averageDuration:     number;
  completionRate:      number;
  byRole:              Record<string, number>;
  byType:              Record<string, number>;
  byRecommendation:    Record<string, number>;
  weeklyVolume:        WeeklyDataPoint[];
}

export interface WeeklyDataPoint {
  week:  string;
  count: number;
  delta: number;   // variation vs semaine précédente
}

export interface QualityMetrics {
  averageCoverageScore:     number;
  averageConfidenceScore:   number;
  averageEvidenceCount:     number;
  l1EvidenceRate:           number;   // % d'entretiens avec au moins une preuve L1
  contradictionRate:        number;   // % d'entretiens avec contradictions
  biasDetectionRate:        number;   // % d'entretiens avec biais détectés
  insufficientDataRate:     number;   // % de décisions INSUFFICIENT_DATA
  qualityDistribution: {
    excellent: number;
    good:      number;
    acceptable: number;
    poor:      number;
  };
  confidenceInterval:       ConfidenceInterval;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  level: number;   // 80, 90, ou 95%
  sampleSize: number;
  warning?:   string;
}

export interface RecruiterMetrics {
  recruiterId:         string;
  recruiterName:       string;
  interviewCount:      number;
  averageQualityScore: number;
  averageDuration:     number;
  challengeQuestionRate: number;
  biasRiskScore:       number;
  topStrengths:        string[];
  improvementAreas:    string[];
  trend:               "IMPROVING" | "STABLE" | "DECLINING";
}

export interface SkillMetrics {
  skillId:             string;
  skillName:           string;
  assessmentCount:     number;
  averageConfidence:   number;
  distributionByLevel: Record<string, number>;
  correlationWithHire: number | null;   // null si données insuffisantes
  sampleSizeWarning:   boolean;
}

export interface PatternMetrics {
  patternId:      string;
  patternName:    string;
  detectionCount: number;
  frequency:      number;    // % d'entretiens
  correlationWithHire: number | null;
  byRole:         Record<string, number>;
}

export interface PredictionMetrics {
  available:        boolean;
  sampleSize:       number;
  minimumRequired:  number;
  accuracy?:        number;
  precision?:       number;
  recall?:          number;
  warning:          string;
}

export interface TrendData {
  metric:    string;
  direction: "UP" | "DOWN" | "STABLE";
  magnitude: number;
  period:    string;
  insight:   string;
}

// ─────────────────────────────────────────────
// MOTEUR
// ─────────────────────────────────────────────

export class AnalyticsEngine {

  // ── Métriques organisation ─────────────────

  computeOrganizationMetrics(params: {
    interviews:  RawInterviewData[];
    period:      MetricsPeriod;
  }): OrganizationMetrics {
    const { interviews, period } = params;
    const warnings: string[] = [];

    if (interviews.length < 10) {
      warnings.push(
        `Taille d'échantillon faible (${interviews.length} entretiens). ` +
        `Les métriques sont indicatives uniquement.` 
      );
    }

    const interviewMetrics  = this.computeInterviewMetrics(interviews);
    const qualityMetrics    = this.computeQualityMetrics(interviews, warnings);
    const recruiterMetrics  = this.computeRecruiterMetrics(interviews);
    const skillMetrics      = this.computeSkillMetrics(interviews, warnings);
    const patternMetrics    = this.computePatternMetrics(interviews);
    const predictionMetrics = this.computePredictionMetrics(interviews);
    const trends            = this.computeTrends(interviews, period);

    return {
      organizationId:      interviews[0]?.organizationId ?? "unknown",
      period,
      interviewMetrics,
      qualityMetrics,
      recruiterMetrics,
      skillMetrics,
      patternMetrics,
      predictionMetrics,
      trends,
      generatedAt:         new Date(),
      dataQualityWarnings: warnings,
    };
  }

  // ── Métriques d'entretien ──────────────────

  private computeInterviewMetrics(interviews: RawInterviewData[]): InterviewMetrics {
    const completed  = interviews.filter(i => i.status === "completed");
    const cancelled  = interviews.filter(i => i.status === "cancelled");

    const byRole:           Record<string, number> = {};
    const byType:           Record<string, number> = {};
    const byRecommendation: Record<string, number> = {};

    for (const iv of interviews) {
      byRole[iv.targetRole] = (byRole[iv.targetRole] ?? 0) + 1;
      byType[iv.type]       = (byType[iv.type] ?? 0) + 1;
      if (iv.recommendation) {
        byRecommendation[iv.recommendation] = (byRecommendation[iv.recommendation] ?? 0) + 1;
      }
    }

    const avgDuration = completed.length > 0
      ? completed.reduce((s, i) => s + (i.durationMinutes ?? 0), 0) / completed.length
      : 0;

    return {
      total:            interviews.length,
      completed:        completed.length,
      cancelled:        cancelled.length,
      averageDuration:  Math.round(avgDuration),
      completionRate:   interviews.length > 0
        ? completed.length / interviews.length
        : 0,
      byRole,
      byType,
      byRecommendation,
      weeklyVolume:     this.computeWeeklyVolume(interviews),
    };
  }

  // ── Métriques de qualité ───────────────────

  private computeQualityMetrics(
    interviews: RawInterviewData[],
    warnings:   string[]
  ): QualityMetrics {
    const completed = interviews.filter(i =>
      i.status === "completed" && i.qualityScore !== undefined
    );

    if (completed.length === 0) {
      return this.emptyQualityMetrics();
    }

    const avgCoverage   = this.mean(completed.map(i => i.coverageScore ?? 0));
    const avgConfidence = this.mean(completed.map(i => i.confidenceScore ?? 0));
    const avgEvidence   = this.mean(completed.map(i => i.evidenceCount ?? 0));

    const l1Rate        = completed.filter(i => i.hasL1Evidence).length / completed.length;
    const contRate      = completed.filter(i => i.hasContradictions).length / completed.length;
    const biasRate      = completed.filter(i => i.hasBiasDetected).length / completed.length;
    const insufficientRate = completed.filter(
      i => i.recommendation === "INSUFFICIENT_DATA"
    ).length / completed.length;

    const distribution = this.computeQualityDistribution(completed);
    const ci           = this.computeConfidenceInterval(
      completed.map(i => i.qualityScore!),
      95
    );

    if (ci.sampleSize < 30) {
      warnings.push(`Intervalle de confiance sur métriques qualité basé sur ${ci.sampleSize} entretiens — prudence interprétative.`);
    }

    return {
      averageCoverageScore:   avgCoverage,
      averageConfidenceScore: avgConfidence,
      averageEvidenceCount:   avgEvidence,
      l1EvidenceRate:         l1Rate,
      contradictionRate:      contRate,
      biasDetectionRate:      biasRate,
      insufficientDataRate:   insufficientRate,
      qualityDistribution:    distribution,
      confidenceInterval:     ci,
    };
  }

  // ── Métriques recruteur ────────────────────

  private computeRecruiterMetrics(interviews: RawInterviewData[]): RecruiterMetrics[] {
    const byRecruiter = new Map<string, RawInterviewData[]>();

    for (const iv of interviews) {
      if (!byRecruiter.has(iv.recruiterId)) {
        byRecruiter.set(iv.recruiterId, []);
      }
      byRecruiter.get(iv.recruiterId)!.push(iv);
    }

    return Array.from(byRecruiter.entries()).map(([recruiterId, ivs]) => {
      const completed = ivs.filter(i => i.status === "completed");

      const avgQuality = this.mean(
        completed.map(i => i.qualityScore ?? 0)
      );
      const avgDuration = this.mean(
        completed.map(i => i.durationMinutes ?? 0)
      );
      const challengeRate = this.mean(
        completed.map(i => i.challengeQuestionRate ?? 0)
      );
      const biasRisk = this.mean(
        completed.map(i => i.biasRiskScore ?? 0)
      );

      const trend = this.computeRecruiterTrend(completed);

      return {
        recruiterId,
        recruiterName:       ivs[0].recruiterName ?? recruiterId,
        interviewCount:      completed.length,
        averageQualityScore: avgQuality,
        averageDuration:     Math.round(avgDuration),
        challengeQuestionRate: challengeRate,
        biasRiskScore:       biasRisk,
        topStrengths:        this.extractRecruiterStrengths(completed),
        improvementAreas:    this.extractRecruiterImprovements(completed),
        trend,
      };
    });
  }

  // ── Métriques compétences ──────────────────

  private computeSkillMetrics(
    interviews: RawInterviewData[],
    warnings:   string[]
  ): SkillMetrics[] {
    const skillData = new Map<string, {
      assessments: number[];
      levels:      Record<string, number>;
      hired:       boolean[];
    }>();

    for (const iv of interviews) {
      for (const sa of iv.skillAssessments ?? []) {
        if (!skillData.has(sa.skillId)) {
          skillData.set(sa.skillId, { assessments: [], levels: {}, hired: [] });
        }
        const data = skillData.get(sa.skillId)!;
        data.assessments.push(sa.confidenceScore);
        data.levels[sa.observedLevel ?? "UNDETERMINED"] =
          (data.levels[sa.observedLevel ?? "UNDETERMINED"] ?? 0) + 1;
        if (iv.wasHired !== undefined) {
          data.hired.push(iv.wasHired);
        }
      }
    }

    return Array.from(skillData.entries()).map(([skillId, data]) => {
      const sampleSizeWarning = data.assessments.length < 20;

      if (sampleSizeWarning) {
        warnings.push(
          `Compétence "${skillId}" : corrélation avec embauche basée sur ${data.assessments.length} observations. Non fiable.` 
        );
      }

      return {
        skillId,
        skillName:             skillId,
        assessmentCount:       data.assessments.length,
        averageConfidence:     this.mean(data.assessments),
        distributionByLevel:   data.levels,
        correlationWithHire:   data.hired.length >= 20
          ? this.pointBiserialCorrelation(data.assessments, data.hired)
          : null,
        sampleSizeWarning,
      };
    });
  }

  // ── Métriques patterns ─────────────────────

  private computePatternMetrics(interviews: RawInterviewData[]): PatternMetrics[] {
    const patternData = new Map<string, {
      count: number;
      byRole: Record<string, number>;
      hired: boolean[];
    }>();

    const total = interviews.length;

    for (const iv of interviews) {
      for (const pattern of iv.detectedPatterns ?? []) {
        if (!patternData.has(pattern.id)) {
          patternData.set(pattern.id, { count: 0, byRole: {}, hired: [] });
        }
        const data = patternData.get(pattern.id)!;
        data.count++;
        data.byRole[iv.targetRole] = (data.byRole[iv.targetRole] ?? 0) + 1;
        if (iv.wasHired !== undefined) {
          data.hired.push(iv.wasHired);
        }
      }
    }

    return Array.from(patternData.entries()).map(([patternId, data]) => ({
      patternId,
      patternName:    patternId,
      detectionCount: data.count,
      frequency:      total > 0 ? data.count / total : 0,
      correlationWithHire: data.hired.length >= 20
        ? this.binaryCorrelation(data.hired)
        : null,
      byRole: data.byRole,
    }));
  }

  // ── Métriques prédiction ───────────────────

  private computePredictionMetrics(interviews: RawInterviewData[]): PredictionMetrics {
    const withOutcome = interviews.filter(i => i.wasHired !== undefined);
    const minimum     = 50;

    if (withOutcome.length < minimum) {
      return {
        available:       false,
        sampleSize:      withOutcome.length,
        minimumRequired: minimum,
        warning:         `${withOutcome.length}/${minimum} entretiens avec données de suivi. ` +
                         `Les métriques prédictives seront disponibles à partir de ${minimum} cas.`,
      };
    }

    const correct = withOutcome.filter(i => {
      const recYes = ["STRONG_YES", "YES", "YES_WITH_RESERVES"].includes(i.recommendation ?? "");
      return recYes === i.wasHired;
    });

    const accuracy = correct.length / withOutcome.length;

    const truePositives  = withOutcome.filter(i => i.recommendation !== "NO" && i.wasHired).length;
    const falsePositives = withOutcome.filter(i => i.recommendation !== "NO" && !i.wasHired).length;
    const falseNegatives = withOutcome.filter(i => i.recommendation === "NO" && i.wasHired).length;

    const precision = truePositives + falsePositives > 0
      ? truePositives / (truePositives + falsePositives)
      : 0;
    const recall = truePositives + falseNegatives > 0
      ? truePositives / (truePositives + falseNegatives)
      : 0;

    return {
      available:       true,
      sampleSize:      withOutcome.length,
      minimumRequired: minimum,
      accuracy,
      precision,
      recall,
      warning:         accuracy < 0.65
        ? "Précision prédictive inférieure à 65% — réviser les critères d'évaluation"
        : "",
    };
  }

  // ── Tendances ──────────────────────────────

  private computeTrends(
    interviews: RawInterviewData[],
    period:     MetricsPeriod
  ): TrendData[] {
    const trends: TrendData[] = [];
    const midpoint = new Date(
      (period.start.getTime() + period.end.getTime()) / 2
    );

    const firstHalf  = interviews.filter(i => new Date(i.createdAt) <= midpoint);
    const secondHalf = interviews.filter(i => new Date(i.createdAt) > midpoint);

    if (firstHalf.length === 0 || secondHalf.length === 0) return trends;

    // Tendance qualité
    const qualityFirst  = this.mean(firstHalf.map(i => i.qualityScore ?? 0));
    const qualitySecond = this.mean(secondHalf.map(i => i.qualityScore ?? 0));
    const qualityDelta  = qualitySecond - qualityFirst;

    trends.push({
      metric:    "quality_score",
      direction: qualityDelta > 0.02 ? "UP" : qualityDelta < -0.02 ? "DOWN" : "STABLE",
      magnitude: Math.abs(qualityDelta),
      period:    period.label,
      insight:   qualityDelta > 0.02
        ? "La qualité des entretiens s'améliore sur la période."
        : qualityDelta < -0.02
        ? "La qualité des entretiens tend à baisser — action recommandée."
        : "La qualité des entretiens est stable.",
    });

    // Tendance volume
    const volumeDelta = secondHalf.length - firstHalf.length;
    trends.push({
      metric:    "interview_volume",
      direction: volumeDelta > 2 ? "UP" : volumeDelta < -2 ? "DOWN" : "STABLE",
      magnitude: Math.abs(volumeDelta),
      period:    period.label,
      insight:   `Volume : ${firstHalf.length} → ${secondHalf.length} entretiens sur la période.`,
    });

    // Tendance couverture
    const coverFirst  = this.mean(firstHalf.map(i => i.coverageScore ?? 0));
    const coverSecond = this.mean(secondHalf.map(i => i.coverageScore ?? 0));
    const coverDelta  = coverSecond - coverFirst;

    if (Math.abs(coverDelta) > 0.03) {
      trends.push({
        metric:    "coverage_score",
        direction: coverDelta > 0 ? "UP" : "DOWN",
        magnitude: Math.abs(coverDelta),
        period:    period.label,
        insight:   coverDelta > 0
          ? "La couverture des compétences s'améliore."
          : "La couverture des compétences diminue — vérifier les questions posées.",
      });
    }

    return trends;
  }

  // ── Helpers statistiques ───────────────────

  private mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((s, v) => s + v, 0) / values.length;
  }

  private standardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    const avg = this.mean(values);
    const variance = values.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / (values.length - 1);
    return Math.sqrt(variance);
  }

  private computeConfidenceInterval(
    values:     number[],
    confidence: number
  ): ConfidenceInterval {
    const n    = values.length;
    const avg  = this.mean(values);
    const std  = this.standardDeviation(values);
    const z    = confidence === 95 ? 1.96 : confidence === 90 ? 1.645 : 1.282;
    const se   = std / Math.sqrt(n);
    const margin = z * se;

    return {
      lower:      Math.max(0, avg - margin),
      upper:      Math.min(1, avg + margin),
      level:      confidence,
      sampleSize: n,
      warning:    n < 30
        ? `Échantillon < 30 — intervalle de confiance peu fiable` 
        : undefined,
    };
  }

  private pointBiserialCorrelation(
    continuous: number[],
    binary:     boolean[]
  ): number {
    const n   = continuous.length;
    const avg = this.mean(continuous);
    const std = this.standardDeviation(continuous);

    if (std === 0) return 0;

    const positiveValues = continuous.filter((_, i) => binary[i]);
    const avgPositive    = this.mean(positiveValues);
    const pProportion    = binary.filter(Boolean).length / n;

    return ((avgPositive - avg) / std) * Math.sqrt(pProportion * (1 - pProportion));
  }

  private binaryCorrelation(hired: boolean[]): number {
    return hired.filter(Boolean).length / hired.length;
  }

  private computeWeeklyVolume(interviews: RawInterviewData[]): WeeklyDataPoint[] {
    const byWeek = new Map<string, number>();

    for (const iv of interviews) {
      const date  = new Date(iv.createdAt);
      const week  = this.getWeekKey(date);
      byWeek.set(week, (byWeek.get(week) ?? 0) + 1);
    }

    const weeks    = Array.from(byWeek.keys()).sort();
    const points   = weeks.map((week, i) => ({
      week,
      count: byWeek.get(week)!,
      delta: i > 0 ? (byWeek.get(week)! - byWeek.get(weeks[i - 1])!) : 0,
    }));

    return points.slice(-12); // 12 semaines max
  }

  private getWeekKey(date: Date): string {
    const d   = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().slice(0, 10);
  }

  private computeQualityDistribution(
    interviews: RawInterviewData[]
  ): QualityMetrics["qualityDistribution"] {
    const total = interviews.length;
    if (total === 0) return { excellent: 0, good: 0, acceptable: 0, poor: 0 };

    const excellent  = interviews.filter(i => (i.qualityScore ?? 0) >= 0.85).length;
    const good       = interviews.filter(i => {
      const s = i.qualityScore ?? 0;
      return s >= 0.70 && s < 0.85;
    }).length;
    const acceptable = interviews.filter(i => {
      const s = i.qualityScore ?? 0;
      return s >= 0.50 && s < 0.70;
    }).length;
    const poor       = interviews.filter(i => (i.qualityScore ?? 0) < 0.50).length;

    return {
      excellent:  excellent / total,
      good:       good / total,
      acceptable: acceptable / total,
      poor:       poor / total,
    };
  }

  private computeRecruiterTrend(
    interviews: RawInterviewData[]
  ): RecruiterMetrics["trend"] {
    if (interviews.length < 4) return "STABLE";

    const firstHalf  = interviews.slice(0, Math.floor(interviews.length / 2));
    const secondHalf = interviews.slice(Math.floor(interviews.length / 2));

    const firstQuality  = this.mean(firstHalf.map(i => i.qualityScore ?? 0));
    const secondQuality = this.mean(secondHalf.map(i => i.qualityScore ?? 0));
    const delta         = secondQuality - firstQuality;

    if (delta > 0.05) return "IMPROVING";
    if (delta < -0.05) return "DECLINING";
    return "STABLE";
  }

  private extractRecruiterStrengths(interviews: RawInterviewData[]): string[] {
    const strengths: string[] = [];
    const avgChallenge = this.mean(interviews.map(i => i.challengeQuestionRate ?? 0));
    const avgCoverage  = this.mean(interviews.map(i => i.coverageScore ?? 0));
    const avgQuality   = this.mean(interviews.map(i => i.qualityScore ?? 0));

    if (avgChallenge > 0.20) strengths.push("Bonne utilisation des questions de challenge");
    if (avgCoverage  > 0.75) strengths.push("Couverture complète des compétences critiques");
    if (avgQuality   > 0.75) strengths.push("Entretiens de haute qualité consistants");

    return strengths.slice(0, 3);
  }

  private extractRecruiterImprovements(interviews: RawInterviewData[]): string[] {
    const areas: string[] = [];
    const avgBias      = this.mean(interviews.map(i => i.biasRiskScore ?? 0));
    const avgChallenge = this.mean(interviews.map(i => i.challengeQuestionRate ?? 0));
    const avgCoverage  = this.mean(interviews.map(i => i.coverageScore ?? 0));

    if (avgBias > 0.40) areas.push("Réduire les risques de biais dans l'évaluation");
    if (avgChallenge < 0.10) areas.push("Augmenter la proportion de questions de challenge");
    if (avgCoverage < 0.60) areas.push("Améliorer la couverture des compétences critiques");

    return areas.slice(0, 3);
  }

  private emptyQualityMetrics(): QualityMetrics {
    return {
      averageCoverageScore:   0,
      averageConfidenceScore: 0,
      averageEvidenceCount:   0,
      l1EvidenceRate:         0,
      contradictionRate:      0,
      biasDetectionRate:      0,
      insufficientDataRate:   0,
      qualityDistribution:    { excellent: 0, good: 0, acceptable: 0, poor: 0 },
      confidenceInterval:     { lower: 0, upper: 0, level: 95, sampleSize: 0, warning: "Aucune donnée" },
    };
  }
}

// ─────────────────────────────────────────────
// TYPES DE DONNÉES BRUTES
// ─────────────────────────────────────────────

export interface RawInterviewData {
  id:                  string;
  organizationId:      string;
  recruiterId:         string;
  recruiterName?:      string;
  targetRole:          string;
  type:                string;
  status:              string;
  recommendation?:     string;
  createdAt:           Date;
  durationMinutes?:    number;
  qualityScore?:       number;
  coverageScore?:      number;
  confidenceScore?:    number;
  evidenceCount?:      number;
  hasL1Evidence:       boolean;
  hasContradictions:   boolean;
  hasBiasDetected:     boolean;
  challengeQuestionRate?: number;
  biasRiskScore?:      number;
  skillAssessments?:   Array<{
    skillId:        string;
    confidenceScore: number;
    observedLevel?: string;
  }>;
  detectedPatterns?:   Array<{ id: string; name: string; valence: string }>;
  wasHired?:           boolean;   // Résultat réel (feedback post-embauche)
}
