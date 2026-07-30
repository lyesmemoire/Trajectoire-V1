// ===================================================================
// EVIDENCE DIMENSION CATALOG — Evidence Dimensions Driven by Data
// ===================================================================

export interface EvidenceDimension {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1, importance of this dimension
  minimum: number; // minimum value to be considered valid
  maximum: number; // maximum value
  policy: string; // policy to apply for this dimension
}

export const EvidenceDimensionCatalog: Map<string, EvidenceDimension> = new Map([
  // Specificity Dimension
  [
    "specificity",
    {
      id: "specificity",
      name: "Specificity",
      description: "How specific and detailed is the evidence (vague vs precise)",
      weight: 0.25,
      minimum: 0.0,
      maximum: 1.0,
      policy: "SpecificityPolicy",
    },
  ],

  // Ownership Dimension
  [
    "ownership",
    {
      id: "ownership",
      name: "Ownership",
      description: "Degree of personal ownership and responsibility claimed",
      weight: 0.20,
      minimum: 0.0,
      maximum: 1.0,
      policy: "OwnershipPolicy",
    },
  ],

  // Production Dimension
  [
    "production",
    {
      id: "production",
      name: "Production",
      description: "Evidence from production environment vs development/testing",
      weight: 0.30,
      minimum: 0.0,
      maximum: 1.0,
      policy: "ProductionPolicy",
    },
  ],

  // Quantification Dimension
  [
    "quantification",
    {
      id: "quantification",
      name: "Quantification",
      description: "Presence of quantifiable metrics and numbers",
      weight: 0.20,
      minimum: 0.0,
      maximum: 1.0,
      policy: "QuantificationPolicy",
    },
  ],

  // Failure Dimension
  [
    "failure",
    {
      id: "failure",
      name: "Failure",
      description: "Evidence of failures, incidents, or problems encountered",
      weight: 0.25,
      minimum: 0.0,
      maximum: 1.0,
      policy: "FailurePolicy",
    },
  ],

  // Recency Dimension
  [
    "recency",
    {
      id: "recency",
      name: "Recency",
      description: "How recent is the evidence (time decay)",
      weight: 0.15,
      minimum: 0.0,
      maximum: 1.0,
      policy: "RecencyPolicy",
    },
  ],

  // Corroboration Dimension
  [
    "corroboration",
    {
      id: "corroboration",
      name: "Corroboration",
      description: "Degree of corroboration from other sources/observations",
      weight: 0.20,
      minimum: 0.0,
      maximum: 1.0,
      policy: "CorroborationPolicy",
    },
  ],

  // Verifiability Dimension
  [
    "verifiability",
    {
      id: "verifiability",
      name: "Verifiability",
      description: "How easily can the evidence be independently verified",
      weight: 0.15,
      minimum: 0.0,
      maximum: 1.0,
      policy: "VerifiabilityPolicy",
    },
  ],
]);

export function getDimension(id: string): EvidenceDimension | undefined {
  return EvidenceDimensionCatalog.get(id);
}

export function getAllDimensions(): EvidenceDimension[] {
  return Array.from(EvidenceDimensionCatalog.values());
}

export function getDimensionsByPolicy(policy: string): EvidenceDimension[] {
  return getAllDimensions().filter((d) => d.policy === policy);
}
