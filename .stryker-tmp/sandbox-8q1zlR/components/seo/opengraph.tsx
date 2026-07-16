// @ts-nocheck
interface OpenGraphConfig {
  title?: string;
  description?: string;
  url?: string;
  siteName?: string;
  locale?: string;
  alternateLocale?: string[];
  type?: "website" | "article" | "book" | "profile";
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
    type?: string;
  }>;
  audio?: string;
  video?: string;
  determiner?: "" | "auto" | "the" | "a" | "an";
}

export function generateOpenGraph(config: OpenGraphConfig = {}): Record<string, string> {
  const {
    title = "Trajectoire - Optimisez votre CV avec l'IA",
    description = "Plateforme d'optimisation de CV propulsée par l'intelligence artificielle.",
    url = process.env.NEXT_PUBLIC_SITE_URL || "https://trajectoire.fr",
    siteName = "Trajectoire",
    locale = "fr_FR",
    alternateLocale = ["en_US", "es_ES", "de_DE"],
    type = "website",
    images = [
      {
        url: `${url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: title,
        type: "image/jpeg",
      },
    ],
  } = config;

  const ogTags: Record<string, string> = {
    "og:title": title,
    "og:description": description,
    "og:url": url,
    "og:site_name": siteName,
    "og:locale": locale,
    "og:type": type,
  };

  // Add alternate locales
  alternateLocale.forEach((altLocale) => {
    ogTags[`og:locale:alternate`] = altLocale;
  });

  // Add images
  images.forEach((image, index) => {
    ogTags[`og:image${index > 0 ? `:${index}` : ""}`] = image.url;
    if (image.width) ogTags[`og:image:width${index > 0 ? `:${index}` : ""}`] = image.width.toString();
    if (image.height) ogTags[`og:image:height${index > 0 ? `:${index}` : ""}`] = image.height.toString();
    if (image.alt) ogTags[`og:image:alt${index > 0 ? `:${index}` : ""}`] = image.alt;
    if (image.type) ogTags[`og:image:type${index > 0 ? `:${index}` : ""}`] = image.type;
  });

  // Add audio
  if (config.audio) {
    ogTags["og:audio"] = config.audio;
  }

  // Add video
  if (config.video) {
    ogTags["og:video"] = config.video;
  }

  // Add determiner
  if (config.determiner) {
    ogTags["og:determiner"] = config.determiner;
  }

  return ogTags;
}

// Article-specific OpenGraph
export function generateArticleOpenGraph(config: {
  title: string;
  description: string;
  url: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}) {
  const baseOG = generateOpenGraph({
    title: config.title,
    description: config.description,
    url: config.url,
    type: "article",
  });

  const articleOG = { ...baseOG };

  if (config.publishedTime) {
    articleOG["article:published_time"] = config.publishedTime;
  }

  if (config.modifiedTime) {
    articleOG["article:modified_time"] = config.modifiedTime;
  }

  if (config.authors) {
    config.authors.forEach((author, index) => {
      articleOG[`article:author${index > 0 ? `:${index}` : ""}`] = author;
    });
  }

  if (config.section) {
    articleOG["article:section"] = config.section;
  }

  if (config.tags) {
    config.tags.forEach((tag, index) => {
      articleOG[`article:tag${index > 0 ? `:${index}` : ""}`] = tag;
    });
  }

  return articleOG;
}

// Profile-specific OpenGraph
export function generateProfileOpenGraph(config: {
  title: string;
  description: string;
  url: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: "male" | "female";
}) {
  const baseOG = generateOpenGraph({
    title: config.title,
    description: config.description,
    url: config.url,
    type: "profile",
  });

  const profileOG = { ...baseOG };

  if (config.firstName) {
    profileOG["profile:first_name"] = config.firstName;
  }

  if (config.lastName) {
    profileOG["profile:last_name"] = config.lastName;
  }

  if (config.username) {
    profileOG["profile:username"] = config.username;
  }

  if (config.gender) {
    profileOG["profile:gender"] = config.gender;
  }

  return profileOG;
}
