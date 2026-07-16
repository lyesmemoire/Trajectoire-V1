import { VoiceClientError } from "./VoiceClientError.js";

export class StateError extends VoiceClientError {
  public readonly fromState: string;
  public readonly event: string;

  constructor(message: string, fromState: string, event: string) {
    super(message, "INVALID_TRANSITION", false);
    this.name = "StateError";
    this.fromState = fromState;
    this.event = event;
  }

  static invalidTransition(fromState: string, event: string): StateError {
    return new StateError(
      `Invalid transition: cannot handle '${event}' in state '${fromState}'`,
      fromState,
      event
    );
  }

  static operationNotAllowed(operation: string, currentState: string): StateError {
    return new StateError(
      `Operation '${operation}' is not allowed in state '${currentState}'`,
      currentState,
      operation
    );
  }
}
