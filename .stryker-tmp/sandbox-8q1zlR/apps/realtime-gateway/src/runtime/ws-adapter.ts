// @ts-nocheck
import { CandidateMessage } from "@trajectoire/voice-core/p6";
import { TransportCommand } from "@trajectoire/voice-core/p6";

export interface WebSocketMessage {
  event: string;
  payload: Record<string, unknown>;
}

export interface WebSocketFrame {
  type: string;
  data: unknown;
}

export class WebSocketAdapter {
  public toCandidateMessage(wsMessage: WebSocketMessage): CandidateMessage {
    return {
      text: String(wsMessage.payload.text || ""),
      metadata: wsMessage.payload,
    };
  }

  public toWebSocketFrames(commands: readonly TransportCommand[]): WebSocketFrame[] {
    return commands.map(cmd => {
      switch (cmd.type) {
        case "WAIT":
          return { type: "control", data: { action: "wait", duration: cmd.ms } };
        case "INTERRUPT":
          return { type: "control", data: { action: "interrupt" } };
        case "START_LISTENING":
          return { type: "control", data: { action: "listen" } };
        case "STOP_LISTENING":
          return { type: "control", data: { action: "stop_listen" } };
        case "SPEAK":
          return { type: "tts", data: { text: cmd.text, speed: cmd.speechRate } };
        default:
          return { type: "unknown", data: null };
      }
    });
  }
}
