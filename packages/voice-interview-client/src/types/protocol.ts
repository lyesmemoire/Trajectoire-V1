/**
 * Protocol types mirroring the backend WebSocket contracts exactly.
 * These types ensure compile-time alignment with the server.
 */

export const PROTOCOL_VERSION = 1 as const;

// --- Inbound (Client → Server) ---

export type InboundMessageType = "START" | "TURN" | "PAUSE" | "RESUME" | "STOP" | "PING";

export type TurnIntent = "answer" | "command" | "silence" | "interruption";

export interface BaseInboundMessage {
  readonly protocolVersion: typeof PROTOCOL_VERSION;
  readonly type: InboundMessageType;
}

export interface InboundStartMessage extends BaseInboundMessage {
  readonly type: "START";
  readonly candidateId: string;
  readonly targetRole: string;
}

export interface InboundTurnMessage extends BaseInboundMessage {
  readonly type: "TURN";
  readonly sessionId: string;
  readonly turnId: string;
  readonly transcript: string;
  readonly intent: TurnIntent;
  readonly timingMs: number;
}

export interface InboundLifecycleMessage extends BaseInboundMessage {
  readonly type: "PAUSE" | "RESUME" | "STOP";
  readonly sessionId: string;
}

export interface InboundPingMessage extends BaseInboundMessage {
  readonly type: "PING";
}

export type InboundMessage =
  | InboundStartMessage
  | InboundTurnMessage
  | InboundLifecycleMessage
  | InboundPingMessage;

// --- Outbound (Server → Client) ---

export type OutboundMessageType = "AUDIO" | "TEXT" | "STATE" | "ERROR" | "COMPLETED" | "PONG";

export type FeedbackSignal = "probe" | "deepen" | "move-on" | "clarify";

export interface OutboundAudioMessage {
  readonly type: "AUDIO";
  readonly sessionId: string;
  readonly audioChunk: string;
}

export interface OutboundTextMessage {
  readonly type: "TEXT";
  readonly sessionId: string;
  readonly text: string;
  readonly feedbackSignal: FeedbackSignal | null;
}

export interface OutboundStateMessage {
  readonly type: "STATE";
  readonly sessionId: string;
  readonly status: string;
  readonly phase: string;
}

export interface OutboundErrorMessage {
  readonly type: "ERROR";
  readonly code: number;
  readonly message: string;
  readonly correlationId: string;
}

export interface OutboundCompletedMessage {
  readonly type: "COMPLETED";
  readonly sessionId: string;
}

export interface OutboundPongMessage {
  readonly type: "PONG";
}

export type OutboundMessage =
  | OutboundAudioMessage
  | OutboundTextMessage
  | OutboundStateMessage
  | OutboundErrorMessage
  | OutboundCompletedMessage
  | OutboundPongMessage;

// --- Ticket Auth ---

export interface TicketResponse {
  readonly ticket: string;
}
