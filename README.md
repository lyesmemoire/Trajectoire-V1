# Trajectoire / StudioEntretien

> Plateforme SaaS française d'aide à la préparation d'entretiens d'embauche et d'optimisation de CV pilotée par IA.

## 📋 Présentation

StudioEntretien est un simulateur d'entretiens d'embauche qui réagit comme un vrai recruteur grâce à l'intelligence artificielle. La plateforme propose :

- **Simulation d'entretiens vocaux** avec des personas de recruteurs réalistes
- **Optimisation de CV** avec analyse ATS (Applicant Tracking System)
- **Feedback détaillé** sur les compétences, la clarté et la confiance
- **Parcours personnalisé** adapté au niveau (Junior/Senior)

## 🛠️ Stack technique

| Couche | Technologies |
|--------|--------------|
| **Frontend** | Next.js 15.5, React 19, TailwindCSS 3.4, Framer Motion, Zustand |
| **Backend API** | Next.js Route Handlers, NestJS 11 |
| **Authentification** | Supabase (SSR) + NextAuth v5 beta |
| **Base de données** | PostgreSQL via Prisma 6.1 (multi-schéma) |
| **IA/ML** | Mistral, OpenAI, Google Generative AI, ElevenLabs (TTS), Deepgram (ASR) |
| **Paiements** | Stripe (checkout + webhooks + crons) |
| **Cache/Rate-limit** | Upstash Redis / ioredis |
| **Observabilité** | Sentry, PostHog, OpenTelemetry, prom-client |
| **Streaming temps réel** | Fastify + WebSocket, Socket.io |
| **Tests** | Vitest, Playwright (E2E), Jest |
| **Package manager** | pnpm 9.15.9 (workspaces) |

## 📦 Prérequis

- **Node.js** >= 18
- **pnpm** >= 8
- **PostgreSQL** (via Supabase ou local)
- **Redis** (via Upstash ou local)

## 🚀 Installation

```bash
# Cloner le dépôt
git clone <repository-url>
cd Trajectoire

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés
```

## 🔑 Variables d'environnement

Les variables sont classées par priorité d'installation :

| Priorité | Variable | Pourquoi en premier |
|----------|----------|---------------------|
| 🔴 1 | NEXT_PUBLIC_API_URL | Critique : l'app ne sait pas où taper sans ça |
| 🔴 2 | NEXT_PUBLIC_SUPABASE_URL | Critique : auth ne marche pas sans |
| 🔴 3 | NEXT_PUBLIC_SUPABASE_ANON_KEY | Critique : idem |
| 🔴 4 | SUPABASE_SERVICE_ROLE_KEY | Critique : accès admin à la base |
| 🔴 5 | DATABASE_URL | Critique : connexion à la base de données |
| 🔴 6 | DIRECT_URL | Critique : connexion directe Prisma |
| 🔴 7 | NEXTAUTH_SECRET | Critique : chiffrement des sessions |
| 🔴 8 | NEXTAUTH_URL | Critique : callback URL auth |
| 🟠 9 | NEXT_PUBLIC_GATEWAY_URL | Important : pour le WebSocket |
| 🟠 10 | NEXT_PUBLIC_WS_URL | Important : pour les interviews |
| 🟡 11 | NEXT_PUBLIC_POSTHOG_KEY | Optionnel : tracking, peut attendre |
| 🟡 12 | NEXT_PUBLIC_POSTHOG_HOST | Optionnel : idem |
| 🟡 13 | OPENAI_API_KEY | Optionnel : IA LLM |
| 🟡 14 | MISTRAL_API_KEY | Optionnel : IA LLM alternatif |
| 🟡 15 | GOOGLE_GENERATIVE_AI_API_KEY | Optionnel : IA LLM alternatif |
| 🟡 16 | ELEVENLABS_API_KEY | Optionnel : synthèse vocale |
| 🟡 17 | DEEPGRAM_API_KEY | Optionnel : transcription vocale |
| 🟡 18 | STRIPE_SECRET_KEY | Optionnel : paiements |
| 🟡 19 | STRIPE_WEBHOOK_SECRET | Optionnel : webhooks Stripe |
| 🟡 20 | NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Optionnel : paiements frontend |
| 🟡 21 | UPSTASH_REDIS_REST_URL | Optionnel : cache/rate-limit |
| 🟡 22 | UPSTASH_REDIS_REST_TOKEN | Optionnel : cache/rate-limit |
| 🟡 23 | SENTRY_DSN | Optionnel : monitoring erreurs |

## 🏃 Lancement

### Application web principale

```bash
# Mode développement
pnpm dev

# Build production
pnpm build:web

# Démarrage production
pnpm start
```

### Moteur d'entretien vocal (backend)

```bash
# Gateway temps réel (Fastify + WebSocket)
pnpm dev:gateway

# API NestJS (orchestrateur)
cd apps/api
pnpm start:dev
```

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests E2E (Playwright)
pnpm test:e2e

# Couverture de tests
pnpm test:coverage
```

## 📚 Structure du projet

```
c:\Trajectoire/
├── app/                    # Application Next.js principale
├── apps/                   # Sous-applications backend
│   ├── api/               # Backend NestJS
│   ├── realtime-gateway/  # Backend Fastify/WebSocket
│   └── web/               # Application web séparée
├── core/                   # Moteurs d'exécution (p5, p6, p7)
├── lib/                    # Bibliothèques partagées
├── prisma/                 # Schéma de base de données
├── supabase/               # Migrations Supabase
├── src/                    # Sous-systèmes runtime
└── tests/                  # Tests E2E et unitaires
```

## 🔧 Scripts utiles

```bash
pnpm lint              # Linter le code
pnpm lint:fix          # Corriger automatiquement les erreurs lint
pnpm typecheck         # Vérifier les types TypeScript
pnpm db:push           # Pousser le schéma Prisma
pnpm db:migrate        # Exécuter les migrations Prisma
pnpm db:studio         # Ouvrir Prisma Studio
```

## 📖 Documentation

- [Architecture technique](./ARCHITECTURE.md)
- [État des lieux & Roadmap](./ETAT_DES_LIEUX_ET_ROADMAP.md)
- [Audit complet](./AUDIT_COMPLET_2026.md)

## 🤝 Contribution

Ce projet est en développement actif. Pour contribuer :

1. Forker le projet
2. Créer une branche (`git checkout -b feature/ma-fonction`)
3. Commiter (`git commit -m 'Ajout de ma fonction'`)
4. Pusher (`git push origin feature/ma-fonction`)
5. Ouvrir une Pull Request

## 📄 Licence

UNLICENSED

---

**Développé avec ❤️ pour les candidats francophones**
