import { MindState, P5Event } from "./execution-contract.js";
import { reduceMind } from "./reduceMind.js";

export function applyEvents(state: MindState, events: readonly P5Event[]): MindState {
  return events.reduce((acc, event) => reduceMind(acc, event), state);
}
