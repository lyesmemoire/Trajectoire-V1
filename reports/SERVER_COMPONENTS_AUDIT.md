# SERVER_COMPONENTS_AUDIT

## Analyse des "use client" sur le Dashboard

Le Dashboard compte 324 directives `"use client"`. L'audit des plus gros contributeurs au Bundle Client révèle que la majorité sont des composants UI passifs transformés en Client Components uniquement à cause des animations Framer Motion ou de l'inclusion massive d'icônes Lucide.

### 1. `components/dashboard/career-forecast.tsx`
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `career-forecast.tsx` | 41.8 kB dans Bundle Analyzer | `components/dashboard/career-forecast.tsx` | 1-6 | Bundle Analyzer & AST |

- **Cause du mode client** : Import de `m` (`framer-motion`). 
- **Isolation possible** : Oui, via l'extraction des wrappers animés dans un composant `<AnimatedCard>` ou similaire, ce qui permettrait au reste du composant (énorme, 1141 lignes) d'être rendu côté serveur.
- **Coût estimé sur le bundle** : ~40 kB (dont une grosse partie due aux icônes Lucide embarquées côté client).

### 2. `components/dashboard/planning-intelligence.tsx`
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `planning-intelligence.tsx` | 33.7 kB dans Bundle Analyzer | `components/dashboard/planning-intelligence.tsx` | 1-6 | Bundle Analyzer & AST |

- **Cause du mode client** : Import de `m` (`framer-motion`) et potentiellement `useState`.
- **Isolation possible** : Oui. Les icônes Lucide (plus de 50 icônes importées !) pèsent lourd dans le bundle client. Passer ce composant en Server Component permettrait de ne pas expédier ces icônes et le markup statique au client.
- **Coût estimé sur le bundle** : ~30 kB.

### 3. Autres composants d'Intelligence (Progression, Narrative, Reflection, Execution...)
Tous ces composants (`progression-plan.tsx`, `career-narrative-intelligence.tsx`, `reflection-intelligence.tsx`, `execution-intelligence.tsx`, etc.) pèsent entre 17 et 27 kB.
- **Cause du mode client** : Tous utilisent `framer-motion` et sont marqués `"use client"`.
- **Isolation possible** : Oui.
- **Coût estimé sur le bundle** : Totalisant plus de 150 kB de JavaScript client évitable.

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| `career-forecast.tsx` | `framer-motion` (m) force le client | P3 (Server Components) | Mesuré | 41.8 kB | ~35 kB | Moyenne | Faible | Isoler l'animation dans un wrapper client, passer le reste en SC. |
| `planning-intelligence.tsx` | `framer-motion` (m) force le client | P3 (Server Components) | Mesuré | 33.7 kB | ~30 kB | Moyenne | Faible | Isoler l'animation dans un wrapper client, passer le reste en SC. |
| Autres widgets d'Intelligence | `framer-motion` (m) force le client | P3 (Server Components) | Mesuré | >150 kB | ~120 kB | Moyenne | Faible | Rendre SC par défaut et wrapper les animations. |
