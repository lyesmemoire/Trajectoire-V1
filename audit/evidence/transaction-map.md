# Phase 3+4 — Transactions et facturation

> **Commit** : `788bc00c` + local edits  
> **Environnement** : Supabase staging `bzxdozzbdvzgvgshyamp.supabase.co`  
> **Date** : 2026-07-30

---

## RPCs audités (source complète extraite de pg_proc)

| RPC | Atomicité | Idempotence | Check-then-act? | Concurrence |
|---|---|---|---|---|
| `reserve_credits_atomic` | ✅ FOR UPDATE + single tx | ✅ UNIQUE(idempotency_key) | ❌ Pas de CTA | ✅ Sérialisé par FOR UPDATE |
| `commit_credits_atomic` | ✅ FOR UPDATE sur tx | ✅ State guard `!= 'reserved'` | ❌ | ✅ |
| `rollback_credits_atomic` | ✅ FOR UPDATE + credits restore | ✅ State guard `!= 'reserved'` | ❌ | ✅ |
| `add_credits_atomic` | ✅ INSERT + ON CONFLICT | ✅ UNIQUE(idempotency_key) | ❌ | ✅ |
| `cleanup_expired_transactions` | ✅ FOR LOOP + rollback per tx | ✅ Calls rollback (state guard) | ❌ | ✅ |

---

## Tests exécutés — 12/12 PASS

### Idempotence (5 tests)

| # | Test | Assertion | Résultat |
|---|---|---|---|
| 1 | Même clé, 2 appels séquentiels | Balance = 250 (pas 300) | ✅ PASS |
| 2 | 10 appels concurrents, même clé | Balance = 130 (pas 100+30×10) | ✅ PASS |
| 3 | Reserve → commit flow | Balance déduite, state=committed | ✅ PASS |
| 4 | Reserve → rollback flow | Balance restaurée | ✅ PASS |
| 5 | Commit after rollback | Rejeté, message "not in reserved state" | ✅ PASS |

### Concurrence avancée (7 tests)

| # | Test | Assertion | Résultat |
|---|---|---|---|
| 6 | **20 réservations concurrentes, même clé** | 1 seule tx créée, balance = 450 (pas 500-50×20) | ✅ PASS |
| 7 | **20 webhooks Stripe identiques** | Balance = 300 (100+200, pas 100+200×20) | ✅ PASS |
| 8 | **2 clés différentes** | 2 tx distinctes, balance = 430 | ✅ PASS |
| 9 | **Commit après expiration forcée** | Rejeté : "not in reserved state" | ✅ PASS |
| 10 | **Rollback × 3 (idempotent)** | Balance restaurée 1 fois : 300 après 3 rollbacks | ✅ PASS |
| 11 | **Orphan cleanup** | cleanup_expired_transactions → state=expired, credits restaurés | ✅ PASS |
| 12 | **Re-reserve après rollback** | Rejeté (UNIQUE one-shot), credits inchangés | ✅ PASS |

### Preuves SQL directes

Tous les tests vérifient le solde par `SELECT credits FROM "User" WHERE id = ?` après chaque mutation. Les assertions comparent des valeurs numériques exactes, pas des statuts HTTP.

---

## Comportements documentés

### One-shot idempotency keys
`reserve_credits_atomic` insère avec `INSERT INTO credit_transactions(idempotency_key, ...)`. Si la clé existe déjà (même après rollback), l'INSERT échoue par `unique_violation`. Le RPC ne fait **pas** de `ON CONFLICT` — c'est un choix de design : une clé utilisée est consommée définitivement.

**Risque résiduel** : Si un utilisateur obtient un rollback (ex: timeout LLM), il ne peut pas retenter la même opération avec la même clé d'idempotence. Le code applicatif doit générer une **nouvelle clé** pour chaque tentative.

### State machine

```
[new] → reserved → committed  (nominal)
              ↘ failed (rollback)
              ↘ expired (cleanup_expired_transactions)
```

### Rollback guard
`rollback_credits_atomic` vérifie `state != 'reserved'` et lève une exception sinon. Un double rollback est rejeté, donc les crédits ne sont jamais restaurés deux fois.

---

## Verdict Phase 4

| Critère | Statut |
|---|---|
| Transaction atomique | ✅ FOR UPDATE + PL/pgSQL |
| Idempotence par contrainte DB | ✅ UNIQUE(idempotency_key) |
| Absence de check-then-act | ✅ Pas de SELECT...IF...INSERT pattern |
| Protection concurrence (20 workers) | ✅ Prouvé par tests 6+7 |
| État explicite (reserved/committed/failed/expired) | ✅ |
| Commit uniquement depuis reserved | ✅ State guard |
| Rollback idempotent | ✅ 3 rollbacks → 1 seule restauration |
| Pas de facturation sans résultat métier | ✅ Reserve → commit séparé |
| Pas de restitution en double | ✅ State guard sur rollback |
| Réconciliation orphelins | ✅ cleanup_expired_transactions |
| TTL des réservations | ✅ `p_minutes_old` paramétrable |

**Phase 4 : PASS**
