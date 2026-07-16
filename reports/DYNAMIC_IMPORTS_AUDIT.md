# DYNAMIC_IMPORTS_AUDIT

## Audit des `next/dynamic` et des imports dynamiques

Le Dashboard utilise 15 fois `next/dynamic` ou des imports dynamiques classiques `import()`. Si certains sont correctement implémentés (comme les charts Recharts), d'autres fuient et annulent les gains espérés.

### 1. Fausse isolation de PostHog
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `posthog-js/react` | Static import annule le `import()` dynamique | `providers/posthog-provider.tsx` | 3 | AST & Bundle Analyzer |

- **Cause** : Le composant `PostHogProviderWrapper` tente d'isoler `posthog-js` via un `import("posthog-js")` dynamique. Cependant, à la ligne 3, un import statique `import { PostHogProvider } from "posthog-js/react";` est effectué. Ceci inclut la librairie dans le First Load JS (194 kB non gzippé).
- **Conséquence** : `posthog-js` remonte dans le Shared JS global au lieu d'être lazy-loadé.

### 2. Isolation de Framer Motion
- L'import de `framer-motion` via `LazyMotion` dans `motion-provider.tsx` est correctement exécuté, chargeant le sous-ensemble `domAnimation` dynamiquement. Ce pattern est valide, mais attention car les composants d'intelligence Dashboard importent tous `m` depuis `framer-motion` statiquement au lieu d'utiliser un export proxy ou uniquement si nécessaire. 
*(Note: `import { m } from "framer-motion"` est un composant statique léger, l'implémentation lourde est passée par LazyMotion).*

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| `posthog-js` | Import statique de `PostHogProvider` annule le lazy-loading | P2 (Lazy Loading) | Mesuré | 194 kB (Shared) | ~60 kB (gzip) | Faible | Faible | Remplacer l'import statique par un `next/dynamic` ou injecter manuellement le script PostHog. |
