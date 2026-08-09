export interface Company {
    id: string;
    name: string;
    category: "gafam" | "unicorn" | "enterprise" | "startup";
    industry: string;
    employeeCount: string;
    headquarters: string;
    description: string;
}
export declare const companies: Compunknown[];
export declare function getCompanyBySlug(slug: string): Company | undefined;
export declare function getAllCompanySlugs(): string[];
//# sourceMappingURL=companies.d.ts.map