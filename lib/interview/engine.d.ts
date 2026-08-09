export type InterviewMode = "diagnostic" | "simulation";
export type InterviewContext = "direction" | "pression_strategique" | "codir";
export type InterviewPhase = "positionnement" | "impact" | "contradiction" | "pression" | "codir";
export interface InterviewState {
    mode: InterviewMode;
    context: InterviewContext;
    currentPhase: InterviewPhase;
    questionIndex: number;
    stressLevel: number;
    startTime: number;
    timeLimit: number;
    dominantPosture?: string;
}
export declare class InterviewEngine {
    state: InterviewState;
    constructor(mode: InterviewMode, context: InterviewContext);
    getTimeRemaining(): number;
    nextPhase(): void;
    registerAnswer(dominantPosture?: string): void;
    shouldInterrupt(): boolean;
    shouldEnd(): boolean;
}
//# sourceMappingURL=engine.d.ts.map