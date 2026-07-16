# RSC_CACHE_AUDIT

## Audit du Cache RSC (React Server Components)

L'audit révèle une sur-utilisation de la directive `force-dynamic`, désactivant complètement les bénéfices de la mise en cache statique ou incrémentale de Next.js pour le Dashboard.

### 1. Désactivation du Cache sur les Routes Principales
| Élément | Preuve | Fichier | Lignes | Source |
|---------|--------|---------|--------|--------|
| `export const dynamic = "force-dynamic"` | Directive présente au niveau de la Page | `app/(app)/dashboard/page.tsx`, `career-copilot/page.tsx`, `cvs/page.tsx` | N/A | Recherche AST/Texte |

- **Cause** : Les pages racines du Dashboard forcent le rendu dynamique complet à chaque requête.
- **Conséquence (Runtime CPU)** : Chaque visite sur le Dashboard déclenche un rendu serveur complet. Même les parties statiques (layout, header, composants non liés à l'utilisateur) ne sont pas cachées.
- **Action recommandée** : Retirer `force-dynamic` et utiliser la granularité de Next.js App Router. Les requêtes `fetch` qui nécessitent des données fraîches doivent être taggées `no-store` (ou utiliser les cookies/headers), laissant le reste de l'arbre bénéficier du cache RSC.

---

## Format des Recommandations

| Élément | Cause | Catégorie | Certitude | Impact actuel | Gain estimé | Difficulté | Risque | Action |
|---------|-------|-----------|-----------|--------------:|------------:|-----------:|-------:|--------|
| Pages du Dashboard | `force-dynamic` global | P4 (Cache) | Mesuré | Fort (Runtime CPU) | - | Faible | Moyen | Supprimer `force-dynamic` et laisser Next.js invalider le cache dynamiquement sur lecture de cookies/headers. |
