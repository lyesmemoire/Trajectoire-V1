import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trajectoire.app"

// Pages publiques uniquement (mêmes chemins que les règles PUBLIC d'AuthorizationV2).
const PUBLIC_PATHS = ["/", "/pricing", "/analyze", "/contact", "/signup", "/login", "/privacy", "/terms"]

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map(path => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" || path === "/pricing" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/pricing" || path === "/analyze" ? 0.8 : 0.4,
  }))
}
