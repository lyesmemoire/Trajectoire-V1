# MVP-010 — Adaptive Onboarding

**Date :** 5 août 2026  
**Objectif :** Remplacer l'onboarding fixe par un onboarding intelligent qui s'adapte à l'état utilisateur

---

## Contexte

L'onboarding actuel est fixe : tous les utilisateurs suivent le même parcours de 5 étapes, indépendamment de leur état.

**Problème résolu :** Les utilisateurs qui ont déjà une analyse ATS (via MVP-007 et MVP-009) doivent refaire les étapes d'upload CV et job, ce qui est inutile et frustrant.

---

## Objectif

Créer un onboarding intelligent qui s'adapte automatiquement :

- **Si aucun CV** → Onboarding complet (Welcome → Upload CV → Upload Job → Matching → Copilot → Interview)
- **Si analyse ATS existante** → Parcours ATS-first (Welcome → Votre analyse → Matching → Copilot → Interview)

Le parcours doit s'adapter automatiquement sans casser l'onboarding existant.

---

## Architecture

### Services

**UserStateResolver** (`apps/web/src/lib/onboarding/UserStateResolver.ts`)
- Résout l'état d'onboarding d'un utilisateur
- Vérifie si l'utilisateur a un CV, une analyse ATS, un job, etc.
- Détermine le type de parcours (full, ats-first, minimal)
- Met à jour l'état utilisateur
- Marque les étapes comme complétées

**JourneyResolver** (`apps/web/src/lib/onboarding/JourneyResolver.ts`)
- Définit les configurations de parcours (full, ats-first, minimal)
- Résout le parcours en fonction du type
- Filtre les étapes par dépendances
- Obtient l'étape suivante/précédente
- Vérifie si une étape peut être sautée

**OnboardingResolver** (`apps/web/src/lib/onboarding/OnboardingResolver.ts`)
- Résolveur principal qui coordonne UserStateResolver et JourneyResolver
- Résout l'onboarding complet pour un utilisateur
- Avance à l'étape suivante
- Saute l'étape courante
- Revient à l'étape précédente
- Redémarre l'onboarding
- Obtient le résumé de l'onboarding

**ProgressEngine** (`apps/web/src/lib/onboarding/ProgressEngine.ts`)
- Calcule l'état de progression
- Estime le temps restant
- Obtient le pourcentage de progression par étape
- Vérifie si l'onboarding est complet
- Obtient les étapes bloquantes et optionnelles
- Formate le temps restant en texte lisible

**FlowEngine** (`apps/web/src/lib/onboarding/FlowEngine.ts`)
- Initialise le flow d'onboarding
- Exécute les actions de flow (next, back, skip, restart)
- Obtient le contexte du flow pour l'étape courante
- Valide si une action est possible

### Types

**OnboardingStep**
- id, title, description, order
- requiredSteps, optional, skippable

**JourneyType**
- full, ats-first, minimal

**UserOnboardingState**
- userId, onboardingCompleted
- hasCV, hasATSAnalysis, hasJob, hasInitialMatching
- hasDiscoveredCopilot, hasDoneInterview
- completedSteps, currentStep, journeyType
- startedAt, completedAt

**JourneyResolution**
- journeyType, steps, startingStep, reason

**ProgressState**
- currentStep, completedSteps, remainingSteps
- progressPercentage, estimatedTimeRemaining

**FlowConfig**
- adaptiveEnabled, allowSkip, allowBack, showProgress
- estimatedTimePerStep

---

## Parcours

### Full Journey (nouvel utilisateur)

1. **Welcome** - Bienvenue et nom
2. **Upload CV** - Importer le CV
3. **Upload Job** - Importer une fiche de poste (optionnel)
4. **Matching** - Premier matching
5. **Copilot** - Découverte du Copilot RH
6. **Interview** - Entretien IA

### ATS-First Journey (utilisateur avec analyse ATS)

1. **Welcome** - "Votre analyse est prête"
2. **ATS Analysis** - Consulter le rapport ATS
3. **Matching** - Lancer un matching
4. **Copilot** - Discuter avec le Copilot
5. **Interview** - Préparer les entretiens

### Minimal Journey (utilisateur expérimenté)

1. **Welcome** - Bienvenue
2. **Copilot** - Découverte du Copilot

---

## Intégration

### Dans /onboarding

**Fichier :** `apps/web/src/app/onboarding/page.tsx`

**Modifications :**
- Import de `OnboardingResolver`, `FlowEngine`, `OnboardingStep`
- Initialisation asynchrone de l'onboarding adaptatif
- Détection automatique du type de parcours
- Affichage dynamique des étapes selon le parcours
- Navigation via `FlowEngine.executeFlowAction`
- Progression calculée dynamiquement
- Skip/Back selon configuration

```tsx
// Initialisation
const flowContext = await FlowEngine.initializeFlow(user.id)
setJourneyType(flowContext.journey)

// Navigation
const result = await FlowEngine.executeFlowAction(user.id, 'next')
setCurrentStep(result.currentStep)

// Rendu conditionnel selon journeyType
{journeyType === 'ats-first' ? 'Votre analyse est prête' : 'Bienvenue'}
```

---

## Détection Automatique

### UserStateResolver

Le service détecte automatiquement l'état utilisateur :

- **hasCV** : Vérifie si l'utilisateur a des CVAnalysis
- **hasATSAnalysis** : Vérifie si le CV a un score ATS
- **hasJob** : Vérifie si l'utilisateur a un CareerProfile
- **hasInitialMatching** : Vérifie via UserBehaviorProfile
- **hasDoneInterview** : Vérifie via InterviewSession

### Détermination du parcours

```typescript
if (hasATSAnalysis) {
  return 'ats-first'
}
if (hasCV) {
  return 'full'
}
return 'full'
```

---

## Stockage de l'État

### UserBehaviorProfile

L'état d'onboarding est stocké dans `UserBehaviorProfile` :

- `onboardingCompleted` : Boolean
- `onboardingSteps` : String[] (étapes complétées)
- `currentOnboardingStep` : String (étape courante)

### User

Le flag `onboardingCompleted` est également stocké dans `User` pour compatibilité.

---

## Flow Utilisateur

### Scénario 1 : Nouvel utilisateur (sans CV)

```
1. Signup via ConversionPanel
2. Redirection vers /onboarding
3. UserStateResolver détecte : hasCV = false
4. JourneyType = 'full'
5. Parcours complet : Welcome → Upload CV → Upload Job → Matching → Copilot → Interview
6. Onboarding terminé → Dashboard
```

### Scénario 2 : Utilisateur avec analyse ATS

```
1. Signup via ConversionPanel après analyse
2. Auto-claim de la preview
3. Redirection vers /onboarding
4. UserStateResolver détecte : hasCV = true, hasATSAnalysis = true
5. JourneyType = 'ats-first'
6. Parcours optimisé : Welcome → ATS Analysis → Matching → Copilot → Interview
7. Onboarding terminé → Dashboard (rapport déjà disponible)
```

---

## Configuration

### FlowConfig par défaut

```typescript
{
  adaptiveEnabled: true,
  allowSkip: true,
  allowBack: true,
  showProgress: true,
  estimatedTimePerStep: {
    welcome: 1,
    'upload-cv': 2,
    'upload-job': 2,
    matching: 3,
    copilot: 2,
    interview: 5,
    'ats-analysis': 2,
  }
}
```

---

## Améliorations futures

1. **Personnalisation avancée** : Adapter le message selon le score ATS
2. **A/B testing** : Tester différentes variantes de parcours
3. **Analytics** : Tracking des taux de completion par parcours
4. **Gamification** : Points pour completion d'étapes
5. **Recommandations** : Étapes suggérées basées sur le profil
6. **Skip intelligent** : Suggestion de skip basée sur le comportement

---

## Limitations

1. **Détection basique** : Détection basée sur la présence de données, pas sur la qualité
2. **Pas de personnalisation dynamique** : Message fixe par type de parcours
3. **Pas de tracking avancé** : Analytics basiques uniquement
4. **État stocké dans UserBehaviorProfile** : Utilisation de `as any` pour les champs personnalisés

---

## Déploiement

### Variables d'environnement

Aucune nouvelle variable requise.

### Vérification

1. Tester l'onboarding avec un nouvel utilisateur (parcours full)
2. Tester l'onboarding avec un utilisateur ayant une analyse ATS (parcours ats-first)
3. Vérifier que les étapes Upload CV et Upload Job sont ignorées dans le parcours ats-first
4. Vérifier que la progression est correctement calculée
5. Vérifier que le skip fonctionne pour les étapes skippables
6. Vérifier que le back fonctionne si activé
7. Vérifier que l'onboarding se termine correctement

---

## Conclusion

L'onboarding adaptatif est maintenant opérationnel. Les utilisateurs avec une analyse ATS existante ont un parcours optimisé qui ignore les étapes inutiles, tandis que les nouveaux utilisateurs suivent le parcours complet.

**Prochaines étapes :**
1. Monitoring des taux de completion par parcours
2. A/B testing des variantes
3. Personnalisation dynamique
4. Analytics avancés
