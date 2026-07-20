# Sprint 4 - Audit des Index Supabase

## Overview
Ce document contient l'audit des index Supabase pour optimiser les requêtes fréquentes.

## Index Nécessaires

### Table: interview_sessions

#### Index existants (à vérifier)
- PRIMARY KEY sur `id`

#### Index recommandés
```sql
-- Index sur user_id (très fréquent)
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);

-- Index sur status (pour filtrer les sessions actives)
CREATE INDEX idx_interview_sessions_status ON interview_sessions(status);

-- Index composite sur user_id + status (pour les requêtes combinées)
CREATE INDEX idx_interview_sessions_user_status ON interview_sessions(user_id, status);

-- Index sur created_at (pour pagination et tri)
CREATE INDEX idx_interview_sessions_created_at ON interview_sessions(created_at DESC);

-- Index sur updated_at (pour détecter les sessions modifiées récemment)
CREATE INDEX idx_interview_sessions_updated_at ON interview_sessions(updated_at DESC);
```

**Justification:**
- `user_id`: Utilisé dans presque toutes les requêtes de session
- `status`: Utilisé pour filtrer les sessions actives/in_progress
- `user_id + status`: Optimise les requêtes combinées (sessions actives d'un utilisateur)
- `created_at`: Pour pagination et tri chronologique
- `updated_at`: Pour détecter les sessions modifiées récemment

---

### Table: interview_messages

#### Index existants (à vérifier)
- PRIMARY KEY sur `id`

#### Index recommandés
```sql
-- Index sur session_id (très fréquent)
CREATE INDEX idx_interview_messages_session_id ON interview_messages(session_id);

-- Index sur created_at (pour pagination et tri)
CREATE INDEX idx_interview_messages_created_at ON interview_messages(created_at DESC);

-- Index composite sur session_id + created_at (pour récupérer les messages d'une session dans l'ordre)
CREATE INDEX idx_interview_messages_session_created ON interview_messages(session_id, created_at DESC);

-- Index sur role (pour filtrer user vs assistant)
CREATE INDEX idx_interview_messages_role ON interview_messages(role);
```

**Justification:**
- `session_id`: Utilisé dans getBySessionId (très fréquent)
- `created_at`: Pour pagination et tri chronologique
- `session_id + created_at`: Optimise la récupération des messages d'une session
- `role`: Pour filtrer les messages par type (user/assistant)

---

### Table: reports

#### Index existants (à vérifier)
- PRIMARY KEY sur `id`
- UNIQUE sur `session_id` (déjà recommandé dans Sprint 2.5)

#### Index recommandés
```sql
-- Index sur session_id (déjà UNIQUE, mais bon pour performance)
-- L'index UNIQUE existe déjà, pas besoin de créer un index supplémentaire

-- Index sur created_at (pour pagination et tri)
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Index sur overall_score (pour filtrer par score)
CREATE INDEX idx_reports_overall_score ON reports(overall_score);

-- Index composite sur session_id + created_at (pour les requêtes combinées)
CREATE INDEX idx_reports_session_created ON reports(session_id, created_at DESC);
```

**Justification:**
- `session_id`: Déjà UNIQUE (index automatique)
- `created_at`: Pour pagination et tri chronologique
- `overall_score`: Pour filtrer les rapports par score
- `session_id + created_at`: Optimise les requêtes combinées

---

### Table: user_quotas

#### Index existants (à vérifier)
- PRIMARY KEY sur `id`
- UNIQUE sur `(user_id, quota_type, period_start)` (déjà recommandé dans Sprint 2.5)

#### Index recommandés
```sql
-- Index sur user_id (pour les requêtes de quota par utilisateur)
CREATE INDEX idx_user_quotas_user_id ON user_quotas(user_id);

-- Index sur period_end (pour le cleanup des quotas expirés)
CREATE INDEX idx_user_quotas_period_end ON user_quotas(period_end);

-- Index composite sur user_id + quota_type (pour les requêtes combinées)
CREATE INDEX idx_user_quotas_user_type ON user_quotas(user_id, quota_type);
```

**Justification:**
- `user_id`: Pour les requêtes de quota par utilisateur
- `period_end`: Pour le cleanup automatique des quotas expirés
- `user_id + quota_type`: Optimise les requêtes combinées

---

### Table: profiles

#### Index existants (à vérifier)
- PRIMARY KEY sur `id`
- UNIQUE sur `email` (probablement existant)

#### Index recommandés
```sql
-- Index sur email (déjà UNIQUE, mais bon pour performance)
-- L'index UNIQUE existe déjà, pas besoin de créer un index supplémentaire

-- Index sur created_at (pour pagination et tri)
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- Index sur updated_at (pour détecter les profils modifiés récemment)
CREATE INDEX idx_profiles_updated_at ON profiles(updated_at DESC);
```

**Justification:**
- `email`: Déjà UNIQUE (index automatique)
- `created_at`: Pour pagination et tri chronologique
- `updated_at`: Pour détecter les profils modifiés récemment

---

### Table: idempotency

#### Index existants (à vérifier)
- PRIMARY KEY sur `id`
- UNIQUE sur `idempotency_key` (déjà recommandé dans Sprint 2.5)

#### Index recommandés
```sql
-- Index sur user_id (pour les requêtes d'idempotency par utilisateur)
CREATE INDEX idx_idempotency_user_id ON idempotency(user_id);

-- Index sur expires_at (pour le cleanup automatique)
CREATE INDEX idx_idempotency_expires_at ON idempotency(expires_at);

-- Index composite sur user_id + expires_at (pour les requêtes combinées)
CREATE INDEX idx_idempotency_user_expires ON idempotency(user_id, expires_at);
```

**Justification:**
- `user_id`: Pour les requêtes d'idempotency par utilisateur
- `expires_at`: Pour le cleanup automatique des enregistrements expirés
- `user_id + expires_at`: Optimise les requêtes combinées

---

## Index Composite vs Index Simples

### Quand utiliser des index composites
- Les colonnes sont souvent utilisées ensemble dans les requêtes
- L'ordre des colonnes dans l'index est important (colonne la plus sélective en premier)
- Exemple: `user_id + status` est meilleur que `status + user_id` si chaque utilisateur a peu de sessions

### Quand utiliser des index simples
- Les colonnes sont utilisées indépendamment
- Pour le tri (ORDER BY)
- Pour le filtrage simple (WHERE)

---

## Recommandations

### 1. Créer les index critiques en priorité
- `idx_interview_sessions_user_id` (très fréquent)
- `idx_interview_messages_session_id` (très fréquent)
- `idx_interview_messages_session_created` (optimise getBySessionId)
- `idx_user_quotas_period_end` (pour cleanup)

### 2. Créer les index secondaires
- `idx_interview_sessions_status`
- `idx_interview_sessions_created_at`
- `idx_reports_created_at`
- `idx_idempotency_expires_at`

### 3. Surveiller l'utilisation des index
- Utiliser `EXPLAIN ANALYZE` pour vérifier que les index sont utilisés
- Supprimer les index non utilisés pour économiser l'espace
- Surveiller la taille des index (ils peuvent devenir volumineux)

### 4. Index partiels (si nécessaire)
Pour les tables très volumineuses, utiliser des index partiels:
```sql
CREATE INDEX idx_sessions_active ON interview_sessions(user_id, status)
WHERE status = 'in_progress';
```

### 5. Index sur expressions (si nécessaire)
Pour les requêtes avec des expressions complexes:
```sql
CREATE INDEX idx_messages_date_trunc ON interview_messages(
  DATE_TRUNC('day', created_at)
);
```
