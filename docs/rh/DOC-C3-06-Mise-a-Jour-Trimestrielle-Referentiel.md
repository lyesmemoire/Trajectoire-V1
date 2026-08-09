# DOC-C3-06 : Mise à Jour Trimestrielle du Référentiel

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de mise à jour trimestrielle du référentiel de connaissances légales pour le Correctif 3 Legal Knowledge Validation. Ce document structure la fréquence des mises à jour, les sources d'information, le processus de mise à jour, et les critères de validation.

---

## 2. Principe Fondateur

Le droit du travail évolue régulièrement. Le référentiel de connaissances légales doit être mis à jour trimestriellement pour refléter les évolutions légales, jurisprudentielles et réglementaires. Une mise à jour tardive ou incomplète expose l'entreprise à des risques juridiques.

---

## 3. Fréquence de Mise à Jour

### 3.1 Calendrier Trimestriel

**Trimestre 1 (Janvier-Mars) :**
- Mise à jour : 15 janvier
- Sources : Lois de fin d'année, décrets d'application

**Trimestre 2 (Avril-Juin) :**
- Mise à jour : 15 avril
- Sources : Jurisprudence Q1, arrêtés ministériels

**Trimestre 3 (Juillet-Septembre) :**
- Mise à jour : 15 juillet
- Sources : Lois d'été, directives européennes

**Trimestre 4 (Octobre-Décembre) :**
- Mise à jour : 15 octobre
- Sources : Jurisprudence Q3, réformes sociales

### 3.2 Mises à Jour Exceptionnelles

**Déclencheurs :**
- Loi majeure promulguée
- Jurisprudence fondamentale
- Directive européenne transposée
- Crise sanitaire ou économique majeure

**Délai :**
- Maximum 30 jours après publication officielle

---

## 4. Sources d'Information

### 4.1 Sources Officielles

**Législation :**
- Legifrance (https://www.legifrance.gouv.fr)
- Journal Officiel
- Site du Ministère du Travail

**Jurisprudence :**
- Cour de cassation (chambre sociale)
- Cour d'appel
- Conseil d'État

**Réglementation :**
- Décrets
- Arrêtés ministériels
- Circulaires

### 4.2 Sources Professionnelles

**Revues juridiques :**
- Droit Social
- Semaine Sociale Lamy
- Actualité du Droit du Travail

**Organismes :**
- DREETS
- Inspection du Travail
- OPCO

**Veille juridique :**
- Abonnements à des services de veille
- Newsletters juridiques
- Alertes automatiques

---

## 5. Processus de Mise à Jour

### 5.1 Phase 1 — Collecte des Évolutions

**Actions :**
- Consulter les sources officielles
- Identifier les nouvelles lois, décrets, arrêtés
- Identifier la jurisprudence nouvelle
- Identifier les directives européennes

**Responsable :**
- Juridique interne ou externe

**Délai :**
- 5 jours ouvrés

### 5.2 Phase 2 — Analyse d'Impact

**Actions :**
- Analyser l'impact sur chaque domaine légal
- Identifier les éléments à modifier
- Identifier les éléments à ajouter
- Identifier les éléments à supprimer

**Responsable :**
- Juridique interne ou externe

**Délai :**
- 5 jours ouvrés

### 5.3 Phase 3 — Mise à Jour du Référentiel

**Actions :**
- Modifier les éléments existants
- Ajouter les nouveaux éléments
- Supprimer les éléments obsolètes
- Mettre à jour les checklists

**Responsable :**
- Équipe produit + Juridique

**Délai :**
- 3 jours ouvrés

### 5.4 Phase 4 — Mise à Jour des Cas Pratiques

**Actions :**
- Modifier les cas pratiques affectés
- Ajouter de nouveaux cas pratiques si nécessaire
- Mettre à jour les questions de creusage
- Mettre à jour les critères d'évaluation

**Responsable :**
- Équipe produit

**Délai :**
- 3 jours ouvrés

### 5.5 Phase 5 — Validation

**Actions :**
- Validation juridique
- Validation technique
- Validation produit
- Approbation finale

**Responsable :**
- DRH + Juridique + Produit

**Délai :**
- 2 jours ouvrés

### 5.6 Phase 6 — Déploiement

**Actions :**
- Mise en production
- Communication aux utilisateurs
- Formation si nécessaire
- Suivi post-déploiement

**Responsable :**
- Équipe technique

**Délai :**
- 2 jours ouvrés

---

## 6. Critères de Validation

### 6.1 Critères Juridiques

**Exactitude :**
- Les informations juridiques doivent être exactes
- Les références légales doivent être à jour
- Les interprétations doivent être conformes à la jurisprudence

**Complétude :**
- Tous les éléments impactés doivent être mis à jour
- Aucun élément obsolète ne doit rester
- Les nouveaux éléments doivent être intégrés

### 6.2 Critères Techniques

**Cohérence :**
- Les modifications doivent être cohérentes avec l'existant
- Les structures de données doivent être respectées
- Les API endpoints doivent fonctionner

**Performance :**
- Les performances ne doivent pas être dégradées
- Les temps de réponse doivent être maintenus

### 6.3 Critères Produit

**Pertinence :**
- Les modifications doivent être pertinentes pour les utilisateurs
- Les cas pratiques doivent rester réalistes
- Les questions de creusage doivent rester efficaces

**Clarté :**
- Les modifications doivent être clairement documentées
- Les changements doivent être communiqués

---

## 7. Documentation des Mises à Jour

### 7.1 Journal des Modifications

**Informations consignées :**
- Date de la mise à jour
- Version précédente
- Version nouvelle
- Éléments modifiés
- Éléments ajoutés
- Éléments supprimés
- Motif de la modification
- Source de la modification

### 7.2 Rapport de Mise à Jour

**Structure :**
- Résumé exécutif
- Évolutions légales identifiées
- Impact sur le référentiel
- Modifications effectuées
- Tests effectués
- Recommandations

### 7.3 Communication aux Utilisateurs

**Contenu :**
- Nature des modifications
- Impact sur l'utilisation
- Actions requises (si nécessaire)
- Date d'application

---

## 8. Structure de Données (TypeScript)

```typescript
interface ReferenceUpdate {
  updateId: string;
  
  updateDate: Date;
  previousVersion: string;
  newVersion: string;
  
  legalEvolutions: {
    laws: {
      lawId: string;
      name: string;
      publicationDate: Date;
      impact: string;
    }[];
    jurisprudence: {
      caseId: string;
      name: string;
      decisionDate: Date;
      impact: string;
    }[];
    decrees: {
      decreeId: string;
      name: string;
      publicationDate: Date;
      impact: string;
    }[];
    directives: {
      directiveId: string;
      name: string;
      publicationDate: Date;
      impact: string;
    }[];
  };
  
  modifications: {
    modified: {
      elementId: string;
      previousContent: string;
      newContent: string;
      reason: string;
    }[];
    added: {
      elementId: string;
      content: string;
      reason: string;
    }[];
    removed: {
      elementId: string;
      content: string;
      reason: string;
    }[];
  };
  
  validation: {
    juridical: {
      validatedBy: string;
      validatedAt: Date;
      status: 'approved' | 'rejected' | 'pending';
      comments: string;
    };
    technical: {
      validatedBy: string;
      validatedAt: Date;
      status: 'approved' | 'rejected' | 'pending';
      comments: string;
    };
    product: {
      validatedBy: string;
      validatedAt: Date;
      status: 'approved' | 'rejected' | 'pending';
      comments: string;
    };
  };
  
  deployment: {
    deployedAt: Date;
    deployedBy: string;
    status: 'success' | 'failure';
    rollback: boolean;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface QuarterlyUpdateProtocol {
  protocolId: string;
  
  schedule: {
    quarterly: {
      q1: {
        updateDate: string;
        sources: string[];
      };
      q2: {
        updateDate: string;
        sources: string[];
      };
      q3: {
        updateDate: string;
        sources: string[];
      };
      q4: {
        updateDate: string;
        sources: string[];
      };
    };
    exceptional: {
      triggers: string[];
      maxDelay: number;
    };
  };
  
  sources: {
    official: {
      name: string[];
      url: string[];
    };
    professional: {
      name: string[];
      url: string[];
    };
    legalWatch: {
      name: string[];
      url: string[];
    };
  };
  
  process: {
    phase1: {
      name: string;
      actions: string[];
      responsible: string[];
      duration: string;
    };
    phase2: {
      name: string;
      actions: string[];
      responsible: string[];
      duration: string;
    };
    phase3: {
      name: string;
      actions: string[];
      responsible: string[];
      duration: string;
    };
    phase4: {
      name: string;
      actions: string[];
      responsible: string[];
      duration: string;
    };
    phase5: {
      name: string;
      actions: string[];
      responsible: string[];
      duration: string;
    };
    phase6: {
      name: string;
      actions: string[];
      responsible: string[];
      duration: string;
    };
  };
  
  validationCriteria: {
    juridical: {
      accuracy: string;
      completeness: string;
    };
    technical: {
      coherence: string;
      performance: string;
    };
    product: {
      relevance: string;
      clarity: string;
    };
  };
  
  documentation: {
    modificationLog: string[];
    updateReport: {
      structure: string[];
    };
    userCommunication: {
      content: string[];
    };
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE reference_update (
  id VARCHAR(36) PRIMARY KEY,
  
  update_date TIMESTAMP NOT NULL,
  previous_version VARCHAR(20) NOT NULL,
  new_version VARCHAR(20) NOT NULL,
  
  legal_evolutions JSON NOT NULL,
  modifications JSON NOT NULL,
  validation JSON NOT NULL,
  deployment JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_reference_update_date ON reference_update(update_date);

CREATE TABLE quarterly_update_protocol (
  id VARCHAR(36) PRIMARY KEY,
  
  schedule JSON NOT NULL,
  sources JSON NOT NULL,
  process JSON NOT NULL,
  validation_criteria JSON NOT NULL,
  documentation JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 10. API Endpoints

```typescript
// POST /api/legal-knowledge/reference/update
async function updateReference(update: ReferenceUpdate): Promise<ReferenceUpdate> {
  return await updateReference(update);
}

// GET /api/legal-knowledge/reference/update/:updateId
async function getReferenceUpdate(updateId: string): Promise<ReferenceUpdate> {
  return await getReferenceUpdateById(updateId);
}

// GET /api/legal-knowledge/reference/updates
async function getReferenceUpdates(): Promise<ReferenceUpdate[]> {
  return await getReferenceUpdates();
}

// GET /api/legal-knowledge/reference/current-version
async function getCurrentReferenceVersion(): Promise<string> {
  return await getCurrentReferenceVersion();
}

// GET /api/legal-knowledge/update-protocol
async function getUpdateProtocol(): Promise<QuarterlyUpdateProtocol> {
  return await getUpdateProtocol();
}

// PUT /api/legal-knowledge/update-protocol
async function updateUpdateProtocol(protocol: QuarterlyUpdateProtocol): Promise<QuarterlyUpdateProtocol> {
  return await updateUpdateProtocol(protocol);
}

// POST /api/legal-knowledge/reference/collect-evolutions
async function collectLegalEvolutions(): Promise<any> {
  return await collectLegalEvolutions();
}

// POST /api/legal-knowledge/reference/analyze-impact
async function analyzeImpact(evolutions: any): Promise<any> {
  return await analyzeImpact(evolutions);
}

// POST /api/legal-knowledge/reference/validate-update
async function validateUpdate(update: ReferenceUpdate): Promise<any> {
  return await validateUpdate(update);
}

// POST /api/legal-knowledge/reference/deploy-update
async function deployUpdate(updateId: string): Promise<any> {
  return await deployUpdate(updateId);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Mise à Jour

| Métrique | Description | Cible |
|----------|-------------|-------|
| Fréquence de mise à jour | Intervalle entre mises à jour | Trimestrielle |
- Latence de mise à jour | Délai entre changement légal et mise à jour | ≤ 30 jours |
- Complétude des mises à jour | % d'éléments mis à jour | 100% |

### 11.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Exactitude juridique | % d'informations exactes | 100% |
- Taux d'erreurs | Erreurs détectées / total | 0% |
- Taux de rollback | Rollbacks / déploiements | ≤ 5% |

---

## 12. Conclusion

Le protocole de mise à jour trimestrielle du référentiel structure le processus de maintien à jour des connaissances légales. Calendrier trimestriel : 15 janvier, 15 avril, 15 juillet, 15 octobre. Mises à jour exceptionnelles dans les 30 jours suivant une évolution majeure. Sources officielles (Legifrance, Journal Officiel, Ministère du Travail) et professionnelles (revues juridiques, organismes, veille juridique). Processus en 6 phases : collecte des évolutions (5 jours), analyse d'impact (5 jours), mise à jour du référentiel (3 jours), mise à jour des cas pratiques (3 jours), validation (2 jours), déploiement (2 jours). Critères de validation : juridiques (exactitude, complétude), techniques (cohérence, performance), produit (pertinence, clarté). Documentation des mises à jour avec journal des modifications, rapport de mise à jour, communication aux utilisateurs.

**Points clés :**
- Calendrier trimestriel (15 jan, 15 avr, 15 juil, 15 oct)
- Mises à jour exceptionnelles (30 jours max)
- Sources officielles et professionnelles
- Processus 6 phases (collecte, analyse, mise à jour, cas pratiques, validation, déploiement)
- Critères de validation (juridique, technique, produit)
- Documentation (journal, rapport, communication)
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la mise à jour
- Métriques de mise à jour et de qualité
