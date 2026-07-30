# Architecture Chaos Engineering - Contrats de Résilience

## INVARIANT C-001 (Séparation des Responsabilités)

Le moteur de Chaos est autorisé à :
- injecter une panne (réseau, DB, timeout, kill, OOM)
- mesurer et observer (via les Oracles)
- enregistrer (générer le score final)

Il est **strictement interdit** au moteur de Chaos de :
- effectuer un retry
- faire un rollback
- implémenter un circuit breaker
- gérer l'idempotence
- implémenter de la logique métier (décisions)

> Toute la résilience **doit** être implémentée au niveau applicatif (`BusinessApp`).

## Matrice de Couverture Résilience

| Service  | Timeout | Retry | Rollback | Idempotence | Chaos |
| -------- | ------- | ----- | -------- | ----------- | ----- |
| ATS      | ✅       | ✅     | ✅        | ✅           | ✅     |
| LLM      | ✅       | ✅     | N/A      | ✅           | ✅     |
| Stripe   | ✅       | ✅     | ✅        | ✅           | ✅     |
| Upload   | N/A     | ✅     | ✅        | N/A         | ✅     |
| Replay   | N/A     | ✅     | ✅        | N/A         | ✅     |
| Referral | ✅       | ✅     | ✅        | ✅           | ✅     |

## Oracles (Boîte Noire)

Les oracles doivent évaluer des invariants de l'état système, **jamais** l'implémentation.
- *CreditOracle* : Vérifie l'état net du compte de crédit.
- *TransactionOracle* : Vérifie qu'il n'y a pas d'artefacts orphelins en base.
- *ResourceLeakOracle* : Vérifie les descripteurs, timers ou promesses résiduels.
