import { BaseEvent } from "./Event";

export interface Reducer<State> {
  readonly name: string;
  
  /**
   * Applies an event to the current state to produce a new state.
   * This must be a pure function.
   * 
   * @param currentState The current state
   * @param event The event to apply
   * @returns The newly computed state
   */
  reduce(currentState: State, event: BaseEvent): State;
}
