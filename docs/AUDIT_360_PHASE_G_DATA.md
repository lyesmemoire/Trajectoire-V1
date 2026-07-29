# Audit 360° - Phase G : Audit Données

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Supabase

### Tables

#### profiles

**Description** : Profil utilisateur (extension de auth.users)

**Colonnes**
- `id` : UUID (PK, FK vers auth.users)
- `email` : TEXT (UNIQUE)
- `full_name` : TEXT
- `credits` : INTEGER (DEFAULT 2)
- `created_at` : TIMESTAMPTZ
- `updated_at` : TIMESTAMPTZ

**Index**
- `id` : Primary Key
- `email` : Unique Index

**Policies RLS**
- `Users can access own profile` : SELECT/UPDATE/INSERT/DELETE sur auth.uid() = id

**TTL** : Aucun

**Storage** : PostgreSQL

---

#### cvs

**Description** : CVs uploadés par les utilisateurs

**Colonnes**
- `id` : UUID (PK)
- `user_id` : UUID (FK vers profiles)
- `filename` : TEXT
- `extracted_text` : TEXT
- `word_count` : INTEGER (DEFAULT 0)
- `page_count` : INTEGER (DEFAULT 1)
- `created_at` : TIMESTAMPTZ
- `updated_at` : TIMESTAMPTZ

**Index**
- `idx_cvs_user_id` : user_id

**Policies RLS**
- `Users can access own cvs` : ALL sur auth.uid() = user_id

**TTL** : Aucun

**Storage** : PostgreSQL

---

#### ats_reports

**Description** : Rapports ATS (analyse CV vs Job Description)

**Colonnes**
- `id` : UUID (PK)
- `user_id` : UUID (FK vers profiles)
- `cv_id` : UUID (FK vers cvs)
- `score` : INTEGER
- `job_description` : TEXT
- `matched_keywords` : JSONB (DEFAULT '[]')
- `missing_keywords` : JSONB (DEFAULT '[]')
- `suggestions` : JSONB (DEFAULT '[]')
- `total_keywords` : INTEGER (DEFAULT 0)
- `created_at` : TIMESTAMPTZ

**Index**
- `idx_ats_reports_user_id` : user_id
- `idx_ats_reports_cv_id` : cv_id

**Policies RLS**
- `Users can access own ats_reports` : ALL sur auth.uid() = user_id

**TTL** : Aucun

**Storage** : PostgreSQL

---

#### interview_sessions

**Description** : Sessions d'entretien (classique)

**Colonnes**
- `id` : UUID (PK)
- `user_id` : UUID (FK vers profiles)
- `cv_id` : UUID (FK vers cvs)
- `job_title` : TEXT
- `job_description` : TEXT
- `questions` : JSONB
- `answers` : JSONB (DEFAULT '[]')
- `feedback` : JSONB
- `score` : INTEGER
- `status` : TEXT (DEFAULT 'in_progress', CHECK: in_progress/completed/abandoned)
- `tokens_used` : INTEGER (DEFAULT 0)
- `tokens_used_feedback` : INTEGER (DEFAULT 0)
- `completed_at` : TIMESTAMPTZ
- `created_at` : TIMESTAMPTZ

**Index**
- `idx_interview_sessions_user_id` : user_id
- `idx_interview_sessions_status` : status

**Policies RLS**
- `Users can access own interview_sessions` : ALL sur auth.uid() = user_id

**TTL** : Aucun

**Storage** : PostgreSQL

---

#### premium_interview_sessions

**Description** : Sessions d'entretien premium

**Colonnes**
- `id` : UUID (PK)
- `user_id` : UUID (FK vers profiles)
- `job_title` : TEXT
- `company` : TEXT
- `persona` : recruiter_persona (ENUM)
- `difficulty` : TEXT (CHECK: normal/hard/elite)
- `phase` : interview_phase (ENUM, DEFAULT 'intro')
- `stress_level` : INTEGER (DEFAULT 10)
- `technical_score` : INTEGER (DEFAULT 0)
- `coherence_score` : INTEGER (DEFAULT 0)
- `communication_score` : INTEGER (DEFAULT 0)
- `confidence_score` : INTEGER (DEFAULT 0)
- `stress_score` : INTEGER (DEFAULT 0)
- `tags` : JSONB (DEFAULT '[]')
- `transcript` : JSONB (DEFAULT '[]')
- `memory` : JSONB (DEFAULT '{}')
- `is_processing` : BOOLEAN (DEFAULT false)
- `created_at` : TIMESTAMPTZ
- `updated_at` : TIMESTAMPTZ

**Index**
- `idx_premium_sessions_user` : user_id

**Policies RLS**
- `Users can access own premium_interview_sessions` : ALL sur auth.uid() = user_id

**TTL** : Aucun

**Storage** : PostgreSQL

---

#### credit_usage

**Description** : Log d'utilisation des crédits

**Colonnes**
- `id` : UUID (PK)
- `user_id` : UUID (FK vers profiles)
- `amount` : INTEGER
- `reason` : TEXT
- `tokens_used` : INTEGER (DEFAULT 0)
- `estimated_cost_eur` : DECIMAL(10,6) (DEFAULT 0)
- `metadata` : JSONB (DEFAULT '{}')
- `created_at` : TIMESTAMPTZ

**Index**
- `idx_credit_usage_user_id` : user_id
- `idx_credit_usage_created_at` : created_at DESC

**Policies RLS**
- `Users can access own credit_usage` : SELECT sur auth.uid() = user_id
- `Service role can insert credit_usage` : INSERT sur true

**TTL** : Aucun

**Storage** : PostgreSQL

---

#### stripe_events

**Description** : Événements Stripe (idempotence)

**Colonnes**
- `id` : UUID (PK)
- `event_id` : TEXT (UNIQUE)
- `user_id` : UUID (FK vers profiles)
- `credits_added` : INTEGER
- `processed_at` : TIMESTAMPTZ
- `created_at` : TIMESTAMPTZ

**Index**
- `idx_stripe_events_user_id` : user_id
- `idx_stripe_events_processed_at` : processed_at DESC
- `stripe_events_event_id_key` : UNIQUE sur event_id

**Policies RLS**
- `Service role can insert stripe_events` : INSERT sur true

**TTL** : Aucun

**Storage** : PostgreSQL

---

#### credit_transactions

**Description** : Transactions de crédits (système de lock)

**Colonnes**
- `id` : UUID (PK)
- `idempotency_key` : TEXT (UNIQUE)
- `user_id` : UUID (FK vers profiles)
- `amount` : INTEGER (CHECK: amount > 0)
- `action` : TEXT
- `state` : tx_state (ENUM, DEFAULT 'reserved')
- `tokens_used` : INTEGER (DEFAULT 0)
- `created_at` : TIMESTAMPTZ
- `updated_at` : TIMESTAMPTZ

**Index**
- `idx_credit_tx_cleanup` : state, created_at
- `idx_credit_tx_user_state` : user_id, state, created_at DESC

**Policies RLS**
- `Service role can insert credit_transactions` : INSERT sur true

**TTL** : 5 minutes (cleanup automatique)

**Storage** : PostgreSQL

---

### Storage

#### Bucket: resumes

**Description** : Stockage des fichiers CV

**Policies RLS**
- `Users can upload resumes` : INSERT sur bucket_id = 'resumes' AND auth.uid() = owner
- `Users can view own resumes` : SELECT sur bucket_id = 'resumes' AND auth.uid() = owner
- `Users can delete own resumes` : DELETE sur bucket_id = 'resumes' AND auth.uid() = owner

**TTL** : Aucun

**Storage** : Supabase Storage

---

### Functions

#### deduct_credits_atomic

**Description** : Déduction atomique de crédits

**Paramètres**
- `uid` : UUID
- `amt` : INTEGER

**Retour** : INTEGER (nouveaux crédits)

**Sécurité** : SECURITY DEFINER

**Lock** : FOR UPDATE sur profiles

---

#### add_credits_atomic

**Description** : Ajout atomique de crédits

**Paramètres**
- `uid` : UUID
- `amt` : INTEGER

**Retour** : INTEGER (nouveaux crédits)

**Sécurité** : SECURITY DEFINER

---

#### process_stripe_payment

**Description** : Traitement transactionnel de Stripe

**Paramètres**
- `p_event_id` : TEXT
- `p_user_id` : UUID
- `p_credits` : INTEGER
- `p_amount_cents` : INTEGER
- `p_pack_name` : TEXT

**Retour** : JSONB

**Sécurité** : SECURITY DEFINER

**Idempotence** : UNIQUE sur stripe_events.event_id

---

#### reserve_credits_atomic

**Description** : Réservation (lock) atomique de crédits

**Paramètres**
- `p_user_id` : UUID
- `p_amount` : INTEGER
- `p_action` : TEXT
- `p_idemp_key` : TEXT

**Retour** : UUID (transaction ID)

**Sécurité** : SECURITY DEFINER

**Lock** : FOR UPDATE sur profiles

---

#### commit_credits_atomic

**Description** : Commit (validation) de transaction

**Paramètres**
- `p_tx_id` : UUID
- `p_tokens` : INTEGER (DEFAULT 0)

**Retour** : VOID

**Sécurité** : SECURITY DEFINER

**Lock** : FOR UPDATE sur credit_transactions

---

#### rollback_credits_atomic

**Description** : Rollback (remboursement) de transaction

**Paramètres**
- `p_tx_id` : UUID
- `p_reason` : TEXT

**Retour** : VOID

**Sécurité** : SECURITY DEFINER

**Lock** : FOR UPDATE sur credit_transactions

---

#### cleanup_expired_transactions

**Description** : Nettoyage des transactions expirées (cron)

**Paramètres**
- `p_minutes_old` : INTEGER (DEFAULT 5)

**Retour** : INTEGER (nombre de transactions nettoyées)

**Sécurité** : SECURITY DEFINER

---

### Enums

#### recruiter_persona

**Valeurs**
- `big_tech_senior`
- `startup_founder`
- `corporate_hr`
- `technical_lead`
- `aggressive_recruiter`

---

#### interview_phase

**Valeurs**
- `intro`
- `cv_deep_dive`
- `technical_case`
- `behavioral`
- `pressure_test`
- `closing`

---

#### tx_state

**Valeurs**
- `reserved`
- `completed`
- `failed`
- `expired`

---

## Redis

### Usage

#### Rate Limiting

**Provider** : Upstash Redis

**Configuration**
- `UPSTASH_REDIS_REST_URL` : URL Redis
- `UPSTASH_REDIS_REST_TOKEN` : Token Redis

**Limiters**
- `cvRewriteLimiter` : 5/min
- `interviewStartLimiter` : 10/min
- `premiumContinueLimiter` : 30/min
- `executiveSimulateLimiter` : 3/min

**Strategy** : Sliding window

**Fichier** : `lib/security/rate-limit.ts`

---

#### Session Cache

**Description** : Cache des sessions (non implémenté en production)

**Implementation** : In-memory (MemorySessionRegistry)

**Fichier** : `sil/services/memory-session-registry.ts`

**Note** : Production utiliserait Redis/Postgres

---

#### Report Cache

**Description** : Cache des rapports (non implémenté en production)

**Implementation** : In-memory (RedisReportCache)

**Fichier** : `sil/services/cache/report-cache.ts`

**Note** : Production utiliserait Redis

---

#### Event Store

**Description** : Event Store pour Event Sourcing (non implémenté)

**Implementation** : Redis Streams (planifié)

**Fichier** : `docs/BLUEPRINT_V3_EVENTS.md`

**Note** : Architecture définie mais pas implémentée

---

### Caches

#### In-memory

**Description** : Cache en mémoire pour les tests

**Implementation** : Map

**Fichiers**
- `sil/services/cache/session-cache.ts`
- `sil/services/cache/report-cache.ts`

**Note** : Non utilisé en production

---

## Caches

### Application Cache

#### Redis Cache

**Description** : Cache Redis pour les données d'application

**Usage**
- Rate limiting
- Session cache (planifié)
- Report cache (planifié)
- Event store (planifié)

**TTL** : Variable (dépend du type de donnée)

**Storage** : Upstash Redis

---

### Database Cache

#### Query Cache

**Description** : Cache des requêtes Supabase

**Implementation** : Non implémenté

**Note** : Supabase gère son propre cache

---

## Index

### Supabase Indexes

#### profiles
- `id` : Primary Key
- `email` : Unique Index

#### cvs
- `idx_cvs_user_id` : user_id

#### ats_reports
- `idx_ats_reports_user_id` : user_id
- `idx_ats_reports_cv_id` : cv_id

#### interview_sessions
- `idx_interview_sessions_user_id` : user_id
- `idx_interview_sessions_status` : status

#### premium_interview_sessions
- `idx_premium_sessions_user` : user_id

#### credit_usage
- `idx_credit_usage_user_id` : user_id
- `idx_credit_usage_created_at` : created_at DESC

#### stripe_events
- `idx_stripe_events_user_id` : user_id
- `idx_stripe_events_processed_at` : processed_at DESC
- `stripe_events_event_id_key` : UNIQUE sur event_id

#### credit_transactions
- `idx_credit_tx_cleanup` : state, created_at
- `idx_credit_tx_user_state` : user_id, state, created_at DESC

---

## TTL

### Supabase

**Tables** : Aucun TTL (données persistantes)

**Storage** : Aucun TTL (données persistantes)

---

### Redis

**Rate Limiting** : Variable (dépend du limiter)

**Session Cache** : Non implémenté

**Report Cache** : Non implémenté

**Event Store** : 7 jours (planifié)

---

## Policies

### RLS Policies

#### profiles
- `Users can access own profile` : ALL sur auth.uid() = id

#### cvs
- `Users can access own cvs` : ALL sur auth.uid() = user_id

#### ats_reports
- `Users can access own ats_reports` : ALL sur auth.uid() = user_id

#### interview_sessions
- `Users can access own interview_sessions` : ALL sur auth.uid() = user_id

#### premium_interview_sessions
- `Users can access own premium_interview_sessions` : ALL sur auth.uid() = user_id

#### credit_usage
- `Users can access own credit_usage` : SELECT sur auth.uid() = user_id
- `Service role can insert credit_usage` : INSERT sur true

#### stripe_events
- `Service role can insert stripe_events` : INSERT sur true

#### credit_transactions
- `Service role can insert credit_transactions` : INSERT sur true

---

### Storage Policies

#### resumes
- `Users can upload resumes` : INSERT sur bucket_id = 'resumes' AND auth.uid() = owner
- `Users can view own resumes` : SELECT sur bucket_id = 'resumes' AND auth.uid() = owner
- `Users can delete own resumes` : DELETE sur bucket_id = 'resumes' AND auth.uid() = owner

---

## Storage

### Supabase Storage

#### Bucket: resumes

**Description** : Stockage des fichiers CV

**Public** : false

**Policies** : RLS sur owner

**Storage** : Supabase Storage (S3-compatible)

---

## Blob

### Supabase Storage

#### resumes

**Description** : Fichiers CV (PDF, DOCX, etc.)

**Format** : Binary

**Storage** : Supabase Storage

---

## JSON

### Supabase JSONB Columns

#### ats_reports
- `matched_keywords` : JSONB (DEFAULT '[]')
- `missing_keywords` : JSONB (DEFAULT '[]')
- `suggestions` : JSONB (DEFAULT '[]')

#### interview_sessions
- `questions` : JSONB
- `answers` : JSONB (DEFAULT '[]')
- `feedback` : JSONB

#### premium_interview_sessions
- `tags` : JSONB (DEFAULT '[]')
- `transcript` : JSONB (DEFAULT '[]')
- `memory` : JSONB (DEFAULT '{}')

#### credit_usage
- `metadata` : JSONB (DEFAULT '{}')

---

## Conclusion

### Points forts

1. **Schéma bien structuré** : Tables clairement définies avec des relations
2. **RLS activé** : Row Level Security sur toutes les tables
3. **Atomicité** : Fonctions atomiques pour les crédits
4. **Idempotence** : Stripe events avec idempotence
5. **Indexation** : Indexes sur les colonnes fréquemment queryées

### Points faibles

1. **Pas de TTL sur les tables** : Données persistantes sans expiration
2. **Pas de partitionnement** : Tables non partitionnées pour la scalabilité
3. **Pas de compression** : JSONB non compressé
4. **Pas de cache Redis** : Cache Redis non implémenté
5. **Pas de Event Store** : Event Store planifié mais pas implémenté

### Recommandations

1. **Ajouter TTL** : Sur les tables temporaires (credit_transactions)
2. **Implémenter Redis Cache** : Pour les sessions et rapports
3. **Implémenter Event Store** : Pour l'Event Sourcing
4. **Compresser JSONB** : Pour réduire la taille des données
5. **Partitionner les tables** : Pour la scalabilité

**Prochaine phase** : Audit Performance
