export type TemplateStyle = "modern" | "executive" | "minimal" | "creative";
export type TemplateColor = "red" | "navy" | "black" | "slate";
export interface CVTemplate {
    id: string;
    name: string;
    style: TemplateStyle;
    color: TemplateColor;
    description: string;
    targetRoles: string[];
    atsScore: number;
    features: string[];
    popular: boolean;
    premium: boolean;
}
export declare const cvTemplates: CVTemplate[];
export declare function getTemplateBySlug(slug: string): CVTemplate | undefined;
export declare function getAllTemplateSlugs(): string[];
export declare function getTemplatesForJob(jobId: string): CVTemplate[];
//# sourceMappingURL=templates.d.ts.map