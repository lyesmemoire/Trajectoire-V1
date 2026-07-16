# LUCIDE_AUDIT

## Audit des Icônes Lucide-React

Les icônes vectorielles sont légères individuellement, mais leur importation massive dans un Client Component détruit le bénéfice du tree-shaking (tout doit être expédié au navigateur pour le rendu initial).

### 1. Surcharge dans les composants Dashboard
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `lucide-react` | Plus de 50 icônes importées | `components/dashboard/planning-intelligence.tsx` | 5 | AST / Code source |
| `lucide-react` | 22 icônes importées | `components/dashboard/career-forecast.tsx` | 6 | AST / Code source |

- **Cause** : Les composants comme `planning-intelligence.tsx` importent un très grand nombre d'icônes `lucide-react` directement dans un fichier `"use client"`.
- **Conséquence** : Ces icônes sont toutes transpilées et embarquées dans le bundle client du chunk de la page, alourdissant le First Load JS.
- **Isolation possible** : Si ces immenses composants deviennent des Server Components (en isolant uniquement les animations), les icônes resteront rendues côté serveur, avec un coût JS de 0 kB sur le client.

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| `lucide-react` massive imports | Imports dans `"use client"` | P3 (Server Components) | Mesuré | ~15 kB (estimé cumulé) | ~15 kB | Moyenne | Faible | Rendre les composants englobants côté serveur pour que Lucide ne pèse plus que son SVG final au lieu du code React. |
