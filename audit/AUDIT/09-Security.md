# 09 - Audit Sécurité

- **OWASP** : Protection XSS/CSRF native via Next.js.
- **RLS** : Row Level Security active (ex: `auth.uid() = user_id`).
- **Secrets** : Strictement isolés (.env).
- **SQL Injection** : Impossible grâce à Prisma ORM.
- **Rate Limit** : Upstash (10 req/10s sur les endpoints payants).
- **Statut** : GO.\n