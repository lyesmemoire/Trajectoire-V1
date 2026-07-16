# Sprint 6.3.2 — Replay Chart Bundle Audit

## Phase 0 — Audit des imports (`components/replay/pressure-graph.tsx`)

| Élément | Présent | Détails |
| :--- | :---: | :--- |
| Import direct de recharts | ❌ | Il n'importe pas `recharts`, il importe uniquement son `.client.tsx` dynamiquement. |
| Import de `components/design-system/charts` | ❌ | Non utilisé. |
| `"use client"` | ✅ | Présent à la première ligne. |
| `dynamic()` déjà présent | ✅ | Oui : `dynamic(() => import('./pressure-graph.client')...)` |
| SSR actuel | Non | L'option `ssr: false` est déjà activée. |
| Hooks React | Aucun | Le composant ne contient aucun hook, il ne sert que de proxy. |

### Fichier source audité

```
// pressure-graph.tsx (9 lignes)
"use client";
import dynamic from 'next/dynamic';
import React from 'react';

const loading = () => <div className="w-full h-[300px] animate-pulse bg-slate-100 rounded-lg border border-slate-200" />;

export const PressureGraph = dynamic(
  () => import('./pressure-graph.client').then(m => m.PressureGraph),
  { ssr: false, loading }
);
```

**Conclusion Phase 0 :** Le composant `pressure-graph.tsx` **est déjà un proxy** parfaitement conforme au pattern cible. Le fichier `.client.tsx` associé contient les imports `recharts` (`AreaChart`, `Area`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`, `ReferenceLine`).

---

## Phase 1 — Audit de la chaîne d'import

### Chaîne complète

```
Replay Page (app/interview/[sessionId]/results/page.tsx)
    ↓
    ❌ ROUTE INEXISTANTE — jamais compilée par Next.js
    
components/replay/replay-timeline.tsx ("use client")
    ↓ import statique
components/replay/pressure-graph.tsx ("use client", PROXY)
    ↓ next/dynamic (ssr: false)
components/replay/pressure-graph.client.tsx ("use client")
    ↓ import direct
recharts (AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine)
```

### Consommateurs identifiés

| Fichier | Importe `ReplayTimeline` ? | Importe `PressureGraph` ? |
| :--- | :---: | :---: |
| `app/` (toutes les pages) | ❌ | ❌ |
| `src/replay/types.ts` | ❌ (type homonyme) | ❌ |
| `src/replay/contracts.ts` | ❌ (type homonyme) | ❌ |
| `REPLAY_AUDIT.md` | Mention textuelle | Mention textuelle |

**Résultat :** `ReplayTimeline` et `PressureGraph` sont des **composants orphelins**. Aucune route Next.js ne les instancie. Ils ne contribuent à aucun chunk client compilé.

### Réponses aux questions

- **Existe-t-il déjà un `dynamic()` dans cette chaîne ?** ✅ Oui, dans `pressure-graph.tsx`.
- **Existe-t-il déjà un proxy ?** ✅ Oui, `pressure-graph.tsx` est le proxy, `pressure-graph.client.tsx` est l'implémentation.
- **Existe-t-il un double lazy loading potentiel ?** ❌ Non. L'import dans `replay-timeline.tsx` est statique, le `dynamic()` est dans le proxy.

---

## Phase 2 — Analyse Bundle

Mesures issues de `ANALYZE=true pnpm build` (baseline capturée lors du Sprint 6.3.1) :

| Route | First Load JS |
| :--- | :--- |
| `/admin/replay-insights` | 104 kB (1.46 kB propre + 103 kB shared) |
| Replay (route dédiée) | **N/A — route inexistante** |
| **Shared JS** | **103 kB** |

### Réponses précises

1. **`recharts` apparaît-il dans le bundle Replay ?**
   → **Non.** La route Replay n'existe pas dans le routeur. La page `/admin/replay-insights` (1.46 kB) n'importe ni `ReplayTimeline` ni `PressureGraph`.

2. **Taille exacte du chunk contenant Recharts :**
   → **0 kB d'impact** sur le First Load JS des routes Replay. Recharts n'est chargé que par les routes qui instancient réellement un composant graphique.

3. **Nombre de chunks générés :**
   → Aucun chunk spécifique Replay/PressureGraph dans le build.

4. **Le graphique est-il déjà chargé de manière différée ?**
   → ✅ Oui. Le pattern `dynamic(() => import('./pressure-graph.client'), { ssr: false })` est déjà en place.

---

## Phase 3 — Décision

### Classification : Cas C — ROI nul

| Condition du Cas C | Vérifié ? |
| :--- | :---: |
| Recharts déjà hors bundle initial | ✅ |
| Proxy déjà présent | ✅ |

**Raisons supplémentaires :**
- Le composant est orphelin (aucune route ne l'instancie).
- Le pattern Proxy + `.client.tsx` + `ssr: false` est déjà en place nativement.
- Aucune modification ne peut produire un gain mesurable.

---

## Phase 4 — Non applicable

Le Cas A n'étant pas vérifié, aucun plan de modification n'est proposé.

---

## Recommandation finale

### 🔴 NO GO — Sprint 6.3.2 arrêté

**Gain attendu : 0 kB.**

Le composant `PressureGraph` cumule deux raisons de ne pas être modifié :
1. Il implémente **déjà** le pattern Proxy + `dynamic()` + `ssr: false`.
2. Il est **orphelin** — aucune route Next.js ne l'instancie dans le build actuel.

### Recommandations alternatives à plus fort ROI

| Piste | ROI estimé | Complexité |
| :--- | :--- | :--- |
| `unstable_cache` / React cache sur les data loaders du Dashboard | Élevé (réduction TTFB) | Moyenne |
| Colocation des données serveur (réduction des waterfalls) | Élevé | Moyenne |
| Audit des routes > 200 kB First Load (`career-copilot` : 410 kB, `interview-simulation` : 351 kB) | Très élevé | Haute |
| PR 6.3.3 (Admin AI) — vérifier si les composants AI sont dans le même cas | À auditer | Faible |
