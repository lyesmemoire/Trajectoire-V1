# Certification Baseline (Pre-Change State)
*Phase 0 — Diagnostic Freeze*

## 1. Environnement d'Audit Isolé (Staging)
Toutes les validations de cette Due Diligence s'exécutent sur l'environnement de staging suivant, expressément isolé :
- **DB** : `bzxdozzbdvzgvgshyamp.supabase.co`
- **Node.js** : `v24.13.0`
- **PNPM** : `9.15.9`
- **Prisma** : `6.1.0`
- **Supabase CLI** : version locale `latest`
- **OS** : Windows (`win32 x64`)

## 2. Certification Freeze
- **Git SHA de référence** : `788bc00c27d124f770e8c0e2ad73ff98dc1d5190`
- **Branche** : `main`
*Toute modification ultérieure de ce SHA (hors corrections strictes tracées) invalidera l'ensemble du manifeste de certification.*

## 3. Schéma et Migrations
- Prisma Client généré en `v6.1.0` avec `multiSchema` activé.
- Politique de gestion des migrations : Validation stricte `UP → DOWN → UP` requise.

## 4. Dépendances Critiques (SBOM initial)
- `@prisma/client` : `6.1.0`
- `@supabase/supabase-js` : `^2.42.0`
- `next` : `14.2.3`

---
- **Evidence-ID** : `EV-001`
- **Generated-At** : `2026-07-30T10:49:05Z`
- **Git SHA** : `788bc00c27d124f770e8c0e2ad73ff98dc1d5190`
- **Environment** : `Staging Isolé`
