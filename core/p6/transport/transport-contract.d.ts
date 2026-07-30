export type TransportCommand = {
    type: "WAIT";
    ms: number;
} | {
    type: "START_LISTENING";
} | {
    type: "STOP_LISTENING";
} | {
    type: "SPEAK";
    text: string;
    speechRate: number;
} | {
    type: "INTERRUPT";
};
//# sourceMappingURL=transport-contract.d.ts.map