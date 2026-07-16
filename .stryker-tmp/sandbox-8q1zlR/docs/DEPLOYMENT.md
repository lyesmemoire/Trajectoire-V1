# Deployment Guide

## Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Upstash account (Redis + QStash)
- Stripe account
- Sentry account (optional)
- PostHog account (optional)

## Environment Variables

### Required Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Providers
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
MISTRAL_API_KEY=your_mistral_api_key
GROQ_API_KEY=your_groq_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Upstash
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
QSTASH_URL=your_qstash_url
QSTASH_TOKEN=your_qstash_token

# Application
NEXT_PUBLIC_APP_URL=https://your-app.com
NODE_ENV=production
```

### Optional Variables

```env
# Sentry
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_public_sentry_dsn
NEXT_PUBLIC_SENTRY_ENV=production

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Feature Flags
USE_PRISMA_PROMPTS=true
USE_PRISMA_AUDIT=true
USE_PRISMA_AI_USAGE=true
USE_ELEVENLABS=true
USE_DEEPGRAM=true
VOICE_DEBUG=false
```

## Build Process

```bash
# Install dependencies
npm ci

# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

## Deployment Platforms

### Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

```bash
# Local build for Vercel
vercel build
vercel --prod
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build Docker image
docker build -t studioentretien .

# Run container
docker run -p 3000:3000 --env-file .env studioentretien
```

## Database Migrations

```bash
# Generate migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Health Checks

After deployment, verify health endpoints:

```bash
# Full health check
curl https://your-app.com/api/health

# Readiness probe
curl https://your-app.com/api/health/readiness

# Liveness probe
curl https://your-app.com/api/health/liveness
```

## Monitoring

### Sentry

Configure Sentry in `sentry.server.config.ts` and `sentry.client.config.ts`. Errors will be automatically reported to Sentry dashboard.

### PostHog

Configure PostHog in `providers/posthog-provider.tsx`. User events will be tracked in PostHog dashboard.

### Performance Metrics

Performance metrics are tracked via `lib/core/observability/performance`. View metrics in your monitoring dashboard.

## Background Workers

Background jobs are processed via Upstash QStash. Ensure QStash is configured with proper credentials.

Job types:
- `generate_pdf` - PDF generation
- `generate_docx` - DOCX generation
- `send_email` - Email sending
- `send_recovery_email` - Recovery email
- `cleanup_expired_transactions` - Transaction cleanup
- `generate_embeddings` - Embedding generation
- `sync_stripe_subscription` - Stripe subscription sync
- `process_webhook` - Webhook processing

## Cache Strategy

Cache is automatically configured based on environment:
- Production: Upstash Redis
- Development: In-memory cache

Cache keys are defined in `lib/cache/cache-keys.ts`.

## Rollback Procedure

### Vercel

1. Go to Vercel dashboard
2. Select your project
3. Go to Deployments
4. Click on previous deployment
5. Click "Promote to Production"

### Docker

```bash
# Tag previous version
docker tag studioentretien:latest studioentretien:previous

# Rollback
docker run -p 3000:3000 --env-file .env studioentretien:previous
```

## Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm ci
npm run build
```

### Database Connection Issues

- Verify Supabase credentials
- Check network connectivity
- Verify database is online

### Redis Connection Issues

- Verify Upstash Redis credentials
- Check network connectivity
- Verify Redis instance is online

### Background Job Failures

- Check QStash logs in Upstash dashboard
- Verify QStash credentials
- Check job processor logs

## Security Checklist

- [ ] All environment variables set via Configuration Provider
- [ ] No `process.env` access in main application code
- [ ] Sentry configured for error tracking
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] HTTPS enabled in production
- [ ] API keys rotated regularly
- [ ] Database backups enabled
- [ ] Webhook secrets configured
