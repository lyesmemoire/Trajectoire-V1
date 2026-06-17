import { 
  runtime_circuit_duration_ms,
  runtime_circuit_open_total,
  runtime_circuit_recovery_total,
  runtime_circuit_failures_total 
} from "../fsm/metrics/RuntimeMetrics";

export type CircuitState = "closed" | "open" | "half-open";

export interface CircuitConfig {
  failureThreshold: number; // number of failures to open circuit
  successThreshold: number; // consecutive successes to close from half-open
  timeoutMs: number; // time to stay open before transitioning to half-open
}

export class CircuitBreaker {
  private failures = 0;
  private successes = 0;
  private state: CircuitState = "closed";
  private lastFailureTime = 0;

  constructor(private config: CircuitConfig) {}

  public allow(): boolean {
    const end = runtime_circuit_duration_ms.startTimer();
    try {
      if (this.state === "open") {
        const now = Date.now();
        if (now - this.lastFailureTime > this.config.timeoutMs) {
          this.state = "half-open";
          return true;
        }
        return false;
      }
      return true;
    } finally {
      end();
    }
  }

  public success() {
    if (this.state === "half-open") {
      this.successes++;
      if (this.successes >= this.config.successThreshold) {
        runtime_circuit_recovery_total.inc();
        this.reset();
      }
    }
  }

  public failure() {
    runtime_circuit_failures_total.inc();
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.state !== "open" && this.failures >= this.config.failureThreshold) {
      this.state = "open";
      runtime_circuit_open_total.inc();
    }
  }

  public getState(): CircuitState {
    return this.state;
  }

  public reset() {
    this.state = "closed";
    this.failures = 0;
    this.successes = 0;
  }
}
