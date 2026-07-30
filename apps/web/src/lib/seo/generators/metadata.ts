import { Metadata } from "next";
import { Job } from '../data/jobs';
import { Company } from "../data/companies";

export function generateInterviewMetadata(job: any, company: Company, ): Metadata {
  const title = `Questions Entretien ${job.title} ${company.name} | Guide Complet 2024`;
  const description = `Préparez votre entretien ${job.title} chez ${company.name} : 10 questions types, exemples de réponses, conseils d'experts. Taux de réussite +67%.`;

  return {
    title,
    description,
    keywords: [
      `entretien ${job.title}`,
      `questions ${company.name}`,
      job.title,
      company.name,
      "préparation entretien",
      "interview questions",
      ...job.keywords,
    ],
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "AI Career Copilot",
      images: [
        {
          url: `/og-images/interviews/${job.id}-${company.id}.png`, // À générer dynamiquement
          width: 1200,
          height: 630,
          alt: `Interview ${job.title} chez ${company.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateCVTemplateMetadata(job: any): Metadata {
  const title = `CV Template ${job.title} | Modèle Optimisé ATS 2024`;
  const description = `Téléchargez notre template CV ${job.title} optimisé pour les systèmes ATS. Format moderne, mots-clés pertinents, taux de réponse +3x.`;

  return {
    title,
    description,
    keywords: [
      `cv ${job.title}`,
      "cv template",
      "modèle cv",
      "ats optimized",
      job.title,
      ...job.keywords,
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: `/og-images/cv-templates/${job.id}.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
