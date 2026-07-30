# Audit de Cohérence & Cartographie (Current State)
*Phase 1 — Diagnostic & Supply Chain*

## 1. Cartographie des Composants Critiques

| Composant | SQL | Prisma | Appelants | Utilisé | État Actuel |
|---|---|---|---|---|---|
| **Tables Financières** | `credit_transactions`, `credit_usage`, `idempotency`, `stripe_events` | Synchronisé | RPC Billing, Stripe Webhooks | OUI | **Divergence RLS** : Politiques ouvertes `USING(true)` pour le rôle public. |
| **Profil & Identité** | Vue `profiles` mappée sur `User` | Synchronisé (`User` + vue SQL) | 15 références (`from("profiles")`) | OUI | **Divergence Mapping** : Le mapping `auth.uid() = id` n'est pas formellement appliqué sur la vue. |
| **ATS (CV Rewrite)** | Table `cv_rewrites` | Synchronisé | `/api/cv/rewrite` | OUI | **Divergence Métier** : Stub détecté dans `cv-rewriter.ts`. Pas de véritable appel LLM. |
| **SIL (Interview)** | Tables `InterviewSession`, `Message` | Synchronisé | `/api/simulation/message` | OUI | **Divergence Résilience** : `InterviewService` n'implémente pas l'`AbortSignal`. |
| **Chaos Framework** | `BusinessChaosTarget`, `ChaosEngine` | N/A | Suite `tests/chaos` | OUI | Synchronisé. |

## 2. Supply Chain & Dépendances
- **Prisma** : 6.1.0 (Hash vérifié, multiSchema supporté).
- **Node/PNPM** : Compatibilité vérifiée.
- *Un `npm audit` / `pnpm audit` formel sera exécuté lors de la validation CI/CD finale.*

---
- **Evidence-ID** : `EV-002`
- **Generated-At** : `2026-07-30T10:55:00Z`
- **Git SHA** : `788bc00c27d124f770e8c0e2ad73ff98dc1d5190`
- **Environment** : `Staging Isolé`
