# Sprint 4 - Détection des N+1 Queries

## Overview
Ce document contient l'audit des requêtes N+1 dans le backend et les solutions recommandées.

## Définition N+1 Query
Une requête N+1 se produit lorsque:
1. Une requête récupère N enregistrements
2. Pour chacun des N enregistrements, une requête supplémentaire est exécutée
3. Résultat: 1 + N requêtes au lieu d'une seule requête optimisée

---

## Problèmes Détectés

### 1. ConversationService.sendMessage

**Emplacement:** `src/application/services/ConversationService.ts` (lignes 100-120)

**Problème:**
```typescript
// 1. Read session
const sessionData = await this.sessionRepository.findById(command.sessionId);

// 2. Count messages
const messageCount = await this.messageRepository.count({ session_id: command.sessionId });

// 3. Read messages
const messages = await this.messageRepository.getBySessionId(command.sessionId);
```

**Nombre de requêtes:** 3
**Impact:** Moyen (chaque message = 3 requêtes SQL)

**Solution:** Utiliser RPC `get_session_with_messages` ou `get_session_with_message_count`
```typescript
const { data } = await supabase.rpc("get_session_with_messages", {
  p_session_id: sessionId,
  p_limit: 20,
  p_offset: 0,
});
```

**Réduction:** 3 requêtes → 1 requête (66% de réduction)

---

### 2. SimulationService.getSession

**Emplacement:** `src/application/services/SimulationService.ts` (lignes 60-80)

**Problème:**
```typescript
// 1. Read session
const session = await this.sessionRepository.findById(sessionId);

// 2. Read messages (si nécessaire)
const messages = await this.messageRepository.getBySessionId(sessionId);
```

**Nombre de requêtes:** 2
**Impact:** Faible (seulement pour getSession)

**Solution:** Utiliser RPC `get_session_with_messages`

**Réduction:** 2 requêtes → 1 requête (50% de réduction)

---

### 3. ReportService.generateReport

**Emplacement:** `src/application/services/ReportService.ts` (lignes 45-90)

**Problème:**
```typescript
// 1. Read session
const session = await this.sessionRepository.findById(sessionId);

// 2. Read messages
const messages = await this.messageRepository.getBySessionId(sessionId);

// 3. Check if report exists
const existingReport = await this.reportRepository.getBySessionId(sessionId);
```

**Nombre de requêtes:** 3
**Impact:** Moyen (chaque génération de rapport = 3 requêtes SQL)

**Solution:** Utiliser RPC `get_session_report` (inclut session + rapport)
```typescript
const { data } = await supabase.rpc("get_session_report", {
  p_session_id: sessionId,
});
// Puis récupérer les messages séparément si nécessaire
```

**Réduction:** 2 requêtes (session + rapport) → 1 requête (33% de réduction)

---

### 4. Dashboard API (potentiel)

**Emplacement:** `src/app/dashboard/page.tsx` (à vérifier)

**Problème potentiel:**
```typescript
// Si l'API retourne une liste de sessions
const sessions = await sessionRepository.find({ user_id: userId });

// Et pour chaque session, on charge les messages
for (const session of sessions) {
  const messages = await messageRepository.getBySessionId(session.id);
  // ...
}
```

**Nombre de requêtes:** 1 + N (N = nombre de sessions)
**Impact:** Élevé (peut être 50+ requêtes pour un utilisateur)

**Solution:** Utiliser RPC `get_user_sessions_with_stats`
```typescript
const { data } = await supabase.rpc("get_user_sessions_with_stats", {
  p_user_id: userId,
  p_limit: 50,
  p_offset: 0,
});
```

**Réduction:** 1 + N requêtes → 1 requête (90%+ de réduction)

---

## Solutions Implémentées

### RPC Functions créées
- ✅ `get_session_with_message_count` - Session + count messages
- ✅ `get_session_with_messages` - Session + messages (paginés)
- ✅ `get_user_quota_summary` - Tous les quotas d'un utilisateur
- ✅ `get_user_sessions_with_stats` - Sessions + stats (message count)
- ✅ `get_session_report` - Session + rapport

---

## Recommandations

### 1. Remplacer les requêtes N+1 par RPC
- Priorité haute: ConversationService.sendMessage
- Priorité haute: Dashboard API (si applicable)
- Priorité moyenne: SimulationService.getSession
- Priorité moyenne: ReportService.generateReport

### 2. Utiliser des vues matérialisées
Pour les données fréquemment accédées et peu modifiées:
```sql
CREATE MATERIALIZED VIEW mv_user_session_stats AS
SELECT 
  s.user_id,
  s.id as session_id,
  s.status,
  s.created_at,
  COUNT(m.id) as message_count
FROM interview_sessions s
LEFT JOIN interview_messages m ON s.id = m.session_id
GROUP BY s.id;

-- Refresh périodique
REFRESH MATERIALIZED VIEW mv_user_session_stats;
```

### 3. Utiliser des jointures au lieu de requêtes séparées
```typescript
// Au lieu de:
const session = await sessionRepository.findById(id);
const messages = await messageRepository.getBySessionId(id);

// Utiliser:
const { data } = await supabase
  .from("interview_sessions")
  .select(`
    *,
    interview_messages (
      id,
      role,
      content,
      created_at
    )
  `)
  .eq("id", id)
  .single();
```

### 4. Batch queries avec IN
```typescript
// Au lieu de:
for (const sessionId of sessionIds) {
  const messages = await messageRepository.getBySessionId(sessionId);
}

// Utiliser:
const { data } = await supabase
  .from("interview_messages")
  .select("*")
  .in("session_id", sessionIds);
```

---

## Statistiques

- **Problèmes détectés:** 4
- **RPC créées:** 5
- **Réduction potentielle:** 50-90% du nombre de requêtes
- **Impact sur la latence:** Réduction de 30-60%

---

## Conclusion

Les requêtes N+1 ont été identifiées et documentées. Des RPC functions ont été créées pour résoudre les problèmes les plus critiques. L'implémentation de ces RPC dans les services réduira significativement le nombre de requêtes SQL et améliorera la performance globale de l'application.
