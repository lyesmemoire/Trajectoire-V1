// ===================================================================
// OBSERVATION CATALOG — Observation Types, Patterns, and Expected Fields
// ===================================================================

export interface ObservationType {
  id: string;
  name: string;
  category: "claim" | "experience" | "production" | "metric" | "responsibility" | "failure" | "unknown" | "question";
  patterns: string[];
  expectedFields: string[];
  description: string;
}

export const ObservationCatalog: Map<string, ObservationType> = new Map([
  // Production Observations
  [
    "production-incident",
    {
      id: "production-incident",
      name: "ProductionIncidentObservation",
      category: "production",
      patterns: [
        "incident",
        "crash",
        "downtime",
        "panne",
        "erreur en prod",
        "production",
        "en prod",
        "environnement de production",
      ],
      expectedFields: ["incident", "rootCause", "impact", "resolution"],
      description: "Observation of production incidents or failures",
    },
  ],
  [
    "production-deployment",
    {
      id: "production-deployment",
      name: "ProductionDeploymentObservation",
      category: "production",
      patterns: [
        "déploiement",
        "deploy",
        "mise en prod",
        "release",
        "livraison",
        "production",
      ],
      expectedFields: ["deployment", "environment", "frequency", "success"],
      description: "Observation of production deployments",
    },
  ],

  // Failure Observations
  [
    "failure-project",
    {
      id: "failure-project",
      name: "ProjectFailureObservation",
      category: "failure",
      patterns: [
        "échec",
        "a échoué",
        "projet raté",
        "n'a pas marché",
        "échoué",
        "failure",
        "bug",
        "erreur technique",
      ],
      expectedFields: ["project", "failureReason", "lessonsLearned"],
      description: "Observation of project failures",
    },
  ],
  [
    "failure-technical",
    {
      id: "failure-technical",
      name: "TechnicalFailureObservation",
      category: "failure",
      patterns: [
        "bug",
        "erreur technique",
        "problème technique",
        "issue",
        "technical debt",
      ],
      expectedFields: ["issue", "severity", "resolution"],
      description: "Observation of technical failures",
    },
  ],

  // Responsibility Observations
  [
    "responsibility-team",
    {
      id: "responsibility-team",
      name: "TeamResponsibilityObservation",
      category: "responsibility",
      patterns: [
        "dirigé",
        "dirigée",
        "dirigé une équipe",
        "leader",
        "responsable d'équipe",
        "team lead",
        "chef d'équipe",
        "manager",
      ],
      expectedFields: ["teamSize", "duration", "role", "context"],
      description: "Observation of team leadership responsibilities",
    },
  ],
  [
    "responsibility-project",
    {
      id: "responsibility-project",
      name: "ProjectResponsibilityObservation",
      category: "responsibility",
      patterns: [
        "responsable du projet",
        "en charge du projet",
        "project owner",
        "géré un projet",
        "pilote",
      ],
      expectedFields: ["project", "duration", "teamSize", "outcome"],
      description: "Observation of project responsibilities",
    },
  ],

  // Experience Observations
  [
    "experience-technology",
    {
      id: "experience-technology",
      name: "TechnologyExperienceObservation",
      category: "experience",
      patterns: [
        "expérience avec",
        "utilisé",
        "travaillé avec",
        "développé avec",
        "implémenté",
        "connaissance de",
      ],
      expectedFields: ["technology", "duration", "context", "depth"],
      description: "Observation of technology experience",
    },
  ],
  [
    "experience-domain",
    {
      id: "experience-domain",
      name: "DomainExperienceObservation",
      category: "experience",
      patterns: [
        "expérience dans",
        "travaillé dans",
        "domaine",
        "secteur",
        "industrie",
      ],
      expectedFields: ["domain", "duration", "context"],
      description: "Observation of domain experience",
    },
  ],

  // Metric Observations
  [
    "metric-performance",
    {
      id: "metric-performance",
      name: "PerformanceMetricObservation",
      category: "metric",
      patterns: [
        "performance",
        "optimisation",
        "amélioré",
        "améliorée",
        "réduit",
        "réduite",
        "augmenté",
        "augmentée",
        "latence",
        "throughput",
      ],
      expectedFields: ["metric", "before", "after", "impact"],
      description: "Observation of performance metrics",
    },
  ],
  [
    "metric-scale",
    {
      id: "metric-scale",
      name: "ScaleMetricObservation",
      category: "metric",
      patterns: [
        "scalé",
        "mise à l'échelle",
        "scale",
        "volume",
        "charge",
        "trafic",
      ],
      expectedFields: ["metric", "scale", "context"],
      description: "Observation of scale metrics",
    },
  ],

  // Claim Observations
  [
    "claim-skill",
    {
      id: "claim-skill",
      name: "SkillClaimObservation",
      category: "claim",
      patterns: [
        "maîtrise",
        "maîtrise",
        "expert",
        "compétence",
        "je sais",
        "je connais",
        "bon en",
        "bonne en",
        "fort en",
        "forte en",
      ],
      expectedFields: ["skill", "level", "context"],
      description: "Observation of skill claims (to be verified by EvidenceEngine)",
    },
  ],
  [
    "claim-achievement",
    {
      id: "claim-achievement",
      name: "AchievementClaimObservation",
      category: "claim",
      patterns: [
        "réalisé",
        "accompli",
        "succès",
        "réussi",
        "atteint",
        "objectif",
      ],
      expectedFields: ["achievement", "context", "impact"],
      description: "Observation of achievement claims (to be verified by EvidenceEngine)",
    },
  ],

  // Unknown Observations
  [
    "unknown-knowledge",
    {
      id: "unknown-knowledge",
      name: "UnknownKnowledgeObservation",
      category: "unknown",
      patterns: [
        "je ne sais pas",
        "je ne connais pas",
        "inconnu",
        "pas sûr",
        "je ne me souviens pas",
      ],
      expectedFields: ["topic", "context"],
      description: "Observation of unknown knowledge gaps",
    },
  ],

  // Question Observations
  [
    "question-clarification",
    {
      id: "question-clarification",
      name: "ClarificationQuestionObservation",
      category: "question",
      patterns: [
        "question",
        "pourquoi",
        "comment",
        "qu'est-ce que",
        "explique",
        "clarification",
      ],
      expectedFields: ["question", "context"],
      description: "Observation of clarification questions",
    },
  ],
]);
