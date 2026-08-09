# DOC-008-02 : Protocole de Feedback Structuré

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de feedback structuré que les recruteurs doivent fournir après chaque décision de recrutement. Le feedback n'est jamais un simple ✓ / ✗ mais une structure riche qui permet au moteur d'apprendre efficacement.

---

## 2. Principe Fondateur

Le feedback recruteur n'est jamais un simple ✓ / ✗. Un feedback sans contexte ne permet pas d'apprendre la bonne leçon. Le feedback structuré capture la nuance de la décision humaine pour un apprentissage de qualité.

---

## 3. Structure du Feedback Structuré

### 3.1 Interface de Feedback

```typescript
interface RecruiterFeedback {
  // Identifiants
  id: string;
  candidateId: string;
  jobId: string;
  recruiterId: string;
  engineDecisionId: string;
  timestamp: Date;

  // Décision finale
  finalDecision: 'retained' | 'rejected' | 'pending';

  // Accord avec le moteur
  engineAgreement: 'yes' | 'no' | 'partial';

  // Facteur déterminant
  determiningFactor: 
    | 'technical_skill'
    | 'sector_experience'
    | 'soft_skills'
    | 'culture_fit'
    | 'compensation'
    | 'availability'
    | 'other';

  // Si "other", précision requise
  otherFactor?: string;

  // Élément le plus utile
  mostUsefulElement: string;
  // Ce que le moteur a bien vu

  // Élément manquant
  missingElement: string;
  // Ce que le moteur n'a pas vu

  // Commentaire libre
  comment?: string; // 200 caractères max

  // Métadonnées
  context: {
    sector?: string;
    companySize?: string;
    jobType?: string;
    seniority?: string;
  };
}
```

---

## 4. Champs du Feedback

### 4.1 Décision Finale

**Champ :** `finalDecision`

**Valeurs possibles :**
- `retained` : Candidat retenu pour le poste
- `rejected` : Candidat refusé pour le poste
- `pending` : Décision en attente (candidat en réserve)

**Règles :**
- Obligatoire
- Doit correspondre à la décision réelle du recruteur
- Ne peut pas être modifié après enregistrement

### 4.2 Accord avec le Moteur

**Champ :** `engineAgreement`

**Valeurs possibles :**
- `yes` : Le recruteur est d'accord avec la recommandation du moteur
- `no` : Le recruteur n'est pas d'accord avec la recommandation du moteur
- `partial` : Le recruteur est partiellement d'accord

**Règles :**
- Obligatoire
- Basé sur la comparaison entre la décision du recruteur et la recommandation du moteur
- Si moteur recommande "recommend" et recruteur retient → `yes`
- Si moteur recommande "recommend" et recruteur refuse → `no`
- Si moteur recommande "recommend_with_conditions" et recruteur retenu → `partial`

### 4.3 Facteur Déterminant

**Champ :** `determiningFactor`

**Valeurs possibles :**
- `technical_skill` : Compétence technique
- `sector_experience` : Expérience sectorielle
- `soft_skills` : Soft skills
- `culture_fit` : Culture fit
- `compensation` : Rémunération
- `availability` : Disponibilité
- `other` : Autre (à préciser)

**Règles :**
- Obligatoire
- Identifie le facteur principal qui a influencé la décision
- Si `other`, le champ `otherFactor` doit être rempli
- Doit être cohérent avec la décision et le commentaire

### 4.4 Élément le Plus Utile

**Champ :** `mostUsefulElement`

**Description :** Ce que le moteur a bien vu

**Exemples :**
- "Le moteur a correctement identifié la maîtrise de Kubernetes"
- "Le moteur a bien détecté la capacité d'apprentissage rapide"
- "L'analyse des écarts transférables était pertinente"

**Règles :**
- Obligatoire
- Doit identifier un élément positif de l'analyse du moteur
- Permet de renforcer les comportements corrects du moteur

### 4.5 Élément Manquant

**Champ :** `missingElement`

**Description :** Ce que le moteur n'a pas vu

**Exemples :**
- "Le moteur n'a pas détecté l'incohérence chronologique"
- "Le moteur a sous-estimé l'importance de l'expérience sectorielle"
- "Le moteur n'a pas identifié le manque de soft skills"

**Règles :**
- Obligatoire
- Doit identifier un élément que le moteur aurait dû voir
- Permet de corriger les comportements incorrects du moteur

### 4.6 Commentaire Libre

**Champ :** `comment`

**Description :** Commentaire optionnel pour fournir du contexte additionnel

**Règles :**
- Optionnel
- Maximum 200 caractères
- Permet d'ajouter de la nuance non capturée par les autres champs

---

## 5. Processus de Collecte

### 5.1 Moment de Collecte

Le feedback doit être collecté :

- **Immédiatement après la décision** : Dans les 24 heures suivant la décision
- **Avant l'entretien suivant** : Pour éviter l'oubli
- **De préférence le jour même** : Pour maximiser la précision du souvenir

### 5.2 Méthodes de Collecte

#### 5.2.1 Via l'Interface Utilisateur

**Flux :**
1. Le recruteur prend une décision sur un candidat
2. Le système affiche le formulaire de feedback
3. Le recruteur remplit les champs obligatoires
4. Le système valide le feedback
5. Le feedback est enregistré

**Avantages :**
- Contexte immédiat
- Facilité d'utilisation
- Validation en temps réel

#### 5.2.2 Via l'API

**Endpoint :**
```
POST /api/learning/feedback
```

**Body :**
```json
{
  "candidateId": "...",
  "jobId": "...",
  "engineDecisionId": "...",
  "finalDecision": "retained",
  "engineAgreement": "yes",
  "determiningFactor": "technical_skill",
  "mostUsefulElement": "Le moteur a correctement identifié la maîtrise de Kubernetes",
  "missingElement": "Le moteur n'a pas détecté l'incohérence chronologique",
  "comment": "Candidat très pertinent pour le poste"
}
```

**Response :**
```json
{
  "id": "...",
  "status": "recorded",
  "timestamp": "2026-08-03T14:30:45.123Z"
}
```

---

## 6. Validation du Feedback

### 6.1 Validation de Format

Le système valide le feedback avant enregistrement :

```typescript
function validateFeedback(feedback: RecruiterFeedback): ValidationResult {
  const errors: string[] = [];

  // Champs obligatoires
  if (!feedback.finalDecision) errors.push("Décision finale manquante");
  if (!feedback.engineAgreement) errors.push("Accord moteur manquant");
  if (!feedback.determiningFactor) errors.push("Facteur déterminant manquant");
  if (!feedback.mostUsefulElement) errors.push("Élément le plus utile manquant");
  if (!feedback.missingElement) errors.push("Élément manquant manquant");

  // Cohérence
  if (feedback.determiningFactor === 'other' && !feedback.otherFactor) {
    errors.push("Précision requise pour facteur 'other'");
  }

  // Longueur du commentaire
  if (feedback.comment && feedback.comment.length > 200) {
    errors.push("Commentaire trop long (max 200 caractères)");
  }

  // Accord avec la décision
  const engineDecision = getEngineDecision(feedback.engineDecisionId);
  if (engineDecision && !isAgreementConsistent(feedback, engineDecision)) {
    errors.push("Incohérence entre accord et décision");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### 6.2 Validation de Cohérence

Le système vérifie la cohérence entre les champs :

- Si `engineAgreement = 'yes'` et `finalDecision = 'rejected'` → Incohérence possible
- Si `determiningFactor = 'compensation'` et `mostUsefulElement` mentionne les compétences → Incohérence possible
- Si `missingElement` contredit `mostUsefulElement` → Incohérence possible

### 6.3 Alertes de Qualité

Le système génère des alertes si :

- **Feedback contradictoire** : Accord et décision incohérents
- **Feedback vague** : Commentaire trop générique
- **Feedback incomplet** : Champs optionnels non remplis dans des cas complexes
- **Feedback atypique** : Pattern inhabituel à surveiller

---

## 7. Stockage du Feedback

### 7.1 Structure de Base de Données

```sql
CREATE TABLE recruiter_feedback (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  engine_decision_id VARCHAR(36) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  final_decision VARCHAR(20) NOT NULL,
  engine_agreement VARCHAR(20) NOT NULL,
  determining_factor VARCHAR(50) NOT NULL,
  other_factor VARCHAR(100),
  most_useful_element TEXT NOT NULL,
  missing_element TEXT NOT NULL,
  comment TEXT,
  
  context_sector VARCHAR(50),
  context_company_size VARCHAR(50),
  context_job_type VARCHAR(50),
  context_seniority VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 7.2 Indexation

```sql
CREATE INDEX idx_feedback_timestamp ON recruiter_feedback(timestamp);
CREATE INDEX idx_feedback_candidate ON recruiter_feedback(candidate_id);
CREATE INDEX idx_feedback_job ON recruiter_feedback(job_id);
CREATE INDEX idx_feedback_recruiter ON recruiter_feedback(recruiter_id);
CREATE INDEX idx_feedback_decision ON recruiter_feedback(final_decision);
CREATE INDEX idx_feedback_agreement ON recruiter_feedback(engine_agreement);
CREATE INDEX idx_feedback_factor ON recruiter_feedback(determining_factor);
```

---

## 8. Exemples de Feedback

### 8.1 Exemple : Accord Positif

```json
{
  "finalDecision": "retained",
  "engineAgreement": "yes",
  "determiningFactor": "technical_skill",
  "mostUsefulElement": "Le moteur a correctement identifié la maîtrise de Kubernetes et Docker",
  "missingElement": "Aucun élément manquant significatif",
  "comment": "Candidat très pertinent pour le poste DevOps"
}
```

### 8.2 Exemple : Accord Partiel

```json
{
  "finalDecision": "retained",
  "engineAgreement": "partial",
  "determiningFactor": "soft_skills",
  "mostUsefulElement": "Le moteur a bien détecté la capacité d'apprentissage rapide",
  "missingElement": "Le moteur a sous-estimé l'importance des soft skills pour ce poste",
  "comment": "Compétences techniques conformes mais soft skills déterminantes"
}
```

### 8.3 Exemple : Désaccord

```json
{
  "finalDecision": "retained",
  "engineAgreement": "no",
  "determiningFactor": "sector_experience",
  "mostUsefulElement": "L'analyse des compétences techniques était pertinente",
  "missingElement": "Le moteur n'a pas détecté l'importance de l'expérience sectorielle Fintech",
  "comment": "Expérience Fintech déterminante malgré compétences techniques parfaites"
}
```

### 8.4 Exemple : Refus

```json
{
  "finalDecision": "rejected",
  "engineAgreement": "yes",
  "determiningFactor": "compensation",
  "mostUsefulElement": "Le moteur a correctement identifié l'écart sur les compétences critiques",
  "missingElement": "Aucun élément manquant",
  "comment": "Candidat surqualifié pour le budget alloué"
}
```

---

## 9. Interface Utilisateur

### 9.1 Formulaire de Feedback

**Layout :**

```
┌─────────────────────────────────────────┐
│ FEEDBACK SUR LA DÉCISION                │
├─────────────────────────────────────────┤
│                                         │
│ Décision finale :                        │
│ ○ Retenu  ○ Refusé  ○ En attente        │
│                                         │
│ Accord avec le moteur :                 │
│ ○ Oui  ○ Non  ○ Partiel                │
│                                         │
│ Facteur déterminant :                   │
│ ○ Compétence technique                  │
│ ○ Expérience sectorielle               │
│ ○ Soft skills                          │
│ ○ Culture fit                          │
│ ○ Rémunération                         │
│ ○ Disponibilité                        │
│ ○ Autre : [________________]           │
│                                         │
│ Ce que le moteur a bien vu :            │
│ [_____________________________]           │
│                                         │
│ Ce que le moteur n'a pas vu :          │
│ [_____________________________]           │
│                                         │
│ Commentaire (optionnel, max 200 car.) :│
│ [_____________________________]           │
│                                         │
│ [Annuler]              [Enregistrer]    │
└─────────────────────────────────────────┘
```

### 9.2 Règles d'Affichage

- **Champs obligatoires** : Marqués d'un astérisque (*)
- **Validation en temps réel** : Messages d'erreur immédiats
- **Auto-complétion** : Pour les champs textuels basés sur les feedbacks précédents
- **Sauvegarde automatique** : Brouillon sauvegardé toutes les 30 secondes

---

## 10. Rappels et Notifications

### 10.1 Rappel Automatique

Le système envoie un rappel si le feedback n'est pas fourni dans les 24 heures :

**Canal :** Email + Notification in-app

**Contenu :**
```
Feedback requis pour [Candidat] - [Poste]

Vous avez pris une décision sur ce candidat mais n'avez pas encore
fourni votre feedback structuré. Ce feedback est essentiel pour
l'amélioration continue du moteur de raisonnement.

[Button: Fournir le feedback]
```

### 10.2 Notification de Confirmation

Après enregistrement du feedback :

```
Feedback enregistré avec succès

Votre feedback sur [Candidat] - [Poste] a été enregistré.
Merci de contribuer à l'amélioration du système.
```

---

## 11. Analyse et Agrégation

### 11.1 Agrégation par Recruteur

Le système agrège les feedbacks par recruteur pour détecter les patterns :

```typescript
interface RecruiterFeedbackSummary {
  recruiterId: string;
  totalFeedbacks: number;
  agreementRate: number;
  mostCommonDeterminingFactor: string;
  mostCommonMissingElement: string;
  averageSatisfaction: number;
}
```

### 11.2 Agrégation par Contexte

Le système agrège les feedbacks par contexte (secteur, taille entreprise, type de poste) :

```typescript
interface ContextFeedbackSummary {
  context: {
    sector?: string;
    companySize?: string;
    jobType?: string;
  };
  totalFeedbacks: number;
  agreementRate: number;
  commonDeterminingFactors: Record<string, number>;
  commonMissingElements: Record<string, number>;
}
```

### 11.3 Agrégation Temporelle

Le système agrège les feedbacks par période pour suivre les tendances :

```typescript
interface TemporalFeedbackSummary {
  period: {
    from: Date;
    to: Date;
  };
  totalFeedbacks: number;
  agreementRate: number;
  determiningFactorDistribution: Record<string, number>;
  missingElementDistribution: Record<string, number>;
}
```

---

## 12. Qualité du Feedback

### 12.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétude | Feedbacks avec tous les champs obligatoires / total | ≥ 95% |
| Taux de cohérence | Feedbacks cohérents / total | ≥ 90% |
| Longueur moyenne des commentaires | Caractères moyens | ≥ 50 |
| Taux de feedbacks avec commentaire | Feedbacks avec commentaire / total | ≥ 60% |
| Temps moyen de collecte | Temps entre décision et feedback | < 24h |

### 12.2 Surveillance de la Qualité

Le système surveille la qualité du feedback et génère des alertes si :

- Taux de complétude < 90%
- Taux de cohérence < 85%
- Taux de feedbacks avec commentaire < 50%
- Temps moyen de collecte > 48h

---

## 13. Intégration avec MVP-007

### 13.1 Association avec la Décision du Moteur

Chaque feedback est associé à la décision du moteur correspondante :

```typescript
interface EngineDecision {
  id: string;
  candidateId: string;
  jobId: string;
  recommendation: 'recommend' | 'not_recommend' | 'recommend_with_conditions' | 'insufficient_data';
  confidence: 'high' | 'medium' | 'low';
  justification: string[];
  timestamp: Date;
}
```

### 13.2 Calcul de l'Accord

Le système calcule l'accord entre la décision du moteur et la décision du recruteur :

```typescript
function calculateAgreement(engineDecision: EngineDecision, feedback: RecruiterFeedback): 'yes' | 'no' | 'partial' {
  const engineRecommendation = engineDecision.recommendation;
  const recruiterDecision = feedback.finalDecision;

  if (engineRecommendation === 'recommend' && recruiterDecision === 'retained') {
    return 'yes';
  }

  if (engineRecommendation === 'not_recommend' && recruiterDecision === 'rejected') {
    return 'yes';
  }

  if (engineRecommendation === 'recommend_with_conditions' && recruiterDecision === 'retained') {
    return 'partial';
  }

  if (engineRecommendation === 'recommend' && recruiterDecision === 'rejected') {
    return 'no';
  }

  if (engineRecommendation === 'not_recommend' && recruiterDecision === 'retained') {
    return 'no';
  }

  return 'partial';
}
```

---

## 14. Maintenance

### 14.1 Maintenance du Formulaire

Le formulaire de feedback doit être maintenu :

- **Mise à jour des options** : Lors de l'ajout de nouveaux facteurs déterminants
- **Optimisation de l'UX** : Amélioration continue de l'interface
- **Surveillance de l'utilisation** : Monitoring des taux de complétude

### 14.2 Maintenance de la Base de Données

La base de données de feedback doit être maintenue :

- **Nettoyage périodique** : Suppression des données de test
- **Archivage** : Archivage des feedbacks anciens (> 2 ans)
- **Optimisation** : Optimisation des requêtes

---

## 15. Conclusion

Le protocole de feedback structuré garantit :

- **Qualité** des données d'apprentissage
- **Contexte** riche pour l'apprentissage
- **Cohérence** des feedbacks
- **Traçabilité** des décisions humaines
- **Actionabilité** pour l'amélioration du moteur
- **Satisfaction** des recruteurs (processus simple)
