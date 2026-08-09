# MVP-009 — Conversion Funnel

**Date :** 5 août 2026  
**Objectif :** Transformer les visiteurs en utilisateurs après l'analyse ATS

---

## Contexte

Le moteur RH est terminé et l'expérience ATS est premium (MVP-008). Le prochain chantier consiste à maximiser le taux de conversion des visiteurs en utilisateurs.

**Problème résolu :** Auparavant, les visiteurs pouvaient analyser leur CV gratuitement mais il n'y avait pas de stratégie de conversion active. Le parcours s'arrêtait après l'analyse.

---

## Objectif

Après l'analyse ATS :
- Ne jamais terminer le parcours
- Afficher un écran de conversion optimisé
- Maximiser le taux de conversion

**Le taux de conversion est la priorité absolue.**

---

## Architecture

### Composants

**BenefitsList** (`apps/web/src/components/conversion/BenefitsList.tsx`)
- Liste des avantages de la création de compte
- Icônes et descriptions animées
- Avantages par défaut : sauvegarder rapport, matching, Copilot RH, entretiens IA, progression

**CTASection** (`apps/web/src/components/conversion/CTASection.tsx`)
- Boutons d'authentification (Google, Github, Email)
- Divider visuel
- Lien vers conditions d'utilisation
- Redirections configurables

**TrustSection** (`apps/web/src/components/conversion/TrustSection.tsx`)
- Statistiques de confiance (utilisateurs, note moyenne)
- Badges (RGPD, gratuit)
- Design en grille responsive

**SecuritySection** (`apps/web/src/components/conversion/SecuritySection.tsx`)
- Éléments de sécurité (chiffrement, RGPD, confidentialité, hébergement)
- Design rassurant avec icônes
- Couleurs vertes pour la confiance

**ProgressSection** (`apps/web/src/components/conversion/ProgressSection.tsx`)
- Progression du parcours utilisateur
- Étapes : Analyse → Création compte → Sauvegarde → Matching
- Indicateurs visuels (completed, current, pending)

**FAQSection** (`apps/web/src/components/conversion/FAQSection.tsx`)
- Questions fréquentes en accordéon
- Questions par défaut : gratuité, sécurité, suppression, fonctionnalités
- Animation d'ouverture/fermeture

**ConversionPanel** (`apps/web/src/components/conversion/ConversionPanel.tsx`)
- Panneau modal principal
- Intègre toutes les sections
- Header avec score ATS
- Bouton de fermeture
- Animations Framer Motion

### Pages

**Signup Conversion** (`apps/web/src/app/signup-conversion/page.tsx`)
- Page de signup optimisée pour la conversion
- Google Sign In via Supabase OAuth
- Github Sign In via Supabase OAuth
- Email signup avec validation
- Auto-claim de la preview après signup
- Redirection vers dashboard

---

## Flow Utilisateur

### Scénario complet

```
1. Visiteur arrive sur /analyze
   ↓
2. Upload CV + description poste
   ↓
3. Clic "Analyser"
   ↓
4. Analyse ATS générée
   ↓
5. ATSReport affiché (interface premium)
   ↓
6. ConversionPanel s'affiche automatiquement
   ↓
7. Visiteur voit les avantages
   ↓
8. Visiteur choisit une méthode d'authentification
   ↓
9. Redirection vers /signup-conversion
   ↓
10. Inscription (Google/Github/Email)
   ↓
11. Auto-claim de la preview
   ↓
12. Redirection vers /dashboard
   ↓
13. Rapport ATS déjà disponible dans l'historique
```

---

## Intégration

### Dans /analyze

**Fichier :** `apps/web/src/app/analyze/page.tsx`

**Modifications :**
- Import de `ConversionPanel`
- State `showConversion`
- Affichage du panel après l'analyse
- Bouton de fermeture pour continuer sans compte

```tsx
const [showConversion, setShowConversion] = useState(false)

// Après l'analyse
await savePreview(payload)
setShowConversion(true)

// Render
{showConversion && preview && (
  <ConversionPanel
    atsScore={preview.score}
    onContinue={() => setShowConversion(false)}
  />
)}
```

---

## Authentification

### Google Sign In

Intégré via Supabase OAuth :
- Redirection vers Google
- Callback vers `/dashboard`
- Auto-claim de la preview

### Github Sign In

Intégré via Supabase OAuth :
- Redirection vers Github
- Callback vers `/dashboard`
- Auto-claim de la preview

### Email Signup

Formulaire classique :
- Validation des champs
- Confirmation email
- Auto-claim de la preview
- Redirection vers dashboard

---

## Auto-Claim Preview

Après signup (email ou OAuth), le système :
1. Vérifie si un token preview existe dans sessionStorage
2. Appelle `/api/public/preview/claim`
3. Transfère la preview vers le compte utilisateur
4. Supprime le token du sessionStorage
5. L'analyse est disponible dans le dashboard

---

## Design

### Principes

- **Conversion优先ité** : Le taux de conversion est la métrique principale
- **Confiance** : Éléments de sécurité et de confiance visibles
- **Clarté** : Avantages clairement énoncés
- **Friction minimale** : Processus d'inscription rapide
- **Persuasion** : CTA forts et visibles

### Couleurs

- Vert (forest) : Sécurité, confiance
- Bronze : Progression, actions
- Blanc : Fond principal
- Ivoire : Éléments secondaires

### Animations

- Framer Motion pour toutes les transitions
- Delays échelonnés pour effet de cascade
- Hover states sur les boutons
- Accordéon pour FAQ

---

## Métriques à suivre

### KPIs principaux

- Taux de conversion (visiteurs → utilisateurs)
- Taux de clic sur CTA
- Taux de completion signup
- Temps de conversion
- Source de conversion (Google/Github/Email)
- Taux de claim de preview

### A/B Testing

- Variantes de copywriting
- Variantes de design du panel
- Variantes de CTA
- Variantes d'ordre des avantages

---

## Améliorations futures

1. **Personnalisation** : Adapter le message selon le score ATS
2. **Urgence** : Ajouter des éléments d'urgence (ex: "Offre limitée")
3. **Social Proof** : Ajouter des témoignages réels
4. **Gamification** : Points pour la création de compte
5. **Email de suivi** : Email de rappel si non converti
6. **Retargeting** : Publicité pour les visiteurs non convertis
7. **Analytics avancés** : Heatmap du panel de conversion

---

## Limitations

1. **Modal unique** : Pas de variantes de design pour l'instant
2. **Copy statique** : Pas de personnalisation dynamique
3. **Pas de A/B testing** : Variante unique pour l'instant
4. **Pas de tracking avancé** : Analytics basiques uniquement

---

## Déploiement

### Variables d'environnement

Aucune nouvelle variable requise. Utilise les variables existantes :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Vérification

1. Tester l'affichage du panel après analyse
2. Tester Google Sign In
3. Tester Github Sign In
4. Tester Email signup
5. Vérifier l'auto-claim de la preview
6. Vérifier la redirection vers dashboard
7. Vérifier que l'analyse est disponible dans l'historique

---

## Conclusion

Le funnel de conversion est maintenant opérationnel. Les visiteurs sont activement encouragés à créer un compte après l'analyse ATS, avec un parcours optimisé pour maximiser le taux de conversion.

**Prochaines étapes :**
1. Monitoring des métriques de conversion
2. A/B testing des variantes
3. Personnalisation dynamique
4. Analytics avancés
