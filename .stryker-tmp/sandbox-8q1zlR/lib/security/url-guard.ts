// @ts-nocheck
import dns from "dns";
import { promisify } from "util";

const lookupAsync = promisify(dns.lookup);

const FORBIDDEN_HOSTS = ["localhost", "metadata.google.internal"];

const FORBIDDEN_PROTOCOLS = ["file:", "ftp:", "gopher:", "mailto:"];

function isPrivateIP(ip: string): boolean {
  // IPv4 mapping check
  const parts = ip.split(".");
  if (parts.length === 4) {
    const num = parseInt(parts[0]!, 10);
    const num2 = parseInt(parts[1]!, 10);
    if (
      num === 127 || // 127.0.0.0/8
      num === 10 || // 10.0.0.0/8
      (num === 172 && num2 >= 16 && num2 <= 31) || // 172.16.0.0/12
      (num === 192 && num2 === 168) || // 192.168.0.0/16
      (num === 169 && num2 === 254) || // 169.254.0.0/16
      num === 0 // 0.0.0.0/8
    ) {
      return true;
    }
  }
  // Simplified IPv6 block
  if (ip.includes(":")) {
    if (
      ip === "::1" ||
      ip === "::" ||
      ip.toLowerCase().startsWith("fc") ||
      ip.toLowerCase().startsWith("fd") ||
      ip.toLowerCase().startsWith("fe80")
    ) {
      return true;
    }
  }
  return false;
}

/**
 * SSRF Protection: Validates and sanitizes URLs before fetching.
 * Asynchronous to resolve DNS and prevent DNS Rebinding / bypasses via DNS records.
 */
export async function validateJobUrl(inputUrl: string | undefined): Promise<boolean> {
  if (!inputUrl) return false;
  try {
    const url = new URL(inputUrl);

    // 1. Check Protocol
    if (FORBIDDEN_PROTOCOLS.includes(url.protocol)) {
      return false;
    }

    // 2. Check for internal IP ranges / localhosts via explicit strings
    const hostname = url.hostname.toLowerCase();
    if (
      FORBIDDEN_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`))
    ) {
      return false;
    }

    // 3. DNS Lookup to prevent DNS resolution bypasses
    const { address } = await lookupAsync(hostname);
    if (isPrivateIP(address)) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}
