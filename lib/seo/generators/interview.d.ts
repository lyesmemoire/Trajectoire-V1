import { Company } from "../data/companies";
export interface InterviewPageContent {
    title: string;
    description: string;
    introduction: string;
    companyOverview: string;
    jobOverview: string;
    questions: Array<{
        question: string;
        category: string;
        why: string;
        idealAnswer: string;
    }>;
    preparationTips: string[];
    ctaText: string;
}
export declare function generateInterviewContent(job: _Job, company: Company): InterviewPageContent;
//# sourceMappingURL=interview.d.ts.map