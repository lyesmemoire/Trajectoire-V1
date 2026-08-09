# DOC-M04-04 : Indicateurs de Maturité Organisationnelle

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les indicateurs de maturité organisationnelle pour le MVP-META-04 Timing Intelligence Engine. Ce document structure les indicateurs qui analysent si l'organisation est prête à accueillir ce niveau de profil.

---

## 2. Principe Fondateur

Le bon candidat dans une organisation non prête = échec. Le moteur analyse si l'organisation est prête à accueillir ce niveau de profil (équipe stable, manager disponible, pas de changements majeurs).

---

## 3. Questions Analysées

### 3.1 Questions Clés

- L'organisation est-elle prête pour ce niveau de profil ?
- L'équipe est-elle stable ?
- Le manager est-il disponible pour l'onboarding ?
- Des changements majeurs sont-ils prévus dans les 6 prochains mois ?
  - Réorganisation
  - Fusion
  - Déménagement

---

## 4. Signaux de Mauvais Timing Organisationnel

### 4.1 Signaux Critiques

**Réorganisation en cours**
- Définition : L'entreprise est en train de restructurer ses équipes
- Impact : Incertitude sur le rôle, risque de suppression du poste
- Recommandation : Attendre la fin de la réorganisation

**Manager en train de partir**
- Définition : Le manager direct du poste va quitter l'entreprise
- Impact : Absence de leadership, risque de changement de direction
- Recommandation : Attendre la nomination du nouveau manager

**Équipe en restructuration**
- Définition : L'équipe du poste est en train d'être restructurée
- Impact : Instabilité de l'équipe, risque de turnover
- Recommandation : Attendre la stabilisation de l'équipe

**Budget RH en revue**
- Définition : Le budget RH est en cours de révision
- Impact : Incertitude sur le salaire, risque de blocage du recrutement
- Recommandation : Attendre la validation du budget

**Direction en transition**
- Définition : La direction de l'entreprise est en transition (nouveau CEO, etc.)
- Impact : Incertitude stratégique, risque de changement de priorités
- Recommandation : Attendre la stabilisation de la direction

---

## 5. Niveaux de Préparation Organisationnelle

### 5.1 Niveau 1 — Prêt

**Définition :**
L'organisation est prête à accueillir ce niveau de profil.

**Critères :**
- Équipe stable (turnover < 10%)
- Manager disponible et confirmé
- Pas de changements majeurs prévus dans les 6 mois
- Budget validé

**Recommandation :**
- Recruter maintenant
- Onboarding standard

**Format de sortie :**
```
Organisation : Prête
Point de vigilance : Aucun
Recommandation : Recruter maintenant
```

---

### 5.2 Niveau 2 — Partiellement Prête

**Définition :**
L'organisation est partiellement prête, mais des points de vigilance existent.

**Critères :**
- Équipe stable mais manager nouveau
- Manager disponible mais équipe en transition
- Budget validé mais changements mineurs prévus

**Recommandation :**
- Recruter avec précautions
- Onboarding renforcé
- Points de vigilance à surveiller

**Format de sortie :**
```
Organisation : Partiellement prête
Point de vigilance : [description]
Recommandation : Recruter avec précautions
```

---

### 5.3 Niveau 3 — Pas Prête

**Définition :**
L'organisation n'est pas prête à accueillir ce niveau de profil.

**Critères :**
- Réorganisation en cours
- Manager en train de partir
- Équipe en restructuration
- Budget en revue
- Direction en transition

**Recommandation :**
- Attendre la stabilisation
- Reporter le recrutement
- Chercher une solution transitoire

**Format de sortie :**
```
Organisation : Pas prête
Point de vigilance : [description]
Recommandation : Attendre la stabilisation
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface OrganizationalReadiness {
  organizationReady: boolean;
  teamStable: boolean;
  managerAvailable: boolean;
  
  upcomingChanges: {
    reorganization: boolean;
    managerLeaving: boolean;
    teamRestructuring: boolean;
    budgetReview: boolean;
    leadershipTransition: boolean;
  };
  
  readinessLevel: 'ready' | 'partiallyReady' | 'notReady';
  vigilancePoints: string[];
  
  recommendation: string;
  rationale: string;
}

interface OrganizationalMaturityIndicators {
  indicatorId: string;
  recruitmentId: string;
  
  indicators: {
    teamStability: {
      turnoverRate: number; // en pourcentage
      stability: 'high' | 'medium' | 'low';
    };
    managerAvailability: {
      available: boolean;
      confirmed: boolean;
      onboardingCapacity: 'high' | 'medium' | 'low';
    };
    upcomingChanges: {
      reorganization: boolean;
      managerLeaving: boolean;
      teamRestructuring: boolean;
      budgetReview: boolean;
      leadershipTransition: boolean;
      changeCount: number;
    };
    budgetStatus: {
      validated: boolean;
      underReview: boolean;
      risk: 'low' | 'medium' | 'high';
    };
  };
  
  organizationalReadiness: OrganizationalReadiness;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE organizational_maturity_indicators (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  
  indicators JSON NOT NULL,
  organizational_readiness JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizational_maturity_recruitment ON organizational_maturity_indicators(recruitment_id);
```

---

## 8. API Endpoints

```typescript
// POST /api/organizational-maturity-indicators/analyze
async function analyzeOrganizationalMaturity(recruitmentId: string): Promise<OrganizationalMaturityIndicators> {
  return await analyzeOrganizationalMaturity(recruitmentId);
}

// GET /api/organizational-maturity-indicators/:recruitmentId
async function getOrganizationalMaturityIndicators(recruitmentId: string): Promise<OrganizationalMaturityIndicators> {
  return await getOrganizationalMaturityIndicators(recruitmentId);
}

// PUT /api/organizational-maturity-indicators/:recruitmentId
async function updateOrganizationalMaturityIndicators(recruitmentId: string, indicators: OrganizationalMaturityIndicators): Promise<OrganizationalMaturityIndicators> {
  return await updateOrganizationalMaturityIndicators(recruitmentId, indicators);
}

// POST /api/organizational-maturity-indicators/:recruitmentId/readiness
async function assessOrganizationalReadiness(recruitmentId: string): Promise<OrganizationalReadiness> {
  return await assessOrganizationalReadiness(recruitmentId);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'analyse | Indicateurs analysés / recrutements | 100% |
- Taux de préparation | Organisations prêtes / totales | ≥ 70% |

### 9.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de consultation | Indicateurs consultés / analysés | ≥ 80% |
- Taux d'impact sur décision | Décisions influencées par maturité organisationnelle / décisions totales | ≥ 60% |

---

## 10. Conclusion

Les indicateurs de maturité organisationnelle structurent l'analyse de si l'organisation est prête à accueillir ce niveau de profil. 5 signaux de mauvais timing organisationnel (Réorganisation en cours, Manager en train de partir, Équipe en restructuration, Budget RH en revue, Direction en transition). 3 niveaux de préparation (Prêt, Partiellement prête, Pas prête). Questions clés analysées (organisation prête, équipe stable, manager disponible, changements majeurs). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 5 signaux de mauvais timing
- 3 niveaux de préparation
- Questions clés analysées
- Critères par niveau
- Recommandations par niveau
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
