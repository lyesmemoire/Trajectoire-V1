# MVP-011 — Dashboard WOW

**Date :** 5 août 2026  
**Objectif :** Créer un dashboard premium qui affiche immédiatement la valeur au candidat

---

## Contexte

Le dashboard actuel est minimaliste et ne montre pas assez de valeur immédiate. Les candidats doivent comprendre instantanément leur progression et leurs opportunités.

**Problème résolu :** Le dashboard manquait de widgets visuels et d'informations clés pour engager l'utilisateur dès le premier écran.

---

## Objectif

Créer un dashboard premium avec :
- Bonjour personnalisé
- Score ATS avec évolution
- Compétences visualisées
- Progression carrière
- Recommandations IA
- Historique d'analyses
- Actions rapides
- Progression globale
- Insights analytics
- Timeline des événements

Le candidat doit immédiatement comprendre la valeur.

---

## Architecture

### Composants

**DashboardHero** (`apps/web/src/components/dashboard/DashboardHero.tsx`)
- Message de bienvenue personnalisé
- Greeting selon l'heure (Bonjour/Bon après-midi/Bonsoir)
- Nom de l'utilisateur
- Badge de progression

**DashboardScore** (`apps/web/src/components/dashboard/DashboardScore.tsx`)
- Score ATS actuel avec cercle animé
- Score précédent et évolution
- Barre de progression
- Couleur dynamique selon le score (vert/bronze/bleu/rouge)

**DashboardSkills** (`apps/web/src/components/dashboard/DashboardSkills.tsx`)
- Top 6 compétences
- Barres de progression animées
- Catégories (technical/soft/language)
- Tendance (up/down)

**DashboardCareer** (`apps/web/src/components/dashboard/DashboardCareer.tsx`)
- Niveau actuel et suivant
- Progression vers le niveau suivant
- Score d'employabilité
- Tendance d'évolution

**DashboardRecommendations** (`apps/web/src/components/dashboard/DashboardRecommendations.tsx`)
- Top 4 recommandations IA
- Type d'action (improve/add/remove/highlight)
- Priorité (high/medium/low)
- Impact estimé

**DashboardHistory** (`apps/web/src/components/dashboard/DashboardHistory.tsx`)
- Top 3 analyses récentes
- Score ATS par analyse
- Date relative (Aujourd'hui/Hier/Il y a X jours)
- Poste cible

**DashboardActions** (`apps/web/src/components/dashboard/DashboardActions.tsx`)
- 4 actions rapides en grille
- Analyser CV, Matching, Copilot, Entretien
- Icônes et couleurs distinctes
- Liens vers les fonctionnalités

**DashboardProgress** (`apps/web/src/components/dashboard/DashboardProgress.tsx`)
- Progression globale en pourcentage
- Étapes complétées avec checkmarks
- Étapes verrouillées
- Barre de progression gradient

**DashboardInsights** (`apps/web/src/components/dashboard/DashboardInsights.tsx`)
- 4 insights analytics
- Types (strength/weakness/opportunity/achievement)
- Valeurs et unités
- Couleurs par type

**DashboardTimeline** (`apps/web/src/components/dashboard/DashboardTimeline.tsx`)
- Timeline des événements
- Types (analysis/interview/matching/milestone)
- Statuts (completed/in-progress/upcoming)
- Dates relatives

**DashboardWidgets** (`apps/web/src/components/dashboard/DashboardWidgets.tsx`)
- Composant principal orchestrant tous les widgets
- Layout responsive (grid 1-2-3 colonnes)
- Orchestration des animations

---

## Intégration

### Dans /dashboard

**Fichier :** `apps/web/src/app/dashboard/page.tsx`

**Modifications :**
- Import de `DashboardWidgets` et types
- Récupération des données (analyses, careerProfile, interviewSessions)
- Transformation des données en types dashboard
- Passage des props à `DashboardWidgets`

```tsx
const userData: DashboardUserData = {
  name: dbUser.name || user.email?.split("@")[0],
  firstName: dbUser.name?.split(" ")[0] || user.email?.split("@")[0],
  avatar: user.user_metadata?.avatar_url,
}

const score: DashboardScore = {
  currentScore: lastAnalysis?.atsScoreAfter || 0,
  previousScore: previousAnalysis?.atsScoreAfter ?? undefined,
  progressPercentage: lastAnalysis ? Math.min(100, lastAnalysis.atsScoreAfter) : 0,
  trend: /* calculé */,
}

// ... autres transformations

return <DashboardWidgets {...props} />
```

---

## Design

### Principes

- **Premium** : Design haut de gamme avec ombres et blur
- **Clarté** : Informations hiérarchisées et lisibles
- **Animation** : Transitions fluides avec Framer Motion
- **Responsive** : Grid adaptative (mobile/tablet/desktop)
- **Couleurs** : Palette cohérente (bronze, forest, sky, brick, ink)

### Couleurs

- **Bronze** : Actions principales, progression
- **Forest** : Succès, croissance, confiance
- **Sky** : Informations, opportunités
- **Brick** : Alertes, faiblesses
- **Ink** : Texte principal, éléments neutres

### Animations

- Delays échelonnés (0.1s à 1.5s)
- Entrée progressive (opacity + translate)
- Spring animations pour les scores
- Hover states sur les cartes

---

## Layout

### Mobile (< 768px)
- 1 colonne
- Widgets empilés verticalement
- Actions en grille 2x2

### Tablet (768px - 1024px)
- 2 colonnes
- Certains widgets full width
- Actions en grille 2x2

### Desktop (> 1024px)
- 3 colonnes
- Distribution équilibrée
- Actions en grille 2x2

---

## Données

### Sources

- **CVAnalysis** : Scores, compétences, améliorations
- **CareerProfile** : Score employabilité
- **InterviewSession** : Entretiens simulés
- **User** : Nom, email, avatar

### Transformation

Les données brutes de Prisma sont transformées en types dashboard :
- `cvData.skills` → `DashboardSkill[]`
- `cvData.improvements` → `DashboardRecommendation[]`
- `atsScoreAfter` → `DashboardScore`

---

## Améliorations futures

1. **Personnalisation** : Adapter les insights selon le profil
2. **Real-time** : Mises à jour en temps réel
3. **Export** : Exporter le dashboard en PDF
4. **Comparaison** : Comparer avec d'autres profils
5. **Goals** : Définir et suivre des objectifs
6. **Notifications** : Alertes et rappels
7. **Dark mode** : Thème sombre

---

## Limitations

1. **Données mockées** : Certains widgets utilisent des données par défaut
2. **Pas de real-time** : Les données sont chargées au render
3. **Pas de personnalisation** : Layout fixe pour tous les utilisateurs
4. **Pas d'export** : Impossible d'exporter le dashboard

---

## Déploiement

### Variables d'environnement

Aucune nouvelle variable requise.

### Vérification

1. Vérifier que le dashboard s'affiche avec les widgets
2. Vérifier la responsive design (mobile/tablet/desktop)
3. Vérifier les animations Framer Motion
4. Vérifier que les données sont correctement transformées
5. Vérifier que les liens des actions fonctionnent

---

## Conclusion

Le dashboard premium est maintenant opérationnel. Les utilisateurs voient immédiatement leur valeur avec des widgets visuels, des animations fluides et une hiérarchie claire des informations.

**Prochaines étapes :**
1. Monitoring de l'engagement dashboard
2. Personnalisation dynamique
3. Real-time updates
4. Export PDF
