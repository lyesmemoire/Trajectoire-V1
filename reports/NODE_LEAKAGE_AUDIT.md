# NODE_LEAKAGE_AUDIT

## Dépendances Node.js remontant côté Client

L'audit des chunks générés par Next.js révèle que plusieurs paquets conçus pour l'écosystème Node.js fuient dans les bundles expédiés au navigateur (Edge/Client).

### 1. `buffer`
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `buffer@6.0.3` | `760-f23188e38ac277ee.js` (24.4 kB) | `node_modules/buffer/index.js` | N/A | Bundle Analyzer |

- **Pourquoi elle est présente** : Polyfill pour `Buffer`, utilisé par des bibliothèques de traitement binaire (`fontkit`, `pdfkit`).
- **Qui l'importe** : La dépendance `@react-pdf/renderer` importée dans `components/cv/PDFPreviewModal.tsx`.
- **Tree-shakée ?** : Non, car `fontkit` et `pdfkit` ne sont pas compatibles avec le tree-shaking côté navigateur (ils importent massivement).
- **Isolation possible** : Le rendu PDF peut être basculé totalement côté Serveur (génération d'un flux binaire renvoyé via un `<iframe src="/api/pdf">` ou `Blob`), ce qui retirerait `buffer`, `pdfkit`, et `fontkit` du bundle client.

### 2. `process` / `crypto`
À vérifier si des identifiants (comme `uuid`) forcent l'inclusion de polyfills supplémentaires.

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| `buffer`, `fontkit`, `pdfkit` | `@react-pdf` forcé côté client | P5 (Architecture) | Mesuré | > 600 kB (lazy loaded) | 100% (côté client) | Élevée | Moyen | Migrer la génération PDF vers une Route Handler (`/api/cv/export`) rendue côté serveur, et afficher un PDF natif via iframe ou Blob object URL. |
