# Rapport d'Analyse UX - Trajectoire

**Date** : 25 juin 2026  
**Scope** : Homepage → Register → Dashboard  
**Objectif** : Analyser l'expérience utilisateur et identifier les points d'amélioration

---

## 📊 Structure de la Homepage

### Ordre des sections
1. **Header** - Navigation fixe avec scroll-spy
2. **Hero** - CTA principal centré
3. **TrustBar** - 4 éléments de confiance (fusionné)
4. **ProblemGrid** - 4 problèmes ciblés
5. **WhyTrajectoire** - Comparaison classique vs Trajectoire
6. **Dashboard** - Preview avec graphiques (tabs verrouillés)
7. **Results** - Statistiques avant/après
8. **Testimonials** - 3 témoignages
9. **Method** - 4 étapes en tabs interactifs
10. **TimelineMethod** - Transparence du processus
11. **ScienceLegitimacy** - Rigueur scientifique
12. **Security** - Confidentialité
13. **Pricing** - 3 plans avec toggle
14. **FAQ** - Questions fréquentes
15. **CTA** - Appel à l'action final
16. **Footer**

---

## 🚀 Parcours Utilisateur

### Flow actuel
```
Homepage
  ↓ CTA "Démarrer gratuitement" / "Essai gratuit"
Page Register
  ↓ Formulaire (prénom, nom, email, mot de passe, conditions)
Dashboard
  ↓ Vue d'ensemble avec KPIs, graphiques, recommandations
```

### Points d'entrée CTA
- Hero : "Démarrer gratuitement" (variant accent)
- Header : "Essai gratuit" (variant primary)
- Method (étape 4) : "Voir les formules"
- Pricing : 3 CTAs par plan
- CTA final : "Démarrer mon évaluation"

---

## ⚠️ Points de Friction Identifiés

### 1. Homepage trop longue
**Problème** : 15 sections créent un scroll excessif (~10-12 écrans)
**Impact** : Fatigue utilisateur, taux de rebond élevé
**Mesure** : Scroll depth analytics

### 2. Dashboard preview frustrant
**Problème** : Section Dashboard avec 3 tabs sur 4 verrouillés (🔒)
**Impact** : Frustration, sentiment de "teasing" agressif
**Recommandation** : Soit déverrouiller, soit supprimer le preview

### 3. Method section en tabs
**Problème** : Les utilisateurs peuvent ne pas cliquer sur les 4 étapes
**Impact** : Information incomplète sur la méthode
**Recommandation** : Afficher en grille ou en accordion

### 4. RegisterWizard trop demandeur
**Problème** : Demande prénom + nom + email + mot de passe + conditions
**Impact** : Friction à l'inscription, abandon possible
**Recommandation** : Réduire à email + mot de passe, collecter le reste plus tard

### 5. Pas de preview de valeur
**Problème** : L'utilisateur ne voit pas ce qu'il va obtenir avant de s'inscrire
**Impact** : Incertitude, hésitation
**Recommandation** : Ajouter un "preview" interactif avant inscription

### 6. CTA multiples sans hiérarchie
**Problème** : 6+ CTAs sur la homepage sans priorité claire
**Impact** : Paralysie décisionnelle
**Recommandation** : Hiérarchiser avec 1 CTA principal, 2 secondaires

### 7. Pricing toggle peu clair
**Problème** : Toggle mensuel/annuel mais pas de visualisation claire de l'économie
**Impact** : Confusion sur le pricing
**Recommandation** : Afficher l'économie en plus clair (ex: "-20%")

### 8. Dashboard après inscription déroutant
**Problème** : Pas d'onboarding, l'utilisateur arrive sur un dashboard complexe
**Impact** : Perte de repère, abandon précoce
**Recommandation** : Ajouter un onboarding guidé

---

## ✅ Points Forts

### Design
- **Cohérence visuelle** : Palette de couleurs unifiée (brand-primary, brand-accent)
- **Typographie** : Hiérarchie claire avec display-1, heading-3, body
- **Spacing** : Standardisé (py-20) pour un rythme visuel constant
- **Animations** : Framer Motion pour transitions fluides
- **Responsive** : Mobile-first avec breakpoints lg

### Contenu
- **Storytelling** : Problème → Solution → Preuve → Pricing
- **Preuves sociales** : Statistiques, témoignages, logos
- **Transparence** : Méthodologie expliquée, données chiffrées
- **Garanties** : 30 jours satisfait ou remboursé, sans carte bancaire

### Technique
- **Performance** : Dynamic imports pour composants lourds
- **Accessibilité** : ARIA labels, keyboard navigation, focus management
- **Analytics** : Track events sur CTA clicks
- **SEO** : Metadata optimisée

---

## 🎯 Recommandations Prioritaires

### Priorité 1 - Réduire la friction d'inscription
1. **Simplifier RegisterWizard** : Email + mot de passe uniquement
2. **Ajouter onboarding** : Welcome tour du dashboard
3. **Preview de valeur** : Mini-évaluation avant inscription

### Priorité 2 - Optimiser la homepage
1. **Supprimer Dashboard preview** : Ou déverrouiller les tabs
2. **Réorganiser Method** : Afficher en grille au lieu de tabs
3. **Hiérarchiser les CTAs** : 1 principal (Hero), 2 secondaires (Header, Pricing)

### Priorité 3 - Améliorer le pricing
1. **Clarifier le toggle** : Afficher l'économie en pourcentage
2. **Simplifier les plans** : Réduire à 2 plans (Essentiel + Cadre)
3. **Ajouter un plan "Trial"** : 7 jours gratuit sans CB

### Priorité 4 - Onboarding Dashboard
1. **Welcome modal** : Expliquer les KPIs et les fonctionnalités
2. **Progressive disclosure** : Révéler les features au fur et à mesure
3. **First action** : Guider vers la première action (ex: "Commencer l'évaluation")

---

## 📈 Métriques à Suivre

### Conversion
- Homepage → Register : CTR des CTAs
- Register → Dashboard : Taux de complétion formulaire
- Dashboard → First action : Taux d'engagement

### Engagement
- Scroll depth homepage
- Time on page
- Bounce rate par section

### Qualité
- Satisfaction utilisateur (NPS)
- Support requests
- Churn rate

---

## 🔧 Implémentation Recommandée

### Phase 1 - Quick Wins (1-2 jours)
- Simplifier RegisterWizard
- Supprimer/Modifier Dashboard preview
- Hiérarchiser les CTAs

### Phase 2 - Medium (1 semaine)
- Réorganiser Method section
- Clarifier Pricing toggle
- Ajouter onboarding basique

### Phase 3 - Long term (2-3 semaines)
- Preview de valeur interactif
- Onboarding avancé
- A/B testing des CTAs

---

## 📝 Conclusion

Le site Trajectoire a une base solide avec un design cohérent et un contenu de qualité. Les principaux points d'amélioration se situent au niveau de la friction d'inscription et de la longueur de la homepage. En priorisant la simplification du parcours d'inscription et l'optimisation de la homepage, on devrait observer une amélioration significative du taux de conversion.

**Impact estimé** : +15-25% de conversion Homepage → Register  
**Effort estimé** : 2-3 semaines pour l'ensemble des recommandations
