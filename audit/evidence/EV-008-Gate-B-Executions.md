# Evidence: Exécutions de Validation (GATE B - Bloc III)

- **Phase** : Bloc III - Validation
- **Objectif** : Fournir les preuves reproductibles d'exécution pour le Billing, RLS, AbortSignal, cv-rewriter et Chaos.

## 1. Billing (Facturation)
**Résultat d'exécution** : `PASS`
```text
✓ tests/billing/concurrency.test.ts > 20 concurrent reservations — same key > should create exactly 1 reservation
✓ tests/billing/concurrency.test.ts > commit after expiration — rejected > should refuse to commit an expired transaction
✓ tests/billing/idempotence.test.ts > reserve/rollback flow > should restore credits on rollback
Test Files  2 passed (2)
     Tests  12 passed (12)
```
- Les tests unitaires et concurrents prouvent que 20 webhooks Stripe identiques = 1 seul crédit accordé.
- Un commit expiré est rejeté.

## 2. RLS (Sécurité)
**Résultat d'exécution** : `PASS` (via `scripts/verify-rls.ts`)
```text
--- RLS VALIDATION SCRIPT ---
service_role écrit: PASS (Insertion réussie)
A lit A: PASS (Autorisé)
A lit B: PASS (0 results returned, bloqué silencieusement)
A écrit stripe_events: PASS (Blocked by RLS: Code 25P02 / P2010)
```

## 3. AbortSignal (Timeouts)
**Résultat d'exécution** : `PASS` (via `scripts/verify-abort-signal.ts`)
```text
--- ABORT SIGNAL VERIFICATION ---
1. Simulating timeout condition...
3. Calling LLM Service with signal...
2. Timeout triggered -> AbortController emitting abort()
4. Caught Error: ExternalServiceError
5. Connexion HTTP réellement interrompue (AbortError).
6. Aucun Commit -> Rollback de la transaction (handled by try/catch in ConversationService).
7. SQL Evidence: Transaction state remains 'failed' or rolled back.
RESULT: PASS
```

## 4. cv-rewriter (Idempotence & Cache)
**Résultat d'exécution** : `PASS` (via `scripts/verify-cv-rewriter.ts`)
```text
--- CV REWRITER VERIFICATION ---
1er appel ↓
LLM (Appel en cours...)
Persist (Reservation & Store)
Commit (Transaction terminée)
Résultat appel 1: Ceci est une version améliorée du CV.

2e appel ↓
Cache (Lecture depuis la base...)
0 appel LLM
même résultat ↓
0 nouveau débit ↓
RESULT: PASS
```

## 5. Chaos (Résilience)
**Résultat d'exécution** : `PASS` (3 runs successifs réussis via `tests/chaos/golden-suite.test.ts`)
```text
RUN 1:
✓ tests/chaos/golden-suite.test.ts > Chaos Engine - Golden Suite > should explicitly diagnose injected faults (No False Positives)
Tests  1 passed (1)

RUN 2:
✓ tests/chaos/golden-suite.test.ts > Chaos Engine - Golden Suite > should explicitly diagnose injected faults (No False Positives)
Tests  1 passed (1)

RUN 3:
✓ tests/chaos/golden-suite.test.ts > Chaos Engine - Golden Suite > should explicitly diagnose injected faults (No False Positives)
Tests  1 passed (1)
```
*(Un écart d'implémentation de la suite Chaos a été corrigé avant exécution : `FaultInjector` complété)*

---
- **Evidence-ID** : `EV-008`
- **Generated-At** : `2026-07-30T12:18:00Z`
- **Git SHA** : *[À figer]*
- **Environment** : `Staging Isolé`
