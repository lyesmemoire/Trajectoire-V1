# `lib/runtime` — Cœur produit unique (P0.5)

Ce dossier définit **le contrat produit unique** de StudioEntretien et son
unique point d'entrée logique.

## Le flux (single pipe)

```
CV + Job
   ↓
/api/product/analyze        (app/api/product/analyze/route.ts)
   ↓
runProductFlow()            (lib/runtime/run-product-flow.ts)
   ↓
ProductOutput               (lib/runtime/product-contract.ts)
   ↓
UI                          (app/product/page.tsx)
```

## Règles strictes (à respecter pour ne pas recréer le chaos)

1. **L'UI ne consomme QUE `ProductOutput`.** Aucun composant ne doit appeler
   directement un module métier (ATS, scoring, futurs moteurs) ni afficher
   ses structures internes.
2. **Un seul endpoint produit** côté UI : `POST /api/product/analyze`.
   Les routes spécialisées existantes (`/api/ats`, `/api/optimize`, …) restent
   pour leurs usages dédiés (auth + crédits + DB) mais ne sont pas le flux MVP.
3. **Tout nouveau moteur** (career-engine, job-matching, etc.) doit fournir un
   adaptateur `mapXxxToProductOutput()` dans `adapters.ts`. Il ne retourne
   jamais directement à l'UI.
4. **`runProductFlow` ne doit jamais planter** : il retourne toujours un
   `ProductOutput` valide (fallback déterministe si un enrichissement échoue).

## Fichiers

| Fichier | Rôle |
| :-- | :-- |
| `product-contract.ts` | Types `ProductInput` / `ProductOutput` + validateurs |
| `adapters.ts` | Conversion logique métier → `ProductOutput` (réutilise l'ATS existant) |
| `run-product-flow.ts` | Orchestration unique du flux |

## Tests

`tests/product/smoke.test.ts` valide le flux de bout en bout en mode
déterministe (sans réseau ni clé API) : `pnpm exec vitest run tests/product`.

## Portée P0.5 (volontairement limitée)

Ce socle vise **uniquement** à prouver que le produit fonctionne comme un flux
humain simple. Non couvert ici (→ P1/P2) : auth/crédits sur l'endpoint produit,
parsing PDF, UX riche, performance, scaling.
