export interface QuestionTemplate {
    category: "hr" | "technical" | "behavioral" | "case-study";
    level: "junior" | "mid" | "senior";
    question: string;
    why: string;
    idealAnswer: string;
}
export declare const questionTemplates: QuestionTemplate[];
export declare function getQuestionsForJob(_jobCategory: string, level: string): QuestionTemplate[];
//# sourceMappingURL=questions.d.ts.map