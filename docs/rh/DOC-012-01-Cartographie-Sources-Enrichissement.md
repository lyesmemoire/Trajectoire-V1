# DOC-012-01 : Cartographie des Sources d'Enrichissement

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la cartographie complète des sources d'enrichissement du Knowledge Pack RH pour MVP-012. Cette cartographie identifie toutes les sources de données externes utilisées pour enrichir continuellement la base de connaissances.

---

## 2. Principe Fondateur

Un CV dit "développeur fullstack React/Node". Le moteur ne fait pas le lien avec "ingénieur JavaScript" → Matching raté → Candidat écarté à tort → DRH perd confiance → Le moteur n'est pas adopté.

**Solution :** Enrichissement continu du Knowledge Pack avec des sources officielles et terrain pour garantir une couverture maximale des termes et relations.

---

## 3. État Actuel vs Cible

### 3.1 État Actuel (Estimé)

| Catégorie | Quantité | Source |
|-----------|----------|--------|
| Métiers couverts | ~50 | Manuel |
| Compétences indexées | ~200 | Manuel |
| Certifications connues | ~30 | Manuel |
| Relations entre concepts | ~100 | Manuel |
| Synonymes gérés | ~50 | Manuel |

### 3.2 Cible MVP Crédible

| Catégorie | Quantité | Source |
|-----------|----------|--------|
| Métiers couverts | 500+ | ROME 4.0 |
| Compétences indexées | 5000+ | ESCO v1.1 |
| Certifications connues | 200+ | RNCP/RS + OPCO |
| Diplômes reconnus | 100+ | RNCP/RS |
| Relations entre concepts | 10000+ | ESCO v1.1 + ROME 4.0 |
| Synonymes gérés | 3000+ | Terrain + Sources |

---

## 4. Sources d'Enrichissement

### 4.1 SOURCE 1 — ROME 4.0 (France Travail)

**Description :** Répertoire Opérationnel des Métiers et des Emplois  
**Organisation :** France Travail  
**Priorité :** Haute  
**Responsable :** DRH référent

**Contenu :**
- 531 fiches métier officielles
- Compétences associées par métier
- Niveaux de qualification
- Appellations et synonymes
- Relations entre métiers

**Format :**
- API publique
- Export CSV/JSON
- Documentation officielle

**Fréquence de mise à jour :** Trimestrielle

**Accès :**
- URL : https://www.francetravail.fr/romes
- API : https://api.francetravail.fr/romes
- Documentation : https://doc.francetravail.fr/romes

**Données clés :**
```typescript
interface ROMEJob {
  code: string;
  title: string;
  appellations: string[];
  synonyms: string[];
  definition: string;
  competencies: {
    savoirFaire: string[];
    savoirEtre: string[];
  };
  qualifications: string[];
  relatedJobs: string[];
}
```

**Intégration :**
- Import automatique via API
- Mapping avec KP-001 (Métiers)
- Extraction des synonymes
- Extraction des relations entre métiers

---

### 4.2 SOURCE 2 — ESCO v1.1 (Commission Européenne)

**Description :** European Skills, Competences, Qualifications and Occupations  
**Organisation :** Commission Européenne  
**Priorité :** Haute  
**Responsable :** DRH référent

**Contenu :**
- 13890 compétences référencées
- Hiérarchie des compétences
- Relations entre compétences
- Traductions multilingues (français, anglais, allemand, etc.)

**Format :**
- API publique
- Export CSV/JSON/XML
- Documentation officielle

**Fréquence de mise à jour :** Semestrielle

**Accès :**
- URL : https://ec.europa.eu/esco/portal
- API : https://ec.europa.eu/esco/api
- Documentation : https://ec.europa.eu/esco/api/doc

**Données clés :**
```typescript
interface ESCOSkill {
  uri: string;
  prefLabel: {
    fr: string;
    en: string;
  };
  altLabels: {
    fr: string[];
    en: string[];
  };
  description: {
    fr: string;
    en: string;
  };
  skillType: 'skill' | 'knowledge' | 'competence';
  broaderSkills: string[];
  narrowerSkills: string[];
  relatedSkills: string[];
}
```

**Intégration :**
- Import automatique via API
- Mapping avec KP-002 (Compétences)
- Extraction des synonymes multilingues
- Extraction des relations hiérarchiques

---

### 4.3 SOURCE 3 — RNCP / RS (France Compétences)

**Description :** Répertoire National des Certifications Professionnelles / Répertoire Spécifique  
**Organisation :** France Compétences  
**Priorité :** Haute  
**Responsable :** Référent Formation

**Contenu :**
- Certifications professionnelles
- Niveaux de qualification (1 à 8)
- Blocs de compétences
- Équivalences reconnues
- Diplômes professionnels

**Format :**
- API publique
- Export CSV/JSON
- Documentation officielle

**Fréquence de mise à jour :** Mensuelle

**Accès :**
- URL : https://www.francecompetences.fr
- API : https://api.francecompetences.fr
- Documentation : https://doc.francecompetences.fr/api

**Données clés :**
```typescript
interface RNCP Certification {
  code: string;
  title: string;
  level: number; // 1-8
  blocks: {
    code: string;
    title: string;
    competencies: string[];
  }[];
  equivalences: string[];
  relatedCertifications: string[];
}
```

**Intégration :**
- Import automatique via API
- Mapping avec KP-002 (Certifications)
- Extraction des relations entre certifications
- Validation des niveaux de qualification

---

### 4.4 SOURCE 4 — Référentiels OPCO par Secteur

**Description :** Référentiels sectoriels des Organismes Paritaires Collecteurs Agréés  
**Organisation :** OPCO (multiple)  
**Priorité :** Moyenne  
**Responsable :** DRH référent secteur

**Contenu :**
- Compétences sectorielles spécifiques
- Certifications sectorielles
- Diplômes professionnels
- Normes sectorielles

**Secteurs couverts :**
- OPCO 2i (Informatique)
- OPCO Construction
- OPCO Commerce
- OPCO Industrie
- OPCO Santé
- OPCO Services

**Format :**
- Export CSV/Excel
- Documentation sectorielle
- Contact direct avec OPCO

**Fréquence de mise à jour :** Annuelle

**Accès :**
- URL : Sites OPCO individuels
- Contact : Direct avec OPCO

**Données clés :**
```typescript
interface OPCOReference {
  sector: string;
  certifications: {
    code: string;
    title: string;
    skills: string[];
  }[];
  diplomas: {
    code: string;
    title: string;
    level: number;
  }[];
  norms: string[];
}
```

**Intégration :**
- Import manuel ou semi-automatique
- Mapping avec KP-002 (Certifications sectorielles)
- Validation par DRH référent secteur

---

### 4.5 SOURCE 5 — Synonymes Terrain

**Description :** Synonymes issus des feedbacks beta recruteurs  
**Organisation :** Trajectoire  
**Priorité :** Haute (ROI immédiat)  
**Responsable :** Équipe beta

**Contenu :**
- Termes réels utilisés dans les CV
- Termes réels utilisés dans les offres
- Formulations alternatives
- Jargon métier

**Source :**
- Feedbacks beta recruteurs (MVP-011)
- CV analysés pendant le beta
- Offres d'emploi analysées
- Entretiens avec recruteurs

**Format :**
- Extraction manuelle
- Validation croisée
- Documentation dans registre

**Fréquence de mise à jour :** Continue (mensuelle)

**Accès :**
- Interne (feedbacks beta)
- Interne (CV analysés)
- Interne (offres analysées)

**Données clés :**
```typescript
interface TerrainSynonym {
  term: string;
  canonical: string;
  source: 'cv' | 'offer' | 'recruiter_feedback';
  context: string;
  validation: 'pending' | 'validated' | 'rejected';
  validatedBy: string;
  validationDate: Date;
}
```

**Intégration :**
- Extraction manuelle des feedbacks
- Validation croisée obligatoire
- Injection dans KP-002 (Synonymes)
- Documentation dans registre (DOC-012-07)

---

## 5. Cartographie des Sources

### 5.1 Vue d'Ensemble

```
┌─────────────────────────────────────────┐
│ CARTOGRAPHIE DES SOURCES              │
├─────────────────────────────────────────┤
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ SOURCES OFFICIELLES                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ [HAUTE] ROME 4.0 (France Travail)       │
│ → 531 métiers                          │
│ → Compétences par métier               │
│ → Synonymes                            │
│ → Relations métiers                    │
│                                         │
│ [HAUTE] ESCO v1.1 (Commission UE)      │
│ → 13890 compétences                    │
│ → Hiérarchie compétences              │
│ → Synonymes multilingues               │
│ → Relations compétences                │
│                                         │
│ [HAUTE] RNCP/RS (France Compétences)   │
│ → Certifications professionnelles        │
│ → Niveaux de qualification              │
│ → Blocs de compétences                 │
│ → Équivalences                         │
│                                         │
│ [MOYENNE] Référentiels OPCO            │
│ → Compétences sectorielles            │
│ → Certifications sectorielles          │
│ → Diplômes professionnels               │
│ → Normes sectorielles                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ SOURCES TERRAIN                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ [HAUTE] Synonymes terrain               │
│ → Termes CV réels                      │
│ → Termes offres réels                  │
│ → Feedbacks recruteurs                  │
│ → Jargon métier                        │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 Mapping avec Knowledge Pack

| Source | KP Cible | Type de données | Priorité |
|--------|----------|----------------|----------|
| ROME 4.0 | KP-001 (Métiers) | Métiers, synonymes, relations | Haute |
| ESCO v1.1 | KP-002 (Compétences) | Compétences, synonymes, hiérarchie | Haute |
| RNCP/RS | KP-002 (Certifications) | Certifications, diplômes, équivalences | Haute |
| OPCO | KP-002 (Certifications) | Certifications sectorielles, diplômes | Moyenne |
| Synonymes terrain | KP-002 (Synonymes) | Synonymes, jargon métier | Haute |

---

## 6. Processus d'Intégration

### 6.1 Flux d'Intégration

```
Source externe
    ↓
Acquisition (API / Export)
    ↓
Extraction des données
    ↓
Qualification (doublons, pertinence)
    ↓
Mapping avec Knowledge Pack
    ↓
Validation (DRH référent)
    ↓
Test (golden dataset)
    ↓
Déploiement
    ↓
Traçabilité
```

### 6.2 Algorithme d'Intégration

```typescript
async function integrateSource(source: Source): Promise<IntegrationResult> {
  // Étape 1 : Acquisition
  const rawData = await acquireData(source);
  
  // Étape 2 : Extraction
  const extractedData = extractData(rawData, source.type);
  
  // Étape 3 : Qualification
  const qualifiedData = await qualifyData(extractedData);
  
  // Étape 4 : Mapping
  const mappedData = mapToKnowledgePack(qualifiedData, source.targetKP);
  
  // Étape 5 : Validation
  const validationResult = await validateData(mappedData);
  
  if (!validationResult.valid) {
    return { success: false, errors: validationResult.errors };
  }
  
  // Étape 6 : Test
  const testResult = await testData(mappedData);
  
  if (!testResult.passed) {
    return { success: false, errors: testResult.errors };
  }
  
  // Étape 7 : Déploiement
  await deployData(mappedData);
  
  // Étape 8 : Traçabilité
  await logIntegration(source, mappedData);
  
  return { success: true, recordsIntegrated: mappedData.length };
}
```

---

## 7. Responsabilités

### 7.1 DRH Référent

**Responsabilités :**
- Validation des données ROME 4.0
- Validation des données ESCO v1.1
- Validation des données OPCO
- Revue mensuelle des enrichissements

**Compétences requises :**
- Connaissance du marché RH
- Expertise en classification des métiers
- Capacité d'analyse critique

### 7.2 Référent Formation

**Responsabilités :**
- Validation des données RNCP/RS
- Validation des certifications
- Validation des équivalences
- Revue mensuelle des enrichissements

**Compétences requises :**
- Connaissance du système de formation français
- Expertise en certifications professionnelles
- Capacité d'analyse critique

### 7.3 Équipe Beta

**Responsabilités :**
- Extraction des synonymes terrain
- Validation croisée des synonymes
- Documentation des termes réels
- Revue mensuelle des enrichissements

**Compétences requises :**
- Capacité d'analyse de feedback
- Attention aux détails
- Capacité de documentation

---

## 8. Fréquence de Mise à Jour

| Source | Fréquence | Type de mise à jour |
|--------|-----------|---------------------|
| ROME 4.0 | Trimestrielle | Automatique via API |
| ESCO v1.1 | Semestrielle | Automatique via API |
| RNCP/RS | Mensuelle | Automatique via API |
| OPCO | Annuelle | Manuel / Semi-automatique |
| Synonymes terrain | Mensuelle | Manuel |

---

## 9. Indicateurs de Suivi

### 9.1 Métriques d'Intégration

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'intégration réussie | Intégrations réussies / total | ≥ 95% |
| Taux d'erreur | Erreurs / total intégrations | ≤ 5% |
| Temps d'intégration | Temps moyen d'intégration | < 24h |
| Taux de validation | Validations réussies / total | 100% |

### 9.2 Métriques de Couverture

| Métrique | État actuel | Cible MVP |
|----------|-------------|-----------|
| Métiers couverts | ~50 | 500+ |
| Compétences indexées | ~200 | 5000+ |
| Certifications connues | ~30 | 200+ |
| Diplômes reconnus | ~10 | 100+ |
| Relations entre concepts | ~100 | 10000+ |
| Synonymes gérés | ~50 | 3000+ |

---

## 10. Risques et Atténuation

### 10.1 Risques

| Risque | Impact | Probabilité | Atténuation |
|--------|--------|-------------|-------------|
| Indisponibilité de l'API | Élevé | Moyenne | Cache local, fallback manuel |
| Données incohérentes | Élevé | Faible | Validation croisée, DRH référent |
| Doublons | Moyen | Élevée | Algorithme de déduplication |
| Synonymes invalides | Moyen | Moyenne | Validation croisée obligatoire |
| Changement de format API | Moyen | Faible | Monitoring, versioning |

### 10.2 Atténuation

**Indisponibilité de l'API :**
- Cache local des données
- Fallback manuel
- Monitoring de disponibilité

**Données incohérentes :**
- Validation croisée entre sources
- Revue par DRH référent
- Test sur golden dataset

**Doublons :**
- Algorithme de déduplication
- Fuzzy matching
- Validation manuelle

**Synonymes invalides :**
- Validation croisée obligatoire
- Documentation dans registre
- Revue mensuelle

---

## 11. Documentation et Traçabilité

### 11.1 Journalisation des Intégrations

```sql
CREATE TABLE enrichment_integration_log (
  id VARCHAR(36) PRIMARY KEY,
  source_id VARCHAR(50) NOT NULL,
  integration_date TIMESTAMP NOT NULL,
  
  records_acquired INT NOT NULL,
  records_qualified INT NOT NULL,
  records_integrated INT NOT NULL,
  
  validation_status VARCHAR(20) NOT NULL,
  test_status VARCHAR(20) NOT NULL,
  
  errors JSON,
  warnings JSON,
  
  performed_by VARCHAR(36) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_enrich_source ON enrichment_integration_log(source_id);
CREATE INDEX idx_enrich_date ON enrichment_integration_log(integration_date);
```

### 11.2 Traçabilité des Données

Chaque donnée enrichie est traçable :

```typescript
interface DataTraceability {
  sourceId: string;
  sourceType: 'rome' | 'esco' | 'rncp' | 'opco' | 'terrain';
  acquisitionDate: Date;
  integrationDate: Date;
  validatedBy: string;
  validationDate: Date;
  version: string;
}
```

---

## 12. Conclusion

La cartographie des sources d'enrichissement identifie 5 sources principales pour enrichir continuellement le Knowledge Pack RH. Cette cartographie garantit une couverture maximale des termes et relations pour améliorer la qualité du matching.

**Points clés :**
- 5 sources identifiées (3 officielles, 1 sectorielle, 1 terrain)
- Priorité haute pour ROME 4.0, ESCO v1.1, RNCP/RS, Synonymes terrain
- Processus d'intégration structuré
- Responsabilités clairement définies
- Fréquence de mise à jour définie
- Indicateurs de suivi
- Gestion des risques
