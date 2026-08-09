export type InterviewState = "intro" | "warmup" | "deep_dive" | "pressure" | "recovery" | "closing";
export declare function transitionState(_currentState: InterviewState, questionIndex: number, totalQuestions: number): InterviewState;
export declare function shouldIncreasePressure(state: InterviewState, analysis: unknown): boolean;
//# sourceMappingURL=interview-state-machine.d.ts.map