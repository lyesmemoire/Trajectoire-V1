# FRAMER_AUDIT

## Audit de Framer Motion

Framer Motion est une des librairies UI les plus lourdes si mal utilisée. Trajectoire l'implémente correctement via `LazyMotion` dans le layout global, mais les imports enfants viennent corrompre cette stratégie.

### 1. `LazyMotion` dans `MotionProvider`
- L'implémentation dans `components/providers/motion-provider.tsx` (ligne 7) est excellente : `<LazyMotion features={domAnimation}>`.
- Cela restreint le core package à environ **23 kB** au lieu des ~100 kB d'une implémentation pleine.

### 2. Le problème de contamination `"use client"`
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `import { m } from "framer-motion"` | Les composants Dashboard deviennent 100% Client | `components/dashboard/*.tsx` | Top-level | AST |

- **Cause** : Tous les widgets d'intelligence importent le tag `m` pour faire `<m.div>`.
- **Conséquence** : Cela force l'entièreté de ces énormes widgets (souvent 1000+ lignes) à être marqués `"use client"`. Le poids de Framer Motion lui-même est minimal (quelques kilo-octets pour l'export `m`), mais le *coût indirect* est colossal : toutes les balises HTML, icônes Lucide, et fonctions annexes basculent dans le bundle Client.

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| `framer-motion` (m) | `import { m }` contamine les Server Components | P5 (Architecture) | Mesuré | ~150 kB (indirect) | ~120 kB | Moyenne | Faible | Créer un wrapper `<AnimatedWidget>` (qui seul contiendra `"use client"` et `<m.div>`) et passer le reste de l'UI en `children` Server Component. |
