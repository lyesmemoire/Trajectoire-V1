/**
 * Advanced Route Mapper with Session-Scoped Aliases
 * This allows us to mask the internal structure while keeping it maintainable.
 */
/**
 * Resolves a virtual public path to its internal equivalent.
 * Supports both static aliases and session-signed aliases.
 */
export declare function resolveInternalPath(publicPath: string, userId?: string): string | null;
/**
 * Returns the public-facing URL for an internal path.
 */
export declare function getPublicUrl(internalPath: string, userId?: string): string;
//# sourceMappingURL=route-mapper.d.ts.map