// @ts-nocheck
import { ReturnProbability } from "../value-objects/return-probability.vo";

export interface PredictionSnapshotProps {
  id: string;
  userId: string;
  sessionId: string;
  returnProbability: ReturnProbability;
  returnSegment?: string;
  primaryDriver?: string;
  stressScore: number;
  recoveryScore: number;
  engagementScore: number;
  createdAt: Date;
}

export class PredictionSnapshotEntity {
  constructor(private props: PredictionSnapshotProps) {}

  public get id(): string { return this.props.id; }
  public get userId(): string { return this.props.userId; }
  public get sessionId(): string { return this.props.sessionId; }
  public get returnProbability(): ReturnProbability { return this.props.returnProbability; }
  public get returnSegment(): string { return this.props.returnSegment || "unknown"; }
  public get primaryDriver(): string { return this.props.primaryDriver || "unknown"; }
  public get stressScore(): number { return this.props.stressScore; }
  public get recoveryScore(): number { return this.props.recoveryScore; }
  public get engagementScore(): number { return this.props.engagementScore; }
  public get createdAt(): Date { return this.props.createdAt; }
}
