# DOC-011-07 : Backlog Priorisé Post-Beta

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le backlog priorisé post-beta pour MVP-011. Ce backlog compile les corrections, améliorations et nouvelles fonctionnalités identifiées pendant le programme beta, priorisées selon leur impact et leur effort.

---

## 2. Principe Fondateur

Le backlog post-beta est basé sur les feedbacks réels des 5 beta recruteurs. Il priorise les corrections et améliorations qui ont le plus d'impact sur la valeur utilisateur.

---

## 3. Structure du Backlog

### 3.1 Catégories

| Catégorie | Description |
|-----------|-------------|
| Bug Fixes | Corrections de bugs critiques et majeurs |
| UX Improvements | Améliorations de l'expérience utilisateur |
| Feature Enhancements | Améliorations de fonctionnalités existantes |
| New Features | Nouvelles fonctionnalités demandées |
| Technical Debt | Refactorisation et améliorations techniques |
| Documentation | Améliorations de la documentation |

### 3.2 Critères de Priorisation

| Critère | Poids | Description |
|---------|-------|-------------|
| Impact utilisateur | 40% | Impact sur la valeur pour l'utilisateur |
| Fréquence | 25% | Fréquence du problème ou de la demande |
| Sévérité | 20% | Sévérité du problème ou importance de la demande |
| Effort | 15% | Effort de mise en œuvre (inverse) |

---

## 4. Backlog Priorisé

### 4.1 PRIORITÉ 1 — Critique (Immédiat)

#### BUG-001 : Erreur d'import de CV format PDF

| Attribut | Valeur |
|----------|--------|
| ID | BUG-001 |
| Titre | Erreur d'import de CV format PDF |
| Catégorie | Bug Fixes |
| Description | L'import de CV au format PDF échoue systématiquement avec une erreur de parsing |
| Sévérité | Critique |
| Fréquence | Élevée (3/5 betas) |
| Impact utilisateur | Élevé (bloque l'utilisation) |
| Effort | Moyen (2-3 jours) |
| Responsable | Équipe technique |
| Date limite | Semaine 9 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 1, Beta 3, Beta 5
- Contournement actuel : Convertir en Word avant import
- Impact : Bloque le workflow principal
- Recommandation : Priorité absolue

---

#### BUG-002 : Latence excessive du matching

| Attribut | Valeur |
|----------|--------|
| ID | BUG-002 |
| Titre | Latence excessive du matching |
| Catégorie | Bug Fixes |
| Description | Le matching prend plus de 30 secondes pour un CV, ce qui est trop lent |
| Sévérité | Critique |
| Fréquence | Élevée (4/5 betas) |
| Impact utilisateur | Élevé (frustration utilisateur) |
| Effort | Élevé (1 semaine) |
| Responsable | Équipe technique |
| Date limite | Semaine 10 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 1, Beta 2, Beta 3, Beta 4
- Contournement actuel : Attendre
- Impact : Frustrant mais non bloquant
- Recommandation : Optimiser les requêtes et ajouter du cache

---

#### UX-001 : Bouton d'import de CV difficile à trouver

| Attribut | Valeur |
|----------|--------|
| ID | UX-001 |
| Titre | Bouton d'import de CV difficile à trouver |
| Catégorie | UX Improvements |
| Description | Le bouton d'import de CV n'est pas visible dans l'interface principale |
| Sévérité | Critique |
| Fréquence | Élevée (5/5 betas) |
| Impact utilisateur | Élevé (point de friction majeur) |
| Effort | Faible (1 jour) |
| Responsable | Équipe UX |
| Date limite | Semaine 9 |
| Statut | À faire |

**Détails :**
- Mentionné par : Tous les betas
- Contournement actuel : Demander de l'aide
- Impact : Premier point de friction pour tous les nouveaux utilisateurs
- Recommandation : Déplacer le bouton en évidence

---

### 4.2 PRIORITÉ 2 — Élevée (Court terme)

#### FEAT-001 : Amélioration de l'arbre de décision

| Attribut | Valeur |
|----------|--------|
| ID | FEAT-001 |
| Titre | Amélioration de l'arbre de décision |
| Catégorie | Feature Enhancements |
| Description | L'arbre de décision est difficile à interpréter pour les non-techniciens |
| Sévérité | Élevée |
| Fréquence | Élevée (4/5 betas) |
| Impact utilisateur | Élevé (réduit la valeur de l'explainability) |
| Effort | Moyen (3-4 jours) |
| Responsable | Équipe produit + UX |
| Date limite | Semaine 11 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 1, Beta 2, Beta 3, Beta 4
- Amélioration demandée : Simplifier la terminologie, ajouter des légendes
- Impact : Rend l'explainability accessible à tous
- Recommandation : Refactoriser l'affichage de l'arbre

---

#### FEAT-002 : Export du raisonnement en PDF

| Attribut | Valeur |
|----------|--------|
| ID | FEAT-002 |
| Titre | Export du raisonnement en PDF |
| Catégorie | New Features |
| Description | Permettre d'exporter le raisonnement du moteur en PDF pour partage |
| Sévérité | Élevée |
| Fréquence | Moyenne (3/5 betas) |
| Impact utilisateur | Élevé (facilite la justification auprès des parties prenantes) |
| Effort | Moyen (2-3 jours) |
| Responsable | Équipe technique |
| Date limite | Semaine 11 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 1, Beta 2, Beta 5
- Cas d'usage : Justifier une décision auprès du DRH ou du manager
- Impact : Facilite l'adoption dans les grandes organisations
- Recommandation : Implémenter un générateur PDF

---

#### UX-002 : Amélioration de la navigation

| Attribut | Valeur |
|----------|--------|
| ID | UX-002 |
| Titre | Amélioration de la navigation |
| Catégorie | UX Improvements |
| Description | La navigation entre les différentes étapes du workflow n'est pas intuitive |
| Sévérité | Élevée |
| Fréquence | Moyenne (3/5 betas) |
| Impact utilisateur | Élevé (réduit l'efficacité) |
| Effort | Moyen (2-3 jours) |
| Responsable | Équipe UX |
| Date limite | Semaine 12 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 2, Beta 3, Beta 5
- Problème : Les utilisateurs se perdent dans le workflow
- Impact : Réduit l'efficacité et augmente la frustration
- Recommandation : Ajouter un breadcrumb et un guide étape par étape

---

### 4.3 PRIORITÉ 3 — Moyenne (Moyen terme)

#### FEAT-003 : Intégration ATS

| Attribut | Valeur |
|----------|--------|
| ID | FEAT-003 |
| Titre | Intégration ATS |
| Catégorie | New Features |
| Description | Intégration avec les ATS courants (Greenhouse, Lever, Workable) |
| Sévérité | Moyenne |
| Fréquence | Moyenne (2/5 betas) |
| Impact utilisateur | Élevé (réduit le travail manuel) |
| Effort | Élevé (2-3 semaines) |
| Responsable | Équipe technique |
| Date limite | Semaine 15 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 1, Beta 3
- Cas d'usage : Import automatique des CV depuis l'ATS
- Impact : Réduit significativement le travail manuel
- Recommandation : Prioriser Greenhouse et Lever

---

#### FEAT-004 : Recherche avancée de candidats

| Attribut | Valeur |
|----------|--------|
| ID | FEAT-004 |
| Titre | Recherche avancée de candidats |
| Catégorie | New Features |
| Description | Permettre des filtres avancés pour la recherche de candidats (expérience, secteur, etc.) |
| Sévérité | Moyenne |
| Fréquence | Moyenne (2/5 betas) |
| Impact utilisateur | Moyenne (améliore la précision) |
| Effort | Moyen (3-4 jours) |
| Responsable | Équipe technique |
| Date limite | Semaine 14 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 3, Beta 4
- Cas d'usage : Trouver des candidats avec des critères spécifiques
- Impact : Améliore la précision de la recherche
- Recommandation : Implémenter des filtres dynamiques

---

#### TECH-001 : Refactorisation du code de matching

| Attribut | Valeur |
|----------|--------|
| ID | TECH-001 |
| Titre | Refactorisation du code de matching |
| Catégorie | Technical Debt |
| Description | Le code de matching est difficile à maintenir et à optimiser |
| Sévérité | Moyenne |
| Fréquence | N/A |
| Impact utilisateur | Indirect (améliore la maintenabilité) |
| Effort | Élevé (1 semaine) |
| Responsable | Équipe technique |
| Date limite | Semaine 16 |
| Statut | À faire |

**Détails :**
- Problème identifié par l'équipe technique
- Impact : Facilite les futures optimisations
- Recommandation : Refactoriser en modules plus petits

---

### 4.4 PRIORITÉ 4 — Faible (Long terme)

#### FEAT-005 : Mode collaboratif

| Attribut | Valeur |
|----------|--------|
| ID | FEAT-005 |
| Titre | Mode collaboratif |
| Catégorie | New Features |
| Description | Permettre à plusieurs recruteurs de collaborer sur le même recrutement |
| Sévérité | Faible |
| Fréquence | Faible (1/5 betas) |
| Impact utilisateur | Moyenne (améliore la collaboration) |
| Effort | Élevé (2-3 semaines) |
| Responsable | Équipe technique |
| Date limite | Semaine 20 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 1
- Cas d'usage : Collaboration entre DRH et manager
- Impact : Améliore la collaboration dans les grandes organisations
- Recommandation : Implémenter après les priorités plus élevées

---

#### DOC-001 : Amélioration de la documentation

| Attribut | Valeur |
|----------|--------|
| ID | DOC-001 |
| Titre | Amélioration de la documentation |
| Catégorie | Documentation |
| Description | La documentation actuelle est incomplète et difficile à suivre |
| Sévérité | Faible |
| Fréquence | Moyenne (2/5 betas) |
| Impact utilisateur | Moyenne (réduit la courbe d'apprentissage) |
| Effort | Moyen (3-4 jours) |
| Responsable | Équipe produit |
| Date limite | Semaine 18 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 2, Beta 5
- Problème : Les nouveaux utilisateurs ont du mal à démarrer
- Impact : Réduit la courbe d'apprentissage
- Recommandation : Créer des tutoriels vidéo et des guides pas à pas

---

#### FEAT-006 : Personnalisation des pondérations

| Attribut | Valeur |
|----------|--------|
| ID | FEAT-006 |
| Titre | Personnalisation des pondérations |
| Catégorie | New Features |
| Description | Permettre aux recruteurs de personnaliser les pondérations des critères |
| Sévérité | Faible |
| Fréquence | Faible (1/5 betas) |
| Impact utilisateur | Moyenne (améliore la personnalisation) |
| Effort | Moyen (2-3 jours) |
| Responsable | Équipe technique |
| Date limite | Semaine 19 |
| Statut | À faire |

**Détails :**
- Mentionné par : Beta 4
- Cas d'usage : Adapter le moteur aux préférences spécifiques
- Impact : Améliore la personnalisation
- Recommandation : Implémenter après la stabilisation de la mémoire

---

## 5. Structure de Données (TypeScript)

```typescript
interface BacklogItem {
  id: string;
  title: string;
  category: 'bug_fixes' | 'ux_improvements' | 'feature_enhancements' | 'new_features' | 'technical_debt' | 'documentation';
  
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  frequency: number; // 0-5 betas
  userImpact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  
  owner: string;
  dueDate: Date;
  status: 'todo' | 'in_progress' | 'done' | 'cancelled';
  
  details: {
    mentionedBy: boolean[];
    currentWorkaround?: string;
    impact: string;
    recommendation: string;
  };
  
  priorityScore: number; // Calculé automatiquement
}

interface Backlog {
  version: string;
  createdDate: Date;
  lastUpdated: Date;
  
  items: {
    priority1: BacklogItem[];
    priority2: BacklogItem[];
    priority3: BacklogItem[];
    priority4: BacklogItem[];
  };
  
  summary: {
    totalItems: number;
    byCategory: {
      bug_fixes: number;
      ux_improvements: number;
      feature_enhancements: number;
      new_features: number;
      technical_debt: number;
      documentation: number;
    };
    byStatus: {
      todo: number;
      in_progress: number;
      done: number;
      cancelled: number;
    };
  };
}
```

---

## 6. Calcul du Score de Priorité

### 6.1 Formule

```typescript
function calculatePriorityScore(item: BacklogItem): number {
  const userImpactScore = {
    high: 40,
    medium: 20,
    low: 10
  };
  
  const frequencyScore = (item.frequency / 5) * 25;
  
  const severityScore = {
    critical: 20,
    high: 15,
    medium: 10,
    low: 5
  };
  
  const effortScore = {
    low: 15,
    medium: 10,
    high: 5
  };
  
  return (
    userImpactScore[item.userImpact] +
    frequencyScore +
    severityScore[item.severity] +
    effortScore[item.effort]
  );
}
```

### 6.2 Exemple de Calcul

**BUG-001 : Erreur d'import de CV format PDF**

- Impact utilisateur : Élevé (40)
- Fréquence : 3/5 betas (15)
- Sévérité : Critique (20)
- Effort : Moyen (10)

**Score total : 85/100**

---

## 7. Gestion du Backlog

### 7.1 Réunions de Backlog

**Fréquence :** Hebdomadaire  
**Participants :** Product Manager, Équipe technique, Équipe UX  
**Durée :** 1 heure

**Agenda :**
- Revue des items en cours
- Ajout de nouveaux items (si nécessaire)
- Repriorisation des items existants
- Planification de la semaine

### 7.2 Mise à Jour du Backlog

Le backlog est mis à jour :
- Après chaque session hebdomadaire beta
- Après chaque réunion de backlog
- Après chaque livraison

### 7.3 Communication

Le backlog est partagé avec :
- L'équipe produit
- L'équipe technique
- L'équipe UX
- Les beta recruteurs (vue simplifiée)

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Backlog

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de résolution | Items résolus / total items | ≥ 80% |
| Temps moyen de résolution | Temps moyen pour résoudre un item | < 2 semaines |
| Taux de réouverture | Items réouverts / total résolus | < 10% |
| Satisfaction betas | Satisfaction des betas avec les corrections | ≥ 4/5 |

### 8.2 Métriques par Catégorie

| Catégorie | Items totaux | Items résolus | Taux de résolution |
|-----------|--------------|--------------|-------------------|
| Bug Fixes | X | X | X% |
| UX Improvements | X | X | X% |
| Feature Enhancements | X | X | X% |
| New Features | X | X | X% |
| Technical Debt | X | X | X% |
| Documentation | X | X | X% |

---

## 9. Conclusion

Le backlog priorisé post-beta est basé sur les feedbacks réels des 5 beta recruteurs. Il priorise les corrections et améliorations qui ont le plus d'impact sur la valeur utilisateur.

**Points clés :**
- Priorisation basée sur l'impact et l'effort
- 3 items critiques à résoudre immédiatement
- 3 items élevés à résoudre à court terme
- 3 items moyens à résoudre à moyen terme
- 3 items faibles à résoudre à long terme
- Réunions de backlog hebdomadaires
- Communication transparente avec l'équipe
