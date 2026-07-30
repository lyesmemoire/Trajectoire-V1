# Registre des Risques & Business Integrity
*Phase 2 — Due Diligence Risk Assessment*

## 1. Matrice des Anomalies Détectées

| ID | Risque | Niveau | Probabilité | Impact | Coût | Temps Fix | Décision (ADR attendu) |
|---|---|---|---|---|---|---|---|
| **RSK-001** | Politiques RLS permissives (`USING true`) sur tables financières (`credit_transactions`, `stripe_events`). | **Bloquant** | Haute | Élevé | Faible | 30m | Bloque le GO. Correction impérative via RLS stricts (Correction-ID requis). |
| **RSK-002** | Stub détecté dans `cv-rewriter.ts`. La fonctionnalité principale n'appelle aucun LLM. | **Bloquant** | 100% | Élevé | Faible | 1h | Bloque le GO. Implémentation réelle exigée. |
| **RSK-003** | Absence d'`AbortSignal` dans `InterviewService`. Les timeouts ne sont pas répercutés au LLM, créant des requêtes orphelines. | **Critique** | Moyenne | Élevé | Faible | 30m | Bloque le GO. Intégration du signal requise pour garantir le circuit-breaker. |
| **RSK-004** | Vue `profiles` vulnérable (identités mal mappées). Le RLS actuel sur la table sous-jacente `User` ne sécurise pas complètement l'Update si manipulé côté client sans `auth.uid() = id`. | **Critique** | Moyenne | Élevé | Faible | 30m | Bloque le GO. Mise à jour de la politique sur `User`. |

## 2. Invariants Métier (Business Integrity)
L'audit validera que les invariants suivants sont **strictement respectés** par les correctifs proposés :
- `INV-001` : Aucun crédit ne peut devenir négatif.
- `INV-002` : Aucun crédit débité sans service LLM complété.
- `INV-003` : Aucune transaction (réserve) orpheline (non committée/non rollbackée).
- `INV-004` : Un utilisateur ne peut modifier que ses propres données de profil.

---
- **Evidence-ID** : `EV-003`
- **Generated-At** : `2026-07-30T10:55:00Z`
- **Git SHA** : `788bc00c27d124f770e8c0e2ad73ff98dc1d5190`
- **Environment** : `Staging Isolé`
