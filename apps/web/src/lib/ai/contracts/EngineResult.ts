export interface EngineResult<T = any> {
  engine: string;
  version: string;
  durationMs: number;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  confidence: number;
  events: T[];
  warnings: string[];
  metrics: Record<string, number>;
  debug: Record<string, any>;
}
