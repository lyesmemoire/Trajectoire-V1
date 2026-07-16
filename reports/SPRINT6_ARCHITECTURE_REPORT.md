# Sprint 6 Architecture Report

## Executive Summary
L'audit complet des flux du serveur revele que la page Dashboard constitue actuellement un goulot d'etranglement monolithique. Bien que la taille du bundle ait ete reduite via le Sprint 5 (les Server Components statiques sont legers sur le navigateur), le Dashboard charge **de facon totalement asynchrone et sequentielle** 17 moteurs d'IA differents avant d'emettre le moindre rendu HTML.

**Gains Estimes (Top 20)** : Le simple remplacement de ces `await` par une parallelisation (`Promise.all`) ou des boundaries (`Suspense`) amenerait des gains spectaculaires sur le Time To First Byte (TTFB) avec un **ROI 5/5**.

### Top 3 Quick Wins (< 2h)
1. **Parallel Fetch Base de Donnees** : `Promise.all` sur `candidateAIBrain.load` et `CandidateGraphDataLoader.loadFromRealData`. (Gain estime: ~150ms)
2. **Parallel Fetch Moteurs IA** : Executer les 17 moteurs simultanement. (Gain estime: >2 secondes sur le build time CPU et TTFB !)
3. **Memoization / React Cache** : Isoler la donnee du Candidate Graph dans un `cache()` React pour eviter le refetch accidentel en deplaçant les appels vers les sous-composants.

---

## Performance Budget
- **TTFB** : Cible a 200ms maximum (actuellement bloqué par les IA).
- **Flight Payload** : Restera dense, mais sera fragmente grace au streaming.
- **CPU Serveur** : Reduction consequente du bottleneck via la parallelisation event-loop Node.js.
- **Streaming** : Implementation progressive (Sidebar statique, Squelettes, Remplacements a la resolution).
- **Cache Hit** : React.cache a utiliser massivement par requete, suivi de `unstable_cache` a moyen terme.

---

## Scorecard d'Architecture Initiale

| Domaine | Note Actuelle | Opportunite d'Evolution |
|---|---|---|
| **Streaming** | 0/10 | Mise en place de 10-15 `<Suspense>` loaders (Tres Forte) |
| **Cache** | 1/10 | Tout est `force-dynamic` (Moyenne, donnees hyper-dynamiques) |
| **Server Components** | 9/10 | Nettoye au Sprint 5 (Parfait) |
| **Data Layer** | 4/10 | Nombreux Waterfalls massifs (Tres Forte) |
| **Supabase** | 6/10 | Les donnees sont bonnes mais fetches separes (Forte) |
| **OpenAI / Moteurs** | 4/10 | Executes sequentiellement (Urgence P0) |
| **Scalabilite** | 3/10 | L'event-loop sera saturee en production sans parallelisation |
| **Maintainability** | 5/10 | Un Mega-Composant de 770 lignes concentre toute la logique. |

---

## Roadmap

### Sprint 6.1 (Quick Wins - <2h)
1. Refactoriser la Page Dashboard pour englober la DB via `Promise.all`.
2. Lancer tous les `Engine.generate...` dans une seule grappe `Promise.all` pour un rendu simultane massivement accelere.
3. Mettre a jour les types en consequence.

### Sprint 6.2 (Architecture moyenne)
1. Deplacer les logiques metiers de la Page racine vers des Composants Loaders (ex: `DailyCoachLoader.tsx`).
2. Introduire les `<Suspense fallback={<CardSkeleton />}>` dans la grille du dashboard.
3. Permettre a la page principale d'etre delivree immediatement a l'utilisateur.

### Sprint 6.3 (Refonte importante)
1. Introduire `React.cache()` au niveau des wrappers de graphe pour eviter d'eclater Supabase si 10 loaders font `loadFromRealData`.
2. Reactiver un TTL via `unstable_cache` ou une strategie Edge Config pour les previsions d'IA lourdes si leur duree d'execution est > 1s (maintient l'UX au top).

### Sprint 7 (Long Term)
- Implementation du Partial Prerendering (PPR) des qu'active et stable (React Compiler).
- Exploration de Supabase Realtime RSC pour envoyer de nouvelles donnees directement au client sans rafraichissement explicite (ex: Notification).
