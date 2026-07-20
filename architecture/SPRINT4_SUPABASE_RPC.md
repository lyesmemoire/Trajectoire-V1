# Sprint 4 - Optimisation Supabase - RPC Functions

## Overview
Ce document contient les fonctions RPC PostgreSQL pour fusionner les requêtes et optimiser les opérations multi-étapes.

## Fonction: get_session_with_message_count

### Description
Récupère une session et le nombre de messages en une seule requête pour éviter le problème N+1.

### SQL
```sql
CREATE OR REPLACE FUNCTION get_session_with_message_count(p_session_id UUID)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_session JSON;
  v_message_count INTEGER;
BEGIN
  -- Get session data
  SELECT json_build_object(
    'id', id,
    'user_id', user_id,
    'job_title', job_title,
    'level', level,
    'interview_type', interview_type,
    'duration_seconds', duration_seconds,
    'status', status,
    'started_at', started_at,
    'completed_at', completed_at,
    'created_at', created_at,
    'updated_at', updated_at,
    'version', version
  ) INTO v_session
  FROM interview_sessions
  WHERE id = p_session_id;
  
  -- Get message count
  SELECT COUNT(*) INTO v_message_count
  FROM interview_messages
  WHERE session_id = p_session_id;
  
  -- Return combined data
  RETURN json_build_object(
    'session', v_session,
    'message_count', v_message_count
  );
END;
$$;
```

---

## Fonction: get_session_with_messages

### Description
Récupère une session et ses messages en une seule requête pour éviter le problème N+1.

### SQL
```sql
CREATE OR REPLACE FUNCTION get_session_with_messages(
  p_session_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_session JSON;
  v_messages JSON;
BEGIN
  -- Get session data
  SELECT json_build_object(
    'id', id,
    'user_id', user_id,
    'job_title', job_title,
    'level', level,
    'interview_type', interview_type,
    'duration_seconds', duration_seconds,
    'status', status,
    'started_at', started_at,
    'completed_at', completed_at,
    'created_at', created_at,
    'updated_at', updated_at,
    'version', version
  ) INTO v_session
  FROM interview_sessions
  WHERE id = p_session_id;
  
  -- Get messages with pagination
  SELECT json_agg(
    json_build_object(
      'id', id,
      'session_id', session_id,
      'role', role,
      'content', content,
      'created_at', created_at,
      'version', version
    )
  ) INTO v_messages
  FROM (
    SELECT id, session_id, role, content, created_at, version
    FROM interview_messages
    WHERE session_id = p_session_id
    ORDER BY created_at ASC
    LIMIT p_limit
    OFFSET p_offset
  ) subquery;
  
  -- Return combined data
  RETURN json_build_object(
    'session', v_session,
    'messages', COALESCE(v_messages, '[]'::json)
  );
END;
$$;
```

---

## Fonction: get_user_quota_summary

### Description
Récupère tous les quotas d'un utilisateur en une seule requête.

### SQL
```sql
CREATE OR REPLACE FUNCTION get_user_quota_summary(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_quotas JSON;
BEGIN
  -- Get all quotas for user
  SELECT json_agg(
    json_build_object(
      'quota_type', quota_type,
      'quota_used', quota_used,
      'quota_limit', quota_limit,
      'period_start', period_start,
      'period_end', period_end
    )
  ) INTO v_quotas
  FROM user_quotas
  WHERE user_id = p_user_id
    AND period_start <= NOW()
    AND period_end > NOW();
  
  -- Return quotas
  RETURN json_build_object(
    'quotas', COALESCE(v_quotas, '[]'::json)
  );
END;
$$;
```

---

## Fonction: get_user_sessions_with_stats

### Description
Récupère les sessions d'un utilisateur avec leurs statistiques (nombre de messages, statut) en une seule requête.

### SQL
```sql
CREATE OR REPLACE FUNCTION get_user_sessions_with_stats(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_sessions JSON;
BEGIN
  -- Get sessions with message counts
  SELECT json_agg(
    json_build_object(
      'id', s.id,
      'user_id', s.user_id,
      'job_title', s.job_title,
      'level', s.level,
      'interview_type', s.interview_type,
      'duration_seconds', s.duration_seconds,
      'status', s.status,
      'started_at', s.started_at,
      'completed_at', s.completed_at,
      'created_at', s.created_at,
      'updated_at', s.updated_at,
      'version', s.version,
      'message_count', COALESCE(m.message_count, 0)
    )
  ) INTO v_sessions
  FROM (
    SELECT 
      s.*,
      (SELECT COUNT(*) FROM interview_messages WHERE session_id = s.id) as message_count
    FROM interview_sessions s
    WHERE s.user_id = p_user_id
    ORDER BY s.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  ) s;
  
  -- Return sessions
  RETURN json_build_object(
    'sessions', COALESCE(v_sessions, '[]'::json)
  );
END;
$$;
```

---

## Fonction: get_session_report

### Description
Récupère une session et son rapport en une seule requête.

### SQL
```sql
CREATE OR REPLACE FUNCTION get_session_report(p_session_id UUID)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_session JSON;
  v_report JSON;
BEGIN
  -- Get session data
  SELECT json_build_object(
    'id', id,
    'user_id', user_id,
    'job_title', job_title,
    'level', level,
    'interview_type', interview_type,
    'duration_seconds', duration_seconds,
    'status', status,
    'started_at', started_at,
    'completed_at', completed_at,
    'created_at', created_at,
    'updated_at', updated_at,
    'version', version
  ) INTO v_session
  FROM interview_sessions
  WHERE id = p_session_id;
  
  -- Get report data
  SELECT json_build_object(
    'id', id,
    'session_id', session_id,
    'overall_score', overall_score,
    'communication', communication,
    'technical', technical,
    'confidence', confidence,
    'strengths', strengths,
    'improvements', improvements,
    'summary', summary,
    'recommendation', recommendation,
    'created_at', created_at,
    'updated_at', updated_at,
    'version', version
  ) INTO v_report
  FROM reports
  WHERE session_id = p_session_id;
  
  -- Return combined data
  RETURN json_build_object(
    'session', v_session,
    'report', v_report
  );
END;
$$;
```

---

## Utilisation

### get_session_with_message_count
```typescript
const { data } = await supabase.rpc("get_session_with_message_count", {
  p_session_id: sessionId,
});
```

### get_session_with_messages
```typescript
const { data } = await supabase.rpc("get_session_with_messages", {
  p_session_id: sessionId,
  p_limit: 20,
  p_offset: 0,
});
```

### get_user_quota_summary
```typescript
const { data } = await supabase.rpc("get_user_quota_summary", {
  p_user_id: userId,
});
```

### get_user_sessions_with_stats
```typescript
const { data } = await supabase.rpc("get_user_sessions_with_stats", {
  p_user_id: userId,
  p_limit: 50,
  p_offset: 0,
});
```

### get_session_report
```typescript
const { data } = await supabase.rpc("get_session_report", {
  p_session_id: sessionId,
});
```

---

## Avantages

- **Réduction du nombre de requêtes:** 3 requêtes → 1 requête
- **Réduction de la latence:** Moins de round-trips avec la base de données
- **Meilleure performance:** Les requêtes sont optimisées côté serveur
- **Consistance:** Les données sont récupérées dans une seule transaction
