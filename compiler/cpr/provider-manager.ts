/**
 * Blueprint DSL CPR Provider Manager
 * 
 * Manages AI provider connections and requests.
 */

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  endpoint: string;
  apiKey?: string;
  status: ProviderStatus;
  metadata: Record<string, unknown>;
}

export enum ProviderType {
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  COHERE = 'COHERE',
  HUGGINGFACE = 'HUGGINGFACE',
  CUSTOM = 'CUSTOM',
}

export enum ProviderStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RATE_LIMITED = 'RATE_LIMITED',
  ERROR = 'ERROR',
}

export interface ProviderRequest {
  id: string;
  providerId: string;
  prompt: string;
  parameters: Record<string, unknown>;
  status: RequestStatus;
  startTime: number;
  endTime?: number;
  result?: unknown;
  error?: string;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface ProviderStatistics {
  totalRequests: number;
  completedRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  activeProviders: number;
}

export class ProviderManager {
  private providers: Map<string, Provider> = new Map();
  private requests: Map<string, ProviderRequest> = new Map();
  private requestCounter: number = 0;

  /**
   * Add provider
   */
  public addProvider(provider: Provider): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Remove provider
   */
  public removeProvider(providerId: string): boolean {
    return this.providers.delete(providerId);
  }

  /**
   * Get provider by id
   */
  public getProvider(providerId: string): Provider | null {
    const provider = this.providers.get(providerId);
    return provider ? { ...provider } : null;
  }

  /**
   * Get all providers
   */
  public getAllProviders(): Provider[] {
    return Array.from(this.providers.values()).map(p => ({ ...p }));
  }

  /**
   * Get providers by type
   */
  public getProvidersByType(type: ProviderType): Provider[] {
    return Array.from(this.providers.values())
      .filter(p => p.type === type)
      .map(p => ({ ...p }));
  }

  /**
   * Get providers by status
   */
  public getProvidersByStatus(status: ProviderStatus): Provider[] {
    return Array.from(this.providers.values())
      .filter(p => p.status === status)
      .map(p => ({ ...p }));
  }

  /**
   * Update provider status
   */
  public updateProviderStatus(providerId: string, status: ProviderStatus): void {
    const provider = this.providers.get(providerId);

    if (provider) {
      provider.status = status;
    }
  }

  /**
   * Select provider for request
   */
  public selectProvider(type?: ProviderType): Provider | null {
    const candidates = type
      ? this.getProvidersByType(type)
      : this.getProvidersByStatus(ProviderStatus.ACTIVE);

    if (candidates.length === 0) {
      return null;
    }

    // Simple round-robin selection
    const index = this.requestCounter % candidates.length;
    return candidates[index];
  }

  /**
   * Create request
   */
  public createRequest(prompt: string, parameters: Record<string, unknown>, providerId?: string): ProviderRequest {
    const provider = providerId
      ? this.getProvider(providerId)
      : this.selectProvider();

    if (!provider) {
      throw new Error('No available provider');
    }

    const request: ProviderRequest = {
      id: `request_${this.requestCounter++}`,
      providerId: provider.id,
      prompt,
      parameters,
      status: RequestStatus.PENDING,
      startTime: Date.now(),
    };

    this.requests.set(request.id, request);
    return request;
  }

  /**
   * Get request by id
   */
  public getRequest(requestId: string): ProviderRequest | null {
    const request = this.requests.get(requestId);
    return request ? { ...request } : null;
  }

  /**
   * Get all requests
   */
  public getAllRequests(): ProviderRequest[] {
    return Array.from(this.requests.values()).map(r => ({ ...r }));
  }

  /**
   * Get requests by provider
   */
  public getRequestsByProvider(providerId: string): ProviderRequest[] {
    return Array.from(this.requests.values())
      .filter(r => r.providerId === providerId)
      .map(r => ({ ...r }));
  }

  /**
   * Get requests by status
   */
  public getRequestsByStatus(status: RequestStatus): ProviderRequest[] {
    return Array.from(this.requests.values())
      .filter(r => r.status === status)
      .map(r => ({ ...r }));
  }

  /**
   * Update request status
   */
  public updateRequestStatus(requestId: string, status: RequestStatus, result?: unknown, error?: string): void {
    const request = this.requests.get(requestId);

    if (request) {
      request.status = status;

      if (status === RequestStatus.COMPLETED || status === RequestStatus.FAILED || status === RequestStatus.CANCELLED) {
        request.endTime = Date.now();
      }

      if (result !== undefined) {
        request.result = result;
      }

      if (error !== undefined) {
        request.error = error;
      }
    }
  }

  /**
   * Cancel request
   */
  public cancelRequest(requestId: string): void {
    this.updateRequestStatus(requestId, RequestStatus.CANCELLED);
  }

  /**
   * Delete request
   */
  public deleteRequest(requestId: string): boolean {
    return this.requests.delete(requestId);
  }

  /**
   * Clear all requests
   */
  public clearRequests(): void {
    this.requests.clear();
    this.requestCounter = 0;
  }

  /**
   * Get provider statistics
   */
  public getStatistics(): ProviderStatistics {
    const completed = this.getRequestsByStatus(RequestStatus.COMPLETED).length;
    const failed = this.getRequestsByStatus(RequestStatus.FAILED).length;
    const active = this.getProvidersByStatus(ProviderStatus.ACTIVE).length;

    const completedRequests = this.getRequestsByStatus(RequestStatus.COMPLETED);
    const responseTimes = completedRequests
      .filter(r => r.endTime !== undefined)
      .map(r => (r.endTime! - r.startTime));

    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
      : 0;

    return {
      totalRequests: this.requests.size,
      completedRequests: completed,
      failedRequests: failed,
      averageResponseTime,
      activeProviders: active,
    };
  }

  /**
   * Validate provider manager state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, provider] of this.providers) {
      if (provider.id !== id) {
        errors.push(`Provider ID mismatch at ${id}`);
      }

      if (!provider.endpoint) {
        errors.push(`Provider ${id} missing endpoint`);
      }
    }

    for (const [id, request] of this.requests) {
      if (request.id !== id) {
        errors.push(`Request ID mismatch at ${id}`);
      }

      if (!this.providers.has(request.providerId)) {
        errors.push(`Request ${id} references non-existent provider ${request.providerId}`);
      }

      if (request.startTime < 0) {
        errors.push(`Invalid start time in request ${id}`);
      }

      if (request.endTime !== undefined && request.endTime < request.startTime) {
        errors.push(`Invalid end time in request ${id}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Clear all providers
   */
  public clearProviders(): void {
    this.providers.clear();
  }
}
