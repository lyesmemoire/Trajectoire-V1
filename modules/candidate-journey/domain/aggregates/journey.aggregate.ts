import { AggregateRoot } from "../../../../lib/core/domain/AggregateRoot";
import { Clock } from "../../../../lib/core/clock/Clock";
import { Journey, JourneyStep, JourneyStatus, JourneyData } from "../entities/journey.entity";
import { JourneyStarted, JourneyStepCompleted, JourneyCompleted, JourneyFailed } from "../events/journey.events";

export interface JourneyAggregateProps {
  id: string;
  userId: string;
  currentStep: JourneyStep;
  status: JourneyStatus;
  data: JourneyData;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

const STEPS: JourneyStep[] = [
  "CV_UPLOAD",
  "CAREER_PROFILE",
  "JOB_OFFER_IMPORT",
  "ATS_ANALYSIS",
  "CV_OPTIMIZATION",
  "INTERVIEW_SIMULATION",
  "FINAL_REPORT",
];

export class JourneyAggregate extends AggregateRoot {
  private constructor(
    public readonly props: JourneyAggregateProps,
    private readonly clock: Clock
  ) {
    super();
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get currentStep(): JourneyStep { return this.props.currentStep; }
  get status(): JourneyStatus { return this.props.status; }
  get data(): JourneyData { return this.props.data; }
  get startedAt(): Date { return this.props.startedAt; }
  get completedAt(): Date | undefined { return this.props.completedAt; }
  get error(): string | undefined { return this.props.error; }

  get progress(): number {
    const index = STEPS.indexOf(this.currentStep);
    if (index === -1) return 0;
    return Math.round(((index + 1) / STEPS.length) * 100);
  }

  get completedSteps(): JourneyStep[] {
    const index = STEPS.indexOf(this.currentStep);
    if (index === -1) return [];
    return STEPS.slice(0, index);
  }

  get availableActions(): string[] {
    if (this.status === "COMPLETED") return [];
    if (this.status === "FAILED") return ["retry", "abandon"];
    
    const actions: string[] = [];
    switch (this.currentStep) {
      case "CV_UPLOAD":
        actions.push("uploadCv");
        break;
      case "CAREER_PROFILE":
        actions.push("updateCareerProfile");
        break;
      case "JOB_OFFER_IMPORT":
        actions.push("uploadJobOffer");
        break;
      case "ATS_ANALYSIS":
        actions.push("analyzeAts");
        break;
      case "CV_OPTIMIZATION":
        actions.push("optimizeCv");
        break;
      case "INTERVIEW_SIMULATION":
        actions.push("startInterview");
        break;
      case "FINAL_REPORT":
        actions.push("generateFinalReport");
        break;
    }
    return actions;
  }

  static create(id: string, userId: string, clock: Clock): JourneyAggregate {
    const props: JourneyAggregateProps = {
      id,
      userId,
      currentStep: "CV_UPLOAD",
      status: "IN_PROGRESS",
      data: { userId },
      startedAt: clock.now(),
      completedAt: undefined,
      error: undefined,
    };
    const journey = new JourneyAggregate(props, clock);
    journey.recordEvent(new JourneyStarted(userId, {
      journeyId: journey.id,
      userId: journey.userId,
      timestamp: journey.startedAt,
    }));
    return journey;
  }

  static load(props: JourneyAggregateProps, clock: Clock): JourneyAggregate {
    return new JourneyAggregate(props, clock);
  }

  public advanceToStep(step: JourneyStep, stepData: Partial<JourneyData>): void {
    this.props.currentStep = step;
    this.props.data = { ...this.props.data, ...stepData };
    this.recordEvent(new JourneyStepCompleted(this.userId, {
      journeyId: this.id,
      userId: this.userId,
      step,
      timestamp: this.clock.now(),
    }));
  }

  public complete(finalData: Partial<JourneyData>): void {
    this.props.status = "COMPLETED";
    this.props.completedAt = this.clock.now();
    this.props.data = { ...this.props.data, ...finalData };
    this.recordEvent(new JourneyCompleted(this.userId, {
      journeyId: this.id,
      userId: this.userId,
      timestamp: this.props.completedAt!,
      data: this.props.data,
    }));
  }

  public fail(error: string): void {
    this.props.status = "FAILED";
    this.props.error = error;
    this.recordEvent(new JourneyFailed(this.userId, {
      journeyId: this.id,
      userId: this.userId,
      error,
      timestamp: this.clock.now(),
    }));
  }

  public toEntity(): Journey {
    return {
      id: this.id,
      userId: this.userId,
      currentStep: this.currentStep,
      status: this.status,
      data: this.data,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      error: this.error,
    };
  }

  public toResponse() {
    return {
      id: this.id,
      userId: this.userId,
      currentStep: this.currentStep,
      status: this.status,
      progress: this.progress,
      completedSteps: this.completedSteps,
      availableActions: this.availableActions,
      data: this.data,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      error: this.error,
    };
  }
}
