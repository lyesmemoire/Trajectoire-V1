import { ReplayOptions, ReplayResult } from "../../contracts/replay";
import { EventQueryService } from "../../contracts/query";
import { P7EvaluatorClient } from "../../contracts/p7-evaluator";
import { RuntimeTraceProvider } from "../../contracts/runtime-trace-provider";

import { MerkleLedgerReader } from "../ledger/merkle-ledger-reader";

export class ReplayEngine {
  constructor(
    private readonly query: EventQueryService,
    private readonly p7: P7EvaluatorClient,
    private readonly traceProvider: RuntimeTraceProvider,
    private readonly ledger?: MerkleLedgerReader
  ) {}

  async replay(tenantId: string, sessionId: string, options?: ReplayOptions): Promise<ReplayResult> {
    const events = await this.query.getSessionEvents(tenantId, sessionId);
    
    if (events.length === 0) {
      return {
        sessionId,
        eventCount: 0,
        originalHash: null,
        replayHash: "",
        deterministic: false
      };
    }

    // sort events
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

    // Filter up to untilEvent if provided
    let processedEvents = sortedEvents;
    if (options?.untilEvent) {
      const idx = processedEvents.findIndex(e => e.eventId === options.untilEvent);
      if (idx >= 0) {
        processedEvents = processedEvents.slice(0, idx + 1);
      }
    }

    // Replay logic: we extract original trace and report hashes from events
    let originalReportHash: string | null = null;

    for (const event of processedEvents) {
      if (event.type === "REPORT_GENERATED") {
        originalReportHash = (event.payload as { reportHash?: string })?.reportHash || null;
      }
    }

    // Replay P7 if we have a trace available.
    // In our architecture, the Trace is managed by TraceProvider
    // In a real replay we would fetch the trace from TraceProvider as it's deterministic input
    // to P7.
    let replayHash = "";
    try {
      const trace = await this.traceProvider.getTrace(sessionId);
      if (trace) {
        const evaluation = await this.p7.evaluate({
          sessionId,
          runtimeTrace: trace
        });
        replayHash = evaluation.reportHash;
      }
    } catch {
      // Trace not found or P7 failed during replay
      replayHash = "ERROR";
    }

    // Compare
    const deterministic = originalReportHash !== null && originalReportHash === replayHash;

    return {
      sessionId,
      eventCount: processedEvents.length,
      originalHash: originalReportHash,
      replayHash,
      deterministic
    };
  }

  async verifyReplayWithLedger(sessionId: string, tenantId: string) {
    const _events = await this.query.getSessionEvents(tenantId, sessionId);

    // Compute replay hash
    let replayHash = "";
    try {
      const trace = await this.traceProvider.getTrace(sessionId);
      if (trace) {
        const evaluation = await this.p7.evaluate({
          sessionId,
          runtimeTrace: trace
        });
        replayHash = evaluation.reportHash;
      }
    } catch {
      replayHash = "ERROR";
    }

    if (!this.ledger) {
      return { verified: true, mode: "NO_LEDGER", replayHash };
    }

    const ledgerProof = await this.ledger.verifySession(tenantId, sessionId);

    if (!ledgerProof.valid) {
      throw new Error("MERKLE_LEDGER_INVALID");
    }

    if (ledgerProof.finalHash !== replayHash) {
      throw new Error("REPLAY_MERKLE_DIVERGENCE");
    }

    return {
      verified: true,
      replayHash,
      ledgerHash: ledgerProof.finalHash
    };
  }
}
