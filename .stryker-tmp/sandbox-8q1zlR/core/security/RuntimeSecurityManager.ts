/**
 * Runtime Security Manager
 *
 * Responsibilities:
 * - Validate incoming payloads
 * - Validate audio data
 * - Enforce quotas
 * - Implement rate limiting
 * - Enforce memory limits
 * - Protect WebSocket connections
 * - Protect against invalid payloads
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY security enforcement
 */
// @ts-nocheck


// ============================================================================
// SECURITY VIOLATION
// ============================================================================

export interface SecurityViolation {
  type: "payload_invalid" | "audio_invalid" | "quota_exceeded" | "rate_limit_exceeded" | "memory_limit_exceeded" | "websocket_unauthorized";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  details: Record<string, unknown>;
  timestamp: number;
}

// ============================================================================
// PAYLOAD VALIDATION RESULT
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  violations: SecurityViolation[];
}

// ============================================================================
// SECURITY QUOTAS
// ============================================================================

export interface SecurityQuotas {
  maxPayloadSize: number;
  maxAudioChunkSize: number;
  maxRequestsPerMinute: number;
  maxConcurrentConnections: number;
  maxMemoryUsage: number;
  maxSessionDuration: number;
}

// ============================================================================
// SECURITY OPTIONS
// ============================================================================

export interface SecurityOptions {
  enablePayloadValidation?: boolean;
  enableAudioValidation?: boolean;
  enableQuotas?: boolean;
  enableRateLimiting?: boolean;
  enableMemoryLimits?: boolean;
  enableWebSocketProtection?: boolean;
  quotas?: SecurityQuotas;
}

// ============================================================================
// SECURITY MANAGER INTERFACE
// ============================================================================

export interface RuntimeSecurityManager {
  start(): Promise<void>;
  stop(): Promise<void>;
  validatePayload(payload: unknown): ValidationResult;
  validateAudio(audioData: Uint8Array): ValidationResult;
  checkQuota(identifier: string, type: "payload" | "audio" | "request"): boolean;
  checkRateLimit(identifier: string): boolean;
  checkMemoryLimit(currentUsage: number): boolean;
  protectWebSocket(identifier: string): boolean;
  getSecurityMetrics(): SecurityMetrics;
  subscribeToViolations(callback: (violation: SecurityViolation) => void): void;
}

// ============================================================================
// SECURITY METRICS
// ============================================================================

export interface SecurityMetrics {
  totalValidations: number;
  totalViolations: number;
  violationsByType: Map<string, number>;
  blockedRequests: number;
  rateLimitHits: number;
  quotaExceeded: number;
  memoryLimitHits: number;
}

// ============================================================================
// SECURITY MANAGER IMPLEMENTATION
// ============================================================================

export class RuntimeSecurityManagerImpl implements RuntimeSecurityManager {
  private isRunning: boolean = false;
  private violationCallbacks: Array<(violation: SecurityViolation) => void> = [];
  
  private metrics: SecurityMetrics = {
    totalValidations: 0,
    totalViolations: 0,
    violationsByType: new Map(),
    blockedRequests: 0,
    rateLimitHits: 0,
    quotaExceeded: 0,
    memoryLimitHits: 0
  };
  
  private defaultOptions: SecurityOptions = {
    enablePayloadValidation: true,
    enableAudioValidation: true,
    enableQuotas: true,
    enableRateLimiting: true,
    enableMemoryLimits: true,
    enableWebSocketProtection: true,
    quotas: {
      maxPayloadSize: 10 * 1024 * 1024, // 10MB
      maxAudioChunkSize: 5 * 1024 * 1024, // 5MB
      maxRequestsPerMinute: 100,
      maxConcurrentConnections: 10,
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      maxSessionDuration: 3600000 // 1 hour
    }
  };
  
  private requestCounters: Map<string, number[]> = new Map();
  private quotaUsage: Map<string, Map<string, number>> = new Map();
  private activeConnections: Set<string> = new Set();

  async start(): Promise<void> {
    this.isRunning = true;
    this.resetMetrics();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.requestCounters.clear();
    this.quotaUsage.clear();
    this.activeConnections.clear();
  }

  validatePayload(payload: unknown): ValidationResult {
    if (!this.isRunning || !this.defaultOptions.enablePayloadValidation) {
      return { isValid: true, violations: [] };
    }

    this.metrics.totalValidations++;
    const violations: SecurityViolation[] = [];

    // Check if payload is an object
    if (payload === null || typeof payload !== 'object') {
      violations.push({
        type: "payload_invalid",
        severity: "high",
        message: "Payload must be an object",
        details: { receivedType: typeof payload },
        timestamp: Date.now()
      });
      return { isValid: false, violations };
    }

    // Check payload size
    const payloadSize = JSON.stringify(payload).length;
    const maxSize = this.defaultOptions.quotas?.maxPayloadSize || 10 * 1024 * 1024;
    
    if (payloadSize > maxSize) {
      violations.push({
        type: "payload_invalid",
        severity: "high",
        message: "Payload size exceeds maximum allowed",
        details: { size: payloadSize, maxSize },
        timestamp: Date.now()
      });
    }

    // Check for dangerous patterns
    const payloadStr = JSON.stringify(payload);
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onload=/i,
      /eval\(/i,
      /Function\(/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(payloadStr)) {
        violations.push({
          type: "payload_invalid",
          severity: "critical",
          message: "Payload contains potentially dangerous pattern",
          details: { pattern: pattern.source },
          timestamp: Date.now()
        });
      }
    }

    // Check for prototype pollution
    if (this.hasPrototypePollution(payload)) {
      violations.push({
        type: "payload_invalid",
        severity: "critical",
        message: "Payload contains prototype pollution attempt",
        details: {},
        timestamp: Date.now()
      });
    }

    if (violations.length > 0) {
      this.metrics.totalViolations++;
      this.metrics.blockedRequests++;
      violations.forEach(v => this.trackViolation(v));
      return { isValid: false, violations };
    }

    return { isValid: true, violations: [] };
  }

  validateAudio(audioData: Uint8Array): ValidationResult {
    if (!this.isRunning || !this.defaultOptions.enableAudioValidation) {
      return { isValid: true, violations: [] };
    }

    this.metrics.totalValidations++;
    const violations: SecurityViolation[] = [];

    // Check audio data size
    const maxSize = this.defaultOptions.quotas?.maxAudioChunkSize || 5 * 1024 * 1024;
    
    if (audioData.length > maxSize) {
      violations.push({
        type: "audio_invalid",
        severity: "high",
        message: "Audio chunk size exceeds maximum allowed",
        details: { size: audioData.length, maxSize },
        timestamp: Date.now()
      });
    }

    // Check for valid PCM16 format (even number of bytes)
    if (audioData.length % 2 !== 0) {
      violations.push({
        type: "audio_invalid",
        severity: "medium",
        message: "Audio data must be in PCM16 format (even number of bytes)",
        details: { size: audioData.length },
        timestamp: Date.now()
      });
    }

    // Check for silence attack (all zeros)
    if (this.isAllZeros(audioData)) {
      violations.push({
        type: "audio_invalid",
        severity: "low",
        message: "Audio data appears to be all zeros (potential silence attack)",
        details: { size: audioData.length },
        timestamp: Date.now()
      });
    }

    if (violations.length > 0) {
      this.metrics.totalViolations++;
      this.metrics.blockedRequests++;
      violations.forEach(v => this.trackViolation(v));
      return { isValid: false, violations };
    }

    return { isValid: true, violations: [] };
  }

  checkQuota(identifier: string, type: "payload" | "audio" | "request"): boolean {
    if (!this.isRunning || !this.defaultOptions.enableQuotas) {
      return true;
    }

    if (!this.quotaUsage.has(identifier)) {
      this.quotaUsage.set(identifier, new Map());
    }

    const userQuota = this.quotaUsage.get(identifier)!;
    const currentUsage = userQuota.get(type) || 0;
    
    const limits: Record<string, number> = {
      payload: this.defaultOptions.quotas?.maxPayloadSize || 10 * 1024 * 1024,
      audio: this.defaultOptions.quotas?.maxAudioChunkSize || 5 * 1024 * 1024,
      request: this.defaultOptions.quotas?.maxRequestsPerMinute || 100
    };

    if (currentUsage >= limits[type]) {
      this.metrics.quotaExceeded++;
      
      const violation: SecurityViolation = {
        type: "quota_exceeded",
        severity: "medium",
        message: `Quota exceeded for ${type}`,
        details: { identifier, type, currentUsage, limit: limits[type] },
        timestamp: Date.now()
      };
      
      this.trackViolation(violation);
      return false;
    }

    userQuota.set(type, currentUsage + 1);
    return true;
  }

  checkRateLimit(identifier: string): boolean {
    if (!this.isRunning || !this.defaultOptions.enableRateLimiting) {
      return true;
    }

    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    if (!this.requestCounters.has(identifier)) {
      this.requestCounters.set(identifier, []);
    }

    const timestamps = this.requestCounters.get(identifier)!;
    
    // Remove timestamps older than 1 minute
    const recentTimestamps = timestamps.filter(t => t > oneMinuteAgo);
    this.requestCounters.set(identifier, recentTimestamps);

    const maxRequests = this.defaultOptions.quotas?.maxRequestsPerMinute || 100;
    
    if (recentTimestamps.length >= maxRequests) {
      this.metrics.rateLimitHits++;
      
      const violation: SecurityViolation = {
        type: "rate_limit_exceeded",
        severity: "medium",
        message: "Rate limit exceeded",
        details: { identifier, requestCount: recentTimestamps.length, maxRequests },
        timestamp: Date.now()
      };
      
      this.trackViolation(violation);
      return false;
    }

    recentTimestamps.push(now);
    return true;
  }

  checkMemoryLimit(currentUsage: number): boolean {
    if (!this.isRunning || !this.defaultOptions.enableMemoryLimits) {
      return true;
    }

    const maxMemory = this.defaultOptions.quotas?.maxMemoryUsage || 100 * 1024 * 1024;
    
    if (currentUsage > maxMemory) {
      this.metrics.memoryLimitHits++;
      
      const violation: SecurityViolation = {
        type: "memory_limit_exceeded",
        severity: "critical",
        message: "Memory limit exceeded",
        details: { currentUsage, maxMemory },
        timestamp: Date.now()
      };
      
      this.trackViolation(violation);
      return false;
    }

    return true;
  }

  protectWebSocket(identifier: string): boolean {
    if (!this.isRunning || !this.defaultOptions.enableWebSocketProtection) {
      return true;
    }

    const maxConnections = this.defaultOptions.quotas?.maxConcurrentConnections || 10;
    
    if (this.activeConnections.has(identifier)) {
      // Already connected, allow
      return true;
    }

    if (this.activeConnections.size >= maxConnections) {
      const violation: SecurityViolation = {
        type: "websocket_unauthorized",
        severity: "high",
        message: "Maximum concurrent connections exceeded",
        details: { identifier, currentConnections: this.activeConnections.size, maxConnections },
        timestamp: Date.now()
      };
      
      this.trackViolation(violation);
      return false;
    }

    this.activeConnections.add(identifier);
    return true;
  }

  getSecurityMetrics(): SecurityMetrics {
    return {
      ...this.metrics,
      violationsByType: new Map(this.metrics.violationsByType)
    };
  }

  subscribeToViolations(callback: (violation: SecurityViolation) => void): void {
    this.violationCallbacks.push(callback);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private resetMetrics(): void {
    this.metrics = {
      totalValidations: 0,
      totalViolations: 0,
      violationsByType: new Map(),
      blockedRequests: 0,
      rateLimitHits: 0,
      quotaExceeded: 0,
      memoryLimitHits: 0
    };
  }

  private trackViolation(violation: SecurityViolation): void {
    const current = this.metrics.violationsByType.get(violation.type) || 0;
    this.metrics.violationsByType.set(violation.type, current + 1);
    
    this.violationCallbacks.forEach(callback => {
      try {
        callback(violation);
      } catch (error) {
        console.error("Error in violation callback:", error);
      }
    });
  }

  private hasPrototypePollution(obj: unknown): boolean {
    if (obj === null || typeof obj !== 'object') {
      return false;
    }

    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    
    for (const key of dangerousKeys) {
      if (key in (obj as Record<string, unknown>)) {
        return true;
      }
    }

    return false;
  }

  private isAllZeros(data: Uint8Array): boolean {
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== 0) {
        return false;
      }
    }
    return true;
  }
}
