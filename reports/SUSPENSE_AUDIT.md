# Suspense Audit

## Constat Actuel
Le composant racine `DashboardHome` (`app/(app)/dashboard/page.tsx`) ne definit aucune boundary `<Suspense>`. Il charge absolument toute la page cote serveur avant de l'envoyer au navigateur.

## Opportunites (ROI)

| Composant | Temps Estime | Bloquant ? | Streaming Possible | ROI |
|---|---|---|---|---|
| StatsGrid / Header | <50ms | Non | Immédiat | P0 |
| DailyCoachWidget | ~100-300ms | Oui | Oui | P0 |
| ProgressionPlan | ~300ms | Oui | Oui | P0 |
| CareerForecast | ~200ms | Oui | Oui | P0 |
| Tous les autres | ~1s total | Oui | Oui | P1 |

**Action recommandee** : Isoler chaque widget dans un Server Component (un "Loader") enveloppe par un `<Suspense fallback={<CardSkeleton />}>`.
