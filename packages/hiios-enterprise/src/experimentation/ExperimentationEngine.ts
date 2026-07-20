/**
 * HIIOS v4 Enterprise — Experimentation Engine
 *
 * A/B testing rigoureux avec tests statistiques.
 * Toutes les conclusions sont accompagnées de leur niveau de confiance.
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Experiment {
  readonly id:      string;
  readonly flagKey: string;
  name:             string;
  description:      string;
  hypothesis:       string;
  primaryMetric:    ExperimentMetric;
  secondaryMetrics: ExperimentMetric[];
  status:           ExperimentStatus;
  startDate:        Date;
  endDate?:         Date;
  minSampleSize:    number;
  significanceLevel: number;   // 0.05, 0.01, etc.
  power:            number;    // 0.80, 0.90
  results?:         ExperimentResults;
}

export type ExperimentStatus =
  | "DRAFT"
  | "RUNNING"
  | "PAUSED"
  | "CONCLUDED"
  | "INVALID";

export interface ExperimentMetric {
  name:        string;
  type:        "rate" | "mean" | "count";
  description: string;
  direction:   "HIGHER_IS_BETTER" | "LOWER_IS_BETTER";
}

export interface ExperimentResults {
  control:   VariantResult;
  treatment: VariantResult;
  analysis:  StatisticalAnalysis;
  conclusion: ExperimentConclusion;
  generatedAt: Date;
}

export interface VariantResult {
  variantKey:    string;
  sampleSize:    number;
  primaryMetric: {
    value:  number;
    stdDev: number;
    ci95:   [number, number];
  };
  secondaryMetrics: Record<string, number>;
}

export interface StatisticalAnalysis {
  pValue:          number;
  isSignificant:   boolean;
  effectSize:      number;     // Cohen's d
  relativeLift:    number;     // % de différence
  absoluteLift:    number;
  confidenceLevel: number;
  testType:        "two_sample_t_test" | "chi_squared" | "mann_whitney";
  powerAchieved:   number;
  minimumDetectableEffect: number;
}

export interface ExperimentConclusion {
  winner:     "CONTROL" | "TREATMENT" | "NO_WINNER";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  summary:    string;
  caveats:    string[];
  recommendation: "SHIP_TREATMENT" | "KEEP_CONTROL" | "EXTEND_EXPERIMENT" | "REDESIGN";
}

export interface ExperimentDataPoint {
  sessionId:    string;
  variantKey:   string;
  primaryValue: number;
  metadata:     Record<string, number>;
  timestamp:    Date;
}

// ─────────────────────────────────────────────
// MOTEUR
// ─────────────────────────────────────────────

export class ExperimentationEngine {

  private dataPoints:  Map<string, ExperimentDataPoint[]>              = new Map();

  // ── Enregistrement des données ─────────────

  recordDataPoint(experimentId: string, point: ExperimentDataPoint): void {
    if (!this.dataPoints.has(experimentId)) {
      this.dataPoints.set(experimentId, []);
    }
    this.dataPoints.get(experimentId)!.push(point);
  }

  // ── Analyse statistique ────────────────────

  analyzeExperiment(experiment: Experiment): ExperimentResults | null {
    const points = this.dataPoints.get(experiment.id) ?? [];

    const control   = points.filter(p => p.variantKey === "control");
    const treatment = points.filter(p => p.variantKey === "treatment");

    if (control.length < 10 || treatment.length < 10) {
      return null; // Données insuffisantes
    }

    const controlValues   = control.map(p => p.primaryValue);
    const treatmentValues = treatment.map(p => p.primaryValue);

    const controlResult   = this.computeVariantResult("control",   controlValues,   control);
    const treatmentResult = this.computeVariantResult("treatment", treatmentValues, treatment);

    const analysis  = this.runStatisticalTest(controlValues, treatmentValues, experiment);
    const conclusion = this.drawConclusion(controlResult, treatmentResult, analysis, experiment);

    return {
      control:     controlResult,
      treatment:   treatmentResult,
      analysis,
      conclusion,
      generatedAt: new Date(),
    };
  }

  // ── Sample Size Calculator ─────────────────

  calculateRequiredSampleSize(params: {
    baselineRate:     number;
    minimumLift:      number;
    significanceLevel: number;
    power:            number;
  }): number {
    const { baselineRate, minimumLift, significanceLevel, power } = params;

    const p1 = baselineRate;
    const p2 = baselineRate * (1 + minimumLift);
    const p  = (p1 + p2) / 2;

    const zAlpha = this.inverseCDF(1 - significanceLevel / 2);
    const zBeta  = this.inverseCDF(power);

    const numerator   = Math.pow(zAlpha * Math.sqrt(2 * p * (1 - p)) +
                                 zBeta  * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
    const denominator = Math.pow(p2 - p1, 2);

    return Math.ceil(numerator / denominator);
  }

  // ── Helpers statistiques ───────────────────

  private computeVariantResult(
    variantKey: string,
    values:     number[],
    points:     ExperimentDataPoint[]
  ): VariantResult {
    const mean  = this.mean(values);
    const stdDev = this.standardDeviation(values);
    const se    = stdDev / Math.sqrt(values.length);
    const z95   = 1.96;

    const secondaryMetrics: Record<string, number> = {};
    if (points.length > 0) {
      const firstPoint = points[0];
      for (const key of Object.keys(firstPoint.metadata)) {
        secondaryMetrics[key] = this.mean(points.map(p => p.metadata[key] ?? 0));
      }
    }

    return {
      variantKey,
      sampleSize: values.length,
      primaryMetric: {
        value:  mean,
        stdDev,
        ci95:   [mean - z95 * se, mean + z95 * se],
      },
      secondaryMetrics,
    };
  }

  private runStatisticalTest(
    control:    number[],
    treatment:  number[],
    experiment: Experiment
  ): StatisticalAnalysis {
    const nC   = control.length;
    const nT   = treatment.length;
    const meanC = this.mean(control);
    const meanT = this.mean(treatment);
    const stdC  = this.standardDeviation(control);
    const stdT  = this.standardDeviation(treatment);

    // Two-sample t-test (Welch)
    const se       = Math.sqrt((stdC * stdC) / nC + (stdT * stdT) / nT);
    const tStat    = (meanT - meanC) / (se || 0.0001);
    const df       = this.welchDF(stdC, stdT, nC, nT);
    const pValue   = this.tDistributionPValue(Math.abs(tStat), df) * 2; // Two-tailed

    const isSignificant = pValue < experiment.significanceLevel;

    // Effect size (Cohen's d)
    const pooledStd = Math.sqrt(((nC - 1) * stdC * stdC + (nT - 1) * stdT * stdT) / (nC + nT - 2));
    const cohensD   = pooledStd > 0 ? (meanT - meanC) / pooledStd : 0;

    // Lift
    const relativeLift  = meanC > 0 ? (meanT - meanC) / meanC : 0;
    const absoluteLift  = meanT - meanC;

    // Power achieved
    const powerAchieved = this.computePower(
      Math.abs(cohensD),
      Math.min(nC, nT),
      experiment.significanceLevel
    );

    const mde = this.minimumDetectableEffect(
      Math.min(nC, nT),
      experiment.significanceLevel,
      experiment.power
    );

    return {
      pValue,
      isSignificant,
      effectSize:    cohensD,
      relativeLift,
      absoluteLift,
      confidenceLevel: 1 - experiment.significanceLevel,
      testType:      "two_sample_t_test",
      powerAchieved,
      minimumDetectableEffect: mde,
    };
  }

  private drawConclusion(
    control:    VariantResult,
    treatment:  VariantResult,
    analysis:   StatisticalAnalysis,
    experiment: Experiment
  ): ExperimentConclusion {
    const caveats: string[] = [];

    if (control.sampleSize < experiment.minSampleSize) {
      caveats.push(`Taille d'échantillon contrôle (${control.sampleSize}) inférieure au minimum (${experiment.minSampleSize})`);
    }
    if (treatment.sampleSize < experiment.minSampleSize) {
      caveats.push(`Taille d'échantillon traitement (${treatment.sampleSize}) inférieure au minimum`);
    }
    if (analysis.powerAchieved < 0.70) {
      caveats.push(`Puissance statistique insuffisante (${(analysis.powerAchieved * 100).toFixed(0)}% < 70%)`);
    }

    if (!analysis.isSignificant) {
      return {
        winner:         "NO_WINNER",
        confidence:     analysis.powerAchieved >= 0.80 ? "HIGH" : "MEDIUM",
        summary:        `Aucune différence statistiquement significative détectée (p=${analysis.pValue.toFixed(3)}).`,
        caveats,
        recommendation: analysis.powerAchieved < 0.70 ? "EXTEND_EXPERIMENT" : "KEEP_CONTROL",
      };
    }

    const treatmentWins = experiment.primaryMetric.direction === "HIGHER_IS_BETTER"
      ? analysis.absoluteLift > 0
      : analysis.absoluteLift < 0;

    const confidence: ExperimentConclusion["confidence"] =
      Math.abs(analysis.effectSize) >= 0.5 ? "HIGH"
      : Math.abs(analysis.effectSize) >= 0.2 ? "MEDIUM"
      : "LOW";

    if (!treatmentWins) {
      return {
        winner:         "CONTROL",
        confidence,
        summary:        `Le contrôle surpasse le traitement (lift=${(analysis.relativeLift * 100).toFixed(1)}%, p=${analysis.pValue.toFixed(3)}).`,
        caveats,
        recommendation: "KEEP_CONTROL",
      };
    }

    return {
      winner:         "TREATMENT",
      confidence,
      summary:        `Le traitement améliore la métrique de ${(analysis.relativeLift * 100).toFixed(1)}% (p=${analysis.pValue.toFixed(3)}, d=${analysis.effectSize.toFixed(2)}).`,
      caveats,
      recommendation: confidence === "LOW" ? "EXTEND_EXPERIMENT" : "SHIP_TREATMENT",
    };
  }

  // ── Fonctions statistiques ─────────────────

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

  private welchDF(s1: number, s2: number, n1: number, n2: number): number {
    const term1 = (s1 * s1) / n1;
    const term2 = (s2 * s2) / n2;
    const numerator = Math.pow(term1 + term2, 2);
    const denominator = (term1 * term1) / (n1 - 1) + (term2 * term2) / (n2 - 1);
    return denominator > 0 ? numerator / denominator : 1;
  }

  private tDistributionPValue(t: number, df: number): number {
    // Approximation de la distribution t
    const x  = df / (df + t * t);
    const bt = this.incompleteBeta(df / 2, 0.5, x);
    return bt / 2;
  }

  private incompleteBeta(a: number, b: number, x: number): number {
    // Approximation via série
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let result = 0;
    const maxIter = 100;

    for (let i = 0; i < maxIter; i++) {
      result += Math.pow(x, i) * this.beta(a + i, b + 1) / this.beta(a, b + 1);
    }

    return Math.min(1, Math.max(0, result * Math.pow(x, a) * Math.pow(1 - x, b) / (a * this.beta(a, b))));
  }

  private beta(a: number, b: number): number {
    return Math.exp(this.logGamma(a) + this.logGamma(b) - this.logGamma(a + b));
  }

  private logGamma(n: number): number {
    // Approximation de Stirling
    if (n < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * n)) - this.logGamma(1 - n);
    n -= 1;
    const x = 0.99999999999980993 +
      676.5203681218851 / (n + 1) - 1259.1392167224028 / (n + 2) +
      771.32342877765313 / (n + 3) - 176.61502916214059 / (n + 4) +
      12.507343278686905 / (n + 5) - 0.13857109526572012 / (n + 6) +
      9.9843695780195716e-6 / (n + 7) + 1.5056327351493116e-7 / (n + 8);
    return 0.5 * Math.log(2 * Math.PI) + (n + 0.5) * Math.log(n + 7.5) - (n + 7.5) + Math.log(x);
  }

  private inverseCDF(p: number): number {
    // Approximation de l'inverse de la CDF normale
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
                1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
                6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
                -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [ 7.784695709041462e-03, 3.224671290700398e+01, 2.445134137142996e+00, 3.754408661907416e+00];

    const pLow  = 0.02425;
    const pHigh = 1 - pLow;

    if (p < pLow) {
      const q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
             ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
    }

    if (p <= pHigh) {
      const q = p - 0.5;
      const r = q * q;
      return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
             (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
    }

    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
             ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }

  private computePower(effectSize: number, n: number, alpha: number): number {
    const zAlpha = this.inverseCDF(1 - alpha / 2);
    const ncp    = effectSize * Math.sqrt(n / 2);
    return 1 - this.normalCDF(zAlpha - ncp) + this.normalCDF(-zAlpha - ncp);
  }

  private minimumDetectableEffect(n: number, alpha: number, power: number): number {
    const zAlpha = this.inverseCDF(1 - alpha / 2);
    const zBeta  = this.inverseCDF(power);
    return (zAlpha + zBeta) / Math.sqrt(n / 2);
  }

  private normalCDF(x: number): number {
    return 0.5 * (1 + this.erf(x / Math.SQRT2));
  }

  private erf(x: number): number {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    const t  = 1.0 / (1.0 + p * x);
    const y  = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
}
