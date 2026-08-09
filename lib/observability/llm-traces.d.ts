export interface LLMTrace {
    sessionId?: string;
    userId: string;
    endpoint: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    latencyMs: number;
    status: "success" | "error";
    metadata?: unknown;
}
/**
 * Logs an LLM interaction for performance and quality monitoring.
 */
export declare function logLLMTrace(trace: _LLMTrace): Promise<void>;
//# sourceMappingURL=llm-traces.d.ts.map