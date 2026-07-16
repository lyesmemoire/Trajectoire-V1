import { TimeoutError } from "../errors/ProviderErrors.js";

export class TimeoutDecorator {
  static withTimeout<T>(promise: Promise<T>, timeoutMs: number, providerName: string): Promise<T> {
    const timeoutPromise = new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new TimeoutError(providerName));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }
}
