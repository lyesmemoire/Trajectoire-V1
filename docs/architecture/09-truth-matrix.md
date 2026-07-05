# Matrice des Sources de Vérité

Ce document recense les sources de vérité pour chaque domaine de l'application Trajectoire. 
Conformément à notre architecture, **le Repository est l'unique point d'accès aux données**. Les API et Services ne doivent jamais interagir directement avec Prisma ou Supabase. Le Repository abstrait la complexité de stockage sous-jacente.

| Domaine | Sous-domaine | Source de Vérité | Accès | Remarques |
| :--- | :--- | :--- | :--- | :--- |
| **Users** | Profils Utilisateurs | Prisma (`User`) | `usersRepository` | Entité principale. Gère le rôle, plan, crédits IA (via relation). |
| **Auth** | Authentification | Supabase Auth | `authService` / `getServerClient` | Géré par Supabase (sessions, JWT, RLS). |
| **Billing** | Transactions | Prisma + RPC Supabase | `billingRepository` | Utilise des RPC Supabase (`deduct_credits_atomic`, etc.) pour garantir l'atomicité financière, puis log dans Prisma/Supabase (`credit_usage`). |
| **Career** | Profil de Carrière | Prisma (`CareerProfile`) | `careerRepository` | Stocke les objectifs, compétences, et personas débloqués. |
| **CV** | Fichiers & Base | Supabase (`cvs`) | `cvRepository` | Le stockage de base des CVs se fait via la table Supabase `cvs`. |
| | Analyse ATS | Prisma (`CVAnalysis`) | `atsRepository` | Les résultats de l'analyse ATS (score, parsing) sont stockés via Prisma. |
| **Interview** | Sessions (Standard/Premium) | Supabase (`interview_sessions`) | `sessionRepository` | Les sessions en cours d'exécution sont gérées via Supabase pour le temps réel/streaming. |
| | Historique & Analytique | Prisma (`InterviewAnalyticsProjection`, `InterviewSession`) | `analyticsRepository` / `scoringRepository` | Une fois complétées, les sessions sont projetées dans Prisma pour l'analyse comportementale (Source of Truth finale). |
| **ML / Comportement** | Profil Comportemental | Prisma (`UserBehaviorProfile`) | `behaviorRepository` | Mémoire longitudinale de l'utilisateur (tendances, archétypes). |
| | Snapshot Prédictif | Prisma (`UserPredictionSnapshot`) | `predictionRepository` | Utilisé pour le calcul de "Predictive Truth" et la détection de dérive (drift). |
| **Core / Infrastructure** | Audit & Logs | Supabase (`audit_logs`) | `auditRepository` | Pattern Strangler Fig : écritures forcées sur Supabase (Phase 1). |
| | Prompts IA | Supabase (`prompt_versions`) | `promptRepository` | Pattern Strangler Fig : écritures forcées sur Supabase. |
| | AI Usage | Supabase (`ai_usage_logs`) | `aiUsageRepository` | Pattern Strangler Fig : écritures forcées sur Supabase. |
| | Storage (Fichiers, Audio) | Supabase Storage | `storageRepository` | Stockage binaire brut. |

## Principes Directeurs

1. **Isolation Technologique** : Le service métier appelle `cvRepository.findById()`. Il ignore totalement si la donnée provient de PostgreSQL (Prisma), de Supabase, d'un cache Redis ou d'un appel API externe.
2. **Encapsulation des RPC** : Toute procédure stockée (ex: `supabase.rpc('deduct_credits')`) doit être strictement encapsulée dans le Repository du domaine concerné.
3. **Migration Transparente (Strangler Fig)** : Pour les domaines en cours de migration (Audit, Prompts, AI Usage), le routeur de lecture (Prisma vs Supabase) est géré **à l'intérieur du Repository**. Le service métier n'a pas connaissance de ce feature flag.
