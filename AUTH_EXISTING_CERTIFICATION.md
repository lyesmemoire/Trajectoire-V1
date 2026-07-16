# AUTH_EXISTING_CERTIFICATION.md

## 1. Architecture

**Clean Architecture respectée**: OUI

**Preuves**:
- `lib/auth/domain/` - Contient aggregates, value-objects, events
- `lib/auth/application/` - Contient use-cases, queries
- `lib/auth/infrastructure/` - Contient repositories, adapters, mappers
- `lib/auth/presentation/` - Contient presenters
- `lib/auth/ports/` - Contient interfaces (gateways, repositories)

**Dépendances correctes**: OUI
- Domain ne dépend d'aucune couche externe
- Application dépend de Domain et Ports
- Infrastructure dépend de Domain et Ports
- Presentation dépend de Application

**Fichiers observés**:
- `lib/auth/AuthModule.ts` - Enregistrement DI container
- `lib/auth/domain/aggregates/user.aggregate.ts` - 288 lignes
- `lib/auth/application/use-cases/register-user.use-case.ts` - 72 lignes
- `lib/auth/infrastructure/repositories/supabase-user.repository.ts` - 121 lignes

---

## 2. RegisterUserUseCase

**Existe**: OUI
- Fichier: `lib/auth/application/use-cases/register-user.use-case.ts`

**Complet**: OUI
- Dépendances injectées: AuthenticationProviderPort, UserRepositoryPort, IdGenerator, Clock
- Validation email via Email VO
- Check existence via userRepo.existsByEmail()
- Register via authProvider.register()
- Create UserAggregate via UserAggregate.create()
- Save via userRepo.save()

**Compilable**: OUI
- TypeScript compile sans erreur (vérifié avec `pnpm typecheck`)

**Dépendances manquantes**: AUCUNE
- Toutes les dépendances sont injectées via constructor
- Ports définis dans `lib/auth/ports/`

---

## 3. Repository

**UserRepositoryPort interface**: OUI
- Fichier: `lib/auth/ports/repositories/UserRepositoryPort.ts`
- Méthodes: save(), findById(), findByEmail(), delete(), existsByEmail()

**Implémentation Supabase**: OUI
- Fichier: `lib/auth/infrastructure/repositories/supabase-user.repository.ts`
- Utilise `createAdminClientSupabase()`
- Cible table `users` dans Supabase
- Implémente toutes les méthodes du port

**Implémentation Prisma**: NON
- Aucun repository Prisma pour User trouvé dans `lib/auth/infrastructure/repositories/`

**Injections**: OUI
- Enregistré dans `lib/auth/AuthModule.ts`
- Résolu via `appContainer.resolve<UserRepositoryPort>("UserRepositoryPort")`

---

## 4. API Routes

| Route | Statut | Preuve |
|-------|--------|--------|
| `/api/register` | **EXISTE** | `app/api/register/route.ts` - 70 lignes, utilise RegisterUserUseCase |
| `/api/auth/*` | **ABSENT** | Aucun dossier `app/api/auth/` |
| `/api/login` | **ABSENT** | Aucun fichier trouvé |
| `/api/logout` | **ABSENT** | Aucun fichier trouvé |
| `/api/session` | **ABSENT** | Aucun fichier trouvé |
| `/api/reset-password` | **ABSENT** | Aucun fichier trouvé |
| `/api/verify-email` | **ABSENT** | Aucun fichier trouvé |

---

## 5. Pages UI

| Page | Statut | Backend utilisé | Mocks |
|------|--------|-----------------|-------|
| `login` | **COMPILE** | Supabase client direct (`supabase.auth.signInWithPassword`) | Non |
| `signup` | **COMPILE** | API `/api/register` + Supabase OAuth | Non |
| `forgot-password` | **COMPILE** | Supabase client direct (`supabase.auth.resetPasswordForEmail`) | Non |
| `reset-password` | **COMPILE** | Supabase client direct (`supabase.auth.updateUser`) | Non |
| `callback` | **COMPILE** | Supabase server client (`supabase.auth.verifyOtp`, `exchangeCodeForSession`) | Non |

**Preuves**:
- `app/(app)/auth/login/page.tsx` - 461 lignes, import `@/lib/supabase/client`
- `app/(app)/auth/signup/page.tsx` - 626 lignes, fetch `/api/register`
- `app/(app)/auth/forgot-password/page.tsx` - 188 lignes, import `@/lib/supabase/client`
- `app/(app)/auth/reset-password/reset-password-form.tsx` - 230 lignes, import `@/lib/supabase/client`
- `app/(app)/auth/callback/route.ts` - 60 lignes, import `@/lib/supabase/server`

---

## 6. Flux Réel d'Inscription

**Trace observée**:

```
Signup Page (app/(app)/auth/signup/page.tsx)
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
Prisma User (public.User) (TENTÉ)
↓ [BLOQUAGE]
Email (Supabase envoie automatiquement)
↓ [BLOQUAGE]
Session (non créée par le flux)
```

**Point d'interruption**: 
- SupabaseUserRepository cible table `users` dans Supabase
- Prisma schema définit model `User` dans schema `public`
- Aucune synchronisation entre Supabase auth.users et Prisma public.User
- Le flux crée l'utilisateur dans Supabase auth.users mais échoue probablement à le persister dans public.User car les tables sont différentes

---

## 7. Authentification

**Supabase Auth utilisé**: OUI
- Preuves:
  - `@supabase/ssr` installé (package.json ligne 95)
  - `@supabase/supabase-js` installé (package.json ligne 96)
  - `lib/supabase/client.ts` - Client Supabase
  - `lib/supabase/server.ts` - Server client Supabase
  - `lib/supabase/admin.ts` - Admin client Supabase
  - Pages UI utilisent `supabase.auth.*` directement
  - Middleware utilise `createServerClient` de `@supabase/ssr`

**NextAuth/Auth.js utilisé**: NON
- Preuves:
  - `next-auth@5.0.0-beta.25` installé (package.json ligne 121)
  - Aucun fichier de configuration NextAuth trouvé
  - Aucune utilisation de NextAuth dans le code
  - **Code mort**: next-auth installé mais non utilisé

**Double authentification**: NON
- Uniquement Supabase Auth utilisé

---

## 8. Synchronisation auth.users ↔ public.User

**Synchronisation**: ABSENTE

**Preuves**:
- Aucun trigger dans `supabase/migrations/` (seulement 2 migrations pour candidate_brain et runtime_sessions)
- Aucun webhook configuré
- Aucun code de synchronisation trouvé
- SupabaseUserRepository cible table `users` Supabase (ligne 21: `this.supabase.from("users")`)
- Prisma schema définit model `User` dans schema `public` (ligne 46: `@@schema("public")`)
- Les deux tables sont distinctes et non synchronisées

---

## 9. Build

**Compilation module Auth**: RÉUSSIE

**Preuve**:
- `pnpm typecheck` exécuté avec succès (exit code 0)
- Aucune erreur TypeScript dans lib/auth

---

## 10. Décision

**AUTH-01 BLOCKED**

**Blocages réels**:

1. **Synchronisation manquante**: Supabase auth.users et Prisma public.User ne sont pas synchronisés
2. **API routes manquantes**: /api/login, /api/logout, /api/session, /api/reset-password, /api/verify-email
3. **Code mort**: next-auth installé mais non utilisé
4. **Incohérence repository**: SupabaseUserRepository cible table Supabase `users` mais Prisma définit model `User` dans schema `public`
5. **Flux d'inscription incomplet**: Pas de création de session après registration
6. **Pages UI bypassent UseCase**: Login, forgot-password, reset-password utilisent Supabase client direct au lieu des UseCase
