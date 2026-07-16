# SPRINT 6.1.4 — Introduce Suspense Boundaries

## Objectif
Envelopper chaque Server Component Loader dans une boundary `<Suspense>` pour activer le streaming RSC. Le navigateur recoit immediatement le shell HTML (Header, StatsGrid, Sidebar) et les widgets IA-intensifs apparaissent progressivement.

## Liste complete des Suspense Boundaries

| # | Ligne | Composant enveloppe | Fallback |
|---|---|---|---|
| 1 | L474-476 | `<PlanningForecastLoader />` | `<><CardSkeleton /><CardSkeleton /><CardSkeleton /></>` (3 squelettes) |
| 2 | L478-480 | `<DailyCoachSummaryLoader />` | `<CardSkeleton />` (1 squelette) |
| 3 | L482-484 | `<CoreIntelligenceLoader />` | `<><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></>` (4 squelettes) |

**Total : 3 Suspense Boundaries** (contre 0 avant le Sprint 6).

## Fallbacks utilises

Tous les fallbacks utilisent `<CardSkeleton />` importe depuis `@/components/design-system`. Ce composant existait deja et etait utilise comme fallback des `next/dynamic` imports. Aucun nouveau composant n'a ete cree.

Le nombre de squelettes dans chaque fallback est calibre pour approximer la hauteur visuelle des widgets qu'ils remplacent.

## Ordre de streaming

```
T=0ms   ─── Shell HTML ───────────────────────────────
        │ Layout (Sidebar, Navigation)               │
        │ Header "Bonjour, {displayName}"            │
        │ StatsGrid (4 stats)                        │
        │ [CardSkeleton] x3 (PlanningForecast)       │
        │ [CardSkeleton] x1 (DailyCoachSummary)      │
        │ [CardSkeleton] x4 (CoreIntelligence)       │
        │ TimelineWidget                             │
        │ LiveScoresWidget                           │
        │ BrainHistoryWidget                         │
        │ StrengthsWeaknessesWidget                  │
        │ CareerTimelineWidget                       │
        │ ProgressWidget (sidebar)                   │
        │ BrainGoalsWidget (sidebar)                 │
        │ BrainRecommendationsWidget (sidebar)       │
        │ QuickActions (sidebar)                     │
        └─────────────────────────────────────────────

T+Xms   ─── Stream 1 (PlanningForecastLoader) ───────
        │ ProactiveInitiatives                       │
        │ ProgressionPlan                            │
        │ CareerForecast                             │
        │ WhyScore, WhyPlan, WhyForecast             │
        └─────────────────────────────────────────────

T+Yms   ─── Stream 2 (DailyCoachSummaryLoader) ──────
        │ DailySummary                               │
        │ DailyCoachWidget                           │
        └─────────────────────────────────────────────

T+Zms   ─── Stream 3 (CoreIntelligenceLoader) ───────
        │ DigitalTwin, ScenarioIntelligence          │
        │ AutonomousIntelligence, OutcomeIntelligence│
        │ PersonalizationIntelligence, CareerMission │
        │ EvidenceIntelligence, ConstraintIntelligence│
        │ ResourceIntelligence                       │
        │ DecisionOfTheDay, EngagementTracking       │
        │ StrategyEvolution                          │
        └─────────────────────────────────────────────
```

**Note** : X, Y, Z ne sont pas mesures. L'ordre d'arrivee depend du temps reel d'execution de chaque Loader. Les 3 Loaders s'executent en parallele cote serveur.

## Composants streames vs composants bloquants

### Streames (arrivent progressivement via Suspense)
- ProactiveInitiatives, ProgressionPlan, CareerForecast
- WhyScore, WhyPlan, WhyForecast
- DailySummary, DailyCoachWidget
- DigitalTwin, ScenarioIntelligenceWidget, AutonomousIntelligence
- OutcomeIntelligence, PersonalizationIntelligence, CareerMission
- EvidenceIntelligence, ConstraintIntelligence, ResourceIntelligence
- DecisionOfTheDay, EngagementTracking, StrategyEvolution

**Total : 20 widgets streames**

### Bloquants (attendent `loadDashboardData`)
- Header ("Bonjour X")
- StatsGrid
- TimelineWidget
- LiveScoresWidget
- BrainHistoryWidget
- StrengthsWeaknessesWidget
- CareerTimelineWidget
- ProgressWidget
- BrainGoalsWidget
- BrainRecommendationsWidget
- QuickActions

**Total : 11 widgets bloquants**

Ces widgets sont "bloquants" uniquement par le temps de `loadDashboardData` (requete DB pure, pas d'IA). Ce temps est de l'ordre de quelques centaines de millisecondes maximum.

## Impact Flight Payload

Le Flight Payload total reste identique en volume (memes donnees, memes widgets). La difference est que le payload est desormais **fragmente** en chunks :
1. Chunk initial : shell + widgets synchrones
2. Chunks suivants : un par Loader resolu

Cela reduit le temps avant le premier affichage significatif (FCP), meme si le volume total transfere est le meme.

## Impact TTFB estime

| Metrique | Avant (PR 6.1.2) | Apres (PR 6.1.4) | Confiance |
|---|---|---|---|
| TTFB | Bloque par tous les engines IA | Bloque uniquement par `loadDashboardData` (DB) | UNVERIFIED |
| Gain estime | - | Plusieurs secondes | UNVERIFIED |

Le TTFB ne peut pas etre mesure sans deploiement ou serveur de dev avec donnees reelles.

## Impact FCP estime

| Metrique | Avant | Apres | Confiance |
|---|---|---|---|
| FCP | Apres resolution de tous les engines | Apres resolution de `loadDashboardData` + rendu du shell | UNVERIFIED |

Le FCP est desormais decouple du temps de calcul IA. L'utilisateur voit le Header, les Stats et la Sidebar immediatement.

## Impact LCP estime

| Metrique | Avant | Apres | Confiance |
|---|---|---|---|
| LCP | Probablement le dernier widget IA rendu | Probablement le `StatsGrid` ou un widget synchrone | UNVERIFIED |

Le LCP devrait s'ameliorer significativement car les elements visuellement dominants (Header, StatsGrid) sont rendus dans le shell initial.

## Build

- `pnpm build` : passe sans erreur
- Dashboard bundle : **28.7 kB** (inchange)
- Shared JS : **103 kB** (inchange)
- First Load JS : **251 kB** (inchange)
- Aucun JS client supplementaire (Suspense est natif React, pas d'import supplementaire)

## Playwright

- `p1-dashboard.spec.ts` : **30/30 passed** (Chromium 15/15 + WebKit 15/15)
- Temps total : 1.4m

## Limites connues

1. **Pas de mesure TTFB/FCP/LCP reelle** : Ces metriques ne peuvent etre mesurees qu'avec un serveur de dev et des donnees utilisateur reelles, ou via Lighthouse apres deploiement.
2. **Ordre visuel** : Le streaming peut provoquer un "saut" visuel lorsque les squelettes sont remplaces par les vrais widgets (Cumulative Layout Shift). Les `<CardSkeleton />` attenuentt ce risque mais ne le suppriment pas totalement.
3. **Erreur dans un Loader** : Si un Loader echoue entierement (pas seulement un engine individuel), le fallback restera affiche indefiniment. Les `.catch(() => null)` par engine mitigent ce risque.
4. **`candidateAIBrain` singleton** : Le brain est un objet mutable global. Les 3 Loaders lisent son etat apres `loadDashboardData`, mais si un Loader modifiait accidentellement le brain, cela pourrait affecter les autres. Actuellement aucun Loader ne le modifie.
5. **Loaders co-localises** : Les 3 Loaders sont dans le meme fichier `page.tsx` (595 lignes). Un refactoring futur pourrait les extraire dans des fichiers separes pour ameliorer la maintenabilite.
