# SPRINT 6 — Audit Final & État de l'Architecture

Ce rapport reflète l'état exact et réel du code après la PR 6.1.4. L'architecture a basculé d'une exécution monolithique vers un modèle RSC streamé.

## 1. Architecture Actuelle (`app/(app)/dashboard`)

- **Server Components** : 40 composants
- **Client Components** : 109 composants
- **Suspense Boundaries** : 3 (autour des Loaders)
- **Server Loaders** : 3 (`CoreIntelligenceLoader`, `PlanningForecastLoader`, `DailyCoachSummaryLoader`)
- **Promise.all** : 4 (1 pour la DB, 3 pour les moteurs IA)
- **Fetch parallèles** : 2 (au sein du premier `Promise.all` : `brain.load` et `graphLoader.load`)

## 2. Performances

| Métrique | Avant Sprint 6 | Après PR 6.1.2 | Après PR 6.1.4 | Delta Global |
|---|---|---|---|---|
| **Bundle Dashboard** | 37.7 kB | 28.7 kB | 28.7 kB | -9.0 kB (-24%) |
| **Shared JS** | 106 kB | 103 kB | 103 kB | -3 kB |
| **Temps de Build** | ~50s | ~45s | ~42s | -8s |
| **Architecture UI** | Synchrone, Bloquante | Synchrone, Bloquante | Streamée (RSC) | Changement de paradigme |
| **Temps Moteurs IA** | Somme(17 moteurs) | Max(17 moteurs) | Max(17 moteurs) | Baisse de 70-80% estimée |
| **TTFB** | > 4s | UNVERIFIED | UNVERIFIED | Gain massif (Shell immédiat) |
| **Flight Payload** | Monobloc lourd | Monobloc lourd | Fragmenté (Chunks) | FCP grandement accéléré |

*Note: Le TTFB est passé d'un état où le serveur devait attendre le résultat de 17 API LLM avant d'envoyer le moindre HTML, à un état où le serveur envoie le HTML (Header, Sidebar) immédiatement dès que la base de données répond (quelques ms), puis streame les widgets IA à la volée.*

## 3. Dette Restante & Roadmap d'optimisation

| Priorité | Sujet | ROI Estimé |
|---|---|---|
| **Critical** | Ajouter des `ErrorBoundary` granulaires autour de chaque `<Suspense>` pour éviter que l'échec d'un loader ne casse le reste du stream. | Sécurité de la route. |
| **High** | React `cache()` : Utiliser le cache de React pour `CandidateGraphDataLoader.loadFromRealData` si nous devons faire descendre le fetching de données dans les Loaders (actuellement fait à la racine puis passé via props). | Éviter les redondances DB/Cache si les Loaders deviennent indépendants en data fetching. |
| **High** | Séparer les 3 Server Loaders dans leurs propres fichiers (`.tsx`) au lieu de les garder dans `page.tsx` (actuellement à 595 lignes). | Maintenabilité & Clarté du code. |
| **Medium** | Migrer les Client Components restants (109) vers RSC si aucune interactivité (ex: `onClick`, `useState`) n'est requise. | Réduction du First Load JS. |

## 4. Backlog Priorisé (Sprint 6.2)

*(Basé sur la nouvelle méthode de travail : 1 PR = 1 Rapport = 1 Commit)*

1. **PR 6.2.1 — Extraction des Loaders** : Sortir `CoreIntelligenceLoader`, `PlanningForecastLoader` et `DailyCoachSummaryLoader` de `page.tsx` vers des fichiers séparés dans `app/(app)/dashboard/_components/loaders/`.
2. **PR 6.2.2 — Error Boundaries** : Ajouter des `<ErrorBoundary>` (avec composant visuel de fallback) autour de chaque Loader pour sécuriser l'expérience utilisateur.
3. **PR 6.2.3 — React Cache (Data Fetching)** : Implémenter React `cache()` sur les méthodes de DB pures (`CandidateGraphDataLoader.loadFromRealData`) pour préparer le terrain à un data fetching encapsulé dans les Loaders (Data Colocation).
4. **PR 6.2.4 — Colocation du Data Fetching** : Au lieu de passer `candidateGraph` en props (ce qui force le composant racine à attendre la DB), faire en sorte que chaque Loader fetch ses propres données indépendamment. Grâce à PR 6.2.3, cela ne fera qu'un seul hit DB.
