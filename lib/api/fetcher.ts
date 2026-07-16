import { ApiError, NetworkError, TimeoutError } from "./errors";

interface FetcherOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

export async function safeFetch<T>(url: string, options: FetcherOptions = {}): Promise<T> {
  const { timeoutMs = 8000, retries = 1, retryDelayMs = 1000, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        let errorMessage = "Erreur serveur";
        let errorCode = undefined;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorCode = errorData.code;
        } catch (e) {
          // Si la réponse n'est pas du JSON, on garde le message générique
        }
        throw new ApiError(errorMessage, response.status, errorCode);
      }

      // 204 No Content ne retourne pas de JSON
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error: any) {
      lastError = error;
      
      if (error.name === "AbortError") {
        lastError = new TimeoutError();
        // On retry sur les timeouts si autorisé
      } else if (error instanceof ApiError) {
        // On ne retry pas les erreurs 4xx (client errors)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }
      } else if (error instanceof TypeError && error.message === "Failed to fetch") {
        lastError = new NetworkError();
      }

      // S'il reste des tentatives, on attend avant de retenter
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  throw lastError || new Error("Erreur inattendue");
}
