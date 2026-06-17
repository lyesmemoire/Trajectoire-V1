import { RuntimeTrace } from "../../core/p7/trace-contract";

export interface RuntimeTraceProvider {
  getTrace(sessionId: string): Promise<RuntimeTrace>;
  hasTrace(sessionId: string): Promise<boolean>;
}
