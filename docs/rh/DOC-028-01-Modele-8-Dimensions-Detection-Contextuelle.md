# DOC-028-01 : Modèle des 8 Dimensions de Détection Contextuelle

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle des 8 dimensions de détection contextuelle pour MVP-028 Exception Intelligence Engine. Ce modèle permet au moteur d'analyser chaque situation sur 8 dimensions avant d'appliquer une règle, afin de détecter quand la règle ne s'applique pas (profil atypique, contexte organisationnel exceptionnel, règle obsolète, conflit de règles, injustice détectable, risque business, consensus divergent, signal candidat exceptionnel).

---

## 2. Principe Fondateur

Une règle RH est toujours écrite pour le cas général. Elle est optimisée pour 80% des situations. Elle est inadaptée pour 20% des situations. Le moteur doit apprendre à détecter dans quel 20% il se trouve. Dans ce cas, il ne doit pas appliquer la règle aveuglément, ni ignorer la règle, mais proposer une exception argumentée avec traçabilité complète.

---

## 3. Dimension 1 — Profil Atypique Détecté

### 3.1 Parcours Entrepreneurial

**Description :**
Signaux d'un parcours entrepreneurial.

**Signaux :**
- Création d'entreprise(s)
- Expérience en tant que fondateur
- Gestion d'équipe en contexte startup

**Analyse :**
- L'expérience entrepreneuriale compresse le temps d'apprentissage
- 3 ans en startup fondateur ≠ 3 ans en grande entreprise
- Équivalence à calculer

**Exemple :**
- Candidat avec 3 ans d'expérience entrepreneuriale
- Équivalence estimée à 5-7 ans d'expérience en grande entreprise
- Justification : Responsabilités multiples, prise de décision, gestion d'incertitude

---

### 3.2 Reconversion Réussie

**Description :**
Changement de secteur ou de métier avec preuve de succès rapide.

**Signaux :**
- Changement de secteur
- Changement de métier
- Preuve de succès rapide dans le nouveau domaine

**Analyse :**
- La reconversion démontre une capacité d'adaptation rare
- Peut compenser un manque d'ancienneté
- Apprentissage accéléré démontré

**Exemple :**
- Candidat avec 2 ans d'expérience dans le nouveau secteur
- Performances exceptionnelles dès la première année
- Justification : Capacité d'adaptation, transfert de compétences

---

### 3.3 Parcours International Complexe

**Description :**
Expériences dans plusieurs pays et cultures différentes.

**Signaux :**
- Expériences dans plusieurs pays
- Expériences dans plusieurs cultures
- Adaptabilité interculturelle démontrée

**Analyse :**
- Richesse non mesurable par les critères standard
- Compétences interculturelles précieuses
- Vision globale

**Exemple :**
- Candidat avec 4 ans d'expérience répartis sur 3 pays
- Compétences interculturelles démontrées
- Justification : Adaptabilité, vision globale, ouverture

---

### 3.4 Autodidacte Démontré

**Description :**
Sans diplôme mais avec réalisations prouvées et mesurables.

**Signaux :**
- Absence de diplôme requis
- Réalisations prouvées et mesurables
- Compétence directe démontrée

**Analyse :**
- Le diplôme est un proxy de compétence
- Ce candidat a la compétence directe
- Preuve par l'expérience

**Exemple :**
- Candidat sans Bac+5 requis
- Projets open-source majeurs
- Contributions significatives à l'industrie
- Justification : Compétence directe, preuve par l'expérience

---

### 3.5 Expertise de Niche Rare

**Description :**
Profil rare sur le marché.

**Signaux :**
- Compétences rares sur le marché
- Expertise de niche
- Difficulté à trouver des profils similaires

**Analyse :**
- Les règles standard ne s'appliquent pas quand le profil est introuvable ailleurs
- Compromis nécessaire
- Valeur stratégique

**Exemple :**
- Expert en technologie émergente
- Peu de candidats disponibles sur le marché
- Justification : Rareté, valeur stratégique, impossibilité d'appliquer les règles standard

---

## 4. Dimension 2 — Contexte Organisationnel Exceptionnel

### 4.1 Startup en Hypercroissance

**Description :**
Les règles écrites pour un grand groupe sont inadaptées.

**Signaux :**
- Startup en phase d'hypercroissance
- Structure agile
- Besoin de rapidité

**Analyse :**
- Adapter les critères au stade de développement de l'entreprise
- Les règles standard sont inadaptées
- Flexibilité nécessaire

**Exemple :**
- Startup en hypercroissance
- Besoin de recrutement rapide
- Justification : Stade de développement, besoin de flexibilité

---

### 4.2 Poste Nouvellement Créé

**Description :**
Aucun référentiel historique.

**Signaux :**
- Poste nouvellement créé
- Aucun référentiel historique
- Innovation dans le rôle

**Analyse :**
- Les règles héritées d'autres postes ne s'appliquent pas nécessairement
- Besoin d'adaptation
- Création de nouveaux critères

**Exemple :**
- Poste nouvellement créé
- Aucun historique de recrutement
- Justification : Innovation, absence de référentiel

---

### 4.3 Transformation Majeure en Cours

**Description :**
L'entreprise change de modèle.

**Signaux :**
- Transformation majeure en cours
- Changement de modèle
- Nouveaux besoins

**Analyse :**
- Les profils qui ont réussi dans le passé ne sont pas nécessairement ceux qui réussiront demain
- Besoin de nouveaux profils
- Adaptation des critères

**Exemple :**
- Transformation digitale en cours
- Besoin de nouveaux profils
- Justification : Transformation, nouveaux besoins

---

### 4.4 Urgence Opérationnelle Critique

**Description :**
Le délai ne permet pas le processus standard.

**Signaux :**
- Urgence opérationnelle critique
- Délai contraint
- Besoin immédiat

**Analyse :**
- Adapter le processus sans sacrifier la qualité essentielle
- Compromis entre rapidité et qualité
- Validation renforcée

**Exemple :**
- Départ critique inattendu
- Besoin de remplacement immédiat
- Justification : Urgence, délai contraint

---

## 5. Dimension 3 — Règle Potentiellement Obsolète

### 5.1 Détection de l'Obsolètes

**Description :**
La règle existe depuis combien de temps ? Le contexte qui l'a générée existe-t-il encore ?

**Processus de détection :**
- Date de création de la règle
- Contexte qui l'a justifiée
- Ce contexte existe-t-il encore ?
- Si non → règle candidate à révision

**Exemples de règles devenues obsolètes :**
- "Exiger un bureau physique" → Obsolète depuis le télétravail généralisé
- "Exiger un Bac+5 en informatique" → Obsolète depuis les bootcamps et l'autoformation en ligne
- "Exiger 10 ans d'expérience en IA" → Impossible : le domaine n'a pas 10 ans

---

## 6. Dimension 4 — Règle en Conflit avec une Autre Règle

### 6.1 Détection du Conflit

**Description :**
Deux règles valides qui se contredisent dans ce cas précis.

**Exemple :**
- Règle A : "Privilégier la mobilité interne"
- Règle B : "Exiger 5 ans d'expérience minimum"
- Candidat interne : 3 ans d'expérience

**Analyse :**
- Conflit réel : quelle règle prime ?
- Réponse du moteur :
  - Analyse de la hiérarchie des règles (réf. RH-007)
  - Proposition de résolution argumentée
  - Validation humaine obligatoire

---

## 7. Dimension 5 — Règle Créant une Injustice Détectable

### 7.1 Détection de l'Injustice

**Description :**
La règle produit un résultat qui semble manifestement injuste dans ce cas précis.

**Signaux d'injustice :**
- Le candidat le plus qualifié est exclu par un critère purement formel
- Le critère ne prédit pas le succès dans ce contexte précis
- L'exclusion pénalise un groupe de manière disproportionnée (alerte D&I — réf. MVP-022)

**Analyse :**
- Évaluation de l'injustice
- Impact sur la diversité et l'inclusion
- Nécessité d'exception

---

## 8. Dimension 6 — Règle Créant un Risque Business

### 8.1 Détection du Risque Business

**Description :**
Appliquer la règle strictement crée un risque pour l'entreprise.

**Exemples :**
- Refuser le seul expert disponible sur le marché pour un critère formel
- Perdre un candidat exceptionnel au profit d'un concurrent
- Bloquer un recrutement critique pour un processus inadapté

**Analyse :**
- Évaluation du risque business
- Impact sur l'entreprise
- Nécessité d'exception

---

## 9. Dimension 7 — Consensus d'Experts Divergent

### 9.1 Détection de la Divergence

**Description :**
Sur ce cas précis, des experts RH raisonnables pourraient ne pas être d'accord sur l'application de la règle.

**Signaux de divergence potentielle :**
- La règle est ambiguë sur ce cas
- Des précédents contradictoires existent
- Le secteur a des pratiques différentes de la règle interne

**Analyse :**
- Évaluation de la divergence
- Consultation d'experts
- Nécessité d'exception

---

## 10. Dimension 8 — Signal Candidat Exceptionnel

### 10.1 Détection de l'Exceptionnalité

**Description :**
Le candidat présente des signaux qui dépassent significativement les critères formels.

**Signaux d'exceptionnalité :**
- Réalisations mesurables très supérieures au niveau requis
- Recommandations exceptionnellement fortes
- Potentiel détecté très élevé (réf. MVP-021 Predictive Success)
- Combinaison unique de compétences rare sur le marché

**Analyse :**
- Évaluation de l'exceptionnalité
- Comparaison avec les critères formels
- Nécessité d'exception

---

## 11. Algorithme de Détection Contextuelle

### 11.1 Processus Global

```typescript
async function detectExceptionalContext(rule: Rule, candidate: Candidate, context: Context): Promise<ExceptionalContext> {
  // 1. Analyse de la dimension 1 : Profil atypique
  const atypicalProfile = await detectAtypicalProfile(candidate);
  
  // 2. Analyse de la dimension 2 : Contexte organisationnel
  const organizationalContext = await detectOrganizationalContext(context);
  
  // 3. Analyse de la dimension 3 : Règle obsolète
  const obsoleteRule = await detectObsoleteRule(rule);
  
  // 4. Analyse de la dimension 4 : Conflit de règles
  const ruleConflict = await detectRuleConflict(rule, context);
  
  // 5. Analyse de la dimension 5 : Injustice détectable
  const detectableInjustice = await detectDetectableInjustice(rule, candidate);
  
  // 6. Analyse de la dimension 6 : Risque business
  const businessRisk = await detectBusinessRisk(rule, candidate, context);
  
  // 7. Analyse de la dimension 7 : Consensus divergent
  const divergentConsensus = await detectDivergentConsensus(rule, candidate);
  
  // 8. Analyse de la dimension 8 : Signal candidat exceptionnel
  const exceptionalSignal = await detectExceptionalSignal(candidate);
  
  // 9. Construction du contexte exceptionnel
  const exceptionalContext: ExceptionalContext = {
    contextId: generateContextId(),
    analyzedAt: new Date(),
    
    atypicalProfile,
    organizationalContext,
    obsoleteRule,
    ruleConflict,
    detectableInjustice,
    businessRisk,
    divergentConsensus,
    exceptionalSignal
  };
  
  // 10. Sauvegarde du contexte
  await saveExceptionalContext(exceptionalContext);
  
  return exceptionalContext;
}
```

---

### 11.2 Détection du Profil Atypique

```typescript
async function detectAtypicalProfile(candidate: Candidate): Promise<{
  detected: boolean;
  type: 'entrepreneurial' | 'reconversion' | 'international' | 'autodidact' | 'niche_rare' | null;
  description: string;
  justification: string;
}> {
  // Détection du parcours entrepreneurial
  const entrepreneurial = await detectEntrepreneurialPath(candidate);
  if (entrepreneurial.detected) {
    return {
      detected: true,
      type: 'entrepreneurial',
      description: 'Parcours entrepreneurial détecté',
      justification: entrepreneurial.justification
    };
  }
  
  // Détection de la reconversion réussie
  const reconversion = await detectSuccessfulReconversion(candidate);
  if (reconversion.detected) {
    return {
      detected: true,
      type: 'reconversion',
      description: 'Reconversion réussie détectée',
      justification: reconversion.justification
    };
  }
  
  // Détection du parcours international
  const international = await detectInternationalPath(candidate);
  if (international.detected) {
    return {
      detected: true,
      type: 'international',
      description: 'Parcours international complexe détecté',
      justification: international.justification
    };
  }
  
  // Détection de l'autodidacte
  const autodidact = await detectAutodidact(candidate);
  if (autodidact.detected) {
    return {
      detected: true,
      type: 'autodidact',
      description: 'Autodidacte démontré détecté',
      justification: autodidact.justification
    };
  }
  
  // Détection de l'expertise de niche rare
  const nicheRare = await detectNicheRareExpertise(candidate);
  if (nicheRare.detected) {
    return {
      detected: true,
      type: 'niche_rare',
      description: 'Expertise de niche rare détectée',
      justification: nicheRare.justification
    };
  }
  
  return {
    detected: false,
    type: null,
    description: 'Aucun profil atypique détecté',
    justification: 'Le candidat correspond au profil standard'
  };
}
```

---

## 12. Structure de Données (TypeScript)

```typescript
interface ExceptionalContext {
  contextId: string;
  analyzedAt: Date;
  
  atypicalProfile: {
    detected: boolean;
    type: 'entrepreneurial' | 'reconversion' | 'international' | 'autodidact' | 'niche_rare' | null;
    description: string;
    justification: string;
  };
  
  organizationalContext: {
    detected: boolean;
    type: 'hypergrowth_startup' | 'newly_created_role' | 'major_transformation' | 'critical_urgency' | null;
    description: string;
    justification: string;
  };
  
  obsoleteRule: {
    detected: boolean;
    description: string;
    justification: string;
  };
  
  ruleConflict: {
    detected: boolean;
    conflictingRules: string[];
    description: string;
    justification: string;
  };
  
  detectableInjustice: {
    detected: boolean;
    description: string;
    justification: string;
  };
  
  businessRisk: {
    detected: boolean;
    description: string;
    justification: string;
  };
  
  divergentConsensus: {
    detected: boolean;
    description: string;
    justification: string;
  };
  
  exceptionalSignal: {
    detected: boolean;
    description: string;
    justification: string;
  };
}
```

---

## 13. Stockage et Gestion

### 13.1 Schéma SQL

```sql
CREATE TABLE exceptional_context (
  id VARCHAR(36) PRIMARY KEY,
  analyzed_at TIMESTAMP NOT NULL,
  
  atypical_profile JSON NOT NULL,
  organizational_context JSON NOT NULL,
  obsolete_rule JSON NOT NULL,
  rule_conflict JSON NOT NULL,
  detectable_injustice JSON NOT NULL,
  business_risk JSON NOT NULL,
  divergent_consensus JSON NOT NULL,
  exceptional_signal JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exceptional_context_date ON exceptional_context(analyzed_at);
```

---

## 14. API Endpoints

```typescript
// POST /api/exception-intelligence/detect-context
async function detectExceptionalContext(ruleId: string, candidateId: string): Promise<ExceptionalContext> {
  return await detectExceptionalContext(ruleId, candidateId);
}

// GET /api/exception-intelligence/context/:contextId
async function getExceptionalContext(contextId: string): Promise<ExceptionalContext> {
  return await getExceptionalContextById(contextId);
}
```

---

## 15. Indicateurs de Suivi

### 15.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection de contexte | Contextes détectés / total | ≥ 80% |
| Précision de la détection | Précision de la détection des dimensions | ≥ 75% |
| Taux de faux positifs | Faux positifs / total | ≤ 10% |
| Satisfaction DRH | Satisfaction avec la détection contextuelle | ≥ 4.5/5 |

### 15.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des injustices | Réduction des injustices détectées | ≥ 30% |
- Réduction des risques business | Réduction des risques business détectés | ≥ 25% |
- Amélioration de la diversité | Amélioration de la diversité via les exceptions | ≥ 20% |

---

## 16. Conclusion

Le modèle des 8 dimensions de détection contextuelle permet au moteur d'analyser chaque situation sur 8 dimensions avant d'appliquer une règle (profil atypique, contexte organisationnel exceptionnel, règle obsolète, conflit de règles, injustice détectable, risque business, consensus divergent, signal candidat exceptionnel). Le modèle permet au moteur de détecter quand la règle ne s'applique pas et de proposer une exception argumentée avec traçabilité complète. Le modèle s'intègre avec les modules existants (MVP-021, MVP-022).

**Points clés :**
- 8 dimensions de détection contextuelle
- 5 types de profils atypiques
- 4 types de contextes organisationnels
- Détection de règles obsolètes
- Détection de conflits de règles
- Détection d'injustices détectables
- Détection de risques business
- Détection de consensus divergent
- Détection de signaux candidat exceptionnel
- Intégration avec les modules existants
