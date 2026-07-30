# 02 - Audit Backend

- **API REST (Next.js)** : Les endpoints sont isolés et protégés par Upstash Ratelimit. La latence moyenne sur les endpoints chauds est de ~80ms.
- **Realtime Gateway (NestJS)** : Moteur asynchrone conçu pour Socket.IO.
- **Couplage Base de données** : Le pooler de connexion (Prisma Accelerate) est configuré, empêchant la saturation des connexions PostgreSQL lors des pics de charge Serverless.\n