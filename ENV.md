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
- **`FRANCE_TRAVAIL_CLIENT_ID`** / **`FRANCE_TRAVAIL_CLIENT_SECRET`** : (Optionnel) Identifiants d'application France Travail (API Offres d'emploi v2, scope `api_offresdemploiv2 o2dsoffre`) pour le Radar des offres. Sans eux, la source France Travail n'est pas branchée.
- **`OPENAI_REALTIME_MODEL`** : (Optionnel) Modèle de l'entretien vocal (API Realtime GA). Défaut : `gpt-realtime-2.1` ; `gpt-realtime-1.5` est une alternative moins chère. Les modèles `gpt-4o-realtime-preview` sont arrêtés depuis mai 2026.
- **`MISTRAL_API_KEY`** : Clé API native Mistral.

## 4. Voix (Speech-to-Text & Text-to-Speech)
- **`DEEPGRAM_API_KEY`** : Pour la transcription audio temps réel (STT).
- **`ELEVENLABS_API_KEY`** : Pour la synthèse vocale (TTS).
- **`ELEVENLABS_VOICE_ID`** : L'ID de la voix de Clara/Victor configurée sur ElevenLabs.

## 5. Stripe (Paiements)
- **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** : Clé publique Stripe (client).
- **`STRIPE_SECRET_KEY`** : Clé privée Stripe (backend).
- **`STRIPE_WEBHOOK_SECRET`** : Clé de validation des webhooks Stripe (`whsec_...` ; en local, affiché par `pnpm stripe:listen`).
- **`STRIPE_PRICE_INTERVIEW_PACK`** : Identifiant du prix Stripe du Pack Entretien (paiement unique, 29 € TTC : 5 simulations valables 3 mois).
- **`STRIPE_PRO_PRICE_ID`** : Identifiant du prix Stripe de l'abonnement Pro (19 €/mois, sans essai, simulations illimitées).
- **`STRIPE_PRICE_EARLY`** *(optionnel)* : ancien prix Pro, encore reconnu par le webhook comme un abonnement Pro.
- Un identifiant de prix inconnu ne modifie jamais le plan de l'utilisateur (l'erreur est journalisée). Les montants et limites vivent dans `apps/web/src/lib/plans.ts`, pas dans ces variables.

## 6. Observabilité (Monitoring & Analytics)
- **`NEXT_PUBLIC_POSTHOG_KEY`** : Clé de projet PostHog pour l'analytics produit.
- **`NEXT_PUBLIC_POSTHOG_HOST`** : Serveur PostHog (ex: `https://eu.i.posthog.com`).
- **`SENTRY_DSN`** / **`NEXT_PUBLIC_SENTRY_DSN`** : DSN Sentry pour le tracking des erreurs frontend et backend.

## 7. Configuration Système
- **`NEXT_PUBLIC_APP_URL`** : URL publique du site (ex: `https://trajectoire.io`).
- **`NEXT_PUBLIC_ALLOWED_ORIGINS`** (optionnel) : autres origines autorisées à appeler l'API depuis un navigateur, séparées par des virgules, jokers permis (ex: `https://*.vercel.app`). Les écritures (`POST/PUT/PATCH/DELETE`) sur `/api/*` depuis une autre origine reçoivent un 403 (`middleware.ts`, `lib/security/origin-guard.ts`). À renseigner pour les prévisualisations et tout second domaine ; le webhook Stripe est exempté.
- **`CRON_SECRET`** : secret des tâches planifiées (`/api/cron/*`). Vercel l'envoie en `Authorization: Bearer …` aux tâches de `vercel.json` quand la variable existe. **À définir en production** : sans elle, le nettoyage quotidien des aperçus expirés (`/api/cron/cleanup-previews`, 3 h) répond 503 et ne tourne pas. Générer une valeur aléatoire longue (ex. `openssl rand -hex 32`).
- **`LOG_LEVEL`** : Niveau de verbosité (`debug`, `info`, `warn`, `error`).
- **`NODE_ENV`** : `development` ou `production`.
