/**
 * SupabaseClient
 *
 * Infrastructure Supabase client wrapper.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY Supabase API communication.
 */

import { SupabaseConfig } from "../configuration/ConfigurationService";
import { RepositoryError, TimeoutError, NetworkError } from "../errors/InfrastructureErrors";

export interface SupabaseQueryResult<T> {
  data: T | null;
  error: Error | null;
}

export interface SupabaseInsertResult<T> {
  data: T | null;
  error: Error | null;
}

export interface SupabaseUpdateResult<T> {
  data: T | null;
  error: Error | null;
}

export interface SupabaseDeleteResult {
  error: Error | null;
}

export class SupabaseClient {
  constructor(private readonly config: SupabaseConfig) {}

  async select<T>(table: string, query?: Record<string, unknown>): Promise<SupabaseQueryResult<T[]>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const url = new URL(`${this.config.url}/rest/v1/${table}`);
      url.searchParams.append("apikey", this.config.anonKey);

      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new TimeoutError("Supabase request timed out", this.config.timeout);
        }
        return { data: null, error };
      }

      return { data: null, error: new Error("Unknown Supabase error") };
    }
  }

  async insert<T>(table: string, data: Record<string, unknown>): Promise<SupabaseInsertResult<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const url = new URL(`${this.config.url}/rest/v1/${table}`);
      url.searchParams.append("apikey", this.config.anonKey);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const result = await response.json();
      return { data: result, error: null };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new TimeoutError("Supabase request timed out", this.config.timeout);
        }
        return { data: null, error };
      }

      return { data: null, error: new Error("Unknown Supabase error") };
    }
  }

  async update<T>(
    table: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<SupabaseUpdateResult<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const url = new URL(`${this.config.url}/rest/v1/${table}?id=eq.${id}`);
      url.searchParams.append("apikey", this.config.anonKey);

      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const result = await response.json();
      return { data: result[0] || null, error: null };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new TimeoutError("Supabase request timed out", this.config.timeout);
        }
        return { data: null, error };
      }

      return { data: null, error: new Error("Unknown Supabase error") };
    }
  }

  async delete(table: string, id: string): Promise<SupabaseDeleteResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const url = new URL(`${this.config.url}/rest/v1/${table}?id=eq.${id}`);
      url.searchParams.append("apikey", this.config.anonKey);

      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return { error: null };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new TimeoutError("Supabase request timed out", this.config.timeout);
        }
        return { error };
      }

      return { error: new Error("Unknown Supabase error") };
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      throw new RepositoryError("Supabase authentication failed");
    }

    if (response.status >= 500) {
      throw new NetworkError("Supabase server error", response.status);
    }

    throw new RepositoryError(
      `Supabase API error: ${errorData.message ?? response.statusText}`
    );
  }
}
