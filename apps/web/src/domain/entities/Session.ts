/**
 * Session Domain Entity
 * Represents an interview session in the domain layer
 * Contains business logic and validation
 */

import { AppError, ErrorCode } from "@/core/errors";

export type InterviewType = "RH" | "Technique" | "Manager";
export type SessionStatus = "in_progress" | "completed" | "cancelled";

export interface SessionProps {
  id?: string;
  userId: string;
  jobTitle: string;
  level: string;
  interviewType: InterviewType;
  durationSeconds: number;
  status?: SessionStatus;
  startedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
}

// Canonical Reference: COS-OBJ-001 (blueprint.runtime.session)
// Owner: COS Team
export class Session {
  public readonly id: string;
  public readonly userId: string;
  public readonly jobTitle: string;
  public readonly level: string;
  public readonly interviewType: InterviewType;
  public readonly durationSeconds: number;
  public status: SessionStatus;
  public readonly startedAt: Date;
  public completedAt?: Date;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public version: number;

  constructor(props: SessionProps) {
    this.validateProps(props);

    this.id = props.id || this.generateId();
    this.userId = props.userId;
    this.jobTitle = props.jobTitle;
    this.level = props.level;
    this.interviewType = props.interviewType;
    this.durationSeconds = props.durationSeconds;
    this.status = props.status || "in_progress";
    this.startedAt = props.startedAt || new Date();
    this.completedAt = props.completedAt;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
    this.version = props.version || 1;
  }

  private validateProps(props: SessionProps): void {
    if (!props.userId) {
      throw new AppError("User ID is required", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (!props.jobTitle || props.jobTitle.trim().length === 0) {
      throw new AppError("any title is required", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (!props.level || props.level.trim().length === 0) {
      throw new AppError("Level is required", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (!["RH", "Technique", "Manager"].includes(props.interviewType)) {
      throw new AppError("Invalid interview type", ErrorCode.VALIDATION_ERROR, 400);
    }
    if (props.durationSeconds < 60 || props.durationSeconds > 7200) {
      throw new AppError("Duration must be between 1 and 120 minutes", ErrorCode.VALIDATION_ERROR, 400);
    }
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /**
   * Complete the session
   */
  complete(): void {
    if (this.status === "completed") {
      throw new AppError("Session is already completed", ErrorCode.CONFLICT, 409);
    }
    if (this.status === "cancelled") {
      throw new AppError("Cannot complete a cancelled session", ErrorCode.CONFLICT, 409);
    }

    this.status = "completed";
    this.completedAt = new Date();
    this.updatedAt = new Date();
    this.version += 1;
  }

  /**
   * Cancel the session
   */
  cancel(): void {
    if (this.status === "completed") {
      throw new AppError("Cannot cancel a completed session", ErrorCode.CONFLICT, 409);
    }
    if (this.status === "cancelled") {
      throw new AppError("Session is already cancelled", ErrorCode.CONFLICT, 409);
    }

    this.status = "cancelled";
    this.updatedAt = new Date();
    this.version += 1;
  }

  /**
   * Get session duration in minutes
   */
  getDurationMinutes(): number {
    return Math.floor(this.durationSeconds / 60);
  }

  /**
   * Check if session is active
   */
  isActive(): boolean {
    return this.status === "in_progress";
  }

  /**
   * Check if session has exceeded its duration
   */
  hasExceededDuration(): boolean {
    if (!this.startedAt) return false;
    const elapsed = (Date.now() - this.startedAt.getTime()) / 1000;
    return elapsed > this.durationSeconds;
  }

  /**
   * Convert to plain object for persistence
   */
  toPersistence(): any {
    return {
      id: this.id,
      user_id: this.userId,
      job_title: this.jobTitle,
      level: this.level,
      interview_type: this.interviewType,
      duration_seconds: this.durationSeconds,
      status: this.status,
      started_at: this.startedAt.toISOString(),
      completed_at: this.completedAt?.toISOString(),
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
      version: this.version,
    };
  }

  /**
   * Create from persistence
   */
  static fromPersistence(data: any): Session {
    return new Session({
      id: data.id,
      userId: data.user_id,
      jobTitle: data.job_title,
      level: data.level,
      interviewType: data.interview_type,
      durationSeconds: data.duration_seconds,
      status: data.status,
      startedAt: data.started_at ? new Date(data.started_at) : undefined,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      version: data.version || 1,
    });
  }
}
