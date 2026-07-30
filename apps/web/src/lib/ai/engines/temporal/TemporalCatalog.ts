// ===================================================================
// TEMPORAL CATALOG — Business Logic for Temporal Extraction
// ===================================================================

export interface TemporalPattern {
  id: string;
  name: string;
  regex: RegExp;
  description: string;
}

export interface TemporalExtractionRule {
  id: string;
  eventType: string;
  patterns: string[];
  description: string;
}

export class TemporalCatalog {
  private static readonly temporalPatterns: TemporalPattern[] = [
    {
      id: "year",
      name: "Year",
      regex: /\b(20\d{2}|19\d{2})\b/,
      description: "Matches 4-digit years (1900-2099)",
    },
    {
      id: "date",
      name: "Date",
      regex: /\d{1,2}\/\d{1,2}\/\d{4}/,
      description: "Matches MM/DD/YYYY or DD/MM/YYYY",
    },
    {
      id: "month-day",
      name: "Month/Day",
      regex: /\d{1,2}\/\d{1,2}/,
      description: "Matches MM/DD or DD/MM",
    },
    {
      id: "years-duration",
      name: "Years Duration",
      regex: /\d{1,2}\s*years?/gi,
      description: "Matches X years",
    },
    {
      id: "months-duration",
      name: "Months Duration",
      regex: /\d{1,2}\s*months?/gi,
      description: "Matches X months",
    },
    {
      id: "weeks-duration",
      name: "Weeks Duration",
      regex: /\d{1,2}\s*weeks?/gi,
      description: "Matches X weeks",
    },
    {
      id: "days-duration",
      name: "Days Duration",
      regex: /\d{1,2}\s*days?/gi,
      description: "Matches X days",
    },
    {
      id: "hours-duration",
      name: "Hours Duration",
      regex: /\d{1,2}\s*hours?/gi,
      description: "Matches X hours",
    },
    {
      id: "month-name",
      name: "Month Name",
      regex: /january|february|march|april|may|june|july|august|september|october|november|december/gi,
      description: "Matches month names",
    },
    {
      id: "day-name",
      name: "Day Name",
      regex: /monday|tuesday|wednesday|thursday|friday|saturday|sunday/gi,
      description: "Matches day names",
    },
    {
      id: "relative-today",
      name: "Relative Today",
      regex: /yesterday|today|tomorrow/gi,
      description: "Matches relative days",
    },
    {
      id: "relative-last",
      name: "Relative Last",
      regex: /last week|last month|last year/gi,
      description: "Matches last week/month/year",
    },
    {
      id: "relative-next",
      name: "Relative Next",
      regex: /next week|next month|next year/gi,
      description: "Matches next week/month/year",
    },
  ];

  private static readonly extractionRules: TemporalExtractionRule[] = [
    {
      id: "employment-rule",
      eventType: "employment",
      patterns: ["worked", "job", "position", "employed", "hired", "joined"],
      description: "Employment-related events",
    },
    {
      id: "project-rule",
      eventType: "project",
      patterns: ["project", "migration", "deployment", "implementation", "delivery"],
      description: "Project-related events",
    },
    {
      id: "learning-rule",
      eventType: "learning",
      patterns: ["learned", "studied", "training", "course", "certification", "education"],
      description: "Learning-related events",
    },
    {
      id: "incident-rule",
      eventType: "incident",
      patterns: ["incident", "outage", "failure", "crash", "downtime", "error"],
      description: "Incident-related events",
    },
  ];

  static getPatterns(): TemporalPattern[] {
    return this.temporalPatterns;
  }

  static getPatternById(id: string): TemporalPattern | undefined {
    return this.temporalPatterns.find(p => p.id === id);
  }

  static extractTemporalExpressions(content: string): string[] {
    const expressions: string[] = [];

    for (const pattern of this.temporalPatterns) {
      const matches = content.match(pattern.regex);
      if (matches) {
        expressions.push(...matches);
      }
    }

    return [...new Set(expressions.map(e => e.toLowerCase()))];
  }

  static parseTimestamp(content: string): Date | undefined {
    const yearMatch = content.match(/\b(20\d{2}|19\d{2})\b/);
    if (yearMatch) {
      return new Date(parseInt(yearMatch[1]), 0, 1);
    }
    return undefined;
  }

  static parseDuration(content: string): number | undefined {
    const yearMatch = content.match(/(\d+)\s*years?/i);
    if (yearMatch) {
      return parseInt(yearMatch[1]) * 365 * 24 * 60 * 60 * 1000;
    }

    const monthMatch = content.match(/(\d+)\s*months?/i);
    if (monthMatch) {
      return parseInt(monthMatch[1]) * 30 * 24 * 60 * 60 * 1000;
    }

    const weekMatch = content.match(/(\d+)\s*weeks?/i);
    if (weekMatch) {
      return parseInt(weekMatch[1]) * 7 * 24 * 60 * 60 * 1000;
    }

    return undefined;
  }

  static inferEventType(content: string): string {
    const lower = content.toLowerCase();

    for (const rule of this.extractionRules) {
      for (const pattern of rule.patterns) {
        if (lower.includes(pattern)) {
          return rule.eventType;
        }
      }
    }

    return "general";
  }

  static calculateConfidence(expressions: string[], timestamp?: Date, duration?: number): number {
    let confidence = 0.5;

    if (expressions.length > 0) {
      confidence += 0.2 * Math.min(expressions.length, 3) / 3;
    }

    if (timestamp) {
      confidence += 0.2;
    }

    if (duration) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }
}
