# 📖 Documentation des Variables d'Environnement

Ce document recense toutes les variables d'environnement utilisées par **Trajectoire**. Il est la source de vérité pour configurer un environnement local ou de production (Vercel).

## 1. Supabase (Authentification & Base de données)
- **`NEXT_PUBLIC_SUPABASE_URL`** / **`SUPABASE_URL`** : L'URL racine de votre projet Supabase.
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** / **`SUPABASE_ANON_KEY`** : Clé publique pour l'accès client (navigateur). Peut être exposée.
- **`SUPABASE_SERVICE_ROLE_KEY`** : Clé privée administrateur. **NE DOIT JAMAIS ÊTRE EXPOSÉE CÔTÉ CLIENT**. Utilisée par le backend pour contourner les RLS.

## 1.5. Base de données (Prisma)
- **`DATABASE_URL`** : URL de connexion via le Pooler de connexions Supabase (généralement port 6543, avec `?pgbouncer=true` conseillé pour Prisma).
- **`DIRECT_URL`** : URL de connexion directe à la DB (port 5432). Obligatoire pour exécuter les migrations (`prisma migrate`).

## 2. Redis (Cache & Rate Limiting)
- **`UPSTASH_REDIS_REST_URL`** : L'URL de l'API REST de votre base Redis (Upstash).
- **`UPSTASH_REDIS_REST_TOKEN`** : Le token d'accès REST.

## 3. Intelligence Artificielle (LLM)
- **`OPENAI_API_KEY`** : Clé API pour OpenAI (ou proxy compatible).
- **`OPENAI_BASE_URL`** : (Optionnel) Permet de rediriger vers un autre fournisseur (ex: Mistral API).
- **`OPENAI_MODEL`** : (Optionnel) Le modèle par défaut à utiliser (ex: `gpt-4o`, `mistral-large-latest`).
- **`MISTRAL_API_KEY`** : Clé API native Mistral.

## 4. Voix (Speech-to-Text & Text-to-Speech)
- **`DEEPGRAM_API_KEY`** : Pour la transcription audio temps réel (STT).
- **`ELEVENLABS_API_KEY`** : Pour la synthèse vocale (TTS).
- **`ELEVENLABS_VOICE_ID`** : L'ID de la voix de Clara/Victor configurée sur ElevenLabs.

## 5. Stripe (Paiements)
- *(À venir lors de la configuration Stripe)*
- **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** : Clé publique Stripe (client).
- **`STRIPE_SECRET_KEY`** : Clé privée Stripe (backend).
- **`STRIPE_WEBHOOK_SECRET`** : Clé de validation des webhooks Stripe.

## 6. Observabilité (Monitoring & Analytics)
- **`NEXT_PUBLIC_POSTHOG_KEY`** : Clé de projet PostHog pour l'analytics produit.
- **`NEXT_PUBLIC_POSTHOG_HOST`** : Serveur PostHog (ex: `https://eu.i.posthog.com`).
- **`SENTRY_DSN`** / **`NEXT_PUBLIC_SENTRY_DSN`** : DSN Sentry pour le tracking des erreurs frontend et backend.

## 7. Configuration Système
- **`NEXT_PUBLIC_APP_URL`** : URL publique du site (ex: `https://trajectoire.io`).
- **`LOG_LEVEL`** : Niveau de verbosité (`debug`, `info`, `warn`, `error`).
- **`NODE_ENV`** : `development` ou `production`.
