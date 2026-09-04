# Multi-stage build for production optimization
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.15.9

# Copy dependency files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

# Install pnpm
RUN npm install -g pnpm@9.15.9

# Generate Prisma Client from the repository schema
RUN pnpm exec prisma generate --schema=prisma/schema.prisma

# Build API
WORKDIR /app/apps/api
RUN pnpm build

# Build Web with schema-valid CI placeholders.
# Real production secrets are injected at runtime, never baked into the image.
WORKDIR /app/apps/web
RUN NEXT_PUBLIC_SUPABASE_URL=https://ci-placeholder.supabase.co \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-placeholder-anon-key \
    SUPABASE_SERVICE_ROLE_KEY=ci-placeholder-service-role-key \
    STRIPE_SECRET_KEY=sk_test_ci_placeholder \
    pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy necessary files
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/next.config.js ./apps/web/next.config.js

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

USER nestjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "apps/api/dist/main.js"]
