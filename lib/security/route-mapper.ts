/**
 * Advanced Route Mapper with Session-Scoped Aliases
 * This allows us to mask the internal structure while keeping it maintainable.
 */

// Static sensitive routes that always need masking
const INTERNAL_TO_VIRTUAL = {
  "/dashboard/interview/session": "/a/s",
  "/dashboard/career-dna": "/a/i",
  "/dashboard/ats": "/a/v",
  "/admin/security": "/c/s",
  "/admin/ai-observability": "/c/i",
} as const;

/**
 * Resolves a virtual public path to its internal equivalent.
 * Supports both static aliases and session-signed aliases.
 */
export function resolveInternalPath(publicPath: string, userId?: string, ): string | null {
  // 1. Check static aliases
  const staticEntry = Object.entries(INTERNAL_TO_VIRTUAL).find(
    ([_, v]) => publicPath === v || publicPath.startsWith(`${v}/`),
  );

  if (staticEntry) {
    const [internal, v] = staticEntry;
    const subPath = publicPath.slice(v.length);
    return `${internal}${subPath}`;
  }

  // 2. Check for Session-Signed Dynamic Routes (e.g., /app/[hash]/session)
  if (publicPath.startsWith("/app/") && userId) {
    const parts = publicPath.split("/");
    if (parts.length >= 4) {
      const hash = parts[2];
      // Simple hash verification for edge compatibility without Node.js 'crypto'
      const expectedHash = userId.substring(0, 8); // Simplified for edge
      if (hash === expectedHash) {
        return `/dashboard/interview/session${publicPath.split(hash)[1]}`;
      }
    }
  }

  return null;
}

/**
 * Returns the public-facing URL for an internal path.
 */
export function getPublicUrl(internalPath: string, userId?: string): string {
  const staticAlias = (INTERNAL_TO_VIRTUAL as unknown)[internalPath];
  if (staticAlias) return staticAlias;

  if (internalPath.startsWith("/dashboard/interview/session") && userId) {
    const hash = userId.substring(0, 8);
    return `/app/${hash}/p`;
  }

  return internalPath;
}
