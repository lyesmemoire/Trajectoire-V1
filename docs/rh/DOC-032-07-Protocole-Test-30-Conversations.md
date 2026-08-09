# DOC-032-07 : Protocole de Test (30 Conversations Simulées)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test pour MVP-032 Conversational Intelligence Engine. Ce protocole vérifie la capacité du moteur à gérer des conversations simulées couvrant divers scénarios, situations difficiles, et types de candidats, avec 30 conversations de test pour valider l'ensemble des fonctionnalités.

---

## 2. Principe Fondateur

Le moteur doit être capable de gérer des conversations réelles avec divers types de candidats et situations. Ce protocole de test soumet le moteur à 30 conversations simulées couvrant les 5 couches du module (mémoire conversationnelle, rebond intelligent, cartographie, situations difficiles, gestion du tempo) pour valider sa capacité à conduire des dialogues authentiques.

---

## 3. Types de Scénarios de Test

### 3.1 Scénarios de Mémoire Conversationnelle (1-6)

#### SCÉNARIO 1 — Détection de Cohérence

**Contexte :**
Candidat cohérent dans ses réponses.

**Entrée :**
```
Échange 1 : "J'aime les environnements structurés."
Échange 10 : "J'ai créé des processus documentés pour améliorer l'efficacité."
Échange 20 : "J'apprécie quand les règles sont claires."
```

**Attendu :**
```
DÉTECTION : Cohérence détectée
ANALYSE : Le candidat maintient une position cohérente sur l'appréciation des structures
FIL NARRATIF : Cohérence constante sur le besoin de structure
```

**Critère de succès :**
Le moteur détecte la cohérence et construit un fil narratif cohérent.

---

#### SCÉNARIO 2 — Détection d'Incohérence

**Contexte :**
Candidat incohérent dans ses réponses.

**Entrée :**
```
Échange 1 : "J'aime les environnements structurés."
Échange 15 : "Mon projet idéal serait très autonome, sans trop de processus."
```

**Attendu :**
```
DÉTECTION : Incohérence détectée
ANALYSE : Tension entre besoin de structure et désir d'autonomie
REBOND SUGGÉRÉ : Explorer cette tension avec le candidat
```

**Critère de succès :**
Le moteur détecte l'incohérence et suggère un rebond pour l'explorer.

---

#### SCÉNARIO 3 — Détection d'Évolution

**Contexte :**
Candidat dont la position évolue progressivement.

**Entrée :**
```
Échange 1 : "Je suis très attaché à mon entreprise actuelle."
Échange 10 : "Je reste fidèle mais je suis ouvert à de nouvelles opportunités."
Échange 20 : "Je suis prêt à bouger si le projet me correspond vraiment."
```

**Attendu :**
```
DÉTECTION : Évolution détectée
ANALYSE : Évolution de la loyauté vers une ouverture au changement
FIL NARRATIF : Loiauté → Frustration → Désir de défi → Ouverture conditionnelle
```

**Critère de succès :**
Le moteur détecte l'évolution et construit un fil narratif de progression.

---

#### SCÉNARIO 4 — Détection d'Esquive Récurrente

**Contexte :**
Candidat qui esquive un sujet à plusieurs reprises.

**Entrée :**
```
Échange 5 : Question sur le manager → Réponse sur l'équipe
Échange 12 : Question sur le manager → Réponse sur les projets
Échange 18 : Question sur le manager → Réponse sur la croissance
```

**Attendu :**
```
DÉTECTION : Esquive récurrente détectée
ANALYSE : 3ème esquive sur le sujet du manager
REBOND SUGGÉRÉ : Explorer ce territoire directement
```

**Critère de succès :**
Le moteur détecte l'esquive récurrente et suggère d'explorer directement.

---

### 3.2 Scénarios de Rebond Intelligent (7-12)

#### SCÉNARIO 7 — Creuser la Réponse

**Contexte :**
Candidat donne une réponse intéressante mais superficielle.

**Entrée :**
```
Candidat : "J'ai géré des situations difficiles dans mon équipe."
```

**Attendu :**
```
OPTION SÉLECTIONNÉE : Creuser (A)
REBOND : "Vous dites 'situations difficiles'.
         Quelle a été la plus difficile ?
         Décrivez-moi ce qui s'est passé exactement
         et ce que vous avez fait."
TON : Curieux
```

**Critère de succès :**
Le moteur sélectionne l'option Creuser et propose un rebond approprié.

---

#### SCÉNARIO 8 — Demander un Exemple Concret

**Contexte :**
Candidat donne une réponse trop générale.

**Entrée :**
```
Candidat : "Je suis quelqu'un de rigoureux et orienté résultats."
```

**Attendu :**
```
OPTION SÉLECTIONNÉE : Exemple concret (B)
REBOND : "Donnez-moi un exemple précis
         qui illustre ce que vous dites.
         Une situation réelle, récente."
TON : Direct, factuel
```

**Critère de succès :**
Le moteur sélectionne l'option Exemple concret et demande un exemple.

---

#### SCÉNARIO 9 — Explorer la Connexion

**Contexte :**
Candidat dit quelque chose qui contredit un échange précédent.

**Entrée :**
```
Échange précédent : "J'aime les environnements structurés."
Réponse actuelle : "Mon projet idéal serait très autonome, sans trop de processus."
```

**Attendu :**
```
OPTION SÉLECTIONNÉE : Connexion (D)
REBOND : "J'ai une question qui relie deux choses que vous avez dites.
         En début d'entretien vous parliez d'apprécier les environnements structurés.
         Et maintenant vous décrivez un projet idéal sans trop de processus.
         Comment vous expliquez cette tension ?"
TON : Analytique
```

**Critère de succès :**
Le moteur sélectionne l'option Connexion et explore la tension.

---

### 3.3 Scénarios de Cartographie (13-18)

#### SCÉNARIO 13 — Cartographie en Temps Réel

**Contexte :**
Entretien en cours avec plusieurs dimensions explorées.

**Entrée :**
```
Temps écoulé : 25 minutes / 45 minutes
Dimensions abordées : Compétences (80%), Expérience (60%), Soft skills (40%)
Dimensions non abordées : Motivations, Culture fit
```

**Attendu :**
```
ALERTE GÉNÉRÉE : "56% du temps écoulé.
                 Dimensions non encore explorées : Motivations, Culture fit.
                 Orienter vers ces territoires dans les prochaines minutes."
PRIORITÉ : High
```

**Critère de succès :**
Le moteur génère une alerte appropriée pour les dimensions non abordées.

---

#### SCÉNARIO 14 — Mise à Jour de la Cartographie

**Contexte :**
Nouvel échange sur une dimension partiellement éclaircie.

**Entrée :**
```
Dimension : Soft skills leadership
Niveau actuel : 40%
Nouvel échange : Exemple de leadership
Nouveau niveau : 65%
```

**Attendu :**
```
MISE À JOUR : Soft skills leadership : 65% éclairci
STATUT : Sufficiently illuminated
ALERTE : "Soft skills leadership : 65% éclairci.
         Dimension suffisamment couverte.
         Peut passer à d'autres territoires."
```

**Critère de succès :**
Le moteur met à jour la cartographie et génère une alerte appropriée.

---

### 3.4 Scénarios de Situations Difficiles (19-24)

#### SCÉNARIO 19 — Candidat qui Parle Trop

**Contexte :**
Candidat donne des réponses très longues.

**Entrée :**
```
Candidat : [Réponse de 5 minutes à une question simple]
```

**Attendu :**
```
SITUATION DÉTECTÉE : Candidat qui parle trop
STRATÉGIE SUGGÉRÉE : Interruption bienveillante et structurante
REBOND : "Je vous arrête un instant.
         En une phrase : quel était le résultat principal de cette action ?"
TON : Structurant, bienveillant
```

**Critère de succès :**
Le moteur détecte la situation et suggère la stratégie appropriée.

---

#### SCÉNARIO 20 — Candidat qui Challenge

**Contexte :**
Candidat questionne la légitimité du recruteur.

**Entrée :**
```
Candidat : "Pourquoi vous me posez cette question ?"
```

**Attendu :**
```
SITUATION DÉTECTÉE : Candidat qui challenge
STRATÉGIE SUGGÉRÉE : Ne pas se défendre, expliquer l'objectif
REBOND : "Excellente question.
         Je cherche à comprendre comment vous gérez [situation X].
         Il n'y a pas de bonne réponse attendue."
TON : Calme, explicatif
```

**Critère de succès :**
Le moteur détecte la situation et suggère la stratégie appropriée.

---

### 3.5 Scénarios de Gestion du Tempo (25-30)

#### SCÉNARIO 25 — Transition de Phase

**Contexte :**
Fin de la phase d'ouverture, début de l'exploration.

**Entrée :**
```
Temps écoulé : 5 minutes / 45 minutes
Phase actuelle : Opening
Durée prévue : 4-5 minutes
```

**Attendu :**
```
TRANSITION : Opening → Exploration
ALERTE : "Phase d'ouverture terminée.
         Passer à la phase d'exploration."
ACTION : Démarrer la phase d'exploration
```

**Critère de succès :**
Le moteur détecte la fin de la phase et transitionne automatiquement.

---

#### SCÉNARIO 26 — Alerte de Temps Restant

**Contexte :**
5 minutes restantes, phase de clôture nécessaire.

**Entrée :**
```
Temps écoulé : 40 minutes / 45 minutes
Phase actuelle : Deepening
```

**Attendu :**
```
ALERTE : "5 minutes restantes.
         Passer à la clôture.
         Inviter les questions du candidat."
PRIORITÉ : Urgent
ACTION SUGGÉRÉE : Transitionner vers la clôture
```

**Critère de succès :**
Le moteur génère une alerte urgente pour la transition vers la clôture.

---

## 4. Protocole de Test

### 4.1 Préparation des Tests

**Étape 1 : Création des scénarios de test**
- Définir 30 scénarios couvrant les 5 couches
- Varier les contextes et les situations
- Inclure des cas limites et des cas typiques

**Étape 2 : Définition des résultats attendus**
- Pour chaque scénario, définir le résultat attendu
- Définir les critères de succès
- Définir les métriques d'évaluation

**Étape 3 : Validation des scénarios**
- Faire valider les scénarios par des experts RH
- S'assurer que les scénarios sont réalistes
- Ajuster les scénarios si nécessaire

---

### 4.2 Exécution des Tests

**Étape 1 : Soumission des scénarios au moteur**
- Soumettre chaque scénario au moteur
- Enregistrer la réponse du moteur
- Enregistrer le temps de réponse

**Étape 2 : Comparaison avec les résultats attendus**
- Comparer la détection (cohérence, incohérence, etc.)
- Comparer le rebond suggéré
- Comparer l'alerte générée
- Comparer la transition de phase

**Étape 3 : Évaluation du résultat**
- PASS si le moteur répond correctement
- FAIL si le moteur répond incorrectement
- PARTIAL si le moteur répond partiellement correctement

---

### 4.3 Analyse des Résultats

**Étape 1 : Calcul des métriques**
- Taux de réussite global
- Taux de réussite par couche
- Taux de réussite par type de scénario
- Temps moyen de réponse

**Étape 2 : Identification des échecs**
- Analyser les scénarios où le moteur échoue
- Identifier les patterns d'échec
- Identifier les causes d'échec

**Étape 3 : Amélioration du moteur**
- Ajuster les algorithmes si nécessaire
- Améliorer la détection des patterns
- Améliorer les rebonds suggérés
- Améliorer les alertes générées

---

## 5. Structure de Données (TypeScript)

```typescript
interface ConversationalTestScenario {
  scenarioId: string;
  scenarioNumber: number;
  layer: 'memory' | 'rebound' | 'mapping' | 'difficulties' | 'tempo';
  
  input: {
    context: string;
    exchanges?: ConversationExchange[];
    candidateResponse?: string;
    timeElapsed?: number;
    currentPhase?: string;
  };
  
  expectedOutput: {
    detection?: string;
    analysis?: string;
    selectedOption?: string;
    suggestedRebound?: string;
    tone?: string;
    alert?: string;
    priority?: string;
    transition?: string;
  };
  
  actualOutput?: {
    detection?: string;
    analysis?: string;
    selectedOption?: string;
    suggestedRebound?: string;
    tone?: string;
    alert?: string;
    priority?: string;
    transition?: string;
    responseTime: number;
  };
  
  result?: 'PASS' | 'FAIL' | 'PARTIAL';
  
  metadata: {
    createdAt: Date;
    testedAt?: Date;
    testedBy?: string;
  };
}

interface ConversationalTestSuite {
  suiteId: string;
  testScenarios: ConversationalTestScenario[];
  
  results: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    partialTests: number;
    passRate: number;
    averageResponseTime: number;
  };
  
  resultsByLayer: {
    [layer: string]: {
      total: number;
      passed: number;
      failed: number;
      partial: number;
      passRate: number;
    };
  };
  
  metadata: {
    createdAt: Date;
    executedAt?: Date;
    executedBy?: string;
    version: string;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE conversational_test_scenario (
  id VARCHAR(36) PRIMARY KEY,
  scenario_number INT NOT NULL UNIQUE,
  layer VARCHAR(50) NOT NULL CHECK (layer IN ('memory', 'rebound', 'mapping', 'difficulties', 'tempo')),
  
  input JSON NOT NULL,
  expected_output JSON NOT NULL,
  actual_output JSON,
  result VARCHAR(20) CHECK (result IN ('PASS', 'FAIL', 'PARTIAL')),
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversational_test_scenario_layer ON conversational_test_scenario(layer);
CREATE INDEX idx_conversational_test_scenario_result ON conversational_test_scenario(result);

CREATE TABLE conversational_test_suite (
  id VARCHAR(36) PRIMARY KEY,
  
  results JSON NOT NULL,
  results_by_layer JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_at TIMESTAMP
);
```

---

## 7. API Endpoints

```typescript
// POST /api/conversational/test/execute
async function executeConversationalTestSuite(suiteId: string): Promise<ConversationalTestSuite> {
  return await executeConversationalTestSuite(suiteId);
}

// POST /api/conversational/test/scenario
async function executeConversationalTestScenario(scenario: ConversationalTestScenario): Promise<ConversationalTestScenario> {
  return await executeConversationalTestScenario(scenario);
}

// GET /api/conversational/test/suite/:suiteId
async function getConversationalTestSuite(suiteId: string): Promise<ConversationalTestSuite> {
  return await getConversationalTestSuiteById(suiteId);
}

// POST /api/conversational/test/create
async function createConversationalTestSuite(scenarios: ConversationalTestScenario[]): Promise<ConversationalTestSuite> {
  return await createConversationalTestSuite(scenarios);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de réussite global | Tests passés / total | ≥ 90% |
- Taux de réussite par couche | Tests passés / total par couche | ≥ 85% |
- Temps moyen de réponse | Temps moyen de réponse | ≤ 2 secondes |
- Taux de détection correcte | Détections correctes / total | ≥ 95% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de la détection | Amélioration de la détection des patterns | ≥ 30% |
- Amélioration des rebonds | Amélioration de la qualité des rebonds | ≥ 30% |
- Confiance dans le système | Confiance des utilisateurs | ≥ 4.5/5 |

---

## 9. Conclusion

Le protocole de test vérifie la capacité du moteur à gérer des conversations simulées avec 30 scénarios couvrant les 5 couches du module (mémoire conversationnelle, rebond intelligent, cartographie, situations difficiles, gestion du tempo). Les scénarios couvrent divers types de candidats et situations pour valider la capacité du moteur à conduire des dialogues authentiques.

**Points clés :**
- 30 scénarios de test
- 5 couches du module couvertes
- Scénarios variés (cohérence, incohérence, évolution, esquive, rebond, cartographie, situations difficiles, tempo)
- Protocole de test structuré
- Analyse des résultats
- Amélioration continue
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
