import { Job } from "../data/jobs";
import { Company } from "../data/companies";

export function generateInterviewSchema(job: Job, company: Company) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Questions Entretien ${job.title} chez ${company.name}`,
    description: `Guide complet de préparation pour l'entretien ${job.title} chez ${company.name}`,
    author: {
      "@type": "Organization",
      name: "AI Career Copilot",
      url: "https://aicareercopilot.com",
    },
    publisher: {
      "@type": "Organization",
      name: "AI Career Copilot",
      logo: {
        "@type": "ImageObject",
        url: "https://aicareercopilot.com/logo.png",
      },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://aicareercopilot.com/interviews/${job.id}-${company.id}`,
    },
    about: {
      "@type": "JobPosting",
      title: job.title,
      hiringOrganization: {
        "@type": "Organization",
        name: company.name,
      },
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "EUR",
        value: {
          "@type": "QuantitativeValue",
          value: job.avgSalary * 1000,
          unitText: "YEAR",
        },
      },
    },
  };
}
