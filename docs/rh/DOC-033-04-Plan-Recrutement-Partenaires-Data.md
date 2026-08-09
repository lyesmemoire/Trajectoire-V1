# DOC-033-04 : Plan de Recrutement des Partenaires Data

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le plan de recrutement des partenaires data pour MVP-033 Real Data Foundation. Ce plan structure l'approche pour identifier, contacter, et convaincre les partenaires (cabinets de recrutement, entreprises beta) de partager leurs données en échange de l'accès au moteur en beta.

---

## 2. Principe Fondateur

Le recrutement des partenaires data est un processus structuré qui nécessite une approche ciblée, une proposition de valeur claire, et un suivi rigoureux. Chaque partenaire est stratégique et doit être traité avec professionnalisme et transparence.

---

## 3. Cibles Prioritaires

### 3.1 Cabinets de Recrutement

**Profil cible :**
- Cabinets de taille moyenne (10-50 consultants)
- Spécialisés dans les secteurs technologiques, financiers, ou industriels
- Avec une base de données de recrutements historiques
- Ouverts à l'innovation et aux partenariats

**Cible initiale :** 3 à 5 cabinets

**Valeur pour le partenaire :**
- Accès beta gratuit au moteur cognitif RH
- Rapport personnalisé sur leurs patterns de recrutement
- Benchmark sectoriel exclusif
- Avantage concurrentiel

---

### 3.2 Entreprises Beta

**Profil cible :**
- Entreprises de taille moyenne (100-1000 employés)
- Avec une activité de recrutement significative
- Déjà engagées dans des programmes beta (réf. MVP-011)
- Avec une culture data et innovation

**Cible initiale :** 5 entreprises

**Valeur pour le partenaire :**
- Accès beta gratuit au moteur cognitif RH
- Analyse approfondie de leurs recrutements
- Identification des patterns de succès et d'échec
- Amélioration de la qualité des embauches

---

## 4. Processus de Recrutement

### 4.1 Étape 1 — Identification des Cibles

**Critères de sélection :**
- Volume de recrutements annuels ≥ 50
- Données historiques disponibles ≥ 3 ans
- Résultats à 12 mois traçables
- Culture data et innovation
- Compatibilité sectorielle

**Sources d'identification :**
- Réseau professionnel (LinkedIn, Viadeo)
- Salons et événements RH
- Références d'autres partenaires
- Recherche sectorielle ciblée

**Score de priorité :**
```
Score = (Volume × 0.3) + (Historique × 0.25) + (Traçabilité × 0.25) + (Innovation × 0.2)
```

---

### 4.2 Étape 2 — Approche Initiale

**Canal d'approche :**
- Email personnalisé (préféré)
- LinkedIn (alternative)
- Introduction par un contact commun (idéal)

**Template d'email :**
```
Objet : Partenariat data - Moteur cognitif RH Trajectoire

Bonjour [Nom],

Je suis [Votre nom], [Votre fonction] chez Trajectoire.

Nous développons un moteur cognitif RH qui utilise l'IA pour assister
les décisions de recrutement. Notre approche est différente :
nous construisons l'intelligence du moteur à partir de données réelles,
pas de théorie.

Nous recherchons des partenaires data pour partager des données
anonymisées de recrutement en échange d'un accès beta gratuit
au moteur et de rapports personnalisés sur leurs patterns.

[Type de partenaire] comme le vôtre serait idéal pour ce partenariat
car [raison spécifique : volume de recrutements, données historiques, etc.].

Seriez-vous disponible pour un échange de 30 minutes pour en discuter ?

Cordialement,
[Votre nom]
[Votre fonction]
Trajectoire
```

---

### 4.3 Étape 3 — Premier Contact

**Objectif de l'appel :**
- Présenter Trajectoire et le moteur cognitif RH
- Expliquer le partenariat data
- Comprendre les besoins et les contraintes du partenaire
- Identifier les synergies

**Structure de l'appel :**
1. Introduction (5 minutes)
   - Présentation de Trajectoire
   - Présentation du moteur cognitif RH
   - Contexte du partenariat data

2. Proposition de valeur (10 minutes)
   - Ce que nous apportons
   - Ce que nous demandons
   - Avantages mutuels

3. Discussion (10 minutes)
   - Questions du partenaire
   - Besoins spécifiques
   - Contraintes et préoccupations

4. Prochaines étapes (5 minutes)
   - Envoi du contrat de partage de données
   - Calendrier de mise en œuvre
   - Point de contact

---

### 4.4 Étape 4 — Négociation

**Points clés à négocier :**
- Volume minimum de données
- Fréquence de partage
- Durée du contrat
- Contreparties spécifiques
- Conditions de confidentialité

**Flexibilité :**
- Volume minimum ajustable selon la taille du partenaire
- Fréquence de partage adaptable (mensuelle, trimestrielle)
- Durée du contrat négociable (1-3 ans)
- Contreparties personnalisables

---

### 4.5 Étape 5 — Signature du Contrat

**Processus :**
1. Envoi du contrat de partage de données (réf. DOC-033-02)
2. Revue juridique par le partenaire
3. Révisions si nécessaires
4. Signature des deux parties
5. Début effectif du partenariat

**Délai cible :** 4 semaines du premier contact à la signature

---

### 4.6 Étape 6 — Onboarding du Partenaire

**Processus d'onboarding :**
1. Configuration de l'accès au moteur beta
2. Formation à l'utilisation du moteur
3. Configuration du pipeline de données
4. Premier transfert de données
5. Validation de l'anonymisation
6. Premier rapport personnalisé

**Délai cible :** 2 semaines de la signature à l'onboarding complet

---

## 5. Structure de Données (TypeScript)

```typescript
interface DataPartner {
  partnerId: string;
  partnerNumber: string;
  
  type: 'recruitment_cabinet' | 'beta_company';
  
  profile: {
    name: string;
    address: string;
    siren: string;
    website: string;
    sector: string;
    size: string;
    annualRecruitmentVolume: number;
    historicalDataYears: number;
    traceability12Months: boolean;
    innovationCulture: number; // 1-5
  };
  
  contact: {
    primaryContact: {
      name: string;
      role: string;
      email: string;
      phone: string;
      linkedin?: string;
    };
    secondaryContact?: {
      name: string;
      role: string;
      email: string;
      phone: string;
    };
  };
  
  recruitment: {
    source: string;
    approachDate: Date;
    firstContactDate?: Date;
    negotiationStartDate?: Date;
    contractSentDate?: Date;
    signedDate?: Date;
    onboardingStartDate?: Date;
    onboardingCompletedDate?: Date;
  };
  
  score: {
    priorityScore: number;
    volumeScore: number;
    historicalScore: number;
    traceabilityScore: number;
    innovationScore: number;
  };
  
  contract?: {
    contractId: string;
    contractNumber: string;
    signedAt: Date;
    effectiveFrom: Date;
    effectiveTo: Date;
    terms: any;
  };
  
  status: 'identified' | 'contacted' | 'negotiating' | 'contract_sent' | 'signed' | 'onboarding' | 'active' | 'inactive';
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    notes: string[];
  };
}

interface RecruitmentPipeline {
  pipelineId: string;
  version: string;
  createdAt: Date;
  
  targets: {
    recruitmentCabinets: {
      target: number;
      contacted: number;
      negotiating: number;
      signed: number;
      active: number;
    };
    betaCompanies: {
      target: number;
      contacted: number;
      negotiating: number;
      signed: number;
      active: number;
    };
  };
  
  timeline: {
    phase1: {
      name: 'Identification';
      startDate: Date;
      endDate: Date;
      target: number;
      achieved: number;
    };
    phase2: {
      name: 'Approche';
      startDate: Date;
      endDate: Date;
      target: number;
      achieved: number;
    };
    phase3: {
      name: 'Négociation';
      startDate: Date;
      endDate: Date;
      target: number;
      achieved: number;
    };
    phase4: {
      name: 'Signature';
      startDate: Date;
      endDate: Date;
      target: number;
      achieved: number;
    };
    phase5: {
      name: 'Onboarding';
      startDate: Date;
      endDate: Date;
      target: number;
      achieved: number;
    };
  };
  
  metrics: {
    conversionRate: number;
    averageTimeToSign: number;
    averageTimeToOnboard: number;
  };
  
  metadata: {
    lastUpdated: Date;
    status: 'active' | 'completed';
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE data_partner (
  id VARCHAR(36) PRIMARY KEY,
  partner_number VARCHAR(50) NOT NULL UNIQUE,
  
  type VARCHAR(50) NOT NULL CHECK (type IN ('recruitment_cabinet', 'beta_company')),
  
  profile JSON NOT NULL,
  contact JSON NOT NULL,
  recruitment JSON NOT NULL,
  score JSON NOT NULL,
  contract JSON,
  status VARCHAR(20) NOT NULL CHECK (status IN ('identified', 'contacted', 'negotiating', 'contract_sent', 'signed', 'onboarding', 'active', 'inactive')),
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_data_partner_type ON data_partner(type);
CREATE INDEX idx_data_partner_status ON data_partner(status);
CREATE INDEX idx_data_partner_score ON data_partner((score->>'$.priorityScore'));

CREATE TABLE recruitment_pipeline (
  id VARCHAR(36) PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  
  targets JSON NOT NULL,
  timeline JSON NOT NULL,
  metrics JSON NOT NULL,
  metadata JSON NOT NULL,
  
  UNIQUE KEY idx_recruitment_pipeline_version (version)
);
```

---

## 7. API Endpoints

```typescript
// POST /api/data/partners
async function addDataPartner(partner: DataPartner): Promise<DataPartner> {
  return await addDataPartner(partner);
}

// GET /api/data/partners
async function getDataPartners(status?: string, type?: string): Promise<DataPartner[]> {
  return await getDataPartners(status, type);
}

// GET /api/data/partners/:partnerId
async function getDataPartner(partnerId: string): Promise<DataPartner> {
  return await getDataPartnerById(partnerId);
}

// PUT /api/data/partners/:partnerId/status
async function updatePartnerStatus(partnerId: string, status: string): Promise<DataPartner> {
  return await updatePartnerStatus(partnerId, status);
}

// PUT /api/data/partners/:partnerId/contract
async function linkContract(partnerId: string, contractId: string): Promise<DataPartner> {
  return await linkContract(partnerId, contractId);
}

// GET /api/data/recruitment/pipeline
async function getRecruitmentPipeline(): Promise<RecruitmentPipeline> {
  return await getRecruitmentPipeline();
}

// PUT /api/data/recruitment/pipeline/metrics
async function updatePipelineMetrics(): Promise<RecruitmentPipeline> {
  return await updatePipelineMetrics();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Recrutement

| Métrique | Description | Cible Phase 1 | Cible Phase 2 |
|----------|-------------|---------------|---------------|
| Taux de contact | Contactés / identifiés | ≥ 50% | ≥ 70% |
- Taux de réponse | Réponses / contactés | ≥ 40% | ≥ 50% |
- Taux de négociation | Négociations / réponses | ≥ 60% | ≥ 70% |
- Taux de signature | Signés / négociations | ≥ 50% | ≥ 60% |

### 8.2 Métriques de Temps

| Métrique | Description | Cible |
|----------|-------------|-------|
| Temps moyen jusqu'au contact | Jours de l'identification au premier contact | ≤ 7 jours |
- Temps moyen jusqu'à la signature | Jours du premier contact à la signature | ≤ 30 jours |
- Temps moyen jusqu'à l'onboarding | Jours de la signature à l'onboarding | ≤ 14 jours |

### 8.3 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Score moyen des partenaires | Score moyen de priorité | ≥ 4.0/5 |
- Taux de rétention | Partenaires actifs / signés | ≥ 80% |
- Satisfaction des partenaires | Satisfaction moyenne | ≥ 4.5/5 |

---

## 9. Conclusion

Le plan de recrutement des partenaires data structure l'approche pour identifier, contacter, et convaincre les partenaires de partager leurs données. Le processus en 6 étapes (identification, approche, premier contact, négociation, signature, onboarding) avec des critères de sélection clairs, des templates d'approche, et des métriques de suivi permet d'atteindre les cibles de 3 à 5 cabinets et 5 entreprises beta.

**Points clés :**
- 2 types de cibles (cabinets, entreprises)
- Processus en 6 étapes structuré
- Template d'email d'approche
- Structure d'appel de premier contact
- Flexibilité dans la négociation
- Processus d'onboarding défini
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de recrutement, temps, et qualité
- Pipeline de recrutement structuré
