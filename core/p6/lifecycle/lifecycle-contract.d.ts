export type SessionLifecycleState = "CREATED" | "ACTIVE" | "PAUSED" | "FINISHED" | "ARCHIVED";
export type LifecycleEvent = {
    type: "START";
} | {
    type: "PAUSE";
} | {
    type: "RESUME";
} | {
    type: "FINISH";
} | {
    type: "ARCHIVE";
};
//# sourceMappingURL=lifecycle-contract.d.ts.map