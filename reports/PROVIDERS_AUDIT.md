# PROVIDERS_AUDIT

## Audit des Providers React

Les contextes globaux React (Providers) s'ils sont placés trop haut dans l'arbre obligent souvent leurs enfants à basculer côté client ou incluent des dépendances de façon globale.

### 1. `PostHogProviderWrapper`
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `posthog-js` | Inclus dans le Shared JS global | `app/layout.tsx` | 53 | Bundle Analyzer |

- **Impact actuel** : ~194 kB non gzipés propagés à *toutes* les routes (marketing, auth, dashboard).
- **Peut-il descendre ?** : Oui. Il pourrait n'être inclus que sur les layouts qui nécessitent le suivi ou, mieux, injecté dynamiquement sans importer statiquement `PostHogProvider`.

### 2. `Toaster` (Sonner)
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `sonner` | Composant client global | `app/(app)/layout.tsx` | 9 | Bundle Analyzer |

- **Impact actuel** : ~33 kB. 
- **Peut-il descendre ?** : La racine de l'app est logique pour un Toaster, mais il pourrait être lazy-loadé uniquement lorsqu'un toast est émis via un pattern d'Event Emitter global, ou limité aux routes Dashboard/Auth.

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| `PostHogProvider` | Provider racine avec import statique | P1 (Déplacement) / P2 | Mesuré | 194 kB (global) | ~60 kB (gzip) | Faible | Faible | Remplacer l'import de PostHogProvider par une balise script ou un dynamic import total. |
