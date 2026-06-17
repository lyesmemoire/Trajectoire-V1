export interface DeterministicTransitionResult<TState, TEvent> {
  /** The immutable state of the FSM after the transition */
  readonly nextState: TState;
  
  /** A strictly deterministic identifier for the transition */
  readonly transitionId: string;
  
  /** Events to be emitted to the client or bus as a direct result of this transition */
  readonly emittedEvents: readonly TEvent[];
  
  /** 
   * Declarative intent for side effects (e.g., API calls).
   * NO execution happens in the FSM!
   */
  readonly sideEffects: readonly unknown[];
}
