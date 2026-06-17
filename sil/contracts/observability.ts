export interface ObservabilityEvent {
  type: string;
  tenantId: string;
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface ObservabilityBus {
  emit(event: ObservabilityEvent): Promise<void>;
}
