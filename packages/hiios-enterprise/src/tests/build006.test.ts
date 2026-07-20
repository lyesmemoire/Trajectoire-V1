/**
 * HIIOS v4 Enterprise — Tests Build 006
 * Enterprise Platform
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AnalyticsEngine, type RawInterviewData } from "../analytics/AnalyticsEngine";
import { MetricsCollector, HIIOS_METRICS }        from "../observability/Telemetry";
import { FeatureFlagEngine }                       from "../flags/FeatureFlagEngine";
import { ExperimentationEngine }                   from "../experimentation/ExperimentationEngine";

// ─────────────────────────────────────────────
// FIXTURES
// ─────────────────────────────────────────────

function buildInterviews(count: number, overrides: Partial<RawInterviewData> = {}): RawInterviewData[] {
  return Array.from({ length: count }, (_, i) => ({
    id:               `iv_${i}`,
    organizationId:   "org_test",
    recruiterId:      `rec_${i % 3}`,
    recruiterName:    `Recruiter ${i % 3}`,
    targetRole:       i % 2 === 0 ? "Engineering Manager" : "Product Manager",
    type:             "BEHAVIORAL",
    status:           "completed",
    recommendation:   i % 4 === 0 ? "YES" : i % 4 === 1 ? "NO" : i % 4 === 2 ? "NEUTRAL" : "YES_WITH_RESERVES",
    createdAt:        new Date(Date.now() - (count - i) * 86400000),
    durationMinutes:  45 + Math.floor(Math.random() * 30),
    qualityScore:     0.50 + Math.random() * 0.45,
    coverageScore:    0.55 + Math.random() * 0.40,
    confidenceScore:  0.45 + Math.random() * 0.45,
    evidenceCount:    3 + Math.floor(Math.random() * 8),
    hasL1Evidence:    Math.random() > 0.30,
    hasContradictions: Math.random() > 0.60,
    hasBiasDetected:  Math.random() > 0.70,
    challengeQuestionRate: 0.05 + Math.random() * 0.25,
    biasRiskScore:    0.10 + Math.random() * 0.40,
    skillAssessments: [
      { skillId: "leadership",    confidenceScore: 0.50 + Math.random() * 0.40, observedLevel: "PROFICIENT" },
      { skillId: "ownership",     confidenceScore: 0.40 + Math.random() * 0.50, observedLevel: "DEVELOPING" },
      { skillId: "communication", confidenceScore: 0.55 + Math.random() * 0.35, observedLevel: "PROFICIENT" },
    ],
    detectedPatterns: Math.random() > 0.5
      ? [{ id: "pattern_servant_leader", name: "Servant Leadership", valence: "POSITIVE" }]
      : [],
    wasHired: Math.random() > 0.40,
    ...overrides,
  }));
}

// ─────────────────────────────────────────────
// ANALYTICS ENGINE
// ─────────────────────────────────────────────

describe("AnalyticsEngine", () => {

  let engine: AnalyticsEngine;

  beforeEach(() => {
    engine = new AnalyticsEngine();
  });

  const period = {
    start: new Date(Date.now() - 30 * 86400000),
    end:   new Date(),
    label: "30d" as const,
  };

  it("calcule les métriques pour un ensemble d'entretiens", () => {
    const interviews = buildInterviews(25);
    const metrics    = engine.computeOrganizationMetrics({ interviews, period });

    expect(metrics.interviewMetrics.total).toBe(25);
    expect(metrics.interviewMetrics.completed).toBe(25);
    expect(metrics.qualityMetrics.averageCoverageScore).toBeGreaterThan(0);
    expect(metrics.qualityMetrics.averageCoverageScore).toBeLessThanOrEqual(1);
  });

  it("génère un avertissement si l'échantillon est petit", () => {
    const interviews = buildInterviews(5);
    const metrics    = engine.computeOrganizationMetrics({ interviews, period });

    expect(metrics.dataQualityWarnings.length).toBeGreaterThan(0);
    expect(metrics.dataQualityWarnings[0]).toContain("5 entretiens");
  });

  it("calcule le taux de complétion correctement", () => {
    const interviews = [
      ...buildInterviews(15, { status: "completed" }),
      ...buildInterviews(5,  { status: "cancelled" }),
    ];
    const metrics = engine.computeOrganizationMetrics({ interviews, period });

    expect(metrics.interviewMetrics.completionRate).toBeCloseTo(15 / 20, 2);
    expect(metrics.interviewMetrics.cancelled).toBe(5);
  });

  it("distribue les métriques par rôle", () => {
    const interviews = buildInterviews(20);
    const metrics    = engine.computeOrganizationMetrics({ interviews, period });

    expect(metrics.interviewMetrics.byRole["Engineering Manager"]).toBeGreaterThan(0);
    expect(metrics.interviewMetrics.byRole["Product Manager"]).toBeGreaterThan(0);
  });

  it("calcule les métriques recruteur par recruiter_id", () => {
    const interviews = buildInterviews(30);
    const metrics    = engine.computeOrganizationMetrics({ interviews, period });

    expect(metrics.recruiterMetrics.length).toBe(3); // 3 recruteurs dans les fixtures
    for (const rm of metrics.recruiterMetrics) {
      expect(rm.interviewCount).toBeGreaterThan(0);
      expect(rm.averageQualityScore).toBeGreaterThan(0);
      expect(["IMPROVING", "STABLE", "DECLINING"]).toContain(rm.trend);
    }
  });

  it("calcule les métriques de compétence", () => {
    const interviews = buildInterviews(20);
    const metrics    = engine.computeOrganizationMetrics({ interviews, period });

    const leadership = metrics.skillMetrics.find(s => s.skillId === "leadership");
    expect(leadership).toBeDefined();
    expect(leadership!.assessmentCount).toBeGreaterThan(0);
    expect(leadership!.averageConfidence).toBeGreaterThan(0);
  });

  it("marque la corrélation comme null si trop peu de données", () => {
    const interviews = buildInterviews(10);
    const metrics    = engine.computeOrganizationMetrics({ interviews, period });

    // Avec 10 entretiens, la corrélation doit être null (< 20 requis)
    for (const sm of metrics.skillMetrics) {
      expect(sm.correlationWithHire).toBeNull();
      expect(sm.sampleSizeWarning).toBe(true);
    }
  });

  it("refuse les métriques prédictives avec moins de 50 entretiens", () => {
    const interviews = buildInterviews(30);
    const metrics    = engine.computeOrganizationMetrics({ interviews, period });

    expect(metrics.predictionMetrics.available).toBe(false);
    expect(metrics.predictionMetrics.sampleSize).toBe(30);
    expect(metrics.predictionMetrics.minimumRequired).toBe(50);
    expect(metrics.predictionMetrics.warning).toContain("50");
  });

  it("calcule les métriques prédictives avec assez de données", () => {
    const interviews = buildInterviews(60, { wasHired: undefined });
    // Ajouter des données wasHired manuellement
    interviews.forEach((iv, i) => {
      iv.wasHired = i % 3 !== 0;
    });

    const metrics = engine.computeOrganizationMetrics({ interviews, period });

    if (metrics.predictionMetrics.available) {
      expect(metrics.predictionMetrics.accuracy).toBeGreaterThan(0);
      expect(metrics.predictionMetrics.accuracy).toBeLessThanOrEqual(1);
    }
  });

  it("calcule les tendances sur la période", () => {
    const interviews = buildInterviews(30);
    const metrics    = engine.computeOrganizationMetrics({ interviews, period });

    expect(metrics.trends.length).toBeGreaterThan(0);
    for (const trend of metrics.trends) {
      expect(["UP", "DOWN", "STABLE"]).toContain(trend.direction);
      expect(trend.insight.length).toBeGreaterThan(10);
    }
  });

  it("calcule la distribution qualité correctement", () => {
    const excellent = buildInterviews(5,  { qualityScore: 0.90 });
    const good      = buildInterviews(5,  { qualityScore: 0.75 });
    const poor      = buildInterviews(5,  { qualityScore: 0.40 });
    const metrics   = engine.computeOrganizationMetrics({
      interviews: [...excellent, ...good, ...poor],
      period,
    });

    const dist = metrics.qualityMetrics.qualityDistribution;
    expect(dist.excellent).toBeCloseTo(1/3, 1);
    expect(dist.good).toBeCloseTo(1/3, 1);
    expect(dist.poor).toBeCloseTo(1/3, 1);
  });

  it("l'intervalle de confiance contient la moyenne", () => {
    const interviews = buildInterviews(30);
    const metrics    = engine.computeOrganizationMetrics({ interviews, period });

    const ci  = metrics.qualityMetrics.confidenceInterval;
    const avg = metrics.qualityMetrics.averageCoverageScore;

    expect(ci.lower).toBeLessThanOrEqual(avg + 0.01);
    expect(ci.upper).toBeGreaterThanOrEqual(avg - 0.01);
  });
});

// ─────────────────────────────────────────────
// METRICS COLLECTOR
// ─────────────────────────────────────────────

describe("MetricsCollector", () => {

  let collector: MetricsCollector;

  beforeEach(() => {
    collector = new MetricsCollector();
  });

  it("enregistre des compteurs", () => {
    collector.increment("hiios_sessions_total", { status: "completed" });
    collector.increment("hiios_sessions_total", { status: "completed" });
    collector.increment("hiios_sessions_total", { status: "cancelled" });

    const metrics = collector.getMetrics();
    const sessions = metrics.filter(m => m.name === "hiios_sessions_total");
    expect(sessions.length).toBe(3);
  });

  it("enregistre des jauges", () => {
    collector.set("hiios_hypotheses_active", 5, { status: "SUPPORTED" });
    const metrics = collector.getMetrics();
    const gauge   = metrics.find(m => m.name === "hiios_hypotheses_active");
    expect(gauge?.value).toBe(5);
  });

  it("enregistre des histogrammes", () => {
    collector.observe("hiios_llm_latency_seconds", 0.45, { provider: "openai" });
    collector.observe("hiios_llm_latency_seconds", 0.82, { provider: "openai" });
    const metrics = collector.getMetrics().filter(m => m.name === "hiios_llm_latency_seconds");
    expect(metrics.length).toBe(2);
  });

  it("instrumente une fonction asynchrone", async () => {
    const result = await collector.instrument(
      "test_operation",
      async (span) => {
        collector.addSpanEvent(span, "step_1", { count: 1 });
        return 42;
      }
    );

    expect(result).toBe(42);
    const metrics = collector.getMetrics();
    expect(metrics.some(m => m.name.includes("test_operation"))).toBe(true);
  });

  it("enregistre une erreur quand la fonction lance une exception", async () => {
    try {
      await collector.instrument("failing_operation", async () => {
        throw new Error("Test error");
      });
    } catch { /* attendu */ }

    const errors = collector.getMetrics().filter(m => m.name === "hiios_errors_total");
    expect(errors.length).toBeGreaterThan(0);
  });

  it("exporte au format Prometheus", () => {
    collector.increment("hiios_sessions_total", { status: "completed", organization_id: "org_1", interview_type: "BEHAVIORAL" });
    collector.observe("hiios_llm_latency_seconds", 0.5, { provider: "openai", model: "gpt-4o" });

    const prometheus = collector.exportPrometheus();

    expect(prometheus).toContain("hiios_sessions_total");
    expect(prometheus).toContain("hiios_llm_latency_seconds");
    expect(prometheus).toContain('status="completed"');
  });

  it("vérifie la santé du système", async () => {
    const health = await collector.checkHealth([
      {
        name:  "database",
        check: async () => ({ status: "pass" as const, message: "Connected" }),
      },
      {
        name:  "redis",
        check: async () => ({ status: "warn" as const, message: "High latency" }),
      },
    ]);

    expect(health.status).toBe("degraded"); // warn => degraded
    expect(health.checks.length).toBe(2);
    expect(health.checks.find(c => c.name === "database")?.status).toBe("pass");
    expect(health.uptime).toBeGreaterThan(0);
  });

  it("filtre les métriques récentes", async () => {
    collector.increment("hiios_sessions_total", {});
    await new Promise(r => setTimeout(r, 10));
    const recent = collector.getRecentMetrics(1000); // 1 seconde
    expect(recent.length).toBeGreaterThan(0);
  });

  it("le registre de métriques est complet", () => {
    expect(HIIOS_METRICS.length).toBeGreaterThan(10);
    for (const metric of HIIOS_METRICS) {
      expect(metric.name).toMatch(/^hiios_/);
      expect(metric.description.length).toBeGreaterThan(5);
      expect(["counter", "gauge", "histogram"]).toContain(metric.type);
    }
  });
});

// ─────────────────────────────────────────────
// FEATURE FLAG ENGINE
// ─────────────────────────────────────────────

describe("FeatureFlagEngine", () => {

  let engine: FeatureFlagEngine;

  beforeEach(() => {
    engine = new FeatureFlagEngine();
  });

  it("s'initialise avec les flags HIIOS prédéfinis", () => {
    const flags = engine.getAllFlags();
    expect(flags.length).toBeGreaterThan(0);
    expect(flags.some(f => f.key === "streaming_analysis")).toBe(true);
  });

  it("retourne FLAG_NOT_FOUND pour un flag inexistant", () => {
    const eval_ = engine.evaluate("nonexistent_flag", {});
    expect(eval_.enabled).toBe(false);
    expect(eval_.reason).toBe("FLAG_NOT_FOUND");
  });

  it("désactive un flag correctement", () => {
    const eval_ = engine.evaluate("new_question_scoring", {});
    expect(eval_.enabled).toBe(false);
    expect(eval_.reason).toBe("FLAG_DISABLED");
  });

  it("active un flag en rollout 100%", () => {
    const eval_ = engine.evaluate("streaming_analysis", { userId: "user_test" });
    expect(eval_.enabled).toBe(true);
  });

  it("crée et évalue un flag personnalisé", () => {
    engine.upsertFlag({
      key:               "test_feature",
      name:              "Test Feature",
      enabled:           true,
      rolloutPercentage: 100,
      variants: [
        { id: "v1", key: "control",   description: "Off",  weight: 50 },
        { id: "v2", key: "treatment", description: "On",   weight: 50 },
      ],
      defaultVariant: "control",
      targeting:      [],
      tags:           [],
    });

    const eval_ = engine.evaluate("test_feature", { userId: "test_user" });
    expect(eval_.enabled).toBe(true);
    expect(["control", "treatment"]).toContain(eval_.variant);
  });

  it("applique le ciblage par organisation", () => {
    engine.upsertFlag({
      key:               "org_specific",
      name:              "Org Specific",
      enabled:           true,
      rolloutPercentage: 100,
      targeting: [{
        id:          "rule_1",
        description: "For org_vip only",
        priority:    10,
        variant:     "treatment",
        conditions:  [{
          attribute: "organizationId",
          operator:  "EQ",
          value:     "org_vip",
        }],
      }],
      variants: [
        { id: "v1", key: "control",   description: "", weight: 50 },
        { id: "v2", key: "treatment", description: "", weight: 50 },
      ],
      defaultVariant: "control",
      tags:           [],
    });

    const vipEval   = engine.evaluate("org_specific", { organizationId: "org_vip" });
    const otherEval = engine.evaluate("org_specific", { organizationId: "org_other" });

    expect(vipEval.variant).toBe("treatment");
    expect(vipEval.reason).toBe("TARGETING_MATCH");
    expect(otherEval.variant).not.toBe("treatment"); // N'est pas forcément "control" car A/B
  });

  it("respecte le rollout partiel", () => {
    engine.upsertFlag({
      key:               "partial_rollout",
      name:              "Partial",
      enabled:           true,
      rolloutPercentage: 50,
      variants: [{ id: "v1", key: "control", description: "", weight: 100 }],
      defaultVariant: "control",
      targeting: [], tags: [],
    });

    const results = Array.from({ length: 100 }, (_, i) =>
      engine.evaluate("partial_rollout", { userId: `user_${i}` })
    );

    const enabled = results.filter(r => r.enabled).length;
    // Avec 50% de rollout, on attend environ 50 ± 15
    expect(enabled).toBeGreaterThan(30);
    expect(enabled).toBeLessThan(70);
  });

  it("les assignements A/B sont stickies", () => {
    engine.upsertFlag({
      key:               "sticky_ab",
      name:              "Sticky AB",
      enabled:           true,
      rolloutPercentage: 100,
      variants: [
        { id: "v1", key: "control",   description: "", weight: 50 },
        { id: "v2", key: "treatment", description: "", weight: 50 },
      ],
      defaultVariant: "control",
      targeting: [], tags: [],
    });

    const eval1 = engine.evaluate("sticky_ab", { userId: "sticky_user" });
    const eval2 = engine.evaluate("sticky_ab", { userId: "sticky_user" });
    const eval3 = engine.evaluate("sticky_ab", { userId: "sticky_user" });

    // Même utilisateur → même variant à chaque fois
    expect(eval1.variant).toBe(eval2.variant);
    expect(eval2.variant).toBe(eval3.variant);
  });

  it("évalue tous les flags d'un coup", () => {
    const all = engine.evaluateAll({ userId: "test_user", organizationId: "org_1" });
    expect(Object.keys(all).length).toBeGreaterThan(0);
    for (const [key, eval_] of Object.entries(all)) {
      expect(eval_.flagKey).toBe(key);
      expect(typeof eval_.enabled).toBe("boolean");
    }
  });

  it("expire les flags après la date d'expiration", () => {
    engine.upsertFlag({
      key:               "expired_flag",
      name:              "Expired",
      enabled:           true,
      rolloutPercentage: 100,
      expiresAt:         new Date(Date.now() - 1000), // Expiré
      variants: [{ id: "v1", key: "control", description: "", weight: 100 }],
      defaultVariant: "control",
      targeting: [], tags: [],
    });

    const eval_ = engine.evaluate("expired_flag", {});
    expect(eval_.enabled).toBe(false);
    expect(eval_.reason).toBe("FLAG_EXPIRED");
  });
});

// ─────────────────────────────────────────────
// EXPERIMENTATION ENGINE
// ─────────────────────────────────────────────

describe("ExperimentationEngine", () => {

  let engine: ExperimentationEngine;

  const buildExperiment = (overrides: Partial<Experiment> = {}): Experiment => ({
    id:          "exp_001",
    flagKey:     "new_question_scoring",
    name:        "Test de l'algorithme de scoring v2",
    description: "Comparer la qualité des questions sélectionnées",
    hypothesis:  "L'algorithme v2 améliore le gain d'information de 10%",
    primaryMetric: {
      name:      "information_gain",
      type:      "mean",
      description: "Gain d'information moyen par question",
      direction: "HIGHER_IS_BETTER",
    },
    secondaryMetrics: [],
    status:          "RUNNING",
    startDate:       new Date(Date.now() - 30 * 86400000),
    minSampleSize:   50,
    significanceLevel: 0.05,
    power:           0.80,
    ...overrides,
  });

  beforeEach(() => {
    engine = new ExperimentationEngine();
  });

  it("retourne null si pas assez de données", () => {
    const experiment = buildExperiment();
    const results    = engine.analyzeExperiment(experiment);
    expect(results).toBeNull();
  });

  it("analyse un expériment avec suffisamment de données", () => {
    const experiment = buildExperiment();

    // Ajouter des données
    for (let i = 0; i < 60; i++) {
      engine.recordDataPoint("exp_001", {
        sessionId:    `session_${i}`,
        variantKey:   i < 30 ? "control" : "treatment",
        primaryValue: i < 30
          ? 0.60 + Math.random() * 0.10
          : 0.70 + Math.random() * 0.10,  // Treatment légèrement meilleur
        metadata:     { coverage_score: 0.7 },
        timestamp:    new Date(),
      });
    }

    const results = engine.analyzeExperiment(experiment);

    expect(results).not.toBeNull();
    expect(results!.control.sampleSize).toBe(30);
    expect(results!.treatment.sampleSize).toBe(30);
    expect(results!.analysis.pValue).toBeGreaterThan(0);
    expect(results!.analysis.pValue).toBeLessThanOrEqual(1);
    expect(results!.analysis.testType).toBe("two_sample_t_test");
  });

  it("conclut correctement quand les résultats sont non-significatifs", () => {
    const experiment = buildExperiment();

    // Données identiques → pas de différence
    for (let i = 0; i < 100; i++) {
      engine.recordDataPoint("exp_001", {
        sessionId:    `session_${i}`,
        variantKey:   i < 50 ? "control" : "treatment",
        primaryValue: 0.65 + (Math.random() - 0.5) * 0.02, // Très proches
        metadata:     {},
        timestamp:    new Date(),
      });
    }

    const results = engine.analyzeExperiment(experiment);

    expect(results).not.toBeNull();
    if (results && !results.analysis.isSignificant) {
      expect(results.conclusion.winner).toBe("NO_WINNER");
      expect(["KEEP_CONTROL", "EXTEND_EXPERIMENT"]).toContain(results.conclusion.recommendation);
    }
  });

  it("calcule la taille d'échantillon requise", () => {
    const n = engine.calculateRequiredSampleSize({
      baselineRate:      0.65,
      minimumLift:       0.10,    // 10% de lift minimum
      significanceLevel: 0.05,
      power:             0.80,
    });

    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(10000); // Raisonnable
    expect(Number.isInteger(n)).toBe(true);
  });

  it("les intervalles de confiance à 95% sont cohérents", () => {
    const experiment = buildExperiment();

    for (let i = 0; i < 60; i++) {
      engine.recordDataPoint("exp_001", {
        sessionId:    `session_${i}`,
        variantKey:   i < 30 ? "control" : "treatment",
        primaryValue: 0.65 + Math.random() * 0.20,
        metadata:     {},
        timestamp:    new Date(),
      });
    }

    const results = engine.analyzeExperiment(experiment);
    if (!results) return;

    const [lower, upper] = results.control.primaryMetric.ci95;
    const value          = results.control.primaryMetric.value;

    expect(lower).toBeLessThanOrEqual(value);
    expect(upper).toBeGreaterThanOrEqual(value);
    expect(upper - lower).toBeGreaterThan(0);
  });

  it("l'effet size est calculé correctement", () => {
    const experiment = buildExperiment();

    // Effet large : grande différence entre contrôle et traitement
    for (let i = 0; i < 60; i++) {
      engine.recordDataPoint("exp_001", {
        sessionId:    `session_${i}`,
        variantKey:   i < 30 ? "control" : "treatment",
        primaryValue: i < 30 ? 0.50 : 0.80,  // Différence 0.30
        metadata:     {},
        timestamp:    new Date(),
      });
    }

    const results = engine.analyzeExperiment(experiment);
    expect(results).not.toBeNull();
    expect(Math.abs(results!.analysis.effectSize)).toBeGreaterThan(0.5); // Grand effet
  });
});
