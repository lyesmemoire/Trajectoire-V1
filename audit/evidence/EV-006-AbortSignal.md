# Evidence: Propagation AbortSignal (COR-003)

- **Correction-ID** : `COR-003`
- **Risk-ID** : `RSK-003`
- **ADR** : `ADR-002`

## Preuves
- `AbortSignal` propagé à travers `ConversationService` -> `InterviewService` -> `AIClient` -> `OpenAIProvider`.
- Test : Lorsqu'une requête prend plus de 30 secondes, le contrôleur émet `abort()`.
- Le signal interrompt instantanément la connexion de la socket HTTP vers OpenAI.
- L'erreur remontée intercepte l'appel à `quotaService.incrementQuota("messages")`.
- Résultat métier : Aucun crédit n'est perdu lors d'un timeout LLM.

---
- **Evidence-ID** : `EV-006`
- **Generated-At** : `2026-07-30T11:31:06Z`
- **Git SHA** : `788bc00c27d124f770e8c0e2ad73ff98dc1d5190`
- **Environment** : `Staging Isolé`
- **Checksum (SHA256)** : *(à générer en phase 5)*
