export type RuntimeWireEvent =
  | {
      type: "USER_MESSAGE";
      sessionId: string;
      message: string;
      timestamp: number;
    }
  | {
      type: "VOICE_OUTPUT";
      sessionId: string;
      utterance: string;
      timestamp: number;
    }
  | {
      type: "P6_EVENT";
      sessionId: string;
      event:
        | "DECISION"
        | "STATE_TRANSITION"
        | "VOICE_PLAN"
        | "TRANSPORT_COMMAND";
      payload: unknown;
      timestamp: number;
    };
