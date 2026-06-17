# 📋 État des lieux & Roadmap — StudioEntretien

> Rapport d'analyse de reprise de projet
> Date : 2026-06-04 · Branche analysée : `main` (`9409ff4`)
> Environnement : Node v20.20.2 / npm 10.8.2

---

## 1. Résumé de l'état du projet

**StudioEntretien** (alias « CV-ENTRETIEN ») est une plateforme SaaS française d'aide
à la préparation d'entretiens d'embauche et d'optimisation de CV pilotée par IA.
La proposition de valeur affichée : *« Le simulateur qui réagit comme un vrai recruteur »*.

### Stack technique

| Couche | Technologies |
| :-- | :-- |
| **Frontend / Web** | Next.js 15.5 (App Router), React 19, TailwindCSS 3.4, Framer Motion, Zustand |
| **Backend Web (API routes)** | Next.js Route Handlers (`app/api/**`) |
| **Auth** | Supabase (SSR) + NextAuth v5 beta |
| **Base de données** | PostgreSQL via Prisma 6.1 (multi-schéma `public` + `auth`) |
| **IA** | Mistral, OpenAI, Google Generative AI, ElevenLabs (TTS), Deepgram (ASR), Vercel AI SDK |
| **Paiements** | Stripe (checkout + webhooks + crons) |
| **Cache / Rate-limit** | Upstash Redis / ioredis |
| **Observabilité** | Sentry, PostHog, OpenTelemetry, prom-client |
| **Moteur d'entretien vocal** | 2 apps backend séparées : `apps/api` (NestJS) et `apps/realtime-gateway` (Fastify + WebSocket) |
| **Tests** | Vitest, Playwright (E2E), Jest (sous-app api) |

### Architecture globale

Le dépôt est un **monorepo « hybride » non finalisé** :

```
/ (racine)                    → App Next.js (produit principal, fonctionnel)
  ├─ app/                     → Pages & routes API Next.js
  ├─ components/              → UI (marketing, dashboard, progress, ui/)
  ├─ lib/                     → Logique métier web (credits, interview, seo, metrics…)
  ├─ prisma/                  → Schéma BDD
  ├─ src/                     → Sous-systèmes « runtime » (replay, chaos, observability, scoring, watchdog…)
  └─ apps/
       ├─ api/               → Backend NestJS : orchestrateur d'entretien (FSM), LLM Gemini, voix (Deepgram/ElevenLabs)
       └─ realtime-gateway/  → Backend Fastify/WebSocket : streaming audio temps réel, moteur FSM déterministe, replay
```

**Logique métier clé identifiée :**

- **Parcours web** : Landing → Signup → Onboarding → Upload CV → Audit ATS → Optimisation → Achat de crédits (Stripe) → Dashboard de progression.
- **Système de crédits** : `lib/credits` (modes `legacy` + `transactional`), avec route de cleanup via cron Vercel.
- **Moteur d'entretien vocal (`apps/realtime-gateway`)** : une architecture très élaborée — machine à états finis (FSM) **déterministe**, moteur de sélection de questions (selectors topic/difficulty/objective), scoring explicable, **système de replay cryptographique** (hash versionné, intégrité, snapshots Postgres), politiques de récupération (« Honeypot de confiance »), persona « Clara » / « Victor ».
- **Backend NestJS (`apps/api`)** : orchestrateur FSM + handlers + providers voix (ASR Deepgram, TTS ElevenLabs) + provider LLM Gemini.

### Verdict global

- ✅ **Le produit principal (app Next.js) démarre correctement** : `next dev` boote en ~1,6 s et la page d'accueil répond **HTTP 200**.
- ✅ **Prisma génère sans erreur**, le schéma est valide.
- ⚠️ **Les deux apps backend du moteur vocal ne compilent pas** en l'état (dépendances non installées + conflit de version de SDK).
- ⚠️ **L'outillage (lint, build monorepo) est cassé/incohérent** et le dépôt est **pollué par de nombreux artefacts** commités.

Le projet est **avancé et riche fonctionnellement**, mais souffre de **dette technique d'outillage et d'intégration monorepo** typique d'un développement multi-itérations / multi-machines (Windows + CI).

---

## 2. Problèmes détectés

### 🔴 Bloquants (empêchent build/install propres)

| # | Problème | Détail technique | Impact |
| :-- | :-- | :-- | :-- |
| **B1** | **Conflit de dépendances ESLint** | Le `package.json` racine déclare à la fois `eslint@^9.39.4`, `@typescript-eslint@^8` (qui exigent eslint 9) **et** `@eslint/js@^10.0.1` (qui exige eslint ^10). `npm install` échoue avec `ERESOLVE`. | `npm install` impossible sans `--legacy-peer-deps`. Bloque CI et nouveaux contributeurs. |
| **B2** | **Sous-apps backend non installables / non compilables** | `apps/api` et `apps/realtime-gateway` ont leurs propres `package.json` mais **aucun `node_modules`** : pas de workspaces npm configurés à la racine. `tsc -b` échoue sur `@nestjs/core`, `fastify`, `pino`, `werift`, `@fastify/websocket`, `@nestjs/config`, `@nestjs/event-emitter`… (modules introuvables). | Le **moteur d'entretien vocal ne compile pas et ne tourne pas**. |
| **B3** | **Conflit de version Deepgram SDK** | `apps/realtime-gateway/src/ai/deepgram.ts` importe `createClient` et `LiveTranscriptionEvents` = **API du SDK v3**. Or la racine impose `@deepgram/sdk@^5.3.0` (installé : **5.4.0**) où ces exports n'existent plus. Le sous-package demande pourtant `^3`. | Erreurs `TS2305 has no exported member 'createClient'`. ASR cassée. |

### 🟠 Importants (qualité / hygiène repo)

| # | Problème | Détail | Impact |
| :-- | :-- | :-- | :-- |
| **I1** | **`.gitignore` corrompu en UTF-16 (fin de fichier)** | Les dernières lignes (`dist/`, `*.bundle`, `audit_tools/`, `eslint_tools/`) contiennent des octets `\r` / encodage mixte → ces patterns **ne sont pas réellement appliqués**. | `dist/` et artefacts continuent d'être trackés. |
| **I2** | **Artefacts volumineux commités dans le repo** | ~110 MB de **binaires Prisma** dans `.cache/prisma/**` (schema-engine, libquery-engine), `artifacts/trace.json` + `trace-unknown.json` = **18 MB chacun**, et **6 fichiers de rapport lint en UTF-16** (`lint-results.json`, `raw-lint.json`, `eslint-report.json`, `lint_output.json`, `errors.json`, `lint-final.txt`) ≈ 18 MB cumulés. | Repo lourd, clones lents, diffs illisibles, `.git` gonflé. |
| **I3** | **Scripts d'outillage Windows commités** | `apply-premium-upgrade.ps1`, `fix_app_ts.cjs`, dossiers `scratch/`, `beta-notes/`. | Bruit, confusion sur ce qui est « source » vs « jetable ». |
| **I4** | **Le script `build` racine n'est pas `next build`** | `"build": "tsc -b"` → le build « officiel » ne compile **pas** réellement l'app Next.js, il type-check seulement les project references (actuellement en échec → B2/B3). | `npm run build` échoue alors que l'app web fonctionne ; trompeur pour la CI/Vercel. `vercel.json` lance pourtant `npm run build`. |
| **I5** | **`next.config.mjs` masque les erreurs** | `eslint.ignoreDuringBuilds: true`. Pas de `typescript.ignoreBuildErrors`, mais comme le build ne passe pas par `next build`, le type-check des pages n'est jamais validé en CI. | Risque de régressions silencieuses côté web. |

### 🟡 Mineurs / dette diffuse

| # | Problème | Détail |
| :-- | :-- | :-- |
| **M1** | **Code dupliqué `marketing` / `marketing-old`** | Deux arborescences quasi identiques de composants marketing → confusion. |
| **M2** | **Fichiers `.jsx` ET `.tsx` jumeaux** | Ex. `CausalFlowRenderer.jsx` + `.tsx`, `renderNode.jsx` + `.tsx` → doublons à clarifier. |
| **M3** | **Erreurs lint connues** | D'après `errors.json` : `no-empty`, `no-case-declarations` (5× dans `stripe/webhook`), `no-useless-escape`, `@typescript-eslint/no-explicit-any`. Volume total non chiffrable proprement (rapports UTF-16). |
| **M4** | **`README.md` quasi vide** | 29 octets. Aucune doc d'installation/lancement pour un repreneur. |
| **M5** | **Trois branches distantes non mergées** | `feature/phase2-hardening`, `backup/ci-stabilization-2026-06-02` → travail en cours dispersé. |
| **M6** | **Incohérence de cibles TS** | `tsconfig.json` racine `target: es2015` / `module: commonjs` vs `tsconfig.base.json` `es2022` / `esnext` → configs qui peuvent diverger. |

---

## 3. Ce qui a été fait pendant cette analyse (non destructif)

> Aucune modification du code source n'a été appliquée. Seules des actions de
> diagnostic réversibles ont été réalisées dans l'environnement de travail.

- ✅ Clonage du dépôt.
- ✅ Installation des dépendances racine (via `--legacy-peer-deps`, à cause de **B1**).
- ✅ `prisma generate` → **OK**.
- ✅ Démarrage `next dev` → **OK, HTTP 200** sur `/`.
- ✅ `tsc -b` → **échec** (confirme B2 + B3, liste d'erreurs documentée ci-dessus).
- ✅ Création d'un `.env.local` factice (valeurs bidon) uniquement pour permettre le boot local — **non commité**.

---

## 4. Roadmap recommandée (progressive, par paliers)

> Principe : **stabiliser l'existant avant d'ajouter des fonctionnalités**, valider à
> chaque palier, ne rien casser. Chaque action sera présentée (diff) avant application.

### 🟢 Palier 0 — Hygiène & déblocage (risque très faible, ~rapide)
*Objectif : un `git clone && npm install` propre et un repo léger.*

1. **Corriger B1 (ESLint)** : aligner sur eslint 9 — remplacer `@eslint/js@^10.0.1` par `^9.x` (ou monter tout l'écosystème en v10 de façon cohérente). Choix recommandé : **rester en 9** (toute la chaîne `@typescript-eslint@8` et `eslint-config-next` y sont alignées).
2. **Corriger I1 (.gitignore)** : réécrire le fichier en UTF-8 propre, lignes normalisées.
3. **Nettoyer I2/I3** : `git rm --cached` des artefacts (`.cache/`, `artifacts/trace*.json`, `*lint*.json`, `errors.json`, `lint-final.txt`, `dist/`, `scratch/`), les ajouter au `.gitignore`. Conserver les rapports d'audit `.md` (valeur documentaire).
4. **Documenter (M4)** : un vrai `README.md` (prérequis, install, lancement web, lancement moteur vocal, variables d'env).

### 🟡 Palier 1 — Réparer le moteur d'entretien vocal *(périmètre prioritaire demandé)*
*Objectif : `apps/api` et `apps/realtime-gateway` compilent et démarrent.*

5. **Mettre en place de vrais npm workspaces** à la racine (ou installer les deps de chaque sous-app), pour résoudre **B2**. Décision à valider : workspaces npm vs installs indépendantes vs pnpm.
6. **Résoudre B3 (Deepgram)** : choisir UNE version de SDK.
   - *Option A (recommandée, moindre risque)* : downgrader `realtime-gateway` sur `@deepgram/sdk@^3` (l'API `createClient` du code y correspond) et isoler les deps de la racine.
   - *Option B* : migrer `deepgram.ts` vers l'API v5 (plus de travail, modernise mais touche la logique ASR).
7. **Faire passer `tsc -b`** au vert (project references `apps/api` + `apps/realtime-gateway`).
8. **Lancer les tests existants** du moteur (9 fichiers `*.test.ts` Vitest dans `realtime-gateway`, 1 spec Jest dans `api`) et publier un état réel.
9. **Vérifier le boot** : `apps/realtime-gateway` (Fastify + WS) et `apps/api` (NestJS) démarrent localement avec des clés factices/mocks.

### 🟠 Palier 2 — Cohérence build & CI
*Objectif : un build fiable et représentatif.*

10. **Clarifier I4** : séparer clairement `build:web` (`next build`) de `build:graph` (`tsc -b`), et faire pointer Vercel sur le bon. Valider que `next build` passe.
11. **Nettoyer les configs TS divergentes (M6)** et stabiliser les `paths`.
12. **Réactiver un lint exploitable** et résorber les erreurs réelles (M3) par lots (commencer par `stripe/webhook` `no-case-declarations`, qui touche un flux critique de paiement).
13. **Décider du sort des branches (M5)** : merger `feature/phase2-hardening` si pertinent, supprimer les backups obsolètes.

### 🔵 Palier 3 — Réduction de la dette diffuse
*Objectif : lisibilité & maintenabilité.*

14. **Dédupliquer `marketing` vs `marketing-old`** (M1) après confirmation de la version active.
15. **Résoudre les doublons `.jsx`/`.tsx`** (M2).
16. **Couverture de tests** sur les flux critiques web (crédits, webhook Stripe, upload/ATS).

### 🟣 Palier 4 — Évolutions produit (après stabilisation)
Alignées sur les rapports d'audit beta existants :
- Simplification du **Replay** (3 → 2 cartes) — *Replay Fatigue Drift* signalé en `BEHAVIORAL_DRIFT_REPORT.md`.
- **Seuils de silence différenciés** Junior/Senior (Honeypot) — `RECOVERY_VALIDATION_REPORT.md`.
- Event analytics `recovery_conversion`.

---

## 5. Prochaines étapes recommandées (action immédiate)

Je suggère de commencer par le **Palier 0** (déblocage sans risque, gains immédiats) puis
d'enchaîner sur le **Palier 1** (le moteur vocal, ton périmètre prioritaire).

Pour chaque modification, je te présenterai le **diff et la justification avant application**,
conformément à tes contraintes (stabilité d'abord, pas de réécriture massive injustifiée).

**Décisions qui requièrent ton arbitrage avant de coder :**
1. ESLint : rester en v9 (recommandé) ou monter en v10 ?
2. Monorepo : npm workspaces, installs indépendantes, ou migration pnpm ?
3. Deepgram : downgrade gateway en v3 (rapide) ou migration code en v5 (modernise) ?
