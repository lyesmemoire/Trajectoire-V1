import { PersonaConfig } from "../personas/persona-config";
import { InterviewState } from "../orchestration/interview-state-machine";
import { AnswerAnalysis } from "../behavior/answer-analysis";
interface PromptInputs {
    persona: PersonaConfig;
    state: InterviewState;
    analysis: AnswerAnalysis;
    strategy: string;
    userAnswer: string;
}
export declare function generateRecruiterPrompt({ persona, state, analysis, strategy, userAnswer, }: PromptInputs): Promise<string>;
export {};
//# sourceMappingURL=prompt-builder.d.ts.map