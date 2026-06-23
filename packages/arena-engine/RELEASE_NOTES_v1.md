# Intervo.io — Release Notes v1.0 (Production Lock)

**Release Date:** June 7, 2026
**Status:** FROZEN & GO-LIVE READY

## 1. Architecture Overview
La version v1.0 marque le passage d'une itération de développement rapide à une infrastructure de production stabilisée, résiliente et monétisable. Le système repose sur une architecture orientée événements (Postgres CQRS) et un moteur d'inférence hautement optimisé.

## 2. Frozen Modules (System Freeze)
Les composants suivants sont considérés comme l'épine dorsale de la plateforme et sont désormais **strictement gelés** :

- **SIL (Standard Inference Layer)** : Moteur d'interaction LLM (Mistral/OpenAI) avec retry logic et prompt chaining.
- **Event Store (Postgres)** : Logique CQRS (append-only) garantissant la traçabilité intégrale des sessions.
- **Ledger** : Système de comptabilité double-entrée (`credit_ledger`) pour une monétisation sans faille.
- **Replay Engine** : Réhydratation asynchrone des états d'interview.
- **Distributed Runtime** : Exécution robuste des requêtes AI de longue durée.
- **Billing / Stripe** : Webhooks sécurisés et idempotents.
- **Referral Engine** : Natif Supabase, anti-fraude, récompensant à la première utilisation.

## 3. Security & Admin Guard
Le Control Plane interne (Admin Dashboard) a été refondu :
- **Audit Trail** : Toute action destructrice ou sensible (`ban-user`, `restore-credits`, `assign-org`, `unflag-user`) déclenche une écriture inaltérable dans `audit_logs`.
- **API Guard** : Middleware centralisé et fonctions d'autorisation strictes (`requireAdmin()`) garantissant qu'aucune donnée admin ne fuite.

## 4. Known Limitations & Non-Goals
Pour cette v1.0, nous avons volontairement exclu :
- **Real-time Sub-100ms** : L'IA simule une latence humaine (asynchrone) ; le zero-latency n'est pas un objectif produit.
- **Multi-tenant B2B avancé** : Les organisations existent mais le RBAC complexe est repoussé à la v1.x.
- **Real-time Admin Analytics** : Les dashboards admin ne reflètent pas les événements temps réel via WebSockets, préférant la consultation asynchrone sécurisée.

## 5. Deployment Readiness
✅ **Marketing & Product Truth** : Le discours UI est 100% aligné avec la réalité technique. Les "fake promises" (mocks, données fictives) ont été purgées.
✅ **Resilience** : Edge cases critiques (Stripe crashes, concurrent referral rewards) gérés par des verrous transactionnels `FOR UPDATE` ou de l'idempotence stricte.
✅ **Go-Live Status** : **GREEN**. Le dépôt est prêt pour le déploiement QA Global et Staging/Production.
