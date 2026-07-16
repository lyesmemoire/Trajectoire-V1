// @ts-nocheck
export type RuntimeEventType =
  | "USER_EVENT"
  | "SYSTEM_EVENT"
  | "DIAGNOSTIC_EVENT"
  | "REPLAY_EVENT";

export interface RuntimeEvent {
  id: string;
  type: RuntimeEventType;
  timestamp: number;
  payload: Record<string, any>;
}

export interface RoutedEvent extends RuntimeEvent {
  route: string;
  metadata: Record<string, any>;
}

export type MiddlewareContext = {
  event: RuntimeEvent;
  stop?: boolean;
  error?: Error;
};

export type HandlerResult = {
  success: boolean;
  retry?: boolean;
  error?: Error;
};
