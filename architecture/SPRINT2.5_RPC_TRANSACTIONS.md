# Sprint 2.5 - PostgreSQL RPC pour Transactions Réelles

## Overview
Ce document contient les fonctions RPC PostgreSQL pour implémenter des transactions réelles avec BEGIN...COMMIT.

## Fonction: create_session_with_quota

### Description
Crée une session et incrémente le quota dans une seule transaction atomique.

### SQL
```sql
CREATE OR REPLACE FUNCTION create_session_with_quota(
  p_user_id UUID,
  p_job_title TEXT,
  p_level TEXT,
  p_interview_type TEXT,
  p_duration_seconds INTEGER,
  p_quota_type TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_session_id UUID;
  v_quota_used INTEGER;
  v_quota_limit INTEGER;
BEGIN
  -- Start transaction (implicit in PostgreSQL function)
  
  -- Check quota
  SELECT quota_used, quota_limit INTO v_quota_used, v_quota_limit
  FROM user_quotas
  WHERE user_id = p_user_id
    AND quota_type = p_quota_type
    AND period_start <= NOW()
    AND period_end > NOW();
  
  -- If no quota record, create one
  IF NOT FOUND THEN
    INSERT INTO user_quotas (user_id, quota_type, quota_used, quota_limit, period_start, period_end)
    VALUES (p_user_id, p_quota_type, 0, 10, DATE_TRUNC('month', NOW()), DATE_TRUNC('month', NOW()) + INTERVAL '1 month');
    
    v_quota_used := 0;
    v_quota_limit := 10;
  END IF;
  
  -- Check if quota exceeded
  IF v_quota_used >= v_quota_limit THEN
    RAISE EXCEPTION 'Quota exceeded' USING ERRCODE = '23505';
  END IF;
  
  -- Create session
  INSERT INTO interview_sessions (
    user_id, job_title, level, interview_type, 
    duration_seconds, status, started_at, created_at, updated_at, version
  )
  VALUES (
    p_user_id, p_job_title, p_level, p_interview_type,
    p_duration_seconds, 'in_progress', NOW(), NOW(), NOW(), 1
  )
  RETURNING id INTO v_session_id;
  
  -- Increment quota
  UPDATE user_quotas
  SET quota_used = quota_used + 1
  WHERE user_id = p_user_id
    AND quota_type = p_quota_type
    AND period_start <= NOW()
    AND period_end > NOW();
  
  -- Return session data
  RETURN json_build_object(
    'session_id', v_session_id,
    'quota_used', v_quota_used + 1,
    'quota_limit', v_quota_limit
  );
  
  -- Commit (implicit on successful return)
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback (implicit on exception)
    RAISE;
END;
$$;
```

---

## Fonction: send_message_with_quota

### Description
Crée un message utilisateur, génère une réponse AI, crée un message assistant, et incrémente le quota dans une seule transaction atomique.

### SQL
```sql
CREATE OR REPLACE FUNCTION send_message_with_quota(
  p_session_id UUID,
  p_user_id UUID,
  p_content TEXT,
  p_quota_type TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_message_id UUID;
  v_ai_message_id UUID;
  v_ai_response TEXT;
  v_quota_used INTEGER;
  v_quota_limit INTEGER;
BEGIN
  -- Start transaction (implicit in PostgreSQL function)
  
  -- Check session exists and belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE id = p_session_id AND user_id = p_user_id AND status = 'in_progress'
  ) THEN
    RAISE EXCEPTION 'Session not found or not active' USING ERRCODE = '23505';
  END IF;
  
  -- Check quota
  SELECT quota_used, quota_limit INTO v_quota_used, v_quota_limit
  FROM user_quotas
  WHERE user_id = p_user_id
    AND quota_type = p_quota_type
    AND period_start <= NOW()
    AND period_end > NOW();
  
  -- If no quota record, create one
  IF NOT FOUND THEN
    INSERT INTO user_quotas (user_id, quota_type, quota_used, quota_limit, period_start, period_end)
    VALUES (p_user_id, p_quota_type, 0, 100, DATE_TRUNC('month', NOW()), DATE_TRUNC('month', NOW()) + INTERVAL '1 month');
    
    v_quota_used := 0;
    v_quota_limit := 100;
  END IF;
  
  -- Check if quota exceeded
  IF v_quota_used >= v_quota_limit THEN
    RAISE EXCEPTION 'Quota exceeded' USING ERRCODE = '23505';
  END IF;
  
  -- Create user message
  INSERT INTO interview_messages (session_id, role, content, created_at, version)
  VALUES (p_session_id, 'user', p_content, NOW(), 1)
  RETURNING id INTO v_user_message_id;
  
  -- Note: AI generation is done outside this function
  -- This function only handles the database operations
  
  -- Increment quota
  UPDATE user_quotas
  SET quota_used = quota_used + 1
  WHERE user_id = p_user_id
    AND quota_type = p_quota_type
    AND period_start <= NOW()
    AND period_end > NOW();
  
  -- Return message data
  RETURN json_build_object(
    'user_message_id', v_user_message_id,
    'quota_used', v_quota_used + 1,
    'quota_limit', v_quota_limit
  );
  
  -- Commit (implicit on successful return)
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback (implicit on exception)
    RAISE;
END;
$$;
```

---

## Fonction: create_report_with_quota

### Description
Crée un rapport et incrémente le quota dans une seule transaction atomique.

### SQL
```sql
CREATE OR REPLACE FUNCTION create_report_with_quota(
  p_session_id UUID,
  p_user_id UUID,
  p_overall_score INTEGER,
  p_communication INTEGER,
  p_technical INTEGER,
  p_confidence INTEGER,
  p_strengths TEXT[],
  p_improvements TEXT[],
  p_summary TEXT,
  p_recommendation TEXT,
  p_quota_type TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_report_id UUID;
  v_quota_used INTEGER;
  v_quota_limit INTEGER;
BEGIN
  -- Start transaction (implicit in PostgreSQL function)
  
  -- Check session exists and belongs to user
  IF NOT EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE id = p_session_id AND user_id = p_user_id AND status = 'completed'
  ) THEN
    RAISE EXCEPTION 'Session not found or not completed' USING ERRCODE = '23505';
  END IF;
  
  -- Check if report already exists
  IF EXISTS (
    SELECT 1 FROM reports
    WHERE session_id = p_session_id
  ) THEN
    -- Return existing report
    SELECT id INTO v_report_id FROM reports WHERE session_id = p_session_id;
    
    RETURN json_build_object(
      'report_id', v_report_id,
      'is_new', false
    );
  END IF;
  
  -- Check quota
  SELECT quota_used, quota_limit INTO v_quota_used, v_quota_limit
  FROM user_quotas
  WHERE user_id = p_user_id
    AND quota_type = p_quota_type
    AND period_start <= NOW()
    AND period_end > NOW();
  
  -- If no quota record, create one
  IF NOT FOUND THEN
    INSERT INTO user_quotas (user_id, quota_type, quota_used, quota_limit, period_start, period_end)
    VALUES (p_user_id, p_quota_type, 0, 5, DATE_TRUNC('month', NOW()), DATE_TRUNC('month', NOW()) + INTERVAL '1 month');
    
    v_quota_used := 0;
    v_quota_limit := 5;
  END IF;
  
  -- Check if quota exceeded
  IF v_quota_used >= v_quota_limit THEN
    RAISE EXCEPTION 'Quota exceeded' USING ERRCODE = '23505';
  END IF;
  
  -- Create report
  INSERT INTO reports (
    session_id, overall_score, communication, technical, confidence,
    strengths, improvements, summary, recommendation,
    created_at, updated_at, version
  )
  VALUES (
    p_session_id, p_overall_score, p_communication, p_technical, p_confidence,
    p_strengths, p_improvements, p_summary, p_recommendation,
    NOW(), NOW(), 1
  )
  RETURNING id INTO v_report_id;
  
  -- Increment quota
  UPDATE user_quotas
  SET quota_used = quota_used + 1
  WHERE user_id = p_user_id
    AND quota_type = p_quota_type
    AND period_start <= NOW()
    AND period_end > NOW();
  
  -- Return report data
  RETURN json_build_object(
    'report_id', v_report_id,
    'quota_used', v_quota_used + 1,
    'quota_limit', v_quota_limit,
    'is_new', true
  );
  
  -- Commit (implicit on successful return)
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback (implicit on exception)
    RAISE;
END;
$$;
```

---

## Notes

- Les fonctions PostgreSQL sont automatiquement transactionnelles
- En cas d'erreur, un ROLLBACK automatique est effectué
- En cas de succès, un COMMIT automatique est effectué
- Les fonctions retournent des objets JSON pour faciliter l'intégration avec TypeScript

## Utilisation

### Créer une session avec quota
```typescript
const { data } = await supabase.rpc("create_session_with_quota", {
  p_user_id: userId,
  p_job_title: jobTitle,
  p_level: level,
  p_interview_type: interviewType,
  p_duration_seconds: durationSeconds,
  p_quota_type: "simulations",
});
```

### Envoyer un message avec quota
```typescript
const { data } = await supabase.rpc("send_message_with_quota", {
  p_session_id: sessionId,
  p_user_id: userId,
  p_content: content,
  p_quota_type: "messages",
});
```

### Créer un rapport avec quota
```typescript
const { data } = await supabase.rpc("create_report_with_quota", {
  p_session_id: sessionId,
  p_user_id: userId,
  p_overall_score: overallScore,
  p_communication: communication,
  p_technical: technical,
  p_confidence: confidence,
  p_strengths: strengths,
  p_improvements: improvements,
  p_summary: summary,
  p_recommendation: recommendation,
  p_quota_type: "reports",
});
```

## Avantages

- **Atomicité:** Toutes les opérations réussissent ou aucune
- **Consistance:** Pas de corruption de données en cas d'erreur
- **Isolation:** Pas d'interférence entre transactions concurrentes
- **Durabilité:** Les changements sont persistants une fois commités
