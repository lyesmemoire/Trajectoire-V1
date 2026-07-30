/**
 * Blueprint DSL CPR API Gateway
 * 
 * Manages API gateway for external access to the cluster.
 */

import { ClusterManager } from './cluster-manager';

export interface ApiRoute {
  path: string;
  method: HttpMethod;
  handler: string;
  rateLimit?: number;
  authRequired?: boolean;
  cacheEnabled?: boolean;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface ApiRequest {
  id: string;
  path: string;
  method: HttpMethod;
  headers: Map<string, string>;
  body: unknown;
  timestamp: number;
}

export interface ApiResponse {
  requestId: string;
  status: number;
  headers: Map<string, string>;
  body: unknown;
  timestamp: number;
  duration: number;
}

export interface GatewayStatistics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsByMethod: Map<HttpMethod, number>;
  requestsByPath: Map<string, number>;
}

export class ApiGateway {
  private clusterManager: ClusterManager;
  private routes: Map<string, ApiRoute> = new Map();
  private requests: Map<string, ApiRequest> = new Map();
  private responses: Map<string, ApiResponse> = new Map();
  private requestCounter: number = 0;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
  }

  /**
   * Add API route
   */
  public addRoute(route: ApiRoute): void {
    const key = `${route.method}:${route.path}`;
    this.routes.set(key, route);
  }

  /**
   * Remove API route
   */
  public removeRoute(path: string, method: HttpMethod): boolean {
    const key = `${method}:${path}`;
    return this.routes.delete(key);
  }

  /**
   * Get route
   */
  public getRoute(path: string, method: HttpMethod): ApiRoute | null {
    const key = `${method}:${path}`;
    const route = this.routes.get(key);
    return route ? { ...route } : null;
  }

  /**
   * Get all routes
   */
  public getAllRoutes(): ApiRoute[] {
    return Array.from(this.routes.values()).map(r => ({ ...r }));
  }

  /**
   * Handle API request
   */
  public handleRequest(request: ApiRequest): ApiResponse {
    const route = this.getRoute(request.path, request.method);

    if (!route) {
      return this.createErrorResponse(request.id, 404, 'Route not found');
    }

    // Check rate limit
    if (route.rateLimit && this.checkRateLimit(request.path, route.rateLimit)) {
      return this.createErrorResponse(request.id, 429, 'Rate limit exceeded');
    }

    // Check authentication
    if (route.authRequired && !this.checkAuth(request)) {
      return this.createErrorResponse(request.id, 401, 'Unauthorized');
    }

    // Check cache
    if (route.cacheEnabled) {
      const cached = this.checkCache(request);
      if (cached) {
        return cached;
      }
    }

    // Process request
    const startTime = Date.now();
    this.requests.set(request.id, request);

    // In a real implementation, this would route to the appropriate handler
    const response = this.createSuccessResponse(request.id, { success: true });

    const duration = Date.now() - startTime;
    response.duration = duration;

    this.responses.set(request.id, response);

    return response;
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(path: string, limit: number): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    const recentRequests = Array.from(this.requests.values())
      .filter(r => r.path === path && r.timestamp >= windowStart);

    return recentRequests.length >= limit;
  }

  /**
   * Check authentication
   */
  private checkAuth(request: ApiRequest): boolean {
    const authHeader = request.headers.get('authorization');
    return authHeader !== undefined && authHeader.startsWith('Bearer ');
  }

  /**
   * Check cache
   */
  private checkCache(request: ApiRequest): ApiResponse | null {
    // In a real implementation, this would check a cache
    return null;
  }

  /**
   * Create success response
   */
  private createSuccessResponse(requestId: string, body: unknown): ApiResponse {
    return {
      requestId,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      body,
      timestamp: Date.now(),
      duration: 0,
    };
  }

  /**
   * Create error response
   */
  private createErrorResponse(requestId: string, status: number, message: string): ApiResponse {
    return {
      requestId,
      status,
      headers: new Map([['content-type', 'application/json']]),
      body: { error: message },
      timestamp: Date.now(),
      duration: 0,
    };
  }

  /**
   * Get request by id
   */
  public getRequest(requestId: string): ApiRequest | null {
    const request = this.requests.get(requestId);
    return request ? { ...request, headers: new Map(request.headers) } : null;
  }

  /**
   * Get response by id
   */
  public getResponse(requestId: string): ApiResponse | null {
    const response = this.responses.get(requestId);
    return response ? { ...response, headers: new Map(response.headers) } : null;
  }

  /**
   * Get all requests
   */
  public getAllRequests(): ApiRequest[] {
    return Array.from(this.requests.values()).map(r => ({ ...r, headers: new Map(r.headers) }));
  }

  /**
   * Get all responses
   */
  public getAllResponses(): ApiResponse[] {
    return Array.from(this.responses.values()).map(r => ({ ...r, headers: new Map(r.headers) }));
  }

  /**
   * Clear requests and responses
   */
  public clear(): void {
    this.requests.clear();
    this.responses.clear();
    this.requestCounter = 0;
  }

  /**
   * Get gateway statistics
   */
  public getStatistics(): GatewayStatistics {
    const successful = Array.from(this.responses.values()).filter(r => r.status >= 200 && r.status < 300).length;
    const failed = Array.from(this.responses.values()).filter(r => r.status >= 400).length;
    const averageResponseTime = this.responses.size > 0
      ? Array.from(this.responses.values()).reduce((sum, r) => sum + r.duration, 0) / this.responses.size
      : 0;

    const requestsByMethod = new Map<HttpMethod, number>();
    const requestsByPath = new Map<string, number>();

    for (const request of this.requests.values()) {
      const methodCount = requestsByMethod.get(request.method) || 0;
      requestsByMethod.set(request.method, methodCount + 1);

      const pathCount = requestsByPath.get(request.path) || 0;
      requestsByPath.set(request.path, pathCount + 1);
    }

    return {
      totalRequests: this.requests.size,
      successfulRequests: successful,
      failedRequests: failed,
      averageResponseTime,
      requestsByMethod,
      requestsByPath,
    };
  }

  /**
   * Validate gateway state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [key, route] of this.routes) {
      const [method, path] = key.split(':');

      if (route.method !== method) {
        errors.push(`Route method mismatch at ${key}`);
      }

      if (route.path !== path) {
        errors.push(`Route path mismatch at ${key}`);
      }

      if (route.rateLimit !== undefined && route.rateLimit < 0) {
        errors.push(`Invalid rate limit in route ${key}`);
      }
    }

    for (const [id, request] of this.requests) {
      if (request.id !== id) {
        errors.push(`Request ID mismatch at ${id}`);
      }

      if (request.timestamp < 0) {
        errors.push(`Invalid timestamp in request ${id}`);
      }
    }

    for (const [id, response] of this.responses) {
      if (response.requestId !== id) {
        errors.push(`Response request ID mismatch at ${id}`);
      }

      if (response.status < 100 || response.status >= 600) {
        errors.push(`Invalid status in response ${id}`);
      }

      if (response.duration < 0) {
        errors.push(`Invalid duration in response ${id}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }

  /**
   * Get cluster manager
   */
  public getClusterManager(): ClusterManager {
    return this.clusterManager;
  }
}
