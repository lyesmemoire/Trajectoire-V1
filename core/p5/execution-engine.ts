import { MindState, P5Event } from "./execution-contract";
import { reduceMind } from "./reduceMind";

export function applyEvents(
  state: MindState,
  events: readonly P5Event[]
): MindState {
  return events.reduce((acc, event) => reduceMind(acc, event), state);
}
