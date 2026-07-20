/**
 * HIIOS v4 Enterprise — LLM Response Parser
 *
 * Le LLM ne parle jamais directement au Kernel.
 * Toute réponse LLM est parsée et validée avant intégration.
 */

// ─────────────────────────────────────────────
// TYPES LOCAUX (à migrer vers @hiios/core quand disponible)
// ─────────────────────────────────────────────

export enum EvidenceLevel {
  L1_DIRECT_OBSERVED = "L1_DIRECT_OBSERVED",
  L2_INDIRECT_STRONG = "L2_INDIRECT_STRONG",
  L3_BEHAVIORAL_SIGNAL = "L3_BEHAVIORAL_SIGNAL",
  L4_WEAK_SIGNAL = "L4_WEAK_SIGNAL",
  L5_INFERENCE = "L5_INFERENCE",
}

// ─────────────────────────────────────────────
// TYPES DE SORTIE ATTENDUS
// ─────────────────────────────────────────────

export interface ParsedAnalysis {
  evidences:       ParsedEvidence[];
  patterns:        ParsedPattern[];
  contradictions:  ParsedContradiction[];
  activeSignals:   string[];
  requiresFollowUp: boolean;
  responseQuality: "HIGH" | "MEDIUM" | "LOW";
  keySignals:      string[];
}

export interface ParsedEvidence {
  content:                string;
  level:                  EvidenceLevel;
  source:                 string;
  reliability:            number;
  supportsHypothesisIds:  string[];
  opposesHypothesisIds:   string[];
}

export interface ParsedPattern {
  name:        string;
  description: string;
  valence:     "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "COMPLEX";
  certainty:   "STRONG" | "MODERATE" | "SPECULATIVE";
}

export interface ParsedContradiction {
  description: string;
  severity:    "CRITICAL" | "MAJOR" | "MINOR";
}

export interface ParsedDecision {
  recommendation:        string;
  globalConfidenceScore: number;
  rationale: {
    summary:                  string;
    fullExplanation:          string;
    uncertaintiesAcknowledged: string[];
  };
  skillAssessments:      ParsedSkillAssessment[];
  keyStrengths:          string[];
  keyRisks:              string[];
  openQuestions:         string[];
  recommendedNextSteps:  string[];
}

export interface ParsedSkillAssessment {
  skillId:         string;
  confidenceScore: number;
  summary:         string;
}

export interface ParseResult<T> {
  success:  boolean;
  data?:    T;
  errors:   ParseError[];
  warnings: ParseWarning[];
  rawInput: string;
}

export interface ParseError {
  field:       string;
  message:     string;
  severity:    "BLOCKING" | "DEGRADED";
}

export interface ParseWarning {
  field:   string;
  message: string;
}

// ─────────────────────────────────────────────
// PARSER
// ─────────────────────────────────────────────

export class LLMResponseParser {

  // ── Parse Analysis ─────────────────────────

  parseAnalysis(raw: string): ParseResult<ParsedAnalysis> {
    const errors:   ParseError[]   = [];
    const warnings: ParseWarning[] = [];

    // Extraction JSON robuste
    const json = this.extractJSON(raw);
    if (!json) {
      return {
        success:  false,
        errors:   [{ field: "root", message: "Impossible d'extraire du JSON", severity: "BLOCKING" }],
        warnings: [],
        rawInput: raw,
      };
    }

    // Validation et normalisation
    const evidences    = this.parseEvidences(json.evidences ?? [], errors, warnings);
    const patterns     = this.parsePatterns(json.patterns ?? [], warnings);
    const contradictions = this.parseContradictions(json.contradictions ?? [], warnings);

    if (!Array.isArray(json.keySignals)) {
      warnings.push({ field: "keySignals", message: "keySignals manquant ou invalide — défaut []" });
    }

    const blocking = errors.filter(e => e.severity === "BLOCKING");

    return {
      success:  blocking.length === 0,
      data: {
        evidences,
        patterns,
        contradictions,
        activeSignals:    json.activeSignals ?? [],
        requiresFollowUp: json.requiresFollowUp ?? false,
        responseQuality:  this.normalizeQuality(json.responseQuality),
        keySignals:       Array.isArray(json.keySignals) ? json.keySignals : [],
      },
      errors,
      warnings,
      rawInput: raw,
    };
  }

  // ── Parse Decision ─────────────────────────

  parseDecision(raw: string): ParseResult<ParsedDecision> {
    const errors:   ParseError[]   = [];
    const warnings: ParseWarning[] = [];

    const json = this.extractJSON(raw);
    if (!json) {
      return {
        success:  false,
        errors:   [{ field: "root", message: "Impossible d'extraire du JSON", severity: "BLOCKING" }],
        warnings: [],
        rawInput: raw,
      };
    }

    // Validation recommendation
    const validRecommendations = [
      "STRONG_YES", "YES", "YES_WITH_RESERVES", "NEUTRAL",
      "NO_WITH_RESERVES", "NO", "HARD_NO", "INSUFFICIENT_DATA",
    ];

    if (!validRecommendations.includes(json.recommendation)) {
      errors.push({
        field:    "recommendation",
        message:  `Recommandation invalide : "${json.recommendation}"`,
        severity: "BLOCKING",
      });
    }

    // Validation confidence score
    const score = Number(json.globalConfidenceScore);
    if (isNaN(score) || score < 0 || score > 1) {
      errors.push({
        field:    "globalConfidenceScore",
        message:  `Score invalide : ${json.globalConfidenceScore}`,
        severity: "BLOCKING",
      });
    }

    // Validation rationale
    if (!json.rationale?.summary) {
      errors.push({
        field:    "rationale.summary",
        message:  "Résumé de rationale manquant",
        severity: "BLOCKING",
      });
    }

    // Vérification langage interdit
    const forbiddenLanguage = this.checkForbiddenLanguage(
      JSON.stringify(json.rationale ?? {})
    );
    if (forbiddenLanguage.length > 0) {
      warnings.push({
        field:   "rationale",
        message: `Langage interdit détecté : ${forbiddenLanguage.join(", ")}`,
      });
    }

    const blocking = errors.filter(e => e.severity === "BLOCKING");

    return {
      success: blocking.length === 0,
      data: {
        recommendation:        json.recommendation,
        globalConfidenceScore: score,
        rationale: {
          summary:                  json.rationale?.summary ?? "",
          fullExplanation:          json.rationale?.fullExplanation ?? "",
          uncertaintiesAcknowledged: json.rationale?.uncertaintiesAcknowledged ?? [],
        },
        skillAssessments:      this.parseSkillAssessments(json.skillAssessments ?? [], warnings),
        keyStrengths:          Array.isArray(json.keyStrengths) ? json.keyStrengths : [],
        keyRisks:              Array.isArray(json.keyRisks) ? json.keyRisks : [],
        openQuestions:         Array.isArray(json.openQuestions) ? json.openQuestions : [],
        recommendedNextSteps:  Array.isArray(json.recommendedNextSteps) ? json.recommendedNextSteps : [],
      },
      errors,
      warnings,
      rawInput: raw,
    };
  }

  // ── Validation épistémologique ─────────────

  validateEpistemicCompliance(parsed: ParsedAnalysis): {
    compliant: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    // Vérifier que les preuves L1 ont une fiabilité élevée
    for (const ev of parsed.evidences) {
      if (ev.level === EvidenceLevel.L1_DIRECT_OBSERVED && ev.reliability < 0.70) {
        violations.push(`Preuve L1 avec fiabilité trop basse (${ev.reliability})`);
      }

      // Vérifier que le contenu est substantiel pour L1/L2
      if (
        (ev.level === EvidenceLevel.L1_DIRECT_OBSERVED ||
         ev.level === EvidenceLevel.L2_INDIRECT_STRONG) &&
        ev.content.split(" ").length < 10
      ) {
        violations.push(`Preuve ${ev.level} trop courte pour être valide`);
      }
    }

    // Vérifier les patterns négatifs ont des observations
    const negativePatterns = parsed.patterns.filter(p => p.valence === "NEGATIVE");
    for (const p of negativePatterns) {
      if (p.certainty === "STRONG" && parsed.evidences.length < 2) {
        violations.push(`Pattern négatif "${p.name}" marqué STRONG sans preuves suffisantes`);
      }
    }

    return {
      compliant:  violations.length === 0,
      violations,
    };
  }

  // ── Helpers ────────────────────────────────

  private extractJSON(raw: string): any | null {
    // Chercher le premier objet JSON dans le texte
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }

  private parseEvidences(
    evidences: any[],
    errors:   ParseError[],
    warnings: ParseWarning[]
  ): ParsedEvidence[] {
    return evidences.map(ev => {
      // Normaliser le niveau de preuve
      const level = this.normalizeEvidenceLevel(ev.level, warnings);

      // Clamper la fiabilité
      const reliability = Math.max(0, Math.min(1, Number(ev.reliability) ?? 0.5));

      return {
        content:                ev.content ?? "",
        level,
        source:                 ev.source ?? "unknown",
        reliability,
        supportsHypothesisIds:  Array.isArray(ev.supportsHypothesisIds) ? ev.supportsHypothesisIds : [],
        opposesHypothesisIds:   Array.isArray(ev.opposesHypothesisIds) ? ev.opposesHypothesisIds : [],
      };
    });
  }

  private normalizeEvidenceLevel(level: any, warnings: ParseWarning[]): EvidenceLevel {
    const levelMap: Record<string, EvidenceLevel> = {
      "L1": EvidenceLevel.L1_DIRECT_OBSERVED,
      "L2": EvidenceLevel.L2_INDIRECT_STRONG,
      "L3": EvidenceLevel.L3_BEHAVIORAL_SIGNAL,
      "L4": EvidenceLevel.L4_WEAK_SIGNAL,
      "L5": EvidenceLevel.L5_INFERENCE,
      "L1_DIRECT_OBSERVED": EvidenceLevel.L1_DIRECT_OBSERVED,
      "L2_INDIRECT_STRONG": EvidenceLevel.L2_INDIRECT_STRONG,
      "L3_BEHAVIORAL_SIGNAL": EvidenceLevel.L3_BEHAVIORAL_SIGNAL,
      "L4_WEAK_SIGNAL": EvidenceLevel.L4_WEAK_SIGNAL,
      "L5_INFERENCE": EvidenceLevel.L5_INFERENCE,
    };

    if (levelMap[level]) {
      return levelMap[level];
    }

    warnings.push({
      field:   "evidence.level",
      message: `Niveau de preuve inconnu : "${level}" — défaut L4_WEAK_SIGNAL`,
    });

    return EvidenceLevel.L4_WEAK_SIGNAL;
  }

  private parsePatterns(patterns: any[], warnings: ParseWarning[]): ParsedPattern[] {
    return patterns.map(p => ({
      name:        p.name ?? "unknown",
      description: p.description ?? "",
      valence:     this.normalizeValence(p.valence, warnings),
      certainty:   this.normalizeCertainty(p.certainty, warnings),
    }));
  }

  private parseContradictions(contradictions: any[], warnings: ParseWarning[]): ParsedContradiction[] {
    return contradictions.map(c => ({
      description: c.description ?? "",
      severity:    this.normalizeSeverity(c.severity, warnings),
    }));
  }

  private parseSkillAssessments(assessments: any[], warnings: ParseWarning[]): ParsedSkillAssessment[] {
    return assessments.map(a => ({
      skillId:         a.skillId ?? "unknown",
      confidenceScore: Math.max(0, Math.min(1, Number(a.confidenceScore) ?? 0.5)),
      summary:         a.summary ?? "",
    }));
  }

  private normalizeQuality(quality: any): "HIGH" | "MEDIUM" | "LOW" {
    if (quality === "HIGH" || quality === "MEDIUM" || quality === "LOW") {
      return quality;
    }
    return "MEDIUM";
  }

  private normalizeValence(valence: any, warnings: ParseWarning[]): "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "COMPLEX" {
    const valid = ["POSITIVE", "NEGATIVE", "NEUTRAL", "COMPLEX"];
    if (valid.includes(valence)) return valence;
    warnings.push({ field: "pattern.valence", message: `Valence invalide : ${valence}` });
    return "NEUTRAL";
  }

  private normalizeCertainty(certainty: any, warnings: ParseWarning[]): "STRONG" | "MODERATE" | "SPECULATIVE" {
    const valid = ["STRONG", "MODERATE", "SPECULATIVE"];
    if (valid.includes(certainty)) return certainty;
    warnings.push({ field: "pattern.certainty", message: `Certainty invalide : ${certainty}` });
    return "MODERATE";
  }

  private normalizeSeverity(severity: any, warnings: ParseWarning[]): "CRITICAL" | "MAJOR" | "MINOR" {
    const valid = ["CRITICAL", "MAJOR", "MINOR"];
    if (valid.includes(severity)) return severity;
    warnings.push({ field: "contradiction.severity", message: `Severity invalide : ${severity}` });
    return "MAJOR";
  }

  private checkForbiddenLanguage(text: string): string[] {
    const forbidden = [
      "sans aucun doute",
      "certainement",
      "absolument",
      "garanti",
      "incontestable",
    ];

    const found: string[] = [];
    const lower = text.toLowerCase();

    for (const phrase of forbidden) {
      if (lower.includes(phrase)) {
        found.push(phrase);
      }
    }

    return found;
  }
}
