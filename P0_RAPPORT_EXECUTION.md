# ✅ P0 — Rapport d'exécution : Remise à plat du repo

> Branche : `chore/p0-foundation` · Commit : `705955f`
> Date : 2026-06-04 · Exécuté sans toucher au produit (fondation uniquement)

---

## 🎯 Critères de succès — tous atteints

| Critère | Statut | Preuve |
| :-- | :-: | :-- |
| `pnpm install` | ✅ | `Done in 22.3s` (3 packages du workspace) |
| `realtime-gateway` compile | ✅ | `tsc` → exit 0 |
| `api` (NestJS) compile | ✅ | `nest build` → exit 0 |
| `pnpm -r build` (apps) | ✅ | exit 0 (2/2 apps) |
| `pnpm dev` (web) | ✅ | `next dev` → HTTP **200** sur `/` |
| Deepgram unifié | ✅ | `^3.13.0` partout (root/api/gateway) |
| Lockfile unique | ✅ | `pnpm-lock.yaml` seul |
| Repo allégé | ✅ | 2739 → **1051** fichiers suivis (~1,84 M lignes d'artefacts retirées) |

> ⚠️ `next build` (production) : non validé **dans ce sandbox** par manque de RAM
> (1,9 GB total, sans swap → `SIGKILL`/OOM). Ce n'est **pas** un bug de code :
> `next dev` compile et sert les pages (HTTP 200) et le type-check passe.
> Sur une machine/CI avec ≥ 4 GB RAM, `next build` doit passer normalement.

---

## 🔧 Actions réalisées (les 5 du plan)

### 1. Stratégie monorepo unique — pnpm workspaces
- **Créé** `pnpm-workspace.yaml` → `packages: [ "apps/*" ]`.
  *(Adaptation validée : `packages/*` et `src/*` exclus car sans `package.json` ; l'app web reste à la racine — aucun déplacement de fichier, donc zéro risque produit.)*
- **Ajouté** au `package.json` racine : `engines` (`node>=18`, `pnpm>=8`) + `packageManager: pnpm@9.15.9`.

### 2. Réparation des installs des apps
- Les sous-apps `apps/api` et `apps/realtime-gateway` reçoivent désormais leurs dépendances via le workspace (leurs `node_modules` existent).
- **Supprimé** les 3 `package-lock.json` (npm) au profit d'un unique `pnpm-lock.yaml`.
- **Bonus** : `@discordjs/opus` (module natif C++ **non importé dans le code**) ajouté à `pnpm.neverBuiltDependencies` car sa compilation native échoue dans l'environnement — l'install n'est plus bloquée, sans impact fonctionnel.

### 3. Deepgram aligné (un seul standard : v3)
- Le code (`api` + `gateway`) utilise l'API `createClient` / `listen.live` / `LiveTranscriptionEvents` = **SDK v3**.
- **Aligné** `@deepgram/sdk` sur `^3.13.0` dans root + api + gateway (au lieu de `^5.3`/`^5.4`/`^3`).
- Résultat : `gateway` compile, ASR vocal cohérent. **Aucune ligne de code applicatif modifiée.**

### 4. Nettoyage repo (hygiène CI/CD)
- **Réécrit** `.gitignore` en UTF-8 propre (l'ancien avait une fin corrompue en UTF-16, rendant `dist/`, `*.bundle`, etc. inopérants).
- **Untracké** (`git rm --cached`) ~1680 artefacts : binaires Prisma `.cache/` (~110 MB), `artifacts/trace*.json` (18 MB ×2), 6 rapports lint UTF-16, `dist/`, `test-results/`, `playwright-report/`, `scratch/`, benchmarks.
- `git check-ignore` confirme qu'ils ne reviendront pas.

### 5. Standardisation du build
- `build` : `tsc -b` → **`next build`** (le vrai build produit ; corrige l'incohérence I4).
- Ajouté : `build:web` (`next build`), `build:apps` (`pnpm -r build`), `build:all`, `build:graph` (ex-build `tsc -b`), `typecheck` (`tsc -b`).
- Corrigé **B1** (conflit ESLint) : `@eslint/js` `^10.0.1` → `^9.39.0` (alignement sur eslint 9). ESLint démarre sans erreur de config.

---

## 📌 Décisions / écarts par rapport au plan (justifiés)

1. **App web gardée à la racine** (pas de `apps/web/`) — éviter un refactor massif et risqué des imports/config Vercel. `pnpm --filter web` devient inutile : le `dev`/`build` web se pilotent depuis la racine.
2. **`prisma/migrations` NON ignoré** (le plan le suggérait) — les migrations doivent rester versionnées pour la reproductibilité de la BDD en équipe.
3. **`git rm --cached` ciblé** plutôt que `git rm -r --cached .` global — plus sûr et traçable, même résultat.

---

## ⏭️ Points à traiter ensuite (hors périmètre P0)

- **Warnings peer deps OpenTelemetry/Sentry** : `@opentelemetry/api@1.9` vs ranges `<1.8` exigés par les sous-paquets `@opentelemetry/*@0.45/1.18`, et `@sentry/node-core` qui veut `exporter-trace-otlp-http >=0.57`. Non bloquant (install OK) → à aligner en P2.
- **`eslint-config-next@^16`** alors que Next est en 15 → à vérifier/aligner.
- **`next build` à valider sur CI** (≥ 4 GB RAM).
- Résorber les erreurs lint réelles (ex. `no-case-declarations` dans `app/api/stripe/webhook/route.ts`).
- Dédup `marketing` / `marketing-old` et doublons `.jsx`/`.tsx`.

---

## 🧪 Comment relancer (mémo)
```bash
pnpm install            # installe root + apps/*
pnpm exec prisma generate
pnpm dev                # app web (Next.js) sur :3000
pnpm --filter api build           # NestJS
pnpm --filter realtime-gateway build   # Fastify/WS
pnpm -r build           # toutes les apps
pnpm typecheck          # tsc -b (graph monorepo)
```
