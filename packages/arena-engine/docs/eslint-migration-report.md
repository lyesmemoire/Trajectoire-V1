# Rapport de Migration ESLint & Stabilisation CI

## A. Résumé Global
**Objectif de la refonte ESLint :** 
Transformer un monorepo générant énormément de bruit (fichiers générés, problèmes de hooks React, conflits TS/JS) en un environnement sain, stable et compatible avec une CI stricte.

**Problèmes initiaux identifiés :**
- Plus de 5000+ erreurs remontées par `npm run lint`.
- Pollution massive due aux dossiers générés (`playwright-report`, `dist`, `build`, etc.).
- Des erreurs de type "React Hooks" majeures causées par des composants marqués `async` mais utilisant des hooks clients.
- Des artefacts de build (`.js` compilés) présents au milieu des sources (`src/`), créant de la dette invisible et des erreurs `@typescript-eslint/no-require-imports` et `no-empty`.
- Un linter beaucoup trop lent car tentant de parser du code Playwright minifié et des fichiers de cache.

**Résultat final :**
- Les erreurs sont tombées d'environ 6000 à **270 erreurs** (les dernières étant confinées au sous-dossier `apps/realtime-gateway/` où les règles ultra-strictes refusent l'utilisation de `any`).
- 100% des erreurs liées aux hooks Next.js ont été éradiquées (les "async hooks invalid").
- La CI est stabilisée pour s'exécuter efficacement.

---

## B. Changements Techniques

**ESLint Flat Config Migration**
- Adoption de la nouvelle syntaxe Flat Config (`eslint.config.mjs`).
- Définition d'ignores stricts en haut du fichier (`**/playwright-report/**`, `**/dist/**`, `**/.next/**`, etc.) protégeant le linter des fichiers minifiés/générés.

**Séparation DEV vs CI Rules**
- Les règles comme `no-console`, `no-unused-vars` et `unused-imports` passent dynamiquement en `"error"` lorsque la variable `process.env.CI === "true"`, et en `"warn"` en mode dev local pour ne pas frustrer les développeurs.

**Scoping par Workspace**
- `app/` et `apps/web/` : Applique les règles de hooks React strictes.
- `apps/api/` : Mode Strict (refuse les `any` par défaut).
- `apps/realtime-gateway/` : Mode Ultra Strict (tous les `any` sont des erreurs, `no-console` en warn).
- `scripts/` : Mode permissif (autorise les logs et tolère certains types `any`).

**Fix React Hooks Violations**
- Refactorisation de **16 pages** (`page.tsx`) dans l'architecture Front-end.
- Retrait du mot clé `async` illégal sur les composants `use client`.
- L'appel aux données `fetch()` a été replacé dans des `useEffect` avec un système de chargement, ce qui a nettoyé complètement les 53 erreurs critiques "Rules of Hooks".

**Suppression des fichiers Build JS parasites**
- Suppression globale des fichiers compilés `.js` trouvés dans `src/watchdog/` et `src/bootstrap/` ainsi que dans `apps/realtime-gateway/src/server/` qui polluaient l'arbre des sources et généraient des erreurs de type `require()`.

---

## C. Problèmes Rencontrés

1. **Playwright Trace Pollution** : Les rapports générés (`.js` minifiés) représentaient 87% des erreurs originelles (plus de 3000 faux positifs). Leur exclusion a instantanément allégé l'outil.
2. **Performance lente (Type-aware linting)** : Utiliser `recommendedTypeChecked` sur tout un monorepo engorgeait le TS Server. Nous avons dissocié le *typechecking* (via `tsc -b`) et le *linting* (via `eslint . --cache`).
3. **Erreurs JSON Parsing** : Durant les analyses, des problèmes d'encodage (BOM utf16le) via PowerShell nous ont obligés à utiliser des scripts de parse Node natifs pour lire correctement les bilans d'erreurs.
4. **Gateway Strict Rules Mismatch** : Le dossier `realtime-gateway` possède un très grand nombre de typages dynamiques / implicites (~250 utilisations de `any`) qui entrent en conflit immédiat avec la règle `@typescript-eslint/no-explicit-any: "error"` nouvellement imposée pour ce dossier. C'est l'un des rares chantiers restants.

---

## D. État Final du Projet

- **Nombre d'erreurs ESLint restantes** : **~270** (au lieu de 5000+).
- **Nombre de warnings restants** : **~738**.
- **Zones encore critiques** : 
  - `apps/realtime-gateway/` et ses tests, en raison des types `any` non résolus.
  - La gestion de TypeScript sur certaines structures de base de données (`types/database.ts`).

**Prochaine Étape (CI Hard Mode)** : Corriger unitairement les `any` dans `apps/realtime-gateway/` afin de descendre l'affichage d'erreurs à **0**, puis activer le blocage systématique de la CI pour tout warning (CI strict mode).
