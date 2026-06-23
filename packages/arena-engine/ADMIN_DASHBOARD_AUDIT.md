# Admin Dashboard Audit

## Authentication Security
**Status: PARTIAL**
- Les pages UI (`/admin/**`) sont protégées par `middleware.ts` qui vérifie les rôles `ADMIN_SUPPORT`, `ADMIN_PRODUCT`, `ADMIN_FOUNDER`.
- Les routes API critiques (ex: `ban-user`) font une validation propre via `getStrictUser()`.
- **FAILLE LATENTE** : `middleware.ts` ne protège **pas** `/api/admin` dans ses `PROTECTED_API_ROUTES`. Par conséquent, la sécurité repose entièrement sur le fait que chaque développeur n'oublie pas d'ajouter le check manuel dans chaque route. De plus, certaines routes (`threat-intel`, `predictive-truth`) utilisent un auth check différent (`getAuthenticatedUser` au lieu de `getStrictUser`).

## Data Integrity
**Status: FAIL**
Le dashboard est actuellement une illusion.
- `app/admin/page.tsx` utilise des KPIs statiques codés en dur (`dau: 142`, `revenue: "2,840€"`).
- Le composant `RealtimeActivityFeed` affiche des événements statiques (`EVENTS` array).
- Les routes `threat-intel` et `predictive-truth` renvoient des statistiques simulées en JSON.

## Source of Truth Consistency
**Status: PARTIAL**
- Le bon côté : la route `dashboard-metrics` lit les vraies données depuis `credit_ledger` et `ai_usage_stats` via Supabase.
- Le mauvais côté : l'utilisation persistante de Prisma pour d'autres features admin (`predictive-truth`), ce qui fragmente l'accès aux données. Le dashboard n'est pas aligné sur le Stripe ledger ni les PostgreSQL events.

## Permission Model
**Status: OK (mais fragile)**
Les rôles sont bien définis dans `profiles.role` et vérifiés côté serveur. L'utilisation d'une Service Role Key Supabase dans les routes admin est correcte pour contourner le RLS, car l'autorisation est faite au niveau applicatif.

## Audit Logging
**Status: FAIL**
C'est le risque le plus critique pour la production. 
Les routes `ban-user`, `unflag-user`, `restore-credits`, et `assign-org` exécutent des requêtes mutantes via la Service Role Key (ex: `update({ banned: true })` ou RPC `add_credits_atomic`). 
Cependant, **absolument aucune de ces actions n'est journalisée**. Un admin pourrait ajouter 500 crédits à un utilisateur, il n'y aurait aucune trace dans `audit_logs` ou `credit_ledger` (avec la mention explicite de l'admin responsable).

## Critical Risks
1. **Fake Data Illusion** : Les administrateurs en production croiront superviser la plateforme alors qu'ils regardent des données hardcodées.
2. **Zero Audit Trail** : Opérations destructrices et sensibles (crédits, bans) sans aucune traçabilité, rendant l'investigation interne impossible en cas d'abus ou d'erreur.
3. **Middleware Gap** : L'oubli de `/api/admin` dans le middleware expose la plateforme à une grave fuite de données au prochain ajout de route non protégée.

## Recommendations
1. **Purger les Mocks** : Supprimer toutes les données statiques du frontend et de l'API. Brancher le `RealtimeActivityFeed` sur un real-time listener Supabase connecté à `audit_logs` (ou events).
2. **Forcer l'Audit Trail** : Ajouter une insertion obligatoire dans `audit_logs` pour toute route POST admin, en stockant `admin_id`, `action`, et `target_user_id`. (Même chose pour `credit_ledger` lors d'un restore).
3. **Patch Middleware** : Ajouter `/api/admin` dans le tableau `PROTECTED_API_ROUTES` de `middleware.ts`.
4. **Standardiser l'Auth** : Remplacer `getAuthenticatedUser()` par `getStrictUser()` partout dans le dossier `/api/admin` pour garantir la validation unifiée contre Supabase.
