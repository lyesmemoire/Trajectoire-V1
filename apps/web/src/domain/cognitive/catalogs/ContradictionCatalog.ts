// ===================================================================
// CONTRADICTION CATALOG — Contradiction Types Driven by Data
// ===================================================================

export interface ContradictionType {
  id: string;
  name: string;
  description: string;
  category: "FACTUAL" | "TEMPORAL" | "TECHNICAL" | "RESPONSIBILITY" | "SENIORITY" | "VERSION" | "SCALE" | "ROLE" | "TIMELINE";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  policy: string; // policy to apply for this contradiction type
  ruleId: string; // e.g., "CONTRADICTION-001"
  ruleVersion: string; // e.g., "1.0.0"
  examples: string[];
}

export const ContradictionCatalog: Map<string, ContradictionType> = new Map([
  // FACTUAL Contradictions
  [
    "factual-number-mismatch",
    {
      id: "factual-number-mismatch",
      name: "Factual Number Mismatch",
      description: "Different numerical values for the same concept (e.g., 180 vs 120 microservices)",
      category: "FACTUAL",
      severity: "HIGH",
      policy: "BlockingContradictionPolicy",
      ruleId: "CONTRADICTION-001",
      ruleVersion: "1.0.0",
      examples: [
        "180 microservices vs 120 microservices",
        "5 years experience vs 2 years experience",
        "Team of 10 vs team of 20",
      ],
    },
  ],

  [
    "factual-entity-mismatch",
    {
      id: "factual-entity-mismatch",
      name: "Factual Entity Mismatch",
      description: "Different entities claimed for the same role (e.g., Airbus vs Boeing)",
      category: "FACTUAL",
      severity: "CRITICAL",
      policy: "BlockingContradictionPolicy",
      ruleId: "CONTRADICTION-002",
      ruleVersion: "1.0.0",
      examples: [
        "Worked at Airbus vs Worked at Boeing",
        "Used Kubernetes vs Used Docker Swarm",
        "Led team of 50 vs Led team of 5",
      ],
    },
  ],

  // TEMPORAL Contradictions
  [
    "temporal-overlap",
    {
      id: "temporal-overlap",
      name: "Temporal Overlap",
      description: "Events claimed to occur simultaneously that cannot logically overlap",
      category: "TEMPORAL",
      severity: "HIGH",
      policy: "RecoverableContradictionPolicy",
      ruleId: "CONTRADICTION-003",
      ruleVersion: "1.0.0",
      examples: [
        "Working full-time at company A while working full-time at company B for the same period",
        "Leading project X while leading project Y during the same timeframe",
      ],
    },
  ],

  [
    "temporal-sequence",
    {
      id: "temporal-sequence",
      name: "Temporal Sequence Violation",
      description: "Events claimed in wrong chronological order (effect before cause)",
      category: "TEMPORAL",
      severity: "MEDIUM",
      policy: "RecoverableContradictionPolicy",
      ruleId: "CONTRADICTION-004",
      ruleVersion: "1.0.0",
      examples: [
        "Migrated to Kubernetes before learning Docker",
        "Led team before joining the company",
      ],
    },
  ],

  // TECHNICAL Contradictions
  [
    "technical-incompatibility",
    {
      id: "technical-incompatibility",
      name: "Technical Incompatibility",
      description: "Technologies or approaches that cannot work together as claimed",
      category: "TECHNICAL",
      severity: "HIGH",
      policy: "BlockingContradictionPolicy",
      ruleId: "CONTRADICTION-005",
      ruleVersion: "1.0.0",
      examples: [
        "Used .NET Core 2.0 with C# 12 features",
        "Deployed to AWS Lambda with Windows-specific code",
        "Used React Native for backend development",
      ],
    },
  ],

  [
    "technical-scale-mismatch",
    {
      id: "technical-scale-mismatch",
      name: "Technical Scale Mismatch",
      description: "Scale claimed incompatible with technology used",
      category: "TECHNICAL",
      severity: "MEDIUM",
      policy: "BenefitOfDoubtPolicy",
      ruleId: "CONTRADICTION-006",
      ruleVersion: "1.0.0",
      examples: [
        "Handled 1M requests/day with a single server",
        "Processed 10TB data with 4GB RAM",
      ],
    },
  ],

  // RESPONSIBILITY Contradictions
  [
    "responsibility-overlap",
    {
      id: "responsibility-overlap",
      name: "Responsibility Overlap",
      description: "Claiming responsibility for outcomes that conflict with stated role",
      category: "RESPONSIBILITY",
      severity: "HIGH",
      policy: "RecoverableContradictionPolicy",
      ruleId: "CONTRADICTION-007",
      ruleVersion: "1.0.0",
      examples: [
        "Junior developer claims to have led architecture decisions",
        "Individual contributor claims to have managed team budget",
      ],
    },
  ],

  [
    "responsibility-denial",
    {
      id: "responsibility-denial",
      name: "Responsibility Denial",
      description: "Denying responsibility for outcomes that align with stated role",
      category: "RESPONSIBILITY",
      severity: "MEDIUM",
      policy: "BenefitOfDoubtPolicy",
      ruleId: "CONTRADICTION-008",
      ruleVersion: "1.0.0",
      examples: [
        "Tech lead denies responsibility for system outage",
        "Manager denies responsibility for team performance",
      ],
    },
  ],

  // SENIORITY Contradictions
  [
    "seniority-experience-mismatch",
    {
      id: "seniority-experience-mismatch",
      name: "Seniority Experience Mismatch",
      description: "Claimed seniority inconsistent with stated experience duration",
      category: "SENIORITY",
      severity: "MEDIUM",
      policy: "FalsePositivePolicy",
      ruleId: "CONTRADICTION-009",
      ruleVersion: "1.0.0",
      examples: [
        "Senior engineer with 6 months total experience",
        "Principal architect with 2 years experience",
      ],
    },
  ],

  [
    "seniority-scope-mismatch",
    {
      id: "seniority-scope-mismatch",
      name: "Seniority Scope Mismatch",
      description: "Scope of responsibilities inconsistent with seniority level",
      category: "SENIORITY",
      severity: "LOW",
      policy: "BenefitOfDoubtPolicy",
      ruleId: "CONTRADICTION-010",
      ruleVersion: "1.0.0",
      examples: [
        "Junior developer claims to have designed company-wide architecture",
        "Intern claims to have led production incident response",
      ],
    },
  ],

  // VERSION Contradictions
  [
    "version-mismatch",
    {
      id: "version-mismatch",
      name: "Version Mismatch",
      description: "Different version numbers claimed for the same technology",
      category: "VERSION",
      severity: "LOW",
      policy: "FalsePositivePolicy",
      ruleId: "CONTRADICTION-011",
      ruleVersion: "1.0.0",
      examples: [
        "Used Java 17 vs Used Java 11 for the same project",
        "React 18 vs React 16 for the same application",
      ],
    },
  ],

  // SCALE Contradictions
  [
    "scale-inconsistency",
    {
      id: "scale-inconsistency",
      name: "Scale Inconsistency",
      description: "Inconsistent scale metrics across related claims",
      category: "SCALE",
      severity: "MEDIUM",
      policy: "RecoverableContradictionPolicy",
      ruleId: "CONTRADICTION-012",
      ruleVersion: "1.0.0",
      examples: [
        "Team of 10 people delivered project requiring 50 people",
        "1-week sprint delivered 6-month project scope",
      ],
    },
  ],

  // ROLE Contradictions
  [
    "role-conflict",
    {
      id: "role-conflict",
      name: "Role Conflict",
      description: "Claims inconsistent with stated role or position",
      category: "ROLE",
      severity: "MEDIUM",
      policy: "BenefitOfDoubtPolicy",
      ruleId: "CONTRADICTION-013",
      ruleVersion: "1.0.0",
      examples: [
        "Backend developer claims to have designed frontend architecture",
        "DevOps engineer claims to have written core business logic",
      ],
    },
  ],

  // TIMELINE Contradictions
  [
    "timeline-gap",
    {
      id: "timeline-gap",
      name: "Timeline Gap",
      description: "Unexplained gaps in claimed timeline of events",
      category: "TIMELINE",
      severity: "LOW",
      policy: "BenefitOfDoubtPolicy",
      ruleId: "CONTRADICTION-014",
      ruleVersion: "1.0.0",
      examples: [
        "Claims 5 years at company with only 2 years accounted for",
        "Claims continuous project work with unexplained gaps",
      ],
    },
  ],

  [
    "timeline-density",
    {
      id: "timeline-density",
      name: "Timeline Density",
      description: "Too many events claimed for the available time period",
      category: "TIMELINE",
      severity: "MEDIUM",
      policy: "RecoverableContradictionPolicy",
      ruleId: "CONTRADICTION-015",
      ruleVersion: "1.0.0",
      examples: [
        "Claims 10 major projects in 6 months",
        "Claims to have led 5 teams simultaneously while doing full-time development",
      ],
    },
  ],
]);

export function getContradictionType(id: string): ContradictionType | undefined {
  return ContradictionCatalog.get(id);
}

export function getAllContradictionTypes(): ContradictionType[] {
  return Array.from(ContradictionCatalog.values());
}

export function getContradictionTypesByCategory(category: ContradictionType["category"]): ContradictionType[] {
  return getAllContradictionTypes().filter((t) => t.category === category);
}

export function getContradictionTypesBySeverity(severity: ContradictionType["severity"]): ContradictionType[] {
  return getAllContradictionTypes().filter((t) => t.severity === severity);
}

export function getContradictionTypesByPolicy(policy: string): ContradictionType[] {
  return getAllContradictionTypes().filter((t) => t.policy === policy);
}
