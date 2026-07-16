// @ts-nocheck
interface JSONLDProps {
  type: string;
  data: Record<string, any>;
}

export function JSONLD({ type, data }: JSONLDProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// WebSite schema
export function WebSiteSchema({
  name = "Trajectoire",
  url = process.env.NEXT_PUBLIC_SITE_URL || "https://trajectoire.fr",
  description = "Plateforme d'optimisation de CV propulsée par l'intelligence artificielle.",
  potentialAction,
}: {
  name?: string;
  url?: string;
  description?: string;
  potentialAction?: {
    type: string;
    target: string;
    "query-input": string;
  };
}) {
  return (
    <JSONLD
      type="WebSite"
      data={{
        name,
        url,
        description,
        potentialAction: potentialAction || {
          "@type": "SearchAction",
          target: `${url}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

// Organization schema
export function OrganizationSchema({
  name = "Trajectoire",
  url = process.env.NEXT_PUBLIC_SITE_URL || "https://trajectoire.fr",
  logo = `${process.env.NEXT_PUBLIC_SITE_URL || "https://trajectoire.fr"}/logo.png`,
  description = "Plateforme d'optimisation de CV propulsée par l'intelligence artificielle.",
  address,
  contactPoint,
  sameAs,
}: {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}) {
  return (
    <JSONLD
      type="Organization"
      data={{
        name,
        url,
        logo,
        description,
        address,
        contactPoint,
        sameAs,
      }}
    />
  );
}

// Service schema
export function ServiceSchema({
  name,
  description,
  provider,
  areaServed,
  hasOfferCatalog,
}: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  hasOfferCatalog?: {
    name: string;
    itemListElement: Array<{
      type: string;
      name: string;
      description: string;
      price?: string;
    }>;
  };
}) {
  return (
    <JSONLD
      type="Service"
      data={{
        name,
        description,
        provider,
        areaServed,
        hasOfferCatalog,
      }}
    />
  );
}

// FAQ schema
export function FAQSchema({
  faqs,
}: {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}) {
  return (
    <JSONLD
      type="FAQPage"
      data={{
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}

// Breadcrumb schema
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{
    name: string;
    item: string;
  }>;
}) {
  return (
    <JSONLD
      type="BreadcrumbList"
      data={{
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.item,
        })),
      }}
    />
  );
}

// Article schema
export function ArticleSchema({
  headline,
  image,
  author,
  datePublished,
  dateModified,
  description,
}: {
  headline: string;
  image?: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
}) {
  return (
    <JSONLD
      type="Article"
      data={{
        headline,
        image,
        author: {
          "@type": "Person",
          name: author,
        },
        datePublished,
        dateModified,
        description,
      }}
    />
  );
}

// Product schema
export function ProductSchema({
  name,
  description,
  image,
  offers,
  aggregateRating,
}: {
  name: string;
  description: string;
  image?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  return (
    <JSONLD
      type="Product"
      data={{
        name,
        description,
        image,
        offers,
        aggregateRating,
      }}
    />
  );
}

// LocalBusiness schema
export function LocalBusinessSchema({
  name,
  description,
  address,
  telephone,
  openingHours,
  priceRange,
}: {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  openingHours?: string;
  priceRange?: string;
}) {
  return (
    <JSONLD
      type="LocalBusiness"
      data={{
        name,
        description,
        address: {
          "@type": "PostalAddress",
          ...address,
        },
        telephone,
        openingHours,
        priceRange,
      }}
    />
  );
}

// Person schema
export function PersonSchema({
  name,
  jobTitle,
  url,
  image,
  sameAs,
}: {
  name: string;
  jobTitle?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
}) {
  return (
    <JSONLD
      type="Person"
      data={{
        name,
        jobTitle,
        url,
        image,
        sameAs,
      }}
    />
  );
}
