# DOC-M10-05 : Templates de Recommandations Opérationnelles

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les templates de recommandations opérationnelles pour le MVP-META-10 Manager Compatibility Engine. Ce document structure les recommandations adaptées pour le manager et le candidat basées sur l'analyse de compatibilité.

---

## 2. Principe Fondateur

Les recommandations opérationnelles sont générées automatiquement à partir de l'analyse de compatibilité. Elles fournissent des actions concrètes pour le manager afin d'adapter son style, et pour le candidat afin de réussir dans ce contexte.

---

## 3. Template pour le Manager

### 3.1 Structure du Template

```markdown
RECOMMANDATIONS POUR LE MANAGER

Avec [candidat],
adaptez votre style sur ces points :

→ Sur la communication :
  Ce candidat a besoin de [X].
  Votre style naturel est [Y].
  Adapter en faisant [action concrète].

→ Sur l'autonomie :
  Ce candidat fonctionne mieux avec [X].
  Votre style naturel donne [Y].
  Trouver un équilibre en [action].

→ Point de vigilance principal :
  [Risque le plus critique identifié]
  Comment le gérer : [actions]
```

---

### 3.2 Exemples de Recommandations par Dimension

**Communication :**
- Candidat a besoin de feedback direct et immédiat
- Manager naturel est indirect et différé
- Adapter en donnant un feedback immédiat après chaque tâche importante

**Autonomie :**
- Candidat fonctionne mieux avec un cadre structuré
- Manager naturel donne une grande autonomie
- Trouver un équilibre en définissant des objectifs clairs avec des points de contrôle réguliers

**Feedback :**
- Candidat a besoin de feedback fréquent
- Manager naturel donne un feedback rare
- Adapter en programmant des points de feedback hebdomadaires

---

### 3.3 Template Généré (Exemple)

```markdown
RECOMMANDATIONS POUR LE MANAGER

Avec [Jean Dupont],
adaptez votre style sur ces points :

→ Sur la communication :
  Ce candidat a besoin de communication directe et explicite.
  Votre style naturel est direct et explicite.
  Adapter en maintenant votre style actuel, c'est aligné.

→ Sur l'autonomie :
  Ce candidat fonctionne mieux avec un cadre structuré.
  Votre style naturel donne une grande autonomie.
  Trouver un équilibre en définissant des objectifs clairs avec des points de contrôle hebdomadaires.

→ Point de vigilance principal :
  Besoin de structure vs autonomie excessive
  Comment le gérer : Définir un cadre avec des objectifs précis et des points de contrôle réguliers sans étouffer l'autonomie.
```

---

## 4. Template pour le Candidat

### 4.1 Structure du Template

```markdown
RECOMMANDATIONS POUR LE CANDIDAT

Avec votre manager,
attendez-vous à :

→ Un style [directif/participatif/etc.]
→ Un feedback [fréquent/rare/etc.]
→ Des attentes de [disponibilité/résultats]

Pour réussir dans ce contexte :
→ [Action 1]
→ [Action 2]
```

---

### 4.2 Exemples de Recommandations par Dimension

**Style de management :**
- Attendre-vous à un style directif
- Le manager donne des instructions précises et vérifie l'exécution
- Pour réussir : Suivre les instructions scrupuleusement, demander des clarifications si nécessaire

**Feedback :**
- Attendre-vous à un feedback rare
- Le manager ne donne du feedback que sur les décisions importantes
- Pour réussir : Solliciter activement du feedback, ne pas attendre que le manager l'initie

**Disponibilité :**
- Attendre-vous à des attentes de disponibilité intensive
- Le manager répond aux emails le soir et le week-end
- Pour réussir : Clarifier vos limites dès le début, négocier un équilibre réaliste

---

### 4.3 Template Généré (Exemple)

```markdown
RECOMMANDATIONS POUR LE CANDIDAT

Avec votre manager,
attendez-vous à :

→ Un style participatif
→ Un feedback hebdomadaire
→ Des attentes de disponibilité standard

Pour réussir dans ce contexte :
→ Participer activement aux décisions en donnant votre avis
→ Préparer des points à discuter lors des points hebdomadaires
→ Respecter les horaires de travail et répondre aux emails dans un délai de 24h
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface OperationalRecommendations {
  recommendationId: string;
  recruitmentId: string;
  candidateId: string;
  managerId: string;
  
  managerRecommendations: {
    communication: {
      candidateNeed: string;
      managerStyle: string;
      adaptation: string;
    };
    autonomy: {
      candidateNeed: string;
      managerStyle: string;
      adaptation: string;
    };
    mainVigilance: {
      risk: string;
      management: string[];
    };
  };
  
  candidateRecommendations: {
    expectations: {
      managementStyle: string;
      feedback: string;
      availability: string;
    };
    successActions: string[];
  };
  
  generatedAt: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE operational_recommendations (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  manager_id VARCHAR(36) NOT NULL,
  
  manager_recommendations JSON NOT NULL,
  candidate_recommendations JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_operational_recommendations_recruitment ON operational_recommendations(recruitment_id);
CREATE INDEX idx_operational_recommendations_candidate ON operational_recommendations(candidate_id);
CREATE INDEX idx_operational_recommendations_manager ON operational_recommendations(manager_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/operational-recommendations/generate
async function generateOperationalRecommendations(recruitmentId: string, candidateId: string, managerId: string): Promise<OperationalRecommendations> {
  return await generateOperationalRecommendations(recruitmentId, candidateId, managerId);
}

// GET /api/operational-recommendations/:recommendationId
async function getOperationalRecommendations(recommendationId: string): Promise<OperationalRecommendations> {
  return await getOperationalRecommendations(recommendationId);
}

// GET /api/operational-recommendations/recruitment/:recruitmentId
async function getOperationalRecommendationsByRecruitment(recruitmentId: string): Promise<OperationalRecommendations> {
  return await getOperationalRecommendationsByRecruitment(recruitmentId);
}

// PUT /api/operational-recommendations/:recommendationId
async function updateOperationalRecommendations(recommendationId: string, updates: any): Promise<OperationalRecommendations> {
  return await updateOperationalRecommendations(recommendationId, updates);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Génération

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Recommandations générées / recrutements | ≥ 95% |
- Latence de génération | Temps entre score et recommandations | ≤ 3 secondes |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de lecture manager | Managers lisent / totaux | ≥ 80% |
- Taux de lecture candidat | Candidats lisent / totaux | ≥ 70% |

---

## 9. Exemple Complet

```markdown
RECOMMANDATIONS OPÉRATIONNELLES

Candidat : [Anonymisé]
Manager : [Anonymisé]
Recrutement : REC-2026-001
Date : 2026-08-04

POUR LE MANAGER :

Avec [candidat],
adaptez votre style sur ces points :

→ Sur la communication :
  Ce candidat a besoin de communication directe et explicite.
  Votre style naturel est direct et explicite.
  Adapter en maintenant votre style actuel, c'est aligné.

→ Sur l'autonomie :
  Ce candidat fonctionne mieux avec un cadre structuré.
  Votre style naturel donne une grande autonomie.
  Trouver un équilibre en définissant des objectifs clairs avec des points de contrôle hebdomadaires.

→ Point de vigilance principal :
  Besoin de structure vs autonomie excessive
  Comment le gérer : Définir un cadre avec des objectifs précis et des points de contrôle réguliers sans étouffer l'autonomie.

POUR LE CANDIDAT :

Avec votre manager,
attendez-vous à :

→ Un style participatif
→ Un feedback hebdomadaire
→ Des attentes de disponibilité standard

Pour réussir dans ce contexte :
→ Participer activement aux décisions en donnant votre avis
→ Préparer des points à discuter lors des points hebdomadaires
→ Respecter les horaires de travail et répondre aux emails dans un délai de 24h
```

---

## 10. Conclusion

Les templates de recommandations opérationnelles structurent les recommandations adaptées pour le manager et le candidat. Template manager : Communication (besoin candidat, style manager, adaptation), Autonomie (besoin candidat, style manager, équilibre), Point de vigilance principal (risque, gestion). Template candidat : Attentes (style management, feedback, disponibilité), Actions pour réussir. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Template pour le manager
- Template pour le candidat
- Recommandations par dimension
- Actions concrètes
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de génération et d'utilisation
