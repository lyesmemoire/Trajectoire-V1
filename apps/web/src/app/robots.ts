import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trajectoire.app"

// Les pages de l'espace connecté et l'API ne sont pas destinées à l'indexation.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/dashboard",
        "/cv",
        "/simulation",
        "/report",
        "/history",
        "/settings",
        "/onboarding",
        "/opportunities",
        "/discovery",
        "/interview",
        "/knowledge",
        "/matching",
        "/copilot",
        "/search",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
