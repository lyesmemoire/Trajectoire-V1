# Sprint 5 — Roadmap Revalidation (Evidence First)

## Executive Summary

Suite à l'exécution de la PR 5.1.1 et 5.1.2 et à une analyse chirurgicale du bundle avec `ANALYZE=true pnpm run build`, deux hypothèses majeures de l'audit initial ont été **invalidées**. Le bundler de Next.js 15 (Webpack) est beaucoup plus intelligent que ce que l'analyse statique laissait supposer.

Le **Shared JS** (chargé sur 100% des pages) est de **103 kB (gzip)**. Il est extrêmement sain et ne contient *que* Next.js, React et le routeur. 

La pollution identifiée précédemment (PostHog, PDF, Fingerprint) était en réalité **déjà scindée dans des chunks asynchrones isolés** par le bundler, et ne bloquait pas le *First Load JS* global.

Cette revalidation redéfinit le Sprint 5 : nous abandonnons les "faux Quick Wins" pour nous concentrer sur la véritable source de lenteur restante : **l'hydratation massive des pages Dashboard due à la contamination de Framer Motion**.

---

## Phase 1 & 2 — Bundle Re-Analysis & Root Causes (Preuves)

L'analyse des chunks du dernier build révèle la véritable distribution du code :

### Top 15 Packages (Parsed Size)
| Package | Taille (Parsed) | Distribution | Statut Réel |
|---|---|---|---|
| `next` | 514.4 kB | Partagé (27 chunks) | Incompressible (Shared JS) |
| `@react-pdf/*` & `fontkit` | ~940 kB | Isolé (3 chunks) | **Lazy-loaded**. Ne bloque pas le Dashboard. |
| `recharts` | 282.2 kB | Fragmenté (8 chunks) | Chargé uniquement sur les pages stats. |
| `posthog-js` | 190.2 kB | Isolé (1 chunk) | **Déjà lazy-loaded**. Hypothèse d'audit invalidée. |
| `react-dom` | 174.2 kB | Isolé (1 chunk) | Cœur React. |
| `@supabase/*` | ~211 kB | Partagé (3 chunks) | Auth et requêtes DB. |
| `lucide-react` | 93.2 kB | Ultra-fragmenté (34 chunks) | Impact modéré par page, mais pas de cache commun. |
| `framer-motion` | 77.3 kB | Partagé (4 chunks) | **Problème critique**. Contamine les composants serveur. |
| `sonner` | 33.9 kB | Isolé (1 chunk) | **Corrigé (PR 5.1.2)**. N'est plus dans le layout global. |
| `fingerprintjs` | 33.5 kB | Isolé (1 chunk) | Lazy-loaded sur l'auth. |

---

## Phase 3 — Optimisations Invalidées (Retirées de la Roadmap)

| Optimisation | Raison de l'invalidation | Action |
|---|---|---|
| **PostHog Lazy Loading** | Next.js extrayait déjà `posthog-js` (194 kB) dans un chunk asynchrone séparé. L'impact sur le First Load JS est nul. | **Exécutée pour l'architecture, mais retirée des gains de perf.** |
| **Suppression de `force-dynamic`** | Les pages Dashboard dépendent de `createServerClient().auth.getUser()` (lecture de cookies). Elles sont intrinsèquement dynamiques. Retirer le flag ne restaure pas le cache statique. | **Retirée**. La vraie solution (Partial Prerendering) est trop risquée. |

---

## Phase 4 — Optimisations Conservées (ROI Recalculé)

| Optimisation | Gain Réellement Mesurable | Confiance | Pourquoi c'est valide |
|---|---|---|---|
| **Sonner Toaster Lazy Load** | **9.3 kB (gzip) / 33.9 kB (parsed)** sur toutes les pages `(app)/*`. | **Mesuré (PR 5.1.2)** | Retiré avec succès du chunk du layout global. |
| **Framer Motion Isolation (Server Components)** | **~30 à 60 kB (gzip)** par page Dashboard + **Baisse drastique du temps d'hydratation (CPU)**. | Estimé avec preuve | Actuellement, les énormes widgets (`career-copilot`, etc.) sont marqués `"use client"` juste pour pouvoir animer des divs. En isolant les animations dans un `<AnimatedCard client>`, nous pouvons rendre le contenu textuel/structurel sur le serveur. |
| **Génération PDF Server-Side** | **0 kB sur First Load**, mais **~300-400 kB (gzip) économisés lors de l'export**. | Estimé avec preuve | `@react-pdf` est lazy-loaded, mais lors du clic sur "Export", le navigateur fige pendant le téléchargement et l'exécution d'1 MB de JS (dont des polyfills Node.js `buffer`). |

---

## Phase 5 — Nouveau Planning Sprint 5 (Evidence-Based)

Le backlog est purgé des "faux espoirs". Il ne reste plus de "Quick Wins magiques" de 200 kB sur le bundle initial. Le Shared JS est déjà à l'os (103 kB).

Le véritable gisement d'optimisation réside désormais dans la **dés-hydratation** (passer les composants Client en composants Serveur).

### Sprint 5.1 — Quick Wins (< 2h)
*Il n'y a plus de Quick Wins majeurs liés à la taille du bundle initial.*
- [x] PR 5.1.1 : PostHog Refactoring (Fait - Gain architectural)
- [x] PR 5.1.2 : Sonner Lazy Loading (Fait - Gain mesuré : 9.3 kB gzip sur tout le layout)

**Le Sprint 5.1 est officiellement terminé.**

### Sprint 5.2 — Refactoring Architectural (ROI Élevé, Temps Moyen)
L'objectif unique : Tuer le `"use client"` à la racine des widgets.

| Tâche | Gain | Temps | Risque |
|---|---|---|---|
| **PR 5.2.1 — Isolation de Framer Motion**<br>Créer un wrapper `<AnimatedCard "use client">` et `<FadeIn "use client">`. Retirer `"use client"` des gros widgets (`career-forecast`, `planning-intelligence`, etc.). | ~40 kB gzip par page + CPU divisé par 2 à l'hydratation | 2h - 4h | Moyen (Hydratation mismatches possibles) |

### Sprint 5.3 — Refonte Complète (ROI Long Terme, Temps Long)
L'objectif : Protéger la mémoire du navigateur client.

| Tâche | Gain | Temps | Risque |
|---|---|---|---|
| **PR 5.3.1 — PDF Server Route**<br>Déplacer la logique `@react-pdf` dans un Route Handler `/api/cv/export`. Le client reçoit juste un blob PDF. | ~940 kB (Parsed) évités lors de l'export + fin des crashs RAM sur mobile. | 4h - 6h | Élevé (Changement API et Blob handling) |
