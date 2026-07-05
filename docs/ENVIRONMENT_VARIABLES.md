# Environment Variables

## Configuration Providers

All environment variables are accessed through centralized Configuration Providers:
- `envServer` - Server-only environment variables (lib/env.server.ts)
- `envClient` - Public environment variables (lib/env.client.ts)

## Server Variables (envServer)

### Supabase

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | string | Yes | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | string | Yes | Supabase anonymous key |
| SUPABASE_SERVICE_ROLE_KEY | string | Yes | Supabase service role key |

### AI Providers

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| OPENAI_API_KEY | string | Yes | OpenAI API key |
| ANTHROPIC_API_KEY | string | No | Anthropic API key |
| MISTRAL_API_KEY | string | No | Mistral API key |
| GROQ_API_KEY | string | No | Groq API key |
| MISTRAL_MODEL | string | No | Mistral model name |

### Stripe

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| STRIPE_SECRET_KEY | string | Yes | Stripe secret key |
| STRIPE_WEBHOOK_SECRET | string | Yes | Stripe webhook secret |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | string | Yes | Stripe publishable key |

### Upstash

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| UPSTASH_REDIS_REST_URL | string | Yes | Upstash Redis REST URL |
| UPSTASH_REDIS_REST_TOKEN | string | Yes | Upstash Redis REST token |
| QSTASH_URL | string | No | Upstash QStash URL |
| QSTASH_TOKEN | string | No | Upstash QStash token |

### Application

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| NEXT_PUBLIC_APP_URL | string | Yes | Application URL |
| NODE_ENV | string | Yes | Node environment (development/production) |
| FRONTEND_URL | string | No | Frontend URL |

### Feature Flags

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| USE_PRISMA_PROMPTS | boolean | true | Use Prisma for prompts |
| USE_PRISMA_AUDIT | boolean | true | Use Prisma for audit |
| USE_PRISMA_AI_USAGE | boolean | true | Use Prisma for AI usage |
| USE_ELEVENLABS | boolean | true | Use ElevenLabs for TTS |
| USE_DEEPGRAM | boolean | true | Use Deepgram for STT |
| VOICE_DEBUG | boolean | false | Enable voice debugging |

### Monitoring

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| SENTRY_DSN | string | No | Sentry DSN for server-side |

### Other

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| STORE | string | No | Store configuration |
| RESEND_API_KEY | string | No | Resend API key |

## Client Variables (envClient)

### Sentry

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| NEXT_PUBLIC_SENTRY_DSN | string | No | Sentry DSN for client-side |
| NEXT_PUBLIC_SENTRY_ENV | string | No | Sentry environment |

### PostHog

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| NEXT_PUBLIC_POSTHOG_KEY | string | No | PostHog project key |
| NEXT_PUBLIC_POSTHOG_HOST | string | No | PostHog host URL |

### Supabase

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | string | Yes | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | string | Yes | Supabase anonymous key |

### Application

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| NEXT_PUBLIC_APP_URL | string | Yes | Application URL |

## Validation

All environment variables are validated using Zod schemas. Invalid configurations will fail at startup.

## Security

- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate API keys regularly
- Use service role keys only on the server
- Use anonymous keys for client-side access
