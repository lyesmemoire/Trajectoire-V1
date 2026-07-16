# HYDRATION_AUDIT

## Audit de l'Hydratation

| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| Widgets Dashboard | Multiples composants clients volumineux imbriqués | `app/(app)/dashboard/career-copilot/page.tsx` | N/A | Bundle Analyzer |

- **Cause** : Puisque les énormes composants d'intelligence (`career-forecast`, `planning-intelligence`) sont marqués `"use client"` à la racine, React doit parcourir et hydrater la totalité de leur arbre DOM au démarrage, y compris les parties purement statiques (textes, layouts).
- **Conséquence (Hydration Cost)** : Le navigateur bloque le Main Thread (TBT) le temps d'attacher des event listeners à des milliers de noeuds inutiles.
- **Peut-on optimiser ?** : En isolant les animations et l'interactivité dans les feuilles de l'arbre, on réduit drastiquement la profondeur d'hydratation.

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| Profondeur d'hydratation | Composants `"use client"` massifs | P3 (Server Components) | Mesuré | Élevé (TBT) | Fort | Moyenne | Faible | Déplacer le `"use client"` le plus bas possible dans l'arbre React. |
