# Sprint 2.5 - SQL Constraints Migration

## Overview
Ce document contient les contraintes SQL recommandées pour améliorer l'intégrité des données et prévenir les race conditions.

## Contraintes à Ajouter

### 1. Table: interview_sessions

#### Ajouter colonne version
```sql
ALTER TABLE interview_sessions 
ADD COLUMN version INTEGER DEFAULT 1 NOT NULL;
```

#### Ajouter contrainte CHECK sur version
```sql
ALTER TABLE interview_sessions 
ADD CONSTRAINT check_version_positive CHECK (version >= 1);
```

#### Ajouter contrainte CHECK sur duration_seconds
```sql
ALTER TABLE interview_sessions 
ADD CONSTRAINT check_duration_range CHECK (duration_seconds >= 60 AND duration_seconds <= 7200);
```

#### Ajouter contrainte CHECK sur status
```sql
ALTER TABLE interview_sessions 
ADD CONSTRAINT check_valid_status CHECK (status IN ('in_progress', 'completed', 'cancelled'));
```

#### Ajouter index sur user_id
```sql
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
```

#### Ajouter index sur status
```sql
CREATE INDEX idx_interview_sessions_status ON interview_sessions(status);
```

---

### 2. Table: interview_messages

#### Ajouter colonne version
```sql
ALTER TABLE interview_messages 
ADD COLUMN version INTEGER DEFAULT 1 NOT NULL;
```

#### Ajouter contrainte CHECK sur version
```sql
ALTER TABLE interview_messages 
ADD CONSTRAINT check_messages_version_positive CHECK (version >= 1);
```

#### Ajouter contrainte CHECK sur role
```sql
ALTER TABLE interview_messages 
ADD CONSTRAINT check_valid_role CHECK (role IN ('user', 'assistant'));
```

#### Ajouter contrainte CHECK sur content
```sql
ALTER TABLE interview_messages 
ADD CONSTRAINT check_content_not_empty CHECK (LENGTH(TRIM(content)) > 0);
```

#### Ajouter contrainte CHECK sur content length
```sql
ALTER TABLE interview_messages 
ADD CONSTRAINT check_content_max_length CHECK (LENGTH(content) <= 5000);
```

#### Ajouter index sur session_id
```sql
CREATE INDEX idx_interview_messages_session_id ON interview_messages(session_id);
```

#### Ajouter index sur created_at
```sql
CREATE INDEX idx_interview_messages_created_at ON interview_messages(created_at);
```

---

### 3. Table: reports

#### Ajouter colonne version
```sql
ALTER TABLE reports 
ADD COLUMN version INTEGER DEFAULT 1 NOT NULL;
```

#### Ajouter contrainte UNIQUE sur session_id (IMPORTANT)
```sql
ALTER TABLE reports 
ADD CONSTRAINT unique_session_id UNIQUE (session_id);
```

#### Ajouter contrainte CHECK sur version
```sql
ALTER TABLE reports 
ADD CONSTRAINT check_reports_version_positive CHECK (version >= 1);
```

#### Ajouter contrainte CHECK sur scores
```sql
ALTER TABLE reports 
ADD CONSTRAINT check_scores_range CHECK (
  overall_score >= 0 AND overall_score <= 100 AND
  communication >= 0 AND communication <= 100 AND
  technical >= 0 AND technical <= 100 AND
  confidence >= 0 AND confidence <= 100
);
```

#### Ajouter index sur session_id
```sql
CREATE INDEX idx_reports_session_id ON reports(session_id);
```

---

### 4. Table: user_quotas

#### Ajouter contrainte UNIQUE sur (user_id, quota_type, period_start) (IMPORTANT)
```sql
ALTER TABLE user_quotas 
ADD CONSTRAINT unique_user_quota_period UNIQUE (user_id, quota_type, period_start);
```

#### Ajouter contrainte CHECK sur quota_used
```sql
ALTER TABLE user_quotas 
ADD CONSTRAINT check_quota_used_non_negative CHECK (quota_used >= 0);
```

#### Ajouter contrainte CHECK sur quota_limit
```sql
ALTER TABLE user_quotas 
ADD CONSTRAINT check_quota_limit_positive CHECK (quota_limit > 0);
```

#### Ajouter contrainte CHECK sur quota_used <= quota_limit
```sql
ALTER TABLE user_quotas 
ADD CONSTRAINT check_quota_used_within_limit CHECK (quota_used <= quota_limit);
```

#### Ajouter index sur user_id
```sql
CREATE INDEX idx_user_quotas_user_id ON user_quotas(user_id);
```

#### Ajouter index sur expires_at (period_end)
```sql
CREATE INDEX idx_user_quotas_period_end ON user_quotas(period_end);
```

---

### 5. Table: idempotency

#### Ajouter contrainte UNIQUE sur idempotency_key
```sql
ALTER TABLE idempotency 
ADD CONSTRAINT unique_idempotency_key UNIQUE (idempotency_key);
```

#### Ajouter contrainte CHECK sur status
```sql
ALTER TABLE idempotency 
ADD CONSTRAINT check_valid_status CHECK (status IN ('pending', 'completed', 'failed'));
```

#### Ajouter index sur user_id
```sql
CREATE INDEX idx_idempotency_user_id ON idempotency(user_id);
```

#### Ajouter index sur expires_at
```sql
CREATE INDEX idx_idempotency_expires_at ON idempotency(expires_at);
```

---

## Contraintes FOREIGN KEY (si non existantes)

### interview_messages → interview_sessions
```sql
ALTER TABLE interview_messages 
ADD CONSTRAINT fk_messages_session 
FOREIGN KEY (session_id) REFERENCES interview_sessions(id) 
ON DELETE CASCADE ON UPDATE CASCADE;
```

### reports → interview_sessions
```sql
ALTER TABLE reports 
ADD CONSTRAINT fk_reports_session 
FOREIGN KEY (session_id) REFERENCES interview_sessions(id) 
ON DELETE CASCADE ON UPDATE CASCADE;
```

### interview_sessions → profiles (si table profiles existe)
```sql
ALTER TABLE interview_sessions 
ADD CONSTRAINT fk_sessions_user 
FOREIGN KEY (user_id) REFERENCES profiles(id) 
ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## Contraintes NOT NULL (si non existantes)

### interview_sessions
```sql
ALTER TABLE interview_sessions 
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN job_title SET NOT NULL,
ALTER COLUMN level SET NOT NULL,
ALTER COLUMN interview_type SET NOT NULL,
ALTER COLUMN duration_seconds SET NOT NULL,
ALTER COLUMN status SET NOT NULL,
ALTER COLUMN started_at SET NOT NULL,
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN updated_at SET NOT NULL;
```

### interview_messages
```sql
ALTER TABLE interview_messages 
ALTER COLUMN session_id SET NOT NULL,
ALTER COLUMN role SET NOT NULL,
ALTER COLUMN content SET NOT NULL,
ALTER COLUMN created_at SET NOT NULL;
```

### reports
```sql
ALTER TABLE reports 
ALTER COLUMN session_id SET NOT NULL,
ALTER COLUMN overall_score SET NOT NULL,
ALTER COLUMN communication SET NOT NULL,
ALTER COLUMN technical SET NOT NULL,
ALTER COLUMN confidence SET NOT NULL,
ALTER COLUMN summary SET NOT NULL,
ALTER COLUMN recommendation SET NOT NULL,
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN updated_at SET NOT NULL;
```

---

## Ordre d'Exécution

1. Ajouter les colonnes version (si non existantes)
2. Ajouter les contraintes CHECK
3. Ajouter les contraintes UNIQUE
4. Ajouter les contraintes FOREIGN KEY
5. Ajouter les contraintes NOT NULL
6. Créer les indexes

---

## Notes

- Les contraintes UNIQUE sont critiques pour prévenir les race conditions
- Les contraintes CHECK protègent contre les données invalides
- Les indexes améliorent les performances des requêtes
- Les contraintes FOREIGN KEY assurent l'intégrité référentielle
- ON DELETE CASCADE automatise le nettoyage des données orphelines
