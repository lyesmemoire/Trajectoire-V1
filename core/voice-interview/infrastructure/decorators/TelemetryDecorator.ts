import type { TelemetryPort } from "../../application/ports/SystemPorts.js";

export class TelemetryDecorator {
  constructor(private telemetry: TelemetryPort) {}

  async track<T>(
    operationName: string,
    provider: string,
    promptVersion: string | null,
    operation: () => Promise<T>,
    tokenCounter?: (result: T) => number
  ): Promise<T> {
    const start = Date.now();
    let success = false;
    let tokens = 0;
    
    try {
      const result = await operation();
      success = true;
      if (tokenCounter) tokens = tokenCounter(result);
      return result;
    } catch (error) {
      throw error;
    } finally {
      const duration = Date.now() - start;
      this.telemetry.track(operationName, {
        provider,
        duration,
        success,
        tokens,
        promptVersion
      });
    }
  }
}
