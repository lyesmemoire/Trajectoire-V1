# Module Career DNA

**Status: IMPLEMENTED**

**Changes:**
- EMA smoothing applied (0.7 / 0.3) for all trait scores (communication, confidence, technical, leadership).
- Refactored `globalScore` into `employabilityScore` to perfectly match the Prisma schema and act as the computed global metric.
- Career DNA now behaves as a temporal memory model, persisting complex traits inside the JSON field.

**Behavior:**
- Scores evolve gradually.
- No overwriting of historical signal; if a previous score exists, the new value is smoothed using the EMA formula. If no previous score exists, the incoming signal initializes the metric.

---

## État actuel
Le module Career DNA gère le profil persistant du candidat (l'évolution de ses scores au fil des sessions) via un pipeline de la fin de l'interview jusqu'au dashboard.
- **Interview** : À la fin de la session, la route POST `/api/career/update` est appelée.
- **API/Calcul** : L'API valide les données, met à jour le profil avec lissage EMA (`updateCareerProfile`), et fait évoluer l'archétype (`updateArchetypeEvolution`).
- **Dashboard** : La vue affiche l'Archétype courant, précédent, et l'historique complet (jusqu'à 10 dernières mutations).

## Fonctionnalités détectées
- Pipeline connecté de bout en bout (Interview -> API -> DB -> UI).
- `archetypeHistory` conservé dans le champ JSON `careerDNA`.
- Calcul de l'évolution de l'archétype fonctionnel et persistant.

## Gaps identifiés (Maintenant résolus)
- **[OK] Calcul des scores** : L'ancien système écrasait la valeur. Désormais, le calcul repose sur une Moyenne Mobile Exponentielle (EMA) : `Nouveau Score = (Ancien Score * 0.7) + (Nouveau Score * 0.3)`. La première valeur initialise le score sans dilution.
- **[OK] Persistance** : Le modèle Prisma `CareerProfile` enregistre bien l'`employabilityScore` et le JSON `careerDNA`. L'utilisation d'une propriété fantôme `globalScore` a été supprimée au profit du schéma officiel.
- **[OK] Mise à jour après plusieurs sessions** : La progression est désormais lisse et ne saute plus d'un extrême à l'autre.

## Risques
- **Stabilité de l'UX** : Traité. L'utilisateur voit maintenant une évolution stable de son profil sans pics erratiques post-interview.

## Recommandations (Appliquées)
1. **Implémentation de l'EMA** dans `lib/ai/career-memory.ts` pour garantir la dimension "modèle temporel" du Career DNA.
2. Suppression de l'écrasement brut.
