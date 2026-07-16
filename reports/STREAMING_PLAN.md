# Streaming Plan

## Architecture Cible

Pour eliminer les attentes du client, la strategie de chargement sera divisee en vagues de priorite :

1. **Vague 0 - Immediat (TTFB = 50ms)** : Sidebar, Header, Elements textuels synchrones de bienvenue ("Bonjour X"), et Squelettes (`CardSkeleton`) des widgets.
2. **Vague 1 - Rapide (Fetch DB)** : `StatsGrid` et `Timeline` basiques, qui ne necessitent que le graphe statique sans analyse IA.
3. **Vague 2 - Moyen (IA legere)** : `StrengthsWeaknessesWidget`, `QuickActions`, basés sur des patterns precalcules.
4. **Vague 3 - Complexe (IA intensive, >1s)** : `DailyCoachWidget`, `CareerForecast`, `ProgressionPlan`, `AutonomousIntelligence`. Ces composants remplaceront les squelettes lorsqu'ils auront fini de traiter.

Cette decantation progressive maintient l'engagement utilisateur au plus haut, plutot que de le faire poireauter devant un ecran blanc.
