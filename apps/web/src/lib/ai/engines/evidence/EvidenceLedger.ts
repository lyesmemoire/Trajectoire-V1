// ===================================================================
// EVIDENCE LEDGER — Registry for Evidence with Complete Metadata
// ===================================================================

export interface EvidenceLedgerEntry {
  id: string;
  originObservationId: string;
  assessment: EvidenceAssessment;
  dimensions: Map<string, number>;
  policiesApplied: string[];
  timestamp: Date;
  engineVersion: string;
  promptVersion?: string;
  provider?: string;
  traceId: string;
  correlationId: string;
  sessionId: string;
}

export interface EvidenceAssessment {
  hasEvidence: boolean;
  evidenceType: string; // "strong", "moderate", "weak", "none", "claim-only"
  overallScore: number;
  confidence: number;
  reason: string;
  missingDimensions: string[];
}

export class EvidenceLedger {
  private entries: Map<string, EvidenceLedgerEntry> = new Map();

  record(entry: EvidenceLedgerEntry): void {
    this.entries.set(entry.id, entry);
  }

  get(id: string): EvidenceLedgerEntry | undefined {
    return this.entries.get(id);
  }

  getByObservationId(observationId: string): EvidenceLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.originObservationId === observationId
    );
  }

  getBySession(sessionId: string): EvidenceLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.sessionId === sessionId
    );
  }

  getByTraceId(traceId: string): EvidenceLedgerEntry[] {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.traceId === traceId
    );
  }

  getAll(): EvidenceLedgerEntry[] {
    return Array.from(this.entries.values());
  }

  clear(): void {
    this.entries.clear();
  }

  getStatistics(): {
    totalEntries: number;
    withEvidence: number;
    withoutEvidence: number;
    strongEvidence: number;
    moderateEvidence: number;
    weakEvidence: number;
    claimOnly: number;
  } {
    const entries = this.getAll();
    return {
      totalEntries: entries.length,
      withEvidence: entries.filter((e) => e.assessment.hasEvidence).length,
      withoutEvidence: entries.filter((e) => !e.assessment.hasEvidence).length,
      strongEvidence: entries.filter((e) => e.assessment.evidenceType === "strong").length,
      moderateEvidence: entries.filter((e) => e.assessment.evidenceType === "moderate").length,
      weakEvidence: entries.filter((e) => e.assessment.evidenceType === "weak").length,
      claimOnly: entries.filter((e) => e.assessment.evidenceType === "claim-only").length,
    };
  }
}
