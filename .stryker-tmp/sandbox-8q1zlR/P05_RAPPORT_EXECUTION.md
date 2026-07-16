# ✅ P0.5 — Rapport d'exécution : Stabilisation produit

> Branche : `chore/p0-foundation` · Date : 2026-06-04
> Objectif : passer de « services qui compilent » à « produit qui fonctionne de bout en bout ».

---

## 🎯 Résultat : le flux produit fonctionne de bout en bout

```
CV + Job
   ↓
POST /api/product/analyze
   ↓
runProductFlow()
   ↓
ProductOutput
   ↓
UI /product
```

**Validé en conditions réelles (serveur Next lancé) :**

| Vérification | Résultat |
| :-- | :-: |
| `POST /api/product/analyze` → ProductOutput complet | ✅ (score 57%, forces/gaps/actions/explication) |
| `GET /product` (UI) | ✅ HTTP 200 |
| Entrée invalide → 400 | ✅ |
| Smoke test déterministe | ✅ **6/6** |
| Typecheck des 6 fichiers produit | ✅ 0 erreur |
| Lint des fichiers produit | ✅ 0 erreur |

---

## 🔧 Les 7 étapes du plan

| Étape | Livrable | Statut |
| :-- | :-- | :-: |
| 1. Figer le produit réel | `lib/runtime/product-contract.ts` (types + validateurs) | ✅ |
| 2. Fonction produit unique | `lib/runtime/run-product-flow.ts` | ✅ |
| 3. Normaliser les outputs | `lib/runtime/adapters.ts` (ATS → ProductOutput) | ✅ (adapté, voir écarts) |
| 4. API produit unique | `app/api/product/analyze/route.ts` | ✅ |
| 5. Écran UI unique | `app/product/page.tsx` | ✅ |
| 6. Supprimer les ambiguïtés | `lib/runtime/README.md` (règles strictes) | ✅ (adapté) |
| 7. Smoke test produit | `tests/product/smoke.test.ts` + `vitest.config.ts` | ✅ |

---

## 📌 Écarts par rapport au plan (justifiés, validés avec toi)

1. **Modules `career-engine` / `job-matching` / `outcome-attribution` : inexistants** dans le repo.
   → Le pipeline est branché sur la **vraie logique ATS existante** (`computeKeywordScore` de `lib/local-ats.ts`).
   Les adaptateurs (`analyzeKeywords`, `mapKeywordAnalysisToProductOutput`, `mergeLlmFeedback`) jouent
   le rôle des `mapXxxToProductOutput()` prévus.

2. **Emplacement `lib/runtime/` au lieu de `src/lib/runtime/`**
   → Cohérent avec l'alias `@/*` = racine déjà utilisé partout (zéro config à changer).

3. **Étape 6 « bloquer les usages directs »** : aucun usage UI direct de ces modules
   n'existe (ils n'existent pas). La règle « UI = ONLY product API » est donc
   **gravée en documentation** (`lib/runtime/README.md`) comme garde-fou pour l'avenir.

4. **Enrichissement LLM best-effort** : `runProductFlow` reste 100 % fonctionnel
   **sans clé API ni réseau** (cœur déterministe). Le LLM (Ollama via `generateFeedback`)
   n'enrichit que si disponible, sans jamais bloquer ni altérer le score → **pas de mock caché**.

5. **Petit polish qualité** : filtre de stop-words FR/EN dans l'extraction de mots-clés
   pour éviter le bruit (« recherche », « apprécié »…) dans les gaps/actions.
   N'altère pas `computeKeywordScore` (logique existante intacte).

---

## 🧩 Fichiers créés

```
lib/runtime/product-contract.ts     # contrat unique ProductInput/ProductOutput
lib/runtime/adapters.ts             # ATS -> ProductOutput (+ stop-words)
lib/runtime/run-product-flow.ts     # point d'entrée logique unique
lib/runtime/README.md               # règles strictes du flux produit
app/api/product/analyze/route.ts    # endpoint produit unique
app/product/page.tsx                # UI MVP (2 textareas + résultat)
tests/product/smoke.test.ts         # smoke test bout-en-bout
vitest.config.ts                    # alias @/* pour les tests
```

> Aucun fichier existant du produit n'a été modifié, hormis l'ajout (non destructif)
> de la config Vitest. La logique ATS d'origine est réutilisée, pas réécrite.

---

## 🧪 Comment relancer

```bash
pnpm install
pnpm exec prisma generate
# Tests produit (déterministe, sans réseau) :
pnpm exec vitest run tests/product
# Bout-en-bout manuel :
pnpm dev    # puis ouvrir http://localhost:3000/product
```

---

## ⏭️ Prochaine étape : P1 — UX simplifiée complète
- Brancher l'upload PDF (réutiliser `app/api/upload`) pour remplir le CV.
- Auth/crédits optionnels sur l'endpoint produit (réutiliser le pattern `/api/ats`).
- Soigner l'UI (états de chargement, copie, responsive).
