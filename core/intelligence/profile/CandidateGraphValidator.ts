import { CandidateGraph } from "./CandidateIntelligenceGraph";

/**
 * Candidate Graph Validation Result
 */
export interface CandidateGraphValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: "high" | "medium" | "low";
}

export interface ValidationSuggestion {
  field: string;
  message: string;
  action: string;
}

/**
 * Candidate Graph Validator
 *
 * Responsibilities:
 * - Validate candidate graph data
 * - Check for missing data
 * - Detect inconsistencies
 * - Identify conflicts
 * - Check for impossible scores
 * - Verify required fields
 */
export class CandidateGraphValidator {
  /**
   * Validate complete candidate graph
   */
  static validate(graph: CandidateGraph): CandidateGraphValidation {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];
    
    // Validate identity
    this.validateIdentity(graph.identity, errors, warnings, suggestions);
    
    // Validate career
    this.validateCareer(graph.career, errors, warnings, suggestions);
    
    // Validate skills
    this.validateSkills(graph.skills, errors, warnings, suggestions);
    
    // Validate scores
    this.validateScores(graph, errors, warnings, suggestions);
    
    // Validate overall score
    this.validateOverallScore(graph, errors, warnings, suggestions);
    
    // Validate progress
    this.validateProgress(graph.progress, errors, warnings, suggestions);
    
    // Validate trajectory
    this.validateTrajectory(graph.trajectory, errors, warnings, suggestions);
    
    // Validate decision readiness
    this.validateDecisionReadiness(graph.decisionReadiness, errors, warnings, suggestions);
    
    return {
      isValid: errors.filter(e => e.severity === "critical" || e.severity === "high").length === 0,
      errors,
      warnings,
      suggestions,
    };
  }
  
  private static validateIdentity(
    identity: CandidateGraph["identity"],
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ) {
    if (!identity.id || identity.id.trim() === "") {
      errors.push({
        field: "identity.id",
        message: "Identity ID is required",
        severity: "critical",
      });
    }
    
    if (!identity.name || identity.name.trim() === "") {
      errors.push({
        field: "identity.name",
        message: "Identity name is required",
        severity: "critical",
      });
    }
    
    if (!identity.email || identity.email.trim() === "") {
      errors.push({
        field: "identity.email",
        message: "Identity email is required",
        severity: "critical",
      });
    }
    
    if (!identity.email.includes("@")) {
      errors.push({
        field: "identity.email",
        message: "Invalid email format",
        severity: "high",
      });
    }
    
    if (!identity.location) {
      warnings.push({
        field: "identity.location",
        message: "Location is missing",
        severity: "medium",
      });
      suggestions.push({
        field: "identity.location",
        message: "Add location for better job recommendations",
        action: "Ask user to provide location",
      });
    }
  }
  
  private static validateCareer(
    career: CandidateGraph["career"],
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ) {
    if (career.yearsOfExperience < 0) {
      errors.push({
        field: "career.yearsOfExperience",
        message: "Years of experience cannot be negative",
        severity: "critical",
      });
    }
    
    if (career.yearsOfExperience > 50) {
      warnings.push({
        field: "career.yearsOfExperience",
        message: "Years of experience seems unusually high",
        severity: "medium",
      });
    }
    
    if (career.targetRoles.length === 0) {
      warnings.push({
        field: "career.targetRoles",
        message: "No target roles specified",
        severity: "high",
      });
      suggestions.push({
        field: "career.targetRoles",
        message: "Add target roles for better recommendations",
        action: "Ask user to specify target roles",
      });
    }
  }
  
  private static validateSkills(
    skills: CandidateGraph["skills"],
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ) {
    if (skills.length === 0) {
      warnings.push({
        field: "skills",
        message: "No skills defined",
        severity: "high",
      });
      suggestions.push({
        field: "skills",
        message: "Add skills for better profile assessment",
        action: "Ask user to add skills",
      });
    }
    
    skills.forEach((skill, index) => {
      if (skill.level < 0 || skill.level > 100) {
        errors.push({
          field: `skills[${index}].level`,
          message: "Skill level must be between 0 and 100",
          severity: "high",
        });
      }
      
      if (skill.confidence < 0 || skill.confidence > 1) {
        errors.push({
          field: `skills[${index}].confidence`,
          message: "Skill confidence must be between 0 and 1",
          severity: "high",
        });
      }
    });
  }
  
  private static validateScores(
    graph: CandidateGraph,
    errors: ValidationError[],
    _warnings: ValidationWarning[],
    _suggestions: ValidationSuggestion[]
  ) {
    const { clarity, confidence } = graph.communication;
    const { vision } = graph.leadership;
    
    if (clarity < 0 || clarity > 100) {
      errors.push({
        field: "communication.clarity",
        message: "Communication clarity score must be between 0 and 100",
        severity: "high",
      });
    }
    
    if (vision < 0 || vision > 100) {
      errors.push({
        field: "leadership.vision",
        message: "Leadership vision score must be between 0 and 100",
        severity: "high",
      });
    }
    
    if (confidence < 0 || confidence > 100) {
      errors.push({
        field: "communication.confidence",
        message: "Confidence score must be between 0 and 100",
        severity: "high",
      });
    }
  }
  
  private static validateOverallScore(
    graph: CandidateGraph,
    errors: ValidationError[],
    _warnings: ValidationWarning[],
    _suggestions: ValidationSuggestion[]
  ) {
    if (graph.overallScore < 0 || graph.overallScore > 100) {
      errors.push({
        field: "overallScore",
        message: "Overall score must be between 0 and 100",
        severity: "critical",
      });
    }
    
    if (graph.employability.overall !== graph.overallScore) {
      _warnings.push({
        field: "employability.overall",
        message: "Employability overall score does not match overall score",
        severity: "medium",
      });
    }
  }
  
  private static validateProgress(
    progress: CandidateGraph["progress"],
    errors: ValidationError[],
    _warnings: ValidationWarning[],
    _suggestions: ValidationSuggestion[]
  ) {
    if (progress.overallScore < 0 || progress.overallScore > 100) {
      errors.push({
        field: "progress.overallScore",
        message: "Progress overall score must be between 0 and 100",
        severity: "high",
      });
    }
    
    if (progress.previousScore < 0 || progress.previousScore > 100) {
      errors.push({
        field: "progress.previousScore",
        message: "Progress previous score must be between 0 and 100",
        severity: "high",
      });
    }
    
    if (progress.change < -100 || progress.change > 100) {
      errors.push({
        field: "progress.change",
        message: "Progress change seems unrealistic",
        severity: "high",
      });
    }
  }
  
  private static validateTrajectory(
    trajectory: CandidateGraph["trajectory"],
    errors: ValidationError[],
    _warnings: ValidationWarning[],
    _suggestions: ValidationSuggestion[]
  ) {
    const validLevels = ["junior", "mid", "senior", "lead", "executive"];
    
    if (!validLevels.includes(trajectory.currentLevel)) {
      errors.push({
        field: "trajectory.currentLevel",
        message: "Invalid career level",
        severity: "high",
      });
    }
    
    if (!validLevels.includes(trajectory.nextLevel)) {
      errors.push({
        field: "trajectory.nextLevel",
        message: "Invalid next career level",
        severity: "high",
      });
    }
  }
  
  private static validateDecisionReadiness(
    decisionReadiness: CandidateGraph["decisionReadiness"],
    errors: ValidationError[],
    _warnings: ValidationWarning[],
    _suggestions: ValidationSuggestion[]
  ) {
    if (decisionReadiness.overall < 0 || decisionReadiness.overall > 100) {
      errors.push({
        field: "decisionReadiness.overall",
        message: "Decision readiness overall must be between 0 and 100",
        severity: "high",
      });
    }
    
    if (decisionReadiness.technicalReadiness < 0 || decisionReadiness.technicalReadiness > 100) {
      errors.push({
        field: "decisionReadiness.technicalReadiness",
        message: "Technical readiness must be between 0 and 100",
        severity: "high",
      });
    }
    
    if (decisionReadiness.behavioralReadiness < 0 || decisionReadiness.behavioralReadiness > 100) {
      errors.push({
        field: "decisionReadiness.behavioralReadiness",
        message: "Behavioral readiness must be between 0 and 100",
        severity: "high",
      });
    }
    
    if (decisionReadiness.confidence < 0 || decisionReadiness.confidence > 1) {
      errors.push({
        field: "decisionReadiness.confidence",
        message: "Decision readiness confidence must be between 0 and 1",
        severity: "high",
      });
    }
  }
}
