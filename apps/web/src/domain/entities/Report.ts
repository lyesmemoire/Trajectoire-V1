/**
 * Report Domain Entity
 * Represents an interview report
 * Contains business logic and validation
 */

import { AppError, ErrorCode } from "@/core/errors";

export interface ReportProps {
  id?: string;
  sessionId: string;
  overallScore: number;
  communication: number;
  technical: number;
  confidence: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  recommendation: string;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
}

export class Report {
  public readonly id: string;
  public readonly sessionId: string;
  public readonly overallScore: number;
  public readonly communication: number;
  public readonly technical: number;
  public readonly confidence: number;
  public readonly strengths: string[];
  public readonly improvements: string[];
  public readonly summary: string;
  public readonly recommendation: string;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public version: number;

  constructor(props: ReportProps) {
    this.validateProps(props);

    this.id = props.id || this.generateId();
    this.sessionId = props.sessionId;
    this.overallScore = props.overallScore;
    this.communication = props.communication;
    this.technical = props.technical;
    this.confidence = props.confidence;
    this.strengths = props.strengths;
    this.improvements = props.improvements;
    this.summary = props.summary;
    this.recommendation = props.recommendation;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.version = props.version || 1;
  }

  private validateProps(props: ReportProps): void {
    if (!props.sessionId) {
      throw new AppError("Session ID is required", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (props.overallScore < 0 || props.overallScore > 100) {
      throw new AppError("Overall score must be between 0 and 100", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (props.communication < 0 || props.communication > 100) {
      throw new AppError("Communication score must be between 0 and 100", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (props.technical < 0 || props.technical > 100) {
      throw new AppError("Technical score must be between 0 and 100", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (props.confidence < 0 || props.confidence > 100) {
      throw new AppError("Confidence score must be between 0 and 100", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (!Array.isArray(props.strengths)) {
      throw new AppError("Strengths must be an array", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (!Array.isArray(props.improvements)) {
      throw new AppError("Improvements must be an array", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (!props.summary || props.summary.trim().length === 0) {
      throw new AppError("Summary is required", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (!props.recommendation || props.recommendation.trim().length === 0) {
      throw new AppError("Recommendation is required", ErrorCode.VALIDATION_ERROR, 400);
    }
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /**
   * Check if score is passing (>= 60)
   */
  isPassing(): boolean {
    return this.overallScore >= 60;
  }

  /**
   * Get score grade
   */
  getGrade(): string {
    if (this.overallScore >= 90) return "Excellent";
    if (this.overallScore >= 80) return "Très bien";
    if (this.overallScore >= 70) return "Bien";
    if (this.overallScore >= 60) return "Satisfaisant";
    return "À améliorer";
  }

  /**
   * Convert to plain object for persistence
   */
  toPersistence(): any {
    return {
      id: this.id,
      session_id: this.sessionId,
      overall_score: this.overallScore,
      communication: this.communication,
      technical: this.technical,
      confidence: this.confidence,
      strengths: this.strengths,
      improvements: this.improvements,
      summary: this.summary,
      recommendation: this.recommendation,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      version: this.version,
    };
  }

  /**
   * Create from persistence
   */
  static fromPersistence(data: any): Report {
    return new Report({
      id: data.id,
      sessionId: data.session_id,
      overallScore: data.overall_score,
      communication: data.communication,
      technical: data.technical,
      confidence: data.confidence,
      strengths: data.strengths,
      improvements: data.improvements,
      summary: data.summary,
      recommendation: data.recommendation,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      version: data.version || 1,
    });
  }
}
