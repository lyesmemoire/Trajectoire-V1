import { NextRequest } from "next/server";

const BLOCKED_AGENTS = [
  "HTTrack",
  "wget",
  "curl",
  "python",
  "scrapy",
  "aiohttp",
  "axios",
  "Go-http-client",
  "PhantomJS",
  "HeadlessChrome",
  "Playwright",
  "Puppeteer",
  "Teleport",
  "SiteSucker",
];

const SUSPICIOUS_PATHS = [
  "/wp-admin",
  "/admin.php",
  "/config.php",
  "/.env",
  "/.git",
  "/xmlrpc.php",
];

/**
 * Advanced Bot Shielding Logic
 */
export function evaluateRequestSafety(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // 1. User-Agent Blocklist
  if (BLOCKED_AGENTS.some((agent) => ua.includes(agent))) {
    return {
      safe: false,
      action: "block",
      reason: `Blocked User-Agent: ${ua}`,
    };
  }

  // 2. Detection of Headless browsers via Sec-Fetch-Dest
  // Bots often lack specific headers
  const fetchDest = request.headers.get("sec-fetch-dest");
  if (!fetchDest && !ua.includes("Mozilla")) {
    return {
      safe: false,
      action: "tarpit",
      reason: "Missing fetch destination headers",
    };
  }

  // 3. Honeypot check for suspicious paths
  const pathname = request.nextUrl.pathname;
  if (SUSPICIOUS_PATHS.some((p) => pathname.startsWith(p))) {
    return {
      safe: false,
      action: "blacklist",
      reason: `Honeypot hit: ${pathname}`,
    };
  }

  return { safe: true };
}

/**
 * Tarpitting: Artificial delay to slow down scrapers
 */
export async function applyTarpit() {
  const delay = Math.floor(Math.random() * 5000) + 2000;
  await new Promise((resolve) => setTimeout(resolve, delay));
}
