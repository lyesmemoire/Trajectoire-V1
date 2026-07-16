# PERFORMANCE_PHASE4_ANALYSIS.md (Phase 4.10)

## Plan d'optimisation

| Optimisation | Gain estimé | Difficulté | Priorité |
|--------------|-------------|------------|----------|
| Lazy load de `framer-motion` | 30-50 KB | Moyenne | Haute |
| Remplacer `lucide-react` par `lucide-react/icons/...` ou activer `optimizePackageImports` | 20-30 KB | Faible | Haute |
| Lazy load de `recharts` sur le dashboard | 100 KB+ | Moyenne | Très Haute |
| Dynamic import pour `posthog-js` | 20 KB | Faible | Moyenne |
| Séparer les stores Zustand lourds | 10-15 KB | Moyenne | Moyenne |
