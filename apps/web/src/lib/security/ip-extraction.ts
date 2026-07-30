import crypto from "crypto"

export function getReliableIP(req: Request): string {
  // Priorité : headers proxy > IP directe
  const ip = 
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  
  return ip
}

export function generateFingerprint(req: Request): string {
  const ip = getReliableIP(req)
  const userAgent = req.headers.get("user-agent") || "unknown"
  const acceptLanguage = req.headers.get("accept-language") || "unknown"
  const secCHUA = req.headers.get("sec-ch-ua") || "unknown"

  const data = `${ip}:${userAgent}:${acceptLanguage}:${secCHUA}`
  return crypto.createHash("sha256").update(data).digest("hex").substring(0, 16)
}
