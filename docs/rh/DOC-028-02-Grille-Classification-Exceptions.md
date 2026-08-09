# DOC-028-02 : Grille de Classification des Exceptions (3 Niveaux)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la grille de classification des exceptions en 3 niveaux pour MVP-028 Exception Intelligence Engine. Cette grille permet au moteur de classer chaque situation exceptionnelle détectée en 3 niveaux (exception mineure, exception significative, exception majeure) avec des critères précis, des exemples, et des actions spécifiques pour chaque niveau.

---

## 2. Principe Fondateur

Quand une situation exceptionnelle est détectée, le moteur la classe en 3 niveaux selon la gravité de l'écart avec la règle, la justificabilité de l'exception, et les risques associés. Chaque niveau déclenche des actions spécifiques du moteur et requiert différents niveaux de validation humaine et de traçabilité.

---

## 3. Niveau 1 — Exception Mineure

### 3.1 Définition

La règle s'applique mais avec une nuance. L'écart est faible et compensé.

**Critères :**
- Écart faible par rapport à la règle
- Compensation identifiée et justifiée
- Risque minimal pour l'entreprise
- Aucun impact sur la diversité et l'inclusion

---

### 3.2 Exemples

**Exemple 1 : Candidat avec 4 ans au lieu de 5 requis mais avec une certification qui compense**
- Règle : 5 ans d'expérience requis
- Candidat : 4 ans d'expérience + certification avancée
- Compensation : La certification démontre une expertise équivalente
- Justification : La certification est reconnue dans l'industrie et compense le manque d'expérience

**Exemple 2 : Candidat légèrement sous la fourchette salariale mais avec un profil rare**
- Règle : Fourchette salariale 50-60k€
- Candidat : Demande 48k€ mais profil rare
- Compensation : Profil rare sur le marché, difficulté à trouver des candidats similaires
- Justification : La rareté du profil justifie l'écart salarial

**Exemple 3 : Candidat sans une compétence secondaire mais avec une compétence équivalente**
- Règle : Compétence A requise
- Candidat : Compétence B équivalente
- Compensation : La compétence B est équivalente et transférable
- Justification : La compétence B démontre les mêmes capacités que la compétence A

---

### 3.3 Actions du Moteur

**Ce que le moteur fait :**
- Applique la règle avec commentaire nuancé
- Signale la compensation identifiée
- Aucune validation humaine spécifique requise
- Traçabilité standard

**Processus :**
1. Applique la règle avec commentaire nuancé
2. Signale la compensation identifiée
3. Enregistre l'exception dans le registre
4. Traçabilité standard (date, règle, compensation)

---

### 3.4 Validation et Traçabilité

**Validation humaine :**
- Aucune validation humaine spécifique requise
- Validation automatique par le moteur

**Traçabilité :**
- Traçabilité standard
- Enregistrement dans le registre des exceptions
- Rapport trimestriel inclut les exceptions mineures

---

## 4. Niveau 2 — Exception Significative

### 4.1 Définition

La règle ne s'applique pas clairement dans ce cas précis. L'écart est significatif mais justifiable.

**Critères :**
- Écart significatif par rapport à la règle
- Justification solide et documentée
- Risque modéré pour l'entreprise
- Impact potentiel sur la diversité et l'inclusion

---

### 4.2 Exemples

**Exemple 1 : Candidat avec 2 ans au lieu de 5 requis mais avec un parcours entrepreneurial**
- Règle : 5 ans d'expérience requis
- Candidat : 2 ans d'expérience + parcours entrepreneurial
- Justification : Le parcours entrepreneurial démontre une maturité équivalente
- Compensation : Responsabilités multiples, prise de décision, gestion d'incertitude

**Exemple 2 : Candidat sans diplôme requis mais avec des réalisations prouvées supérieures aux diplômés**
- Règle : Bac+5 requis
- Candidat : Sans diplôme mais réalisations prouvées supérieures
- Justification : Les réalisations démontrent une compétence directe supérieure
- Compensation : Projets majeurs, contributions significatives, reconnaissance de l'industrie

**Exemple 3 : Candidat avec une expérience dans un secteur différent mais avec des compétences transférables**
- Règle : Expérience dans le secteur requis
- Candidat : Expérience dans un secteur différent mais compétences transférables
- Justification : Les compétences transférables démontrent une capacité d'adaptation
- Compensation : Capacité d'adaptation, transfert de compétences, apprentissage rapide

---

### 4.3 Actions du Moteur

**Ce que le moteur fait :**
- Signale l'exception clairement
- Construit l'argumentaire complet
- Identifie les risques de l'exception
- Propose des conditions de validation
- Requiert validation DRH obligatoire
- Traçabilité renforcée

**Processus :**
1. Signale l'exception clairement
2. Construit l'argumentaire complet (sections 1 à 7)
3. Identifie les risques de l'exception
4. Propose des conditions de validation
5. Requiert validation DRH obligatoire
6. Traçabilité renforcée (date, règle, argumentaire, validation DRH)

---

### 4.4 Validation et Traçabilité

**Validation humaine :**
- Validation DRH obligatoire
- Validation par le DRH avec justification
- Possibilité de refus de l'exception

**Traçabilité :**
- Traçabilité renforcée
- Enregistrement dans le registre des exceptions
- Rapport trimestriel inclut les exceptions significatives
- Documentation complète de l'argumentaire

---

## 5. Niveau 3 — Exception Majeure

### 5.1 Définition

La règle est fondamentalement inadaptée à cette situation. L'appliquer serait une erreur manifeste.

**Critères :**
- Écart majeur par rapport à la règle
- Règle fondamentalement inadaptée
- Risque élevé pour l'entreprise
- Impact significatif sur la diversité et l'inclusion

---

### 5.2 Exemples

**Exemple 1 : Règle obsolète qui exclut tous les candidats qualifiés disponibles**
- Règle : Exiger 10 ans d'expérience en IA
- Candidat : Tous les candidats qualifiés ont moins de 10 ans d'expérience
- Justification : Le domaine n'a pas 10 ans, la règle est obsolète
- Compensation : Aucun candidat ne peut satisfaire la règle

**Exemple 2 : Règle qui produit une discrimination systémique sur ce cas précis**
- Règle : Exiger un diplôme d'une université spécifique
- Candidat : Candidats qualifiés mais sans diplôme de cette université
- Justification : La règle produit une discrimination systémique
- Compensation : La règle est discriminatoire et doit être révisée

**Exemple 3 : Règle en conflit direct avec une règle de niveau supérieur**
- Règle A : Exiger 5 ans d'expérience minimum
- Règle B : Privilégier la mobilité interne
- Candidat : Candidat interne avec 3 ans d'expérience
- Justification : Conflit entre deux règles valides
- Compensation : La règle de niveau supérieur doit primer

---

### 5.3 Actions du Moteur

**Ce que le moteur fait :**
- Refuse d'appliquer la règle telle quelle
- Construit un dossier d'exception complet
- Propose une révision de la règle
- Requiert validation DRH + Juridique
- Documente pour révision du corpus (réf. RH-870)
- Traçabilité maximale

**Processus :**
1. Refuse d'appliquer la règle telle quelle
2. Construit un dossier d'exception complet (sections 1 à 7)
3. Propose une révision de la règle
4. Requiert validation DRH + Juridique
5. Documente pour révision du corpus (réf. RH-870)
6. Traçabilité maximale (date, règle, argumentaire, validation DRH, validation Juridique)

---

### 5.4 Validation et Traçabilité

**Validation humaine :**
- Validation DRH + Juridique obligatoire
- Validation par le DRH avec justification
- Validation par le Juridique avec analyse des risques
- Possibilité de refus de l'exception

**Traçabilité :**
- Traçabilité maximale
- Enregistrement dans le registre des exceptions
- Rapport trimestriel inclut les exceptions majeures
- Documentation complète de l'argumentaire
- Documentation pour révision du corpus (réf. RH-870)

---

## 6. Algorithme de Classification des Exceptions

### 6.1 Processus Global

```typescript
async function classifyException(exceptionalContext: ExceptionalContext): Promise<ExceptionClassification> {
  // 1. Évaluation de la gravité de l'écart
  const severity = await evaluateSeverity(exceptionalContext);
  
  // 2. Évaluation de la justificabilité
  const justifiability = await evaluateJustifiability(exceptionalContext);
  
  // 3. Évaluation des risques
  const risks = await evaluateRisks(exceptionalContext);
  
  // 4. Classification selon les critères
  const level = await determineLevel(severity, justifiability, risks);
  
  // 5. Construction de la classification
  const classification: ExceptionClassification = {
    classificationId: generateClassificationId(),
    contextId: exceptionalContext.contextId,
    classifiedAt: new Date(),
    
    level,
    severity,
    justifiability,
    risks
  };
  
  // 6. Sauvegarde de la classification
  await saveExceptionClassification(classification);
  
  return classification;
}
```

---

### 6.2 Détermination du Niveau

```typescript
async function determineLevel(
  severity: 'low' | 'medium' | 'high',
  justifiability: 'low' | 'medium' | 'high',
  risks: RiskEvaluation
): Promise<'minor' | 'significant' | 'major'> {
  // Si la gravité est faible et la justificabilité est élevée
  if (severity === 'low' && justifiability === 'high' && risks.overall === 'low') {
    return 'minor';
  }
  
  // Si la gravité est moyenne et la justificabilité est élevée
  if (severity === 'medium' && justifiability === 'high' && risks.overall === 'medium') {
    return 'significant';
  }
  
  // Si la gravité est élevée
  if (severity === 'high' || risks.overall === 'high') {
    return 'major';
  }
  
  // Par défaut, niveau significatif
  return 'significant';
}
```

---

## 7. Structure de Données (TypeScript)

```typescript
interface ExceptionClassification {
  classificationId: string;
  contextId: string;
  classifiedAt: Date;
  
  level: 'minor' | 'significant' | 'major';
  
  severity: 'low' | 'medium' | 'high';
  justifiability: 'low' | 'medium' | 'high';
  
  risks: {
    legal: 'low' | 'medium' | 'high';
    operational: 'low' | 'medium' | 'high';
    precedent: 'low' | 'medium' | 'high';
    ethical: 'low' | 'medium' | 'high';
    overall: 'low' | 'medium' | 'high';
  };
}

interface ExceptionLevel {
  level: 'minor' | 'significant' | 'major';
  
  definition: string;
  criteria: string[];
  examples: string[];
  
  actions: string[];
  
  validation: {
    humanRequired: boolean;
    validators: string[];
  };
  
  traceability: {
    level: 'standard' | 'enhanced' | 'maximum';
    documentation: string[];
  };
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE exception_classification (
  id VARCHAR(36) PRIMARY KEY,
  context_id VARCHAR(36) NOT NULL,
  classified_at TIMESTAMP NOT NULL,
  
  level VARCHAR(20) NOT NULL CHECK (level IN ('minor', 'significant', 'major')),
  
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  justifiability VARCHAR(20) NOT NULL CHECK (justifiability IN ('low', 'medium', 'high')),
  
  risks JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (context_id) REFERENCES exceptional_context(id)
);

CREATE INDEX idx_exception_classification_context ON exception_classification(context_id);
CREATE INDEX idx_exception_classification_level ON exception_classification(level);
CREATE INDEX idx_exception_classification_date ON exception_classification(classified_at);
```

---

## 9. API Endpoints

```typescript
// POST /api/exception-intelligence/classify
async function classifyException(contextId: string): Promise<ExceptionClassification> {
  return await classifyException(contextId);
}

// GET /api/exception-intelligence/classification/:classificationId
async function getExceptionClassification(classificationId: string): Promise<ExceptionClassification> {
  return await getExceptionClassificationById(classificationId);
}

// GET /api/exception-intelligence/classification/level/:level
async function getExceptionsByLevel(level: string): Promise<ExceptionClassification[]> {
  return await getExceptionsByLevel(level);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de classification | Exceptions classifiées / total | ≥ 95% |
| Précision de la classification | Précision du niveau d'exception | ≥ 80% |
| Taux de faux positifs | Faux positifs / total | ≤ 10% |
| Satisfaction DRH | Satisfaction avec la classification | ≥ 4.5/5 |

### 10.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'acceptation des exceptions | Exceptions acceptées / proposées | ≥ 70% |
- Résultats des exceptions | Exceptions avec résultats positifs / total | ≥ 80% |
- Révision des règles | Règles révisées basées sur les exceptions | ≥ 5/an |

---

## 11. Conclusion

La grille de classification des exceptions en 3 niveaux permet au moteur de classer chaque situation exceptionnelle détectée en 3 niveaux (exception mineure, exception significative, exception majeure) avec des critères précis, des exemples, et des actions spécifiques pour chaque niveau. La grille permet au moteur de déclencher les actions appropriées selon le niveau de l'exception et de requérir les validations humaines nécessaires. La grille s'intègre avec les modules existants (MVP-022).

**Points clés :**
- 3 niveaux d'exception (mineure, significative, majeure)
- Critères précis pour chaque niveau
- Exemples concrets pour chaque niveau
- Actions spécifiques pour chaque niveau
- Validation humaine adaptée au niveau
- Traçabilité adaptée au niveau
- Intégration avec les modules existants
