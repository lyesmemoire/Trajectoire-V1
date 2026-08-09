# DOC-M10-01 : Modèle de Profil Manager en 5 Dimensions

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle de profil manager en 5 dimensions pour le MVP-META-10 Manager Compatibility Engine. Ce document structure les dimensions qui caractérisent le style de management et les attentes d'un manager.

---

## 2. Principe Fondateur

Pour chaque manager qui recrute, le moteur construit un profil basé sur 5 dimensions fondamentales. Ce profil permet d'analyser la compatibilité avec les candidats et de fournir des recommandations adaptées.

---

## 3. Les 5 Dimensions du Profil Manager

### 3.1 DIMENSION 1 — Style de Management

**Directif :**
- Donne des instructions précises
- Vérifie l'exécution
- Décide seul
- Peu de délégation

**Participatif :**
- Consulte avant de décider
- Valorise les avis de l'équipe
- Décision partagée

**Délégateur :**
- Fixe les objectifs
- Laisse faire
- Intervient peu
- Fait confiance par défaut

**Coach :**
- Développe les compétences
- Pose des questions plutôt qu'ordonner
- Focus sur la progression

**Laissez-faire :**
- Peu présent
- L'équipe s'auto-organise
- Peu de cadre

---

### 3.2 DIMENSION 2 — Besoin de Contrôle

**Fort :**
- Rapport quotidien attendu
- Validation avant action
- Réunions fréquentes

**Moyen :**
- Points hebdomadaires
- Autonomie dans le cadre défini
- Validation sur les décisions importantes

**Faible :**
- Points mensuels suffisants
- Grande autonomie
- Résultats attendus, moyens libres

---

### 3.3 DIMENSION 3 — Style de Communication

**Direct/Explicite :**
- Dit exactement ce qu'il pense
- Feedback immédiat
- Pas de sous-entendu

**Indirect/Implicite :**
- Communication en nuances
- Lit entre les lignes
- Feedback différé ou suggéré

**Écrit :**
- Préfère les emails et rapports
- Trace tout

**Oral :**
- Préfère les discussions directes
- Peu de documentation

---

### 3.4 DIMENSION 4 — Tolérance à l'Erreur

**Punitive :**
- L'erreur est sanctionnée
- Peu de droit à l'échec
- Culture de la perfection

**Apprenante :**
- L'erreur est acceptable si on en tire une leçon
- Culture de l'amélioration

**Indifférente :**
- L'erreur passe inaperçue
- Peu de feedback

---

### 3.5 DIMENSION 5 — Attentes Implicites

**Sur-disponibilité :**
- Répond aux emails le soir et le week-end
- Attend que l'équipe fasse de même

**Respect des horaires :**
- Travail dans le cadre contractuel
- Respect de l'équilibre vie pro/perso

**Présentéisme :**
- Valorise la présence physique
- Télétravail mal vu

**Résultat seul :**
- Peu importe les heures
- Seul le résultat compte

---

## 4. Source des Données Manager

### 4.1 Source 1 — Questionnaire Manager
- Rempli avant le recrutement
- Questions structurées sur les 5 dimensions
- Auto-évaluation du style de management

### 4.2 Source 2 — Observations Historiques
- Retours de ses anciens collaborateurs anonymisés
- Patterns observés dans les relations passées
- Confirmation ou infirmation de l'auto-évaluation

### 4.3 Source 3 — Patterns Observés
- Patterns observés dans ses recrutements précédents
- Taux de rétention des collaborateurs
- Feedback des collaborateurs sortants

---

## 5. Structure de Données (TypeScript)

```typescript
interface ManagerProfile {
  profileId: string;
  managerId: string;
  
  dimensions: {
    managementStyle: 'directive' | 'participative' | 'delegator' | 'coach' | 'laissez_faire';
    controlNeed: 'strong' | 'medium' | 'weak';
    communicationStyle: 'direct_explicit' | 'indirect_implicit' | 'written' | 'oral';
    errorTolerance: 'punitive' | 'learning' | 'indifferent';
    implicitExpectations: 'over_availability' | 'respect_hours' | 'presenteeism' | 'result_only';
  };
  
  sources: {
    questionnaire: {
      completed: boolean;
      completedAt?: Date;
      responses: any;
    };
    historicalObservations: {
      hasData: boolean;
      collaboratorCount: number;
      patterns: string[];
    };
    recruitmentPatterns: {
      hasData: boolean;
      recruitmentCount: number;
      retentionRate: number;
      feedback: string[];
    };
  };
  
  confidence: {
    overall: number;
    byDimension: {
      managementStyle: number;
      controlNeed: number;
      communicationStyle: number;
      errorTolerance: number;
      implicitExpectations: number;
    };
  };
  
  updatedAt: Date;
  
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
CREATE TABLE manager_profile (
  id VARCHAR(36) PRIMARY KEY,
  manager_id VARCHAR(36) NOT NULL,
  
  dimensions JSON NOT NULL,
  sources JSON NOT NULL,
  confidence JSON NOT NULL,
  
  updated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_manager_profile_manager ON manager_profile(manager_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/manager-profile/create
async function createManagerProfile(managerId: string, questionnaire: any): Promise<ManagerProfile> {
  return await createManagerProfile(managerId, questionnaire);
}

// GET /api/manager-profile/:profileId
async function getManagerProfile(profileId: string): Promise<ManagerProfile> {
  return await getManagerProfile(profileId);
}

// GET /api/manager-profile/manager/:managerId
async function getManagerProfileByManager(managerId: string): Promise<ManagerProfile> {
  return await getManagerProfileByManager(managerId);
}

// PUT /api/manager-profile/:profileId
async function updateManagerProfile(profileId: string, updates: any): Promise<ManagerProfile> {
  return await updateManagerProfile(profileId, updates);
}

// POST /api/manager-profile/:profileId/historical-observations
async function addHistoricalObservations(profileId: string, observations: any): Promise<ManagerProfile> {
  return await addHistoricalObservations(profileId, observations);
}

// POST /api/manager-profile/:profileId/recruitment-patterns
async function addRecruitmentPatterns(profileId: string, patterns: any): Promise<ManagerProfile> {
  return await addRecruitmentPatterns(profileId, patterns);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Profilage

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion questionnaire | Questionnaires complétés / managers | ≥ 90% |
- Taux de confiance moyen | Confiance moyenne / profils | ≥ 0.75 |

### 8.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de cohérence sources | Profils cohérents / totaux | ≥ 85% |
- Taux de mise à jour | Profils mis à jour / totaux | ≥ 80% |

---

## 9. Exemple Complet

```markdown
PROFIL MANAGER

Manager : [Anonymisé]
ID : MGR-2026-001
Date : 2026-08-04

DIMENSIONS :

Style de management : Participatif
→ Consulte avant de décider
→ Valorise les avis de l'équipe
→ Décision partagée

Besoin de contrôle : Moyen
→ Points hebdomadaires
→ Autonomie dans le cadre défini
→ Validation sur les décisions importantes

Style de communication : Direct/Explicite
→ Dit exactement ce qu'il pense
→ Feedback immédiat
→ Pas de sous-entendu

Tolérance à l'erreur : Apprenante
→ L'erreur est acceptable si on en tire une leçon
→ Culture de l'amélioration

Attentes implicites : Respect des horaires
→ Travail dans le cadre contractuel
→ Respect de l'équilibre vie pro/perso

SOURCES :
→ Questionnaire : Complété le 2026-07-15
→ Observations historiques : 12 collaborateurs, patterns cohérents
→ Patterns recrutement : 8 recrutements, taux rétention 85%

CONFIANCE :
→ Globale : 0.82
→ Par dimension : 0.85 / 0.80 / 0.78 / 0.85 / 0.82
```

---

## 10. Conclusion

Le modèle de profil manager en 5 dimensions structure les caractéristiques fondamentales du style de management. 5 dimensions : Style de management (Directif, Participatif, Délégateur, Coach, Laissez-faire), Besoin de contrôle (Fort, Moyen, Faible), Style de communication (Direct/Explicite, Indirect/Implicite, Écrit, Oral), Tolérance à l'erreur (Punitive, Apprenante, Indifférente), Attentes implicites (Sur-disponibilité, Respect des horaires, Présentéisme, Résultat seul). 3 sources de données : Questionnaire manager, Observations historiques, Patterns observés. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 5 dimensions du profil manager
- 5 styles de management
- 3 niveaux de besoin de contrôle
- 4 styles de communication
- 3 types de tolérance à l'erreur
- 4 types d'attentes implicites
- 3 sources de données
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de profilage et de qualité
