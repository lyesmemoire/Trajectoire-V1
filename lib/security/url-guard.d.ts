/**
 * SSRF Protection: Validates and sanitizes URLs before fetching.
 * Asynchronous to resolve DNS and prevent DNS Rebinding / bypasses via DNS records.
 */
export declare function validateJobUrl(inputUrl: string | undefined): Promise<boolean>;
//# sourceMappingURL=url-guard.d.ts.map