# HOOKS_AUDIT

## Audit des Hooks React

L'analyse révèle que l'impact des hooks sur le bundle ne provient pas de directives `"use client"` à l'intérieur des hooks eux-mêmes (un hook nécessitant de toute façon d'être exécuté dans un composant client), mais de leur utilisation dans des composants de haut niveau.

### 1. Hooks d'Intelligence & UI
- Les composants volumineux comme `career-forecast.tsx` et `planning-intelligence.tsx` (voir `SERVER_COMPONENTS_AUDIT.md`) deviennent des Client Components car ils exploitent des animations (`framer-motion`), ce qui les empêche d'être rendus par le serveur.

### 2. FingerprintJS Hook
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `useUXFingerprint.ts` | 34.3 kB (Chunk 5684) | `hooks/useUXFingerprint.ts` | 1 | Bundle Analyzer |

- **Cause** : Le hook importe `@fingerprintjs/fingerprintjs` (34 kB). 
- **Impact** : Tout composant qui appelle ce hook intégrera `fingerprintjs` dans son bundle client.
- **Isolation possible** : Oui, s'assurer que ce hook n'est appelé que ponctuellement et idéalement lazy-loadé ou injecté dynamiquement.

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| `useUXFingerprint` | `@fingerprintjs/fingerprintjs` pèse lourd | P2 (Lazy Loading) | Mesuré | 34.3 kB | ~34 kB | Faible | Faible | Lazy-loader la fonction `fpPromise` avec un import dynamique à l'intérieur du `useEffect`. |
