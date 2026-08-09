# AUDIT-PROD-001

**Mission:** Audit du parcours utilisateur complet de bout en bout  
**Date:** 5 août 2026  
**Auditeur:** Lead Product Manager + QA Lead  
**Référence:** Scénario complet Landing → Dashboard → Premium

---

## SCÉNARIO AUDITÉ

```
Landing
↓
Upload CV
↓
Analyse ATS Preview
↓
Signup
↓
Confirmation Email
↓
Claim de la Preview
↓
Welcome
↓
Onboarding
↓
Dashboard
↓
Simulation
↓
Copilot
↓
Historique
↓
Abonnement Premium
↓
Retour Dashboard
```

---

## DÉTAIL PAR ÉTAPE

### ÉTAPE 1: LANDING

**Page:** `apps/web/src/app/page.tsx`  
**Composants:**
- `CVUploader` (`apps/web/src/components/analyze/CVUploader.tsx`)
- `JobInput` (`apps/web/src/components/analyze/JobInput.tsx`)
- `AnalyzeButton` (`apps/web/src/components/analyze/AnalyzeButton.tsx`)
- `PreviewTokenManager` (`apps/web/src/lib/preview-analysis/previewTokenManager.ts`)

**API appelées:** Aucune (cette étape)

**Données créées:** Aucune

**Données modifiées:** Aucune

**Données persistées:** Aucune

**Erreurs possibles:**
- Upload CV échoue (taille > 10MB, format invalide)
- Rate limit dépassé (3/heure par IP)

**Redirections:**
- Succès: `/analyze?preview={token}`

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/` (Landing)
- `/analyze` (Page d'analyse)

---

### ÉTAPE 2: UPLOAD CV

**Composant:** `CVUploader`  
**API appelées:** Aucune (cette étape)

**Données créées:** Aucune

**Données modifiées:** Aucune

**Données persistées:** Aucune

**Erreurs possibles:**
- Fichier trop volumineux (> 10MB)
- Format invalide (non PDF/DOCX)
- Fichier corrompu

**Redirections:** Aucune

**Middleware impliqué:** Aucun

**Pages concernées:**
- `/` (Landing)
- `/analyze` (Page d'analyse)

---

### ÉTAPE 3: ANALYSE ATS PREVIEW

**Page:** `apps/web/src/app/analyze/page.tsx`  
**API:** `/api/public/analyze-preview` (POST)

**Composants:**
- `PremiumATSResult` (`apps/web/src/components/analyze/PremiumATSResult.tsx`)
- `ConversionPanel` (`apps/web/src/components/conversion/ConversionPanel.tsx`)

**API appelées:**
- `POST /api/public/analyze-preview`

**Données créées:**
- `PreviewAnalysis` (Prisma)
  - token (UUID unique)
  - cvExtract (JSON)
  - jobExtract (JSON)
  - analysisResult (JSON)
  - atsScore (Int)
  - strengths (JSON)
  - weaknesses (JSON)
  - recommendations (JSON)
  - rawPayload (JSON)
  - status: "completed"
  - ipHash (String)
  - fingerprint (String)
  - expiresAt (DateTime + 24h)

**Données modifiées:** Aucune

**Données persistées:**
- PreviewAnalysis dans PostgreSQL
- previewToken dans sessionStorage (client)
- previewToken dans cookie httpOnly (client)

**Erreurs possibles:**
- Rate limit dépassé (429)
- Validation CV échoue (400)
- Validation job description échoue (400)
- Timeout analyse ATS (8s)
- Erreur génération preview (500)

**Redirections:** Aucune (affichage in-page)

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/analyze` (Page d'analyse)

**Backend flow:**
1. Rate limiting (Upstash Redis, 3/heure par IP)
2. Validation CV upload
3. Validation job description (optionnel)
4. Génération preview (simulateATSAnalysis - MOCK)
5. Sauvegarde PreviewAnalysis
6. Set cookie preview_token (24h)
7. Réponse JSON avec previewToken + teaser

---

### ÉTAPE 4: SIGNUP

**Page:** `apps/web/src/app/signup-conversion/page.tsx`  
**API:** Supabase Auth (signUp)

**Composants:**
- Formulaire email/password
- Boutons OAuth (Google, Github)

**API appelées:**
- Supabase Auth API (signUp)
- `POST /api/auth/claim-preview` (auto-claim)

**Données créées:**
- `User` (Prisma/Supabase)
  - id (UUID)
  - email (String)
  - name (String)
  - emailVerified (DateTime)
  - createdAt (DateTime)
  - plan: "FREE"
  - credits: 100
  - onboardingCompleted: false

**Données modifiées:**
- `PreviewAnalysis.claimedByUserId` (String)
- `PreviewAnalysis.claimedAt` (DateTime)
- `PreviewAnalysis.consumed` (Boolean)
- `PreviewAnalysis.consumedAt` (DateTime)

**Données persistées:**
- User dans PostgreSQL (Supabase)
- PreviewAnalysis mise à jour dans PostgreSQL
- Session Supabase (cookie)

**Erreurs possibles:**
- Email déjà existant
- Mot de passe trop court (< 6 caractères)
- Mots de passe ne correspondent pas
- CGU non acceptées
- Erreur Supabase Auth
- Erreur claim preview

**Redirections:**
- Succès: `/welcome` (après 1s)
- OAuth: `/dashboard` (redirect Supabase)

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/signup-conversion` (Signup)
- `/welcome` (Welcome)

**Backend flow:**
1. Validation formulaire
2. Appel Supabase Auth signUp
3. Récupération previewToken (sessionStorage)
4. Appel `/api/auth/claim-preview`
5. Suppression previewToken (sessionStorage)
6. Redirection `/welcome`

---

### ÉTAPE 5: CONFIRMATION EMAIL

**Backend:** Supabase Auth (automatique)  
**API:** Supabase Auth API (envoi email)

**Composants:** Aucun (automatique Supabase)

**API appelées:**
- Supabase Auth API (envoi email de confirmation)

**Données créées:** Aucune

**Données modifiées:**
- `User.emailVerified` (DateTime - après clic lien)

**Données persistées:**
- User dans PostgreSQL (Supabase)

**Erreurs possibles:**
- Email non délivré (spam, adresse invalide)
- Lien de confirmation expiré
- Erreur SMTP Supabase

**Redirections:** Aucune (email externe)

**Middleware impliqué:** Aucun

**Pages concernées:** Aucune (processus externe)

**Backend flow:**
1. Supabase envoie email automatiquement
2. Utilisateur clique lien de confirmation
3. Supabase met à jour emailVerified
4. Redirect vers `/dashboard` (configuré)

**Note:** Templates email non audités, configuration par défaut Supabase.

---

### ÉTAPE 6: CLAIM DE LA PREVIEW

**API:** `/api/auth/claim-preview` (POST)  
**Service:** `PreviewAnalysisService.claimPreview()`

**Composants:** Aucun (backend)

**API appelées:**
- `POST /api/auth/claim-preview`

**Données créées:**
- `CareerProfile` (Prisma) - si n'existe pas
  - id (UUID)
  - userId (String)
  - employabilityScore (Float)
  - careerDNA (JSON)

- `CVAnalysis` (Prisma)
  - id (UUID)
  - userId (String)
  - fileName: "CV Preview"
  - originalText: ""
  - optimizedText: ""
  - cvData (JSON)
  - atsScoreBefore: 0
  - atsScoreAfter (Int)
  - improvements (JSON)
  - keywords (JSON)

**Données modifiées:**
- `PreviewAnalysis.claimedByUserId` (String)
- `PreviewAnalysis.claimedAt` (DateTime)
- `PreviewAnalysis.consumed` (Boolean)
- `PreviewAnalysis.consumedAt` (DateTime)

**Données persistées:**
- CareerProfile dans PostgreSQL
- CVAnalysis dans PostgreSQL
- PreviewAnalysis mise à jour dans PostgreSQL

**Erreurs possibles:**
- Non authentifié (401)
- Preview token manquant (400)
- Token invalide ou expiré (400)
- Analyse non trouvée (404)
- Analyse déjà revendiquée (409)
- Erreur création CareerProfile (500)
- Erreur création CVAnalysis (500)

**Redirections:** Aucune (API)

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:** Aucune (API)

**Backend flow:**
1. Vérification authentification Supabase
2. Récupération previewToken (body ou cookie)
3. Validation token (isValidToken)
4. Récupération PreviewAnalysis
5. Vérification non déjà revendiquée
6. Claim (claimForUser)
7. Création CareerProfile (si inexistant)
8. Création CVAnalysis
9. Création Skills (PLACEHOLDER console.log)
10. Création Experience (PLACEHOLDER console.log)
11. Création Education (PLACEHOLDER console.log)
12. Création Languages (PLACEHOLDER console.log)
13. Création ATS History (PLACEHOLDER console.log)
14. Feed Knowledge Graph (PLACEHOLDER console.log)
15. Suppression cookie preview_token

**Note:** Skills, Experience, Education, Languages, Knowledge Graph sont des placeholders console.log - DONNÉES PERDUES.

---

### ÉTAPE 7: WELCOME

**Page:** `apps/web/src/app/welcome/page.tsx`

**Composants:**
- Animations Framer Motion
- Icônes Lucide (CheckCircle, ArrowRight)

**API appelées:** Aucune

**Données créées:** Aucune

**Données modifiées:** Aucune

**Données persistées:** Aucune

**Erreurs possibles:**
- Non authentifié → redirect `/signup-conversion`
- Pas de previewToken → redirect `/dashboard`

**Redirections:**
- Non authentifié: `/signup-conversion`
- Pas de preview: `/dashboard`
- Bouton "Continuer": `/dashboard`

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/welcome` (Welcome)
- `/signup-conversion` (Signup)
- `/dashboard` (Dashboard)

**Backend flow:**
1. Vérification authentification (useEffect)
2. Vérification previewToken (sessionStorage)
3. Affichage écran succès
4. Bouton "Continuer" → `/dashboard`

---

### ÉTAPE 8: ONBOARDING

**Page:** `apps/web/src/app/onboarding/page.tsx`  
**Services:** `OnboardingResolver`, `FlowEngine`

**Composants:**
- Progress bar
- Formulaire par étape
- Navigation (suivant, retour, skip)

**API appelées:**
- `POST /api/auth/sync-user` (sauvegarde données)

**Données créées:** Aucune

**Données modifiées:**
- `User.name` (String)
- `User.onboardingCompleted` (Boolean)

**Données persistées:**
- User dans PostgreSQL

**Erreurs possibles:**
- Non authentifié → redirect `/login`
- Erreur initialisation FlowEngine
- Erreur sauvegarde données
- Erreur completion onboarding

**Redirections:**
- Non authentifié: `/login`
- Complété: `/dashboard`

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/onboarding` (Onboarding)
- `/dashboard` (Dashboard)

**Backend flow:**
1. Initialisation FlowEngine (initializeFlow)
2. Résolution étape courante (OnboardingResolver)
3. Calcul progression
4. Exécution action étape (FlowEngine.executeFlowAction)
5. Sauvegarde données utilisateur (/api/auth/sync-user)
6. Marquage onboardingCompleted
7. Redirection `/dashboard`

**Note:** Étapes matching, copilot, interview sont des placeholders visuels.

---

### ÉTAPE 9: DASHBOARD

**Page:** `apps/web/src/app/dashboard/page.tsx`  
**Composant:** `DashboardWidgets`

**API appelées:** Aucune (server-side)

**Données créées:** Aucune

**Données modifiées:** Aucune

**Données persistées:** Aucune (lecture seule)

**Erreurs possibles:**
- Non authentifié → redirect `/login`
- Onboarding non complété → redirect `/onboarding`
- Erreur récupération données

**Redirections:**
- Non authentifié: `/login`
- Onboarding non complété: `/onboarding`

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/dashboard` (Dashboard)
- `/login` (Login)
- `/onboarding` (Onboarding)

**Backend flow:**
1. Vérification authentification
2. Vérification onboardingCompleted
3. Récupération CVAnalysis (5 dernières)
4. Récupération CareerProfile
5. Récupération InterviewSession (3 dernières)
6. Vérification quota (checkUserQuota)
7. Récupération claimedPreview
8. Transformation données pour DashboardWidgets
9. Rendu DashboardWidgets

**Données lues:**
- CVAnalysis (Prisma)
- CareerProfile (Prisma)
- InterviewSession (Prisma)
- PreviewAnalysis (Prisma)
- User (Prisma)

---

### ÉTAPE 10: SIMULATION

**Page:** `apps/web/src/app/simulation/page.tsx`  
**API:** `/api/simulation/create` (POST)

**Composants:**
- Formulaire configuration (jobTitle, level, interviewType, duration)

**API appelées:**
- `POST /api/simulation/create`

**Données créées:**
- `InterviewSession` (Prisma)
  - id (UUID)
  - userId (String)
  - jobTitle (String)
  - level (String)
  - interviewType (String)
  - durationSeconds (Int)
  - status: "active"
  - startedAt (DateTime)
  - createdAt (DateTime)

**Données modifiées:** Aucune

**Données persistées:**
- InterviewSession dans PostgreSQL

**Erreurs possibles:**
- Non authentifié (401)
- Validation échoue (400)
- CareerProfile inexistant → redirect `/dashboard`
- Erreur création session (500)

**Redirections:**
- Succès: `/simulation/{sessionId}`
- Non authentifié: `/login`
- Pas de CareerProfile: `/dashboard`

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/simulation` (Configuration)
- `/simulation/{id}` (Conversation)
- `/login` (Login)
- `/dashboard` (Dashboard)

**Backend flow:**
1. Initialisation DI Container
2. Vérification authentification
3. Parsing formData
4. Validation Zod (CreateSessionSchema)
5. Résolution SimulationService (DI)
6. Exécution createSimulation (avec idempotency optionnelle)
7. Redirect vers `/simulation/{sessionId}`

**Note:** Utilise l'architecture DI (Dependency Injection) avec Container.

---

### ÉTAPE 11: COPILOT

**Page:** `apps/web/src/app/copilot/page.tsx`  
**Composant:** `ChatWorkspace`

**API appelées:** Aucune (cette étape)

**Données créées:** Aucune

**Données modifiées:** Aucune

**Données persistées:** Aucune

**Erreurs possibles:**
- Erreur chargement ChatWorkspace
- Erreur connexion backend

**Redirections:** Aucune

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/copilot` (Copilot)

**Backend flow:**
1. Chargement ChatWorkspace
2. Initialisation conversation
3. Connexion backend (non auditée)

**Note:** Intégration IA non auditée, backend non vérifié.

---

### ÉTAPE 12: HISTORIQUE

**Page:** `apps/web/src/app/history/page.tsx`  
**API:** Supabase (interview_sessions)

**Composants:**
- `StatsOverview`
- Table des simulations

**API appelées:**
- Supabase.from("interview_sessions").select()

**Données créées:** Aucune

**Données modifiées:** Aucune

**Données persistées:** Aucune (lecture seule)

**Erreurs possibles:**
- Non authentifié → redirect `/login`
- Erreur récupération sessions

**Redirections:**
- Non authentifié: `/login`

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/history` (Historique)
- `/login` (Login)
- `/report/{id}` (Rapport)

**Backend flow:**
1. Vérification authentification
2. Récupération InterviewSession avec reports
3. Calcul stats (total, durée, score moyen, meilleur score)
4. Affichage table
5. Liens vers rapports

**Données lues:**
- InterviewSession (Supabase)
- Report (Supabase)

---

### ÉTAPE 13: ABONNEMENT PREMIUM

**Page:** `apps/web/src/app/pricing/page.tsx`  
**API:** `/api/stripe/checkout` (POST)

**Composants:**
- 3 plans (Starter, Pro, Expert)
- Boutons CTA

**API appelées:**
- `POST /api/stripe/checkout`

**Données créées:**
- `Subscription` (Prisma) - via webhook
  - id (UUID)
  - userId (String)
  - stripeCustomerId (String)
  - stripeSubId (String)
  - status (String)
  - currentPeriodEnd (DateTime)
  - plan (Plan)

**Données modifiées:**
- `User.plan` (Plan)
- `User.stripeCustomerId` (String)

**Données persistées:**
- Subscription dans PostgreSQL
- User mis à jour dans PostgreSQL
- Customer/Subscription dans Stripe

**Erreurs possibles:**
- Non authentifié (401)
- Stripe non configuré (500)
- Prix invalide (400)
- Abonnement déjà actif (400)
- Rate limit dépassé (429)
- Erreur Stripe (500)

**Redirections:**
- Succès: Stripe Checkout Session
- Cancel: `/pricing?checkout=cancelled`
- Success: `/dashboard?checkout=success`

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/pricing` (Pricing)
- `/signup` (Signup - fallback)
- `/dashboard` (Dashboard - success)

**Backend flow:**
1. Vérification Stripe configuré
2. Vérification prix autorisés
3. Vérification authentification
4. Rate limiting
5. Validation payload
6. Récupération profil utilisateur
7. Vérification pas d'abonnement actif
8. Résolution plan
9. Création Stripe Checkout Session
10. Sauvegarde stripeCustomerId
11. Redirect vers Stripe Checkout

**Webhook flow:**
1. Réception événement Stripe
2. Validation signature webhook
3. Traitement événement (checkout.session.completed, customer.subscription.created, etc.)
4. Upsert Subscription
5. Mise à jour User.plan
6. Gestion paiements échoués
7. Gestion annulations

---

### ÉTAPE 14: RETOUR DASHBOARD

**Page:** `apps/web/src/app/dashboard/page.tsx`  
**Composant:** `DashboardWidgets`

**API appelées:** Aucune (server-side)

**Données créées:** Aucune

**Données modifiées:** Aucune

**Données persistées:** Aucune (lecture seule)

**Erreurs possibles:**
- Non authentifié → redirect `/login`
- Onboarding non complété → redirect `/onboarding`

**Redirections:**
- Non authentifié: `/login`
- Onboarding non complété: `/onboarding`

**Middleware impliqué:**
- `middleware.ts` (updateSession Supabase, requestId)

**Pages concernées:**
- `/dashboard` (Dashboard)
- `/login` (Login)
- `/onboarding` (Onboarding)

**Backend flow:** Identique à l'étape 9 (Dashboard)

---

## DIAGRAMME DU FLOW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LANDING (/)                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ CVUploader   │→ │  JobInput    │→ │AnalyzeButton │→ │  handleAnalyze│   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────┬───────┘   │
│                                                                      │       │
│                              ↓                                         │       │
│                    ┌────────────────┐                                 │       │
│                    │ PreviewToken   │                                 │       │
│                    │   Manager      │                                 │       │
│                    └────────┬───────┘                                 │       │
│                             │                                         │       │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ANALYSE ATS PREVIEW (/analyze)                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ POST /api/public/analyze-preview                                       │  │
│  │  ├─ Rate limiting (Upstash Redis, 3/h)                               │  │
│  │  ├─ Validation CV                                                      │  │
│  │  ├─ Validation job (optionnel)                                        │  │
│  │  ├─ Génération preview (MOCK)                                         │  │
│  │  ├─ Création PreviewAnalysis (Prisma)                                 │  │
│  │  ├─ Set cookie preview_token (24h)                                   │  │
│  │  └─ Réponse JSON + teaser                                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ PremiumATSResult (UI avec flou 70%)                                   │  │
│  │  ├─ Score animé                                                       │  │
│  │  ├─ Radar chart                                                       │  │
│  │  ├─ Métriques (8)                                                     │  │
│  │  ├─ Skills/Strengths/Weaknesses                                      │  │
│  │  ├─ CTA "Créer mon compte gratuitement"                              │  │
│  │  └─ ConversionPanel                                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SIGNUP (/signup-conversion)                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Formulaire email/password + OAuth (Google, Github)                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Supabase Auth signUp                                                   │  │
│  │  ├─ Création User (Prisma)                                            │  │
│  │  ├─ plan: FREE                                                         │  │
│  │  ├─ credits: 100                                                       │  │
│  │  ├─ onboardingCompleted: false                                        │  │
│  │  └─ Envoi email confirmation (automatique)                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Auto-claim preview                                                     │  │
│  │  ├─ Récupération previewToken (sessionStorage)                        │  │
│  │  └─ POST /api/auth/claim-preview                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLAIM PREVIEW (/api/auth/claim-preview)                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ PreviewAnalysisService.claimPreview()                                  │  │
│  │  ├─ Vérification authentification                                     │  │
│  │  ├─ Validation token                                                   │  │
│  │  ├─ Claim (claimForUser)                                               │  │
│  │  ├─ Création CareerProfile (si inexistant)                             │  │
│  │  ├─ Création CVAnalysis                                                │  │
│  │  ├─ Création Skills (PLACEHOLDER console.log) ❌                        │  │
│  │  ├─ Création Experience (PLACEHOLDER console.log) ❌                    │  │
│  │  ├─ Création Education (PLACEHOLDER console.log) ❌                    │  │
│  │  ├─ Création Languages (PLACEHOLDER console.log) ❌                    │  │
│  │  ├─ Création ATS History (PLACEHOLDER console.log) ❌                  │  │
│  │  ├─ Feed Knowledge Graph (PLACEHOLDER console.log) ❌                   │  │
│  │  └─ Suppression cookie preview_token                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WELCOME (/welcome)                                  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Vérification authentification                                           │  │
│  │ Vérification previewToken (optionnel)                                  │  │
│  │ Affichage écran succès                                                  │  │
│  │  ├─ "Bonne nouvelle ! Nous avons récupéré votre analyse ATS."          │  │
│  │  ├─ "Votre profil est déjà prêt."                                      │  │
│  │  ├─ Liste bénéfices (5 items)                                          │  │
│  │  └─ Bouton "Continuer"                                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ONBOARDING (/onboarding)                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ FlowEngine + OnboardingResolver                                         │  │
│  │  ├─ Flow adaptatif (full, ats-first, minimal)                         │  │
│  │  ├─ Étapes: welcome, upload-cv, upload-job, matching, ats-analysis,    │  │
│  │  │         copilot, interview                                           │  │
│  │  ├─ Progress bar                                                       │  │
│  │  ├─ Navigation (suivant, retour, skip)                                 │  │
│  │  ├─ Sauvegarde données (/api/auth/sync-user)                           │  │
│  │  ├─ Marquage onboardingCompleted                                       │  │
│  │  └─ Redirection /dashboard                                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DASHBOARD (/dashboard)                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ DashboardWidgets                                                        │  │
│  │  ├─ Score ATS avec tendance                                            │  │
│  │  ├─ Skills (top 6)                                                     │  │
│  │  ├─ Career profile                                                     │  │
│  │  ├─ Recommendations                                                     │  │
│  │  ├─ History (analyses CV)                                              │  │
│  │  ├─ Actions rapides (4 actions)                                         │  │
│  │  ├─ Progress tracker                                                    │  │
│  │  ├─ Insights (4 insights)                                              │  │
│  │  ├─ Timeline (analyses + entretiens)                                   │  │
│  │  └─ Affichage claimedPreview                                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SIMULATION (/simulation)                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Formulaire configuration (jobTitle, level, interviewType, duration)   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ POST /api/simulation/create                                             │  │
│  │  ├─ Initialisation DI Container                                         │  │
│  │  ├─ Vérification authentification                                       │  │
│  │  ├─ Validation Zod (CreateSessionSchema)                               │  │
│  │  ├─ Résolution SimulationService (DI)                                  │  │
│  │  ├─ Création InterviewSession (Prisma)                                 │  │
│  │  └─ Redirect /simulation/{sessionId}                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COPILOT (/copilot)                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ChatWorkspace                                                           │  │
│  │  ├─ Interface chat                                                     │  │
│  │  ├─ Historique conversations                                            │  │
│  │  └─ Intégration IA (NON AUDITÉE) ❌                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HISTORIQUE (/history)                                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ StatsOverview                                                           │  │
│  │  ├─ Total simulations                                                   │  │
│  │  ├─ Durée totale                                                       │  │
│  │  ├─ Score moyen                                                        │  │
│  │  └─ Meilleur score                                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Table des simulations                                                   │  │
│  │  ├─ Date, Poste, Niveau, Type, Durée, Score, Statut                  │  │
│  │  └─ Lien vers rapport                                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ABONNEMENT PREMIUM (/pricing)                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3 plans (Starter 29€, Pro 59€, Expert 99€)                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ POST /api/stripe/checkout                                              │  │
│  │  ├─ Vérification Stripe configuré                                      │  │
│  │  ├─ Vérification prix autorisés                                        │  │
│  │  ├─ Vérification authentification                                     │  │
│  │  ├─ Rate limiting                                                      │  │
│  │  ├─ Validation payload                                                 │  │
│  │  ├─ Vérification pas d'abonnement actif                              │  │
│  │  ├─ Résolution plan                                                    │  │
│  │  ├─ Création Stripe Checkout Session                                  │  │
│  │  ├─ Sauvegarde stripeCustomerId                                       │  │
│  │  └─ Redirect Stripe Checkout                                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Stripe Webhook (/api/stripe/webhook)                                  │  │
│  │  ├─ Validation signature webhook                                      │  │
│  │  ├─ checkout.session.completed                                       │  │
│  │  ├─ customer.subscription.created                                     │  │
│  │  ├─ customer.subscription.updated                                     │  │
│  │  ├─ invoice.payment_succeeded                                        │  │
│  │  ├─ invoice.payment_failed                                           │  │
│  │  ├─ customer.subscription.deleted                                     │  │
│  │  ├─ Upsert Subscription (Prisma)                                       │  │
│  │  └─ Mise à jour User.plan                                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────┼─────────────────────────────────────────┘       │
                              ↓                                                   │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        RETOUR DASHBOARD (/dashboard)                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ DashboardWidgets (identique étape 9)                                   │  │
│  │  ├─ Affichage plan premium (si abonné)                                │  │
│  │  └─ Affichage quota (si applicable)                                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                              ↓                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## POINTS DE RUPTURE

### CRITIQUES (P0)

1. **Skills/Experience/Education/Languages/Knowledge Graph placeholders**
   - **Localisation:** Étape 6 - Claim Preview
   - **Impact:** Données utilisateur non persistées correctement
   - **Conséquence:** Perte de données extraites du CV
   - **Fréquence:** 100% des claims
   - **Sévérité:** Critique

2. **Analyse ATS mockée**
   - **Localisation:** Étape 3 - Analyse ATS Preview
   - **Impact:** Résultats non réels, simulation basique
   - **Conséquence:** Score basé sur la longueur du CV, pas d'IA réelle
   - **Fréquence:** 100% des analyses
   - **Sévérité:** Critique

### MOYENS (P1)

3. **Confirmation email templates non audités**
   - **Localisation:** Étape 5 - Confirmation Email
   - **Impact:** UX email non optimisée
   - **Conséquence:** Templates par défaut Supabase
   - **Fréquence:** 100% des signups
   - **Sévérité:** Moyen

4. **Copilot IA non auditée**
   - **Localisation:** Étape 11 - Copilot
   - **Impact:** Fonctionnalité non vérifiée
   - **Conséquence:** Intégration backend inconnue
   - **Fréquence:** 100% des accès copilot
   - **Sévérité:** Moyen

5. **Onboarding étapes placeholders**
   - **Localisation:** Étape 8 - Onboarding
   - **Impact:** Étapes matching, copilot, interview visuelles seulement
   - **Conséquence:** Pas de vraie fonctionnalité
   - **Fréquence:** 100% des onboardings
   - **Sévérité:** Moyen

### FAIBLES (P2)

6. **Job Intelligence non implémentée**
   - **Localisation:** Étape 3 - Analyse ATS Preview
   - **Impact:** Job description non analysée
   - **Conséquence:** Données job stockées mais non traitées
   - **Fréquence:** 100% des analyses avec job
   - **Sévérité:** Faible

7. **Profil utilisateur limité**
   - **Localisation:** Étape 9/14 - Dashboard
   - **Impact:** Personnalisation limitée
   - **Conséquence:** Peu de champs modifiables
   - **Fréquence:** 100% des utilisateurs
   - **Sévérité:** Faible

---

## DOUBLONS

### DOUBLONS DE DONNÉES

1. **previewToken stocké 2 fois**
   - **Localisation:** Étape 3 - Analyse ATS Preview
   - **Duplication:** sessionStorage + cookie httpOnly
   - **Impact:** Redondance, risque d'incohérence
   - **Sévérité:** Faible

2. **User.plan stocké 2 fois**
   - **Localisation:** Étape 13 - Abonnement Premium
   - **Duplication:** User.plan + Subscription.plan
   - **Impact:** Redondance, risque d'incohérence
   - **Sévérité:** Faible

3. **CVAnalysis créée 2 fois**
   - **Localisation:** Étape 6 - Claim Preview
   - **Duplication:** PreviewAnalysis + CVAnalysis
   - **Impact:** Redondance, même données stockées 2 fois
   - **Sévérité:** Moyen

### DOUBLONS DE LOGIQUE

1. **Vérification authentification**
   - **Localisation:** Toutes les étapes protégées
   - **Duplication:** middleware.ts + vérification page par page
   - **Impact:** Code répété
   - **Sévérité:** Faible

2. **Validation email**
   - **Localisation:** Signup + Login
   - **Duplication:** Validation côté client + côté serveur
   - **Impact:** Code répété
   - **Sévérité:** Faible

---

## DONNÉES PERDUES

### CRITIQUE (P0)

1. **Skills extraits du CV**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** cvExtract.skills
   - **Destination:** Aucune (placeholder console.log)
   - **Volume:** 100% des skills
   - **Impact:** Compétences non persistées
   - **Sévérité:** Critique

2. **Experience extraite du CV**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** cvExtract.experience
   - **Destination:** Aucune (placeholder console.log)
   - **Volume:** 100% de l'expérience
   - **Impact:** Expérience non persistée
   - **Sévérité:** Critique

3. **Education extraite du CV**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** cvExtract.education
   - **Destination:** Aucune (placeholder console.log)
   - **Volume:** 100% de l'éducation
   - **Impact:** Éducation non persistée
   - **Sévérité:** Critique

4. **Languages extraits du CV**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** cvExtract.languages
   - **Destination:** Aucune (placeholder console.log)
   - **Volume:** 100% des langues
   - **Impact:** Langues non persistées
   - **Sévérité:** Critique

5. **Knowledge Graph data**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** cvExtract + atsScore + skills + experience + education
   - **Destination:** Aucune (placeholder console.log)
   - **Volume:** 100% des données
   - **Impact:** Knowledge Graph non alimenté
   - **Sévérité:** Critique

### MOYEN (P1)

6. **Job description analysée**
   - **Localisation:** Étape 3 - Analyse ATS Preview
   - **Données:** jobText
   - **Destination:** jobExtract (JSON) mais non utilisé
   - **Volume:** 100% des jobs
   - **Impact:** Job non analysé par IA
   - **Sévérité:** Moyen

7. **Radar dimensions calculées**
   - **Localisation:** Étape 3 - Analyse ATS Preview
   - **Données:** structure, keywords, impact, clarity, relevance
   - **Destination:** Réponse API mais non persistées
   - **Volume:** 100% des analyses
   - **Impact:** Données radar non sauvegardées
   - **Sévérité:** Moyen

---

## DONNÉES INUTILISÉES

### CRITIQUE (P0)

1. **PreviewAnalysis.jobExtract**
   - **Localisation:** Étape 3 - Analyse ATS Preview
   - **Données:** jobExtract (JSON)
   - **Utilisation:** Aucune
   - **Volume:** 100% des jobs
   - **Impact:** Stockage inutile
   - **Sévérité:** Critique

2. **PreviewAnalysis.rawPayload**
   - **Localisation:** Étape 3 - Analyse ATS Preview
   - **Données:** rawPayload (JSON)
   - **Utilisation:** Aucune
   - **Volume:** 100% des analyses
   - **Impact:** Stockage inutile
   - **Sévérité:** Critique

3. **CVAnalysis.originalText**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** originalText (String vide)
   - **Utilisation:** Aucune
   - **Volume:** 100% des CVAnalysis
   - **Impact:** Champ vide inutile
   - **Sévérité:** Critique

4. **CVAnalysis.optimizedText**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** optimizedText (String vide)
   - **Utilisation:** Aucune
   - **Volume:** 100% des CVAnalysis
   - **Impact:** Champ vide inutile
   - **Sévérité:** Critique

### MOYEN (P1)

5. **CareerProfile.clarityTrend**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** clarityTrend (Float)
   - **Utilisation:** Jamais initialisé
   - **Volume:** 100% des CareerProfile
   - **Impact:** Champ null inutile
   - **Sévérité:** Moyen

6. **CareerProfile.confidenceTrend**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** confidenceTrend (Float)
   - **Utilisation:** Jamais initialisé
   - **Volume:** 100% des CareerProfile
   - **Impact:** Champ null inutile
   - **Sévérité:** Moyen

7. **CareerProfile.ownershipTrend**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** ownershipTrend (Float)
   - **Utilisation:** Jamais initialisé
   - **Volume:** 100% des CareerProfile
   - **Impact:** Champ null inutile
   - **Sévérité:** Moyen

8. **CareerProfile.stressResistance**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** stressResistance (Float)
   - **Utilisation:** Jamais initialisé
   - **Volume:** 100% des CareerProfile
   - **Impact:** Champ null inutile
   - **Sévérité:** Moyen

9. **CareerProfile.leadershipScore**
   - **Localisation:** Étape 6 - Claim Preview
   - **Données:** leadershipScore (Float)
   - **Utilisation:** Jamais initialisé
   - **Volume:** 100% des CareerProfile
   - **Impact:** Champ null inutile
   - **Sévérité:** Moyen

10. **CareerProfile.communicationScore**
    - **Localisation:** Étape 6 - Claim Preview
    - **Données:** communicationScore (Float)
    - **Utilisation:** Jamais initialisé
    - **Volume:** 100% des CareerProfile
    - **Impact:** Champ null inutile
    - **Sévérité:** Moyen

11. **CareerProfile.unlockedPersonas**
    - **Localisation:** Étape 6 - Claim Preview
    - **Données:** unlockedPersonas (String[])
    - **Utilisation:** Jamais initialisé
    - **Volume:** 100% des CareerProfile
    - **Impact:** Champ vide inutile
    - **Sévérité:** Moyen

### FAIBLE (P2)

12. **User.referralCode**
    - **Localisation:** Étape 4 - Signup
    - **Données:** referralCode (String)
    - **Utilisation:** Généré mais jamais utilisé
    - **Volume:** 100% des utilisateurs
    - **Impact:** Système de parrainage non implémenté
    - **Sévérité:** Faible

13. **User.referredBy**
    - **Localisation:** Étape 4 - Signup
    - **Données:** referredBy (String)
    - **Utilisation:** Jamais utilisé
    - **Volume:** 100% des utilisateurs
    - **Impact:** Système de parrainage non implémenté
    - **Sévérité:** Faible

14. **User.referralCount**
    - **Localisation:** Étape 4 - Signup
    - **Données:** referralCount (Int)
    - **Utilisation:** Jamais utilisé
    - **Volume:** 100% des utilisateurs
    - **Impact:** Système de parrainage non implémenté
    - **Sévérité:** Faible

---

## APPELS INUTILES

### CRITIQUE (P0)

1. **Double appel Supabase Auth**
   - **Localisation:** Étape 8 - Onboarding
   - **Appel:** createClient() dans initializeOnboarding + handleNext
   - **Impact:** Création client redondante
   - **Sévérité:** Critique

2. **Double vérification authentification**
   - **Localisation:** Étape 9/14 - Dashboard
   - **Appel:** middleware.ts + page server-side
   - **Impact:** Vérification redondante
   - **Sévérité:** Critique

### MOYEN (P1)

3. **Appel inutile getUserClaimedPreview**
   - **Localisation:** Étape 9/14 - Dashboard
   - **Appel:** previewAnalysisService.getUserClaimedPreview()
   - **Impact:** Appel même si pas de preview
   - **Sévérité:** Moyen

4. **Appel inutile checkUserQuota**
   - **Localisation:** Étape 9/14 - Dashboard
   - **Appel:** checkUserQuota()
   - **Impact:** Quota non utilisé dans le dashboard
   - **Sévérité:** Moyen

### FAIBLE (P2)

5. **Appel inutile FlowEngine.getFlowContext**
   - **Localisation:** Étape 8 - Onboarding
   - **Appel:** FlowEngine.getFlowContext() après initializeFlow
   - **Impact:** Contexte déjà disponible dans initializeFlow
   - **Sévérité:** Faible

---

## FLOW SCORE /100

### CALCUL

**Score = 100 - (Pénalités)**

**Pénalités:**

1. **Données perdues (critique):** -15 points
   - Skills: -3
   - Experience: -3
   - Education: -3
   - Languages: -3
   - Knowledge Graph: -3

2. **Données inutilisées (critique):** -10 points
   - jobExtract: -2
   - rawPayload: -2
   - originalText: -2
   - optimizedText: -2
   - CareerProfile champs: -2

3. **Points de rupture (critique):** -10 points
   - Skills/Experience/Education/Languages/Knowledge Graph placeholders: -10

4. **Analyse ATS mockée (critique):** -10 points
   - Simulation basique: -10

5. **Appels inutiles (critique):** -5 points
   - Double appel Supabase: -3
   - Double vérification auth: -2

6. **Doublons (moyen):** -3 points
   - previewToken 2x: -1
   - User.plan 2x: -1
   - CVAnalysis 2x: -1

7. **Confirmation email non audité (moyen):** -2 points

8. **Copilot non audité (moyen):** -2 points

9. **Onboarding placeholders (moyen):** -2 points

**Total pénalités:** -59 points

**FLOW SCORE = 100 - 59 = 41/100**

---

## SYNTHÈSE

### SCORE GLOBAL: 41/100

**Interprétation:**
- **0-20:** Critique
- **21-40:** Mauvais
- **41-60:** Moyen
- **61-80:** Bon
- **81-100:** Excellent

**Statut:** MOYEN

### FORCES

1. Core flow fonctionnel (Landing → Dashboard)
2. Architecture middleware solide
3. Rate limiting implémenté
4. Stripe billing opérationnel
5. Preview Analysis System bien conçu
6. DI Container pour simulation
7. Idempotency pour les appels critiques

### FAIBLESSES CRITIQUES

1. **Données perdues:** Skills, Experience, Education, Languages, Knowledge Graph non persistés
2. **Analyse ATS mockée:** Pas d'IA réelle
3. **Données inutilisées:** Plusieurs champs jamais utilisés
4. **Appels inutiles:** Redondance dans les appels

### RECOMMANDATIONS IMMÉPRIATES

1. **Implémenter Skills/Experience/Education/Languages création** (P0)
   - Remplacer les placeholders console.log
   - Créer les models Prisma si nécessaires
   - Impact: +15 points

2. **Intégrer IA réelle pour analyse ATS** (P0)
   - Remplacer simulateATSAnalysis par appel API OpenAI/Mistral
   - Impact: +10 points

3. **Nettoyer les données inutilisées** (P0)
   - Supprimer ou utiliser les champs inutiles
   - Impact: +10 points

4. **Optimiser les appels inutiles** (P1)
   - Éliminer les doublons d'appels
   - Impact: +5 points

### POTENTIEL D'AMÉLIORATION

**Score cible:** 80/100  
**Actions requises:** 4  
**Estimation:** 2-3 semaines

---

**FIN DE L'AUDIT AUDIT-PROD-001**
