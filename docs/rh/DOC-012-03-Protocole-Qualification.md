# DOC-012-03 : Protocole de Qualification

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de qualification pour l'enrichissement du Knowledge Pack RH (MVP-012). Ce protocole couvre la Semaine 2 du cycle mensuel : vérification de la pertinence des entrées, résolution des doublons, et création des relations manquantes.

---

## 2. Principe Fondateur

La qualification des données acquises est critique pour garantir la qualité du Knowledge Pack. Sans qualification, des données incohérentes ou des doublons peuvent dégrader la qualité du matching.

---

## 3. Calendrier Mensuel

### 3.1 Semaine 2 : Qualification

| Jour | Activité | Responsable |
|-----|----------|-------------|
| Lundi | Réception du rapport d'acquisition | DRH référent |
| Mardi | Vérification de la pertinence des entrées | DRH référent |
| Mercredi | Résolution des doublons | Équipe technique + DRH référent |
| Jeudi | Création des relations manquantes | Équipe technique + DRH référent |
| Vendredi | Validation du rapport de qualification | DRH référent |

---

## 4. Processus de Qualification

### 4.1 Flux de Qualification

```
Données acquises
    ↓
Vérification de la pertinence
    ↓
Résolution des doublons
    ↓
Création des relations manquantes
    ↓
Mapping avec Knowledge Pack
    ↓
Validation DRH référent
    ↓
Transmission à l'équipe de validation
```

### 4.2 Algorithme de Qualification

```typescript
async function qualifyData(acquisitionReport: AcquisitionReport): Promise<QualificationResult> {
  // Étape 1 : Vérification de la pertinence
  const relevantData = await verifyRelevance(acquisitionReport.newEntries);
  
  // Étape 2 : Résolution des doublons
  const deduplicatedData = await resolveDuplicates(relevantData);
  
  // Étape 3 : Création des relations manquantes
  const enrichedData = await createMissingRelations(deduplicatedData);
  
  // Étape 4 : Mapping avec Knowledge Pack
  const mappedData = await mapToKnowledgePack(enrichedData);
  
  // Étape 5 : Validation DRH référent
  const validationResult = await validateWithDRH(mappedData);
  
  if (!validationResult.valid) {
    return { success: false, errors: validationResult.errors };
  }
  
  // Étape 6 : Transmission à l'équipe de validation
  await transmitToValidationTeam({
    qualifiedData: mappedData,
    validationResult
  });
  
  // Étape 7 : Documentation
  await documentQualification(mappedData);
  
  return {
    success: true,
    qualifiedEntriesCount: mappedData.length,
    duplicatesResolved: relevantData.length - deduplicatedData.length,
    relationsCreated: enrichedData.relationsCount
  };
}
```

---

## 5. Vérification de la Pertinence

### 5.1 Critères de Pertinence

| Critère | Description | Action |
|---------|-------------|--------|
| Pertinence RH | L'entrée est-elle pertinente pour le domaine RH ? | Conserver / Rejeter |
| Complétude | L'entrée est-elle complète (tous les champs requis) ? | Compléter / Rejeter |
| Validité | L'entrée est-elle valide (format, valeurs) ? | Corriger / Rejeter |
| Actualité | L'entrée est-elle à jour (pas obsolète) ? | Conserver / Rejeter |
| Cohérence | L'entrée est-elle cohérente avec les autres données ? | Conserver / Rejeter |

### 5.2 Algorithme de Vérification

```typescript
async function verifyRelevance(entries: any[]): Promise<any[]> {
  const relevantEntries = [];
  
  for (const entry of entries) {
    const relevanceCheck = await checkRelevance(entry);
    
    if (relevanceCheck.isRelevant) {
      // Vérifier la complétude
      const completenessCheck = await checkCompleteness(entry);
      
      if (completenessCheck.isComplete) {
        // Vérifier la validité
        const validityCheck = await checkValidity(entry);
        
        if (validityCheck.isValid) {
          // Vérifier l'actualité
          const currencyCheck = await checkCurrency(entry);
          
          if (currencyCheck.isCurrent) {
            // Vérifier la cohérence
            const coherenceCheck = await checkCoherence(entry);
            
            if (coherenceCheck.isCoherent) {
              relevantEntries.push(entry);
            } else {
              await logRejection(entry, 'incoherent');
            }
          } else {
            await logRejection(entry, 'obsolete');
          }
        } else {
          // Tenter de corriger
          const correctedEntry = await correctEntry(entry, validityCheck.errors);
          if (correctedEntry) {
            relevantEntries.push(correctedEntry);
          } else {
            await logRejection(entry, 'invalid');
          }
        }
      } else {
        // Tenter de compléter
        const completedEntry = await completeEntry(entry, completenessCheck.missingFields);
        if (completedEntry) {
          relevantEntries.push(completedEntry);
        } else {
          await logRejection(entry, 'incomplete');
        }
      }
    } else {
      await logRejection(entry, 'irrelevant');
    }
  }
  
  return relevantEntries;
}
```

### 5.3 Grille de Vérification

```
┌─────────────────────────────────────────┐
│ GRILLE DE VÉRIFICATION                │
├─────────────────────────────────────────┤
│                                         │
| Entrée : [ID]                          │
| Type : [Métier / Compétence / Certification / Synonyme]│
| Source : [ROME / ESCO / RNCP / OPCO / Terrain]│
│                                         │
| Critères :                             │
│                                         │
| Pertinence RH :                        │
| ○ Pertinent                           │
| ○ Non pertinent → Rejet                │
| Justification : [____]                 │
│                                         │
| Complétude :                           │
| ○ Complet                             │
| ○ Incomplet → Compléter / Rejet        │
| Champs manquants : [____]              │
|                                         │
| Validité :                             │
| ○ Valide                              │
| ○ Invalide → Corriger / Rejet          │
| Erreurs : [____]                       │
│                                         │
| Actualité :                            │
| ○ À jour                              │
| ○ Obsolète → Rejet                    │
| Justification : [____]                 │
│                                         │
| Cohérence :                            │
| ○ Cohérent                            │
| ○ Incohérent → Rejet                  │
| Justification : [____]                 │
│                                         │
| Décision :                             │
| ○ Conserver                           │
| ○ Rejeter                             │
│                                         │
| Validé par : [Nom]                     │
| Date : [DD/MM/YYYY]                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. Résolution des Doublons

### 6.1 Types de Doublons

| Type | Description | Exemple |
|------|-------------|---------|
| Exact | Entrées identiques | "Développeur React" et "Développeur React" |
| Fuzzy | Entrées similaires | "Développeur React" et "Dev React" |
| Synonyme | Entrées synonymes | "Développeur React" et "React Developer" |
| Traduction | Entrées traduites | "Développeur React" et "React Developer" |

### 6.2 Algorithme de Déduplication

```typescript
async function resolveDuplicates(entries: any[]): Promise<any[]> {
  const deduplicatedEntries = [];
  const seen = new Map();
  
  for (const entry of entries) {
    // Recherche de doublon exact
    const exactDuplicate = findExactDuplicate(entry, seen);
    
    if (exactDuplicate) {
      await logDuplicate(entry, exactDuplicate, 'exact');
      continue;
    }
    
    // Recherche de doublon fuzzy
    const fuzzyDuplicate = findFuzzyDuplicate(entry, seen);
    
    if (fuzzyDuplicate) {
      const similarity = calculateSimilarity(entry, fuzzyDuplicate);
      
      if (similarity > 0.9) {
        // Fusion des entrées
        const mergedEntry = mergeEntries(entry, fuzzyDuplicate);
        seen.set(mergedEntry.id, mergedEntry);
        deduplicatedEntries.push(mergedEntry);
        await logMerge(entry, fuzzyDuplicate, mergedEntry);
        continue;
      }
    }
    
    // Recherche de synonyme
    const synonym = findSynonym(entry, seen);
    
    if (synonym) {
      // Ajout comme synonyme
      await addSynonym(entry, synonym);
      seen.set(synonym.id, synonym);
      continue;
    }
    
    // Pas de doublon, conserver
    seen.set(entry.id, entry);
    deduplicatedEntries.push(entry);
  }
  
  return deduplicatedEntries;
}

function findExactDuplicate(entry: any, seen: Map<string, any>): any | null {
  for (const [id, existing] of seen) {
    if (deepEqual(entry, existing)) {
      return existing;
    }
  }
  return null;
}

function findFuzzyDuplicate(entry: any, seen: Map<string, any>): any | null {
  for (const [id, existing] of seen) {
    const similarity = calculateSimilarity(entry, existing);
    if (similarity > 0.8) {
      return existing;
    }
  }
  return null;
}

function calculateSimilarity(entry1: any, entry2: any): number {
  // Similarité de Levenshtein pour les textes
  const textSimilarity = levenshteinSimilarity(entry1.title, entry2.title);
  
  // Similarité pour les autres champs
  const fieldSimilarity = compareFields(entry1, entry2);
  
  // Moyenne pondérée
  return (textSimilarity * 0.7) + (fieldSimilarity * 0.3);
}

function mergeEntries(entry1: any, entry2: any): any {
  return {
    id: entry1.id,
    title: entry1.title,
    description: mergeDescriptions(entry1.description, entry2.description),
    synonyms: [...new Set([...entry1.synonyms, ...entry2.synonyms])],
    relations: [...new Set([...entry1.relations, ...entry2.relations])],
    sources: [...new Set([...entry1.sources, ...entry2.sources])]
  };
}
```

### 6.3 Rapport de Déduplication

```typescript
interface DeduplicationReport {
  totalEntries: number;
  duplicatesFound: number;
  exactDuplicates: number;
  fuzzyDuplicates: number;
  synonyms: number;
  merges: number;
  finalEntries: number;
  reductionRate: number;
}
```

---

## 7. Création des Relations Manquantes

### 7.1 Types de Relations

| Type | Description | Exemple |
|------|-------------|---------|
| Hiérarchique | Relation parent-enfant | "Compétence" → "Compétence technique" |
| Associative | Relation entre concepts | "React" → "JavaScript" |
| Synonyme | Relation de synonymie | "Développeur" ↔ "Dev" |
| Traduction | Relation de traduction | "Développeur" ↔ "Developer" |

### 7.2 Algorithme de Création de Relations

```typescript
async function createMissingRelations(entries: any[]): Promise<any[]> {
  const enrichedEntries = [...entries];
  
  for (const entry of entries) {
    // Recherche de relations hiérarchiques
    const hierarchicalRelations = await findHierarchicalRelations(entry);
    entry.relations.push(...hierarchicalRelations);
    
    // Recherche de relations associatives
    const associativeRelations = await findAssociativeRelations(entry);
    entry.relations.push(...associativeRelations);
    
    // Recherche de synonymes
    const synonymRelations = await findSynonymRelations(entry);
    entry.synonyms.push(...synonymRelations);
    
    // Recherche de traductions
    const translationRelations = await findTranslationRelations(entry);
    entry.translations.push(...translationRelations);
  }
  
  enrichedEntries.relationsCount = enrichedEntries.reduce((sum, e) => sum + e.relations.length, 0);
  
  return enrichedEntries;
}

async function findHierarchicalRelations(entry: any): Promise<Relation[]> {
  const relations: Relation[] = [];
  
  // Recherche dans ESCO (hiérarchie des compétences)
  if (entry.source === 'ESCO') {
    const broaderSkills = await getBroaderSkills(entry.id);
    for (const broader of broaderSkills) {
      relations.push({
        type: 'hierarchical',
        target: broader.id,
        direction: 'child_to_parent'
      });
    }
    
    const narrowerSkills = await getNarrowerSkills(entry.id);
    for (const narrower of narrowerSkills) {
      relations.push({
        type: 'hierarchical',
        target: narrower.id,
        direction: 'parent_to_child'
      });
    }
  }
  
  return relations;
}

async function findAssociativeRelations(entry: any): Promise<Relation[]> {
  const relations: Relation[] = [];
  
  // Recherche basée sur les compétences communes
  const relatedEntries = await findRelatedBySkills(entry.skills);
  for (const related of relatedEntries) {
    relations.push({
      type: 'associative',
      target: related.id,
      strength: calculateRelationStrength(entry, related)
    });
  }
  
  return relations;
}
```

### 7.3 Rapport de Relations

```typescript
interface RelationsReport {
  totalEntries: number;
  hierarchicalRelationsCreated: number;
  associativeRelationsCreated: number;
  synonymRelationsCreated: number;
  translationRelationsCreated: number;
  totalRelationsCreated: number;
  averageRelationsPerEntry: number;
}
```

---

## 8. Mapping avec Knowledge Pack

### 8.1 Mapping par Source

| Source | KP Cible | Type de mapping |
|--------|----------|----------------|
| ROME 4.0 | KP-001 (Métiers) | Direct |
| ESCO v1.1 | KP-002 (Compétences) | Direct |
| RNCP/RS | KP-002 (Certifications) | Direct |
| OPCO | KP-002 (Certifications) | Direct |
| Synonymes terrain | KP-002 (Synonymes) | Direct |

### 8.2 Algorithme de Mapping

```typescript
async function mapToKnowledgePack(entries: any[]): Promise<any[]> {
  const mappedEntries = [];
  
  for (const entry of entries) {
    const mappedEntry = await mapEntry(entry);
    mappedEntries.push(mappedEntry);
  }
  
  return mappedEntries;
}

async function mapEntry(entry: any): Promise<any> {
  switch (entry.source) {
    case 'ROME_4.0':
      return mapToKP001(entry);
    case 'ESCO_v1.1':
      return mapToKP002(entry);
    case 'RNCP_RS':
      return mapToKP002Certifications(entry);
    case 'OPCO':
      return mapToKP002Certifications(entry);
    case 'terrain':
      return mapToKP002Synonyms(entry);
    default:
      throw new Error(`Unknown source: ${entry.source}`);
  }
}

function mapToKP001(romeEntry: any): KP001Entry {
  return {
    id: `KP001-${romeEntry.code}`,
    code: romeEntry.code,
    title: romeEntry.title,
    appellations: romeEntry.appellations,
    synonyms: romeEntry.synonyms,
    definition: romeEntry.definition,
    competencies: {
      savoirFaire: romeEntry.competencies.savoirFaire,
      savoirEtre: romeEntry.competencies.savoirEtre
    },
    qualifications: romeEntry.qualifications,
    relatedJobs: romeEntry.relatedJobs,
    source: 'ROME_4.0',
    lastUpdated: new Date()
  };
}

function mapToKP002(escoEntry: any): KP002Entry {
  return {
    id: `KP002-${escoEntry.uri}`,
    uri: escoEntry.uri,
    prefLabel: escoEntry.prefLabel,
    altLabels: escoEntry.altLabels,
    description: escoEntry.description,
    skillType: escoEntry.skillType,
    broaderSkills: escoEntry.broaderSkills,
    narrowerSkills: escoEntry.narrowerSkills,
    relatedSkills: escoEntry.relatedSkills,
    source: 'ESCO_v1.1',
    lastUpdated: new Date()
  };
}
```

---

## 9. Validation DRH Référent

### 9.1 Processus de Validation

**Étape 1 :** Transmission des données qualifiées au DRH référent  
**Étape 2 :** Revue des données par le DRH référent  
**Étape 3 :** Validation ou rejet  
**Étape 4 :** Documentation de la validation

### 9.2 Grille de Validation DRH

```
┌─────────────────────────────────────────┐
│ GRILLE DE VALIDATION DRH               │
├─────────────────────────────────────────┤
│                                         │
| Lot de données : [LOT-ID]              │
| Source : [ROME / ESCO / RNCP / OPCO / Terrain]│
| Nombre d'entrées : [XXX]               │
|                                         │
| Revue :                                │
│                                         │
| Pertinence RH :                        │
| ○ Validé                              │
| ○ À corriger                          │
| ○ À rejeter                           │
| Commentaires : [____]                   │
│                                         │
| Qualité des données :                  │
| ○ Validé                              │
| ○ À améliorer                        │
| ○ À rejeter                           │
| Commentaires : [____]                   │
│                                         │
| Relations :                            │
| ○ Validées                            │
| ○ À compléter                         │
| ○ À rejeter                           │
| Commentaires : [____]                   │
│                                         │
| Mapping avec KP :                      │
| ○ Validé                              │
| ○ À corriger                          │
| ○ À rejeter                           │
| Commentaires : [____]                   │
│                                         │
| Décision finale :                      │
| ○ Valider                             │
| ○ Valider avec réserves                │
| ○ Rejeter                             │
│                                         │
| Réserves : [____]                      │
│                                         │
| Validé par : [Nom du DRH]             │
| Date : [DD/MM/YYYY]                    │
│ Signature : [________________]           │
│                                         │
└─────────────────────────────────────────┘
```

### 5.3 Rapport de Validation

```typescript
interface ValidationReport {
  lotId: string;
  source: string;
  entriesCount: number;
  
  validation: {
    relevance: 'validated' | 'to_correct' | 'to_reject';
    quality: 'validated' | 'to_improve' | 'to_reject';
    relations: 'validated' | 'to_complete' | 'to_reject';
    mapping: 'validated' | 'to_correct' | 'to_reject';
  };
  
  decision: 'validate' | 'validate_with_reservations' | 'reject';
  reservations: string[];
  
  validatedBy: string;
  validationDate: Date;
}
```

---

## 10. Transmission à l'Équipe de Validation

### 10.1 Processus de Transmission

**Étape 1 :** Génération du rapport de qualification  
**Étape 2 :** Transmission par email  
**Étape 3 :** Accusé de réception  
**Étape 4 :** Documentation

### 10.2 Email de Transmission

**Objet :** Rapport de qualification - [Mois] [Année]

**Corps :**

```
Bonjour,

Le rapport de qualification pour [Mois] [Année] est disponible.

Résumé :
- Entrées acquises : [XXX]
- Entrées qualifiées : [XXX]
- Doublons résolus : [XXX]
- Relations créées : [XXX]
- Taux de réduction : [XX]%

Le rapport complet est disponible en pièce jointe.

Merci de confirmer réception.

Cordialement,
DRH référent
```

---

## 11. Documentation de la Qualification

### 11.1 Journalisation

```sql
CREATE TABLE qualification_log (
  id VARCHAR(36) PRIMARY KEY,
  lot_id VARCHAR(36) UNIQUE NOT NULL,
  qualification_date TIMESTAMP NOT NULL,
  
  source VARCHAR(50) NOT NULL,
  entries_acquired INT NOT NULL,
  entries_qualified INT NOT NULL,
  duplicates_resolved INT NOT NULL,
  relations_created INT NOT NULL,
  reduction_rate DECIMAL(5,2) NOT NULL,
  
  validation_status VARCHAR(20) NOT NULL,
  reservations TEXT,
  
  validated_by VARCHAR(36),
  validation_date TIMESTAMP,
  
  transmitted_to VARCHAR(255),
  transmission_date TIMESTAMP,
  acknowledged_by VARCHAR(255),
  acknowledgment_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_qual_source ON qualification_log(source);
CREATE INDEX idx_qual_date ON qualification_log(qualification_date);
```

### 11.2 Stockage des Données Qualifiées

Les données qualifiées sont stockées dans :

- **S3 Bucket** : Données qualifiées
- **Base de données** : Données structurées
- **Git** : Version control (format JSON)

### 11.3 Nom de Fichier

Format : `QUALIFICATION-[SOURCE]-[YYYY-MM].json`

Exemple : `QUALIFICATION-ROME-2026-10.json`

---

## 12. Indicateurs de Suivi

### 12.1 Métriques de Qualification

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de qualification | Entrées qualifiées / acquises | ≥ 90% |
| Taux de réduction | Réduction après déduplication | ≥ 10% |
| Taux de validation | Validations réussies / total | 100% |
| Temps moyen de qualification | Temps moyen de qualification | < 3 jours |

### 12.2 Métriques par Source

| Source | Taux de qualification | Taux de réduction | Relations créées (moyenne) |
|--------|---------------------|-------------------|---------------------------|
| ROME 4.0 | ≥ 95% | ~5% | ~20 |
| ESCO v1.1 | ≥ 90% | ~15% | ~50 |
| RNCP/RS | ≥ 95% | ~5% | ~10 |
| Synonymes terrain | ≥ 80% | ~20% | ~5 |

---

## 13. Conclusion

Le protocole de qualification définit le processus de vérification de la pertinence des entrées, résolution des doublons, et création des relations manquantes. Ce protocole garantit que seules les données de haute qualité sont intégrées dans le Knowledge Pack.

**Points clés :**
- Vérification de la pertinence RH
- Résolution des doublons (exact, fuzzy, synonyme)
- Création des relations manquantes
- Mapping avec Knowledge Pack
- Validation DRH référent
- Transmission à l'équipe de validation
