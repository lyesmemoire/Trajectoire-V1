# Async Components Audit

## Page Globale Async
Actuellement, la `page.tsx` agit comme un Mega-Async-Component.

## Cibles de fragmentation
Pour permettre le streaming, la `page.tsx` doit idealement lancer les `promises` et les passer en props (sans utiliser `await`), ou l'architecture doit s'orienter vers des "Component Loaders".

### Wrappers (Loaders) necessaires :
- `<DailyCoachLoader>`
- `<ForecastLoader>`
- `<ProgressionPlanLoader>`
- `<TimelineLoader>`

Chacun sera definit avec `async function Loader(...)` et fera son propre appel a son moteur d'IA respectif, permettant au composant parent (la page) de ne jamais bloquer et de retourner l'arbre RSC incluant les boundaries `<Suspense>` instantanement.
