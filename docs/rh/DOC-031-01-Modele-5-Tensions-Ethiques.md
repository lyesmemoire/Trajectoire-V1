# DOC-031-01 : Modèle des 5 Tensions Éthiques Fondamentales

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle des 5 tensions éthiques fondamentales pour MVP-031 Ethical Compass Engine. Ce modèle structure la détection des situations où une tension éthique existe, même si tout est légalement conforme, et propose des ajustements pour atteindre une sagesse éthique au-delà de la simple conformité.

---

## 2. Principe Fondateur

La conformité est le minimum. La sagesse éthique est l'excellence. Un grand cabinet ne se contente pas de ne pas discriminer. Il cherche activement à être juste. Il ne se contente pas de respecter les lois. Il cherche activement à prendre les décisions les plus justes possibles pour toutes les parties prenantes : le candidat, l'équipe, le manager, l'entreprise, les candidats refusés, et la société dans son ensemble.

---

## 3. Les 5 Tensions Éthiques Fondamentales

### 3.1 Tension Éthique Type 1 — Efficacité vs Équité

**Description :**
Le processus le plus efficace peut créer des avantages systémiques pour certains candidats au détriment d'autres, même si tout est légalement conforme.

**Exemple :**
Le processus le plus rapide favorise les candidats qui ont accès à des formations de préparation aux entretiens. Les candidats sans ces ressources sont désavantagés.

**Ce que le moteur dit :**
```
Ce processus est légal et efficace.
Il crée cependant un avantage systémique pour les candidats issus de certains milieux.
Si l'équité est une valeur de l'organisation :
voici des ajustements possibles qui maintiennent l'efficacité tout en réduisant ce biais systémique.
```

**Critères de détection :**
- Analyse des ressources nécessaires pour réussir le processus
- Identification des avantages systémiques
- Évaluation de l'impact sur l'équité

**Ajustements proposés :**
- Fournir des ressources de préparation gratuites
- Adapter le processus pour réduire les dépendances aux ressources externes
- Introduire des critères d'évaluation moins dépendants de la préparation

---

### 3.2 Tension Éthique Type 2 — Intérêt de l'Entreprise vs Intérêt du Candidat

**Description :**
L'intérêt de l'entreprise peut entrer en conflit avec l'intérêt réel du candidat, même si le candidat semble intéressé.

**Exemple :**
L'entreprise veut un candidat pour un poste qui ne correspond pas à son projet de carrière. Le candidat ne l'a pas réalisé.

**Ce que le moteur dit :**
```
Ce candidat semble intéressé par ce poste mais son projet de carrière réel pointe vers [X].
Ce poste risque de le satisfaire 6 à 12 mois puis de le frustrer.
Question éthique : est-il dans l'intérêt de l'entreprise de recruter quelqu'un qui partira probablement dans 12 mois ?
Est-il dans l'intérêt du candidat d'accepter ce poste ?
```

**Critères de détection :**
- Analyse du projet de carrière du candidat
- Analyse de l'évolution du poste
- Identification des divergences entre intérêts

**Ajustements proposés :**
- Discuter ouvertement du projet de carrière avec le candidat
- Adapter le poste si possible pour correspondre au projet
- Recruter un candidat dont le projet correspond mieux

---

### 3.3 Tension Éthique Type 3 — Règle Formelle vs Justice Substantielle

**Description :**
Une règle formelle peut exclure un candidat pour un critère qui ne prédit pas le succès dans ce poste précis, créant une injustice substantielle.

**Exemple :**
La règle exclut formellement un candidat pour un critère qui ne prédit pas le succès dans ce poste précis.

**Ce que le moteur dit :**
```
Ce critère est dans les prérequis formels.
L'analyse montre qu'il ne corrèle pas avec le succès dans ce type de poste (réf. MVP-029 patterns).
Appliquer ce critère exclut ce candidat pour une raison formelle non fondée sur la performance réelle.
Question : ce critère doit-il être maintenu dans ce cas ?
```

**Critères de détection :**
- Analyse des prérequis formels
- Vérification de la corrélation avec le succès (réf. MVP-029)
- Identification des critères non prédictifs

**Ajustements proposés :**
- Supprimer le critère s'il n'est pas prédictif
- Adapter le critère pour être plus pertinent
- Documenter l'exception si le critère doit être maintenu

---

### 3.4 Tension Éthique Type 4 — Court Terme vs Long Terme

**Description :**
Le meilleur candidat sur le court terme peut ne pas être le meilleur sur le long terme, créant une tension entre horizons temporels.

**Exemple :**
Le meilleur candidat sur le court terme n'est pas le meilleur sur le long terme.

**Ce que le moteur dit :**
```
Pour les 6 premiers mois : candidat A est supérieur.
Pour les 18 à 36 mois : candidat B est supérieur.
Cette tension entre court et long terme doit être une décision consciente.
Quel horizon priorisez-vous ?
```

**Critères de détection :**
- Analyse de la performance à court terme
- Analyse de la performance à long terme
- Identification des divergences temporelles

**Ajustements proposés :**
- Clarifier l'horizon prioritaire de l'entreprise
- Choisir le candidat en fonction de l'horizon prioritaire
- Documenter la décision temporelle

---

### 3.5 Tension Éthique Type 5 — Transparence vs Protection

**Description :**
La transparence (feedback honnête) peut entrer en conflit avec la protection (risque légal), créant une tension entre honnêteté et sécurité.

**Exemple :**
Le feedback honnête au candidat refusé pourrait l'aider à progresser mais expose l'entreprise à un risque légal.

**Ce que le moteur dit :**
```
Un feedback complet et honnête aiderait ce candidat à progresser.
Il présente un risque légal de [niveau].
Voici comment formuler un feedback qui soit à la fois honnête, utile au candidat ET sécurisé légalement :
[formulation recommandée]
```

**Critères de détection :**
- Analyse du contenu du feedback
- Évaluation du risque légal
- Identification de la tension transparence/protection

**Ajustements proposés :**
- Formuler le feedback de manière sécurisée légalement
- Fournir un feedback utile sans risquer légalement
- Documenter la formulation du feedback

---

## 4. Structure de Données (TypeScript)

```typescript
interface EthicalTension {
  tensionId: string;
  tensionType: 'efficiency_vs_equity' | 'company_vs_candidate' | 'formal_vs_substantive' | 'short_vs_long_term' | 'transparency_vs_protection';
  
  detectedAt: Date;
  context: {
    decision: string;
    stakeholders: string[];
  };
  
  description: string;
  
  analysis: {
    legalCompliance: boolean;
    ethicalIssue: string;
    stakeholdersImpacted: string[];
    severity: 'low' | 'medium' | 'high';
  };
  
  proposedAdjustments: {
    adjustments: string[];
    expectedImpact: string;
    tradeoffs: string[];
  };
  
  metadata: {
    detectedBy: string;
    version: string;
    status: 'detected' | 'addressed' | 'ignored';
  };
}
```

---

## 5. Algorithme de Détection des Tensions

### 5.1 Processus Global

```typescript
async function detectEthicalTensions(decision: Decision): Promise<EthicalTension[]> {
  const tensions: EthicalTension[] = [];
  
  // 1. Détection de la tension Efficacité vs Équité
  const tension1 = await detectEfficiencyVsEquity(decision);
  if (tension1) tensions.push(tension1);
  
  // 2. Détection de la tension Intérêt Entreprise vs Candidat
  const tension2 = await detectCompanyVsCandidate(decision);
  if (tension2) tensions.push(tension2);
  
  // 3. Détection de la tension Règle Formelle vs Justice Substantielle
  const tension3 = await detectFormalVsSubstantive(decision);
  if (tension3) tensions.push(tension3);
  
  // 4. Détection de la tension Court Terme vs Long Terme
  const tension4 = await detectShortVsLongTerm(decision);
  if (tension4) tensions.push(tension4);
  
  // 5. Détection de la tension Transparence vs Protection
  const tension5 = await detectTransparencyVsProtection(decision);
  if (tension5) tensions.push(tension5);
  
  return tensions;
}
```

---

### 5.2 Détection de la Tension Efficacité vs Équité

```typescript
async function detectEfficiencyVsEquity(decision: Decision): Promise<EthicalTension | null> {
  // 1. Analyse des ressources nécessaires
  const resourcesRequired = await analyzeResourcesRequired(decision);
  
  // 2. Identification des avantages systémiques
  const systemicAdvantages = await identifySystemicAdvantages(resourcesRequired);
  
  // 3. Évaluation de l'impact sur l'équité
  const equityImpact = await evaluateEquityImpact(systemicAdvantages);
  
  // 4. Détection de la tension
  if (equityImpact.significant) {
    return {
      tensionId: generateTensionId(),
      tensionType: 'efficiency_vs_equity',
      detectedAt: new Date(),
      context: {
        decision: decision.description,
        stakeholders: ['candidates', 'society']
      },
      description: 'Le processus crée un avantage systémique pour certains candidats',
      analysis: {
        legalCompliance: true,
        ethicalIssue: 'Inéquité systémique',
        stakeholdersImpacted: ['candidates sans ressources', 'société'],
        severity: equityImpact.severity
      },
      proposedAdjustments: await proposeEquityAdjustments(decision, systemicAdvantages),
      metadata: {
        detectedBy: 'MVP-031 Ethical Compass Engine',
        version: '1.0',
        status: 'detected'
      }
    };
  }
  
  return null;
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE ethical_tension (
  id VARCHAR(36) PRIMARY KEY,
  tension_type VARCHAR(50) NOT NULL CHECK (tension_type IN ('efficiency_vs_equity', 'company_vs_candidate', 'formal_vs_substantive', 'short_vs_long_term', 'transparency_vs_protection')),
  detected_at TIMESTAMP NOT NULL,
  
  context JSON NOT NULL,
  description TEXT NOT NULL,
  analysis JSON NOT NULL,
  proposed_adjustments JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ethical_tension_type ON ethical_tension(tension_type);
CREATE INDEX idx_ethical_tension_date ON ethical_tension(detected_at);
```

---

## 7. API Endpoints

```typescript
// POST /api/ethical/tensions/detect
async function detectEthicalTensions(decision: Decision): Promise<EthicalTension[]> {
  return await detectEthicalTensions(decision);
}

// GET /api/ethical/tensions/:tensionId
async function getEthicalTension(tensionId: string): Promise<EthicalTension> {
  return await getEthicalTensionById(tensionId);
}

// GET /api/ethical/tensions/type/:type
async function getTensionsByType(type: string): Promise<EthicalTension[]> {
  return await getTensionsByType(type);
}

// PUT /api/ethical/tensions/:tensionId/address
async function addressTension(tensionId: string, adjustments: string[]): Promise<EthicalTension> {
  return await addressTension(tensionId, adjustments);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection | Tensions détectées / décisions analysées | ≥ 80% |
- Taux d'adressage | Tensions adressées / détectées | ≥ 70% |
- Taux de réduction d'impact | Réduction de l'impact éthique | ≥ 50% |
- Satisfaction recruteurs | Satisfaction avec les ajustements | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de l'équité | Amélioration de l'équité systémique | ≥ 30% |
- Réduction des regrets | Réduction des décisions regrettées | ≥ 25% |
- Confiance dans le système | Confiance des utilisateurs | ≥ 4.5/5 |

---

## 9. Conclusion

Le modèle des 5 tensions éthiques fondamentales structure la détection des situations où une tension éthique existe, même si tout est légalement conforme. Les 5 tensions (Efficacité vs Équité, Intérêt Entreprise vs Candidat, Règle Formelle vs Justice Substantielle, Court Terme vs Long Terme, Transparence vs Protection) permettent d'identifier les zones où la sagesse éthique peut aller au-delà de la simple conformité.

**Points clés :**
- 5 tensions éthiques fondamentales
- Détection automatique des tensions
- Analyse multi-parties prenantes
- Ajustements proposés pour chaque tension
- Intégration avec MVP-029 (patterns)
- Algorithme de détection structuré
- Stockage et gestion des tensions
- API endpoints pour la gestion
- Métriques de qualité et d'impact
