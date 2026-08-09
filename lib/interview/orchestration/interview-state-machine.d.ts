export type InterviewState = "intro" | "warmup" | "deep_dive" | "pressure" | "recovery" | "closing";
export declare function transitionState(_currentState: InterviewState, completedQuestions: number, totalExpected: number): InterviewState;
//# sourceMappingURL=interview-state-machine.d.ts.map