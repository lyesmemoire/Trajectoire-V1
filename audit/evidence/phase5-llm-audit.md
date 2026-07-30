# Phase 5 — Appels LLM et récupération

> **Date** : 2026-07-30  
> **Environnement** : Code audit statique (pas d'appels LLM réels — clés API non disponibles)

---

## Architecture LLM identifiée

### Routes avec appels LLM

| Route | Provider | Timeout | AbortController | Retry | Billing Flow |
|---|---|---|---|---|---|
| `/api/cv/analyze` | Mistral (`mistral-small-latest`) | 30s ✅ | ✅ `AbortController` | ❌ (via IdempotencyService) | reserve → LLM → commit/rollback ✅ |
| `/api/cv/rewrite` | Mistral (via `cv-rewriter.ts`) | ❌ ABSENT | ❌ | ❌ | reserve → LLM → commit/rollback ✅ |
| `/api/simulation/message` | Via `ConversationService` (DI) | ❌ ABSENT | ❌ | ❌ | reserve → LLM → commit/rollback ✅ |
| `/api/interview` | Via HIIOS kernel | ❌ ABSENT | ❌ | ❌ | Non câblé |
| `realtime-gateway` | OpenAI via `cv-rewriter.ts` | 60s (SDK default) | ❌ | ❌ | Non câblé |

### Composants transversaux

| Composant | Rôle | Findings |
|---|---|---|
| `RetryManager` | Exponential backoff + fallback model | ✅ Bien implémenté, 3 retries, 2s→8s backoff |
| `AIClient` | Singleton OpenAI client | ✅ Timeout 60s hardcodé |
| `ai.config.ts` | Config centralisée | ✅ `AI_TIMEOUT=60s`, `AI_MAX_RETRIES=3`, cost limits |
| `streaming.ts` | Stream avec AbortSignal | ✅ Signal passé au stream |

---

## Flux billing complet (reserve → commit/rollback)

### Pattern nominal vérifié (3 routes)

```
1. Auth → Validation entrée
2. ENABLE_*_BILLING check (feature flag)
3. BillingService.reserveCredits() → txId
4. try { LLM call } catch { BillingService.rollbackCredits(txId, reason) }
5. BillingService.commitCredits(txId, tokens)
6. Return result
```

**Les 3 routes billing** (`cv/analyze`, `cv/rewrite`, `simulation/message`) implémentent ce pattern correctement :
- ✅ Reserve avant l'appel LLM
- ✅ Rollback dans le catch
- ✅ Commit après succès
- ✅ Feature flag `ENABLE_*_BILLING` (opt-in)
- ✅ Idempotency key (header ou dérivée)

### Faille identifiée : Commit après HIIOS init dans cv/analyze

Dans `/api/cv/analyze` L320-323, le commit credits se fait **après** l'initialisation HIIOS (L282-318). Si HIIOS crash, les crédits sont **déjà committés** car l'exception HIIOS est catch-and-continue (L300-318 "fail open"). Ce design est **intentionnel** : HIIOS est un enrichissement optionnel, pas le service principal.

**Verdict** : Pas de faille — le commit est après le résultat LLM principal. HIIOS failure ne devrait pas annuler la facturation.

---

## Défauts identifiés

### D-LLM-1 : Absence de timeout sur cv-rewriter (RISQUE MOYEN)

**Fichier** : [`cv-rewriter.ts`](file:///c:/Trajectoire/apps/web/src/lib/ai/cv-rewriter.ts)  
**Symptôme** : Pas de `AbortController` ni de `timeout` dans les appels Mistral  
**Impact** : En cas de latence Mistral > 60s, la requête HTTP Next.js timeout côté Vercel (30s default) mais le crédit est déjà réservé → reste en état `reserved` jusqu'au cleanup  
**Mitigation existante** : `cleanup_expired_transactions` RPC (TTL configurable)  
**Correction recommandée** : Ajouter `AbortController` avec 25s timeout (comme cv/analyze)  

### D-LLM-2 : Absence de timeout sur simulation/message (RISQUE MOYEN)

**Fichier** : [`simulation/message/route.ts`](file:///c:/Trajectoire/apps/web/src/app/api/simulation/message/route.ts)  
**Symptôme** : Pas de timeout explicite sur `conversationService.sendMessage()`  
**Impact** : Même que D-LLM-1  
**Mitigation** : Même que D-LLM-1  

### D-LLM-3 : RetryManager non utilisé dans les routes billing (RISQUE FAIBLE)

Le `RetryManager` est bien implémenté mais utilisé uniquement dans `CVService.analyzeCV()` et `extractSkills()`. Les routes billing (`cv/analyze`, `cv/rewrite`) font des appels Mistral directs **sans retry**. Le retry est géré au niveau idempotence (client renvoie la requête avec la même clé).

**Verdict** : Acceptable — le retry applicatif est remplacé par l'idempotence.

---

## Verdict Phase 5

| Critère | Statut |
|---|---|
| Timeout LLM sur route critique (cv/analyze) | ✅ 30s AbortController |
| Timeout LLM sur routes secondaires | ⚠️ ABSENT (D-LLM-1, D-LLM-2) |
| Rollback sur échec LLM | ✅ 3/3 routes |
| Commit uniquement après résultat | ✅ 3/3 routes |
| Idempotence client | ✅ 3/3 routes |
| Retry avec backoff | ⚠️ Disponible mais non utilisé dans routes billing |
| Cost limits | ✅ Config: $1/session, $10/day |
| Token truncation | ✅ `text.slice(0, 8000)` dans cv/analyze |

**Phase 5 : PASS conditionnel** — flux billing→LLM→commit est correct, mais timeouts manquants sur 2 routes secondaires (risque mitigé par cleanup RPC).
