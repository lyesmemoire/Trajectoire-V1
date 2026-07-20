// Wrapper pour maintenir la compatibilité avec l'ancien système de crédits
import {
  deductCredits as oldDeduct,
  addCredits as oldAdd,
  getCredits as oldGet,
  hasEnoughCredits as oldHasEnough,
  CREDIT_COSTS,
} from "@/services/credits";
import type { CreditAction, CreditOperationResult } from "@/services/credits";

export const LegacyCredits = {
  deduct: oldDeduct,
  add: oldAdd,
  get: oldGet,
  hasEnough: oldHasEnough,
  COSTS: CREDIT_COSTS,
};

export type { CreditAction, CreditOperationResult };
