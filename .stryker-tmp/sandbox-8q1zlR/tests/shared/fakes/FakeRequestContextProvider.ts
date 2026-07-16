// @ts-nocheck
import { RequestContextProvider, RequestContextData } from "@/lib/core/runtime/context/RequestContextProvider";

/**
 * Fake implementation of RequestContextProvider for testing.
 * Allows setting a fixed context for test scenarios.
 */
export class FakeRequestContextProvider implements RequestContextProvider {
  private context: RequestContextData | null = null;

  constructor(context?: RequestContextData) {
    this.context = context ?? null;
  }

  /**
   * Sets the context for testing.
   */
  setContext(context: RequestContextData): void {
    this.context = context;
  }

  /**
   * Clears the context.
   */
  clearContext(): void {
    this.context = null;
  }

  current(): RequestContextData | null {
    return this.context;
  }

  correlationId(): string {
    return this.context?.correlationId ?? "unknown";
  }

  requestId(): string {
    return this.context?.requestId ?? "unknown";
  }

  userId(): string | undefined {
    return this.context?.userId;
  }
}
