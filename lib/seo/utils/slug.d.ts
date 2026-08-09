export interface ParsedInterviewSlug {
    jobSlug: string;
    companySlug: string;
}
export declare function parseInterviewSlug(slug: string): ParsedInterviewSlug | null;
export declare function buildInterviewSlug(jobSlug: string, companySlug: string): string;
export declare function isValidInterviewSlug(slug: string): boolean;
//# sourceMappingURL=slug.d.ts.map