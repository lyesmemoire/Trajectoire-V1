/**
 * Job Offer Domain Events
 */

import { BaseDomainEvent } from "../../../../lib/core/events/domain/BaseDomainEvent";

export class JobOfferUploaded extends BaseDomainEvent<{ jobOfferId: string; source?: string }> {
  public readonly type = "job_offer.uploaded";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ jobOfferId: string; source?: string }>;

  constructor(public readonly userId: string, payload: { jobOfferId: string; source?: string }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.jobOfferId;
    this.payload = Object.freeze(payload);
  }
}

export class JobOfferParsed extends BaseDomainEvent<{ jobOfferId: string }> {
  public readonly type = "job_offer.parsed";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ jobOfferId: string }>;

  constructor(public readonly userId: string, payload: { jobOfferId: string }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.jobOfferId;
    this.payload = Object.freeze(payload);
  }
}

export class JobOfferAnalyzed extends BaseDomainEvent<{ jobOfferId: string }> {
  public readonly type = "job_offer.analyzed";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ jobOfferId: string }>;

  constructor(public readonly userId: string, payload: { jobOfferId: string }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.jobOfferId;
    this.payload = Object.freeze(payload);
  }
}
