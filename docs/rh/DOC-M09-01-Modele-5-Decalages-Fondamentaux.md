# DOC-M09-01 : Modèle des 5 Décalages Fondamentaux

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle des 5 décalages fondamentaux pour le MVP-META-09 Gap Detection Engine. Ce document structure les écarts entre le discours du candidat et les comportements observés.

---

## 2. Principe Fondateur

Les candidats présentent souvent une image d'eux-mêmes qui ne correspond pas à la réalité. Le moteur détecte ces décalages en comparant ce que le candidat dit de lui-même avec ce que ses exemples montrent réellement.

---

## 3. Les 5 Décalages Fondamentaux

### 3.1 DÉCALAGE 1 — Leadership Déclaré vs Leadership Observé

**Ce que le candidat dit :**
- "Je suis un leader naturel."
- "J'ai un leadership collaboratif."
- "Je sais fédérer les équipes."

**Ce qu'on cherche dans les preuves :**
- A-t-il pris des décisions seul sous pression ?
- A-t-il conduit des changements impopulaires ?
- A-t-il géré des conflits au sein de son équipe ?
- Les autres le suivaient-ils sans autorité formelle ?

**Signal de décalage :**
Discours de leader + aucune preuve de décision solitaire ou difficile.

**Interprétation :**
Leadership déclaratif. Probablement un bon exécutant dans un cadre structuré. Pas nécessairement un vrai leader.

**Impact sur le poste :**
- Si le poste nécessite un vrai leadership → Gap critique.
- Si le poste nécessite un bon exécutant → Pas de problème. Mais ne pas promettre un rôle de leadership.

---

### 3.2 DÉCALAGE 2 — Autonomie Déclarée vs Besoin de Structure Observé

**Ce que le candidat dit :**
- "J'aime l'autonomie."
- "Je n'ai pas besoin d'être managé."
- "Je suis très autonome."

**Ce qu'on cherche dans les preuves :**
- Toutes ses expériences réussies étaient-elles dans des contextes très structurés ?
- A-t-il des exemples de création de quelque chose à partir de rien ?
- A-t-il géré des situations sans cadre prédéfini ?

**Signal de décalage :**
"J'aime l'autonomie" + Toutes les expériences réussies en grand groupe avec processus établis.

**Interprétation :**
Besoin de structure réel masqué par un discours d'autonomie. Probablement parce que l'autonomie est socialement valorisée.

**Impact :**
- Si le poste est très autonome (startup / création de département) → Risque d'échec.
- Si le poste est structuré → Adapté malgré le discours. Clarifier les attentes.

---

### 3.3 DÉCALAGE 3 — Ambition Déclarée vs Confort du Statu Quo Observé

**Ce que le candidat dit :**
- "Je cherche plus de responsabilités."
- "Je veux progresser rapidement."
- "Je suis ambitieux."

**Ce qu'on cherche dans les preuves :**
- A-t-il pris des initiatives pour progresser sans qu'on le lui demande ?
- A-t-il quitté des postes confortables pour des défis ?
- A-t-il créé des opportunités plutôt que d'attendre ?

**Signal de décalage :**
"Ambition forte" + 6 ans dans le même poste sans initiative proactive de changement.

**Interprétation :**
Ambition de façade. Confort du statu quo réel. Probable réaction à un contexte qui ne lui convient plus plutôt qu'une vraie ambition motrice.

---

### 3.4 DÉCALAGE 4 — Motivation Intrinsèque Déclarée vs Motivation Extrinsèque Observée

**Ce que le candidat dit :**
- "Ce qui me motive c'est l'impact."
- "Je veux contribuer à quelque chose de grand."
- "Le sens est plus important que le salaire."

**Ce qu'on observe :**
- Toutes ses questions portaient sur le salaire, le titre, les avantages, la voiture de fonction.
- Aucune question sur le projet ou les enjeux de l'entreprise.

**Signal de décalage :**
Discours de sens + comportement de calcul matériel.

**Interprétation :**
Motivation extrinsèque réelle masquée par un discours socialement acceptable. Ce candidat partira pour plus d'argent.

---

### 3.5 DÉCALAGE 5 — Tolérance au Conflit Déclarée vs Évitement Observé

**Ce que le candidat dit :**
- "Je gère bien les conflits."
- "Je suis direct et je n'ai pas peur d'aller vers les sujets difficiles."

**Ce qu'on cherche dans les preuves :**
- Ses exemples de conflits se terminent-ils par une résolution ou par un compromis mou ?
- A-t-il maintenu une position face à un supérieur hiérarchique ?
- A-t-il dit non quand il le fallait ?

**Signal de décalage :**
"Je gère les conflits" + Tous les exemples se terminent par "et finalement on a trouvé un terrain d'entente" ou "j'ai préféré laisser tomber".

**Interprétation :**
Gestion du conflit par évitement déguisée en flexibilité.

---

## 4. Structure de Données (TypeScript)

```typescript
interface GapDetection {
  detectionId: string;
  recruitmentId: string;
  candidateId: string;
  
  gaps: {
    leadership: {
      declared: string[];
      observed: string[];
      signalDetected: boolean;
      interpretation: string;
      impact: 'critical' | 'moderate' | 'low';
    };
    autonomy: {
      declared: string[];
      observed: string[];
      signalDetected: boolean;
      interpretation: string;
      impact: 'critical' | 'moderate' | 'low';
    };
    ambition: {
      declared: string[];
      observed: string[];
      signalDetected: boolean;
      interpretation: string;
      impact: 'critical' | 'moderate' | 'low';
    };
    motivation: {
      declared: string[];
      observed: string[];
      signalDetected: boolean;
      interpretation: string;
      impact: 'critical' | 'moderate' | 'low';
    };
    conflict: {
      declared: string[];
      observed: string[];
      signalDetected: boolean;
      interpretation: string;
      impact: 'critical' | 'moderate' | 'low';
    };
  };
  
  overallAssessment: {
    selfPresentation: string;
    actualObservation: string;
    nuance: 'critical' | 'important' | 'minor';
    onboardingRecommendation: string[];
  };
  
  generatedAt: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE gap_detection (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  gaps JSON NOT NULL,
  overall_assessment JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_gap_detection_recruitment ON gap_detection(recruitment_id);
CREATE INDEX idx_gap_detection_candidate ON gap_detection(candidate_id);
```

---

## 6. API Endpoints

```typescript
// POST /api/gap-detection/analyze
async function analyzeGaps(recruitmentId: string, candidateId: string): Promise<GapDetection> {
  return await analyzeGaps(recruitmentId, candidateId);
}

// GET /api/gap-detection/:detectionId
async function getGapDetection(detectionId: string): Promise<GapDetection> {
  return await getGapDetection(detectionId);
}

// GET /api/gap-detection/recruitment/:recruitmentId
async function getGapDetectionByRecruitment(recruitmentId: string): Promise<GapDetection> {
  return await getGapDetectionByRecruitment(recruitmentId);
}

// PUT /api/gap-detection/:detectionId/gaps
async function updateGapDetection(detectionId: string, gaps: any): Promise<GapDetection> {
  return await updateGapDetection(detectionId, gaps);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Détection

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection | Décalages détectés / candidats analysés | ≥ 30% |
- Taux de décalages critiques | Décalages critiques / totaux | ≤ 15% |

### 7.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux d'adaptation onboarding | Candidats adaptés / totaux | ≥ 80% |
- Réduction des départs précoces | Réduction / taux initial | ≥ 20% |

---

## 8. Exemple Complet

```markdown
ANALYSE DES DÉCALAGES

Décalages identifiés : 2

DÉCALAGE 1 — Leadership
  Ce qu'il dit : "Je suis un leader naturel, je sais fédérer les équipes."
  Ce qu'on observe : Aucun exemple de décision solitaire, tous les exemples en équipe.
  Niveau de décalage : Modéré
  Interprétation : Leadership déclaratif, bon exécutant mais pas vrai leader.
  Impact pour ce poste : Modéré (poste d'exécution)
  Recommandation : Ne pas promettre de rôle de leadership

DÉCALAGE 2 — Autonomie
  Ce qu'il dit : "J'aime l'autonomie, je n'ai pas besoin d'être managé."
  Ce qu'on observe : Toutes les expériences en grand groupe structuré.
  Niveau de décalage : Léger
  Interprétation : Besoin de structure réel masqué par discours d'autonomie.
  Impact pour ce poste : Faible (poste structuré)
  Recommandation : Clarifier les attentes de management

NOTE GLOBALE :
Ce candidat se présente comme un leader autonome et ambitieux.
Nos observations suggèrent qu'il est davantage un bon exécutant dans un cadre structuré.
Cette nuance est importante pour ce poste.
Recommandation d'onboarding : Clarifier le rôle d'exécution, fournir un cadre structuré, ne pas promettre de leadership rapide.
```

---

## 9. Conclusion

Le modèle des 5 décalages fondamentaux structure les écarts entre le discours du candidat et les comportements observés. 5 décalages : Leadership déclaré vs observé, Autonomie déclarée vs besoin de structure, Ambition déclarée vs confort du statu quo, Motivation intrinsèque déclarée vs extrinsèque observée, Tolérance au conflit déclarée vs évitement observé. Chaque décalage inclut ce que le candidat dit, ce qu'on cherche dans les preuves, le signal de décalage, l'interprétation, et l'impact sur le poste. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 5 décalages fondamentaux
- Comparaison discours vs comportements
- Signal de décalage spécifique
- Interprétation de chaque décalage
- Impact sur le poste
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de détection et d'impact
