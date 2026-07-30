export interface FuzzResult {
  executionTimeMs: number;
  // Raw result from the target if applicable
  output?: any;
  // The error caught during execution if it crashed
  error?: Error;
}

export type OracleResultType = 'PASS' | 'FAIL' | 'CRASH';

export interface OracleResult {
  status: OracleResultType;
  reason?: string;
  error?: Error;
}

export interface FuzzOracle {
  name: string;
  check(result: FuzzResult, targetInput: Uint8Array): OracleResult;
}

export interface FuzzTarget {
  readonly name: string;
  initialize(): Promise<void>;
  execute(input: Uint8Array): Promise<FuzzResult>;
  shutdown(): Promise<void>;
}

export interface FuzzEvent {
  type: string;
  payload: any;
  timestamp: number;
}

export interface EventBusListener {
  (event: FuzzEvent): void;
}

export class FuzzEventBus {
  private listeners: Map<string, EventBusListener[]> = new Map();

  on(eventType: string, listener: EventBusListener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  emit(eventType: string, payload: any) {
    const event: FuzzEvent = { type: eventType, payload, timestamp: Date.now() };
    const handlers = this.listeners.get(eventType) || [];
    for (const handler of handlers) {
      try {
        handler(event);
      } catch (e) {
        console.error(`Error in event listener for ${eventType}:`, e);
      }
    }
  }
}

export interface Scheduler {
  next(): Uint8Array;
  feedback(input: Uint8Array, result: FuzzResult, newCoverage: boolean): void;
}

export interface MutatorStrategy {
  mutate(input: Uint8Array): Uint8Array;
}
