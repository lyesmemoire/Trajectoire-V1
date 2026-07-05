import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class CvUploaded extends BaseDomainEvent<{ cvId: string; storageUrl: string }> {
  public readonly type = "cv.uploaded";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ cvId: string; storageUrl: string }>;

  constructor(public readonly userId: string, payload: { cvId: string; storageUrl: string }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.cvId;
    this.payload = Object.freeze(payload);
  }
}

export class CvParsed extends BaseDomainEvent<{ cvId: string }> {
  public readonly type = "cv.parsed";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ cvId: string }>;

  constructor(public readonly userId: string, payload: { cvId: string }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.cvId;
    this.payload = Object.freeze(payload);
  }
}

export class CvAnalyzed extends BaseDomainEvent<{ cvId: string; atsScore: number }> {
  public readonly type = "cv.analyzed";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ cvId: string; atsScore: number }>;

  constructor(public readonly userId: string, payload: { cvId: string; atsScore: number }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.cvId;
    this.payload = Object.freeze(payload);
  }
}

export class AnalysisFailed extends BaseDomainEvent<{ cvId: string; reason: string }> {
  public readonly type = "cv.analysis_failed";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ cvId: string; reason: string }>;

  constructor(public readonly userId: string, payload: { cvId: string; reason: string }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.cvId;
    this.payload = Object.freeze(payload);
  }
}

export class CvRewritten extends BaseDomainEvent<{ cvId: string; action: string }> {
  public readonly type = "cv.rewritten";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ cvId: string; action: string }>;

  constructor(public readonly userId: string, payload: { cvId: string; action: string }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.cvId;
    this.payload = Object.freeze(payload);
  }
}

export class RewriteFailed extends BaseDomainEvent<{ cvId: string; reason: string }> {
  public readonly type = "cv.rewrite_failed";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ cvId: string; reason: string }>;

  constructor(public readonly userId: string, payload: { cvId: string; reason: string }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.cvId;
    this.payload = Object.freeze(payload);
  }
}

export class CvExported extends BaseDomainEvent<{ cvId: string; format: "pdf" | "docx" | "json" }> {
  public readonly type = "cv.exported";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ cvId: string; format: "pdf" | "docx" | "json" }>;

  constructor(public readonly userId: string, payload: { cvId: string; format: "pdf" | "docx" | "json" }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.cvId;
    this.payload = Object.freeze(payload);
  }
}

export class CvDeleted extends BaseDomainEvent<{ cvId: string }> {
  public readonly type = "cv.deleted";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ cvId: string }>;

  constructor(public readonly userId: string, payload: { cvId: string }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.cvId;
    this.payload = Object.freeze(payload);
  }
}
