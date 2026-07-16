// @ts-nocheck
import { AsyncLocalStorage } from "async_hooks";
import { RequestContextProvider, RequestContextData } from "./RequestContextProvider";

const asyncLocalStorage = new AsyncLocalStorage<RequestContextData>();

/**
 * Request-scoped context using AsyncLocalStorage.
 * 
 * This is the default implementation of RequestContextProvider.
 * All layers (UseCase, Repository, EventDispatcher, Logger, etc.)
 * can call `RequestContext.current()` without explicit parameter passing.
 * 
 * Usage:
 * ```ts
 * RequestContext.run({ requestId, correlationId, userId }, async () => {
 *   // everything inside this closure has access to RequestContext.current()
 *   await useCase.execute(input);
 * });
 * ```
 * 
 * For testability, UseCases should receive a RequestContextProvider via constructor injection.
 */
export class RequestContext implements RequestContextProvider {
  /**
   * Runs a function with the given context attached to the async scope.
   */
  static run<T>(context: RequestContextData, fn: () => T): T {
    return asyncLocalStorage.run(context, fn);
  }

  /**
   * Returns the current request context, or null if none is active.
   */
  static current(): RequestContextData | null {
    return asyncLocalStorage.getStore() ?? null;
  }

  /**
   * Returns the current correlationId, or "unknown" if no context is active.
   */
  static correlationId(): string {
    return asyncLocalStorage.getStore()?.correlationId ?? "unknown";
  }

  /**
   * Returns the current requestId, or "unknown" if no context is active.
   */
  static requestId(): string {
    return asyncLocalStorage.getStore()?.requestId ?? "unknown";
  }

  /**
   * Returns the current userId, or undefined if not authenticated.
   */
  static userId(): string | undefined {
    return asyncLocalStorage.getStore()?.userId;
  }

  // RequestContextProvider implementation

  current(): RequestContextData | null {
    return RequestContext.current();
  }

  correlationId(): string {
    return RequestContext.correlationId();
  }

  requestId(): string {
    return RequestContext.requestId();
  }

  userId(): string | undefined {
    return RequestContext.userId();
  }
}
