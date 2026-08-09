# DOC-034-08 : Format de Synthèse Inter-Intervenants

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format de synthèse inter-intervenants pour MVP-034 Interview Orchestrator. Ce format structure la présentation des évaluations de plusieurs intervenants, incluant les convergences, divergences, interprétation, et recommandation finale pour faciliter la décision collective.

---

## 2. Principe Fondateur

La synthèse inter-intervenants doit être claire, structurée, et actionnable. Elle doit présenter les évaluations de tous les intervenants de manière cohérente, identifier les convergences et divergences, proposer une interprétation, et formuler une recommandation finale avec le niveau de confiance approprié.

---

## 3. Structure de la Synthèse

### 3.1 En-tête

```
┌─────────────────────────────────────────────────────────────┐
│ SYNTHÈSE INTER-INTERVENANTS                                │
│ Candidat : [Prénom Nom]                                    │
│ Poste : [Intitulé du poste]                                │
│ Date de l'entretien : [Date]                               │
│ Type d'entretien : [Type]                                  │
│ Intervenants : [Liste]                                     │
│ Date de synthèse : [Date/Heure]                           │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Résumé Exécutif

**Score Global :** [X/10]

**Recommandation :** [Recommandé / Refusé / À approfondir]

**Niveau de Confiance :** [X%]

**En 3 phrases :**
- [Phrase 1 : Points forts principaux]
- [Phrase 2 : Points de vigilance principaux]
- [Phrase 3 : Recommandation avec conditions si applicable]

---

### 3.3 Évaluations par Intervenant

**Intervenant 1 — [Nom] — [Rôle]**

**Dimensions évaluées :**
- [Dimension 1] : [Score/5] — [Justification]
- [Dimension 2] : [Score/5] — [Justification]
- [Dimension 3] : [Score/5] — [Justification]

**Score global :** [X/10]

**Notes libres :**
- [Note 1]
- [Note 2]

**Recommandation individuelle :** [Recommandé / Refusé / À approfondir]

---

**Intervenant 2 — [Nom] — [Rôle]**

[Même structure]

---

**Intervenant N — [Nom] — [Rôle]**

[Même structure]

---

### 3.4 Convergences

**Dimensions avec consensus :**

**[Dimension 1]**
- Score moyen : [X/5]
- Convergence : [Description du consensus]
- Intervenants : [Liste]
- Justification commune : [Description]

**[Dimension 2]**
- Score moyen : [X/5]
- Convergence : [Description du consensus]
- Intervenants : [Liste]
- Justification commune : [Description]

**Signaux positifs communs :**
- [Signal 1]
- [Signal 2]

**Signaux de vigilance communs :**
- [Signal 1]
- [Signal 2]

---

### 3.5 Divergences

**Dimensions avec divergence :**

**[Dimension 1]**
- Écart de score : [X points]
- Intervenant A : [Score/5] — [Justification]
- Intervenant B : [Score/5] — [Justification]
- Analyse de la divergence : [Description]
- Recommandation : [Comment résoudre]

**[Dimension 2]**
- Écart de score : [X points]
- Intervenant A : [Score/5] — [Justification]
- Intervenant B : [Score/5] — [Justification]
- Analyse de la divergence : [Description]
- Recommandation : [Comment résoudre]

**Signaux contradictoires :**
- [Signal contradictoire 1]
- [Signal contradictoire 2]

---

### 3.6 Interprétation Globale

**Analyse du profil :**
- [Analyse des points forts]
- [Analyse des points de vigilance]
- [Analyse des zones d'ombre]

**Cohérence inter-intervenants :**
- Taux de convergence : [X%]
- Analyse : [Description]

**Cohérence avec le poste :**
- Adéquation compétences : [Oui / Partiellement / Non]
- Adéquation soft skills : [Oui / Partiellement / Non]
- Adéquation culture : [Oui / Partiellement / Non]

**Cohérence avec les valeurs de l'entreprise :**
- [Description]

---

### 3.7 Recommandation Finale

**Décision :** [Recommandé / Refusé / À approfondir]

**Niveau de confiance :** [X%]

**Justification :**
- [Justification détaillée]

**Conditions (si applicable) :**
- [Condition 1]
- [Condition 2]
- [Condition 3]

**Prochaine étape :**
- [Description de l'action recommandée]

---

### 3.8 Cartographie d'Incertitude

**Dimensions avec incertitude :**

**[Dimension 1]**
- Niveau d'incertitude : [Faible / Moyen / Élevé]
- Source d'incertitude : [Description]
- Comment réduire : [Description]

**[Dimension 2]**
- Niveau d'incertitude : [Faible / Moyen / Élevé]
- Source d'incertitude : [Description]
- Comment réduire : [Description]

---

### 3.9 Points d'Attention

**Pour le round suivant (si applicable) :**
- [Point 1]
- [Point 2]

**Pour l'onboarding (si recommandé) :**
- [Point 1]
- [Point 2]

**Pour le manager (si recommandé) :**
- [Point 1]
- [Point 2]

---

## 4. Exemple Complet de Synthèse

```
┌─────────────────────────────────────────────────────────────┐
│ SYNTHÈSE INTER-INTERVENANTS                                │
│ Candidat : Jean Martin                                     │
│ Poste : Senior Software Engineer                           │
│ Date de l'entretien : 15/08/2026                          │
│ Type d'entretien : Panel                                   │
│ Intervenants : Marie Dupont (RH), Pierre Durand (Manager),  │
│                Sophie Bernard (Expert)                     │
│ Date de synthèse : 15/08/2026 à 16h30                     │
├─────────────────────────────────────────────────────────────┤
│ RÉSUMÉ EXÉCUTIF                                           │
│ Score Global : 7/10                                         │
│ Recommandation : Recommandé avec conditions                │
│ Niveau de Confiance : 75%                                  │
│                                                             │
│ En 3 phrases :                                             │
│ Jean Martin a une expertise technique solide et une         │
│ motivation claire pour le poste. Il y a une divergence     │
│ sur le culture fit : RH voit une cohérence, mais Expert   │
│ identifie un risque de surcharge. Recommandé avec          │
│ conditions de suivi rapproché.                              │
├─────────────────────────────────────────────────────────────┤
│ ÉVALUATIONS PAR INTERVENANT                                │
│                                                             │
│ Marie Dupont — RH                                          │
│ Dimensions évaluées :                                      │
│ • Culture fit : 4/5 — Cohérence avec les valeurs          │
│ • Soft skills : 4/5 — Bonne communication                 │
│ • Motivations : 4/5 — Motivation claire                    │
│ Score global : 8/10                                        │
│ Notes libres :                                             │
│ • Candidat très professionnel                              │
│ • Bonne intelligence relationnelle                          │
│ Recommandation individuelle : Recommandé                    │
│                                                             │
│ Pierre Durand — Manager                                    │
│ Dimensions évaluées :                                      │
│ • Compétences métier : 4/5 — Bonne maîtrise                │
│ • Adéquation équipe : 3/5 — À confirmer                   │
│ • Capacité opérationnelle : 4/5 — Prêt à démarrer          │
│ Score global : 7/10                                        │
│ Notes libres :                                             │
│ • Bon profil technique                                     │
│ • Besoin de valider l'intégration équipe                   │
│ Recommandation individuelle : Recommandé                    │
│                                                             │
│ Sophie Bernard — Expert                                    │
│ Dimensions évaluées :                                      │
│ • Compétences techniques : 5/5 — Expertise solide         │
│ • Profondeur expertise : 4/5 — Bon niveau                  │
│ • Culture fit : 2/5 — Risque de surcharge                 │
│ Score global : 6/10                                        │
│ Notes libres :                                             │
│ • Excellent niveau technique                               │
│ • Tendance à surcharger, risque burn-out                   │
│ Recommandation individuelle : À approfondir                 │
├─────────────────────────────────────────────────────────────┤
│ CONVERGENCES                                               │
│                                                             │
│ Expertise technique                                        │
│ Score moyen : 5/5                                         │
│ Convergence : Tous les intervenants s'accordent sur       │
│                l'expertise technique solide                 │
│ Intervenants : Marie, Pierre, Sophie                       │
│ Justification commune : Le candidat démontre une          │
│                       maîtrise excellente des               │
│                       technologies requises                │
│                                                             │
│ Motivation                                                  │
│ Score moyen : 4/5                                         │
│ Convergence : RH et Manager s'accordent sur la             │
│                motivation claire                           │
│ Intervenants : Marie, Pierre                               │
│ Justification commune : Le candidat exprime une            │
│                       motivation cohérente avec le          │
│                       poste                                 │
│                                                             │
│ Signaux positifs communs :                                 │
│ • Expertise technique solide                                │
│ • Motivation claire                                        │
│                                                             │
│ Signaux de vigilance communs :                             │
│ • Aucun                                                    │
├─────────────────────────────────────────────────────────────┤
│ DIVERGENCES                                                │
│                                                             │
│ Culture fit                                                │
│ Écart de score : 2 points                                  │
│ Marie (RH) : 4/5 — Cohérence avec les valeurs              │
│ Sophie (Expert) : 2/5 — Risque de surcharge                │
│ Analyse de la divergence : RH évalue le fit culturel        │
│                         global, Expert identifie            │
│                         un comportement spécifique           │
│                         de surcharge                       │
│ Recommandation : Clarifier avec le manager le style       │
│                  de travail et les attentes                │
│                                                             │
│ Signaux contradictoires :                                   │
│ • Aucun                                                    │
├─────────────────────────────────────────────────────────────┤
│ INTERPRÉTATION GLOBALE                                     │
│                                                             │
│ Analyse du profil :                                         │
│ Jean Martin a une expertise technique exceptionnelle        │
│ et une motivation claire. Il est prêt opérationnel          │
│ pour le poste. Le point de vigilance principal est         │
│ le risque de surcharge identifié par l'Expert.             │
│                                                             │
│ Cohérence inter-intervenants :                              │
│ Taux de convergence : 75%                                  │
│ Analyse : Convergence forte sur les compétences et         │
│           motivations, divergence sur le culture fit        │
│                                                             │
│ Cohérence avec le poste :                                   │
│ Adéquation compétences : Oui                               │
│ Adéquation soft skills : Oui                               │
│ Adéquation culture : Partiellement                          │
│                                                             │
│ Cohérence avec les valeurs de l'entreprise :               │
│ Cohérence globale avec les valeurs, mais risque            │
│ de comportement de surcharge à surveiller                   │
├─────────────────────────────────────────────────────────────┤
│ RECOMMANDATION FINALE                                       │
│                                                             │
│ Décision : Recommandé avec conditions                      │
│ Niveau de confiance : 75%                                  │
│                                                             │
│ Justification :                                             │
│ Le candidat a les compétences techniques requises          │
│ et une motivation claire. La divergence sur le             │
│ culture fit nécessite des conditions de suivi              │
│ pour s'assurer que le risque de surcharge est              │
│ géré.                                                      │
│                                                             │
│ Conditions :                                               │
│ • Clarifier le style de travail avec le manager             │
│ • Plan de développement du leadership stratégique            │
│ • Suivi rapproché les 6 premiers mois                     │
│                                                             │
│ Prochaine étape :                                          │
│ Proposer une offre avec les conditions ci-dessus            │
├─────────────────────────────────────────────────────────────┤
│ CARTOGRAPHIE D'INCERTITUDE                                 │
│                                                             │
│ Culture fit                                                │
│ Niveau d'incertitude : Moyen                               │
│ Source d'incertitude : Divergence RH / Expert              │
│ Comment réduire : Discussion avec le manager pour          │
│                   clarifier le style de travail              │
│                                                             │
│ Leadership stratégique                                      │
│ Niveau d'incertitude : Faible                              │
│ Source d'incertitude : Non évalué en profondeur            │
│ Comment réduire : Plan de développement                    │
├─────────────────────────────────────────────────────────────┤
│ POINTS D'ATTENTION                                         │
│                                                             │
│ Pour le manager :                                           │
│ • Clarifier le style de travail et les attentes            │
│ • Surveiller le risque de surcharge                         │
│                                                             │
│ Pour l'onboarding :                                        │
│ • Intégration progressive dans l'équipe                     │
│ • Formation sur la gestion de la charge de travail         │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface InterviewerSynthesis {
  synthesisId: string;
  interviewId: string;
  
  header: {
    candidateName: string;
    jobTitle: string;
    interviewDate: Date;
    interviewType: string;
    interviewers: {
      name: string;
      role: string;
    }[];
    synthesisDate: Date;
  };
  
  executiveSummary: {
    score: number;
    recommendation: 'recommended' | 'rejected' | 'to_deepen';
    confidenceLevel: number;
    threeSentences: string[];
  };
  
  interviewerEvaluations: {
    interviewerId: string;
    name: string;
    role: string;
    dimensions: {
      dimension: string;
      score: number;
      justification: string;
    }[];
    globalScore: number;
    notes: string[];
    individualRecommendation: 'recommended' | 'rejected' | 'to_deepen';
  }[];
  
  convergences: {
    dimensions: {
      dimension: string;
      averageScore: number;
      consensus: string;
      interviewers: string[];
      commonJustification: string;
    }[];
    commonPositiveSignals: string[];
    commonVigilanceSignals: string[];
  };
  
  divergences: {
    dimensions: {
      dimension: string;
      scoreGap: number;
      interviewerA: {
        name: string;
        score: number;
        justification: string;
      };
      interviewerB: {
        name: string;
        score: number;
        justification: string;
      };
      analysis: string;
      recommendation: string;
    }[];
    contradictorySignals: string[];
  };
  
  globalInterpretation: {
    profileAnalysis: string[];
    interviewerCohesion: {
      rate: number;
      analysis: string;
    };
    jobCohesion: {
      skills: 'yes' | 'partially' | 'no';
      softSkills: 'yes' | 'partially' | 'no';
      culture: 'yes' | 'partially' | 'no';
    };
    valuesCohesion: string;
  };
  
  finalRecommendation: {
    decision: 'recommended' | 'rejected' | 'to_deepen';
    confidenceLevel: number;
    justification: string;
    conditions?: string[];
    nextStep: string;
  };
  
  uncertaintyMapping: {
    dimensions: {
      dimension: string;
      uncertaintyLevel: 'low' | 'medium' | 'high';
      source: string;
      howToReduce: string;
    }[];
  };
  
  attentionPoints: {
    forNextRound?: string[];
    forOnboarding?: string[];
    forManager?: string[];
  };
  
  metadata: {
    generatedAt: Date;
    generatedBy: string;
    version: string;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE interviewer_synthesis (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  
  header JSON NOT NULL,
  executive_summary JSON NOT NULL,
  interviewer_evaluations JSON NOT NULL,
  convergences JSON NOT NULL,
  divergences JSON NOT NULL,
  global_interpretation JSON NOT NULL,
  final_recommendation JSON NOT NULL,
  uncertainty_mapping JSON NOT NULL,
  attention_points JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview(id)
);

CREATE INDEX idx_interviewer_synthesis_interview ON interviewer_synthesis(interview_id);
CREATE INDEX idx_interviewer_synthesis_recommendation ON interviewer_synthesis((final_recommendation->>'$.decision'));
```

---

## 7. API Endpoints

```typescript
// POST /api/interview/synthesis/generate
async function generateInterviewerSynthesis(interviewId: string): Promise<InterviewerSynthesis> {
  return await generateInterviewerSynthesis(interviewId);
}

// GET /api/interview/synthesis/:synthesisId
async function getInterviewerSynthesis(synthesisId: string): Promise<InterviewerSynthesis> {
  return await getInterviewerSynthesisById(synthesisId);
}

// GET /api/interview/synthesis/interview/:interviewId
async function getInterviewerSynthesisByInterview(interviewId: string): Promise<InterviewerSynthesis> {
  return await getInterviewerSynthesisByInterview(interviewId);
}

// PUT /api/interview/synthesis/:synthesisId
async function updateInterviewerSynthesis(synthesisId: string, synthesis: InterviewerSynthesis): Promise<InterviewerSynthesis> {
  return await updateInterviewerSynthesis(synthesisId, synthesis);
}

// POST /api/interview/synthesis/:synthesisId/finalize
async function finalizeInterviewerSynthesis(synthesisId: string): Promise<InterviewerSynthesis> {
  return await finalizeInterviewerSynthesis(synthesisId);
}

// GET /api/interview/synthesis/:synthesisId/export
async function exportInterviewerSynthesis(synthesisId: string, format: 'pdf' | 'docx'): Promise<string> {
  return await exportInterviewerSynthesis(synthesisId, format);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Synthèses complètes / générées | ≥ 95% |
- Satisfaction décideurs | Note moyenne | ≥ 4.5/5 |
- Utilisation pour décision | Synthèses utilisées / total | ≥ 90% |

### 8.2 Métriques d'Efficacité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Temps de génération | Secondes pour générer la synthèse | ≤ 60 secondes |
- Taux de convergence | Convergences / total dimensions | ≥ 70% |
- Précision de la recommandation | Recommandations correctes / total | ≥ 85% |

---

## 9. Conclusion

Le format de synthèse inter-intervenants structure la présentation des évaluations de plusieurs intervenants de manière claire et actionnable. La synthèse inclut les évaluations individuelles, les convergences, divergences, interprétation globale, recommandation finale, cartographie d'incertitude, et points d'attention.

**Points clés :**
- En-tête avec informations clés
- Résumé exécutif en 3 phrases
- Évaluations détaillées par intervenant
- Convergences identifiées et justifiées
- Divergences analysées avec recommandations
- Interprétation globale du profil
- Recommandation finale avec niveau de confiance
- Cartographie d'incertitude
- Points d'attention pour les prochaines étapes
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'efficacité
