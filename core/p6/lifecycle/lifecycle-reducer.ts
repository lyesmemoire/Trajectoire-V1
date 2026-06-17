import { SessionLifecycleState, LifecycleEvent } from "./lifecycle-contract";

export class InvalidLifecycleTransitionError extends Error {
  constructor(public readonly state: SessionLifecycleState, public readonly event: LifecycleEvent["type"]) {
    super(`Invalid transition: Cannot process event '${event}' from state '${state}'`);
    this.name = "InvalidLifecycleTransitionError";
  }
}

export function reduceLifecycle(state: SessionLifecycleState, event: LifecycleEvent): SessionLifecycleState {
  switch (state) {
    case "CREATED":
      switch (event.type) {
        case "START": return "ACTIVE";
        case "ARCHIVE": return "ARCHIVED"; // allow early cancellation
        default: throw new InvalidLifecycleTransitionError(state, event.type);
      }

    case "ACTIVE":
      switch (event.type) {
        case "PAUSE": return "PAUSED";
        case "FINISH": return "FINISHED";
        case "ARCHIVE": return "ARCHIVED"; // allow abrupt termination
        default: throw new InvalidLifecycleTransitionError(state, event.type);
      }

    case "PAUSED":
      switch (event.type) {
        case "RESUME": return "ACTIVE";
        case "FINISH": return "FINISHED";
        case "ARCHIVE": return "ARCHIVED";
        default: throw new InvalidLifecycleTransitionError(state, event.type);
      }

    case "FINISHED":
      switch (event.type) {
        case "ARCHIVE": return "ARCHIVED";
        default: throw new InvalidLifecycleTransitionError(state, event.type);
      }

    case "ARCHIVED":
      // Terminal state, no transitions allowed
      throw new InvalidLifecycleTransitionError(state, event.type);

    default:
      throw new Error(`Unknown state: ${state}`);
  }
}
