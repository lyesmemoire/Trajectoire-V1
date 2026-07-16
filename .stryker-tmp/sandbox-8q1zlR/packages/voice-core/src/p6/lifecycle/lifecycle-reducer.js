// @ts-nocheck
export class InvalidLifecycleTransitionError extends Error {
    state;
    event;
    constructor(state, event) {
        super(`Invalid transition: Cannot process event '${event}' from state '${state}'`);
        this.state = state;
        this.event = event;
        this.name = "InvalidLifecycleTransitionError";
    }
}
export function reduceLifecycle(state, event) {
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
//# sourceMappingURL=lifecycle-reducer.js.map