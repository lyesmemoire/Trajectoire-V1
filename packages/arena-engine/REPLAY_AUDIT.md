# Module Replay

## État actuel
Le module Replay, localisé dans `components/replay/` et invoqué par `app/interview/[sessionId]/results/page.tsx`, est la vue de débriefing de fin de session. Il affiche la performance de l'utilisateur sous forme de chronologie d'événements et d'une courbe de tension. 
Actuellement, l'interface affiche 3 cartes principales en haut de page, suivies d'une frise chronologique verticale :
- **Carte A** : Profil de Session (Archétype détecté, ex: Analytical Thinker).
- **Carte B** : Bilan Comportemental (Feedback global statique ou généré).
- **Carte C** : Courbe de Tension Psychologique (Graphique d'évolution de la pression au fil du temps).

## Fonctionnalités détectées
- Calcul d'un **Archétype** (via la confiance moyenne des réponses).
- Calcul du **Recovery Score** (lorsqu'une réponse obtient un score supérieur de 20 points à la précédente).
- **Événements Analytics** (suivi via `ReplayTracker.tsx` avec `ReplayAnalytics.opened`, `wow_moment_hit`, `ReplayAnalytics.completed`, `ReplayAnalytics.abandoned`).
- **Dépendance Career DNA** : Mise à jour silencieuse à la fin de la session d'entretien (`POST /api/career/update`) pour transmettre le `recoveryCount`, `communicationScore`, etc.

## Gaps
- [OK] Archétype et calcul basique
- [OK] Analytics de base (ouverture, complétion, abandon)
- [PARTIAL] Courbe de Tension : La donnée est synthétique et reconstruite dans le générateur à partir de variables `duration`, `pressureBefore`, `pressureAfter`.
- [PARTIAL] UX des 3 cartes : L'espace est inutilement scindé entre Profil et Bilan Comportemental.
- [MISSING] Lien direct entre la page de résultat (`/results`) et le dashboard Progress/Career DNA.

## Risques
- **Risque UI** : La présence de 3 cartes surcharge l'en-tête et détourne l'attention de la courbe de tension.
- **Risque d'intégration** : En supprimant ou modifiant l'une de ces cartes, veiller à ne perdre aucune donnée analytique (comme le `wow_moment_hit` ou la métrique d'Archétype), et bien passer les propriétés nécessaires.

## Recommandations
1. **Simplification (Passage de 3 à 2 cartes)** : Fusionner la Carte A (Profil de Session) avec la Carte B (Bilan Comportemental) pour n'avoir plus qu'une seule carte de synthèse textuelle, juxtaposée ou placée au-dessus du Graphique de Tension.
2. **Ne pas toucher à la logique backend** du `replay-generator.ts` ni aux dépendances `Career DNA`. Limiter strictement l'intervention à `replay-timeline.tsx`.
