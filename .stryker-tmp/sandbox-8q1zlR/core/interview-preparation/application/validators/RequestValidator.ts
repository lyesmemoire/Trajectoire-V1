/**
 * RequestValidator
 *
 * Application-level request validator.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY input validation and sanitization.
 */
// @ts-nocheck


export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export class RequestValidator {
  validateGenerateInterviewPlanRequest(request: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!request || typeof request !== "object") {
      errors.push({ field: "request", message: "Request must be an object" });
      return { isValid: false, errors };
    }

    const req = request as Record<string, unknown>;

    if (!req.candidateId || typeof req.candidateId !== "string") {
      errors.push({ field: "candidateId", message: "Candidate ID is required and must be a string" });
    }

    if (!req.jobOfferId || typeof req.jobOfferId !== "string") {
      errors.push({ field: "jobOfferId", message: "Job offer ID is required and must be a string" });
    }

    if (!req.matchingId || typeof req.matchingId !== "string") {
      errors.push({ field: "matchingId", message: "Matching ID is required and must be a string" });
    }

    if (!req.requestedBy || typeof req.requestedBy !== "string") {
      errors.push({ field: "requestedBy", message: "Requested by is required and must be a string" });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validatePlanId(planId: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!planId || typeof planId !== "string") {
      errors.push({ field: "planId", message: "Plan ID is required and must be a string" });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateCandidateLevel(candidateLevel: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const validLevels = ["JUNIOR", "MID_LEVEL", "SENIOR", "PRINCIPAL"];

    if (!candidateLevel || typeof candidateLevel !== "string") {
      errors.push({ field: "candidateLevel", message: "Candidate level is required and must be a string" });
    } else if (!validLevels.includes(candidateLevel as string)) {
      errors.push({ field: "candidateLevel", message: `Candidate level must be one of: ${validLevels.join(", ")}` });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateOrderingStrategy(strategy: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const validStrategies = ["DIFFICULTY_ASCENDING", "DIFFICULTY_DESCENDING", "COMPETENCY_GROUPED", "CUSTOM"];

    if (!strategy || typeof strategy !== "string") {
      errors.push({ field: "strategy", message: "Strategy is required and must be a string" });
    } else if (!validStrategies.includes(strategy as string)) {
      errors.push({ field: "strategy", message: `Strategy must be one of: ${validStrategies.join(", ")}` });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
