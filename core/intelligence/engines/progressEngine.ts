import { ProgressTrend, CandidateProfile } from "../types";

/**
 * Progress Engine
 * 
 * Responsibilities:
 * - Track progression across all metrics
 * - Detect trends (improvement, regression, stagnation, acceleration, plateau)
 * - Calculate velocity of change
 * - Predict future performance
 * - Identify plateaus and suggest interventions
 */

export class ProgressEngine {
  /**
   * Analyze progress trends for a specific metric
   */
  static analyzeProgressTrend(
    profile: CandidateProfile,
    metric: string,
    historyLength: number = 5
  ): ProgressTrend {
    const relevantRecords = profile.history.progressions
      .filter(p => p.metric === metric)
      .slice(-historyLength);

    if (relevantRecords.length < 2) {
      return {
        metric,
        current: this.getCurrentMetricValue(profile, metric),
        previous: this.getCurrentMetricValue(profile, metric),
        trend: "stagnation",
        velocity: 0,
      };
    }

    const current = relevantRecords[relevantRecords.length - 1]?.newValue ?? 0;
    const previous = relevantRecords[0]?.previousValue ?? 0;
    const change = current - previous;
    
    // Calculate velocity (rate of change)
    const timeSpan = relevantRecords.length;
    const velocity = change / timeSpan;

    // Determine trend
    let trend: "improvement" | "regression" | "stagnation" | "acceleration" | "plateau";
    
    if (Math.abs(change) < 5) {
      trend = "stagnation";
    } else if (change > 0) {
      // Check if accelerating
      const recentChanges = relevantRecords.slice(-3).map(r => r.change);
      const avgRecentChange = recentChanges.reduce((a, b) => a + b, 0) / recentChanges.length;
      const earlyChanges = relevantRecords.slice(0, 3).map(r => r.change);
      const avgEarlyChange = earlyChanges.reduce((a, b) => a + b, 0) / earlyChanges.length;
      
      if (avgRecentChange > avgEarlyChange * 1.2) {
        trend = "acceleration";
      } else {
        trend = "improvement";
      }
    } else {
      trend = "regression";
    }

    // Check for plateau (consistent values with minimal variation)
    const values = relevantRecords.map(r => r.newValue);
    const variance = this.calculateVariance(values);
    if (variance < 10 && trend === "stagnation") {
      trend = "plateau";
    }

    // Predict future value (simple linear extrapolation)
    const prediction = current + velocity * 2;

    return {
      metric,
      current,
      previous,
      trend,
      velocity: Math.round(velocity * 10) / 10,
      prediction: Math.round(prediction),
    };
  }

  /**
   * Get current value for a metric from profile
   */
  private static getCurrentMetricValue(profile: CandidateProfile, metric: string): number {
    switch (metric) {
      case "ATS Score":
        return profile.metrics.atsScore;
      case "Average Score":
        return profile.metrics.averageScore;
      case "Success Rate":
        return profile.metrics.successRate;
      case "Communication":
        return profile.behavior.synthesisAbility; // Approximation
      case "Leadership":
        return profile.behavior.leadershipStyle !== "authoritative" ? 70 : 80; // Simplified
      case "Confidence":
        return profile.behavior.confidenceLevel;
      case "STAR Proficiency":
        return profile.behavior.starProficiency;
      case "Business Impact":
        return profile.behavior.businessImpact;
      case "Persuasion":
        return profile.behavior.persuasionAbility;
      default:
        return 50;
    }
  }

  /**
   * Calculate variance of values
   */
  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  /**
   * Analyze overall progress across all metrics
   */
  static analyzeOverallProgress(profile: CandidateProfile): {
    metrics: ProgressTrend[];
    summary: {
      improving: number;
      regressing: number;
      stagnant: number;
      accelerating: number;
      plateau: number;
    };
    overallTrend: "positive" | "negative" | "mixed" | "stable";
  } {
    const metricsToTrack = [
      "ATS Score",
      "Average Score",
      "Success Rate",
      "Communication",
      "Leadership",
      "Confidence",
      "STAR Proficiency",
      "Business Impact",
      "Persuasion",
    ];

    const trends = metricsToTrack.map(metric => 
      this.analyzeProgressTrend(profile, metric)
    );

    const summary = {
      improving: trends.filter(t => t.trend === "improvement").length,
      regressing: trends.filter(t => t.trend === "regression").length,
      stagnant: trends.filter(t => t.trend === "stagnation").length,
      accelerating: trends.filter(t => t.trend === "acceleration").length,
      plateau: trends.filter(t => t.trend === "plateau").length,
    };

    let overallTrend: "positive" | "negative" | "mixed" | "stable";
    
    if (summary.accelerating > 0 || summary.improving > summary.regressing + summary.stagnant) {
      overallTrend = "positive";
    } else if (summary.regressing > summary.improving + summary.stagnant) {
      overallTrend = "negative";
    } else if (summary.stagnant > summary.improving + summary.regressing) {
      overallTrend = "stable";
    } else {
      overallTrend = "mixed";
    }

    return {
      metrics: trends,
      summary,
      overallTrend,
    };
  }

  /**
   * Detect if candidate is in a plateau phase
   */
  static detectPlateau(profile: CandidateProfile, metric: string, threshold: number = 10): boolean {
    const trend = this.analyzeProgressTrend(profile, metric);
    return trend.trend === "plateau" && Math.abs(trend.velocity) < threshold;
  }

  /**
   * Suggest intervention for plateau
   */
  static suggestPlateauIntervention(metric: string): string {
    const interventions: Record<string, string> = {
      "ATS Score": "Revoir votre CV avec les mots-clés actuels du marché et simuler de nouvelles soumissions",
      "Average Score": "Augmenter la difficulté des simulations pour sortir de votre zone de confort",
      "Success Rate": "Analyser vos échecs récents et identifier les patterns récurrents",
      "Communication": "Pratiquer avec un partenaire pour obtenir du feedback immédiat",
      "Leadership": "Prendre des responsabilités supplémentaires dans votre rôle actuel",
      "Confidence": "Enregistrer vos réponses et les écouter pour identifier les hésitations",
      "STAR Proficiency": "Préparer 5 nouveaux exemples STAR dans des domaines différents",
      "Business Impact": "Travailler avec un mentor pour identifier comment quantifier vos résultats",
      "Persuasion": "Étudier des discours persuasifs et pratiquer les techniques",
    };

    return interventions[metric] || "Varier votre approche et essayer de nouvelles méthodes";
  }

  /**
   * Calculate progress velocity (rate of improvement)
   */
  static calculateVelocity(profile: CandidateProfile, metric: string): number {
    const trend = this.analyzeProgressTrend(profile, metric);
    return trend.velocity;
  }

  /**
   * Predict future performance based on current trajectory
   */
  static predictFuturePerformance(
    profile: CandidateProfile,
    metric: string,
    periods: number = 3
  ): number {
    const trend = this.analyzeProgressTrend(profile, metric);
    if (!trend.prediction) {
      return trend.current;
    }
    return trend.current + (trend.velocity * periods);
  }

  /**
   * Generate progress report
   */
  static generateProgressReport(profile: CandidateProfile): {
    summary: string;
    keyInsights: string[];
    recommendations: string[];
    milestones: string[];
  } {
    const overall = this.analyzeOverallProgress(profile);
    
    let summary = "";
    switch (overall.overallTrend) {
      case "positive":
        summary = "Votre progression est positive. Vous êtes sur une trajectoire d'amélioration avec plusieurs métriques en accélération.";
        break;
      case "negative":
        summary = "Attention, votre progression est en baisse. Plusieurs métriques régressent et nécessitent une intervention rapide.";
        break;
      case "mixed":
        summary = "Votre progression est mitigée. Certains domaines s'améliorent tandis que d'autres stagnent ou régressent.";
        break;
      case "stable":
        summary = "Votre progression est stable. Vous maintenez votre niveau mais pour progresser, il faudrait sortir de votre zone de confort.";
        break;
    }

    const keyInsights: string[] = [];
    
    // Identify accelerating metrics
    overall.metrics.filter(m => m.trend === "acceleration").forEach(m => {
      keyInsights.push(`${m.metric} est en accélération (+${m.velocity.toFixed(1)}/période)`);
    });

    // Identify regressing metrics
    overall.metrics.filter(m => m.trend === "regression").forEach(m => {
      keyInsights.push(`${m.metric} est en régression (${m.velocity.toFixed(1)}/période)`);
    });

    // Identify plateaus
    overall.metrics.filter(m => m.trend === "plateau").forEach(m => {
      keyInsights.push(`${m.metric} est en plateau - considérez changer d'approche`);
    });

    const recommendations: string[] = [];
    
    if (overall.summary.regressing > 0) {
      recommendations.push("Priorisez la correction des métriques en régression avant de continuer à progresser ailleurs.");
    }

    if (overall.summary.plateau > 2) {
      recommendations.push("Vous avez plusieurs plateaux - il est temps d'augmenter la difficulté ou de changer de méthode.");
    }

    if (overall.summary.accelerating > 0) {
      recommendations.push("Continuez dans cette direction - votre accélération montre que votre méthode fonctionne.");
    }

    const milestones: string[] = [];
    
    // Predict milestones
    overall.metrics.forEach(m => {
      if (m.trend === "improvement" || m.trend === "acceleration") {
        const prediction = this.predictFuturePerformance(profile, m.metric, 5);
        if (prediction > m.current + 10) {
          milestones.push(`${m.metric} devrait atteindre ${prediction} dans 5 périodes`);
        }
      }
    });

    return {
      summary,
      keyInsights,
      recommendations,
      milestones,
    };
  }

  /**
   * Compare progress with peer benchmarks
   */
  static compareWithPeers(profile: CandidateProfile, peerAverages: Record<string, number>): {
    metric: string;
    userValue: number;
    peerAverage: number;
    difference: number;
    percentile: number;
  }[] {
    const metricsToCompare = [
      "ATS Score",
      "Average Score",
      "Success Rate",
      "Communication",
      "Leadership",
      "Confidence",
    ];

    return metricsToCompare.map(metric => {
      const userValue = this.getCurrentMetricValue(profile, metric);
      const peerAverage = peerAverages[metric] || 50;
      const difference = userValue - peerAverage;
      
      // Estimate percentile (simplified)
      let percentile = 50;
      if (difference > 20) percentile = 90;
      else if (difference > 10) percentile = 75;
      else if (difference > 0) percentile = 60;
      else if (difference > -10) percentile = 40;
      else percentile = 25;

      return {
        metric,
        userValue,
        peerAverage,
        difference,
        percentile,
      };
    });
  }
}
