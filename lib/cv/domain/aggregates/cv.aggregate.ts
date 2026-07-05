import { AggregateRoot } from "@/lib/core/domain/AggregateRoot";
import { Clock } from "@/lib/core/clock/Clock";
import { 
  CvUploaded, 
  CvParsed, 
  CvAnalyzed, 
  AnalysisFailed,
  CvRewritten,
  RewriteFailed,
  CvExported,
  CvDeleted
} from "../events/cv-events";

export interface CVAggregateProps {
  id: string;
  userId: string;
  title?: string;
  originalText?: string;
  optimizedText?: string;
  pdfUrl?: string;
  atsScore?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class CVAggregate extends AggregateRoot {
  private constructor(
    public readonly props: CVAggregateProps,
    private readonly clock: Clock
  ) {
    super();
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get originalText(): string | undefined { return this.props.originalText; }
  get optimizedText(): string | undefined { return this.props.optimizedText; }

  /**
   * Reconstitute from persistent storage
   */
  static load(props: CVAggregateProps, clock: Clock): CVAggregate {
    return new CVAggregate(props, clock);
  }

  /**
   * Factory method to create a new CV
   */
  static upload(userId: string, id: string, pdfUrl: string, clock: Clock): CVAggregate {
    const cv = new CVAggregate({
      id,
      userId,
      pdfUrl,
      createdAt: clock.now(),
      updatedAt: clock.now()
    }, clock);
    cv.recordEvent(new CvUploaded(userId, { cvId: id, storageUrl: pdfUrl }));
    return cv;
  }

  /**
   * Update original text after parsing
   */
  attachParsedText(text: string): void {
    this.props.originalText = text;
    this.props.updatedAt = this.clock.now();
    this.recordEvent(new CvParsed(this.userId, { cvId: this.id }));
  }

  /**
   * Attach an ATS analysis
   */
  attachAnalysis(atsScore: number, metadata?: Record<string, any>): void {
    this.props.atsScore = atsScore;
    if (metadata) {
      this.props.metadata = { ...this.props.metadata, ...metadata };
    }
    this.props.updatedAt = this.clock.now();
    this.recordEvent(new CvAnalyzed(this.userId, { cvId: this.id, atsScore }));
  }

  failAnalysis(reason: string): void {
    this.recordEvent(new AnalysisFailed(this.userId, { cvId: this.id, reason }));
  }

  /**
   * Apply rewrite changes
   */
  rewrite(action: string, newText: string): void {
    this.props.optimizedText = newText;
    this.props.updatedAt = this.clock.now();
    this.recordEvent(new CvRewritten(this.userId, { cvId: this.id, action }));
  }

  failRewrite(reason: string): void {
    this.recordEvent(new RewriteFailed(this.userId, { cvId: this.id, reason }));
  }

  export(format: "pdf" | "docx" | "json"): void {
    this.recordEvent(new CvExported(this.userId, { cvId: this.id, format }));
  }

  delete(): void {
    this.recordEvent(new CvDeleted(this.userId, { cvId: this.id }));
  }
}
