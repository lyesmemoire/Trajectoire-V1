# DOC-011-03 : Protocole de Session Hebdomadaire

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole des sessions hebdomadaires pour les semaines 3-6 du programme beta MVP-011. Ces sessions permettent de collecter le feedback des recruteurs utilisant le moteur en conditions réelles.

---

## 2. Calendrier des Sessions

### 2.1 Semaines 3-6 : Utilisation en Conditions Réelles

**Durée :** 4 semaines (semaines 3, 4, 5, 6)  
**Fréquence :** 1 session par semaine par beta  
**Durée :** 1 heure par session  
**Total :** 20 sessions (5 betas × 4 semaines)

**Objectifs :**
- Collecter le feedback sur l'utilisation du moteur
- Identifier ce qui a fonctionné
- Identifier ce qui n'a pas fonctionné
- Identifier ce qui manque
- Identifier ce qui devrait changer

---

## 3. Structure de la Session Hebdomadaire

### 3.1 Durée et Format

- **Durée :** 1 heure
- **Format :** Visio (Teams, Zoom, Google Meet)
- **Participants :** Beta recruteur + Product Manager
- **Support :** Partage d'écran pour démonstration si nécessaire

### 3.2 Agenda de la Session

| Temps | Activité | Responsable |
|-------|----------|-------------|
| 0:00-0:05 | Check-in rapide | Product Manager |
| 0:05-0:20 | Ce qui a fonctionné | Beta recruteur |
| 0:20-0:35 | Ce qui n'a pas fonctionné | Beta recruteur |
| 0:35-0:45 | Ce qui manque | Beta recruteur |
| 0:45-0:55 | Ce qui devrait changer | Beta recruteur |
| 0:55-1:00 | Plan d'action | Product Manager |

---

## 4. Déroulement Détaillé

### 4.1 Check-in Rapide (5 min)

**Objectif :** Faire un point rapide sur l'utilisation de la semaine.

**Questions :**
- "Combien de recrutements avez-vous traités cette semaine ?"
- "Combien de temps avez-vous passé sur le moteur ?"
- "Avez-vous rencontré des problèmes techniques ?"
- "Y a-t-il des points bloquants ?"

**Documentation :**

```typescript
interface WeeklyCheckin {
  weekNumber: number;
  betaId: string;
  date: Date;
  
  usage: {
    recruitmentsProcessed: number;
    timeSpent: number; // en heures
    technicalIssues: string[];
    blockers: string[];
  };
}
```

---

### 4.2 Ce Qui a Fonctionné (15 min)

**Objectif :** Identifier les aspects positifs de l'utilisation du moteur.

**Questions guidées :**

**Fonctionnalités :**
- "Quelles fonctionnalités avez-vous utilisées cette semaine ?"
- "Quelles fonctionnalités avez-vous trouvées les plus utiles ?"
- "Y a-t-il des fonctionnalités qui vous ont surpris positivement ?"

**Expérience utilisateur :**
- "Qu'avez-vous apprécié dans l'interface ?"
- "Y a-t-il des aspects de l'expérience utilisateur qui vous ont plu ?"
- "Comment décririez-vous votre expérience globale cette semaine ?"

**Résultats :**
- "Avez-vous obtenu de meilleurs résultats avec le moteur ?"
- "Le moteur vous a-t-il fait gagner du temps ?"
- "Avez-vous pris des décisions différentes grâce au moteur ?"

**Documentation :**

```typescript
interface WhatWorked {
  category: 'feature' | 'ux' | 'results';
  description: string;
  impact: 'low' | 'medium' | 'high';
  example: string;
}
```

---

### 4.3 Ce Qui N'a Pas Fonctionné (15 min)

**Objectif :** Identifier les aspects négatifs de l'utilisation du moteur.

**Questions guidées :**

**Fonctionnalités :**
- "Y a-t-il des fonctionnalités qui n'ont pas fonctionné comme attendu ?"
- "Avez-vous rencontré des bugs ou des erreurs ?"
- "Y a-t-il des fonctionnalités qui vous ont frustré ?"

**Expérience utilisateur :**
- "Y a-t-il des aspects de l'interface qui vous ont déçu ?"
- "Avez-vous trouvé l'interface intuitive ?"
- "Y a-t-il des étapes qui étaient trop complexes ?"

**Résultats :**
- "Avez-vous obtenu des résultats incorrects ?"
- "Le moteur vous a-t-il fait perdre du temps ?"
- "Avez-vous dû contourner des limitations ?"

**Documentation :**

```typescript
interface WhatDidntWork {
  category: 'feature' | 'ux' | 'results';
  description: string;
  severity: 'low' | 'medium' | 'high';
  frequency: 'once' | 'occasional' | 'frequent';
  workaround: string;
}
```

---

### 4.4 Ce Qui Manque (10 min)

**Objectif :** Identifier les fonctionnalités ou capacités manquantes.

**Questions guidées :**

**Fonctionnalités manquantes :**
- "Y a-t-il des fonctionnalités que vous attendiez mais qui n'existent pas ?"
- "Quelles fonctionnalités ajouteraient de la valeur à votre workflow ?"
- "Y a-t-il des fonctionnalités de vos outils actuels qui manquent ?"

**Capacités manquantes :**
- "Le moteur manque-t-il de capacités d'analyse ?"
- "Le moteur manque-t-il de capacités de personnalisation ?"
- "Le moteur manque-t-il de capacités d'intégration ?"

**Documentation :**

```typescript
interface WhatsMissing {
  category: 'feature' | 'capability' | 'integration';
  description: string;
  priority: 'low' | 'medium' | 'high';
  useCase: string;
}
```

---

### 4.5 Ce Qui Devrait Changer (10 min)

**Objectif :** Identifier les améliorations à apporter.

**Questions guidées :**

**Améliorations de l'interface :**
- "Comment amélioreriez-vous l'interface ?"
- "Y a-t-il des éléments de l'interface à revoir ?"
- "Comment simplifieriez-vous le workflow ?"

**Améliorations des fonctionnalités :**
- "Comment amélioreriez-vous les fonctionnalités existantes ?"
- "Y a-t-il des fonctionnalités à repenser ?"
- "Comment rendriez-vous le moteur plus puissant ?"

**Améliorations du raisonnement :**
- "Comment amélioreriez-vous le raisonnement du moteur ?"
- "Y a-t-il des aspects du raisonnement à revoir ?"
| "Comment rendriez-vous le moteur plus intelligent ?"

**Documentation :**

```typescript
interface WhatShouldChange {
  category: 'ui' | 'feature' | 'reasoning';
  description: string;
  priority: 'low' | 'medium' | 'high';
  suggestion: string;
}
```

---

### 4.6 Plan d'Action (5 min)

**Objectif :** Définir les actions à prendre suite au feedback.

**Actions possibles :**

**Immédiates (cette semaine) :**
- Correction de bugs critiques
- Clarification de la documentation
- Support technique additionnel

**Court terme (semaines 7-8) :**
- Améliorations de l'interface
- Ajout de fonctionnalités prioritaires
- Optimisation du raisonnement

**Long terme (post-beta) :**
- Nouvelles fonctionnalités
- Refactorisation majeure
- Intégrations

**Documentation :**

```typescript
interface ActionPlan {
  action: string;
  category: 'immediate' | 'short_term' | 'long_term';
  priority: 'low' | 'medium' | 'high';
  owner: string;
  dueDate: Date;
}
```

---

## 5. Documentation de la Session

### 5.1 Compte-Rendu de Session

Chaque session doit être documentée avec le template défini dans DOC-011-04.

**Structure du compte-rendu :**

```typescript
interface WeeklySessionReport {
  sessionId: string;
  betaId: string;
  weekNumber: number;
  date: Date;
  
  checkin: WeeklyCheckin;
  whatWorked: WhatWorked[];
  whatDidntWork: WhatDidntWork[];
  whatsMissing: WhatsMissing[];
  whatShouldChange: WhatShouldChange[];
  actionPlan: ActionPlan[];
  
  overallSentiment: 'positive' | 'neutral' | 'negative';
  nextSteps: string[];
}
```

### 5.2 Envoi du Compte-Rendu

Le compte-rendu est envoyé :
- Au beta recruteur (pour validation)
- À l'équipe produit (pour analyse)
- À l'équipe technique (pour corrections)

---

## 6. Observation Directe

### 6.1 Recommandation

Observation directe conseillée : assister à une session d'utilisation réelle du moteur par le recruteur.

**Objectif :** Observer le recruteur utiliser le moteur dans son environnement naturel.

### 6.2 Processus d'Observation

**Préparation :**
- Planifier l'observation avec le recruteur
- Obtenir l'accord pour l'observation
- Préparer la grille d'observation (DOC-011-05)

**Pendant l'observation :**
- Observer sans intervenir
- Noter les points de friction
- Noter les moments de confusion
- Noter les réussites
- Noter les contournements

**Après l'observation :**
- Discuter des observations avec le recruteur
- Valifier les interprétations
- Documenter les insights

---

## 7. Analyse Croisée

### 7.1 Hebdomadaire

À la fin de chaque semaine, analyser les feedbacks des 5 betas :

**Patterns communs :**
- Quels points sont mentionnés par plusieurs betas ?
- Quels pain points sont partagés ?
- Quelles améliorations sont demandées par plusieurs ?

**Besoins divergents :**
- Quels points sont spécifiques à un profil ?
- Quels besoins sont contradictoires ?
- Comment prioriser les besoins divergents ?

### 7.2 Mensuelle (Semaines 4 et 6)

À la fin des semaines 4 et 6, faire une analyse plus approfondie :

**Tendances :**
- Les feedbacks évoluent-ils avec le temps ?
- Les betas s'adaptent-ils au moteur ?
- La satisfaction augmente-t-elle ?

**Priorités :**
- Quels problèmes doivent être résolus en priorité ?
- Quelles fonctionnalités ajoutent le plus de valeur ?
- Quelles améliorations ont le plus d'impact ?

---

## 8. Gestion des Problèmes

### 8.1 Problèmes Critiques

**Définition :** Problèmes qui empêchent l'utilisation du moteur.

**Processus :**
1. Identification immédiate
2. Notification à l'équipe technique
3. Résolution dans les 24 heures
4. Notification au beta
5. Documentation du problème

### 8.2 Problèmes Majeurs

**Définition :** Problèmes qui nuisent significativement à l'expérience.

**Processus :**
1. Identification lors de la session
2. Notification à l'équipe technique
3. Résolution dans la semaine
4. Notification au beta
5. Documentation du problème

### 8.3 Problèmes Mineurs

**Définition :** Problèmes qui n'impactent pas significativement l'expérience.

**Processus :**
1. Identification lors de la session
2. Documentation dans le backlog
3. Résolution selon priorité
4. Communication au beta si résolu

---

## 9. Communication

### 9.1 Canaux de Communication

**Principal :** Slack #beta-feedback  
**Secondaire :** Email  
**Urgences :** Téléphone

### 9.2 Fréquence de Communication

**Sessions hebdomadaires :** 1h par semaine  
**Support technique :** Réponse < 4 heures  
**Mises à jour :** Hebdomadaires (résumé des feedbacks)

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Session

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de participation | Sessions assistées / sessions totales | ≥ 90% |
| Durée moyenne | Durée moyenne des sessions | 55-60 min |
| Qualité du feedback | Feedback détaillé / total feedback | ≥ 80% |
| Satisfaction | Satisfaction moyenne des sessions | ≥ 4/5 |

### 10.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Recrutements traités | Recrutements traités par beta | ≥ 3/semaine |
| Temps d'utilisation | Temps moyen d'utilisation | ≥ 2h/semaine |
| Fonctionnalités utilisées | Fonctionnalités utilisées / total | ≥ 50% |

---

## 11. Préparation pour les Semaines 7-8

### 11.1 Semaine 7-8 : Synthèse & Itération

**Objectifs :**
- Analyse croisée des 5 feedbacks
- Identification des patterns communs
- Identification des besoins divergents
- Priorisation des corrections
- Planification de l'itération suivante

### 11.2 Préparation

**Avant la semaine 7 :**
- Compiler tous les feedbacks des semaines 3-6
- Préparer l'analyse croisée
- Identifier les patterns communs
- Identifier les besoins divergents
- Préparer la priorisation

---

## 12. Conclusion

Le protocole de session hebdomadaire est essentiel pour collecter un feedback de qualité et identifier les vrais pain points. Une structure claire et une documentation rigoureuse garantissent que le feedback est exploitable.

**Points clés :**
- Structure claire de la session (1 heure)
- Questions guidées pour chaque section
- Documentation rigoureuse du feedback
- Analyse croisée des feedbacks
- Gestion proactive des problèmes
- Communication régulière
