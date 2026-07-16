// @ts-nocheck
import { RuntimeTrace } from "../trace-contract.js";

export interface Signal {
  id: string; // e.g. "trust_trend_1"
  type: string; // e.g. "trust_trend", "latency", "interruption_rate"
  value: number; // Normalized value, typically 0-1 or -1 to 1 depending on signal
  timestamp: number;
  excerpt?: string; // Optional context linking the signal to dialogue
}

export interface SignalExtractor {
  name: string;
  extract(trace: RuntimeTrace): Signal[];
}

export interface CompetencyWeights {
  [signalType: string]: number;
}

export const P7_WEIGHTS = {
  clarity: 0.25,
  stability: 0.25,
  technical_depth: 0.30,
  communication: 0.20,
} as const;

export type CompetencyName = keyof typeof P7_WEIGHTS;
