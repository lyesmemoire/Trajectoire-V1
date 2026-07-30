# 01 - Architecture d'Entreprise

L'audit architectural a validé une structure monorepo (PNPM) séparant strictement les domaines d'exécution.
- **Frontend** : Next.js 15
- **Backend / API** : Next.js API Routes (Serverless) + NestJS (WebSockets Gateway)
- **Base de Données** : PostgreSQL (Supabase) + Prisma
- **Cache / Ratelimit** : Upstash Redis

*SPOF Identifiés* : Dépendance au LLM Mistral (pas de fallback automatique implémenté en dur, nécessite un adapter multi-modèles).\n