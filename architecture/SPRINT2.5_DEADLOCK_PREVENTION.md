# Sprint 2.5 - Deadlock Prevention

## Overview
Ce document définit l'ordre unique d'accès aux tables pour prévenir les deadlocks sous forte charge.

## Ordre d'Accès aux Tables

### Ordre Hiérarchique (toujours respecter)
```
1. profiles (users)
2. interview_sessions
3. interview_messages
4. reports
5. user_quotas
6. idempotency
7. audit_logs
```

## Règles

### Règle 1: Ordre d'Acquisition
Toujours acquérir les locks dans l'ordre hiérarchique ci-dessus.

**Exemple correct:**
```typescript
// Si vous avez besoin de profiles et interview_sessions
await profilesRepository.findById(userId);
await sessionsRepository.findById(sessionId);
```

**Exemple incorrect:**
```typescript
// Jamais l'inverse!
await sessionsRepository.findById(sessionId);
await profilesRepository.findById(userId);
```

### Règle 2: Ordre de Libération
Libérer les locks dans l'ordre inverse de l'acquisition (LIFO).

**Exemple correct:**
```typescript
try {
  await profilesRepository.findById(userId);
  await sessionsRepository.findById(sessionId);
  await messagesRepository.findBySessionId(sessionId);
} finally {
  // Libérer dans l'ordre inverse
  await releaseLock(messages);
  await releaseLock(sessions);
  await releaseLock(profiles);
}
```

### Règle 3: Timeout sur les Locks
Toujours définir un timeout sur les locks pour éviter les deadlocks infinis.

**Exemple:**
```typescript
const lock = await DistributedLock.acquire(key, 5000); // 5 secondes
```

### Règle 4: Transactions Courtes
Garder les transactions aussi courtes que possible.

**Exemple incorrect:**
```typescript
await transactionManager.execute(async (tx) => {
  const session = await sessionsRepository.findById(sessionId, tx);
  const messages = await messagesRepository.getBySessionId(sessionId, tx);
  const report = await reportService.generateReport(session, messages, tx); // Long!
  await reportRepository.create(report, tx);
});
```

**Exemple correct:**
```typescript
const session = await sessionsRepository.findById(sessionId);
const messages = await messagesRepository.getBySessionId(sessionId);
const report = await reportService.generateReport(session, messages);

await transactionManager.execute(async (tx) => {
  await reportRepository.create(report, tx);
});
```

## Patterns d'Accès par Service

### SimulationService
**Ordre actuel:** profiles → interview_sessions → user_quotas
**Statut:** ✅ Correct

### ConversationService
**Ordre actuel:** interview_sessions → interview_messages → user_quotas
**Statut:** ✅ Correct

### ReportService
**Ordre actuel:** interview_sessions → interview_messages → reports → user_quotas
**Statut:** ✅ Correct

### QuotaService
**Ordre actuel:** user_quotas
**Statut:** ✅ Correct

## Scénarios à Risque

### Scénario 1: Session + Messages
**Risque:** Faible
**Mitigation:** Distributed Lock sur sessionId dans ConversationService

### Scénario 2: Session + Report
**Risque:** Faible
**Mitigation:** UPSERT dans ReportRepository

### Scénario 3: Quota + Session
**Risque:** Faible
**Mitigation:** Quota utilise RPC atomique

## Recommandations

### 1. Documenter l'Ordre d'Accès
Ajouter des commentaires dans chaque service indiquant l'ordre d'accès aux tables.

```typescript
/**
 * ConversationService
 * Ordre d'accès aux tables:
 * 1. interview_sessions
 * 2. interview_messages
 * 3. user_quotas
 */
export class ConversationService {
  // ...
}
```

### 2. Ajouter des Tests de Deadlock
Créer des tests qui simulent des accès concurrents dans différents ordres pour vérifier qu'aucun deadlock ne se produit.

### 3. Monitoring
Ajouter des métriques pour détecter les deadlocks:
- Temps d'acquisition des locks
- Nombre de timeouts
- Nombre de deadlocks détectés

## Conclusion

L'ordre actuel d'accès aux tables est déjà cohérent. Les deadlocks sont rares avec le niveau actuel de charge. Les recommandations ci-dessus peuvent être implémentées si nécessaire pour supporter une charge plus élevée.
