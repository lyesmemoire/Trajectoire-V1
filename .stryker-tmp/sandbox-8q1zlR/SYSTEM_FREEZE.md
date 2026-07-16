# SYSTEM FREEZE DECLARATION

**Date:** June 7, 2026
**Status:** PRODUCTION LOCK INITIATED

## 🔴 RÈGLE ABSOLUE DE GOUVERNANCE

À partir de ce jour, l'architecture backend est considérée comme **strictement gelée**. 

**Sont formellement interdits :**
- ❌ Tout développement de nouvelles features backend
- ❌ Toute création de nouvelles abstractions d'infrastructure
- ❌ Tout refactoring structurel (SIL, Ledger, EventStore)
- ❌ Toute modification de schéma sur la facturation/monétisation

**Sont autorisés :**
- ✔️ Bugfix critique bloquant la production
- ✔️ Polish UI/UX (CSS, micro-copies)
- ✔️ Correction de flux applicatifs cassés
- ✔️ Sécurisation de surface sans modification d'architecture

---

## 🧊 MODULES GELÉS (FROZEN STATE)

| Module | Statut | Description |
| :--- | :---: | :--- |
| **SIL (Standard Inference Layer)** | **FROZEN** | Couche de communication LLM, retry logic, prompt chaining. |
| **Event Store (Postgres)** | **FROZEN** | CQRS events append-only. Aucune mutation de structure autorisée. |
| **Credit Ledger** | **FROZEN** | Source de vérité comptable (`credit_ledger`). Idempotence garantie. |
| **Replay Engine** | **FROZEN** | Moteur de réhydratation des interviews depuis l'Event Store. |
| **Distributed Runtime** | **FROZEN** | Gestion de l'état asynchrone et des jobs distribués. |
| **Stripe / Billing** | **FROZEN** | Webhooks, RPC atomiques, système anti-double-spend. |
| **Security Layer (RBAC)** | **FROZEN** | Validation des rôles via profils Supabase et fonctions atomiques. |
| **Referral Engine** | **FROZEN** | RPC Supabase, rewards event-driven sur usage (`process_referral_attribution`). |

Toute modification dans un de ces modules nécessite un dégel exceptionnel approuvé au niveau "Release Engineer".
