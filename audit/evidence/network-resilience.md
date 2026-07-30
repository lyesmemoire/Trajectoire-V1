# Network Resilience & Timeouts

> **Date d'audit**: 30 juillet 2026
> **Statut**: PARTIELLEMENT IMPLÉMENTÉ

Ce document documente la résilience réseau, les timeouts et la gestion des erreurs pour les appels externes (LLM, Stripe, Supabase).

## 1. Timeouts LLM

| Route | Timeout | Implémentation | Statut |
|-------|---------|----------------|--------|
| `api/cv/analyze` | 30s | `AbortController` (L166) | ✅ OK |
| `api/cv/rewrite` | Non défini | Pas de timeout explicite | ❌ MANQUANT |
| `api/simulation/message` | 30s | `AbortController` (ConversationService L149) | ✅ OK |
| `api/report/generate` | Non défini | Pas de timeout explicite | ❌ MANQUANT |

### Détails d'Implémentation

#### `api/cv/analyze` (ATS)
```typescript
// L166-L172
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

try {
  const analysis = await mistral.chat.completions.create({
    model: "mistral-small-latest",
    messages: messages,
    signal: controller.signal,
  });
  clearTimeout(timeout);
} catch (error) {
  if (error.name === 'AbortError') {
    await BillingService.rollbackCredits(txId, 'LLM timeout');
    throw new AppError('LLM timeout', ErrorCode.AI_ERROR, 504);
  }
}
```

#### `api/simulation/message` (SIL)
```typescript
// ConversationService L148-L174
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

try {
  aiResponse = await InterviewService.generateNextResponse({...});
  clearTimeout(timeout);
} catch (error) {
  if (error instanceof Error && error.name === 'AbortError') {
    throw new AIError("AI response timeout - request took too long", ErrorCode.AI_ERROR, 504);
  }
  // Rollback: delete the user message since AI generation failed
  await this.messageRepository.delete(persistedUserMessage.id);
}
```

## 2. Retry Logic

**Statut**: ❌ NON IMPLÉMENTÉ

Aucun mécanisme de retry automatique n'est implémenté pour les appels LLM ou Stripe.

**Recommandation**: Implémenter un retry exponentiel pour les erreurs transitoires (5xx, timeout, network).

## 3. Circuit Breaker

**Statut**: ❌ NON IMPLÉMENTÉ

Aucun circuit breaker n'est implémenté pour protéger contre les cascades d'échecs.

**Recommandation**: Implémenter un circuit breaker pour les appels LLM et Stripe.

## 4. Fallbacks

| Route | Fallback | Implémentation | Statut |
|-------|----------|----------------|--------|
| `api/cv/analyze` | Non | Pas de fallback | ❌ MANQUANT |
| `api/cv/rewrite` | Non | Pas de fallback | ❌ MANQUANT |
| `api/simulation/message` | Non | Rollback message utilisateur | ✅ PARTIEL |
| `api/report/generate` | Rapport minimal | ReportService L132-L142 | ✅ OK |

### Détails Fallback Report

```typescript
// ReportService L130-L142
try {
  analysis = await AIReportService.generateReport({...});
} catch (error) {
  this.logger.error("AI report generation failed", { error });
  // Return minimal report if AI fails
  analysis = {
    overallScore: 0,
    communication: 0,
    technical: 0,
    confidence: 0,
    strengths: [],
    improvements: [],
    summary: "Analyse indisponible. Veuillez réessayer plus tard.",
    recommendation: "Réessayez de générer le rapport ultérieurement.",
  };
}
```

## 5. Gestion Erreurs Stripe

| Event | Gestion | Statut |
|-------|---------|--------|
| `checkout.session.completed` | Idempotence via `event.id` | ✅ OK |
| `customer.subscription.created` | Out-of-order protection | ✅ OK |
| `customer.subscription.updated` | Out-of-order protection | ✅ OK |
| Échec webhook | Log erreur, ne crash pas | ✅ OK |

### Out-of-Order Protection

```typescript
// webhook/route.ts L88-L95
const existing = await supabase.from('Subscription').select('*').eq('userId', userId).single();
if (existing && event.created < existing.updatedAt) {
  logger.info('Ignoring out-of-order event', { eventId: event.id, existingUpdatedAt: existing.updatedAt });
  return NextResponse.json({ received: true });
}
```

## 6. Gestion Erreurs Supabase

| Service | Gestion | Statut |
|---------|---------|--------|
| `BillingService` | Try/catch avec log erreur | ✅ OK |
| `IdempotencyService` | Try/catch avec log erreur | ✅ OK |
| `UserService` | Try/catch avec log erreur | ✅ OK |

### Exemple BillingService

```typescript
// billing.service.ts L58-L64
const { data, error } = await supabase.rpc('reserve_credits_atomic', {...});
if (error) {
  logger.error('Reserve credits failed', { userId, error: error.message });
  return { success: false, error: error.message };
}
```

## 7. Distributed Locks

| Service | Implémentation | Statut |
|---------|----------------|--------|
| `ConversationService` | `DistributedLock.execute` pour ordre messages | ✅ OK |
| Autres services | Non implémenté | ❌ MANQUANT |

### Détails Distributed Lock

```typescript
// ConversationService L47-L53
return DistributedLock.execute(
  `session:${command.sessionId}`,
  async () => {
    return this.sendMessageInternal(command);
  },
  5000 // 5 second timeout
);
```

## 8. Recommandations

### Critique (Haute Priorité)

1. **Ajouter timeouts** pour `cv/rewrite` et `report/generate`
2. **Implémenter retry exponentiel** pour les erreurs transitoires LLM
3. **Implémenter circuit breaker** pour les appels LLM et Stripe

### Important (Moyenne Priorité)

4. **Ajouter fallbacks** pour `cv/analyze` et `cv/rewrite`
5. **Étendre distributed locks** aux autres services critiques
6. **Ajouter monitoring** des timeouts et retries

### Nice to Have (Basse Priorité)

7. **Implémenter bulkhead pattern** pour isoler les appels LLM
8. **Ajouter cache L2** pour les réponses LLM fréquentes
9. **Implémenter rate limiting côté client** pour les appels API

## 9. Conclusion

**Le système de résilience réseau est PARTIELLEMENT implémenté** :

✅ **Points forts** :
- Timeouts implémentés pour ATS et SIL
- Fallback minimal pour les rapports
- Distributed lock pour ordre des messages
- Out-of-order protection pour Stripe webhooks

❌ **Points faibles** :
- Timeouts manquants pour cv/rewrite et report/generate
- Aucun retry automatique
- Aucun circuit breaker
- Fallbacks limités

**Actions prioritaires** :
1. Ajouter timeouts à toutes les routes LLM
2. Implémenter retry exponentiel pour les erreurs transitoires
3. Implémenter circuit breaker pour protéger contre les cascades
