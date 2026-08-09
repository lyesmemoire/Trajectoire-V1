# DOC-032-03 : Bibliothèque de 200 Rebonds Classifiés par Situation

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la bibliothèque de 200 rebonds classifiés par situation pour MVP-032 Conversational Intelligence Engine. Cette bibliothèque fournit des rebonds prédéfinis pour les situations conversationnelles les plus fréquentes en entretien, classés par type de situation et par option de rebond.

---

## 2. Principe Fondateur

La bibliothèque de rebonds est une ressource pour le moteur qui accélère et améliore la génération de rebonds intelligents. Chaque rebond est classé par situation, par option de rebond, et par contexte spécifique, permettant au moteur de sélectionner rapidement le rebond le plus approprié.

---

## 3. Classification des Rebonds

### 3.1 Par Type de Situation

**Catégories de situations :**
- **Ouverture** : Début d'entretien, mise à l'aise
- **Exploration technique** : Compétences, expérience
- **Soft skills** : Leadership, communication, collaboration
- **Motivations** : Intérêts, valeurs, projet de carrière
- **Culture fit** : Adéquation culturelle, environnement de travail
- **Gestion des difficultés** : Candidats difficiles, situations complexes
- **Clôture** : Fin d'entretien, questions du candidat

---

### 3.2 Par Option de Rebond

**Options de rebond :**
- **Creuser (A)** : Approfondir la réponse actuelle
- **Exemple concret (B)** : Demander un exemple concret
- **Clarifier (C)** : Clarifier une ambiguïté
- **Connexion (D)** : Explorer la connexion avec un échange précédent
- **Switch (E)** : Passer à un autre territoire
- **Silence (F)** : Laisser un silence

---

## 4. Bibliothèque de Rebonds (Échantillon Représentatif)

### 4.1 Rebonds d'Ouverture (1-20)

#### REBOND 1 — Mise à l'aise

**Situation :** Début d'entretien, candidat nerveux
**Option :** Creuser (A)
**Contexte :** Candidat répond brièvement aux questions d'ouverture
**Rebond :**
```
"Je sens que vous êtes un peu tendu.
C'est tout à fait normal, prenez votre temps.
Commençons par quelque chose de simple :
parlez-moi de votre parcours jusqu'à aujourd'hui,
sans vous soucier de la forme."
```

**Tone :** Bienveillant, rassurant

---

#### REBOND 2 — Établir la relation

**Situation :** Début d'entretien, créer une connexion
**Option :** Creuser (A)
**Contexte :** Candidat mentionne un intérêt personnel
**Rebond :**
```
"C'est intéressant que vous mentionniez [intérêt].
Est-ce que cet intérêt influence votre approche
du travail ou votre façon de collaborer ?"
```

**Tone :** Curieux, connecté

---

### 4.2 Rebonds d'Exploration Technique (21-60)

#### REBOND 21 — Creuser une compétence

**Situation :** Candidat mentionne une compétence technique
**Option :** Creuser (A)
**Contexte :** Candidat dit "Je connais bien React"
**Rebond :**
```
"Quand vous dites 'bien connaître React',
qu'est-ce que cela signifie concrètement pour vous ?
Avez-vous travaillé sur des projets complexes ?
Quelles fonctionnalités avez-vous utilisées ?"
```

**Tone :** Curieux, précis

---

#### REBOND 22 — Exemple concret technique

**Situation :** Candidat décrit une compétence de manière générale
**Option :** Exemple concret (B)
**Contexte :** Candidat dit "Je suis bon en résolution de problèmes"
**Rebond :**
```
"Donnez-moi un exemple précis d'un problème complexe
que vous avez résolu récemment.
Décrivez le problème, votre approche,
et le résultat obtenu."
```

**Tone :** Direct, factuel

---

#### REBOND 23 — Clarifier une ambiguïté technique

**Situation :** Candidat utilise un terme technique de manière ambiguë
**Option :** Clarifier (C)
**Contexte :** Candidat dit "J'ai optimisé l'application"
**Rebond :**
```
"Quand vous dites 'optimisé',
de quoi parlez-vous exactement ?
Performance ? Scalabilité ? Expérience utilisateur ?
Quels indicateurs avez-vous améliorés ?"
```

**Tone :** Précis, analytique

---

### 4.3 Rebonds de Soft Skills (61-100)

#### REBOND 61 — Leadership

**Situation :** Candidat décrit son style de leadership
**Option :** Exemple concret (B)
**Contexte :** Candidat dit "Je suis un leader collaboratif"
**Rebond :**
```
"Donnez-moi un exemple d'une situation
où vous avez dû diriger une équipe difficile.
Comment avez-vous géré les tensions ?
Quel a été le résultat ?"
```

**Tone :** Direct, évaluatif

---

#### REBOND 62 — Communication

**Situation :** Candidat parle de ses compétences en communication
**Option :** Creuser (A)
**Contexte :** Candidat dit "Je communique bien avec les équipes"
**Rebond :**
```
"Quand vous dites 'bien communiquer',
quelles sont les situations où vous trouvez
la communication la plus difficile ?
Comment vous adaptez-vous ?"
```

**Tone :** Curieux, nuancé

---

#### REBOND 63 — Collaboration

**Situation :** Candidat décrit sa collaboration avec d'autres
**Option :** Exemple concret (B)
**Contexte :** Candidat dit "Je travaille bien en équipe"
**Rebond :**
```
"Parlez-moi d'une fois où vous avez dû
collaborer avec une personne difficile.
Comment avez-vous géré la situation ?
Qu'avez-vous appris ?"
```

**Tone :** Direct, évaluatif

---

### 4.4 Rebonds de Motivations (101-140)

#### REBOND 101 — Intérêt pour le poste

**Situation :** Candidat exprime son intérêt pour le poste
**Option :** Creuser (A)
**Contexte :** Candidat dit "Je suis très intéressé par ce poste"
**Rebond :**
```
"Qu'est-ce qui vous intéresse spécifiquement
dans ce poste ?
Qu'est-ce qui vous attire dans cette entreprise ?
Comment cela s'aligne avec votre projet ?"
```

**Tone :** Curieux, profond

---

#### REBOND 102 — Valeurs

**Situation :** Candidat parle de ses valeurs
**Option :** Connexion (D)
**Contexte :** Candidat dit "L'intégrité est importante pour moi"
**Rebond :**
```
"Vous dites que l'intégrité est importante pour vous.
Avez-vous déjà été dans une situation
où vous avez dû choisir entre intégrité et résultat ?
Comment avez-vous réagi ?"
```

**Tone :** Éthique, profond

---

#### REBOND 103 — Projet de carrière

**Situation :** Candidat décrit son projet de carrière
**Option :** Creuser (A)
**Contexte :** Candidat dit "Je veux évoluer vers un rôle de management"
**Rebond :**
```
"Pourquoi le management vous attire-t-il ?
Quelles compétences pensez-vous devoir développer ?
Comment ce poste s'inscrit-il dans ce projet ?"
```

**Tone :** Curieux, prospectif

---

### 4.5 Rebonds de Culture Fit (141-170)

#### REBOND 141 — Environnement de travail

**Situation :** Candidat décrit son environnement de travail idéal
**Option :** Connexion (D)
**Contexte :** Candidat dit "J'aime les environnements structurés"
**Rebond :**
```
"Vous dites aimer les environnements structurés.
Comment cela s'aligne-t-il avec votre besoin
d'autonomie que vous avez mentionné plus tôt ?
Comment trouvez-vous l'équilibre ?"
```

**Tone :** Analytique, nuancé

---

#### REBOND 142 — Style de management

**Situation :** Candidat décrit son style de management préféré
**Option :** Exemple concret (B)
**Contexte :** Candidat dit "Je préfère les managers qui me font confiance"
**Rebond :**
```
"Donnez-moi un exemple d'un manager
qui vous a fait confiance.
Comment cela a-t-il impacté votre travail ?
Et inversement, un exemple où vous n'avez pas eu cette confiance ?"
```

**Tone :** Direct, évaluatif

---

### 4.6 Rebonds de Gestion des Difficultés (171-190)

#### REBOND 171 — Candidat qui parle trop

**Situation :** Candidat donne des réponses très longues
**Option :** Creuser (A) avec structuration
**Contexte :** Candidat parle depuis 3 minutes sans s'arrêter
**Rebond :**
```
"Je vous arrête un instant.
En une phrase : quel était le résultat principal
de cette action ?
Ensuite, nous pourrons revenir sur les détails si nécessaire."
```

**Tone :** Structurant, bienveillant

---

#### REBOND 172 — Candidat qui parle trop peu

**Situation :** Candidat donne des réponses très brèves
**Option :** Exemple concret (B)
**Contexte :** Candidat répond par "Oui" ou "Non" à tout
**Rebond :**
```
"Prenez le temps qu'il faut.
Je voudrais vraiment comprendre ce qui s'est passé.
Décrivez-moi la situation en détail,
avec le contexte et votre action."
```

**Tone :** Bienveillant, patient

---

#### REBOND 173 — Candidat qui challenge

**Situation :** Candidat questionne le recruteur
**Option :** Clarifier (C)
**Contexte :** Candidat demande "Pourquoi vous me posez cette question ?"
**Rebond :**
```
"Excellente question.
Je cherche à comprendre comment vous gérez [situation X].
Il n'y a pas de bonne réponse attendue.
Je veux simplement comprendre votre approche."
```

**Tone :** Calme, explicatif

---

#### REBOND 174 — Candidat sur-préparé

**Situation :** Candidat donne des réponses parfaites et scriptées
**Option :** Switch (E) vers question inattendue
**Contexte :** Candidat répond de manière trop parfaite
**Rebond :**
```
"Vos réponses sont très structurées.
Je vais vous poser une question différente :
parlez-moi d'une situation où vous avez échoué.
Qu'avez-vous appris de cet échec ?"
```

**Tone :** Direct, inattendu

---

#### REBOND 175 — Candidat émotionnellement submergé

**Situation :** Candidat montre un stress visible
**Option :** Silence (F)
**Contexte :** Candidat tremble, bégaye
**Rebond :**
```
"Prenez un moment.
L'entretien n'est pas une compétition.
Je cherche à vous connaître, pas à vous piéger.
Respirez, prenez votre temps."
```

**Tone :** Empathique, rassurant

---

#### REBOND 176 — Candidat qui critique ses anciens employeurs

**Situation :** Candidat parle négativement de ses anciens managers
**Option :** Creuser (A)
**Contexte :** Candidat critique son ancien manager
**Rebond :**
```
"Qu'est-ce que vous avez appris
de cette expérience difficile ?
Comment cela a-t-il influencé votre façon
de travailler aujourd'hui ?"
```

**Tone :** Constructif, orienté apprentissage

---

#### REBOND 177 — Silence total du candidat

**Situation :** Candidat ne sait pas quoi répondre
**Option :** Clarifier (C)
**Contexte :** Candidat reste silencieux 10 secondes
**Rebond :**
```
"Je reformule : [version plus simple de la question]
Prenez le temps qu'il faut."
```

**Tone :** Patient, simplificateur

---

#### REBOND 178 — Candidat qui donne des réponses génériques

**Situation :** Candidat répond avec des clichés
**Option :** Exemple concret (B)
**Contexte :** Candidat dit "Je suis rigoureux et orienté résultats"
**Rebond :**
```
"Donnez-moi un exemple précis
qui illustre ce que vous dites.
Une situation réelle, récente,
où vous avez fait preuve de cette rigueur."
```

**Tone :** Direct, factuel

---

#### REBOND 179 — Candidat qui ment (probablement)

**Situation :** Incohérence entre CV et propos
**Option :** Clarifier (C)
**Contexte :** CV indique X, candidat dit Y
**Rebond :**
```
"Aidez-moi à comprendre.
Votre CV indique X.
Et vous venez de dire Y.
Comment ces deux éléments s'articulent-ils ?"
```

**Tone :** Neutre, factuel

---

#### REBOND 180 — Candidat exceptionnel

**Situation :** Candidat dépasse les attentes
**Option :** Creuser (A)
**Contexte :** Candidat révèle quelque chose d'inattendu et remarquable
**Rebond :**
```
"Ce que vous venez de dire est intéressant.
Je voudrais explorer cela davantage.
Parlez-moi de..."
```

**Tone :** Curieux, enthousiaste

---

### 4.7 Rebonds de Clôture (191-200)

#### REBOND 191 — Transition vers la clôture

**Situation :** Fin de l'entretien, temps limité
**Option :** Switch (E)
**Contexte :** 5 minutes restantes
**Rebond :**
```
"Nous arrivons vers la fin de notre entretien.
Avez-vous des questions pour moi
sur le poste, l'équipe, ou l'entreprise ?"
```

**Tone :** Transitionnel, ouvert

---

#### REBOND 192 — Question du candidat

**Situation :** Candidat pose une question
**Option :** Creuser (A)
**Contexte :** Candidat demande sur l'équipe
**Rebond :**
```
"Bonne question.
[Answer]
Est-ce que cela répond à votre attente ?
Y a-t-il autre chose que vous aimeriez savoir ?"
```

**Tone :** Informatif, ouvert

---

## 5. Structure de Données (TypeScript)

```typescript
interface ReboundLibrary {
  libraryId: string;
  version: string;
  createdAt: Date;
  
  rebounds: Rebound[];
  
  classification: {
    bySituation: {
      [situation: string]: Rebound[];
    };
    byOption: {
      [option: string]: Rebound[];
    };
    byContext: {
      [context: string]: Rebound[];
    };
  };
  
  metadata: {
    totalRebounds: number;
    lastUpdated: Date;
  };
}

interface Rebound {
  reboundId: string;
  reboundNumber: number;
  
  situation: 'opening' | 'technical' | 'soft_skills' | 'motivations' | 'culture_fit' | 'difficulties' | 'closing';
  option: 'digDeeper' | 'askExample' | 'clarifyAmbiguity' | 'exploreConnection' | 'switchTerritory' | 'silence';
  
  context: string;
  
  formulation: string;
  tone: string;
  
  examples: {
    candidateResponse: string;
    reboundApplication: string;
  }[];
  
  metadata: {
    createdAt: Date;
    usageCount: number;
    effectivenessScore: number;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE rebound_library (
  id VARCHAR(36) PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  
  rebounds JSON NOT NULL,
  classification JSON NOT NULL,
  metadata JSON NOT NULL,
  
  UNIQUE KEY idx_rebound_library_version (version)
);

CREATE TABLE rebound (
  id VARCHAR(36) PRIMARY KEY,
  rebound_number INT NOT NULL UNIQUE,
  
  situation VARCHAR(50) NOT NULL CHECK (situation IN ('opening', 'technical', 'soft_skills', 'motivations', 'culture_fit', 'difficulties', 'closing')),
  option VARCHAR(50) NOT NULL CHECK (option IN ('digDeeper', 'askExample', 'clarifyAmbiguity', 'exploreConnection', 'switchTerritory', 'silence')),
  
  context TEXT NOT NULL,
  formulation TEXT NOT NULL,
  tone VARCHAR(50) NOT NULL,
  examples JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rebound_situation ON rebound(situation);
CREATE INDEX idx_rebound_option ON rebound(option);
```

---

## 7. API Endpoints

```typescript
// GET /api/conversational/rebounds/library
async function getReboundLibrary(): Promise<ReboundLibrary> {
  return await getReboundLibrary();
}

// GET /api/conversational/rebounds/situation/:situation
async function getReboundsBySituation(situation: string): Promise<Rebound[]> {
  return await getReboundsBySituation(situation);
}

// GET /api/conversational/rebounds/option/:option
async function getReboundsByOption(option: string): Promise<Rebound[]> {
  return await getReboundsByOption(option);
}

// GET /api/conversational/rebounds/search
async function searchRebounds(query: string): Promise<Rebound[]> {
  return await searchRebounds(query);
}

// POST /api/conversational/rebounds/:reboundId/feedback
async function recordReboundFeedback(reboundId: string, feedback: any): Promise<Rebound> {
  return await recordReboundFeedback(reboundId, feedback);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de couverture | Rebonds disponibles / situations | 200/200 |
- Taux d'utilisation | Rebonds utilisés / disponibles | ≥ 60% |
- Satisfaction recruteurs | Satisfaction avec les rebonds | ≥ 4.5/5 |
- Efficacité des rebonds | Rebonds efficaces / utilisés | ≥ 80% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de la qualité des entretiens | Amélioration de la qualité des entretiens | ≥ 35% |
- Réduction du temps de préparation | Réduction du temps de préparation | ≥ 25% |
- Diversité des rebonds | Distribution équilibrée des options | Équilibrée |

---

## 9. Conclusion

La bibliothèque de 200 rebonds classifiés par situation fournit des rebonds prédéfinis pour les situations conversationnelles les plus fréquentes en entretien. Les rebonds sont classés par 7 types de situations (Ouverture, Technique, Soft skills, Motivations, Culture fit, Difficultés, Clôture) et 6 options de rebond, permettant au moteur de sélectionner rapidement le rebond le plus approprié.

**Points clés :**
- 200 rebonds classifiés
- 7 types de situations
- 6 options de rebond
- Représentant échantillon fourni
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour l'accès
- Système de feedback
- Métriques de qualité et d'impact
