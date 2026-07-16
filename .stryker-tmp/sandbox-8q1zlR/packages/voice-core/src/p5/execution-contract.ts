// @ts-nocheck
export type Emotion = string;

export interface MindState {
  trust: number;
  suspicion: number;
  pressure: number;
  emotion: Emotion;
}

export type P5Event =
  | { type: "TRUST_DELTA"; delta: number }
  | { type: "SUSPICION_DELTA"; delta: number }
  | { type: "PRESSURE_DELTA"; delta: number }
  | { type: "EMOTION_SET"; emotion: Emotion };
