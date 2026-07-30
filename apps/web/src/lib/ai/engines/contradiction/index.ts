// ===================================================================
// CONTRADICTION TYPES AND SCHEMAS — Central Exports
// ===================================================================

// Catalog
export { ContradictionCatalog, getContradictionType, getAllContradictionTypes, getContradictionTypesByCategory, getContradictionTypesBySeverity, getContradictionTypesByPolicy } from "../../../../domain/cognitive/catalogs/ContradictionCatalog";
export type { ContradictionType } from "../../../../domain/cognitive/catalogs/ContradictionCatalog";

// Policies
export { BaseContradictionPolicy } from "./policies/ContradictionPolicy";
export { BlockingContradictionPolicy } from "./policies/BlockingContradictionPolicy";
export { RecoverableContradictionPolicy } from "./policies/RecoverableContradictionPolicy";
export { BenefitOfDoubtPolicy } from "./policies/BenefitOfDoubtPolicy";
export { FalsePositivePolicy } from "./policies/FalsePositivePolicy";
export type { ContradictionPolicyContext, ContradictionPolicyResult } from "./policies/ContradictionPolicy";

// Ledger
export { ContradictionLedger } from "./ContradictionLedger";
export type { ContradictionAssessment, ContradictionLedgerEntry } from "./ContradictionLedger";

// Event Factory
export { ContradictionEventFactory } from "./ContradictionEventFactory";

// Validator
export { ContradictionValidator } from "./ContradictionValidator";
export type { ContradictionValidatorContext, ContradictionValidatorResult } from "./ContradictionValidator";
