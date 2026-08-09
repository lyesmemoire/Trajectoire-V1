# DOC-032-01 : Architecture de la Mémoire Conversationnelle

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'architecture de la mémoire conversationnelle pour MVP-032 Conversational Intelligence Engine. Cette mémoire mémorise intégralement tout ce qui est dit depuis le début de la conversation, traite la conversation comme un tout, et permet la détection de cohérences, incohérences, évolutions, esquives récurrentes, et la construction d'un fil narratif.

---

## 2. Principe Fondateur

Une bonne conversation d'entretien n'est pas un interrogatoire structuré. C'est un dialogue authentique dans lequel deux personnes cherchent ensemble la vérité sur une adéquation possible. Le moteur ne traite pas les réponses isolément mais traite la conversation comme un tout, en mémorisant intégralement chaque échange et ses connexions avec les échanges précédents.

---

## 3. Capacités de la Mémoire Conversationnelle

### 3.1 Détection des Cohérences

**Description :**
Le moteur détecte lorsque ce que le candidat dit maintenant confirme ce qu'il a dit précédemment.

**Exemple :**
```
Échange 1 (début d'entretien) :
  Candidat : "J'aime les environnements structurés avec des processus clairs."

Échange 15 (20 minutes plus tard) :
  Candidat : "Dans mon dernier poste, j'ai créé des processus documentés
              pour améliorer l'efficacité de l'équipe."

Détection de cohérence :
  "Le candidat a dit X au début.
   Ce qu'il dit maintenant confirme X.
   Signal de cohérence : l'appréciation des structures et processus est constante."
```

---

### 3.2 Détection des Incohérences

**Description :**
Le moteur détecte lorsque ce que le candidat dit maintenant contredit ce qu'il a dit précédemment.

**Exemple :**
```
Échange 1 (début d'entretien) :
  Candidat : "J'aime les environnements structurés."

Échange 20 (30 minutes plus tard) :
  Candidat : "Mon projet idéal serait très autonome,
              sans trop de processus."

Détection d'incohérence :
  "Le candidat a dit X au début.
   Ce qu'il dit maintenant contredit X.
   Incohérence à explorer : tension entre besoin de structure
   et désir d'autonomie."
```

---

### 3.3 Détection des Évolutions

**Description :**
Le moteur détecte lorsque la position du candidat évolue progressivement au cours de l'entretien.

**Exemple :**
```
Échange 1 :
  Candidat : "Je suis très attaché à mon entreprise actuelle."

Échange 10 :
  Candidat : "Je reste fidèle mais je suis ouvert à de nouvelles opportunités
              si elles sont vraiment intéressantes."

Échange 20 :
  Candidat : "Je suis prêt à bouger si le projet me correspond vraiment."

Détection d'évolution :
  "Le candidat était fermé sur X au début.
   Il s'ouvre progressivement.
   L'entretien crée de la confiance : évolution de l'attachement
   vers une ouverture au changement."
```

---

### 3.4 Détection des Esquives Récurrentes

**Description :**
Le moteur détecte lorsque le candidat change de sujet de manière répétée quand un territoire spécifique est abordé.

**Exemple :**
```
Échange 5 :
  Recruteur : "Comment décririez-vous votre relation avec votre dernier manager ?"
  Candidat : "C'était une bonne équipe, on travaillait bien ensemble."

Échange 12 :
  Recruteur : "Et concernant votre manager directement ?"
  Candidat : "J'ai appris beaucoup sur la gestion de projet dans ce poste."

Échange 18 :
  Recruteur : "Revenons à votre manager..."
  Candidat : "L'entreprise a traversé une période de croissance intense."

Détection d'esquive récurrente :
  "C'est la 3ème fois que le candidat change de sujet
   quand on aborde sa relation avec son manager.
   Ce territoire mérite d'être exploré directement."
```

---

### 3.5 Construction d'un Fil Narratif

**Description :**
La conversation a une histoire. Le moteur suit cette histoire et aide le recruteur à la comprendre dans sa globalité.

**Exemple :**
```
Fil narratif construit :
  "Le candidat commence par exprimer une forte loyauté
   envers son employeur actuel (échange 1).
   Progressivement, il révèle des frustrations
   liées au manque d'évolution (échange 8).
   Il exprime ensuite un désir de nouveaux défis
   tout en restant prudent (échange 15).
   Enfin, il s'ouvre à la possibilité de changer
   si le projet est aligné avec ses valeurs (échange 25).
   
   Évolution : Loiauté → Frustration → Désir de défi → Ouverture conditionnelle"
```

---

## 4. Structure de la Mémoire Conversationnelle

### 4.1 Élément de Mémoire par Échange

Chaque échange est mémorisé avec les éléments suivants :

```
ÉCHANGE [N]

HORODATAGE :
  Timestamp : [Date et heure précise]
  Durée depuis le début : [X minutes]

CONTENU :
  Question du recruteur : [Texte]
  Réponse du candidat : [Texte]

DIMENSION ÉVALUÉE :
  Dimension : [Compétences / Expérience / Soft skills / Motivations / Culture fit]
  Sous-dimension : [Sous-dimension spécifique]

NIVEAU DE CERTITUDE :
  Avant cet échange : [0-100%]
  Après cet échange : [0-100%]
  Évolution : [+/- X%]

CONNEXIONS AVEC LES ÉCHANGES PRÉCÉDENTS :
  Cohérences détectées : [Liste]
  Incohérences détectées : [Liste]
  Évolutions détectées : [Liste]

HYPOTHÈSES ACTIVES À CE MOMENT :
  - [Hypothèse 1]
  - [Hypothèse 2]

QUESTIONS OUVERTES NON RÉSOLUES :
  - [Question 1]
  - [Question 2]
```

---

### 4.2 Structure de Données (TypeScript)

```typescript
interface ConversationExchange {
  exchangeId: string;
  exchangeNumber: number;
  
  timestamp: Date;
  durationFromStart: number; // en minutes
  
  content: {
    recruiterQuestion: string;
    candidateResponse: string;
  };
  
  dimensionEvaluated: {
    dimension: 'technical_skills' | 'experience' | 'soft_skills' | 'motivations' | 'culture_fit';
    subDimension: string;
  };
  
  certaintyLevel: {
    beforeExchange: number; // 0-100
    afterExchange: number; // 0-100
    evolution: number; // +/- percentage
  };
  
  connectionsWithPreviousExchanges: {
    consistencies: string[];
    inconsistencies: string[];
    evolutions: string[];
  };
  
  activeHypotheses: string[];
  
  unresolvedOpenQuestions: string[];
  
  metadata: {
    interviewId: string;
    candidateId: string;
    recruiterId: string;
  };
}

interface ConversationalMemory {
  memoryId: string;
  interviewId: string;
  candidateId: string;
  recruiterId: string;
  
  startedAt: Date;
  currentExchangeNumber: number;
  
  exchanges: ConversationExchange[];
  
  narrativeThread: {
    summary: string;
    evolution: string;
    keyMoments: {
      exchangeNumber: number;
      description: string;
    }[];
  };
  
  detectedPatterns: {
    consistencies: string[];
    inconsistencies: string[];
    evolutions: string[];
    recurrentEvasions: {
      topic: string;
      occurrences: number;
      exchangeNumbers: number[];
    }[];
  };
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
  };
}
```

---

## 5. Algorithme de Traitement de la Mémoire

### 5.1 Processus Global

```typescript
async function processConversationExchange(exchange: ConversationExchange, memory: ConversationalMemory): Promise<ConversationalMemory> {
  // 1. Ajouter l'échange à la mémoire
  memory.exchanges.push(exchange);
  memory.currentExchangeNumber = exchange.exchangeNumber;
  
  // 2. Analyser les connexions avec les échanges précédents
  const connections = await analyzeConnections(exchange, memory.exchanges);
  
  // 3. Mettre à jour les hypothèses actives
  const updatedHypotheses = await updateHypotheses(exchange, memory);
  
  // 4. Mettre à jour les questions ouvertes
  const updatedQuestions = await updateOpenQuestions(exchange, memory);
  
  // 5. Mettre à jour le fil narratif
  const updatedNarrative = await updateNarrativeThread(memory);
  
  // 6. Mettre à jour les patterns détectés
  const updatedPatterns = await updateDetectedPatterns(memory);
  
  // 7. Construire la mémoire mise à jour
  const updatedMemory: ConversationalMemory = {
    ...memory,
    exchanges: memory.exchanges,
    narrativeThread: updatedNarrative,
    detectedPatterns: updatedPatterns,
    metadata: {
      ...memory.metadata,
      updatedAt: new Date()
    }
  };
  
  return updatedMemory;
}
```

---

### 5.2 Analyse des Connexions

```typescript
async function analyzeConnections(exchange: ConversationExchange, previousExchanges: ConversationExchange[]): Promise<any> {
  const consistencies: string[] = [];
  const inconsistencies: string[] = [];
  const evolutions: string[] = [];
  
  // Analyser chaque échange précédent
  for (const previousExchange of previousExchanges) {
    // Détection de cohérence
    const consistency = await detectConsistency(exchange, previousExchange);
    if (consistency.detected) {
      consistencies.push(consistency.description);
    }
    
    // Détection d'incohérence
    const inconsistency = await detectInconsistency(exchange, previousExchange);
    if (inconsistency.detected) {
      inconsistencies.push(inconsistency.description);
    }
    
    // Détection d'évolution
    const evolution = await detectEvolution(exchange, previousExchange);
    if (evolution.detected) {
      evolutions.push(evolution.description);
    }
  }
  
  return {
    consistencies,
    inconsistencies,
    evolutions
  };
}
```

---

### 5.3 Détection des Esquives Récurrentes

```typescript
async function detectRecurrentEvasions(memory: ConversationalMemory): Promise<any[]> {
  const recurrentEvasions: any[] = [];
  
  // Analyser chaque sujet abordé
  const topics = await extractTopics(memory.exchanges);
  
  for (const topic of topics) {
    const occurrences = topic.exchangeNumbers;
    
    // Si le sujet a été abordé mais le candidat a changé de sujet
    if (occurrences.length >= 3) {
      const evasionCount = await countEvasions(topic, memory.exchanges);
      
      if (evasionCount >= 2) {
        recurrentEvasions.push({
          topic: topic.name,
          occurrences: evasionCount,
          exchangeNumbers: topic.exchangeNumbers
        });
      }
    }
  }
  
  return recurrentEvasions;
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE conversational_memory (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  
  started_at TIMESTAMP NOT NULL,
  current_exchange_number INT NOT NULL,
  
  exchanges JSON NOT NULL,
  narrative_thread JSON NOT NULL,
  detected_patterns JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview(id),
  FOREIGN KEY (candidate_id) REFERENCES candidate(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiter(id)
);

CREATE INDEX idx_conversational_memory_interview ON conversational_memory(interview_id);
CREATE INDEX idx_conversational_memory_candidate ON conversational_memory(candidate_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/conversational/memory/exchange
async function addConversationExchange(exchange: ConversationExchange): Promise<ConversationalMemory> {
  return await addConversationExchange(exchange);
}

// GET /api/conversational/memory/:memoryId
async function getConversationalMemory(memoryId: string): Promise<ConversationalMemory> {
  return await getConversationalMemoryById(memoryId);
}

// GET /api/conversational/memory/interview/:interviewId
async function getConversationalMemoryByInterview(interviewId: string): Promise<ConversationalMemory> {
  return await getConversationalMemoryByInterview(interviewId);
}

// GET /api/conversational/memory/:memoryId/patterns
async function getDetectedPatterns(memoryId: string): Promise<any> {
  return await getDetectedPatterns(memoryId);
}

// GET /api/conversational/memory/:memoryId/narrative
async function getNarrativeThread(memoryId: string): Promise<any> {
  return await getNarrativeThread(memoryId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de mémorisation | Échanges mémorisés / total | 100% |
- Taux de détection de cohérences | Cohérences détectées / présentes | ≥ 90% |
- Taux de détection d'incohérences | Incohérences détectées / présentes | ≥ 85% |
- Taux de détection d'esquives | Esquives récurrentes détectées / présentes | ≥ 80% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de la qualité des entretiens | Amélioration de la qualité des entretiens | ≥ 30% |
- Réduction des incohérences non détectées | Réduction des incohérences non détectées | ≥ 40% |
- Satisfaction recruteurs | Satisfaction avec la mémoire conversationnelle | ≥ 4.5/5 |

---

## 9. Conclusion

L'architecture de la mémoire conversationnelle structure la mémorisation intégrale de la conversation, le traitement de la conversation comme un tout, et la détection de cohérences, incohérences, évolutions, esquives récurrentes, et la construction d'un fil narratif. Cette mémoire est la fondation de l'intelligence conversationnelle du moteur.

**Points clés :**
- Mémorisation intégrale de chaque échange
- Traitement de la conversation comme un tout
- Détection de 4 types de patterns (cohérences, incohérences, évolutions, esquives)
- Construction d'un fil narratif
- Structure de données TypeScript détaillée
- Algorithme de traitement structuré
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
