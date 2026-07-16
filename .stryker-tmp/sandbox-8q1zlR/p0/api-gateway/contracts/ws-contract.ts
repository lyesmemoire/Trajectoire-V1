// @ts-nocheck
export type RuntimeWSMessage =
  | {
      type: "candidate.message";
      sessionId: string;
      payload: {
        text: string;
        timestamp: number;
      };
    }
  | {
      type: "control.end";
      sessionId: string;
    }
  | {
      type: "ping";
    };
