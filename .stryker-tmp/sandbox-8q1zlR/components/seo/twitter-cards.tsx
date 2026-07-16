// @ts-nocheck
interface TwitterCardConfig {
  card?: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  player?: string;
  playerWidth?: number;
  playerHeight?: number;
  playerStream?: string;
}

export function generateTwitterCard(config: TwitterCardConfig = {}): Record<string, string> {
  const {
    card = "summary_large_image",
    site = "@trajectoire",
    creator = "@trajectoire",
    title = "Trajectoire - Optimisez votre CV avec l'IA",
    description = "Plateforme d'optimisation de CV propulsée par l'intelligence artificielle.",
    image = `${process.env.NEXT_PUBLIC_SITE_URL || "https://trajectoire.fr"}/twitter-image.jpg`,
    imageAlt = title,
  } = config;

  const twitterTags: Record<string, string> = {
    "twitter:card": card,
    "twitter:site": site,
    "twitter:creator": creator,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": image,
    "twitter:image:alt": imageAlt,
  };

  // Add player-specific tags if card type is player
  if (card === "player" && config.player) {
    twitterTags["twitter:player"] = config.player;
    if (config.playerWidth) {
      twitterTags["twitter:player:width"] = config.playerWidth.toString();
    }
    if (config.playerHeight) {
      twitterTags["twitter:player:height"] = config.playerHeight.toString();
    }
    if (config.playerStream) {
      twitterTags["twitter:player:stream"] = config.playerStream;
    }
  }

  return twitterTags;
}

// App card for mobile apps
export function generateAppCard(config: {
  name: string;
  description: string;
  url: string;
  appId?: {
    iphone?: string;
    ipad?: string;
    googlePlay?: string;
  };
}) {
  const baseCard = generateTwitterCard({
    card: "app",
    title: config.name,
    description: config.description,
  });

  const appCard = { ...baseCard };

  if (config.appId?.iphone) {
    appCard["twitter:app:id:iphone"] = config.appId.iphone;
  }

  if (config.appId?.ipad) {
    appCard["twitter:app:id:ipad"] = config.appId.ipad;
  }

  if (config.appId?.googlePlay) {
    appCard["twitter:app:id:googleplay"] = config.appId.googlePlay;
  }

  appCard["twitter:app:url:iphone"] = config.url;
  appCard["twitter:app:url:ipad"] = config.url;
  appCard["twitter:app:url:googleplay"] = config.url;

  return appCard;
}

// Player card for videos
export function generatePlayerCard(config: {
  title: string;
  description: string;
  image: string;
  player: string;
  playerWidth?: number;
  playerHeight?: number;
  playerStream?: string;
}) {
  return generateTwitterCard({
    card: "player",
    title: config.title,
    description: config.description,
    image: config.image,
    player: config.player,
    playerWidth: config.playerWidth,
    playerHeight: config.playerHeight,
    playerStream: config.playerStream,
  });
}
