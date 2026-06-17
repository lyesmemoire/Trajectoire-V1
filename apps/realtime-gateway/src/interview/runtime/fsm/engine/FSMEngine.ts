import type { InterviewRuntimeState } from "../types/InterviewRuntimeState";
import type { TimestampedRuntimeEvent } from "../types/TimestampedRuntimeEvent";

export class FSMEngine {
  constructor(public initialState: InterviewRuntimeState) {}

  transition(event: TimestampedRuntimeEvent): { state: InterviewRuntimeState; transitionId: string } {
    return {
      state: this.initialState,
      transitionId: "mock-transition",
    };
  }
}

export function transition(state: InterviewRuntimeState, event: TimestampedRuntimeEvent): { state: InterviewRuntimeState; transitionId: string } {
  return {
    state,
    transitionId: "mock-transition",
  };
}
