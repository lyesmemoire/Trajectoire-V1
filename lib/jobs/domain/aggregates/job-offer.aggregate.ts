/**
 * Job Offer Aggregate
 * 
 * Aggregate root for job offers
 */

import { AggregateRoot } from "../../../../lib/core/domain/AggregateRoot";
import { Clock } from "../../../../lib/core/clock/Clock";
import { JobOfferUploaded, JobOfferParsed, JobOfferAnalyzed } from "../events/job-offer-events";

export interface JobOfferAggregateProps {
  id: string;
  userId: string;
  title?: string;
  company?: string;
  description: string;
  source?: string;
  sourceType?: "URL_LINKEDIN" | "URL_INDEED" | "URL_WTTJ" | "RAW_TEXT";
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class JobOfferAggregate extends AggregateRoot {
  private constructor(
    public readonly props: JobOfferAggregateProps,
    private readonly clock: Clock
  ) {
    super();
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get description(): string { return this.props.description; }

  /**
   * Reconstitute from persistent storage
   */
  static load(props: JobOfferAggregateProps, clock: Clock): JobOfferAggregate {
    return new JobOfferAggregate(props, clock);
  }

  /**
   * Factory method to create a new job offer
   */
  static upload(
    userId: string,
    id: string,
    description: string,
    clock: Clock,
    source?: string,
    sourceType?: "URL_LINKEDIN" | "URL_INDEED" | "URL_WTTJ" | "RAW_TEXT"
  ): JobOfferAggregate {
    const jobOffer = new JobOfferAggregate({
      id,
      userId,
      description,
      source,
      sourceType,
      createdAt: clock.now(),
      updatedAt: clock.now()
    }, clock);
    jobOffer.recordEvent(new JobOfferUploaded(userId, { jobOfferId: id, source }));
    return jobOffer;
  }

  /**
   * Attach parsed title and company
   */
  attachParsedInfo(title?: string, company?: string): void {
    this.props.title = title;
    this.props.company = company;
    this.props.updatedAt = this.clock.now();
    this.recordEvent(new JobOfferParsed(this.userId, { jobOfferId: this.id }));
  }

  /**
   * Attach job offer analysis
   */
  attachAnalysis(metadata?: Record<string, any>): void {
    if (metadata) {
      this.props.metadata = { ...this.props.metadata, ...metadata };
    }
    this.props.updatedAt = this.clock.now();
    this.recordEvent(new JobOfferAnalyzed(this.userId, { jobOfferId: this.id }));
  }
}
