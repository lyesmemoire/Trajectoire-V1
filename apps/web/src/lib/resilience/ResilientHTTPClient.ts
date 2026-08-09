/**
 * Resilient HTTP Client - SPRINT-4.4
 * 
 * Provides resilient HTTP client with all resilience patterns
 * for external API calls. No direct fetch() calls allowed.
 */

import { resilienceManager } from './ResilienceManager';

export interface FetchOptions extends RequestInit {
  idempotencyKey?: string;
  compensation?: () => Promise<void>;
}

export class ResilientHTTPClient {
  private static instance: ResilientHTTPClient;

  private constructor() {}

  static getInstance(): ResilientHTTPClient {
    if (!ResilientHTTPClient.instance) {
      ResilientHTTPClient.instance = new ResilientHTTPClient();
    }
    return ResilientHTTPClient.instance;
  }

  async fetch(url: string, options?: FetchOptions): Promise<Response> {
    const operation = this.getOperationName(url);
    
    return resilienceManager.execute(
      operation,
      async () => {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      },
      {
        idempotencyKey: options?.idempotencyKey,
        compensation: options?.compensation,
      }
    );
  }

  async get(url: string, options?: FetchOptions): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'GET',
    });
  }

  async post(url: string, data?: any, options?: FetchOptions): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(url: string, data?: any, options?: FetchOptions): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(url: string, options?: FetchOptions): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'DELETE',
    });
  }

  async patch(url: string, data?: any, options?: FetchOptions): Promise<Response> {
    return this.fetch(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  private getOperationName(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }
}

export const resilientHTTPClient = ResilientHTTPClient.getInstance();