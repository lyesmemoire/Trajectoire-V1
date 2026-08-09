export interface Job {
    id: string;
    title: string;
    category: "engineering" | "product" | "design" | "data" | "marketing" | "sales";
    level: "junior" | "mid" | "senior" | "lead" | "executive";
    avgSalary: number;
    description: string;
    keywords: string[];
}
export declare const jobs: Job[];
export declare function getJobBySlug(slug: string): Job | undefined;
export declare function getAllJobSlugs(): string[];
//# sourceMappingURL=jobs.d.ts.map