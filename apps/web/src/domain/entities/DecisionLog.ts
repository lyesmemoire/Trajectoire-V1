export type DecisionOutcome = "SUCCESS" | "FAILED" | "PENDING";

export interface DecisionLogEntry {
  id: string;
  sessionId: string;
  sequence: number;
  reason: string;
  action: string;
  expectedEvidence: string;
  outcome: DecisionOutcome;
  timestamp: Date;
}

export class DecisionLog {
  private entries: DecisionLogEntry[] = [];

  constructor(entries: DecisionLogEntry[] = []) {
    this.entries = entries;
  }

  public add(entry: DecisionLogEntry): void {
    this.entries.push(entry);
  }

  public getLatest(): DecisionLogEntry | undefined {
    return this.entries.length > 0 ? this.entries[this.entries.length - 1] : undefined;
  }

  public getAll(): DecisionLogEntry[] {
    return [...this.entries];
  }

  public updateOutcome(id: string, outcome: DecisionOutcome): void {
    const entry = this.entries.find(e => e.id === id);
    if (entry) {
      entry.outcome = outcome;
    }
  }
}
