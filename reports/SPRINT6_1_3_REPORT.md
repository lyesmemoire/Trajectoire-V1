# SPRINT 6.1.3 — Remove Waterfall Rendering (Independent Server Loaders)

## Objectif
Extraire la logique de chargement IA du composant monolithique `DashboardHome` vers des Server Components autonomes (Loaders). Chaque Loader est responsable de son propre `await` et de son propre rendu JSX.

## Architecture avant (PR 6.1.2)

```
DashboardHome (617 lignes, 1 seule fonction async)
  ├── await auth
  ├── await Promise.all(brain, graph)         ← PR 6.1.1
  ├── await Promise.all(12 core engines)      ← PR 6.1.2 Stage 1
  ├── await Promise.all(3 planning engines)   ← PR 6.1.2 Stage 2
  ├── await Promise.all(2 coach engines)      ← PR 6.1.2 Stage 3
  ├── data transforms (helpers, stats, timeline)
  └── return <JSX complet>                    ← tout envoye d'un bloc
```

Le composant racine restait async et bloquant : le HTML n'etait envoye qu'apres la resolution de TOUS les stages, meme si les stages eux-memes etaient paralleles.

## Architecture apres (PR 6.1.3)

```
loadDashboardData(userId)                     ← fonction utilitaire partagee
  ├── Promise.all(brain, graph)               ← donnees DB uniquement
  └── return { candidateGraph, brainData }

CoreIntelligenceLoader({ candidateGraph })    ← Server Component async
  ├── Promise.all(12 core engines)
  └── return <JSX: 12 widgets>

PlanningForecastLoader({ candidateGraph })    ← Server Component async
  ├── Promise.all(3 planning engines)
  └── return <JSX: 6 widgets (plan + why)>

DailyCoachSummaryLoader({ candidateGraph, brainGoals, brainInsights })
  ├── Promise.all(2 coach engines)            ← Server Component async
  └── return <JSX: 2 widgets>

DashboardHome()                               ← composant racine
  ├── await auth
  ├── await loadDashboardData(user.id)        ← seul await restant (DB pure)
  ├── data transforms (helpers, stats)        ← synchrone
  └── return <JSX>
        ├── Header (sync)
        ├── StatsGrid (sync)
        ├── <PlanningForecastLoader />        ← async, independant
        ├── <DailyCoachSummaryLoader />       ← async, independant
        ├── <CoreIntelligenceLoader />        ← async, independant
        └── MainContentGrid (sync)
```

## Liste complete des Server Loaders crees

| Loader | Fichier | Ligne | Moteurs encapsules | Widgets rendus |
|---|---|---|---|---|
| `loadDashboardData` | page.tsx | L63-82 | brain.load, graphDataLoader | (fonction utilitaire, pas un composant) |
| `CoreIntelligenceLoader` | page.tsx | L86-193 | 12 moteurs (DigitalTwin, Autonomous, Outcome, Personalization, Mission, Evidence, Constraint, Resource, Scenario, Decision, Adaptive, Accountability) | 12 widgets + Strategy + Decision + Engagement |
| `PlanningForecastLoader` | page.tsx | L195-275 | 3 moteurs (ProgressionPlan, Forecast, ProactiveInitiatives) | 6 widgets (ProactiveInitiatives, ProgressionPlan, CareerForecast, WhyScore, WhyPlan, WhyForecast) |
| `DailyCoachSummaryLoader` | page.tsx | L277-321 | 2 moteurs (DailyCoach, DailySummary) | 2 widgets (DailySummary, DailyCoachWidget) |

## Dependances deplacees

Les imports engine (17 imports) restent dans `page.tsx` car les Loaders sont co-localises dans le meme fichier. Aucune dependance externe n'a ete ajoutee ni supprimee.

Les props passees aux Loaders :
- `CoreIntelligenceLoader` : recoit `candidateGraph`
- `PlanningForecastLoader` : recoit `candidateGraph`
- `DailyCoachSummaryLoader` : recoit `candidateGraph`, `brainGoals`, `brainInsights`

## Impact lisibilite

| Critere | Avant | Apres |
|---|---|---|
| Lignes du composant racine | ~617 | ~270 (L325-595) |
| Nombre de `await` dans le composant racine | 4 (auth + 3 stages) | 2 (auth + loadDashboardData) |
| Responsabilites du composant racine | Auth + DB + IA + Transforms + Rendu | Auth + DB + Transforms + Rendu |
| Fichier total | 617 lignes (fichier unique) | 595 lignes (fichier unique, mais segmente logiquement) |

## Impact maintenabilite

- **Positif** : Chaque Loader peut etre modifie, debug ou desactive independamment.
- **Positif** : L'ajout d'un nouveau moteur IA se fait dans le Loader concerne sans toucher au composant racine.
- **Neutre** : Les Loaders restent dans le meme fichier. Un futur refactoring pourrait les extraire dans des fichiers separes.

## Impact estime sur le streaming

Sans `<Suspense>` (PR 6.1.3 seule), le streaming n'est **pas encore actif**. React attend toujours la resolution de tous les enfants async avant d'envoyer le HTML. La PR 6.1.3 est une **preparation structurelle** pour la PR 6.1.4.

## Build

- `pnpm build` : passe sans erreur
- Dashboard bundle : 28.7 kB (inchange)
- Shared JS : 103 kB (inchange)
- First Load JS : 251 kB (inchange)

## Tests

- Playwright `p1-dashboard.spec.ts` : **30/30 passed** (Chromium + WebKit)

## Risques

| Risque | Probabilite | Impact | Mitigation |
|---|---|---|---|
| Props drilling excessif si les Loaders grandissent | Faible | Faible | Extraire dans des fichiers separes avec imports directs |
| Singleton `candidateAIBrain` partage entre Loaders | Moyenne | Moyenne | Le brain est charge une seule fois dans `loadDashboardData`, les Loaders ne font que lire l'etat |
| Ordre visuel des widgets modifie | Faible | Faible | Verifie : le JSX preserve l'ordre original |
