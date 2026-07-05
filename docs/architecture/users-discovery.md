# Discovery: Domaine Users

Ce document recense l'état actuel de la gestion des utilisateurs (Users) avant sa migration vers le standard "Golden Domain" (Sprint 3.4.2).

## 🗺️ Cartographie Actuelle

### 1. Routes API
*   **`app/api/register/route.ts`** : Route tentaculaire. Mélange la validation HTTP, le rate limiting Redis, la validation d'email via Abstract API, la création d'utilisateur dans Supabase Auth, l'insertion dans la table `profiles`, la gestion de `ip_activity`, la sauvegarde du `user_devices`, l'évaluation de fraude (`evaluateFraud`), et les logs d'audit.
*   **`app/api/user/export-data/route.ts`** : Route pour la RGPD. Appelle `usersService.exportUserData()`.
*   **`app/api/user/set-cv-editor-completed/route.ts`** : Met à jour directement la table `profiles` via Supabase client, et pose un cookie.

### 2. Services & Repositories (`lib/users/`)
*   **`users.repository.ts`** : Contient tous les appels Prisma directs vers `prisma.user` (findUnique, update, create, delete, count). Gère également l'export massif de données (inclut les relations Prisma vers CareerProfile, BehavioralPattern, InterviewSession).
*   **`users.service.ts`** : Service legacy. Expose des méthodes comme `getUserById`, `updateUserProfile`, `deductAiCredit`, `exportUserData`. Retourne des `Result` (ancien format) mais ne suit pas le pattern UseCase.

### 3. Authentification & Supabase Auth (`lib/auth/`)
*   **`get-user.ts`** : Expose `getStrictUser()` qui instancie le client Supabase et appelle `supabase.auth.getUser()`.
*   **`session-logic.ts`** : Similaire, centralise certaines règles d'authentification.
*   L'utilisation de `createServerClient()` est dispersée dans presque tous les services de l'application (Interview, CV, Billing, etc.).

## 🔥 Hotspots & Dette Technique

1.  **Couplage fort avec Supabase Auth** : L'infrastructure d'authentification de Supabase fuit partout. Le domaine ne contrôle pas l'identité, il se contente de lire le token JWT via Supabase.
2.  **`app/api/register` est un god-object** : Cette route gère 6 responsabilités différentes. Elle devrait être scindée (Validation -> UseCase -> Events).
3.  **Fuite de la base de données** : `set-cv-editor-completed` attaque directement la table `profiles` depuis le contrôleur HTTP.
4.  **Dépendances circulaires (Export Data)** : `users.repository.ts` importe Prisma et fait un include géant sur tous les autres domaines (Career, Interview, AI) pour construire l'export de données, violant le principe d'isolation des domaines.

## 🔗 Dépendances & Impacts

*   **Billing** : L'accès aux crédits AI (`monthlyAiCredits`) est actuellement logé dans le modèle Prisma `User`.
*   **Security/Fraud** : La création d'un utilisateur déclenche une évaluation de fraude synchrone.
*   **CV** : La route `set-cv-editor-completed` lie étroitement le statut de l'utilisateur à son onboarding CV.

## 🎯 Objectifs de la Migration

1.  **Créer des UseCases atomiques** : `RegisterUserUseCase`, `ExportUserDataUseCase`, `CompleteCvEditorUseCase`.
2.  **Isoler l'authentification** : Créer un `AuthProviderPort` pour abstraire `supabase.auth`.
3.  **Nettoyer les repositories** : Créer un `UserRepositoryPort` agnostique, et implémenter `PrismaUserRepository` et `SupabaseAuthRepository`.
4.  **Isoler via les Domain Events** : L'évaluation de fraude et l'audit log après l'inscription doivent devenir des écouteurs d'un événement `UserRegistered`, plutôt que d'être hardcodés dans le UseCase d'inscription.
