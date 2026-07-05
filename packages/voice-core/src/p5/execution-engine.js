import { reduceMind } from "./reduceMind.js";
export function applyEvents(state, events) {
    return events.reduce((acc, event) => reduceMind(acc, event), state);
}
//# sourceMappingURL=execution-engine.js.map