# DOC-M08-01 : Protocole de Suivi des Candidats Refusés

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de suivi des candidats refusés pour le MVP-META-08 Error Learning Engine. Ce document structure le processus de suivi à 6 et 12 mois pour détecter les faux négatifs (candidats refusés à tort).

---

## 2. Principe Fondateur

Le suivi des candidats refusés permet d'identifier les faux négatifs (candidats qui auraient dû être recrutés) en analysant leur évolution professionnelle après le refus. Ce suivi nécessite le consentement du candidat.

---

## 3. Processus de Suivi

### 3.1 Étape 1 — Demande de Consentement

**Moment de la demande :**
- Lors de la notification de refus
- Par email ou message personnalisé

**Contenu de la demande :**
- Explication de l'objectif : Améliorer le processus de recrutement
- Type de suivi : Suivi à 6 et 12 mois
- Confidentialité : Données anonymisées et utilisées uniquement en interne
- Option de retrait : Possibilité de retirer le consentement à tout moment

**Réponse du candidat :**
- Consentement explicite : Oui / Non
- Si non : Aucun suivi
- Si oui : Procéder au suivi

---

### 3.2 Étape 2 — Suivi à 6 Mois

**Questions posées :**
- A-t-il trouvé un poste ?
- Quel type de poste ?
- Quel niveau ?
- Quelle entreprise (type) ?

**Sources d'information :**
- Réseau professionnel des recruteurs
- LinkedIn (évolution publique)
- Feedback volontaire du candidat
- Retours des cabinets partenaires

**Enregistrement des données :**
- Statut d'emploi
- Type de poste
- Niveau hiérarchique
- Type d'entreprise
- Source d'information

---

### 3.3 Étape 3 — Suivi à 12 Mois

**Questions posées :**
- Comment se passe son poste ?
- Performance apparente (LinkedIn, réseau, retour direct)
- Évolution depuis le refus ?

**Sources d'information :**
- Réseau professionnel des recruteurs
- LinkedIn (évolution publique)
- Feedback volontaire du candidat
- Retours des cabinets partenaires

**Enregistrement des données :**
- Satisfaction du poste
- Performance apparente
- Évolution de carrière
- Promotions ou changements

---

## 4. Sources d'Information

### 4.1 Réseau Professionnel des Recruteurs

**Type d'information :**
- Informations informelles
- Retours directs
- Observations du marché

**Fréquence de collecte :**
- Continue
- Opportuniste

---

### 4.2 LinkedIn (Évolution Publique)

**Type d'information :**
- Changements de poste
- Promotions
- Recommendations
- Activité professionnelle

**Fréquence de collecte :**
- Automatisée (mensuelle)
- Manuelle (si nécessaire)

---

### 4.3 Feedback Volontaire du Candidat

**Type d'information :**
- Réponses directes aux questions
- Feedback sur le processus
- Suggestions d'amélioration

**Fréquence de collecte :**
- À 6 mois
- À 12 mois

---

### 4.4 Retours des Cabinets Partenaires

**Type d'information :**
- Placement du candidat
- Performance observée
- Feedback du client

**Fréquence de collecte :**
- Continue
- Sur demande

---

## 5. Structure de Données (TypeScript)

```typescript
interface RejectedCandidateFollowUp {
  followUpId: string;
  recruitmentId: string;
  candidateId: string;
  
  consent: {
    given: boolean;
    givenAt: Date;
    withdrawnAt?: Date;
  };
  
  sixMonthFollowUp: {
    completed: boolean;
    completedAt?: Date;
    foundPosition: boolean;
    positionType?: string;
    positionLevel?: string;
    companyType?: string;
    dataSource: 'recruiter_network' | 'linkedin' | 'candidate_feedback' | 'partner_cabinet';
  };
  
  twelveMonthFollowUp: {
    completed: boolean;
    completedAt?: Date;
    positionSatisfaction?: 'satisfied' | 'neutral' | 'dissatisfied';
    performanceApparent?: 'high' | 'medium' | 'low';
    careerEvolution?: string;
    dataSource: 'recruiter_network' | 'linkedin' | 'candidate_feedback' | 'partner_cabinet';
  };
  
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
CREATE TABLE rejected_candidate_follow_up (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  consent_given BOOLEAN NOT NULL,
  consent_given_at TIMESTAMP NOT NULL,
  consent_withdrawn_at TIMESTAMP NULL,
  
  six_month_follow_up_completed BOOLEAN DEFAULT FALSE,
  six_month_follow_up_completed_at TIMESTAMP NULL,
  six_month_found_position BOOLEAN NULL,
  six_month_position_type VARCHAR(100) NULL,
  six_month_position_level VARCHAR(100) NULL,
  six_month_company_type VARCHAR(100) NULL,
  six_month_data_source VARCHAR(50) NULL,
  
  twelve_month_follow_up_completed BOOLEAN DEFAULT FALSE,
  twelve_month_follow_up_completed_at TIMESTAMP NULL,
  twelve_month_position_satisfaction VARCHAR(20) NULL,
  twelve_month_performance_apparent VARCHAR(20) NULL,
  twelve_month_career_evolution TEXT NULL,
  twelve_month_data_source VARCHAR(50) NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_rejected_follow_up_recruitment ON rejected_candidate_follow_up(recruitment_id);
CREATE INDEX idx_rejected_follow_up_candidate ON rejected_candidate_follow_up(candidate_id);
CREATE INDEX idx_rejected_follow_up_consent ON rejected_candidate_follow_up(consent_given);
```

---

## 7. API Endpoints

```typescript
// POST /api/rejected-candidates/request-consent
async function requestConsent(recruitmentId: string): Promise<void> {
  return await requestConsent(recruitmentId);
}

// PUT /api/rejected-candidates/:followUpId/consent
async function recordConsent(followUpId: string, consent: boolean): Promise<RejectedCandidateFollowUp> {
  return await recordConsent(followUpId, consent);
}

// POST /api/rejected-candidates/:followUpId/six-month
async function recordSixMonthFollowUp(followUpId: string, data: any): Promise<RejectedCandidateFollowUp> {
  return await recordSixMonthFollowUp(followUpId, data);
}

// POST /api/rejected-candidates/:followUpId/twelve-month
async function recordTwelveMonthFollowUp(followUpId: string, data: any): Promise<RejectedCandidateFollowUp> {
  return await recordTwelveMonthFollowUp(followUpId, data);
}

// GET /api/rejected-candidates/:followUpId
async function getRejectedCandidateFollowUp(followUpId: string): Promise<RejectedCandidateFollowUp> {
  return await getRejectedCandidateFollowUp(followUpId);
}

// GET /api/rejected-candidates/pending-six-month
async function getPendingSixMonthFollowUps(): Promise<RejectedCandidateFollowUp[]> {
  return await getPendingSixMonthFollowUps();
}

// GET /api/rejected-candidates/pending-twelve-month
async function getPendingTwelveMonthFollowUps(): Promise<RejectedCandidateFollowUp[]> {
  return await getPendingTwelveMonthFollowUps();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Processus

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de consentement | Consentements donnés / demandes | ≥ 40% |
- Taux de complétion 6 mois | Follow-ups 6 mois complétés / éligibles | ≥ 80% |
- Taux de complétion 12 mois | Follow-ups 12 mois complétés / éligibles | ≥ 70% |

### 8.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de faux négatifs détectés | Faux négatifs / candidats refusés suivis | ≥ 5% |
- Taux de données exploitables | Données exploitables / totales | ≥ 90% |

---

## 9. Exemple Complet

```markdown
SUIVI CANDIDAT REFUSÉ — 6 MOIS

Candidat : [Anonymisé]
Recrutement : REC-2026-001
Consentement : Oui (2026-02-01)

Suivi à 6 mois (2026-08-01) :
→ A trouvé un poste : Oui
→ Type de poste : Senior Developer
→ Niveau : N+1
→ Type d'entreprise : Startup tech
→ Source d'information : LinkedIn

Suivi à 12 mois (2027-02-01) :
→ Satisfaction du poste : Satisfait
→ Performance apparente : Haute
→ Évolution de carrière : Promotion à Team Lead
→ Source d'information : Feedback candidat

Analyse : Succès remarquable → Faux négatif potentiel
```

---

## 10. Conclusion

Le protocole de suivi des candidats refusés structure le processus de suivi à 6 et 12 mois pour détecter les faux négatifs. Processus en 3 étapes : Demande de consentement (lors du refus), Suivi à 6 mois (statut d'emploi, type de poste, niveau, entreprise), Suivi à 12 mois (satisfaction, performance, évolution). 4 sources d'information : Réseau professionnel des recruteurs, LinkedIn, Feedback volontaire du candidat, Retours des cabinets partenaires. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Consentement obligatoire
- Suivi à 6 et 12 mois
- 4 sources d'information
- Détection des faux négatifs
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de processus et de qualité
