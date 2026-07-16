# audit/server-client-boundary.md

## Goal

Detect any illegal imports or usage that cross the server‑client boundary in a Next.js 15 codebase.

## Scope

- Files under `app/` that are marked with `"use client"`.
- Server‑only modules (`fs`, `path`, `crypto` (node version), `prisma`, `@prisma/client`, `@upstash/redis`, etc.).
- Environment variable access: `process.env` should only expose variables **without** the `NEXT_PUBLIC_` prefix on the client.

## Methodology

1. **Static analysis** using a custom script `scripts/audit-boundary.ts` that scans the file tree.
2. **Regex patterns** to flag:
   ```ts
   /import\s+.*\b(fs|path|crypto|prisma|@prisma\/client|@upstash)\b/;
   /process\.env\.(?!NEXT_PUBLIC_)/;
   ```
3. Report each violation with file path and line number.
4. Generate a markdown summary (`audit/server-client-boundary.md`).

## Example Violation

```text
app/components/ClientOnlyComponent.tsx:12: import { prisma } from '@/lib/prisma'; // ❌ server import in client component
```

## Fix Recommendations

- Move server‑only code to API routes or `lib/server/`.
- Wrap environment accesses in a utility that only returns whitelisted vars.
- Add `"use client"` at the top of truly client‑side files to make linting explicit.

---

> **Note**: Run `npm run audit:boundary` after adding the script to enforce continuously.
