import { SessionLifecycleState, LifecycleEvent } from "./lifecycle-contract.js";
export declare class InvalidLifecycleTransitionError extends Error {
    readonly state: SessionLifecycleState;
    readonly event: LifecycleEvent["type"];
    constructor(state: SessionLifecycleState, event: LifecycleEvent["type"]);
}
export declare function reduceLifecycle(_state: SessionLifecycleState, _event: LifecycleEvent): SessionLifecycleState;
//# sourceMappingURL=lifecycle-reducer.d.ts.map