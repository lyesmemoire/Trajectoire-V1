# SYNC_CERTIFICATION.md

## 1. Trigger PostgreSQL

**Statut**: ABSENT

**Preuves**:
- `supabase/migrations/20260707_candidate_brain_persistence.sql` - Contient triggers pour updated_at uniquement (lignes 149-163)
- `supabase/migrations/20260711_runtime_sessions_persistence.sql` - Contient triggers pour updated_at et closed_at uniquement (lignes 67-115)
- Aucun trigger sur `auth.users` pour synchroniser vers `public.User`

---

## 2. Edge Function

**Statut**: ABSENT

**Preuves**:
- Aucun dossier `supabase/functions/` trouvé
- Aucune Edge Function Supabase détectée

---

## 3. Webhook

**Statut**: ABSENT

**Preuves**:
- `app/api/stripe/webhook/` - Existe mais pour Stripe uniquement
- Aucun webhook Supabase Auth configuré
- Aucun handler pour auth events

---

## 4. Logique Applicative

**Statut**: PARTIEL

**Preuves**:
- `lib/users/infrastructure/repositories/prisma-user.repository.ts` - Existe (119 lignes)
- Méthode `save()` utilise `prisma.user.upsert()` (lignes 73-89)
- **Non appelé** pendant le flux signup
- Repository utilisé dans d'autres parties de l'app mais pas dans RegisterUserUseCase

---

## 5. Synchronisation Prisma

**Statut**: PARTIEL

**Preuves**:
- `lib/users/infrastructure/repositories/prisma-user.repository.ts` - Implémente UserRepositoryPort
- Cible `prisma.user` (table Prisma dans schema public)
- **Non intégré** dans RegisterUserUseCase qui utilise SupabaseUserRepository
- Deux repositories distincts pour deux tables différentes

---

## 6. Listener Auth

**Statut**: ABSENT

**Preuves**:
- Aucun `supabase.auth.onAuthStateChange()` trouvé dans le code
- Aucun listener pour events auth (signup, login, etc.)

---

## 7. Cron de Synchronisation

**Statut**: ABSENT

**Preuves**:
- `app/api/cron/check-costs/route.ts` - Existe pour coûts AI uniquement
- `app/api/cron/cleanup-transactions/route.ts` - Existe pour transactions
- Aucun cron de synchronisation users

---

## 8. Flux Réel Signup → public.User

```
Signup (app/(app)/auth/signup/page.tsx)
↓ POST /api/register
API Route (app/api/register/route.ts)
↓ RegisterUserUseCase.execute()
UseCase (lib/auth/application/use-cases/register-user.use-case.ts)
↓ authProvider.register()
SupabaseAuthAdapter.register() (lib/auth/infrastructure/adapters/supabase-auth.adapter.ts)
↓ supabase.auth.admin.createUser()
Supabase auth.users (CRÉÉ)
↓ userRepo.save()
SupabaseUserRepository.save() (lib/auth/infrastructure/repositories/supabase-user.repository.ts)
↓ supabase.from("users").upsert()
Table Supabase "users" (TENTÉ - échec probable car table n'existe pas)
↓ [BLOQUAGE]
public.User (Prisma) - JAMAIS CRÉÉ
```

**Statut de chaque étape**:

| Étape | Fichier | Fonction | Responsabilité | Statut |
|-------|---------|----------|----------------|--------|
| Signup UI | `app/(app)/auth/signup/page.tsx` | handleSignup() | Collecte données utilisateur | Fonctionnel |
| API Route | `app/api/register/route.ts` | POST() | Route vers UseCase | Fonctionnel |
| UseCase | `lib/auth/application/use-cases/register-user.use-case.ts` | execute() | Orchestration registration | Fonctionnel |
| Auth Adapter | `lib/auth/infrastructure/adapters/supabase-auth.adapter.ts` | register() | Création Supabase auth.users | Fonctionnel |
| Supabase Auth | Supabase | admin.createUser() | Création user auth | Fonctionnel |
| Repository | `lib/auth/infrastructure/repositories/supabase-user.repository.ts` | save() | Persistance user métier | **Partiel** |
| Prisma User | `prisma/schema.prisma` | Model User | Table public.User | **Absent** |

---

## Décision

**SYNC MISSING**

**Composant manquant pour synchronisation automatique**:

Un **trigger PostgreSQL** sur `auth.users` (INSERT) qui:
1. Se déclenche lors de la création d'un utilisateur dans Supabase Auth
2. Insère une ligne dans `public.User` via Prisma ou SQL direct
3. Copie les champs nécessaires (id, email, created_at, etc.)

OU

Une **Edge Function Supabase** hookée sur l'event `auth.user.created` qui:
1. Reçoit l'event de création user
2. Appelle une API route ou utilise Prisma client
3. Crée l'utilisateur dans `public.User`

OU

Une **logique applicative** dans RegisterUserUseCase qui:
1. Après authProvider.register()
2. Appelle explicitement PrismaUserRepository.save()
3. Crée l'utilisateur dans `public.User`
