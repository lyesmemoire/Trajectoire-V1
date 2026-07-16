// @ts-nocheck
import { Metadata } from "next";

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
    url?: string;
    type?: "website" | "article";
    locale?: string;
    siteName?: string;
  };
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
    site?: string;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
      noimageindex?: boolean;
      "max-video-preview"?: number | string;
      "max-image-preview"?: number | string;
      "max-snippet"?: number;
    };
  };
  verification?: {
    google?: string;
    bing?: string;
    yandex?: string;
  };
  alternates?: {
    canonical?: string;
    languages?: {
      [key: string]: string;
    };
  };
}

const defaultSEO: SEOConfig = {
  title: "Trajectoire - Optimisez votre CV avec l'IA",
  description: "Plateforme d'optimisation de CV propulsée par l'intelligence artificielle. Analysez, optimisez et améliorez votre CV pour maximiser vos chances de réussite.",
  keywords: ["CV", "optimisation", "IA", "ATS", "recrutement", "carrière"],
  openGraph: {
    title: "Trajectoire - Optimisez votre CV avec l'IA",
    description: "Plateforme d'optimisation de CV propulsée par l'intelligence artificielle.",
    type: "website",
    locale: "fr_FR",
    siteName: "Trajectoire",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trajectoire - Optimisez votre CV avec l'IA",
    description: "Plateforme d'optimisation de CV propulsée par l'intelligence artificielle.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    } as any,
  },
};

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const mergedConfig = { ...defaultSEO, ...config };
  const {
    title,
    description,
    keywords,
    canonical,
    openGraph,
    twitter,
    robots,
    verification,
    alternates,
  } = mergedConfig;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.join(", "),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://trajectoire.fr"),
    alternates: {
      canonical: alternates?.canonical || canonical,
      languages: alternates?.languages,
    },
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      url: openGraph?.url || canonical,
      siteName: openGraph?.siteName,
      locale: openGraph?.locale,
      type: openGraph?.type,
      images: openGraph?.images?.map((url) => ({
        url,
        width: 1200,
        height: 630,
        alt: title,
      })),
    },
    twitter: {
      card: twitter?.card,
      title: twitter?.title || title,
      description: twitter?.description || description,
      images: twitter?.images,
      creator: twitter?.creator,
      site: twitter?.site,
    },
    robots: {
      index: robots?.index,
      follow: robots?.follow,
      googleBot: robots?.googleBot as any,
    },
    verification: {
      google: verification?.google,
      other: {
        bing: verification?.bing,
        yandex: verification?.yandex,
      },
    } as any,
  };

  return metadata;
}

export function generatePageMetadata(config: SEOConfig): Metadata {
  return generateMetadata(config);
}

// Page-specific metadata configurations
export const pageMetadata = {
  home: {
    title: "Trajectoire - Optimisez votre CV avec l'IA",
    description: "Plateforme d'optimisation de CV propulsée par l'intelligence artificielle. Analysez, optimisez et améliorez votre CV pour maximiser vos chances de réussite.",
    keywords: ["CV", "optimisation", "IA", "ATS", "recrutement", "carrière"],
  },
  dashboard: {
    title: "Dashboard - Trajectoire",
    description: "Accédez à votre dashboard pour gérer vos CVs, analyses ATS et optimisations.",
    keywords: ["dashboard", "CV", "ATS", "optimisation"],
  },
  cvs: {
    title: "Mes CVs - Trajectoire",
    description: "Gérez et organisez tous vos CVs dans un seul endroit.",
    keywords: ["CV", "gestion", "organisation"],
  },
  ats: {
    title: "Analyse ATS - Trajectoire",
    description: "Analysez votre CV avec notre outil ATS pour maximiser vos chances de passer les filtres.",
    keywords: ["ATS", "analyse", "CV", "recrutement"],
  },
  optimize: {
    title: "Optimisation CV - Trajectoire",
    description: "Optimisez votre CV avec notre IA pour le rendre plus performant.",
    keywords: ["optimisation", "CV", "IA", "amélioration"],
  },
  export: {
    title: "Export PDF - Trajectoire",
    description: "Exportez votre CV optimisé en PDF avec un design professionnel.",
    keywords: ["export", "PDF", "CV", "design"],
  },
  pricing: {
    title: "Tarifs - Trajectoire",
    description: "Découvrez nos tarifs pour l'optimisation de CV avec l'IA.",
    keywords: ["tarifs", "prix", "abonnement", "CV"],
  },
  about: {
    title: "À propos - Trajectoire",
    description: "Découvrez Trajectoire et notre mission d'aider les candidats à réussir.",
    keywords: ["à propos", "mission", "équipe", "histoire"],
  },
  contact: {
    title: "Contact - Trajectoire",
    description: "Contactez notre équipe pour toute question ou assistance.",
    keywords: ["contact", "support", "aide", "assistance"],
  },
  login: {
    title: "Connexion - Trajectoire",
    description: "Connectez-vous à votre compte Trajectoire.",
    keywords: ["connexion", "login", "authentification"],
  },
  register: {
    title: "Inscription - Trajectoire",
    description: "Créez votre compte Trajectoire et commencez à optimiser votre CV.",
    keywords: ["inscription", "register", "création compte"],
  },
};
