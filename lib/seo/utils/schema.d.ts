import { Company } from "../data/companies";
export declare function generateInterviewSchema(job: _Job, company: Company): {
    "@context": string;
    "@type": string;
    headline: string;
    description: string;
    author: {
        "@type": string;
        name: string;
        url: string;
    };
    publisher: {
        "@type": string;
        name: string;
        logo: {
            "@type": string;
            url: string;
        };
    };
    datePublished: string;
    dateModified: string;
    mainEntityOfPage: {
        "@type": string;
        "@id": string;
    };
    about: {
        "@type": string;
        title: any;
        hiringOrganization: {
            "@type": string;
            name: any;
        };
        baseSalary: {
            "@type": string;
            currency: string;
            value: {
                "@type": string;
                value: number;
                unitText: string;
            };
        };
    };
};
//# sourceMappingURL=schema.d.ts.map