FROM node:22-alpine AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json

# Required by @prisma/client postinstall so the generated client
# retains the real application model types inside the Docker build.
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web

# Schema-valid build placeholders only.
# Real production secrets are injected at runtime.
RUN NEXT_PUBLIC_SUPABASE_URL=https://ci-placeholder.supabase.co \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-placeholder-anon-key \
    SUPABASE_SERVICE_ROLE_KEY=ci-placeholder-service-role-key \
    STRIPE_SECRET_KEY=sk_test_ci_placeholder \
    pnpm --dir apps/web build


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs \
    /app/apps/web/public \
    ./apps/web/public

COPY --from=builder --chown=nextjs:nodejs \
    /app/apps/web/.next/static \
    ./apps/web/.next/static

COPY --from=builder --chown=nextjs:nodejs \
    /app/apps/web/.next/standalone \
    ./

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health/liveness || exit 1

CMD ["node", "apps/web/server.js"]
