# DOC-M09-04 : Format de Sortie Analyse des Décalages

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format de sortie de l'analyse des décalages pour le MVP-META-09 Gap Detection Engine. Ce document structure le rapport généré après l'entretien qui synthétise les écarts détectés entre le discours du candidat et les comportements observés.

---

## 2. Principe Fondateur

Le format de sortie de l'analyse des décalages fournit un rapport structuré et actionnable pour le recruteur et le manager. Il synthétise les décalages détectés, fournit des interprétations, évalue l'impact pour le poste, et propose des recommandations concrètes.

---

## 3. Format du Rapport

### 3.1 En-tête

```markdown
ANALYSE DES DÉCALAGES
Candidat : [Nom]
Recrutement : [ID]
Date : [Date]
```

---

### 3.2 Résumé des Décalages

```markdown
Décalages identifiés : N

DÉCALAGE 1 — [Type]
  Ce qu'il dit : "[citation exacte]"
  Ce qu'on observe : "[comportements observés]"
  Niveau de décalage : Léger/Modéré/Fort
  Interprétation : [analyse]
  Impact pour ce poste : [évaluation]
  Recommandation :
    [Action concrète pour le manager]

DÉCALAGE 2 — [Type]
  Ce qu'il dit : "[citation exacte]"
  Ce qu'on observe : "[comportements observés]"
  Niveau de décalage : Léger/Modéré/Fort
  Interprétation : [analyse]
  Impact pour ce poste : [évaluation]
  Recommandation :
    [Action concrète pour le manager]

[...]
```

---

### 3.3 Note Globale

```markdown
NOTE GLOBALE :
Ce candidat se présente comme [X].
Nos observations suggèrent qu'il est davantage [Y].
Cette nuance est [critique/importante/mineure] pour ce poste.
Recommandation d'onboarding :
[Actions adaptées à qui il est vraiment]
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface GapAnalysisReport {
  reportId: string;
  recruitmentId: string;
  candidateId: string;
  
  summary: {
    gapsIdentified: number;
  };
  
  gaps: {
    type: 'leadership' | 'autonomy' | 'ambition' | 'motivation' | 'conflict';
    declared: string;
    observed: string;
    level: 'light' | 'moderate' | 'strong';
    interpretation: string;
    impact: 'critical' | 'important' | 'minor';
    recommendation: string;
  }[];
  
  overallNote: {
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
CREATE TABLE gap_analysis_report (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  summary JSON NOT NULL,
  gaps JSON NOT NULL,
  overall_note JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_gap_analysis_report_recruitment ON gap_analysis_report(recruitment_id);
CREATE INDEX idx_gap_analysis_report_candidate ON gap_analysis_report(candidate_id);
```

---

## 6. API Endpoints

```typescript
// POST /api/gap-analysis/generate
async function generateGapAnalysis(recruitmentId: string, candidateId: string): Promise<GapAnalysisReport> {
  return await generateGapAnalysis(recruitmentId, candidateId);
}

// GET /api/gap-analysis/:reportId
async function getGapAnalysisReport(reportId: string): Promise<GapAnalysisReport> {
  return await getGapAnalysisReport(reportId);
}

// GET /api/gap-analysis/recruitment/:recruitmentId
async function getGapAnalysisByRecruitment(recruitmentId: string): Promise<GapAnalysisReport> {
  return await getGapAnalysisByRecruitment(recruitmentId);
}

// GET /api/gap-analysis/list
async function listGapAnalysisReports(limit?: number, offset?: number): Promise<GapAnalysisReport[]> {
  return await listGapAnalysisReports(limit, offset);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Rapport

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Rapports générés / entretiens | ≥ 95% |
- Délai de génération | Temps entre fin entretien et rapport | ≤ 5 minutes |

### 7.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de recommandations actionnables | Recommandations actionnables / totales | ≥ 90% |
- Satisfaction des managers | Score moyen / 5 | ≥ 4/5 |

---

## 8. Exemple Complet

```markdown
ANALYSE DES DÉCALAGES
Candidat : [Anonymisé]
Recrutement : REC-2026-001
Date : 2026-08-04

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
  Ce qu'on observe : Toutes les expériences en grand groupe structuré avec processus.
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

Le format de sortie de l'analyse des décalages structure le rapport généré après l'entretien. Format en 3 sections : En-tête (candidat, recrutement, date), Résumé des décalages (type, citation, observation, niveau, interprétation, impact, recommandation), Note globale (auto-présentation, observation réelle, nuance, recommandation onboarding). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Format structuré en 3 sections
- Synthèse des décalages détectés
- Citation exacte vs observation
- Niveau de décalage (Léger/Modéré/Fort)
- Impact pour le poste
- Recommandation concrète
- Note globale avec nuance
- Recommandation d'onboarding
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de rapport et de qualité
