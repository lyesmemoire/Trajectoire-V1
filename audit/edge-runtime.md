# audit/edge-runtime.md

## Goal

Detect any usage of Node‑only APIs (fs, path, crypto _from Node_, process.env server‑only vars, Prisma client, Upstash Redis, etc.) inside Edge‑runtime routes.

## Scope

- Files under `app/api/**/route.ts` that export `runtime = 'edge'` or are placed in the `edge/` folder.
- Look for imports from `fs`, `path`, `crypto` (Node version), `child_process`, `prisma`, `@upstash/redis`.
- Ensure environment variables accessed are safe for Edge (no secret values).

## Methodology

1. Static scan using a simple script `scripts/audit-edge.ts` that parses the AST and flags prohibited imports.
2. Regex fallback for quick checks.
3. Generate a markdown report listing file, line, and offending import.

## Example Violation

```text
app/api/health/db/route.ts:3: import { prisma } from '@/lib/prisma'; // ❌ server‑only import in Edge route
```

## Fix Recommendations

- Move server‑only logic to a standard (Node) API route.
- Use edge‑compatible libraries (e.g., `@upstash/redis` provides an Edge client).
- Wrap secret env vars in a server‑only helper.

---

> **Note**: Run `npm run audit:edge` after adding the script to enforce continuously.
