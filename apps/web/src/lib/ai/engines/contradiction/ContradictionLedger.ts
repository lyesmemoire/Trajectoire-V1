// ===================================================================
// CONTRADICTION LEDGER — Registry for Contradictions with Complete Metadata
// ===================================================================

export interface ContradictionAssessment {
  hasContradiction: boolean;
  contradictionType: string;
  severity: string;
  confidence: number;
  reason: string;
  resolution?: string;
  isBlocking: boolean;
  isRecoverable: boolean;
  isFalsePositive: boolean;
}

export interface ContradictionLedgerEntry {
  id: string;
  observationAId: string;
  observationBId: string;
  assessment: ContradictionAssessment;
  ruleId: string;
  ruleVersion: string;
  policy: string;
  timestamp: Date;
  engineVersion: string;
  promptVersion?: string;
  provider?: string;
  traceId: string;
  correlationId: string;
  sessionId: string;
  resolvedAt?: Date;
  resolutionMethod?: string;
}

export class ContradictionLedger {
  private entries: Map<string, ContradictionLedgerEntry> = new Map();

  record(entry: ContradictionLedgerEntry): void {
    this.entries.set(entry.id, entry);
  }

  get(id: string): ContradictionLedgerEntry | undefined {
    return this.entries.get(id);
  }

  getByObservationId(observationId: string): ContradictionLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.observationAId === observationId || entry.observationBId === observationId
    );
  }

  getByObservationPair(observationAId: string, observationBId: string): ContradictionLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) =>
        (entry.observationAId === observationAId && entry.observationBId === observationBId) ||
        (entry.observationAId === observationBId && entry.observationBId === observationAId)
    );
  }

  getBySession(sessionId: string): ContradictionLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.sessionId === sessionId
    );
  }

  getByTraceId(traceId: string): ContradictionLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.traceId === traceId
    );
  }

  getBySeverity(severity: string): ContradictionLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.assessment.severity === severity
    );
  }

  getBlockingContradictions(): ContradictionLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.assessment.isBlocking
    );
  }

  getUnresolvedContradictions(): ContradictionLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) => !entry.resolvedAt
    );
  }

  getAll(): ContradictionLedgerEntry[] {
    return Array.from(this.entries.values());
  }

  clear(): void {
    this.entries.clear();
  }

  markAsResolved(id: string, resolutionMethod: string): void {
    const entry = this.entries.get(id);
    if (entry) {
      entry.resolvedAt = new Date();
      entry.resolutionMethod = resolutionMethod;
    }
  }

  getStatistics(): {
    totalEntries: number;
    withContradiction: number;
    withoutContradiction: number;
    blocking: number;
    recoverable: number;
    falsePositives: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    resolved: number;
    unresolved: number;
  } {
    const entries = this.getAll();
    return {
      totalEntries: entries.length,
      withContradiction: entries.filter((e) => e.assessment.hasContradiction).length,
      withoutContradiction: entries.filter((e) => !e.assessment.hasContradiction).length,
      blocking: entries.filter((e) => e.assessment.isBlocking).length,
      recoverable: entries.filter((e) => e.assessment.isRecoverable).length,
      falsePositives: entries.filter((e) => e.assessment.isFalsePositive).length,
      critical: entries.filter((e) => e.assessment.severity === "CRITICAL").length,
      high: entries.filter((e) => e.assessment.severity === "HIGH").length,
      medium: entries.filter((e) => e.assessment.severity === "MEDIUM").length,
      low: entries.filter((e) => e.assessment.severity === "LOW").length,
      resolved: entries.filter((e) => e.resolvedAt).length,
      unresolved: entries.filter((e) => !e.resolvedAt).length,
    };
  }
}
