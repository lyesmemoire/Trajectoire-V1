# UNUSED_DEPENDENCIES

## Audit des Dépendances NPM

L'analyse de l'arbre et du Bundle Analyzer révèle les points de fuite :

| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `@react-pdf/renderer` | Transitivement charge pdfkit, fontkit, brotli, yoga-layout | `components/cv/PDFPreviewModal.tsx` | N/A | Bundle Analyzer & pnpm why |
| `@fingerprintjs/fingerprintjs` | Importé dans un composant client (34 kB) | `hooks/useUXFingerprint.ts` | 1 | AST |

- **Cause** : Des librairies de rendu lourd (`@react-pdf`) sont empaquetées par Next.js car un composant Client les importe.
- **Action** : Les déplacer purement côté serveur (API routes ou SC isolés).

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| `@react-pdf/renderer` | Client import | P1 (Déplacement) | Mesuré | ~600 kB | 100% | Élevée | Moyen | Déplacer le rendu PDF sur une API côté serveur. |
