// @ts-nocheck
export type FaultSeverity = "INFO" | "WARN" | "CRITICAL";
export type FaultDomain = "REPLAY" | "EVENT_ACCOUNTING" | "ORDERING" | "MEMORY" | "BACKPRESSURE" | "CIRCUIT" | "ATTACK";
export interface FaultEvent {
    timestamp: number;
    domain: FaultDomain;
    severity: FaultSeverity;
    mode?: string;
    runId?: string;
    message: string;
    metrics?: Record<string, number>;
    metadata?: Record<string, any>;
}
export interface FaultTrace {
    runId: string;
    events: FaultEvent[];
    summary: {
        total: number;
        critical: number;
        warnings: number;
    };
}
export declare class FaultTelemetry {
    private trace;
    constructor(runId: string);
    emit(event: FaultEvent): void;
    snapshot(): FaultTrace;
}
