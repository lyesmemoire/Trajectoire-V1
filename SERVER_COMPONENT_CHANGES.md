# SERVER_COMPONENT_CHANGES.md (Phase 5.1)

Conformément à l'analyse des risques liés aux composants du Design System (présence de `forwardRef`, `Slot`, `Portal`, `Radix UI`), cette phase est scindée en deux étapes (PRs) distinctes.

## PR 1 : Composants à faible risque (Convertis)

Les composants suivants ont été convertis en Server Components (directive `"use client"` supprimée). Ils ont été inspectés manuellement pour confirmer l'absence totale de logique client, de hooks (`useState`, `usePathname`), de providers ou d'animations tierces complexes.

### Pages statiques
* `app/not-found.tsx`
* `app/privacy/page.tsx`
* `app/terms/page.tsx`

### Layouts structurels
* `components/layouts/foundation/marketing-layout.tsx`
* `components/layouts/foundation/page-content.tsx`
* `components/layouts/foundation/page-footer.tsx`
* `components/layouts/foundation/auth-layout.tsx`
* `components/auth/AuthArenaLayout.tsx`

### Skeletons & Composants purs
* `components/dashboard/dashboard-skeleton.tsx`
* `components/admin/ai/ai-cost-overview.tsx`
* `components/dashboard/career-score-card.tsx`

---

## PR 2 : Analyse Ciblée (Design System & Composants complexes) - À FAIRE

Tous les autres composants, notamment ceux du `components/design-system`, ont été **laissés en Client Components** dans l'immédiat pour éviter tout risque de régression transversale sur l'application. 

La future PR 2 inclura une vérification individuelle stricte de chaque composant du Design System selon la checklist suivante :
- `forwardRef` (Risque d'erreur de passage de ref depuis le serveur)
- `cloneElement`
- `Slot` (Radix UI)
- `Portal` / `createPortal`
- Primitives Radix UI nécessitant un Context implicite
- Utilisation de `useImperativeHandle`

### Exemples de composants nécessitant cette revue manuelle (actuellement gardés côté client) :
- `components/design-system/card.tsx`
- `components/design-system/input.tsx`
- `components/design-system/textarea.tsx`
- `components/design-system/avatar.tsx`
- `components/design-system/badge.tsx`
- `components/design-system/table.tsx`
- ...

---

## Estimation du gain JS (PR 1)

Bien que nous ayons conservé le Design System côté client, la PR 1 permet déjà d'alléger le First Load JS en :
1. Déplaçant l'exécution des Layouts majeurs (Auth, Marketing) sur le serveur.
2. Éliminant le code des pages statiques (CGU, Privacy) des chunks téléchargés.
3. Rendant les Skeletons natifs au serveur, améliorant potentiellement le Time To First Byte (TTFB) visuel.

Le gain estimé pour cette PR 1 est d'environ **5 à 10 KB**, mais garantit **un risque de régression proche de 0 %**. La validation hydratation/navigation reste fluide.
